# Spec: apps/api — backend NestJS na VPS (primeiro consumidor: claps do blog)

**Data:** 2026-06-25
**Status:** approved
**Autor:** Beto

---

## Contexto

A spec original de claps (`apps/blog/docs/specs/2026-06-25-claps.md`) evoluiu três vezes:

1. Upstash Redis (KV serverless gerenciado) — aprovada inicialmente.
2. Redis self-hosted via Docker na VPS do Beto — Beto preferiu consolidar em infra própria.
3. Postgres (ledger durável) + Redis (rate limit), ambos self-hosted na mesma VPS — Beto identificou que já opera um Postgres independente lá.

Em todas as três versões, quem falava direto com Postgres/Redis era a própria function serverless do Astro no Vercel — ou seja, o banco de dados da VPS precisaria ficar acessível pela internet pública, já que o Vercel não tem IP fixo. Isso exigia senha forte + TLS como única linha de defesa, e cada cold start podia abrir uma conexão TCP nova contra o Postgres/Redis da VPS.

Beto perguntou se fazia sentido, em vez disso, criar um projeto de backend de verdade — hospedado na própria VPS, ao lado do Postgres e do Redis — que mediasse esse acesso. **Decisão: sim.** Isso é estritamente melhor e, além disso, é exatamente o que o monorepo já previa: `docs/architecture/overview.md` já lista `apps/api/ → NestJS backend (quando necessário)` na estrutura padrão, e `docs/context/decisions.md` (raiz) já documenta a convenção completa de backend (Clean Architecture, Prisma + PostgreSQL, REST + Swagger, Redis via cache/rate-limit, Pino, Zod/class-validator, Helmet). Este é o primeiro app a realmente implementar essa convenção — só que hospedado na VPS própria, não no Railway (ver "Impacto nos docs de infra" abaixo).

---

## Objetivos

1. Postgres e Redis deixam de ser acessíveis pela internet pública — só `apps/api` fala com eles, na rede interna Docker da VPS.
2. `apps/blog` deixa de ter qualquer cliente de banco de dados — passa a fazer uma chamada HTTP server-to-server para `apps/api`.
3. Conexões com Postgres/Redis passam a ser de um processo Node persistente (não serverless) — sem o problema de esgotar conexões a cada cold start.
4. Implementação segue a convenção de backend já registrada em `docs/context/decisions.md` (raiz), em vez de inventar um padrão novo.
5. Escopo desta primeira versão: só os endpoints de claps. A estrutura já fica pronta para outros subprojetos do monorepo reusarem o mesmo backend no futuro.

## Fora do escopo

- Autenticação de usuário final (NextAuth/Auth.js) — não há login nem nesta feature nem no blog. A proteção entre blog e api é um segredo compartilhado simples (tráfego servidor-servidor, não é superfície de usuário).
- Migrar outros subprojetos para usar `apps/api` agora — a estrutura fica pronta para isso, mas só claps é implementado.
- CI/CD automatizado de deploy para a VPS (GitHub Actions → VPS) — fica como possível evolução; deploy inicial é manual (`docker compose up` na VPS).

---

## Opções consideradas

### Opção A (escolhida): NestJS em `apps/api`, deploy via Docker na própria VPS, ao lado do Postgres/Redis

| Dimensão | Avaliação |
|---|---|
| Segurança | Alta — Postgres/Redis ficam só na rede interna Docker, nunca expostos publicamente; só a API tem porta pública (HTTPS) |
| Aderência à convenção | Total — reusa a stack de backend já documentada na raiz (NestJS, Prisma, Clean Architecture) |
| Conexões | Processo persistente — pool de conexões gerenciado normalmente, sem cold start |
| Custo | Zero incremental — mesma VPS que já hospeda Postgres/Redis |
| Reuso futuro | Alto — outros subprojetos do monorepo podem consumir a mesma API depois |

**Contras:** introduz um novo "deploy target" (a VPS via Docker) que hoje não está documentado em `docs/architecture/infra.md` (que lista Railway para backend/banco) — ver seção de impacto. Também introduz uma dependência nova: se a VPS cair, claps para de funcionar (antes, a function do Vercel pelo menos tentava direto; o raio de falha é parecido, mas agora concentrado em um único processo).

### Opção B: manter o que já estava implementado (Astro fala direto com Postgres/Redis da VPS)

**Pros:** já estava praticamente pronto (T-02 a T-07 da spec de claps).
**Contras:** Postgres/Redis expostos à internet pública é o risco mais sério já levantado na spec anterior; sem solução melhor que "senha forte + TLS". Descartada em favor da Opção A.

### Opção C: backend gerenciado (Railway, conforme `infra.md`)

**Pros:** segue o plano de hosting já documentado na raiz; sem VPS própria para manter.
**Contras:** Beto já opera e confia na VPS Hostinger (é onde Postgres/Redis já vivem); colocar a API em outro provedor (Railway) significa que ela ainda precisaria atravessar a rede pública para falar com o Postgres/Redis da VPS — perde exatamente a vantagem de segurança da Opção A. Descartada para este caso; Railway continua sendo o destino documentado para backends que não dependem de infra que já existe na VPS.

