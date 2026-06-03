# Plano: Estrutura do Projeto Astro e Página Inicial

**Spec:** `apps/blog/docs/specs/2026-06-02-blog-estrutura-home.md`
**Status:** ready
**Data:** 2026-06-02
**Escopo:** `apps/blog/`

---

## Bounded Context

`Blog` — app puramente frontend, estático. Sem backend, sem banco, sem auth.
Posts são arquivos `.md` lidos em build time via Astro Content Collections.
Interatividade (filtro, infinite scroll, drawer, tema) via React islands.

---

## Arquitetura de componentes

```
index.astro
  └── BaseLayout.astro         ← HTML boilerplate, fonts, CSS vars, tema
        ├── Header.astro        ← sticky, logo, social links
        │     └── <ThemeToggle client:load />   ← React island
        └── <BlogHome client:load />            ← React island pai (gerencia estado)
              ├── <CategorySidebar />           ← lista categorias + favoritos + drawer mobile
              └── <PostList />                  ← filtra + infinite scroll
                    └── <PostCard />            ← card de post
```

**Por que BlogHome como island pai:** filtro de categoria é estado compartilhado entre sidebar e lista. Uma única island evita prop drilling entre islands separadas.

---

## Tarefas

---

### T-01: Scaffold do projeto Astro
Tipo: chore
Agente: frontend

Inicializar aplicação Astro em `apps/blog/` com as dependências:

```
astro
@astrojs/react
@astrojs/sitemap
react react-dom
@types/react @types/react-dom
typescript
tailwindcss @tailwindcss/vite
lucide-react
```

Configurações obrigatórias:
- `astro.config.mjs`: integrar `@astrojs/react`, `@astrojs/sitemap`, Tailwind via `@tailwindcss/vite`
- `tailwind.config` (ou CSS global): registrar design tokens como variáveis CSS e classes Tailwind:
  - `--color-bg: #0a0a0f`
  - `--color-bg-card: #111118`
  - `--color-text-heading: #f0efe8`
  - `--color-text-body: #888898`
  - `--color-text-highlight: #e8c547`
  - `--color-text-emphasis-purple: #7b61ff`
  - `--color-border: #ffffff14`
  - `fontFamily.heading: ['Fraunces', 'serif']`
  - `fontFamily.body: ['Instrument Sans', 'sans-serif']`
  - `borderRadius.card: '16px'`
- `tsconfig.json`: paths `@/*` → `./src/*`
- `.gitignore`, `package.json` com `name: "@nico.dev/blog"`

Critérios de Aceite:
- [ ] `pnpm --filter blog dev` sobe sem erros
- [ ] `pnpm --filter blog build` gera `dist/` sem erros
- [ ] Tailwind tokens acessíveis como classes (`bg-[var(--color-bg)]` ou aliases configurados)

---

### T-02: Schema de Content Collections e posts de exemplo
Tipo: chore
Agente: frontend

Criar `src/content/config.ts` com schema Zod para posts:

```ts
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['tech', 'ia', 'organizacao', 'qualidade-de-vida']),
    status: z.enum(['published', 'archived']),
    featured: z.boolean().default(false),
    description: z.string(),
  }),
});
```

Criar 5 posts de exemplo em `src/content/posts/` cobrindo todas as categorias (4 `published`, 1 `archived`). Frontmatter deve seguir o schema acima.

Critérios de Aceite:
- [ ] `getCollection('posts')` retorna posts sem erro de validação
- [ ] Post com `status: archived` presente nos dados brutos (para testar filtro)
- [ ] Pelo menos 1 post com `featured: true`

---

### T-03: BaseLayout
Tipo: feat
Agente: frontend

Criar `src/layouts/BaseLayout.astro`:

- `<html lang="pt-BR" class="dark">` — dark como padrão, tema controlado via classe
- `<head>`: meta charset, viewport, title (prop), description (prop), canonical
- Carregar fontes: Fraunces e Instrument Sans via Google Fonts (preconnect + link)
- Importar CSS global com variáveis de tokens e reset base
- Script inline que lê `localStorage.getItem('theme')` e aplica classe `dark`/`light` no `<html>` **antes** do paint (evita flash)
- Slot padrão para conteúdo da página

Props: `title: string`, `description: string`

Critérios de Aceite:
- [ ] Sem FOUC (flash of unstyled content) ao recarregar com tema salvo
- [ ] Fontes carregadas e aplicadas no body

---

### T-04: ThemeToggle (React island)
Tipo: feat
Agente: frontend

Criar `src/components/ThemeToggle.tsx`:

- Lê tema atual da classe do `<html>` + `localStorage`
- Alterna `dark`/`light` na classe `<html>` e persiste no `localStorage`
- Ícone `Sun` (light) / `Moon` (dark) via Lucide React
- Botão acessível com `aria-label`

Critérios de Aceite:
- [ ] Clique alterna o tema visualmente
- [ ] Tema persiste após reload (localStorage)
- [ ] Funciona com `client:load` no Header

---

### T-05: Header
Tipo: feat
Agente: frontend

Criar `src/components/Header.astro`:

- Sticky (`position: sticky; top: 0`) com `z-index` adequado
- Fundo com leve blur/opacidade para não cortar conteúdo abaixo
- Esquerda: logo/título "blog.nico.dev.br" linkando para `/`
- Centro/direita: ícones de redes sociais (GitHub, LinkedIn, Twitter) via Lucide React
- Ícone hamburger (Lucide `Menu`) para abrir sidebar no mobile — emite evento customizado `toggle-sidebar`
- `<ThemeToggle client:load />`

