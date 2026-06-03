# Conventions — blog.nico.dev.br

> Convenções específicas do blog. Naming geral (kebab-case, PascalCase, etc.) segue o padrão do monorepo em `docs/context/conventions.md`.

## Glossário de domínio

| Termo | Definição |
|-------|-----------|
| **Post** | Artigo em Markdown (`src/content/posts/slug.md`) com frontmatter obrigatório: `title`, `slug`, `date`, `category`, `status` |
| **Categoria** | Agrupamento temático de posts — valores fixos: `tech`, `ia`, `organizacao`, `qualidade-de-vida` |
| **Status** | Estado de publicação do post: `published` (visível) ou `archived` (oculto, nunca deletado) |
| **Frontmatter** | Bloco YAML no topo do arquivo Markdown com metadados do post |
| **Favorito** | Post marcado com `featured: true` no frontmatter — aparece em destaque no menu |
| **Slug** | Identificador único do post em kebab-case, usado na URL (`/posts/meu-post`) |

## Estrutura de arquivos

```
src/
  content/
    posts/        → arquivos .md dos posts (slug.md)
  components/     → componentes Astro e React islands
  layouts/        → layouts de página
  pages/          → rotas Astro
  styles/         → CSS global e tokens
```

## Frontmatter obrigatório

```yaml
---
title: "Título do Post"
slug: "titulo-do-post"
date: "2026-06-02"
category: "tech" # tech | ia | organizacao | qualidade-de-vida
status: "published" # published | archived
featured: false
description: "Descrição curta para SEO e preview"
---
```
