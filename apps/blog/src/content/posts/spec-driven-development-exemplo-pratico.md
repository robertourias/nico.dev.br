---
title: "Spec-Driven Development na prática, com exemplo"
slug: "spec-driven-development-exemplo-pratico"
date: "2026-09-20"
categories: ["dev", "ia"]
status: "published"
featured: false
description: "O que é Spec-Driven Development, como escrever uma spec que serve de contrato e um exemplo completo: da spec de um cupom de desconto até os testes e o código, sem inventar comportamento."
tags: ["spec-driven-development", "testes", "agentes-de-ia", "criterios-de-aceite", "produtividade-dev"]
coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
---

Você pede para um agente de IA "adicionar cupom de desconto ao carrinho". Ele entrega código que compila, os testes que ele mesmo escreveu passam e a demo funciona. Semanas depois, aparece um pedido com total negativo, porque o cupom fixo de R$ 50 foi aplicado num carrinho de R$ 20.

Ninguém errou no código. Faltou dizer, em algum lugar, o que deveria acontecer nesse caso. O agente preencheu o buraco com a suposição mais provável, e a suposição estava errada.

Spec-Driven Development (SDD) é a prática de escrever esse "em algum lugar" **antes** do código, de forma que ele seja o documento mais importante do trabalho.

## O que é Spec-Driven Development

Numa frase: a **spec** (especificação) descreve o comportamento esperado da feature, e o código e os testes são derivados dela, não o contrário.

Isso muda a pergunta que você faz no começo. Em vez de "como eu implemento isso?", a primeira pergunta é "como eu saberia que isso está certo?". A resposta vira critério de aceite, e o critério de aceite vira teste.

Não é waterfall. A spec de uma feature pequena cabe em uma ou duas páginas e leva minutos, não semanas. E não é burocracia por si só: se a spec não é usada para gerar plano, tarefas e testes, ela é só um documento que envelhece.

A ideia ganhou força com agentes de código porque eles têm um ponto fraco previsível: são ótimos em executar e ruins em adivinhar intenção. Ferramentas como o Spec Kit, do GitHub, e o Kiro, da AWS, organizam o trabalho justamente em torno de artefatos de especificação, plano e tarefas antes da implementação.

## O ciclo

![O ciclo do Spec-Driven Development: spec, plano, tarefas, código e testes, com um ciclo de volta à spec quando algo diverge](/images/spec-driven-development-exemplo-pratico-ciclo.svg)

O detalhe que separa SDD de "escrever documentação" é a seta de volta. Quando o teste falha ou surge um caso que ninguém previu, você corrige a **spec** primeiro. Se corrigir só o código, a spec vira ficção e o ciclo perde o sentido.

## Anatomia de uma boa spec

Uma spec útil tem poucas partes, cada uma respondendo a uma pergunta que o implementador (humano ou agente) teria:

| Seção | Pergunta que responde |
|-------|-----------------------|
| Contexto | Por que essa feature existe? |
| Comportamento | O que acontece, em casos concretos? |
| Critérios de aceite | Como verifico que está certo? |
| Contrato | Quais são as entradas, saídas e erros? |
| Fora de escopo | O que **não** faz parte disso? |
| Perguntas em aberto | O que ainda não foi decidido? |

Dois critérios de qualidade valem mais que qualquer template. Cada critério de aceite deve ser **verificável** (dá para escrever um teste que passa ou falha) e **numerado** (dá para apontar "esse teste cobre o CA4"). Sem isso, a spec não conecta com o resto do ciclo.

O formato Dado/Quando/Então (Given/When/Then), vindo do BDD, ajuda a manter o critério concreto:

```
CA1
Dado um carrinho de R$ 200,00 e um cupom de 10%
Quando o cupom é aplicado
Então o desconto é R$ 20,00 e o total é R$ 180,00
```

## Exemplo prático: cupom de desconto

O exemplo é pequeno de propósito. Cabe numa leitura, mas tem os ingredientes de qualquer feature real: regra de negócio, borda, erro e arredondamento.

### Passo 1: a spec

```md
# Spec: cupom de desconto no carrinho

## Contexto
O checkout precisa aceitar um cupom por pedido para reduzir o valor total.

## Regras
- Valores monetários são inteiros em centavos.
- Tipos de cupom: `percent` (1 a 100) e `fixed` (valor em centavos, maior que 0).
- Um cupom pode ter subtotal mínimo e data de expiração, ambos opcionais.
- Um pedido aceita apenas um cupom.

## Critérios de aceite
- CA1: cupom de 10% sobre R$ 200,00 → desconto R$ 20,00, total R$ 180,00.
- CA2: cupom fixo de R$ 30,00 sobre R$ 200,00 → total R$ 170,00.
- CA3: o desconto nunca ultrapassa o subtotal (total mínimo é R$ 0,00).
- CA4: cupom expirado é recusado. No instante exato de `expiresAt`, já conta como expirado.
- CA5: subtotal abaixo do mínimo do cupom é recusado; igual ao mínimo é aceito.
- CA6: desconto percentual é arredondado para baixo, em centavos.
- CA7: cupom com valor fora das faixas é recusado como inválido.

## Contrato
applyCoupon(subtotalCents, coupon, now) →
  { ok: true, discountCents, totalCents }
  | { ok: false, reason: 'INVALID_COUPON' | 'EXPIRED' | 'MIN_SUBTOTAL_NOT_MET' }

## Fora de escopo
- Acumular vários cupons.
- Persistência e uso único por cliente.

## Perguntas em aberto
- (nenhuma)
```

