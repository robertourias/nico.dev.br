# Plano: Posts com Layout Imersivo (MDX + Rich Template)

**Spec:** `apps/blog/docs/specs/2026-06-03-posts-rich-layout.md`
**Status:** ready
**Data:** 2026-06-03

---

## Contexto técnico

### Estado atual relevante

| Arquivo | Estado |
|---------|--------|
| `astro.config.mjs` | Tem `react()` e `sitemap()`. Sem `mdx()`. |
| `content.config.ts` | glob `**/*.md` apenas. Schema sem `template` / `heroImage`. |
| `[slug].astro` | Layout único — sem condicional de template. Prose styles em `<style>` scoped. |
| `package.json` | `@astrojs/mdx` não instalado. |

### Dependência de compatibilidade
`@astrojs/mdx` v4.x suporta Astro 5 (blog usa `"astro": "^5.0.0"`). Confirmar na instalação.

### Passagem de componentes MDX
Em Astro Content Collections, componentes são passados ao `<Content />` via prop `components`:
```astro
const { Content } = await render(post);
<Content components={mdxComponents} />
```
Para arquivos `.md`, `components` é ignorado silenciosamente — zero breaking change.

### Extração de prose styles
Os estilos de `.post-content :global(...)` estão atualmente scoped em `[slug].astro`. Para o `ImmersivePostLayout` reusar os mesmos estilos sem duplicação, serão movidos para `global.css` como seletor de classe (não scoped).

---

## Tarefas

---

## T-01: Instalar `@astrojs/mdx` e configurar Astro

**Tipo:** chore
**Agente:** frontend

**8a. Instalar:**
```bash
pnpm add @astrojs/mdx --filter @nico.dev/blog
```

**8b. Adicionar ao `astro.config.mjs`:**
```js
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [react(), mdx(), sitemap()],
  // ... resto inalterado
});
```

> `mdx()` deve vir antes de `sitemap()` para que o sitemap inclua rotas geradas via MDX.

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/blog build` passa sem erros após a instalação.
- [ ] Nenhum post `.md` existente quebra.

---

## T-02: Atualizar `content.config.ts` — glob e schema

**Tipo:** feature
**Agente:** frontend

Modificar `apps/blog/src/content.config.ts`:

```ts
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['tech', 'ia', 'organizacao', 'qualidade-de-vida']),
    status: z.enum(['published', 'archived']),
    featured: z.boolean().default(false),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    // Novos campos:
    template: z.enum(['default', 'immersive']).default('default'),
    heroImage: z.string().optional(),
  }),
});
```

**Critérios de aceite:**
- [ ] `post.data.template` tipado como `'default' | 'immersive'` no TypeScript.
- [ ] Posts existentes sem `template` no frontmatter resolvem para `'default'` (via `.default('default')`).
- [ ] `pnpm typecheck` no blog passa.

---

## T-03: Extrair prose styles para `global.css`

**Tipo:** refactor
**Agente:** frontend

Mover os estilos `<style>` scoped de `[slug].astro` para `apps/blog/src/styles/global.css` como seletor de classe `.post-content`:

```css
/* ─── Post prose styles ─────────────────────────────────────────── */
/* Usado em [slug].astro e ImmersivePostLayout.astro */

.post-content h2 { ... }
.post-content h3 { ... }
/* ... todos os seletores atuais, sem :global() wrapper */
```

Em `[slug].astro`, remover o bloco `<style>` completo. A classe `.post-content` no `<article>` já existe — CSS global se aplica automaticamente.

> **Por quê extrair:** Evitar duplicação quando `ImmersivePostLayout.astro` precisar dos mesmos estilos.

**Critérios de aceite:**
- [ ] Visual do post default idêntico ao anterior (smoke test).
- [ ] Nenhum `<style>` scoped remanescente em `[slug].astro`.

---

## T-04: Criar `src/layouts/ImmersivePostLayout.astro`

**Tipo:** feature
**Agente:** frontend

Criar `apps/blog/src/layouts/ImmersivePostLayout.astro`:

**Props da interface:**
```ts
interface Props {
  title: string;
  description: string;
  date: Date;
  category: string;
  tags: string[];
  heroImage?: string;
  readTime: number;
  categoryLabel: string;
}
```

**Estrutura visual:**

```astro
---
// imports: BaseLayout, BlogHeader, CATEGORY_LABELS, readingTime
---

