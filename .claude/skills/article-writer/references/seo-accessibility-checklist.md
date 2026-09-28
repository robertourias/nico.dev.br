# SEO and accessibility checklist

Run after writing and before delivering. Fix each failure in the post; report only what you changed or could not fix. Targets: WCAG 2.2 level AA for content, and semantic on-page SEO. This checks the post's content; site-level items (canonical, Open Graph, sitemap) belong to the blog template, so do not claim them without seeing the rendered page.

## Semantics (serves both SEO and WCAG 1.3.1 and 2.4.6)

- The template renders `title` as the only `<h1>`. The body starts at `##` and never uses `#`.
- Heading levels never skip (`##` then `###`, never `##` then `####`). Do not pick a level for its size.
- Every heading describes its section on its own (`Como o Module Federation resolve dependências`, not `Detalhes`). Use the natural wording a reader would search for.
- Steps in order are a numbered list; unordered sets are bullets; comparisons are a table with a header row. Do not fake structure with bold lines, ASCII art or spaces.
- Code blocks declare the language.

## SEO

- **Title**: at most 60 characters, main topic in the first words, unique across the blog.
- **Description**: 110–160 characters, one sentence that states the value of the post and is not a copy of the first paragraph. It is the search snippet, so a cut-off sentence fails.
- **Slug**: short, keyword-bearing, kebab-case, no accents, no stop-word filler, unique.
- **Search intent**: name the main query the post answers in one phrase and confirm it appears in the title, the description, the first paragraph and at least one `##` heading. Use it naturally; vary the wording instead of repeating it. Do not quote search volumes or rankings; you have no data.
- **First paragraph** states the topic or the answer immediately (this also matches the voice rules).
- **Links**: descriptive anchor text (`documentação do Astro sobre content collections`, never `clique aqui` or a bare URL). Link to related posts only after confirming their slugs exist; link primary sources for claims.
- **Tags**: 2–5, kebab-case, specific. Categories are broad, tags are specific; do not repeat one as the other.
- **Images**: `coverImage` or `heroImage` path has a descriptive file name in kebab-case. Cover and hero images carry no essential text.

## Accessibility (WCAG 2.2 AA)

- **1.1.1 Text alternatives**: every image has alt text that conveys its content or purpose, not `imagem` or `diagrama`. For a diagram, alt states what it shows and the main takeaway; if the diagram is complex, the surrounding prose also states that takeaway, because the SVG text is not available to screen readers as prose. A purely decorative image gets `![]()`.
- **1.3.1 Info and relationships**: see Semantics. Tables have a header row and no merged-cell layouts.
- **1.4.1 Use of color**: meaning is never carried by color alone in diagrams or callouts. Pair color with a label, shape or line style, and make sure a `<Callout>` reads correctly without its color or icon.
- **1.4.3 Contrast** and **1.4.11 Non-text contrast**: SVG text is at least 4.5:1 against its background (3:1 for text of 18 px or larger, or 14 px bold); arrows, borders and shapes that carry meaning are at least 3:1. Use the text colors from the palette in `svg-diagrams.md`; never `#7b61ff` or `#0f766e` for text.
- **1.4.4 Resize** and **1.4.10 Reflow**: SVGs keep a `viewBox` without fixed size and keep text at a readable size (labels of at least 10 px at the `viewBox` scale) so they still work when scaled to a narrow column.
- **2.4.4 Link purpose**: a link's text alone says where it goes.
- **Plain, scannable text**: define acronyms on first use, keep paragraphs short, avoid ALL CAPS for emphasis and emoji as content.
