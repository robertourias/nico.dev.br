---
title: "MFA com TOTP em Next.js e NestJS num Turborepo"
slug: "mfa-totp-nextjs-nestjs-turborepo"
date: "2026-09-20"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Como funciona a autenticação em dois fatores por TOTP e como implementar de ponta a ponta: enrolamento com QR code, login em duas etapas, códigos de recuperação e o que não esquecer, num monorepo Turborepo com Next.js e NestJS."
tags: ["mfa", "totp", "nestjs", "nextjs", "turborepo"]
coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80"
---

Senha vaza. Não é pessimismo, é premissa de projeto: reutilizada, phishada ou exposta num vazamento de terceiros, ela deixa de ser segredo. MFA existe pra que a senha sozinha não abra a porta.

Este post mostra como implementar MFA por **TOTP** (o código de 6 dígitos do Google Authenticator, Authy, 1Password e afins) num monorepo Turborepo com um app Next.js e uma API NestJS. O foco é o desenho do fluxo e as decisões que costumam ser esquecidas. O código é ilustrativo: adapte ao seu modelo de usuário e à sua estratégia de sessão.

## Como o TOTP funciona

TOTP (Time-based One-Time Password, RFC 6238) parte de um **segredo compartilhado** entre o servidor e o app autenticador. Os dois calculam o mesmo código a partir de dois ingredientes: o segredo e o tempo atual, dividido em janelas (por padrão, 30 segundos).

Não há comunicação entre o celular e o servidor no momento do login. Por isso funciona offline, e por isso o segredo é o ativo crítico: quem o tem gera códigos válidos pra sempre.

Isso define o modelo de ameaça. TOTP protege contra senha vazada. Não protege contra phishing em tempo real (o atacante repassa o código na hora) — pra isso existem passkeys/WebAuthn, que ficam de fora deste post.

## A estrutura do monorepo

```
apps/
  web/        → Next.js: telas de login, enrolamento e verificação
  api/        → NestJS: auth, MFA, guards
packages/
  types/      → schemas e tipos compartilhados (login, verify, enroll)
```

O ganho do monorepo aqui é pequeno mas real: os contratos das requisições ficam em `packages/types`, e o Next e o Nest importam a mesma definição. Se o formato do código de verificação mudar, o compilador avisa nos dois lados.

```ts
// packages/types/src/mfa.ts
import { z } from 'zod';

export const mfaCodeSchema = z.string().regex(/^\d{6}$/, 'Código de 6 dígitos');

export const mfaVerifySchema = z.object({
  mfaToken: z.string().min(1),
  code: mfaCodeSchema,
});

export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;
```

No `turbo.json`, o único cuidado é a ordem de build: `packages/types` precisa compilar antes dos apps. Um `dependsOn: ["^build"]` na task `build` resolve.

## O fluxo em duas etapas

O erro mais comum em MFA é emitir a sessão completa depois da senha e "checar o MFA depois" no front. Isso não é MFA, é enfeite. A sessão só pode existir **depois** do segundo fator.

O desenho correto usa um token intermediário, de vida curta e escopo restrito, que só serve pra completar o segundo passo:

![Fluxo de login com MFA: senha, mfaToken de escopo restrito, código TOTP e emissão da sessão](/images/mfa-totp-nextjs-nestjs-turborepo-fluxo.svg)

O `mfaToken` é um JWT com `scope: 'mfa'` e expiração curta. Os guards da API rejeitam esse token em qualquer rota que não seja a de verificação. Sem isso, um token parcial vira um token completo por descuido.

## Backend: enrolamento

Ativar MFA é um processo de duas fases: gerar o segredo e só marcá-lo como ativo depois que o usuário provar que consegue gerar um código válido. Se ativar direto, um usuário que escaneou errado o QR code fica trancado fora da conta.