Repare no que a spec já resolveu. O problema do início do post, o total negativo, virou o CA3. A pergunta "o cupom expira no fim do dia ou no instante exato?" virou o CA4, com a resposta escrita. Cada uma dessas decisões teria virado uma suposição do implementador.

A ordem de validação também está definida pelo contrato: cupom inválido, depois expirado, depois subtotal mínimo. Se o requisito mudar, muda aqui.

### Passo 2: plano e tarefas

Com a spec pronta, o plano é curto porque quase tudo já foi decidido:

```md
## Plano
Função pura em `src/checkout/apply-coupon.ts`, sem I/O. Recebe `now` por
parâmetro para os testes não dependerem do relógio.

## Tarefas
1. Definir os tipos `Coupon` e `ApplyCouponResult`.
2. Escrever um teste por critério de aceite (CA1 a CA7) e vê-los falhar.
3. Implementar `applyCoupon` até todos passarem.
4. Integrar no fluxo do carrinho.
```

Note a tarefa 2 antes da 3. Os testes nascem da spec, não da implementação. Isso evita o vício mais comum de testes gerados depois do código: eles apenas confirmam o que o código já faz.

### Passo 3: testes derivados da spec

Cada teste carrega o ID do critério. Se um CA não tem teste, dá para ver de longe:

```ts
// src/checkout/apply-coupon.test.ts
import { describe, expect, it } from 'vitest';
import { applyCoupon, type Coupon } from './apply-coupon';

const now = new Date('2026-09-20T12:00:00Z');
const dezPorCento: Coupon = { code: 'DEZ', type: 'percent', value: 10 };

describe('applyCoupon', () => {
  it('CA1: 10% sobre R$ 200,00 desconta R$ 20,00', () => {
    expect(applyCoupon(20000, dezPorCento, now)).toEqual({
      ok: true,
      discountCents: 2000,
      totalCents: 18000,
    });
  });

  it('CA2: cupom fixo de R$ 30,00 sobre R$ 200,00', () => {
    const cupom: Coupon = { code: 'T30', type: 'fixed', value: 3000 };
    expect(applyCoupon(20000, cupom, now)).toEqual({
      ok: true,
      discountCents: 3000,
      totalCents: 17000,
    });
  });

  it('CA3: o desconto nunca ultrapassa o subtotal', () => {
    const cupom: Coupon = { code: 'T50', type: 'fixed', value: 5000 };
    expect(applyCoupon(2000, cupom, now)).toEqual({
      ok: true,
      discountCents: 2000,
      totalCents: 0,
    });
  });

  it('CA4: cupom expirado no instante exato é recusado', () => {
    const cupom: Coupon = { ...dezPorCento, expiresAt: now };
    expect(applyCoupon(20000, cupom, now)).toEqual({ ok: false, reason: 'EXPIRED' });
  });

  it('CA5: respeita o subtotal mínimo', () => {
    const cupom: Coupon = { ...dezPorCento, minSubtotalCents: 10000 };
    expect(applyCoupon(9999, cupom, now)).toEqual({
      ok: false,
      reason: 'MIN_SUBTOTAL_NOT_MET',
    });
    expect(applyCoupon(10000, cupom, now).ok).toBe(true);
  });

  it('CA6: arredonda o desconto percentual para baixo', () => {
    const cupom: Coupon = { code: 'QUINZE', type: 'percent', value: 15 };
    // 15% de 999 = 149,85 → 149
    expect(applyCoupon(999, cupom, now)).toEqual({
      ok: true,
      discountCents: 149,
      totalCents: 850,
    });
  });

  it('CA7: valores fora das faixas são inválidos', () => {
    const invalidos: Coupon[] = [
      { code: 'A', type: 'percent', value: 0 },
      { code: 'B', type: 'percent', value: 101 },
      { code: 'C', type: 'fixed', value: -5 },
    ];
    for (const cupom of invalidos) {
      expect(applyCoupon(1000, cupom, now)).toEqual({
        ok: false,
        reason: 'INVALID_COUPON',
      });
    }
  });
});
```

Rodando isso agora, tudo falha, porque `applyCoupon` ainda não existe. É o estado certo para começar.

### Passo 4: a implementação

Com o contrato e os testes definidos, a implementação é quase mecânica:

