# Decisões Técnicas — blog.nico.dev.br

Escolhas técnicas do blog. Separadas por domínio.

## Stack

- Astro (build estático) — sem Next.js, sem NestJS, sem banco de dados
- Posts como arquivos `.md` no repositório (`src/content/posts/`)
- TypeScript habilitado para componentes Astro e scripts

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
- Estado global: nenhum — blog é estático, sem estado compartilhado entre páginas
- Fontes: Fraunces (títulos) + Instrument Sans (corpo)
- Ver tokens completos em `docs/context/ui-guidelines.md`

## Deploy

- Vercel integração direta com GitHub — push na branch `main` dispara build e deploy automático
- Sem GitHub Actions customizado
- Preview deployments automáticos para pull requests

## Monetização / Terceiros

- Google Adsense e espaços de afiliados são slots definidos em componentes — não hard-coded em posts
- Configuração de ads centralizada para facilitar ativar/desativar por categoria
