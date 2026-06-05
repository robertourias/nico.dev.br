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

- React Testing Library + Jest — sem Enzyme
- MSW para mock de rede
- Playwright para E2E
- Cobertura mínima: componentes 70%, hooks/utils 90%, fluxos P0 (E2E) 100%

## Design Tokens

<!-- a definir — paleta de cores e tipografia formal ainda não documentadas -->
