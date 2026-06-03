# Claude Context — apps/blog

Blog estático em Astro hospedado em blog.nico.dev.br.

Leia os arquivos de contexto antes de qualquer tarefa:

## Contexto do app

```
docs/context/product.md       ← produto, features, regras de negócio
docs/context/decisions.md     ← stack, convenções técnicas, deploy
docs/context/ui-guidelines.md ← design tokens, fontes, componentes
docs/context/conventions.md   ← glossário, estrutura de arquivos, frontmatter
```

## Contexto global do monorepo

```
../../docs/context/conventions.md   ← naming, git, linting
../../docs/architecture/overview.md ← stack geral, bounded contexts
```

## Regras críticas

- Posts nunca deletados — apenas `status: archived`
- Checagem de conteúdo ofensivo obrigatória antes de publicar
- Nunca hex direto em componentes — sempre tokens/variáveis CSS
- Frontmatter obrigatório: `title`, `slug`, `date`, `category`, `status`