<BaseLayout {title} {description}>
  <BlogHeader client:load />

  <!-- Hero fullbleed -->
  <div class="relative w-full" style="height: clamp(50vh, 60vh, 70vh);">
    {heroImage ? (
      <img src={heroImage} alt="" aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div class="absolute inset-0" style="background-color: var(--surface);" />
    )}
    <!-- Gradient overlay -->
    <div class="absolute inset-0"
      style="background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);" />

    <!-- Text over hero -->
    <div class="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-[75ch] mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xs font-medium uppercase tracking-wide text-white/80">
          {categoryLabel}
        </span>
        <span class="text-xs text-white/60">{readTime} min de leitura</span>
      </div>
      <h1 class="font-heading font-semibold leading-tight text-white"
        style="font-size: clamp(2rem, 5vw, 4rem);">
        {title}
      </h1>
      <p class="mt-4 text-white/80 leading-relaxed" style="font-size: 1.125rem;">
        {description}
      </p>
    </div>
  </div>

  <!-- Conteúdo -->
  <div class="max-w-[75ch] mx-auto px-6 py-12 lg:py-16">
    <article class="post-content immersive-content">
      <slot />
    </article>

    <!-- Footer -->
    <footer class="mt-12 pt-8 border-t" style="border-color: var(--color-border);">
      {tags.length > 0 && (
        <div class="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <span class="text-xs px-2 py-0.5 rounded-full border"
              style="color: var(--color-text-body); border-color: var(--color-border);">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <a href="/" class="inline-flex items-center gap-1.5 text-sm transition-colors"
        style="color: var(--color-text-body);">
        ← Todos os posts
      </a>
    </footer>
  </div>
</BaseLayout>

<style>
  .immersive-content :global(p) {
    font-size: 1.125rem; /* levemente maior que o default (1.0625rem) */
  }
</style>
```

**Critérios de aceite:**
- [ ] Hero ocupa 100% da largura sem overflow horizontal em mobile e desktop.
- [ ] Sem `heroImage`: fundo sólido (sem quebra visual).
- [ ] Texto do hero legível sobre a imagem (gradiente escuro).
- [ ] Conteúdo centralizado em `max-w-[75ch]`.

---

## T-05: Criar componentes MDX — `Callout.astro`

**Tipo:** feature
**Agente:** frontend

Criar `apps/blog/src/components/mdx/Callout.astro`:

```ts
interface Props {
  type?: 'info' | 'tip' | 'warning' | 'note';
}
```

**Visual:** borda lateral colorida + ícone + slot de conteúdo. Cores via CSS vars do blog.

```astro
---
const { type = 'info' } = Astro.props;

const styles = {
  info:    { border: 'var(--primary)', icon: 'ℹ' },
  tip:     { border: 'var(--color-text-highlight)', icon: '💡' },
  warning: { border: '#c96d00', icon: '⚠' },
  note:    { border: 'var(--color-text-body)', icon: '📝' },
};

const s = styles[type];
---

<aside
  class="my-6 rounded-lg p-4 pl-5"
  style={`border-left: 3px solid ${s.border}; background-color: var(--surface);`}
>
  <div class="flex items-start gap-3">
    <span aria-hidden="true">{s.icon}</span>
    <div class="post-content" style="font-size: 0.9375rem;">
      <slot />
    </div>
  </div>
</aside>
```

**Critérios de aceite:**
- [ ] `<Callout type="warning">texto</Callout>` renderiza em `.mdx` sem JavaScript.
- [ ] Funciona em dark e light mode (usa CSS vars).

---

## T-06: Criar componentes MDX — `Timeline.astro` + `TimelineItem.astro`

**Tipo:** feature
**Agente:** frontend

**`Timeline.astro`** — wrapper com `<slot>`:
```astro
<div class="my-8 relative border-l-2 pl-6" style="border-color: var(--color-border);">
  <slot />
</div>
```

**`TimelineItem.astro`** — item individual:
```ts
interface Props {
  date: string;
  title: string;
}
```

```astro
---
const { date, title } = Astro.props;
---
<div class="mb-8 relative">
  <!-- Dot -->
  <div class="absolute -left-9 w-4 h-4 rounded-full border-2 mt-0.5"
    style="background-color: var(--surface); border-color: var(--primary);"></div>

  <span class="text-xs font-mono" style="color: var(--color-text-highlight);">{date}</span>
  <h3 class="font-heading font-semibold mt-1 mb-2" style="color: var(--color-text-heading);">
    {title}
  </h3>
  <div style="color: var(--color-text-body);">
    <slot />
  </div>
</div>
```

**Uso em `.mdx`:**
```mdx
<Timeline>
  <TimelineItem date="2020" title="Início">Conteúdo aqui.</TimelineItem>
  <TimelineItem date="2023" title="Evolução">Mais conteúdo.</TimelineItem>
</Timeline>
```

**Critérios de aceite:**
- [ ] Linha vertical conecta os items corretamente.
- [ ] Funciona sem JavaScript.

---

## T-07: Criar `src/content/mdx-components.ts`

**Tipo:** feature
**Agente:** frontend

Criar `apps/blog/src/content/mdx-components.ts`:

```ts
import Callout from '@/components/mdx/Callout.astro';
import Timeline from '@/components/mdx/Timeline.astro';
import TimelineItem from '@/components/mdx/TimelineItem.astro';

export const mdxComponents = {
  Callout,
  Timeline,
  TimelineItem,
};
```

> Componentes Astro podem ser passados ao `<Content components={...} />` de MDX em Astro 5.

**Critérios de aceite:**
- [ ] Importação sem erros de TypeScript.
- [ ] `mdxComponents` exportado corretamente como objeto.

---

## T-08: Atualizar `[slug].astro` — condicional de layout

**Tipo:** feature
**Agente:** frontend

Modificar `apps/blog/src/pages/posts/[slug].astro`:

**Imports a adicionar:**
```ts
import ImmersivePostLayout from '@/layouts/ImmersivePostLayout.astro';
import { mdxComponents } from '@/content/mdx-components';
```

**Extrair `template` do frontmatter:**
```ts
const { title, description, date, category, tags, coverImage, template, heroImage } = post.data;
const isImmersive = template === 'immersive';
```

**Atualizar render:**
```ts
const { Content } = await render(post);
// Passagem de componentes funciona para .mdx; .md ignora silenciosamente
```

**Estrutura condicional:**
```astro
{isImmersive ? (
  <ImmersivePostLayout
    {title} {description} {date} {category} {tags}
    {heroImage} readTime={readTime} {categoryLabel}
  >
    <Content components={mdxComponents} />
  </ImmersivePostLayout>
) : (
  <BaseLayout {title} {description}>
    <BlogHeader client:load />
    <PostSidebar client:load {categories} {featuredPosts} />
    <!-- ... resto do layout atual ... -->
    <article class="post-content">
      <Content components={mdxComponents} />
    </article>
    <!-- ... -->
  </BaseLayout>
)}
```

**Critérios de aceite:**
- [ ] Posts `.md` existentes renderizam idênticos ao atual (template = default).
- [ ] Post `.mdx` com `template: "immersive"` usa `ImmersivePostLayout`.
- [ ] `pnpm typecheck` no blog passa.

---

## T-09: Criar post de exemplo `.mdx`

**Tipo:** feature
**Agente:** frontend

Criar `apps/blog/src/content/posts/exemplo-imersivo.mdx`:

```mdx
---
title: "O Futuro da IA: Uma Jornada"
slug: "exemplo-imersivo"
date: "2026-06-03"
category: "ia"
status: "published"
featured: false
description: "Um exemplo de post com layout imersivo, hero image e componentes MDX inline."
tags: ["ia", "futuro", "exemplo"]
template: "immersive"
heroImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80"
---

Este é um post com **layout imersivo**. O hero image cobre toda a largura da tela e o conteúdo aparece centralizado abaixo.

## O que mudou

<Callout type="info">
  Este layout é ideal para artigos editoriais, histórias e deep-dives que merecem uma apresentação visual mais expressiva.
</Callout>

## Linha do tempo

<Timeline>
  <TimelineItem date="2020" title="GPT-3 muda o jogo">
    A OpenAI lança o GPT-3, com 175 bilhões de parâmetros. LLMs deixam de ser pesquisa acadêmica.
  </TimelineItem>
  <TimelineItem date="2022" title="ChatGPT para o público">
    Interface conversacional acessível. 100 milhões de usuários em 2 meses.
  </TimelineItem>
  <TimelineItem date="2024" title="Agentes autônomos">
    Modelos que executam tarefas de forma autônoma. Claude Code, Cursor, Devin.
  </TimelineItem>
</Timeline>

<Callout type="tip">
  Você pode criar posts imersivos adicionando `template: "immersive"` no frontmatter e usando os componentes MDX disponíveis.
</Callout>

## Conclusão

O layout imersivo permite contar histórias com mais impacto visual, sem abrir mão da consistência do design system do blog.
```

**Critérios de aceite:**
- [ ] `/posts/exemplo-imersivo` renderiza no layout imersivo.
- [ ] `Callout` e `Timeline`/`TimelineItem` aparecem estilizados.
- [ ] Build passa sem erros.

---

## Ordem de execução

```
T-01  instalar @astrojs/mdx + configurar               (bloqueante — pré-requisito)
T-02  content.config.ts (glob + schema)                (depende de T-01)
T-03  extrair prose styles para global.css             (independente, pode ser paralelo com T-02)
T-04  ImmersivePostLayout.astro                        (depende de T-03)
T-05  Callout.astro                                    (independente de T-04)
T-06  Timeline.astro + TimelineItem.astro              (independente de T-04)
T-07  mdx-components.ts                               (depende de T-05 e T-06)
T-08  [slug].astro — condicional de layout             (depende de T-02, T-04, T-07)
T-09  exemplo-imersivo.mdx                             (depende de T-08)
```

---

## Riscos de implementação

| Risco | Mitigação |
|-------|-----------|
| `@astrojs/mdx` incompatível com Astro 5 | Verificar versão na instalação; se necessário, usar `@astrojs/mdx@latest` |
| Componentes Astro não suportados como `components` no MDX | Verificar docs Astro 5 — se não suportados, converter para React |
| Slug duplicado (`.md` + `.mdx` com mesmo nome) | Garantir nomes únicos; `content.config.ts` lançará erro de build se houver colisão |
| Prose styles extraídos quebrando especificidade CSS | Testar smoke em todos os posts existentes após T-03 |
| `heroImage` externa (Unsplash) com timeout em CI | Adicionar `loading="lazy"` e fallback; considerar self-hosted em iteração futura |
