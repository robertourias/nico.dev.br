# Spec & Plan: Deploy manual na VPS (TASK09)

**Status:** approved
**Aprovado por:** Roberto Nicoletti em 2026-09-29
**Data:** 2026-09-29
**Autor:** PLANNER (Claude)
**Backlog:** TASK09 em `docs/context/product-backlog.md`
**Depende de:** TASK05 (home) e TASK07 (`/s/[slug]`), ambas `done`

---

## 1. Problema e Visão Geral

`apps/skills` está pronto no código (Fase 1 completa, Fase 2 quase inteira) mas nunca subiu em produção. Falta a infraestrutura de deploy: uma imagem Docker que sirva o export estático (`next build` com `output: 'export'`) atrás de nginx, e um `docker-compose` com os labels Traefik certos para `skills.nico.dev.br` na VPS própria (Hostinger) — mesmo padrão já usado por `apps/api` (`docs/context/decisions.md`).

Esta é a Spec do **primeiro deploy manual**: gera os arquivos de infra (Dockerfile, nginx.conf, docker-compose.yml) e o runbook do primeiro deploy. A automação via GitHub Actions + GHCR é a TASK13 (depende desta).

**Bloqueio conhecido (confirmado nesta sessão via GitHub API):** o `main` de `robertourias/skills` hoje tem a skill `playwright-review` com `metadata.category: testing`, valor fora da tupla `CATEGORIES` de `apps/skills/catalog.config.ts` (`documentation`, `design`, `writing`, `product`, `engineering`) — quebra `build-registry.ts` se o build usar `SKILLS_REF=main`. Decisão tomada com o usuário: fixar `SKILLS_REF` no último commit bom antes desse problema — `e137566fc94a63c3708cc720cfa62cadc73ab5ff` (2026-09-25T20:07:20Z, "feat(skills): replace excalidraw-design-system with system-design-view"), confirmado com as 5 skills daquele commit (`article-writer`, `mermaid-diagrams`, `pencil-design-system`, `product-ideation`, `system-design-view`) todas com `category` válida.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como Beto (operador), quero uma imagem Docker reproduzível do site estático, para subir o catálogo na VPS sem depender de CI/CD que ainda não existe (TASK13).
- **P1 (crítico):** Como Beto, quero o `docker-compose` já com os labels Traefik corretos (domínio, TLS), para não ter que redescobrir a sintaxe olhando `apps/api` toda vez.
- **P2 (importante):** Como Beto, quero um runbook claro do primeiro deploy, para não esquecer nenhum passo (DNS, TLS, smoke test) na primeira vez que subo esse serviço.
- **P3 (nice-to-have):** Como responsável futuro pela TASK13, quero que o Dockerfile já esteja pronto para ser reaproveitado, trocando só a origem da imagem (build local → pull do GHCR).

---

## 3. Requisitos Funcionais

