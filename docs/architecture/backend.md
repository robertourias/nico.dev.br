# Backend Architecture

> Detalhe aqui as decisões específicas de arquitetura do servidor.

`apps/api` é o único backend do monorepo hoje. [INFERIDO — confirmar: preenchido por análise retroativa do código em 2026-07-22, não por registro incremental durante a implementação]

## Módulos NestJS

| Módulo | Responsabilidade |
|--------|-----------------|
| `AppModule` | Composition root — importa Config, Logger (pino), Prisma, Redis, Claps |
| `PrismaModule` (`infra/prisma`) | Provider do `PrismaService` (client do Postgres) |
| `RedisModule` (`infra/redis`) | Provider do `RedisService` (ioredis) — cache/rate limit |
| `ClapsModule` (`modules/claps`) | Único módulo de domínio hoje — contador de claps do blog |

Cross-cutting em `common/`: `guards/internal-secret.guard.ts` (auth via header `X-Internal-Secret`), `guards/rate-limit.guard.ts`, `filters/http-exception.filter.ts`, `exceptions/app.exception.ts`.

## Domain Entities

| Entidade | Descrição |
|----------|-----------|
| `Clap` (Prisma model, tabela `claps`) | Ledger durável de claps — 1 row por `(slug, uid)`. `count` capado por `MAX_CLAPS_PER_USER` em `claps.service.ts`. PK composta `[slug, uid]`, index em `slug`. |

## API Endpoints mapeados

Prefixo global: `/api/v1`. Todas as rotas de `ClapsController` exigem `InternalSecretGuard` + `RateLimitGuard`. Swagger em `/api/v1/docs`.

| Método | Path | Use Case |
|--------|------|----------|
| GET | /api/v1/claps | Totais agregados por slug (bulk, sem dado de visitante) — usado na listagem do blog |
| GET | /api/v1/claps/:slug | Total agregado + claps do visitante (`uid`) de um post |
| POST | /api/v1/claps/:slug | Incrementa claps do visitante (capado em 50) |

## Observabilidade & Segurança

- Logging estruturado via `nestjs-pino`; redact explícito de `x-internal-secret` e `authorization` nos logs.
- `helmet()` global.
- `ValidationPipe` global com `{ whitelist, forbidNonWhitelisted, transform }` — já documentado como padrão em `docs/skills/backend.md`, confirmado em uso real aqui.

## Hosting

VPS própria (Hostinger, Docker) — exceção ao padrão Railway do monorepo. Detalhe completo em `docs/architecture/infra.md` e `docs/context/decisions.md`.
