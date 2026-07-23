# Frontend Architecture

> Detalhe aqui as decisões específicas de arquitetura do frontend.
> [INFERIDO — confirmar: gerado por análise retroativa do código em 2026-07-22]

## Apps Next.js (App Router)

Todos na versão `next@16.2.6`, `react@19.2.4`, `tailwindcss@^4`, `@nico.dev/ui` como dependência (via `packages/config` para ESLint/TS/Tailwind compartilhados).

| App | Porta dev | Stack extra observada |
|-----|-----------|------------------------|
| `apps/web-nico.dev.br` | 3000 | `next-intl` (i18n pt/en/es), `react-hook-form` + `zod` + `@hookform/resolvers`, `embla-carousel`, `resend` (contato), `@anthropic-ai/sdk` (chat IA), `@vercel/analytics` + `@vercel/speed-insights` |
| `apps/tools` | 3001 | `@anthropic-ai/sdk`, `@google/genai`, `recharts`, `react-syntax-highlighter` — ferramentas com IA/dados |
| `apps/challenges` | 3002 | Sem libs extras além de `lucide-react` |
| `apps/metronome` | 3003 | Sem libs extras — puro Next + Web Audio API (nativo do browser) |
| `apps/criativo` | 3005 | `react-hook-form` + `zod`, `lucide-react` |

`apps/blog` roda Astro, não Next.js — documentado separadamente em `apps/blog/docs/`.

> Nota: `docs/architecture/overview.md` lista a estrutura como `apps/web/` — o diretório real é `apps/web-nico.dev.br/`. `apps/criativo/` existe no código mas não está listado no overview. Não corrigido aqui (fora do escopo deste gap-fill, que não sobrescreve arquivos já preenchidos) — sinalizado em `docs/context/current-state.md`.

## `packages/ui` (@nico.dev/ui)

Biblioteca de componentes compartilhada — uso obrigatório em todo app `apps/*` (regra registrada em `docs/context/product.md`).

**Base**: Radix UI primitives (`avatar`, `checkbox`, `label`, `radio-group`, `select`, `switch`, `tabs`, `slot`) + `class-variance-authority` + `tailwind-merge` + `clsx` — padrão shadcn-like, sem depender do CLI shadcn.
**Extras**: `framer-motion` (animação), `date-fns` + `react-day-picker` (calendário/date-picker), `lucide-react` (ícones).

### Componentes (`src/components/`)
`alert`, `avatar`, `badge`, `button`, `calendar`, `card`, `checkbox`, `date-picker`, `form-group`, `header`, `heatmap`, `input`, `item-card`, `label`, `nav-link`, `radio`, `select`, `skeleton`, `switch`, `tabs`, `textarea`, `theme-toggle`, `toggle-filter`.

### Hooks (`src/hooks/`)
`use-wake-lock`.

### Design tokens (`src/tokens/`)
`colors.ts`, `radius.ts`, `spacing.ts`, `typography.ts`, `motion.ts` — exportados via `@nico.dev/ui/tokens` e `@nico.dev/ui/tokens.css`. Valores reais devem ser conferidos em `docs/context/ui-guidelines.md` (já preenchido, não duplicado aqui).

### Storybook
`apps/storybook` documenta os componentes de `packages/ui` (Storybook 8, Vite, addon a11y). Único app do monorepo que não roda em Next.js.

## Constraints conhecidos

- `apps/web-nico.dev.br` é o único app com i18n (`next-intl`) — os demais são pt-BR fixo.
- Dois apps (`web-nico.dev.br`, `tools`) integram IA diretamente via SDK (`@anthropic-ai/sdk`, `@google/genai`) no próprio app Next.js — sem backend intermediário próprio para essas chamadas hoje.