- **FR-001:** `apps/skills/Dockerfile` builda a imagem de produção em múltiplos estágios: instala dependências do workspace (`pnpm install --frozen-lockfile --filter @nico.dev/skills...`), roda `content:sync` (clone raso de `robertourias/skills`, `SKILLS_REF` fixado por `ARG` com default `e137566fc94a63c3708cc720cfa62cadc73ab5ff`), depois `registry` e `build` (gera `apps/skills/out/`); estágio final `nginx:1.27-alpine` copia só `out/` e `nginx.conf`, sem Node/toolchain de build na imagem final.
- **FR-002:** `apps/skills/nginx.conf` serve o export estático (`trailingSlash: true` já configurado em `next.config.ts`) com fallback de 404 (`error_page 404 /404.html`, gerado pelo `next build`), gzip para texto/JS/CSS/SVG, cache longo e imutável só para `_next/static/` (hash no nome do arquivo).
- **FR-003:** `apps/skills/docker-compose.yml` sobe o serviço `skills` (build a partir da raiz do monorepo) com labels Traefik (`Host(\`skills.nico.dev.br\`)`, `entrypoints=websecure`, `tls.certresolver=letsencrypt`, `loadbalancer.server.port=80`, `traefik.docker.network` desambiguando a rede — mesmo padrão de `apps/api/docker-compose.prod.example.yml`, Traefik roda em `network_mode: host` nessa VPS); sem `ports:` publicada (Traefik alcança via rede Docker); sem variável de ambiente sensível (site 100% estático, sem `.env`).
- **FR-004:** Runbook documentado (Tarefa 2, campo `Notas:`) com o passo a passo do primeiro deploy manual na VPS. É Pendência Manual: nenhum Critério de Aceite automatizado cobre a execução real (exige acesso SSH que só o humano tem, guardrails.md seção 5).

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** pipeline de CI/CD (GitHub Actions → imagem no GHCR → deploy automático) — TASK13, que depende desta; provisionamento de DNS/TLS automatizado — assume-se Traefik + resolver `letsencrypt` já configurados na VPS (confirmado pelo padrão já em produção de `apps/api`) e DNS de `skills.nico.dev.br` apontado pelo humano; atualizar `SKILLS_REF` para incluir as 3 skills novas (`frontend-design`, `playwright-review`, `web-design-guidelines`) — bloqueado até a categoria de `playwright-review` ser corrigida no repo `robertourias/skills`; execução real dos comandos na VPS via SSH — Pendência Manual, não roda dentro deste fluxo.
- **Premissa:** Traefik já roda na VPS em `network_mode: host` com `certresolver=letsencrypt` configurado (mesmo Traefik que atende `api.nico.dev.br`, ver `apps/api/docker-compose.prod.example.yml`).
- **Risco:** build falhar se o clone de `robertourias/skills` (`content:sync`) não tiver rede durante o `docker build` → Mitigação: comando de build é re-executável, sem estado parcial (cada estágio é isolado).
- **Risco:** pin de `SKILLS_REF` ficar esquecido depois que a categoria de `playwright-review` for corrigida, catálogo trava em 5 skills indefinidamente → Mitigação: comentário no topo do `Dockerfile` explica o motivo e onde ajustar o `ARG`; registrado como pendência em `docs/context/current-state.md` ao final (Tarefa 2).
- **Risco:** nome real da rede Docker do compose (`traefik.docker.network`) não bater com o gerado (depende do nome do diretório/projeto compose na VPS) → Mitigação: comentário no `docker-compose.yml` instrui confirmar via `docker inspect skills-web` após o primeiro `up` e ajustar o label se necessário (mesmo aviso já registrado em `apps/api/docker-compose.prod.example.yml`).

---

## 5. Contratos de API (Se aplicável)

Não há HTTP entre serviços — é infraestrutura de deploy. Contrato = interface dos arquivos gerados:

```dockerfile
# apps/skills/Dockerfile — build context: raiz do monorepo
ARG SKILLS_REF=e137566fc94a63c3708cc720cfa62cadc73ab5ff
# estágio final:
# FROM nginx:1.27-alpine AS runtime
# COPY --from=build /repo/apps/skills/out /usr/share/nginx/html
# COPY apps/skills/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
```

