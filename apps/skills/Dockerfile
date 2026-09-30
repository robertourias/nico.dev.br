# Build context: RAIZ do monorepo, não apps/skills — porque apps/skills faz parte do
# workspace pnpm e precisa do lockfile da raiz. Exemplo:
#   docker build -f apps/skills/Dockerfile -t nico-skills .
#
# Ver docs/specs/2026-09-29-skills-deploy-vps.md (T1).

FROM node:22-alpine AS base
# git é necessário pro `git clone` raso do repo robertourias/skills (content:sync).
RUN apk add --no-cache git
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/skills/package.json apps/skills/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --frozen-lockfile --filter @nico.dev/skills...

FROM deps AS build
# Pin no último commit bom de robertourias/skills antes de `playwright-review` ganhar
# `metadata.category: testing` — valor fora da tupla CATEGORIES de
# apps/skills/catalog.config.ts (documentation, design, writing, product, engineering).
# Com SKILLS_REF=main esse commit quebra build-registry.ts (categoria inválida).
# Ao corrigir a categoria no repo robertourias/skills, atualizar este default.
ARG SKILLS_REF=e137566fc94a63c3708cc720cfa62cadc73ab5ff
ENV SKILLS_REF=${SKILLS_REF}
COPY apps/skills apps/skills
COPY packages packages
RUN pnpm --filter @nico.dev/skills content:sync
RUN pnpm --filter @nico.dev/skills registry
RUN pnpm --filter @nico.dev/skills build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /repo/apps/skills/out /usr/share/nginx/html
COPY apps/skills/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
