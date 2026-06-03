# Visão Arquitetural

> Atualize sempre que uma decisão arquitetural significativa for tomada.

## Sistema

**Produto**: Nico.dev
**Propósito**: Site pessoal e portfólio profissional organizado como monorepo Turborepo, com site principal e subprojetos independentes com deploy em subdomínios separados.
**Status**: Early development (MVP)

## Stack

| Camada | Tecnologia | Notas |
|--------|-----------|-------|
| Monorepo | Turborepo | Builds incrementais, pacotes compartilhados |
| Package Manager | pnpm 9.15.0 | Workspaces |
| Frontend | Next.js (App Router) | SSR/RSC, versão 16.2.1 |
| Linguagem | TypeScript ^5 | Strict mode |
| Estilização | Tailwind CSS ^4 | Sem CSS Modules |
| UI Components | @nico.dev/ui | packages/ui/ — obrigatório em todos os apps |
| Backend | NestJS | Usado nos subprojetos que exigem API |
| ORM | Prisma (MVPs) / Drizzle (perf) | Prisma para agilidade, Drizzle para projetos maduros |
| Banco | PostgreSQL | |
| Auth | NextAuth / Auth.js | |
| Cache | Redis | |
| Fila | Nenhuma por enquanto | |
| Hosting | Vercel + Railway | Frontend: Vercel, Backend+DB: Railway |
| CI/CD | GitHub Actions | |
| Node.js | >=20 | |

## Fluxo de dados

```
User → Next.js (SSR/RSC) → NestJS API → PostgreSQL
                         ↘ Redis (cache)
```

Subprojetos com subdomínio seguem o mesmo padrão de forma independente.

## Estrutura do monorepo

```
apps/
  web/          → Next.js frontend (App Router) — site principal nico.dev
  api/          → NestJS backend (quando necessário)
  tools/        → tools.nico.dev — ferramentas web para devs
  challenges/   → challenges.nico.dev — portfólio de desafios técnicos
  metronome/    → metronome.nico.dev — metrônomo online audiovisual para músicos
  blog/         → blog.nico.dev.br — blog estático com Astro (Markdown, SEO, social share)
  storybook/    → Storybook do design system
  [subproject]/ → Aplicações independentes com deploy em subdomínio
packages/
  ui/           → Biblioteca de componentes compartilhada (@nico.dev/ui)
  config/       → ESLint, TypeScript, Tailwind configs compartilhados
  types/        → Tipos TypeScript compartilhados
  utils/        → Funções utilitárias compartilhadas
```

## Bounded Contexts

- **Portfolio**: Gerencia projetos exibidos no portfólio e links para subprojetos
- **Blog**: Artigos técnicos (planejado)
- **Contact**: Formulário de contato
- **Subprojects**: Cada subprojeto é um contexto isolado no monorepo
- **Metronome**: App puramente frontend — Web Audio API para som, animações CSS/React para visual. Sem backend, sem banco, sem auth.
- **Blog**: Site estático Astro — posts como arquivos `.md` no repositório, sem banco, sem auth, sem backend. Deploy contínuo via Vercel integração GitHub. Checagem de conteúdo ofensivo no pipeline antes do merge.

## Modelo de domínio (site principal)

```
Project ──── Tag
   │
   └──── SubprojectLink (aponta para subdomínio)

BlogPost ──── Tag
```

- **Project**: Trabalho ou projeto exibido no portfólio, com descrição, tecnologias e links
- **SubprojectLink**: Referência a uma aplicação independente hospedada em subdomínio
- **BlogPost**: Artigo técnico em Markdown — tem slug, título, categoria, tags, status (publicado/arquivado) e data

## Decisões registradas

| Decisão | Escolha | Data | Justificativa |
|---------|---------|------|---------------|
| Monorepo | Turborepo | 2026-05 | Fast incremental builds, shared packages entre site e subprojetos |
| Backend | NestJS | 2026-05 | DI, modular, TypeScript-first |
| Frontend | Next.js | 2026-05 | SSR, RSC, edge-ready |
| Arquitetura | Clean Architecture | 2026-05 | Testable, maintainable business logic |
| ORM | Prisma (MVPs) + Drizzle (perf) | 2026-05 | Pragmatismo: Prisma para agilidade, Drizzle para performance em projetos maduros |
| Deploy | Subdomínios por subprojeto | 2026-05 | Isolamento de deploy, cada app independente |
| UI | @nico.dev/ui obrigatório | 2026-05 | Consistência visual entre todos os apps do monorepo |
| Metronome | Pure frontend (Next.js + Web Audio API) | 2026-05 | Sem backend/DB/auth — app stateless de tempo real |
| Blog | Astro (static build) + Markdown | 2026-06 | Build estático, SEO nativo, posts como arquivos .md no repo, zero backend |
| Blog deploy | Vercel + GitHub integration | 2026-06 | Push → deploy automático, sem CI/CD customizado |
| Docs | Migração .ai-core/ → docs/ | 2026-05-23 | Novo padrão com skills separadas, changelog por data, commands agnósticos |
| Docs | Modelo distribuído de docs | 2026-05-28 | Cada app/package tem docs/ próprio; root docs/ mantém apenas contexto global |

## Constraints conhecidos

- Subprojetos são independentes: compartilham packages mas têm deploys e ciclos de vida separados
- Dois ORMs no monorepo exigem atenção para não misturar padrões entre projetos
- `apps/web` ainda não migrado para `@nico.dev/ui` (pendente)