```yaml
# apps/skills/docker-compose.yml — labels obrigatórios
labels:
  - 'traefik.enable=true'
  - 'traefik.http.routers.nico-skills.rule=Host(`skills.nico.dev.br`)'
  - 'traefik.http.routers.nico-skills.entrypoints=websecure'
  - 'traefik.http.routers.nico-skills.tls.certresolver=letsencrypt'
  - 'traefik.http.services.nico-skills.loadbalancer.server.port=80'
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|----------------|
| 1    | T1                  | —              |
| 2    | T2                  | T1             |

> Tarefa única por onda: `docker-compose.yml` (T2) referencia `apps/skills/Dockerfile` (T1) e sua validação (`docker compose config` + build real) depende do Dockerfile já existir — sem paralelismo útil nesse escopo pequeno.

### Tarefa 1: Dockerfile + nginx.conf (imagem de produção)

- **Tipo:** chore
- **Agente:** backend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** nenhuma
- **Arquivos:** `apps/skills/Dockerfile`, `apps/skills/nginx.conf`, `.dockerignore`
- **Cobre:** FR-001, FR-002
- **Descrição:**
  Criar `apps/skills/Dockerfile` (build context = raiz do monorepo, como `apps/api/Dockerfile`):
  - Estágio `base` (`node:22-alpine`): `apk add --no-cache git` (necessário pro `git clone` de `content:sync`), `corepack enable`.
  - Estágio `deps`: copia `pnpm-workspace.yaml`, `package.json`, `pnpm-lock.yaml`, `apps/skills/package.json`, `packages/ui/package.json`, `packages/config/package.json`; roda `pnpm install --frozen-lockfile --filter @nico.dev/skills...`.
  - Estágio `build`: `ARG SKILLS_REF=e137566fc94a63c3708cc720cfa62cadc73ab5ff` (comentário explicando o motivo do pin, ver seção 1), `ENV SKILLS_REF=${SKILLS_REF}`; copia `apps/skills` e `packages`; roda em sequência `pnpm --filter @nico.dev/skills content:sync`, `registry`, `build` (usa as env vars já declaradas em `turbo.json` para essas tasks).
  - Estágio `runtime` (`nginx:1.27-alpine`): copia só `apps/skills/out` para `/usr/share/nginx/html` e `apps/skills/nginx.conf` para `/etc/nginx/conf.d/default.conf`; `EXPOSE 80`.

  Criar `apps/skills/nginx.conf`: `listen 80`, `root /usr/share/nginx/html`, `index index.html`, `location / { try_files $uri $uri/ =404; }`, `error_page 404 /404.html`, `location /_next/static/ { add_header Cache-Control "public, max-age=31536000, immutable"; }`, gzip habilitado para `text/plain text/css application/javascript application/json image/svg+xml`.

  Atualizar `.dockerignore` (raiz, já existe — usado também por `apps/api`) acrescentando `**/out` e `**/content` (dirs gitignored que não devem vazar pro contexto do build; `content:sync` deve rodar limpo dentro da imagem).

- **Critérios de Aceite:**
  - [ ] Dado o `Dockerfile`, quando `docker build -f apps/skills/Dockerfile -t nico-skills:test .` roda na raiz do repo, então builda sem erro e a stage final contém `/usr/share/nginx/html/index.html`. — cobre FR-001, verificado por `docker build -f apps/skills/Dockerfile -t nico-skills:test .`
  - [ ] Dado a imagem construída, quando `docker run --rm -d -p 8080:80 --name nico-skills-smoke nico-skills:test` sobe, então `curl -sf http://localhost:8080/` retorna HTML 200 (home do catálogo). — cobre FR-001, FR-002, verificado por `docker run --rm -d -p 8080:80 --name nico-skills-smoke nico-skills:test && curl -sf http://localhost:8080/ && docker stop nico-skills-smoke`
  - [ ] Dado uma rota inexistente, quando `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/rota-inexistente/` roda contra o container do passo anterior, então retorna `404`. — cobre FR-002, verificado por curl (mesmo comando acima antes do `docker stop`)
- **Notas:** o pin de `SKILLS_REF` é o motivo do build funcionar hoje (ver seção 1); ao corrigir a categoria de `playwright-review` no repo `robertourias/skills`, atualizar o `ARG` default no Dockerfile.

### Tarefa 2: docker-compose.yml (Traefik) + runbook do primeiro deploy

- **Tipo:** chore
- **Agente:** backend
- **Depende de:** T1
- **Paralelizável com:** nenhuma
- **Arquivos:** `apps/skills/docker-compose.yml`, `docs/context/current-state.md`
- **Cobre:** FR-003, FR-004
- **Descrição:**
  Criar `apps/skills/docker-compose.yml` com um serviço `skills`: `build.context: ../..`, `build.dockerfile: apps/skills/Dockerfile`, `build.args.SKILLS_REF: ${SKILLS_REF:-e137566fc94a63c3708cc720cfa62cadc73ab5ff}`, `image: nico-skills:latest`, `container_name: skills-web`, `restart: unless-stopped`, labels Traefik (seção 5), sem `ports:`, comentário explicando o `network_mode: host` do Traefik nessa VPS (mesmo texto de `apps/api/docker-compose.prod.example.yml`) e que o nome real da rede deve ser confirmado com `docker inspect skills-web` após o primeiro `up`.

  Atualizar `docs/context/current-state.md`: mover TASK09 de "próximos passos" para registrar que Dockerfile/compose estão prontos e o próximo passo é o runbook abaixo (Pendência Manual do humano).

- **Critérios de Aceite:**
  - [ ] Dado `docker-compose.yml`, quando `docker compose -f apps/skills/docker-compose.yml config` roda, então valida sem erro e mostra os 5 labels Traefik esperados (`enable`, `rule` com `skills.nico.dev.br`, `entrypoints=websecure`, `certresolver=letsencrypt`, `loadbalancer.server.port=80`). — cobre FR-003, verificado por `docker compose -f apps/skills/docker-compose.yml config`
  - [ ] Dado o arquivo, quando revisado, então nenhuma variável de ambiente sensível é exigida (sem `DATABASE_URL`/secret nenhum — site estático). — cobre FR-003, verificado por leitura manual do arquivo (não há `.env` a validar)
  - [ ] Runbook do primeiro deploy documentado abaixo (Notas) e `docs/context/current-state.md` atualizado. — cobre FR-004, verificado por leitura do arquivo atualizado
