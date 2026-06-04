# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-03
**Resumo da última sessão:** MDX + layout imersivo no blog; filtro por tags na sidebar; acesso mobile a links de navegação em páginas de post; primeiro post publicado.

---

## Feature em andamento

**Spec ativo:** `apps/blog/docs/specs/2026-06-03-posts-rich-layout.md` (Status: approved — todas as tasks concluídas)
**Plano ativo:** `apps/blog/docs/plans/2026-06-03-posts-rich-layout.md`

---

## Tasks

### ✅ Concluídas

**packages/ui — Header Compound Components:**
- Header, Header.Logo, Header.Nav, Header.Actions, Header.Menu
- NavLink, ThemeToggle
- Portal fix para backdrop-filter stacking context
- Migração de todos os apps (tools, challenges, web, blog)

**apps/blog — MDX + Layout Imersivo (spec 2026-06-03):**
- T-01: `@astrojs/mdx@^4.3.14` + `astro.config.mjs`
- T-02: `content.config.ts` — glob `{md,mdx}`, campos `template`/`heroImage`
- T-03: prose styles extraídos para `global.css`
- T-04: `ImmersivePostLayout.astro` — hero fullbleed, gradiente, tipografia editorial
- T-05: `Callout.astro` — 4 tipos, sem JS
- T-06: `Timeline.astro` + `TimelineItem.astro`
- T-07: `mdx-components.ts` — registry de componentes
- T-08: `[slug].astro` — condicional `isImmersive`, `<style>` scoped removido
- T-09: `exemplo-imersivo.mdx` — post de validação

**apps/blog — Sidebar melhorias:**
- Filtro por tags: seção de pills com contagem, mutual exclusion com categorias
- Acordeão em Tags e Favoritos (ChevronUp/Down)
- `PostSidebar` móvel em páginas de post: seção Navegação com links SITES

**apps/blog — Conteúdo:**
- Post publicado: `pos-unipds-engenharia-ia-aplicada.md`
- `docs/context/post-generator-instructions.md` — guia de geração de posts

**Infraestrutura:**
- Next.js 16.2.1 → 16.2.6 (CVEs resolvidos)
- postcss override via `pnpm.overrides`
- Root `.env`/`.env.example` + `turbo.json` com `NEXT_PUBLIC_*` para URLs dos sites

### 🔄 Em progresso
- (nenhum — todas as tasks concluídas e commitadas)

### ⏭ Próximos passos
1. Deploy do blog no Vercel (`blog.nico.dev.br`) e testar visual em produção
2. Implementar compartilhamento social (botões Share na página do post)
3. Implementar scroll suave para âncoras no `SiteHeader.tsx` do `web-nico.dev.br`
4. Escrever mais posts usando o template imersivo
5. Lighthouse audit no post imersivo (meta: ≥ 90 Performance)

---

## Decisões desta sessão

- `@astrojs/mdx` usa v4.x (v6 requer Astro 6; blog usa Astro 5)
- Prose styles globais via `.post-content` em `global.css` — evita duplicação entre default e immersive layout
- `ImmersivePostLayout` sem sidebar; `PostSidebar` passado apenas no layout default de `[slug].astro`
- Tags e categorias são filtros mutuamente exclusivos no `BlogHome`
- `navLinks` prop opcional em `CategorySidebar` — só `PostSidebar` passa (não `BlogHome`)
- Portal (`createPortal`) no `Header.Menu` para escapar backdrop-filter stacking context

---

## Bloqueadores / Perguntas abertas

- Deploy do blog não configurado no Vercel ainda
- Scroll suave para âncoras `#about`, `#skills` etc. no `web-nico.dev.br` SiteHeader ainda pendente
- Variável `NEXT_PUBLIC_METRONOME_URL` adicionada às envs mas metronomo não tem URL de produção definida ainda
