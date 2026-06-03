# Spec: Posts com Layout Imersivo (MDX + Rich Template)

**Data:** 2026-06-03  
**Status:** approved  
**Autor:** Beto  

---

## Contexto

Os posts atuais são arquivos `.md` renderizados em um layout padrão com sidebar. Para certos conteúdos — artigos editoriais, histórias, deep-dives — esse layout genérico desperdiça o potencial visual do conteúdo. O objetivo é permitir que um post opte por um template "imersivo": fullscreen, tipografia expressiva, sem sidebar, com suporte a componentes React inline (via MDX).

Referência visual de destino: [História da IA — Claude Artifact](https://claude.ai/public/artifacts/5bea82b3-79bc-4207-950e-362e7e94cace)

---

## Objetivos

1. Permitir que posts usem um layout imersivo (fullscreen, sem sidebar, hero image grande)
2. Suportar componentes React inline dentro do conteúdo via MDX
3. Manter compatibilidade total com posts `.md` existentes — zero breaking change
4. Não criar nova rota ou novo pipeline — o slug `/posts/[slug]` continua funcionando para ambos os formatos

---

## Fora do escopo

- Migração automática de posts `.md` existentes para `.mdx`
- Editor visual ou CMS
- Componentes interativos com estado persistente (sem banco de dados)
- Mudança nas regras de negócio existentes (archiving, checagem de conteúdo ofensivo)

---

## Decisões técnicas

### 1. MDX via `@astrojs/mdx`

Adicionar o integration `@astrojs/mdx` ao Astro. Posts que precisam de componentes React ficam em `.mdx`; posts simples continuam em `.md`. O Astro Content Collections suporta ambos — basta atualizar o `glob` pattern em `content.config.ts`.

```ts
// content.config.ts — mudança
loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' })
```

### 2. Campo `template` no frontmatter

Novo campo opcional no schema. Valores possíveis:

| Valor | Comportamento |
|-------|---------------|
| `"default"` (ou ausente) | Layout atual — sidebar, max-width 70ch, header padrão |
| `"immersive"` | Layout fullscreen, sem sidebar, hero image grande, tipografia editorial |

```yaml
# Frontmatter do post imersivo
template: "immersive"
heroImage: "/images/historia-ia-hero.jpg"  # opcional, diferente de coverImage
```

### 3. Roteamento — sem nova rota

O `[slug].astro` existente continua como ponto de entrada único. Internamente, ele lê `post.data.template` e decide qual layout renderizar:

```astro
---
const layout = post.data.template === 'immersive' ? 'immersive' : 'default';
---

{layout === 'immersive' ? (
  <ImmersivePostLayout {post}>
    <Content />
  </ImmersivePostLayout>
) : (
  <!-- layout atual -->
)}
```

### 4. Layout imersivo — estrutura visual

```
┌─────────────────────────────────────────────────────┐
│  Hero fullbleed (100vw, ~60vh)                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Gradiente overlay escuro                        │ │
│  │  Categoria · tempo de leitura                   │ │
│  │  H1 — Fraunces, grande (clamp 2.5rem–5rem)      │ │
│  │  Descrição                                      │ │
│  └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│  Conteúdo — max-width 75ch, centralizado            │
│  sem sidebar                                        │
│  tipografia levemente maior (body 1.125rem)         │
│  suporte a componentes MDX inline                   │
├─────────────────────────────────────────────────────┤
│  Footer com tags + link "Todos os posts"            │
└─────────────────────────────────────────────────────┘
```

Tokens existentes mantidos — sem novos tokens de cor.

### 5. Componentes MDX disponíveis

Um arquivo `src/content/mdx-components.ts` exporta os componentes que podem ser usados dentro de posts `.mdx` sem import explícito:

```ts
export const mdxComponents = {
  Callout,      // bloco de destaque/alerta editorial
  Timeline,     // linha do tempo visual
  Comparison,   // tabela comparativa estilizada
  // (expandível conforme demanda)
}
```

Cada componente deve: aceitar apenas dados via props (sem fetch interno), usar os design tokens do blog, e funcionar sem JavaScript quando possível (preferência por Astro components; React island só se houver interatividade).

---

## Schema atualizado

```ts
// content.config.ts
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
    heroImage: z.string().optional(), // usado apenas em template: immersive
  }),
});
```

---

## Arquivos a criar/modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `astro.config.ts` | modificar | Adicionar `@astrojs/mdx` nas integrations |
| `src/content.config.ts` | modificar | Atualizar glob pattern e schema |
| `src/pages/posts/[slug].astro` | modificar | Condicionar layout por `post.data.template` |
| `src/layouts/ImmersivePostLayout.astro` | criar | Novo layout fullscreen |
| `src/content/mdx-components.ts` | criar | Registro de componentes para MDX |
| `src/components/mdx/Callout.astro` | criar | Primeiro componente MDX |
| `src/components/mdx/Timeline.astro` | criar | Componente de linha do tempo |
| `src/content/posts/exemplo-imersivo.mdx` | criar | Post de exemplo/validação do template |

---

## Critérios de aceite

- [ ] Posts `.md` existentes renderizam identicamente ao comportamento atual
- [ ] Um post `.mdx` com `template: "immersive"` renderiza no novo layout ao acessar `/posts/[slug]`
- [ ] O hero image ocupa 100% da largura sem overflow horizontal
- [ ] Os componentes `Callout` e `Timeline` renderizam corretamente dentro de um `.mdx`
- [ ] Build do Astro (`astro build`) conclui sem erros
- [ ] A página imersiva tem score Lighthouse ≥ 90 em Performance (build de produção)
- [ ] Não há regressão visual nos posts existentes (smoke test manual nas 5 categorias)

---

## Dependências e riscos

| Item | Risco | Mitigação |
|------|-------|-----------|
| `@astrojs/mdx` | Versão pode conflitar com Astro 5 | Verificar compatibilidade antes de instalar |
| React islands dentro de MDX | Hidratação pode afetar LCP | Preferir `client:visible` ou `client:idle` |
| Glob `{md,mdx}` no Content Collections | Slugs duplicados se existir `post.md` e `post.mdx` | Garantir nomes únicos; adicionar validação de CI |
