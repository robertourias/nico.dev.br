# Plano: apps/api — backend NestJS na VPS (claps)

**Spec:** `docs/specs/2026-06-25-api-claps-backend.md`
**Status:** aprovado — substitui T-01, T-03, T-04, T-05 (parte) do plano original de claps (`apps/blog/docs/plans/2026-06-25-claps.md`)
**Data:** 2026-06-25

---

## Contexto técnico

### Estado atual relevante

| Item | Estado |
|---|---|
| `apps/api` | Não existe ainda — só reservado na estrutura padrão (`docs/architecture/overview.md`) |
| Postgres/Redis na VPS | Já existem, em containers Docker independentes (Hostinger) — usados hoje só pelo container, sem rede Docker compartilhada com nada |
| `apps/blog` | Já tem `lib/db.ts`, `lib/redis.ts`, `lib/ratelimit.ts`, `lib/claps.ts` implementados contra Postgres/Redis diretos (versão anterior, a ser substituída) |
| Reverse proxy / TLS na VPS | A confirmar com Beto — desconhecido se já existe Caddy/Nginx rodando lá |

### Pré-requisito externo

Confirmar com Beto, antes de iniciar T-01: a VPS já tem algum reverse proxy (Caddy/Nginx) e DNS configurável para `api.nico.dev.br`? Se não, isso entra no escopo de T-01.

---

## Tarefas

---

## T-00: Colocar Postgres e Redis na mesma rede Docker do `apps/api`

**Tipo:** chore
**Agente:** infra

**Passos:**
1. Na VPS, mover (ou recriar) os containers Postgres/Redis para um `docker-compose.yml` único junto com o futuro container do `apps/api`, em uma rede Docker nomeada (ex. `claps-net`).
2. Remover qualquer `ports:` publicado de Postgres/Redis para o host — eles só devem ser alcançáveis pelo nome do serviço dentro da rede Docker.
3. Criar database (`claps`) e usuário dedicado no Postgres (não reaproveitar superuser).
4. Confirmar `requirepass` no Redis (mesmo sendo rede interna — defesa em profundidade).

**Critérios de aceite:**
- [ ] `docker compose ps` na VPS não mostra porta de Postgres/Redis publicada para `0.0.0.0`.
- [ ] Um container de teste na mesma rede consegue `psql`/`redis-cli` usando o nome do serviço (`postgres`, `redis`).

---

## T-01: Scaffold do `apps/api` (NestJS)

**Tipo:** feature
**Agente:** backend

**Passos:**
1. `nest new apps/api` (ou scaffold manual seguindo a estrutura de `docs/context/decisions.md`: `src/modules/`, `src/common/`, `src/infra/`, `src/config/`).
2. Configurar `package.json` do workspace (pnpm), `tsconfig.json` herdando de `packages/config` se aplicável.
3. Instalar: `@nestjs/swagger`, `@nestjs/throttler`, storage Redis do throttler, `prisma` + `@prisma/client`, `helmet`, `nestjs-pino` (ou `pino` + adapter), `class-validator`, `class-transformer`.
4. `main.ts`: `app.use(helmet())`, `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` global, prefixo `/api/v1`, Swagger em `/api/v1/docs`.

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/api build` passa.
- [ ] `GET /api/v1/docs` (Swagger) sobe localmente.

---

## T-02: Prisma schema + migration inicial

**Tipo:** feature
**Agente:** backend

```prisma
// apps/api/prisma/schema.prisma
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

```bash
pnpm --filter @nico.dev/api prisma migrate dev --name init_claps
```

**Critérios de aceite:**
- [ ] Migration aplicada localmente contra o Postgres do `docker-compose.yml` de dev.
- [ ] `prisma migrate deploy` documentado como passo de deploy em produção (não `db push`).

---

## T-03: Módulo `claps` (controller, service, DTOs)

**Tipo:** feature
**Agente:** backend

