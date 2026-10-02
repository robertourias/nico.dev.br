# Spec & Plan: Landing — Desafio 30 Dias de Hábitos

**Status:** approved (implementado)
**Data:** 2026-06-17
**Autor:** agente (planner/frontend)

---

## 1. Problema e Visão Geral

Segunda landing page de campanha do app `criativo`, em `/desafio-30-dias-habitos`. Captura leads (nome + e-mail) para um desafio gratuito de 30 dias com acompanhamento diário por e-mail, voltado a desenvolvimento pessoal, produtividade, saúde e disciplina. Estética própria — branco predominante, azul escuro e verde de crescimento — independente do tema das demais páginas do app.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero entender a proposta do desafio e me inscrever com nome e e-mail, para começar a receber os desafios diários.
- **P1 (crítico):** Como visitante em mobile, quero um CTA sempre visível, para me inscrever sem precisar rolar até o formulário.
- **P2 (importante):** Como Beto, quero múltiplos pontos de captura (Hero + CTA final) e prova social (depoimentos), para maximizar conversão.

---

## 3. Requisitos Funcionais

- **FR-001:** `/desafio-30-dias-habitos` captura nome, e-mail e consentimento LGPD via Server Action (`subscribeToChallenge`), validação Zod, mock em memória (sem ESP real nesta versão).
- **FR-002:** Formulário (`ChallengeForm`) aparece duas vezes na página (Hero e CTA final) sem duplicar `id`s no DOM (via `useId()`), com rótulo de botão configurável por instância ("Começar Meu Desafio" / "Participar Gratuitamente").
- **FR-003:** Consentimento é obrigatório (`checkbox` + `.refine()`), com texto exato: "Concordo em receber comunicações relacionadas ao desafio."
- **FR-004:** Página inclui: Hero, Como Funciona (3 passos), O Que Você Vai Desenvolver (6 cards), Exemplos de Desafios (6 cards), Benefícios do Programa (lista), Depoimentos (3, fictícios), Garantia, CTA Final.
- **FR-005:** CTA fixo em mobile (`StickyMobileCta`, `lg:hidden`) aponta para `#inscricao` (âncora na seção CTA Final); scroll suave herdado do global `scroll-behavior: smooth` (`packages/ui/tokens.css`), sem JS adicional.
- **FR-006:** Tema (`theme-habitos30`) escopado por classe wrapper em `theme.css` próprio, sobrescrevendo o conjunto completo de tokens — fixo em modo claro, independente do `.dark` do app.
- **FR-007:** Animações de entrada (`cv-fade-up*`) via CSS puro (`@keyframes`), com fallback `prefers-reduced-motion: reduce`.
- **FR-008:** Home (`/`) lista a campanha no grid (`campanhas`), com card ativo linkando para a página.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** Integração real com ESP (Mailchimp, ConvertKit, Brevo, ActiveCampaign ou API própria); contador de participantes com dado real; comunidade de participantes (mencionada como benefício, sem implementação).
- **Premissa:** Próxima iteração troca o mock em `_actions/subscribe.ts` por um provider real, mantendo a assinatura `subscribeToChallenge(input): Promise<SubscribeResult>` — chave de API deve vir de variável de ambiente, nunca hardcoded.
- **Risco:** Depoimentos são fictícios (placeholder), solicitados explicitamente pelo usuário. Mitigação: atribuição genérica ("— Participante do Desafio"), sem nomes/fotos inventados, para evitar conteúdo enganoso; substituir por depoimentos reais quando disponíveis.
- **Risco:** Mock em memória perde inscrições a cada reinício do servidor → aceitável nesta fase (uso demonstrativo), documentado em comentário no código.

---

## 5. Contratos de API

Sem API routes — mutação via Server Action:

- `subscribeToChallenge(input: { name: string; email: string; consent: boolean }): Promise<{ status: "success" } | { status: "error"; message: string }>`

---

## 6. Plano de Implementação (Tarefas) — Executado

| Onda | Tarefas | Pré-requisito |
|------|---------|----------------|
| 1 | Tema escopado (`theme-habitos30`) + Server Action (`subscribeToChallenge`) | — |
| 2 | `ChallengeForm` (RHF + Zod, `useId()`, reuso em duas seções) | Onda 1 |
| 3 | Seções da landing (Header, Hero, Como Funciona, Áreas de Desenvolvimento, Exemplos, Benefícios, Depoimentos, Garantia, CTA Final, CTA fixo mobile, Footer) | Onda 2 |
| 4 | Composição de `page.tsx` com metadata de SEO | Onda 3 |
| 5 | Card na home (`(site)/page.tsx`) | Onda 4 |
| 6 | Documentação (este spec + `decisions.md`) | Onda 5 |

Todas as tarefas concluídas nesta sessão. Pendente: verificação de build/typecheck (`pnpm install` + `next build` em `apps/criativo`) — sandbox não permite escrita no diretório montado (ver `decisions.md`).

---

## Decisões registradas

- Captura de lead: mock funcional com Zod (nome, e-mail, consentimento LGPD), sem ESP real — mesmo padrão de `landing-newsletter-premium`.
- Depoimentos e contador de participantes são conteúdo fictício solicitado explicitamente; depoimentos com atribuição genérica para evitar identidades fabricadas.
- Âncora `#inscricao` fica na seção CTA Final (não no Hero) — ponto de captura mais relevante após o visitante já ter lido a proposta completa.
- Tema próprio (`theme-habitos30`) fixo em modo claro, escopado por classe wrapper, independente do `.dark` do app — mesmo padrão de escopo de tema de `landing-newsletter-premium`.
