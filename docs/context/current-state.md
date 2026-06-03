# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-02
**Resumo da última sessão:** Inicialização completa do subprojeto `apps/blog` (blog.nico.dev.br) — contexto de docs, spec, plano e implementação do MVP da home page + página de post individual.

---

## Feature em andamento

**Spec ativo:** `apps/blog/docs/specs/2026-06-02-blog-estrutura-home.md` (Status: approved — todas as tasks concluídas)
**Plano ativo:** `apps/blog/docs/plans/2026-06-02-blog-estrutura-home.md`

---

## Tasks

### ✅ Concluídas

**apps/blog — Inicialização e MVP:**
- T-01: Scaffold Astro (package.json, astro.config.mjs, tsconfig, global.css com tokens)
- T-02: Content Collections schema + 5 posts de exemplo (4 published, 1 archived)
- T-03: BaseLayout (anti-FOUC, Google Fonts: Fraunces + Instrument Sans, slot)
- T-04: ThemeToggle React island (Sun/Moon, localStorage, sem hydration mismatch)
- T-05: Header (sticky, hamburger à esquerda no mobile, social links, nav links externos)
- T-06: PostCard (tokens, Fraunces, link /posts/{slug}, hover highlight)
- T-07: CategorySidebar (desktop always-on + mobile drawer, prop drawerOnly)
- T-08: PostList (filtro client-side + IntersectionObserver infinite scroll, BATCH=10)
- T-09: BlogHome (island pai, estado compartilhado, toggle-sidebar listener)
- T-10: index.astro (getCollection, sort por data, contagem por categoria, featured)

**apps/blog — Features adicionais além do spec:**
- Light mode (paleta creme quente: bg #f2ede4, não branco puro)
- Página do post (`src/pages/posts/[slug].astro`) com prose styles, tags, date, coverImage
- PostSidebar (drawer-only no mobile para página do post)
- Schema atualizado: campos `tags` e `coverImage` opcionais
- Estilos de tabela com 12px horizontal padding nas colunas
- Links de navegação no header (nico.dev.br, tools.nico.dev.br)

### 🔄 Em progresso
- (nenhum — todas as tasks do plano foram concluídas)

### ⏭ Próximos passos
1. Commitar todo o trabalho da sessão (`apps/blog/` + `docs/` atualizados)
2. Implementar compartilhamento nas redes sociais (botões de share na página do post)
3. Criar gerador de post para LinkedIn a partir do conteúdo do post
4. Configurar deploy no Vercel para `blog.nico.dev.br`
5. Implementar filtro por categoria via URL params (`/?categoria=tech`) para que PostSidebar da página do post navegue corretamente

---

## Decisões desta sessão

- Blog usa Astro (static build) + Markdown em `src/content/posts/` — sem DB, sem backend
- Tailwind CSS v4 via `@tailwindcss/vite` (Astro é Vite-based, não PostCSS)
- Tokens definidos em `@theme {}` no CSS global — geram classes Tailwind automaticamente
- Interatividade via React islands (`client:load`): BlogHome, ThemeToggle, CategorySidebar, PostSidebar
- Estado de categoria gerenciado em BlogHome (pai); sidebar e lista são filhos controlados
- Hamburger no header dispara `CustomEvent('toggle-sidebar')` — desacopla Header do island filho
- `CategorySidebar` aceita `drawerOnly` prop: home usa sidebar desktop, post page usa só drawer
- Light mode: fundo creme (#f2ede4) + tokens de contraste reduzido — não branco puro
- Docs do blog em `apps/blog/docs/` (modelo distribuído); root `docs/` tem apenas referência

---

## Bloqueadores / Perguntas abertas

- Filtro por categoria via URL params ainda não implementado (PostSidebar navega para `/` sem preservar categoria)
- Social links LinkedIn e Twitter no `config.ts` marcados como `// TODO: confirmar URL`
- `coverImage` usa URLs externas (Unsplash) — decidir se imagens serão self-hosted em `public/`
