# Build context: RAIZ do monorepo, não apps/api — porque apps/api faz parte do
# workspace pnpm e precisa do lockfile da raiz. Exemplo:
#   docker build -f apps/api/Dockerfile -t nico-api .
#
# Ver docs/specs/2026-06-25-api-claps-backend.md e docs/plans/2026-06-25-api-claps-backend.md (T-05).

FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --frozen-lockfile --filter @nico.dev/api...

FROM deps AS build
COPY apps/api apps/api
RUN pnpm --filter @nico.dev/api prisma:generate
RUN pnpm --filter @nico.dev/api build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo/node_modules /repo/node_modules
WORKDIR /repo/apps/api
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/prisma ./prisma
COPY --from=build /repo/apps/api/package.json ./package.json

EXPOSE 3001

# Aplica migrations pendentes (migrate deploy, nunca db push) antes de subir o processo.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main.js"]