- `IncrementClapsDto`: `{ uid: string (uuid), amount: number (int, min 1, max 5) }`, validado via `class-validator`.
- `ClapsService.getClaps(slug, uid?)`: mesma query agregada da versão anterior (`SUM(count)`, `SUM(count) FILTER (WHERE uid = ...)`), agora via Prisma (`$queryRaw` ou agregação do client).
- `ClapsService.incrementClaps(slug, uid, amount)`: upsert capado, mesma lógica (`LEAST(count + amount, 50)`).
- `ClapsController`: `GET /claps/:slug`, `POST /claps/:slug` — ambos sob o guard de secret interno (T-04).
- 404 se o slug não existir — a API não tem acesso à content collection do Astro, então a validação de slug existente continua do lado do blog (a rota Astro já checa isso antes de chamar a api); a api em si não recusa slugs desconhecidos (`getClaps` de um slug nunca visto retorna `{ total: 0, userClaps: 0 }`, não 404).

**Critérios de aceite:**
- [ ] Mesmos critérios funcionais da spec original: cap de 50, concorrência segura via upsert atômico.
- [ ] `getClaps` de slug/uid nunca vistos retorna zeros sem erro.

---

## T-04: Guard de secret interno + rate limit

**Tipo:** feature
**Agente:** backend

```ts
// src/common/guards/internal-secret.guard.ts
@Injectable()
export class InternalSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.headers['x-internal-secret'] === process.env.CLAPS_API_SECRET;
  }
}
```

- `@nestjs/throttler` configurado com storage Redis, 20 req / 10s, aplicado no módulo de claps.
- Filtro de exceção global (`AppException` + `HttpExceptionFilter`) — shape de erro consistente, sem stacktrace exposto.

**Critérios de aceite:**
- [ ] Requisição sem header ou com secret errado → 401, sem tocar o Postgres.
- [ ] Rate limit bloqueia rajadas (testar com loop de requests).

---

## T-05: Dockerfile + docker-compose de dev + deploy na VPS

**Tipo:** chore
**Agente:** infra

- `Dockerfile` multi-stage (build + runtime, imagem `node:20-alpine`).
- `apps/api/docker-compose.yml` para dev local: `postgres`, `redis`, `api` (build local), rede interna, sem portas publicadas exceto `api` (ex. `3001:3001`) e Postgres/Redis acessíveis só dentro da rede para o `api` (pode publicar a porta do Postgres/Redis **só no `docker-compose.yml` de dev**, nunca no compose de produção da VPS).
- Na VPS: configurar reverse proxy (Caddy é o mais simples — TLS automático) apontando `api.nico.dev.br` → container `api` na porta interna.
- `prisma migrate deploy` como parte do entrypoint do container (ou passo manual de deploy — documentar a escolha).

**Critérios de aceite:**
- [ ] `docker compose up` local sobe Postgres + Redis + api, `GET /api/v1/claps/teste` funciona.
- [ ] Na VPS, `https://api.nico.dev.br/api/v1/claps/teste` responde via HTTPS válido.
- [ ] Nenhuma porta de Postgres/Redis publicada no compose de produção.

---

## T-06: Migrar `apps/blog` para consumir a API

**Tipo:** feature
**Agente:** frontend

- Remover `src/lib/db.ts`, `src/lib/redis.ts`, `src/lib/ratelimit.ts`.
- Reescrever `src/lib/claps.ts` como cliente HTTP (ver spec, seção 7).
- `src/pages/api/claps/[slug].ts`: troca chamadas diretas por chamadas a `getClaps`/`incrementClaps` do novo cliente HTTP — mantém a checagem de slug existente e a lógica de cookie `nico_uid` exatamente como está.
- Remover `postgres`, `ioredis` de `apps/blog/package.json`.
- Remover `apps/blog/docker-compose.yml`.
- Atualizar `apps/blog/.env.example`: `CLAPS_API_URL`, `CLAPS_API_SECRET` no lugar de `DATABASE_URL`/`REDIS_URL`.

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/blog build` passa sem `postgres`/`ioredis` no bundle.
- [ ] Fluxo end-to-end (clicar, recarregar) funciona contra a api local em dev.

---

## T-07: Configurar env vars em produção (Vercel + VPS)

**Tipo:** chore
**Agente:** infra

- Vercel (projeto blog): `CLAPS_API_URL=https://api.nico.dev.br/api/v1`, `CLAPS_API_SECRET=<secret>` (Production + Preview).
- VPS (container `api`): `DATABASE_URL` apontando para o serviço `postgres` da rede interna, `REDIS_URL` para `redis`, `CLAPS_API_SECRET` (mesmo valor do Vercel).

