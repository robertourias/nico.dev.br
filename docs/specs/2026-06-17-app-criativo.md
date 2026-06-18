# Spec & Plan: App Criativo — Landing Pages e Portfólio

**Status:** approved (implementado)
**Data:** 2026-06-17
**Autor:** agente (planner/frontend)

---

## 1. Problema e Visão Geral

Faltava um app no monorepo dedicado a landing pages de campanhas e estruturas de portfólio, com stylesheet e componentes independentes por página — sem acoplar a identidade visual de uma campanha ao restante do site. Criado `apps/criativo` (Next.js App Router, porta 3005), com home em grid listando as páginas criadas e a primeira landing implementada.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero entender a proposta da newsletter e assinar com meu e-mail, para receber curadoria de IA/tecnologia/produtividade.
- **P1 (crítico):** Como Beto, quero uma home com grid de todas as páginas criadas (campanhas e portfólio), para navegar entre elas.
- **P2 (importante):** Como Beto, quero que cada landing tenha tema visual próprio (CSS escopado), para campanhas futuras não conflitarem entre si.

---

## 3. Requisitos Funcionais

- **FR-001:** Home (`/`) renderiza grid de cards a partir de listas `campanhas` e `portfolio`; itens sem página ainda mostram badge "Em breve".
- **FR-002:** `/landing-newsletter-premium` captura e-mail via Server Action (`subscribeToNewsletter`), validação Zod, sem integração real de ESP nesta versão (mock em memória).
- **FR-003:** Formulário de assinatura aparece duas vezes na página (Hero e CTA final) sem duplicar `id`s no DOM (via `useId()`).
- **FR-004:** Landing não exibe lead magnet/isca — copy vende o valor intrínseco do conteúdo.
- **FR-005:** Tema da landing (`theme-newsletter-premium`) é escopado por classe em `theme.css` próprio, não altera `globals.css` do app.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** Integração real com ESP (Resend/ConvertKit/Beehiiv); persistência real de e-mails; testes automatizados; segunda página de portfólio (placeholder "Em breve" criado, sem conteúdo).
- **Premissa:** Próxima iteração troca o mock em `_actions/subscribe.ts` por um provider real, mantendo a assinatura `subscribeToNewsletter(input): Promise<SubscribeResult>`.
- **Risco:** Mock em memória perde assinantes a cada reinício do servidor → Mitigação: nenhuma necessária nesta fase (uso é apenas demonstrativo); documentado em comentário no código.

---

## 5. Contratos de API

Sem API routes — mutação via Server Action:

- `subscribeToNewsletter(input: { email: string }): Promise<{ status: "success" } | { status: "error"; message: string }>`

---

## 6. Plano de Implementação (Tarefas) — Executado

| Onda | Tarefas | Pré-requisito |
|------|---------|----------------|
| 1 | Scaffold do app (config, tsconfig, eslint, postcss) | — |
| 2 | Layout raiz, tema global, header/footer do site | Onda 1 |
| 3 | Home (grid de páginas) | Onda 2 |
| 4 | Landing `/landing-newsletter-premium` (componentes, Server Action, tema escopado) | Onda 2 |
| 5 | Plumbing de monorepo (`.env.example`, `turbo.json`) | Onda 1 |
| 6 | Documentação (este spec + `decisions.md`) | Onda 4, 5 |

Todas as tarefas concluídas nesta sessão. Pendente: verificação de build/typecheck (`pnpm install` + `next build` em `apps/criativo`).

---

## Decisões registradas

- Captura de e-mail: mock funcional com Zod, sem ESP real (aprovado pelo usuário).
- Sem lead magnet: copy foca na proposta de valor da newsletter (aprovado pelo usuário).
- Cada landing page tem `theme.css` próprio, escopado por classe wrapper — não usa `:root` nem `globals.css` do app.
- Landing pages renderizam fora do route group `(site)`, sem header/footer/nav do app, para maximizar foco em conversão.
