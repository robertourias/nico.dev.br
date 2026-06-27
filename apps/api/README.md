# apps/api

Backend NestJS interno do monorepo. Primeiro (e único, por ora) consumidor: o
sistema de claps de `apps/blog` — mas a API não é específica de claps, é o ponto
único de acesso a Postgres/Redis para qualquer app do monorepo (ver
`docs/context/decisions.md`, exceção "sem banco de dados" nos apps de frontend).

Spec e plano completos: `docs/specs/2026-06-25-api-claps-backend.md` e
`docs/plans/2026-06-25-api-claps-backend.md` (raiz do monorepo).

## Stack

- NestJS 10 + Express
- Prisma 5 (Postgres)
- Redis (`ioredis`) — rate limit do módulo de claps
- Helmet, `class-validator`/`class-transformer`, Swagger, `nestjs-pino`

## Estrutura

```
src/
  common/
    exceptions/      AppException — shape de erro consistente
    filters/          HttpExceptionFilter (filtro global)
    guards/           InternalSecretGuard, RateLimitGuard
  infra/
    prisma/           PrismaModule/PrismaService
    redis/            RedisModule/RedisService
  modules/
    claps/            controller, service, DTOs
  main.ts             bootstrap, prefixo /api/v1, Swagger em /api/v1/docs
prisma/
  schema.prisma       model Clap
```

## Autenticação interna

Toda rota é protegida por `InternalSecretGuard`: o client (ex. `apps/blog`)
precisa enviar o header `X-Internal-Secret` com o valor de `CLAPS_API_SECRET`.
Sem o header, ou com valor errado, a resposta é `401` sem tocar Postgres/Redis.

## Subir local (dev)

Pré-requisitos: Docker, pnpm, Node 20.

A partir da **raiz do monorepo** (o build da imagem usa a raiz como contexto):

```bash
docker compose -f apps/api/docker-compose.yml up -d
```

Isso sobe `postgres` (`5432`), `redis` (`6379`) e `api` (`3001`) na mesma rede
Docker, com portas publicadas no host só por conveniência de dev (psql/redis-cli
direto da máquina). Credenciais e `DATABASE_URL`/`REDIS_URL` já vêm hardcoded no
próprio `docker-compose.yml` para esse cenário — não precisa de `.env` pra isso.

Para rodar fora de Docker (ex. `pnpm dev` com hot reload, contra o Postgres/Redis
que já estão em container):

```bash
cp apps/api/.env.example apps/api/.env   # ajustar se necessário
pnpm install
pnpm --filter @nico.dev/api prisma:generate
pnpm --filter @nico.dev/api prisma:migrate   # aplica/cria migrations em dev
pnpm --filter @nico.dev/api dev              # tsx --watch src/main.ts
```

API em `http://localhost:3001/api/v1`, Swagger em
`http://localhost:3001/api/v1/docs` (autenticar no Swagger com o mesmo valor de
`CLAPS_API_SECRET` do `.env`, no header `X-Internal-Secret`).

### Scripts úteis (`pnpm --filter @nico.dev/api <script>`)

| Script | O que faz |
|---|---|
| `dev` / `start:dev` | `tsx --watch src/main.ts` |
| `build` | `tsc -p tsconfig.build.json` → `dist/` |
| `start` | `node dist/main.js` (espera `build` já ter rodado) |
| `typecheck` | `tsc --noEmit` |
| `lint` | `eslint "src/**/*.ts"` |
| `prisma:generate` | Gera o client do Prisma (`@prisma/client`) |
| `prisma:migrate` | `prisma migrate dev` — cria/aplica migration em dev |
| `prisma:deploy` | `prisma migrate deploy` — aplica migrations pendentes (produção, nunca `db push`) |

## Subir em produção (VPS)

Contexto real desta VPS (Hostinger): Postgres e Redis **já existem** em
containers próprios, cada um em sua rede Docker isolada (`postgres_default`,
`redis_default`). Traefik faz o roteamento por labels, sem rede "proxy"
compartilhada — cada stack se conecta ao Traefik manualmente depois do deploy.

1. **Build da imagem a partir da raiz do monorepo** (o `Dockerfile` depende do
   lockfile do workspace):

   ```bash
   docker build -f apps/api/Dockerfile -t nico-api:latest .
   ```

2. **Copiar/adaptar `docker-compose.prod.example.yml`** na VPS (esse arquivo é só
   referência, não é usado automaticamente por nada deste repo). Ele:
   - declara `postgres_default`/`redis_default` como redes `external` e conecta o
     `api` a elas — sem criar containers novos de Postgres/Redis;
   - declara uma rede própria nomeada `api-network` (em vez da `default`
     implícita, pra ficar previsível independente da pasta usada na VPS);
   - inclui os labels do Traefik (mesma convenção já usada em produção:
     `entrypoints=websecure`, `certresolver=letsencrypt`);
   - não publica nenhuma porta — Traefik alcança o container pela rede Docker.

3. **Criar um `.env` na VPS** (fora do controle de versão) com:

   ```dotenv
   DATABASE_URL=postgres://<user>:<senha>@postgres:5432/claps
   REDIS_URL=redis://:<senha>@redis:6379
   CLAPS_API_SECRET=<gerar com: openssl rand -hex 32>
   ```

   `DATABASE_URL`/`REDIS_URL` usam os nomes de serviço dos containers
   Postgres/Redis já existentes (não os deste compose) — confirme os nomes reais
   na VPS antes de copiar.

4. **Subir e conectar ao Traefik:**

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   docker network connect api-network <container-do-traefik>
   ```

5. **Migrations**: já rodam automaticamente no `CMD` do container
   (`prisma migrate deploy && node dist/main.js`) — confirmar nos logs que
   passou (`docker logs <container-api>`).

6. **Validar:**
   - `curl https://api.nico.dev.br/api/v1/claps/teste` responde (sem header de
     secret deve dar `401`).
   - `docker compose ps` / `docker port <container>` confirmam que nem
     Postgres/Redis nem o `api` publicam porta para `0.0.0.0`.

Checklist manual completo (passo a passo, incluindo Vercel e DNS):
`docs/plans/2026-06-25-api-claps-backend.md`, seção "Checklist manual (Beto)".

## Variáveis de ambiente

| Variável | Local (dev) | Produção (VPS) |
|---|---|---|
| `DATABASE_URL` | `postgres://api:api@postgres:5432/api_claps` (já no `docker-compose.yml`) | connection string do Postgres existente, via `.env` |
| `REDIS_URL` | `redis://redis:6379` (já no `docker-compose.yml`) | connection string do Redis existente, via `.env` |
| `CLAPS_API_SECRET` | qualquer valor (ex. `dev-secret-change-me`) | gerado com `openssl rand -hex 32`, mesmo valor configurado no Vercel do `apps/blog` |
| `PORT` | `3001` | `3001` |
| `NODE_ENV` | `development` | `production` |

Nunca commitar `.env` — ver `.env.example` para o template.