Pro TOTP em si, uso a biblioteca [otplib](https://github.com/yeojz/otplib). Ela gera o segredo, monta a URI `otpauth://` e verifica o código com tolerância de relógio.

```ts
// apps/api/src/mfa/mfa.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OTP } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
  private readonly otp = new OTP();

  constructor(
    private readonly users: UsersRepository,
    private readonly crypto: SecretCipher,
  ) {}

  async beginEnrollment(userId: string, email: string) {
    const secret = this.otp.generateSecret();

    // guarda cifrado e ainda inativo
    await this.users.saveMfaSecret(userId, this.crypto.encrypt(secret), {
      enabled: false,
    });

    const uri = this.otp.generateURI({
      issuer: 'MeuApp',
      label: email,
      secret,
    });

    return { qrCodeDataUrl: await QRCode.toDataURL(uri) };
  }

  async confirmEnrollment(userId: string, code: string) {
    const secret = await this.loadSecret(userId);
    const result = await this.otp.verify({ secret, token: code, epochTolerance: 30 });

    if (!result.valid) throw new UnauthorizedException('Código inválido');

    await this.users.enableMfa(userId);
    return { recoveryCodes: await this.issueRecoveryCodes(userId) };
  }

  private async loadSecret(userId: string) {
    return this.crypto.decrypt(await this.users.getMfaSecret(userId));
  }
}
```

Três decisões aqui merecem justificativa.

**O segredo é cifrado em repouso.** Guardar o segredo TOTP em texto puro é equivalente a guardar a senha em texto puro: um dump do banco entrega o segundo fator de todo mundo. Use cifra autenticada (AES-256-GCM, por exemplo) com a chave fora do banco.

**`epochTolerance: 30`.** Relógios de celular e servidor divergem um pouco. Aceitar uma janela de ±30 segundos evita falsos negativos sem abrir demais a porta. Tolerâncias maiores aumentam a janela de ataque.

**O QR code é gerado no servidor, uma vez.** O segredo só sai da API nessa resposta, dentro da imagem. Não logue essa resposta.

## Backend: verificação no login

```ts
// apps/api/src/auth/auth.service.ts (trecho)
async login(email: string, password: string) {
  const user = await this.users.validateCredentials(email, password);

  if (!user.mfaEnabled) {
    return this.issueSession(user);
  }

  const mfaToken = await this.jwt.signAsync(
    { sub: user.id, scope: 'mfa' },
    { expiresIn: '5m' },
  );
  return { mfaRequired: true, mfaToken };
}

async verifyMfa(mfaToken: string, code: string) {
  const payload = await this.jwt.verifyAsync(mfaToken);
  if (payload.scope !== 'mfa') throw new UnauthorizedException();

  await this.mfa.assertValidCode(payload.sub, code);
  return this.issueSession(await this.users.findById(payload.sub));
}
```

Dois pontos que o exemplo simplifica e que você não deve pular em produção:

- **Rate limiting.** Um código de 6 dígitos tem um milhão de combinações. Sem limite de tentativas, dá pra forçar. Aplique `@nestjs/throttler` (ou equivalente) na rota de verificação e bloqueie temporariamente após N erros por usuário, não só por IP.
- **Proteção contra replay.** Um código válido continua válido durante toda a janela. Guarde o último passo de tempo aceito por usuário e rejeite um código do mesmo passo ou anterior. Sem isso, um código interceptado pode ser reutilizado dentro dos ~30 segundos.

## Códigos de recuperação

Celular perdido não pode significar conta perdida. Ao confirmar o enrolamento, gere um conjunto de códigos de uso único (8 a 10, aleatórios, com boa entropia) e mostre **uma vez**.

No banco, guarde só o hash de cada um, como faria com senha. Ao usar um, marque como consumido. É o único caminho de volta sem intervenção de suporte, então trate-o com o mesmo rigor da senha.

## Frontend: Next.js

No lado do Next, o objetivo é que os tokens nunca toquem o JavaScript do navegador. Route Handlers falam com a API e gravam cookies `httpOnly`.

```ts
// apps/web/app/api/auth/mfa/verify/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mfaVerifySchema } from '@repo/types';

export async function POST(req: Request) {
  const parsed = mfaVerifySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const res = await fetch(`${process.env.API_URL}/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 401 });
  }

  const { accessToken } = await res.json();
  (await cookies()).set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
```

A tela de verificação é um formulário de um campo: `inputMode="numeric"`, `autoComplete="one-time-code"` (o que permite ao navegador e ao teclado do celular sugerir o código) e envio automático ao completar seis dígitos. São detalhes pequenos que fazem a diferença na fricção.

O `mfaToken` intermediário pode ficar em memória de página ou num cookie de vida curta; ele sozinho não dá acesso a nada.

## O que costuma ficar de fora

Uma lista do que vejo esquecido em implementações de MFA:

- **Desativar MFA exige reautenticação.** Se basta estar logado, uma sessão sequestrada remove o segundo fator.
- **Trocar a senha ou o e-mail** deve revogar sessões e pedir o código de novo.
- **Auditoria.** Registre ativação, desativação, uso de código de recuperação e falhas repetidas. É o que você vai querer ler depois de um incidente.
- **Testes.** Gere o código no teste com a mesma biblioteca e o segredo do usuário de teste, e cubra os caminhos de erro: código expirado, código reutilizado, token com escopo errado.
- **Considere não construir.** Provedores como Keycloak, Auth0 ou Clerk entregam MFA pronto, com recuperação e auditoria. Implementar por conta própria faz sentido quando você precisa de controle total ou já tem um sistema de auth próprio — não como padrão.

## O que fica

MFA por TOTP é pouco código e muitas decisões. A parte de gerar e validar o código é a mais simples; o que dá segurança de verdade está ao redor: sessão só depois do segundo fator, segredo cifrado, limite de tentativas, proteção contra replay e um caminho de recuperação seguro.

No monorepo, o que muda é o compartilhamento de contratos: um pacote de tipos garante que Next e Nest concordem sobre o formato do que trafega, e isso reduz uma classe inteira de bugs de integração.

Se o requisito é resistência a phishing, o próximo passo é WebAuthn/passkeys. TOTP resolve o problema de senha vazada, e resolve bem.

## Referências

- RFC 6238 — *TOTP: Time-Based One-Time Password Algorithm* (IETF).
- Documentação da biblioteca otplib — geração de segredo, URI `otpauth://` e verificação com `epochTolerance`.
- Documentação do NestJS — Guards e `@nestjs/throttler`.
- Documentação do Next.js — Route Handlers e `cookies()`.
- Neste blog: [Arquitetura SaaS com Next.js e NestJS](/posts/arquitetura-saas-nextjs-nestjs-guia-completo) e [Keycloak, React e microsserviços com Module Federation](/posts/keycloak-react-microsservicos-module-federation).