Critérios de Aceite:
- [ ] Header fixo durante scroll
- [ ] Botão hamburger visível apenas no mobile (< 1024px)
- [ ] Links sociais com `target="_blank" rel="noopener noreferrer"`

---

### T-06: PostCard
Tipo: feat
Agente: frontend

Criar `src/components/PostCard.tsx` (componente React puro, sem island):

Props:
```ts
interface PostCardProps {
  title: string;
  description: string;
  category: string;
  date: Date;
  slug: string;
  readingTimeMinutes: number;
}
```

Layout do card:
- Fundo `#111118`, borda `#ffffff14`, radius `16px`
- Badge de categoria com cor `#e8c547`
- Título: font-heading (Fraunces), cor `#f0efe8`
- Descrição: font-body, cor `#888898`
- Rodapé: data formatada (pt-BR) + tempo de leitura

Utilitário `readingTime(content: string): number` — ~200 palavras/minuto.

Critérios de Aceite:
- [ ] Tokens de cor aplicados (sem hex inline no JSX)
- [ ] Link do card aponta para `/posts/{slug}`
- [ ] Tempo de leitura calculado corretamente (mín. 1 min)

---

### T-07: CategorySidebar (React island)
Tipo: feat
Agente: frontend

Criar `src/components/CategorySidebar.tsx`:

Props:
```ts
interface CategorySidebarProps {
  categories: { name: string; label: string; count: number }[];
  featuredPosts: { title: string; slug: string }[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isOpen: boolean;           // controle do drawer mobile
  onClose: () => void;
}
```

Comportamento:
- Desktop (≥ 1024px): renderiza como sidebar estática (CSS `hidden lg:block`)
- Mobile (< 1024px): renderiza como overlay drawer (CSS `fixed inset-0`, slide-in)
  - Fecha ao clicar fora ou no botão X
  - Ouve evento customizado `toggle-sidebar` do Header
- Seção "Categorias": lista com botões, item ativo destacado em `#e8c547`
- Seção "Favoritos": lista de posts com `featured: true`
- Botão "Todos" (limpa filtro)

Critérios de Aceite:
- [ ] Filtro de categoria atualiza estado no pai sem reload
- [ ] Drawer abre/fecha no mobile
- [ ] Categoria ativa visualmente destacada
- [ ] "Todos" limpa o filtro

---

### T-08: PostList com infinite scroll (React island)
Tipo: feat
Agente: frontend

Criar `src/components/PostList.tsx`:

Props:
```ts
interface PostListProps {
  posts: PostCardProps[];
  selectedCategory: string | null;
}
```

Lógica:
- Filtra `posts` por `selectedCategory` (null = todos)
- Mantém estado `visibleCount` (inicial 10)
- `IntersectionObserver` no sentinel no fim da lista — incrementa `visibleCount` em 10
- Ao mudar `selectedCategory`: reseta `visibleCount` para 10
- Se lista vazia após filtro: mensagem "Nenhum post nesta categoria ainda."

Critérios de Aceite:
- [ ] Scroll até o fim carrega mais posts
- [ ] Filtrar por categoria reseta para início
- [ ] Sentinel some quando todos os posts estão visíveis

---

### T-09: BlogHome — island pai de estado
Tipo: feat
Agente: frontend

Criar `src/components/BlogHome.tsx`:

Props:
```ts
interface BlogHomeProps {
  posts: PostCardProps[];
  categories: { name: string; label: string; count: number }[];
  featuredPosts: { title: string; slug: string }[];
}
```

Estado: `selectedCategory: string | null`, `isSidebarOpen: boolean`

Layout (duas colunas no desktop, uma no mobile):
```
[CategorySidebar] [PostList]
```

Ouve evento `toggle-sidebar` disparado pelo Header para abrir/fechar sidebar no mobile.

Critérios de Aceite:
- [ ] Estado de categoria compartilhado corretamente entre sidebar e lista
- [ ] Sidebar abre via evento do Header no mobile
- [ ] Layout responsivo: 1 coluna mobile, 2 colunas desktop

---

### T-10: Página inicial (index.astro)
Tipo: feat
Agente: frontend

Criar `src/pages/index.astro`:

```ts
// 1. Buscar posts publicados da content collection
const allPosts = await getCollection('posts', ({ data }) => data.status === 'published');

// 2. Ordenar por data decrescente
// 3. Calcular contagem por categoria
// 4. Extrair posts featured
// 5. Serializar para props do island BlogHome
```

Estrutura da página:
```astro
<BaseLayout title="blog.nico.dev.br" description="...">
  <Header />
  <main>
    <BlogHome client:load posts={posts} categories={categories} featuredPosts={featured} />
  </main>
</BaseLayout>
```

Critérios de Aceite:
- [ ] Página renderiza sem erro de hidratação
- [ ] Posts `archived` ausentes na listagem
- [ ] Contagem de categorias bate com posts publicados
- [ ] `astro build` gera HTML estático sem erros

---

## Ordem de execução

```
T-01 → T-02 → T-03 → T-04 → T-05 → T-06 → T-07 → T-08 → T-09 → T-10
```

T-06, T-07 e T-08 podem ser paralelizados após T-02.
T-09 depende de T-07 e T-08.
T-10 depende de todos.

---

## Notas de infra / segurança

- Nenhuma variável de ambiente sensível neste app (site público, estático)
- `rel="noopener noreferrer"` obrigatório em todos os links externos
- Sem `dangerouslySetInnerHTML` — conteúdo Markdown renderizado via Astro built-in
