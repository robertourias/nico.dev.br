# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-03
**Resumo da última sessão:** Implementação completa de Header compound components em `packages/ui` com migração de todos os apps; correção de vulnerabilidades Dependabot (next 16.2.6 + postcss override).

---

## Feature em andamento

**Spec ativo:** `docs/specs/2026-06-03-ui-header-compound.md` (Status: approved — todas as tasks concluídas)
**Plano ativo:** `docs/plans/2026-06-03-ui-header-compound.md`

---

## Tasks

### ✅ Concluídas

**packages/ui — Header Compound Components (T-01 a T-06):**
- T-01: `ThemeToggle` — SSR-safe, `.dark` class toggle, lucide Sun/Moon
- T-02: `NavLink` — href, external, active props; canonical tokens
- T-03: `Header.Logo`, `Header.Nav`, `Header.Actions` — sub-components estruturais
- T-04: `Header.Menu` — side drawer híbrido (controlled/uncontrolled), lado configurável (left/right), body scroll lock, close-on-link-click, portal para escapar backdrop-filter stacking context
- T-05: `Header` root — scrollAware prop, borderColor prop, sticky/fixed modes
- T-06: Exports em `packages/ui/src/index.ts`

**packages/ui — Storybook (T-07):**
- Stories: Header (Minimal, WithNav, WithMenu, WithSocialLinks, ScrollAware), NavLink, ThemeToggle
- `preview-body.html` — reset min-height em html/body/#storybook-root

**apps/tools — Migração (T-10):**
- `SiteHeader.tsx` reescrito com `Header` compound; `theme-toggle.tsx` local deletado
- URLs das envs `NEXT_PUBLIC_*` com fallbacks

**apps/challenges — Migração (T-11):**
- `SiteHeader.tsx` criado com `Header scrollAware`, social links, nav links via envs
- `layout.tsx` atualizado para incluir `<SiteHeader />`

**apps/blog — Migração (T-08 + T-09):**
- `global.css` migrado: importa `@nico.dev/ui/tokens.css`, paleta blog canônica, `--accent`/`--ring` adicionados, `@source` para packages/ui
- `astro.config.mjs` com Vite `define` para expor vars aos React islands
- `config.ts` com `SITES` config via `__DEFINE__` vars
- `BlogHeader.tsx` criado como React island (sem Header.Menu — hamburguer dispara `toggle-sidebar` diretamente)
- `Header.astro` e `ThemeToggle.tsx` locais deletados
- Anti-FOUC atualizado: dark-default via `class="dark"` + script remove `.dark` se `localStorage.theme === 'light'`

**apps/web-nico.dev.br — Migração (T-12):**
- `SiteHeader.tsx` criado: `Header scrollAware`, nav i18n, LocaleSwitcher, ThemeToggle, `Header.Menu side="right"`
- `globals.css` com aliases canônicos + `@source` para packages/ui
- `Navbar.tsx` deletado; 3 páginas migradas
- `projects.ts`: `demoUrl` do metrônomo via `NEXT_PUBLIC_METRONOME_URL`

**Infraestrutura:**
- Root `.env` + `.env.example` com `NEXT_PUBLIC_*` para Portfolio, Challenges, Blog, Tools, Metronome
- `turbo.json` com `globalEnv` declarado
- `package.json` root com `pnpm.overrides` para postcss
- Next.js 16.2.1 → 16.2.6 em todos os apps; postcss override via `pnpm.overrides` (16 high + 9 medium CVEs resolvidos)
- Fix CSS parsing error: `--color-*` literal em `apps/tools/docs/plans/*.md` causava classe Tailwind inválida

### 🔄 Em progresso
- (nenhum — todas as tasks do plano foram concluídas e commitadas)

### ⏭ Próximos passos
1. Verificar se Dependabot zerou os alertas após o push de `d366ea7` (aguardar re-scan do GitHub)
2. Implementar T-12 scroll suave para âncoras (`#about`, `#skills` etc.) no `SiteHeader.tsx` do web — atualmente navega full-reload
3. Deploy de `blog.nico.dev.br` no Vercel e testar header em produção
4. Implementar compartilhamento social na página de post do blog
5. Adicionar `NEXT_PUBLIC_*` a cada `.env` local dos apps Next.js para funcionar fora do Turborepo

---

## Decisões desta sessão

- `Header.Menu` drawer usa `createPortal(drawer, document.body)` — necessário para escapar stacking context criado por `backdrop-filter` no header
- Blog usa hamburguer direto (dispara `toggle-sidebar`) sem `Header.Menu`, pois o drawer é o `CategorySidebar` — evita conflito de dois drawers simultâneos
- Tokens canônicos de `packages/ui` chegam ao blog via `@import "@nico.dev/ui/tokens.css"` + `@source` no `global.css`; blog não importa `globals.css` para não duplicar `@import "tailwindcss"`
- `NEXT_PUBLIC_` prefix nas envs (compatível com Next.js client-side e acessível no Astro via `vite.define`)
- `pnpm.overrides`: `postcss >= 8.5.10` + `next>postcss >= 8.5.10` força 8.5.14 como dep interna do Next.js
- Tailwind v4: `@source` necessário em cada app que importa `tokens.css` (não `globals.css`) para que Tailwind escaneie componentes de packages/ui

---

## Bloqueadores / Perguntas abertas

- Scroll suave para âncoras `#about`, `#skills` etc. no `SiteHeader.tsx` do web não migrado (declarado fora do escopo no plano, mas ainda necessário)
- Social links no header do blog não têm Twitter/X — `SOCIAL.twitter` removido do `BlogHeader.tsx`; confirmar se deve voltar
- `LocaleSwitcher` usa tokens Material (`text-on-surface-variant`) — não migrado para canônico; header do web usa tokens corretos mas LocaleSwitcher tem suas próprias classes
