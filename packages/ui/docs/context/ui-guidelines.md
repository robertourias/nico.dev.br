# UI Guidelines

> Decisões de design system e padrões de componentes para o frontend.

## Design System

**Component library**: `@nico.dev/ui` (packages/ui/) — fonte primária de todos os componentes
**Design source of truth**: `docs/nico.dev.br.pen` (Pencil) — tokens e componentes visuais definidos aqui
**Component reference**: `apps/storybook/` — rodar `pnpm dev --filter @nico.dev/storybook`
**Styling solution**: Tailwind CSS v4 — sem CSS Modules, sem styled-components
**Icon library**: Lucide React — sem Heroicons, sem Phosphor

## Componentes disponíveis em `@nico.dev/ui`

| Categoria | Componentes |
|-----------|-------------|
| Formulários | `Button`, `Input`, `Label`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `FormGroup` |
| Feedback | `Badge` (default/success/destructive/warning), `Alert` (default/success/warning/destructive) |
| Layout | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Navegação | `Tabs` (pill/underline), `ToggleFilter`, `ToggleFilterGroup` |
| Identidade | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarWithStatus`, `AvatarGroup` |
| Dados | `Calendar`, `DatePicker`, `Heatmap` |
| Estado | `Skeleton` (line/line-short/circle/card) |
| Desenvolvedor | `InstallCommand` (caixa clicável com o mouse; `<code>` focável para rolar por teclado; `button` é o acionador de teclado), `InstallCommandTabs`, `useStoredValue` (hook) |

## Tokens de Design (fonte: Pencil)

**Tipografia:**
- `font-sans`: Inter
- `font-mono`: JetBrains Mono
- Escala de font-size: xs=11px, sm=12px, base=14px, lg=16px, xl=18px, 2xl=20px, 3xl=24px, 4xl=30px

**Radius:**
- sm=4px, md=6px, lg=8px, xl=12px, 2xl=16px

**Spacing:** grid de 4px (spacing-1=4px, spacing-2=8px, spacing-3=12px, spacing-4=16px, spacing-5=20px, spacing-6=24px, spacing-8=32px)

**Color Tokens** — use sempre variáveis semânticas via classes Tailwind:

```
bg-background / text-foreground
bg-surface / bg-surface-raised / bg-surface-overlay
bg-primary / text-primary-foreground / hover:bg-primary-hover
bg-secondary / text-secondary-foreground
bg-muted / text-muted-foreground
bg-accent / text-accent-foreground
bg-destructive / text-destructive-foreground
bg-success / text-success-foreground
bg-warning / text-warning-foreground
border-border / border-input / ring-ring
bg-badge-destructive-bg / bg-badge-success-bg / bg-badge-warning-bg
```

Dark mode: suportado via classe `.dark` no elemento raiz — todas as variáveis têm valor no modo escuro.
Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande.

## Espaçamento & Layout

- Grid de 4px — todos os valores de espaçamento são múltiplos de 4 (usar escala Tailwind)
- Breakpoints: padrão Tailwind (`sm` / `md` / `lg` / `xl` / `2xl`)
- Max-width: conteúdo `max-w-7xl` centralizado; prose `max-w-prose`; formulários `max-w-md` ou `max-w-lg`
- Layouts de página: CSS Grid; layouts de componente: Flexbox

## Padrões de Componentes

### Buttons

Seis variantes: `default` (máximo um por seção), `secondary`, `outline`, `ghost`, `destructive` (sempre pedir confirmação antes), `link`.
Sempre exibir loading state durante ações assíncronas.

### Forms

- Usar `FormGroup` para emparelhar Label + Input + mensagem de erro/hint
- Sempre associar inputs a labels visíveis — nunca usar placeholder como substituto de label
- Validar no blur, não no keystroke
- Validação via Zod + React Hook Form

### Empty & Error States

Toda lista ou tabela exige ambos:
- **Empty state:** ícone + título + descrição + botão de ação
- **Error state:** usar `Alert` variant `destructive` + botão de retry

### Loading States

- Áreas de conteúdo: usar `Skeleton` — preferido sobre spinners
- Ações de botão e áreas pequenas: spinner (Lucide `Loader2` com `animate-spin`)

## Motion

- Sempre respeitar `prefers-reduced-motion` — todas as animações devem poder ser desativadas
- Durações: fast=100ms, normal=200ms, slow=350ms
- Animar apenas `transform` e `opacity` — nunca propriedades de layout

## Accessibility Baseline

- Cor nunca deve ser o único diferenciador — sempre adicionar texto ou ícone
- `outline: none` é proibido — focus rings devem ser sempre visíveis
- Touch targets: mínimo 44×44px em mobile
- Ícones usados sozinhos: exigem `aria-label` ou `title`