**Critérios de aceite:**
- [ ] Preview deployment do blog consegue chamar a api de produção (ou uma instância de staging, a definir) com sucesso.
- [ ] Secret não aparece em nenhum log (Pino) nem em mensagens de erro retornadas ao client.

---

## T-08: Smoke test end-to-end

**Tipo:** test
**Agente:** frontend

- [ ] Build de produção do blog conclui sem erros, sem virar SSR fora da rota de claps.
- [ ] Deploy preview no Vercel: clicar, recarregar, confirmar persistência via `apps/api`.
- [ ] Confirmar via `docker compose ps` na VPS que Postgres/Redis não têm porta publicada.
- [ ] Testar em 2 navegadores/dispositivos diferentes que os totais agregam corretamente.

---

## Ordem de execução

```
T-00  Rede Docker compartilhada (Postgres/Redis sem porta pública)
T-01  Scaffold apps/api                       (paralelo a T-00)
T-02  Prisma schema + migration                (depende de T-01)
T-03  Módulo claps                             (depende de T-02)
T-04  Guard + rate limit                       (depende de T-01, paralelo a T-02/T-03)
T-05  Dockerfile + compose + deploy VPS        (depende de T-00, T-03, T-04)
T-06  Migrar apps/blog para HTTP client        (depende de T-03, T-04 — pode codar em paralelo, testar só após T-05 estar no ar)
T-07  Env vars produção                        (depende de T-05, T-06)
T-08  Smoke test                               (depende de T-07)
```

---

## Riscos de implementação

| Risco | Mitigação |
|---|---|
| Mover Postgres/Redis de compose pode causar downtime/perda de dados se mal feito | Backup antes de qualquer `docker compose down -v`; nunca usar `-v` nos volumes existentes |
| `apps/api` ser um ponto único de falha novo | Aceitável para o volume atual; monitorar uptime |
| Configuração de reverse proxy/TLS errada expõe Postgres/Redis por engano | Checklist explícito de deploy (T-05) confirmando portas não publicadas |
| Prisma migrations em produção | Sempre `migrate deploy`, nunca `db push`; revisar migration gerada antes de aplicar |
| Throttler com storage Redis pode exigir lib de terceiro (não oficial do Nest) | Avaliar `@nest-lab/throttler-storage-redis` ou implementação própria mínima se a lib não for confiável |

---

## Validação de build (sandbox) — resultado

T-01 a T-06 foram implementados (código completo). Validação automática feita no sandbox desta sessão (sem Docker/Postgres/Redis disponíveis):

- **`apps/blog`**: `astro sync` + `tsc --noEmit` + `astro build` completos sem erros — bundle não inclui mais `postgres`/`ioredis`, `ClapButton` é buildado normalmente. Único erro de typecheck remanescente (`src/content/mdx-components.ts`, imports de `.astro`) é **pré-existente, não relacionado a claps** — não foi tocado nesta implementação.
- **`apps/api`**: install e estrutura do NestJS resolvem corretamente. `prisma generate` **não pôde rodar no sandbox** — a rede do sandbox bloqueia `binaries.prisma.sh` (403), necessário para baixar o query engine. Sem o client gerado, o `tsc` aponta 8 erros, todos e exclusivamente nos dois arquivos que usam `PrismaClient` (`prisma.service.ts`, `claps.service.ts`) — nenhum outro arquivo (controller, guards, DTOs, filters, `main.ts`) apresentou erro. Ou seja: o código está correto, só falta `prisma generate` rodar num ambiente com acesso de rede normal (qualquer máquina dev, CI, ou a própria VPS).
- Não foi possível testar `docker compose up`, migration real, nem o fluxo end-to-end (sem Docker no sandbox) — fica para os passos manuais abaixo.
- Durante a validação, dois arquivos (`apps/blog/src/lib/claps.ts` e `apps/blog/src/pages/api/claps/[slug].ts`) foram encontrados truncados no disco (corrompidos, terminando no meio de uma função) — corrigido recriando os arquivos do zero. Vale checar rapidamente esses dois arquivos antes de dar push, caso o problema se repita.