**Decisão:** Opção A.

---

## Decisões técnicas

### 1. Localização e nome do app

`apps/api` — nome já reservado na estrutura padrão do monorepo (`docs/architecture/overview.md`). Segue a convenção de backend já registrada em `docs/context/decisions.md` (raiz): Clean Architecture, feature-first por módulo, DI por token, Prisma + PostgreSQL, REST + Swagger com prefixo `/api/v1/`.

```
apps/api/
  src/
    modules/
      claps/
        claps.controller.ts
        claps.service.ts
        claps.module.ts
        dto/
          increment-claps.dto.ts
    common/
      filters/          # exception filter global
      guards/           # shared-secret guard
    infra/
      prisma/           # PrismaService
      redis/             # RedisService (rate limit)
    config/
  prisma/
    schema.prisma
  docker-compose.yml     # Postgres + Redis + api, para dev local
  Dockerfile
```

### 2. Modelo de dados (Prisma)

Substitui o SQL cru que estava em `apps/blog/src/lib/db.ts` por um schema Prisma versionado, com migrations reais (em vez de `CREATE TABLE IF NOT EXISTS` em runtime — agora que existe um app dedicado, migrations deixam de ser desproporcionais):

```prisma
model Clap {
  slug      String
  uid       String   @db.Uuid
  count     Int      @default(0)
  updatedAt DateTime @updatedAt @map("updated_at")

  @@id([slug, uid])
  @@index([slug])
  @@map("claps")
}
```

### 3. Endpoints

`GET /api/v1/claps/:slug?uid=...` → `{ total: number, userClaps: number }`
`POST /api/v1/claps/:slug` body `{ uid: string, amount: number }` (1–5) → upsert capado (`LEAST(count + amount, 50)`, mesma lógica atômica da spec original, agora via `$executeRaw` do Prisma ou `upsert` + lock), retorna `{ total, userClaps }`.

`uid` deixa de vir de um cookie lido pela própria API — quem possui o cookie é o `apps/blog` (primeira parte, mesma origem do visitante). A API só recebe o `uid` já resolvido como parâmetro. Isso mantém toda a complexidade de cookie no domínio do blog (sem CORS, sem cookie cross-site) e a API fica deliberadamente "burra" — só persiste o que o blog manda.

### 4. Autenticação entre blog e api

Tráfego servidor-servidor (function do Vercel → VPS), não tráfego de navegador. Sem OAuth, sem JWT de usuário — um guard simples valida um header `X-Internal-Secret` contra `process.env.CLAPS_API_SECRET` (NestJS Guard, `common/guards/internal-secret.guard.ts`). Mesma secret configurada nos dois lados (`apps/api` valida, `apps/blog` envia).

### 5. Rate limit

`@nestjs/throttler` com storage Redis (`@nest-lab/throttler-storage-redis` ou equivalente) — em vez do `INCR`/`EXPIRE` manual da versão anterior, já que agora existe um app NestJS de verdade e o throttler é a forma idiomática documentada (`docs/context/decisions.md`: "Helmet habilitado, rate limiting habilitado"). Mesma política: 20 req / 10s por IP.

### 6. Rede e exposição

