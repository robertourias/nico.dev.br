# @nico.dev/ui

Design system do monorepo `nico.dev.br`. Biblioteca de componentes React compartilhada por todos os apps em `apps/`. É o único lugar onde componentes UI devem existir — nenhum app cria componentes ad-hoc.

## Stack

- React 19 + TypeScript
- Tailwind CSS v4 (via variáveis CSS semânticas)
- Radix UI (primitivas de acessibilidade)
- `class-variance-authority` (variantes de componentes)
- Lucide React (ícones)
- Framer Motion (animações)

---

## Como usar em um app

O pacote já está disponível como dependência workspace. Importe diretamente pelo nome do pacote:

```tsx
import { Button, Badge, Card, Input, FormGroup } from "@nico.dev/ui";
```

Para tokens de design (valores raw, quando necessário em lógica JS):

```ts
import { colors, spacing, radius } from "@nico.dev/ui/tokens";
```

### Configuração obrigatória no app

Importe o CSS global uma vez na raiz do app (layout raiz ou entry point):

```ts
import "@nico.dev/ui/globals.css";
```

Esse arquivo registra os tokens CSS (`:root` e `.dark`), o bridge do Tailwind v4 e os estilos base.

### Dark mode

O dark mode é ativado pela classe `.dark` no elemento raiz. Todos os tokens têm valor nos dois modos — sem configuração adicional.

```tsx
// Ativar dark mode
document.documentElement.classList.add("dark");
```

---

## Componentes disponíveis

| Categoria | Componentes |
|-----------|-------------|
| Formulários | `Button`, `Input`, `Label`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `FormGroup` |
| Feedback | `Badge`, `Alert` |
| Layout | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Navegação | `Tabs`, `ToggleFilter`, `ToggleFilterGroup` |
| Identidade | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarWithStatus`, `AvatarGroup` |
| Dados | `Calendar`, `DatePicker`, `Heatmap` |
| Estado | `Skeleton` |

Para ver variantes e props de cada componente, rode o Storybook:

```bash
pnpm dev --filter @nico.dev/storybook
# http://localhost:6106
```

---

## Tokens de design

A fonte da verdade é `docs/nico.dev.br.pen` (Pencil). Os tokens são espelhados em:

| Arquivo | Conteúdo |
|---------|----------|
| `src/globals.css` | Variáveis CSS (`:root`, `.dark`, `@theme inline`) |
| `src/tokens/colors.ts` | Paleta de cores como constantes TS |
| `src/tokens/typography.ts` | Escala tipográfica |
| `src/tokens/spacing.ts` | Grid de 4px |
| `src/tokens/radius.ts` | Raios de borda |
| `src/tokens/motion.ts` | Durações de animação |

**Regra:** sempre use classes Tailwind com variáveis semânticas — nunca hex direto.

```tsx
// ✅ Correto
<div className="bg-primary text-primary-foreground" />

// ❌ Incorreto
<div style={{ background: "#5546E8" }} />
```

---

## Como adicionar um componente

1. **Defina no Pencil** (`docs/nico.dev.br.pen`) — o componente deve existir no design antes do código
2. Crie `src/components/<nome>.tsx` seguindo a estrutura mínima abaixo
3. Use `cva` para variantes e `@radix-ui/*` para acessibilidade onde aplicável
4. Use apenas `var(--token)` — nunca valores literais de cor
5. Exporte em `src/index.ts`
6. Crie a story em `apps/storybook/src/stories/<Nome>.stories.tsx`
7. Verifique tipos: `pnpm --filter "@nico.dev/ui" exec tsc --noEmit`

### Estrutura mínima de componente

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
  },
  defaultVariants: { variant: "default" },
});

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(componentVariants({ variant }), className)}
      {...props}
    />
  )
);
Component.displayName = "Component";

export { Component, componentVariants };
```

---

## Como sincronizar tokens com o Pencil

1. Abra `docs/nico.dev.br.pen` com o Pencil app ou via MCP
2. Consulte **Variables** para ver os tokens atuais
3. Atualize os arquivos em `src/tokens/` com os novos valores
4. Atualize `src/globals.css` — `:root`, `.dark` e `@theme inline`

Nenhum token deve existir só no código sem equivalente no Pencil, nem vice-versa.

---

## Verificar tipos

```bash
pnpm --filter "@nico.dev/ui" exec tsc --noEmit
```
