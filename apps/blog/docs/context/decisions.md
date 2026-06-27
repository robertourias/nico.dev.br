# Decisões Técnicas — blog.nico.dev.br

Escolhas técnicas do blog. Separadas por domínio.

## Stack

- Astro (build estático) — sem Next.js, sem NestJS, sem banco de dados para o conteúdo do blog
- Posts como arquivos `.md` no repositório (`src/content/posts/`)
- TypeScript habilitado para componentes Astro e scripts
- **Exceção (claps, 2026-06-25):** via `@astrojs/vercel`, só a rota `/api/claps/[slug]` deixa de ser estática (`prerender = false`) — todo o resto do site continua 100% pré-renderizado. Essa rota **não tem nenhum cliente de banco de dados** — ela só mantém o cookie `nico_uid` (first-party) e faz uma chamada HTTP para `apps/api` (backend NestJS na VPS do Beto, com Postgres + Redis próprios, nunca expostos publicamente). Ver `docs/specs/2026-06-25-claps.md` (histórico das três revisões) e `docs/specs/2026-06-25-api-claps-backend.md` na raiz (arquitetura final).

## Conteúdo

- Gerenciamento de posts via sistema de arquivos (Markdown + frontmatter)
- Frontmatter obrigatório: `title`, `slug`, `date`, `category`, `status` (`published` | `archived`)
- **Posts não podem ser deletados** — status `archived` oculta o post sem remover o arquivo
- Categorias definidas em código — não dinâmicas

## Qualidade de conteúdo

- Checagem de palavras e frases ofensivas obrigatória antes de qualquer publicação
- Implementada como validação no CI/CD (script de lint de conteúdo no pipeline)

## Frontend

- Estilização: Tailwind CSS — sem CSS Modules, sem styled-components
- Componentes: shadcn/ui (adaptado para Astro/React islands quando necessário)
- Ícones: Lucide React
- Estado global: nenhum entre páginas estáticas — única exceção é o contador de claps, isolado na rota `/api/claps/[slug]`, que delega a persistência para `apps/api` via HTTP
- Fontes: Fraunces (títulos) + Instrument Sans (corpo)
- Ver tokens completos em `docs/context/ui-guidelines.md`

## Deploy

- Vercel integração direta com GitHub — push na branch `main` dispara build e deploy automático
- Sem GitHub Actions customizado
- Preview deployments automáticos para pull requests

## Monetização / Terceiros

- Google Adsense e espaços de afiliados são slots definidos em componentes — não hard-coded em posts
- Configuração de ads centralizada para facilitar ativar/desativar por categoria