- **Notas — Runbook do primeiro deploy (Pendência Manual, exige SSH na VPS):**
  1. Confirmar DNS: `skills.nico.dev.br` → IP da VPS (mesmo IP de `api.nico.dev.br`).
  2. Na VPS: `git clone`/`git pull` deste repo (ou `rsync` do working tree) para um diretório próprio, ex. `~/apps/nico-dev`.
  3. `cd ~/apps/nico-dev && docker compose -f apps/skills/docker-compose.yml up -d --build`.
  4. `docker inspect skills-web --format '{{json .NetworkSettings.Networks}}'` — confirmar o nome real da rede e ajustar o label `traefik.docker.network` em `docker-compose.yml` se divergir do que foi commitado; se ajustar, `docker compose -f apps/skills/docker-compose.yml up -d` de novo.
  5. Aguardar emissão do certificado Let's Encrypt (logs do Traefik) e testar `curl -svo /dev/null https://skills.nico.dev.br/` — esperar `200` e certificado válido.
  6. Smoke test manual no navegador: home carrega, busca funciona, `/s/<slug>` de uma skill abre.
  7. Marcar TASK09 `done` no backlog só depois do passo 6 confirmado.

---

## 7. Rastreabilidade

| FR | Coberto por | Verificado por |
|----|-------------|-----------------|
| FR-001 | T1 | `docker build -f apps/skills/Dockerfile -t nico-skills:test .` |
| FR-002 | T1 | `curl` contra o container rodando (home 200, rota inexistente 404) |
| FR-003 | T2 | `docker compose -f apps/skills/docker-compose.yml config` |
| FR-004 | T2 | Pendência Manual — runbook (Notas da Tarefa 2), execução real na VPS |

---

## 8. Verificação

`docs/context/guardrails.md` seção 1 está com os comandos genéricos do projeto ainda `(não configurado)` (placeholders do `/init-project`, nunca preenchidos) — esta tarefa não toca `.ts`/`.tsx`, então type-check/lint/testes automáticos do projeto não se aplicam a ela. Comandos reais usados são os de Docker/Compose, únicos disponíveis para verificar infra:

| O quê | Comando | Saída esperada |
|-------|---------|-----------------|
| Type-check | `(não aplicável — nenhum .ts/.tsx alterado nesta Spec)` | — |
| Lint | `(não aplicável — nenhum .ts/.tsx alterado nesta Spec)` | — |
| Testes | `(não configurado — sem harness de teste de infra Docker no projeto)` | — |
| Build da imagem | `docker build -f apps/skills/Dockerfile -t nico-skills:test .` | build conclui sem erro |
| Smoke-test HTTP | `docker run --rm -d -p 8080:80 --name nico-skills-smoke nico-skills:test && curl -sf http://localhost:8080/ && docker stop nico-skills-smoke` | HTML 200; container parado ao final |
| Compose válido | `docker compose -f apps/skills/docker-compose.yml config` | sem erro; labels Traefik corretos |
| Manual | Runbook da Tarefa 2 (Pendência Manual, exige SSH na VPS) | `https://skills.nico.dev.br` responde 200 com TLS válido |

> Nenhum Critério de Aceite é marcado `[x]` sem a saída real destes comandos na conversa. O passo "Manual" nunca vira `[x]` automaticamente — fica Pendência Manual até o humano confirmar.

---

## Notas de Review

<!-- Preenchido pelo /hands-on: achados 🟢/💡 da review por onda e da final,
no formato `- [onda N] arquivo:linha — texto`. Não é normativo. -->

---

## Emendas

<!-- Mudança normativa depois da aprovação (FR, tarefa, contrato, critério).
Formato: `- YYYY-MM-DD — <o que mudou> — <por quê> — <quem>`.
FR novo ou removido não é emenda: pare e escale ao humano. -->

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, rode `/approve docs/specs/2026-09-29-skills-deploy-vps.md` para liberar a implementação (ou altere o Status para approved no editor).
-->
