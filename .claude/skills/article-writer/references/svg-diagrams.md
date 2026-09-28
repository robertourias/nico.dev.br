# SVG diagrams

Every diagram is an **SVG image**. Never Mermaid or any diagram-as-code fence: the blog does not render it and the reader would see source code. This covers flowcharts, sequences, architecture, matrices, comparisons, timelines and ER diagrams.

- One diagram per idea, at most about 10 text elements per visual area. If it gets dense, split it in two SVGs.
- File: `apps/blog/public/images/<post-slug>-<diagram-name>.svg`, created with Write together with the post.
- Embed: `![alt describing the diagram's content](/images/<post-slug>-<diagram-name>.svg)`. The alt explains what the diagram shows; it does not repeat the title.
- Finish reference: `module-federation-micro-frontends-react-sequencia.svg` (sequence), `...-arquitetura.svg` (blocks and arrows), `ssr-ssg-csr-isr-estrategias-de-renderizacao-matriz.svg` (matrix), all in `apps/blog/public/images/`.

## Palette

The SVG carries its own background, so it uses literal hex values. The "no hex in components" rule applies only to `.astro` and `.tsx` files.

| Use | Fill or stroke | Text |
| --- | --- | --- |
| SVG background | `#0a0a0f` | |
| Card or box | `#111118` | |
| Neutral border | `#ffffff14` | |
| Title, strong text | | `#f0efe8` |
| Secondary text, neutral arrows | `#888898` | `#888898` |
| Primary highlight (attention point, result) | `#e8c547` | `#e8c547` |
| Secondary highlight (remotes, agents, alternative layer) | `#7b61ff` | `#a78bfa` |
| Success, shared, automation | `#0f766e` | `#2dd4bf` |

Font: `font-family="'Inter', 'Segoe UI', sans-serif"`. Cards `rx="12"` to `rx="14"`. Diagram title `font-size="20"` `font-weight="700"`; labels between 10 and 13.

Never set text in `#7b61ff` or `#0f766e`. On `#111118` they reach only 4.47:1 and 3.43:1, below the 4.5:1 WCAG AA minimum for small text. They are fine for fills, borders and arrows (3:1 is enough for graphics).

## Technical checklist

1. `viewBox` (for example `0 0 800 440`) with no fixed `width` or `height`, so it scales; `xmlns="http://www.w3.org/2000/svg"`.
2. A background `<rect>` covering the whole `viewBox`. An SVG used as `<img>` does not inherit the page background.
3. Text with margin. Estimate about 6 px per character at `font-size` 11 and about 7 px at 12. Split into several `<text>` lines instead of overflowing the box.
4. Arrow labels over a line or lifeline: `paint-order="stroke" stroke="#0a0a0f" stroke-width="4"` to open a backdrop behind the text.
5. Arrows use `<marker>` with an `id` unique per file.
6. Validate the XML: `python -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" path/to/file.svg`
7. No `<script>`, no external fonts, no base64 embedded images.

After validating, tell the user to check the rendering in `pnpm dev`, since text can still overflow a card.