- Postgres e Redis: sem porta publicada para o host (`ports:` removido do `docker-compose.yml` da VPS) — só acessíveis pelo nome do serviço Docker (`postgres`, `redis`) dentro da mesma rede interna do `apps/api`.
- `apps/api`: único serviço com porta exposta, atrás de um reverse proxy (Caddy ou Nginx) na VPS, com TLS (Let's Encrypt) em `api.nico.dev.br`.
- Único tráfego cruzando a internet pública: HTTPS entre o Vercel (blog) e `api.nico.dev.br` — não mais conexões TCP brutas de Postgres/Redis.

### 7. `apps/blog` depois desta mudança

- Remove `postgres`, `ioredis` do `package.json` — não fala mais com banco de dados nenhum, diretamente.
- `src/lib/db.ts`, `src/lib/redis.ts`, `src/lib/ratelimit.ts` são removidos.
- `src/lib/claps.ts` passa a ser um cliente HTTP fino:

```ts
const API_URL = process.env.CLAPS_API_URL; // ex.: https://api.nico.dev.br/api/v1
const API_SECRET = process.env.CLAPS_API_SECRET;

export async function getClaps(slug: string, uid: string | undefined) {
  const res = await fetch(`${API_URL}/claps/${slug}?uid=${uid ?? ''}`, {
    headers: { 'X-Internal-Secret': API_SECRET! },
  });
  if (!res.ok) throw new Error(`claps api ${res.status}`);
  return res.json();
}

export async function incrementClaps(slug: string, uid: string, amount: number) {
  const res = await fetch(`${API_URL}/claps/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': API_SECRET! },
    body: JSON.stringify({ uid, amount }),
  });
  if (!res.ok) throw new Error(`claps api ${res.status}`);
  return res.json();
}
```

- `src/pages/api/claps/[slug].ts` (rota Astro) continua existindo e continua sendo a única coisa não-estática do blog — ela só deixa de tocar em Postgres/Redis e passa a delegar para `apps/api`. Ela continua dona do cookie `nico_uid` (mesma origem do visitante, sem CORS).
- `docker-compose.yml` que hoje está em `apps/blog/` é removido de lá — Postgres/Redis não são mais dependência local do blog, são dependência de `apps/api`.

---

## Impacto nos docs de infra (raiz)

`docs/architecture/infra.md` documenta "Backend (NestJS): Railway" e "Banco de dados (PostgreSQL): Railway" — esta spec diverge disso: o primeiro backend real do monorepo vai para uma VPS própria (Hostinger), não Railway. Railway continua sendo o destino documentado para futuros backends que não dependam de infra que já existe na VPS; esta exceção é registrada explicitamente (não substitui silenciosamente a convenção). `docs/architecture/infra.md` e `docs/architecture/overview.md` foram atualizados em 2026-06-25 para refletir isso — ver changelog dos dois arquivos.

---

## Arquivos a criar/modificar

| Arquivo | Ação | Descrição |
|---|---|---|
| `apps/api/` (projeto novo) | criar | scaffold NestJS — Nest CLI ou template manual seguindo a estrutura acima |
| `apps/api/prisma/schema.prisma` | criar | model `Clap` |
| `apps/api/src/modules/claps/*` | criar | controller, service, DTOs |
| `apps/api/src/common/guards/internal-secret.guard.ts` | criar | valida `X-Internal-Secret` |
| `apps/api/src/infra/redis/*` | criar | RedisService para o throttler storage |
| `apps/api/docker-compose.yml` | criar | Postgres + Redis + api, para dev local |
| `apps/api/Dockerfile` | criar | build de produção, para deploy na VPS |
| `apps/api/.env.example` | criar | `DATABASE_URL`, `REDIS_URL`, `CLAPS_API_SECRET` |
| `apps/blog/src/lib/db.ts` | remover | substituído pela API |
| `apps/blog/src/lib/redis.ts` | remover | substituído pela API |
| `apps/blog/src/lib/ratelimit.ts` | remover | rate limit passa a viver em `apps/api` |
| `apps/blog/src/lib/claps.ts` | modificar | passa a ser cliente HTTP da api |
| `apps/blog/docker-compose.yml` | remover | Postgres/Redis não são mais dependência local do blog |
| `apps/blog/package.json` | modificar | remove `postgres`, `ioredis` |
| `apps/blog/.env.example` | modificar | `CLAPS_API_URL`, `CLAPS_API_SECRET` no lugar de `DATABASE_URL`/`REDIS_URL` |
| `docs/architecture/infra.md` (raiz) | feito | nota sobre VPS própria divergindo de Railway para este caso |
| `docs/architecture/overview.md` (raiz) | feito | linha na tabela de decisões |
| `docs/context/decisions.md` (raiz) | feito | nova seção "API (apps/api)" |

---

## Critérios de aceite

- [ ] Postgres e Redis da VPS não têm nenhuma porta publicada para a internet pública — só acessíveis dentro da rede Docker interna.
- [ ] `apps/api` responde em `api.nico.dev.br` via HTTPS (Let's Encrypt), atrás de reverse proxy.
- [ ] Chamada sem o header `X-Internal-Secret` correto retorna 401/403, nunca toca o banco.
- [ ] `apps/blog` não tem mais `postgres` nem `ioredis` no `package.json`.
- [ ] Mesmo comportamento funcional da spec original: cap de 50 claps/usuário/post, 404 para slug inexistente, rate limit por IP.

## Dependências e riscos

| Item | Risco | Mitigação |
|---|---|---|
| VPS única hospedando Postgres + Redis + api | Ponto único de falha — se a VPS cair, claps para por completo | Aceitável para o volume de um blog pessoal; monitorar uptime, considerar healthcheck/alerta simples |
| Deploy manual na VPS (sem CI/CD ainda) | Risco de divergência entre o que está rodando e o que está no repo | Documentar passo a passo de deploy (`docker compose up -d --build`); CI/CD para VPS fica como evolução futura |
| Reverse proxy + TLS mal configurado | Exposição acidental de Postgres/Redis se a configuração do Docker Compose publicar portas por engano | Checklist de deploy explícito: confirmar que `docker compose ps` não mostra portas de Postgres/Redis publicadas para `0.0.0.0` |
| Secret compartilhado simples (não OAuth) | Se vazar, qualquer um pode chamar a API de claps | Tráfego de baixo risco (não é dado sensível, é só um contador) — proporcional ao risco real; rotação manual da secret se necessário |
| Divergência com `infra.md` (Railway documentado, VPS usada na prática) | Próximo agente/dev pode assumir Railway por engano | Já corrigido nesta spec — `infra.md` e `overview.md` atualizados para registrar a exceção |
