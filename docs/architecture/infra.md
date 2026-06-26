# Infrastructure

> Ambiente, deploy e dependências externas.

## Ambientes

| Ambiente | URL | Deploy trigger |
|----------|-----|---------------|
| Development | localhost | manual |
| Production | nico.dev / *.nico.dev | push to main (Vercel) |

## Hosting

- Frontend (Next.js): Vercel
- Backend (NestJS): Railway — **exceção:** `apps/api` (primeira implementação real, claps do blog) está na VPS própria do Beto (Hostinger, Docker), não Railway. Ver `docs/specs/2026-06-25-api-claps-backend.md` e `docs/context/decisions.md` (seção "API"). Railway continua sendo o destino padrão para backends futuros sem motivo para usar essa VPS específica.
- Banco de dados (PostgreSQL): Railway — mesma exceção acima: o Postgres de `apps/api` está na VPS, na rede Docker interna do app, sem porta publicada para a internet.
- Subprojetos (Next.js): Vercel (subdomínios separados)
- `apps/blog` (Astro): Vercel — consome `apps/api` via HTTPS (`api.nico.dev.br`), não acessa Postgres/Redis diretamente

## CI/CD

GitHub Actions — CI bloqueia merge se lint ou type-check falhar.

## Variáveis de ambiente obrigatórias

| Variável | Descrição | Ambientes |
|----------|-----------|-----------|
| DATABASE_URL | Connection string PostgreSQL | staging, prod |
| NEXTAUTH_SECRET | Secret para NextAuth | prod |
| NEXTAUTH_URL | URL base da aplicação | prod |
| RESEND_API_KEY | API key do Resend (formulário de contato) | prod |
| ANTHROPIC_API_KEY | API key Anthropic (chat IA) | prod |
| CLAPS_API_URL (apps/blog) | URL pública de `apps/api` (ex. `https://api.nico.dev.br/api/v1`) | prod, preview |
| CLAPS_API_SECRET (apps/blog e apps/api) | Secret compartilhado entre blog e api (header `X-Internal-Secret`) | prod, preview |
| DATABASE_URL (apps/api) | Connection string PostgreSQL — endereço interno Docker na VPS, não público | prod |
| REDIS_URL (apps/api) | Connection string Redis — endereço interno Docker na VPS, não público | prod |

## Serviços externos

| Serviço | Propósito | Crítico? |
|---------|-----------|----------|
| Vercel | Hosting do frontend (Next.js) e do blog (Astro) | Sim |
| Railway | Hosting do backend e banco de dados (padrão para futuros backends) | Sim |
| VPS própria (Hostinger) | Hosting de `apps/api` (NestJS) + Postgres + Redis para claps do blog — exceção a Railway | Sim, para a feature de claps |
| GitHub Actions | CI/CD | Sim |
| Redis | Cache / rate limit (`apps/api`) | Não (MVP pode operar sem) |
| Resend | Envio de e-mails (formulário de contato) | Não |
| Anthropic | API para chat IA | Não |