```ts
// src/checkout/apply-coupon.ts
export type Coupon = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotalCents?: number;
  expiresAt?: Date;
};

export type ApplyCouponResult =
  | { ok: true; discountCents: number; totalCents: number }
  | { ok: false; reason: 'INVALID_COUPON' | 'EXPIRED' | 'MIN_SUBTOTAL_NOT_MET' };

function isValidCoupon(coupon: Coupon): boolean {
  if (!Number.isInteger(coupon.value)) return false;
  if (coupon.type === 'percent') return coupon.value >= 1 && coupon.value <= 100;
  return coupon.value > 0;
}

export function applyCoupon(
  subtotalCents: number,
  coupon: Coupon,
  now: Date,
): ApplyCouponResult {
  if (!isValidCoupon(coupon)) return { ok: false, reason: 'INVALID_COUPON' };

  if (coupon.expiresAt && now >= coupon.expiresAt) {
    return { ok: false, reason: 'EXPIRED' };
  }

  if (
    coupon.minSubtotalCents !== undefined &&
    subtotalCents < coupon.minSubtotalCents
  ) {
    return { ok: false, reason: 'MIN_SUBTOTAL_NOT_MET' };
  }

  const rawDiscount =
    coupon.type === 'percent'
      ? Math.floor((subtotalCents * coupon.value) / 100)
      : coupon.value;

  const discountCents = Math.min(rawDiscount, subtotalCents);
  return { ok: true, discountCents, totalCents: subtotalCents - discountCents };
}
```

Cada linha do código aponta para uma linha da spec. O `Math.min` é o CA3, o `Math.floor` é o CA6, o `>=` em `expiresAt` é o CA4. Se alguém perguntar "por que o `>=`?", a resposta está escrita.

### Passo 5: quando o requisito muda

O valor do ciclo aparece aqui. O negócio pede: "cupom de porcentagem precisa ter um teto de desconto, por exemplo no máximo R$ 50".

O reflexo é abrir o código e adicionar um `Math.min`. O caminho SDD é outro:

1. **Atualize a spec.** Novo campo opcional `maxDiscountCents` no cupom, e um novo critério:
   `CA8: cupom de 50% com teto de R$ 50,00 sobre R$ 400,00 → desconto R$ 50,00.`
2. **Escreva o teste do CA8** e veja-o falhar.
3. **Ajuste o código** até passar.

Parece mais passos para uma mudança de uma linha, e é. O que se ganha é que a spec continua verdadeira. Quem chegar daqui a um ano descobre a regra do teto lendo a spec, sem precisar deduzir do código.

## Usando SDD com um agente de IA

Com agentes, SDD tem um ganho extra: a spec vira o **prompt de melhor qualidade** que você consegue dar. Em vez de descrever a feature de memória, você entrega o documento e as instruções ficam curtas:

```
Leia docs/specs/cupom-desconto.md.
Implemente as tarefas 1 a 3 do plano. Não altere o contrato.
Cada critério de aceite deve ter um teste com o ID no nome.
```

O review também muda. Em vez de perguntar "esse código parece certo?", você pergunta "cada CA tem um teste, e cada teste passa por um motivo certo?". É uma verificação concreta, mais fácil de fazer e de delegar.

Para o fluxo completo de organizar specs, contexto e comandos de um projeto inteiro, veja o [scaffold IA-Projetos](/posts/scaffold-ia-projetos-orquestrando-specs-com-agentes).

## Onde SDD dá errado

- **Spec grande demais.** Uma spec de 15 páginas para uma feature simples ninguém lê, e o custo passa a ser maior que o benefício. Uma feature pequena, uma spec curta.
- **Spec descrevendo implementação.** "Usar um `Map` para guardar os cupons" é decisão de plano, não de spec. A spec diz **o quê**, o plano diz **como**.
- **Critério não verificável.** "O checkout deve ser rápido" não vira teste. "O cálculo do total responde em menos de 100 ms para 200 itens" vira.
- **Spec que não volta.** Corrigir bug só no código, sem atualizar a spec, é o caminho mais rápido para a divergência. O ciclo só funciona com a seta de volta.
- **Usar em tudo.** Um ajuste de texto de botão não precisa de spec. O critério prático: se a feature tem regra de negócio ou bordas que alguém poderia interpretar de dois jeitos, vale escrever.

## O que fica

Spec-Driven Development troca uma suposição silenciosa por uma decisão escrita. O custo é pensar no comportamento antes de programar. O retorno é que testes, código e revisão passam a apontar para o mesmo documento.

Para começar amanhã, sem ferramenta nova: na próxima feature com regra de negócio, escreva só os critérios de aceite numerados antes de abrir o editor. Peça para alguém ler e dizer o que faltou. Essa conversa de cinco minutos costuma achar o total negativo antes de ele existir.

## Referências

- GitHub Spec Kit, toolkit de código aberto para Spec-Driven Development: https://github.com/github/spec-kit
- Kiro, IDE da AWS com fluxo orientado a specs: https://kiro.dev
- Cucumber, *Gherkin reference* (formato Given/When/Then): https://cucumber.io/docs/gherkin/reference
- Kent Beck, *Test-Driven Development: By Example* (Addison-Wesley, 2002)
- [Scaffold IA-Projetos: orquestrando specs com agentes](/posts/scaffold-ia-projetos-orquestrando-specs-com-agentes), neste blog