---

## Checklist manual (Beto) — passos fora do alcance deste sandbox

Nada do código pendente; o que falta é execução em ambientes que este sandbox não acessa (VPS via SSH, painel da Vercel, Docker).

### 1. Confirmar pré-requisito externo
- [ ] A VPS já tem reverse proxy (Caddy/Nginx) rodando? Se não, instalar Caddy (TLS automático é o mais simples).
- [ ] DNS de `api.nico.dev.br` configurável (apontar para o IP da VPS)?

### 2. T-00 — Rede Docker compartilhada (revisado: Postgres/Redis já existem)
Confirmado na VPS: Postgres e Redis já rodam em produção, cada um no seu stack/rede
própria (`postgres_default`, `redis_default` — redes separadas, não compartilhadas
entre si). Não é preciso mover ou recriar esses containers — só conectar o `api` a
essas duas redes e criar uma base/usuário dedicados dentro do Postgres existente.
- [ ] Dentro do container Postgres existente, criar database `claps` e usuário dedicado (não reaproveitar superuser).
- [ ] Confirmar `--requirepass` (ou equivalente) já configurado no Redis existente.
- [ ] Confirmar que nem Postgres nem Redis têm porta publicada para `0.0.0.0` (`docker compose ps` ou `docker port <container>`).

### 3. Deploy do `apps/api` na VPS (T-05)
- [ ] Gerar `CLAPS_API_SECRET` de produção: `openssl rand -hex 32`.
- [ ] Build da imagem **a partir da raiz do monorepo** (o `Dockerfile` depende do lockfile do workspace): `docker build -f apps/api/Dockerfile -t nico-api:latest .`
- [ ] Subir com `apps/api/docker-compose.prod.example.yml` como referência (adaptar/copiar na VPS — esse arquivo não é usado automaticamente). Ele declara `postgres_default`/`redis_default` como redes `external` e conecta o `api` a elas — `DATABASE_URL`/`REDIS_URL` no `.env` apontam para os nomes de serviço de sempre (`postgres`, `redis`).
- [ ] Depois do `docker compose up -d`, conectar a rede default deste stack ao container do Traefik manualmente: `docker network connect <rede-default-deste-stack> <container-do-traefik>` — mesmo padrão usado pelos outros stacks (não existe rede "proxy" compartilhada nesta VPS; cada stack se conecta ao Traefik individualmente).
- [ ] Confirmar que o `api` não publica nenhuma porta para o host/internet — o Traefik alcança via rede Docker (labels), não via porta publicada.
- [ ] Rodar a migration: `prisma migrate deploy` (já roda no entrypoint do container; confirmar nos logs que passou).
- [ ] Validar: `curl https://api.nico.dev.br/api/v1/claps/teste` responde (sem header de secret deve dar 401).

### 4. Env vars (T-07)
- [ ] Vercel (projeto blog) → Settings → Environment Variables: `CLAPS_API_URL=https://api.nico.dev.br/api/v1` e `CLAPS_API_SECRET=<mesmo secret da VPS>`, em Production **e** Preview.
- [ ] Redeploy do blog na Vercel para as env vars pegarem.

### 5. Smoke test (T-08)
- [ ] Abrir um post no blog em produção, dar clap, recarregar a página — total deve persistir.
- [ ] Repetir em outro navegador/dispositivo — confirmar que os totais agregam (não sobrescrevem).
- [ ] Forçar rajada de cliques rápidos — confirmar que em algum ponto vem 429 (rate limit ativo) em vez de erro genérico.
- [ ] `docker compose ps` na VPS — confirmar de novo que Postgres/Redis não têm porta publicada (checar após qualquer restart).
