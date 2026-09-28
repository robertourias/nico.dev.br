# Post format: `.md` vs `.mdx`, frontmatter, categories, components

## Choose the format

**`.md`**: running text with at most tables and code blocks. Tutorials, opinion, comparative analysis, practical tips.

**`.mdx` with `template: "immersive"`**: historical narrative, chronological journey, evolution of ideas, or points that need strong visual emphasis (insights, warnings, key concepts). Editorial rather than technical: essays, storytelling, deep-dives.

## Frontmatter

`.md`:

```yaml
---
title: "Post Title"
slug: "post-title"              # kebab-case, unique, no accents
date: "YYYY-MM-DD"
categories: ["tech"]            # array, may hold several
status: "published"
featured: false                 # true only for an exceptional post
description: "One direct sentence with the value of the post."
tags: ["tag-one", "tag-two"]    # 2-5, kebab-case, specific enough for search
coverImage: "/images/post-title.jpg"   # optional
---
```

`.mdx` (immersive):

```yaml
---
title: "Post Title"
slug: "post-title"
date: "YYYY-MM-DD"
categories: ["ia"]
status: "published"
featured: true
description: "One sentence that captures the essence of the post."
tags: ["tag-one", "tag-two"]
template: "immersive"
heroImage: "/images/hero-name.jpg"     # 1600x900, no text in the image
---
```

Do not write reading time in the frontmatter; the blog computes it (`readingTime.ts`, 200 words per minute).

## Categories

`categories` is an array; a post can belong to several. Always list every plausible category with a short reason before closing the frontmatter. A book about architecture is `["livros", "architecture"]`; productivity with AI may be `["ia", "organizacao"]`.

| Value | Use for |
| --- | --- |
| `tech` | Code, tools, development in general |
| `ia` | AI, LLMs, AI automation |
| `organizacao` | GTD, PKM, personal systems, time management |
| `qualidade-de-vida` | Health, routine, ergonomics, dev/life balance |
| `livros` | Book summary or review; always paired with a topic category |
| `business` | Business, product, strategy |
| `dev` | Programming: language, code pattern, specific technique |
| `infra` | Infrastructure, deploy, DevOps, hosting |
| `architecture` | Software architecture, system design |
| `investimentos` | Personal finance, investing |
| `historia` | History: events, periods, historical biography |
| `filosofia` | Philosophy: schools of thought, ethics, epistemology |
| `politica` | Politics: systems of government, political economy, society |

### Creating a category

Only when no existing category covers the topic and the new one is not a synonym or subset of an existing one (do not add `dev` if `tech` covers it). Both files must change, or the build or the home filter breaks:

1. Pick a short kebab-case slug without accents (`carreira`, `design`, `dados`).
2. Add it to the `categories` enum in `src/content.config.ts`. Without it, every post using it fails with `InvalidContentEntryDataError`.
3. Add its display label to `CATEGORY_LABELS` in `src/types/post.ts` (`carreira: 'Carreira'`). Without it the category is missing from the home filter.
4. Use it in the post's `categories`.
5. Tell the user a category was created, which two files changed and on which lines. This is a code change, not only content.

To remove a category, first migrate every post that uses it, then remove it from the enum and from `CATEGORY_LABELS`.

## MDX components

Import at the top, right after the frontmatter:

```mdx
import Timeline from '@/components/mdx/Timeline.astro';
import TimelineItem from '@/components/mdx/TimelineItem.astro';
import Callout from '@/components/mdx/Callout.astro';
```

`<Timeline>` with `<TimelineItem date title>` for chronological sequences or stages of evolution:

```mdx
<Timeline>
  <TimelineItem date="2017" title="Transformers">
    Google publica *Attention Is All You Need*. O campo nunca mais foi o mesmo.
  </TimelineItem>
</Timeline>
```

`<Callout type>` for insights, warnings and notes. Types: `tip`, `warning`, `info`, `note`.

```mdx
<Callout type="warning">
  Cuidado: este comportamento mudou na versão 4.x. Verifique a documentação antes de aplicar.
</Callout>
```
