# nico.dev.br

Monorepo do portfólio e ferramentas de **nico.dev.br**, gerenciado com **pnpm workspaces** e **Turborepo**.

## Stack principal

| Camada       | Tecnologia                             |
| ------------ | -------------------------------------- |
| Runtime      | Node ≥ 20                              |
| Package mgr  | pnpm 9                                 |
| Monorepo     | Turborepo                              |
| Framework    | Next.js 16 · React 19                  |
| Estilo       | Tailwind CSS 4                         |
| UI           | Radix UI · CVA · Framer Motion         |
| Linguagem    | TypeScript 5                           |
| CI           | GitHub Actions (lint + build)          |

## Estrutura

```
├── apps/
│   ├── web-nico.dev.br   # Site principal (Next.js)         :3000
│   ├── tools             # Ferramentas internas (Next.js)   :3001
│   ├── challenges        # Desafios de frontend (Next.js)   :3002
│   └── storybook         # Catálogo de componentes          :6006
│
├── packages/
│   ├── ui                # Design system (@nico.dev/ui)
│   └── config            # Configs compartilhadas (eslint, tsconfig, postcss)
│
└── docs/                 # Documentação do projeto (specs, arquitetura, etc.)
```

## Início rápido

```bash
# 1. Instalar dependências
pnpm install

# 2. Subir todos os apps em dev
pnpm dev

# 3. Ou subir um app específico
pnpm dev --filter @nico.dev/web-nico.dev.br
pnpm dev --filter @nico.dev/tools
pnpm dev --filter @nico.dev/challenges
pnpm dev --filter @nico.dev/storybook
```

## Comandos úteis

| Comando          | Descrição                          |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Inicia todos os apps em modo dev   |
| `pnpm build`     | Build de produção (via Turborepo)  |
| `pnpm lint`      | Lint em todos os workspaces        |

## Packages internos

- **`@nico.dev/ui`** — Design system com componentes acessíveis (Radix), variantes (CVA) e design tokens sincronizados via Pencil.
- **`@nico.dev/config`** — Configurações compartilhadas de ESLint, TypeScript e PostCSS.

## Documentação

A pasta [`docs/`](./docs) contém toda a documentação do projeto:

| Diretório | Conteúdo |
| --------- | -------- |
| [`architecture/`](./docs/architecture) | Visão geral, frontend, backend e infraestrutura |
| [`context/`](./docs/context) | Estado atual, decisões técnicas, convenções, produto e guidelines de UI |
| [`specs/`](./docs/specs) | Specs de funcionalidades implementadas (template incluso) |
| [`changelog/`](./docs/changelog) | Histórico de releases e mudanças |


