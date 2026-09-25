# UI Guidelines

> Design system e padrões visuais para todos os apps do monorepo.

## Component Library

- **Biblioteca obrigatória**: `@nico.dev/ui` (`packages/ui/`) — todos os apps devem usar
- **Primitivas de acessibilidade**: Radix UI (Checkbox, Select, Tabs, Avatar, etc.)
- **Referência de padrão**: shadcn/ui — não instalar diretamente nos apps
- **Proibido**: MUI, Chakra, shadcn/ui standalone em `apps/`
- **Extensão**: novas peças de UI vão em `packages/ui/`, nunca nos apps

## Estilização

- **Framework**: Tailwind CSS v4
- **Sem**: CSS Modules, styled-components, emotion
- **Tokens de cor**: sempre via variáveis CSS semânticas (`bg-primary`, `text-foreground`) — nunca hex direto

## Ícones

- **Biblioteca**: Lucide React — sem Heroicons, sem Phosphor

## Estado Global

- **Solução**: Zustand — sem Redux, sem Jotai, sem Context API para estado global

## Formulários

- **Stack**: React Hook Form + Zod — sem Formik

## Data Fetching (cliente)

- **Solução**: TanStack Query — sem SWR, sem fetch hooks manuais

## Renderização

- Server Components por padrão; `'use client'` apenas para interatividade ou browser APIs
- Server Actions para mutações internas — não API routes
- Dados em Server Components sempre que possível — evitar `useEffect` para fetch

## Testes Frontend

- React Testing Library + Vitest — sem Enzyme (Jest nunca foi configurado no frontend)
- MSW para mock de rede
- Playwright para E2E
- Cobertura mínima: componentes 70%, hooks/utils 90%, fluxos P0 (E2E) 100%

## Skills Catalog (`apps/skills`)

- Exceção ao padrão global: sem Zustand, React Hook Form e TanStack Query (app estático, sem mutações nem fetch em runtime). Ver `docs/context/decisions.md`.
- `InstallCommand` vive em `packages/ui` (`@nico.dev/ui`): caixa monoespaçada com prefixo `$`, clicável com o mouse (exceto ao selecionar texto), com o `<code>` focável (`tabIndex=0`, rolagem por teclado) e um `button` como acionador de teclado e leitor de tela (`aria-label` "Copiar comando de instalação", `aria-describedby` no `<code>`, foco visível), "Copiado!" por 2 s anunciado via `role="status"`, comando com rolagem horizontal, fallback de seleção ("Selecione e copie: Ctrl+C") se `navigator.clipboard` faltar ou rejeitar.
- `InstallCommandTabs` (Repositório / Esta skill / Manual) usa o `Tabs` do `@nico.dev/ui` (sobre Radix). Com uma só aba, não renderiza a lista de abas. Traz nota de telemetria (`DISABLE_TELEMETRY=1`), texto fixo que não altera o comando; `note={false}` a remove.
- `useStoredValue` (hook, `localStorage` + `useSyncExternalStore`): a aba escolhida só é gravada quando o usuário troca de aba, nunca ao montar; valor salvo inexistente na página é preservado. Snapshot de servidor `null` (o export estático renderiza a aba padrão e aplica a salva após a hidratação). Stories em `UI/InstallCommand` no Storybook.
- Tema claro/escuro via `prefers-color-scheme` com tokens Nocturne. Layout funcional a partir de 360 px, WCAG 2.1 AA.
- Interface em pt-BR; nomes de skills e comandos ficam como estão.

## Design Tokens

<!-- a definir — paleta de cores e tipografia formal ainda não documentadas -->
