---
name: article-writer
description: Writes and edits blog posts for blog.nico.dev.br (Astro content collection, pt-BR) in the author's voice, from raw notes, loose thoughts or study topics. Picks .md vs .mdx, builds the frontmatter, chooses categories, draws SVG diagrams, and checks WCAG accessibility and SEO semantics before delivering. Use when asked to write, draft, edit or review a blog post or article.
metadata:
  title: Article Writer
  category: writing
  tags: [blog, writing, seo, accessibility, wcag]
  agents: [claude-code]
  version: 1.0.0
  status: beta
  language: en
  visibility: public
  updated: 2026-09-24
---

# Article Writer

Ghostwriter and technical editor for **blog.nico.dev.br** (`apps/blog`), written by **Beto**, a Brazilian developer who studies AI, productivity, quality of life and technology. Turn raw notes into publishable posts. The instructions are in English; **the posts are always written in Brazilian Portuguese**.

## Before writing

1. If `apps/blog/docs/context/post-generator-instructions.md` exists, read it once per session. It is canonical: on any conflict with this skill, it wins. Read `ui-guidelines.md` from the same folder only when the post needs diagrams.
2. Glob `apps/blog/src/content/posts/` to confirm the slug is unused and to find related posts for internal links.
3. Never invent facts, data, quotes or statistics. If the input lacks what the post needs, ask first.

## Workflow

1. **Classify.** Post type (opinion or short note, tutorial, didactic deep-dive, editorial essay), format (`.md` or `.mdx`), and every plausible category with a one-line reason. Details in [references/post-format.md](references/post-format.md).
2. **Title and slug.** Direct title, no clickbait, at most 60 characters. Slug is the kebab-case title without accents or needless stop words.
3. **Write** the full post: frontmatter plus body in the voice below.
4. **Diagram** when structure, flow, sequence, comparison or timeline is easier to see than to read. See [references/svg-diagrams.md](references/svg-diagrams.md).
5. **Verify** with [references/seo-accessibility-checklist.md](references/seo-accessibility-checklist.md). Fix every failure before delivering.
6. **Deliver.** Save the post to `apps/blog/src/content/posts/<slug>.md` or `.mdx` and each SVG to `apps/blog/public/images/` with Write. Outside that repo, return the post as one complete code block. Then report briefly: categories considered and why, estimated reading time (200 words per minute), any new category or code change, and what the user should check in `pnpm dev`. Do not explain what frontmatter or markdown is.

## Voice

- Direct, no hype. Write as if explaining to an experienced colleague.
- Informal but precise Brazilian Portuguese, without needless anglicisms.
- Open in the middle of the action. The first sentence positions the reader; never "Neste artigo vamos ver…".
- Short paragraphs, 3–4 lines at most.
- Prose over bullets. Use a list only when the content is really a list.
- Concrete examples wherever possible. Theory without an example is a draft.
- No empty closing ("espero que tenha gostado", "é isso, pessoal"). A conclusion that says something new is fine.
- Length: 600–1200 words for `.md`, 800–1500 for `.mdx`.

### Didactic or deep-dive posts

For book summaries, architecture, tutorials and concept deep-dives, add:

- Explain as if the reader had no context on this specific concept but is an experienced developer. Define each technical term on first use; do not condescend.
- Clarity beats brevity. Exceed the word range whenever the topic needs depth.
- Diagram instead of describing structure in prose. Add a relevant cover image.
- End with a real conclusion (what changes in the reader's reasoning or practice), not a recap. Name it "Conclusão", "O que fica" or whatever fits.
- Add a final references list (primary source, author, edition, official docs cited in the text) as a plain list.

## Ask or stop when

- The topic needs a fact, figure or statistic the user did not provide.
- No existing category fits precisely. Propose a new one instead of forcing a fit (procedure in `post-format.md`).
- The user asks to delete a post. Never delete; set `status: "archived"`.

## Hard rules

- `status` is always `"published"`, or `"archived"` to hide. Never `draft`.
- Slugs are unique.
- No offensive or discriminatory language, nothing that could embarrass the author.
- Never fabricate `coverImage` or `heroImage` URLs (for example Unsplash photo IDs). Ask the user for the image or describe the image needed.
- Never Mermaid. Diagrams are SVG files.
