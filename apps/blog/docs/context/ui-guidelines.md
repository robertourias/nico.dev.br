# UI Guidelines — blog.nico.dev.br

> Decisões visuais e de componentes do blog.
> Atualizar sempre que tokens ou padrões mudarem.

## Stack

| Camada | Escolha |
|--------|---------|
| Framework | Astro (componentes `.astro` + React islands quando necessário) |
| Estilização | Tailwind CSS — sem CSS Modules, sem styled-components |
| Componentes | shadcn/ui (porta para Astro/React quando necessário) |
| Ícones | Lucide React |

## Design Tokens

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0a0a0f` | Background principal da página |
| `--color-bg-card` | `#111118` | Background de cards e superfícies elevadas |
| `--color-text-heading` | `#f0efe8` | Títulos e textos em destaque máximo |
| `--color-text-body` | `#888898` | Corpo de texto, parágrafos |
| `--color-text-highlight` | `#e8c547` | Destaques inline, links ativos, badges |
| `--color-text-emphasis-purple` | `#7b61ff` | Ênfase secundária (itálico, negrito alternativo) |
| `--color-text-emphasis-yellow` | `#e8c547` | Ênfase primária (negrito, callouts) |
| `--color-border` | `#ffffff14` | Bordas de cards e divisores |

### Shape

- **Card radius:** `16px` (`rounded-2xl` no Tailwind)

### Fontes

| Família | Uso |
|---------|-----|
| **Fraunces** | Títulos (`h1`, `h2`, `h3`) — serifada, editorial |
| **Instrument Sans** | Corpo de texto, UI, labels — sans-serif limpa |

```css
/* tailwind.config */
fontFamily: {
  heading: ['Fraunces', 'serif'],
  body: ['Instrument Sans', 'sans-serif'],
}
```

## Regras de uso

- **Nunca usar hex direto no JSX/TSX** — sempre via variáveis CSS ou classes Tailwind semânticas
- Cards sempre com `bg-[#111118]`, `border border-[#ffffff14]`, `rounded-2xl`
- Títulos de posts: `font-heading` (Fraunces)
- Texto de corpo: `font-body` (Instrument Sans), cor `text-[#888898]`
- Highlights e categorias: `text-[#e8c547]`
- Ênfase forte (negrito/itálico): alternar `#7b61ff` e `#e8c547` por contexto

## Componentes shadcn/ui

- Usar shadcn/ui como referência de padrão de acessibilidade e estrutura
- Customizar com os tokens acima via `tailwind.config` e variáveis CSS
- Sem MUI, sem Chakra, sem instalação de outras libs de componentes
