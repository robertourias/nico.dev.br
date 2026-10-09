# Contributing

Guia de contribuição para o monorepo `nico.dev.br`.

---

## 1. Usando componentes de `@nico.dev/ui`

Todo componente de UI deve ser importado de `@nico.dev/ui`. Nunca crie estilos ou componentes ad-hoc diretamente em `apps/web` ou subprojetos se o componente já existir (ou puder existir) no design system.

```tsx
// ✅ Correto
import { Button, Badge, Card, Input } from "@nico.dev/ui";

// ❌ Incorreto — não crie botões inline no app
const MyButton = ({ children }) => (
  <button className="bg-[#5546E8] text-white px-4 py-2 rounded-lg">{children}</button>
);
```

**Tokens de cor:** use sempre variáveis CSS semânticas via classes Tailwind — nunca hex direto.

```tsx
// ✅ Correto
<div className="bg-primary text-primary-foreground" />

// ❌ Incorreto
<div style={{ background: "#5546E8" }} />
```

---

## 2. Adicionando um novo componente ao design system

1. **Defina o componente no Pencil** (`docs/nico.dev.br.pen`) antes de escrever código
2. Crie o arquivo em `packages/ui/src/components/<nome>.tsx`
3. Use `cva` para variantes e `@radix-ui` para acessibilidade onde aplicável
4. Consuma apenas tokens CSS (`var(--primary)`, etc.) — nunca hex direto
5. Exporte o componente e seus tipos em `packages/ui/src/index.ts`
6. Crie a story correspondente em `apps/storybook/src/stories/<Nome>.stories.tsx`
7. Verifique com `pnpm --filter "@nico.dev/ui" exec tsc --noEmit`

**Estrutura mínima de um componente:**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const componentVariants = cva("base-classes", {
  variants: { variant: { default: "...", secondary: "..." } },
  defaultVariants: { variant: "default" },
});

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(componentVariants({ variant }), className)} {...props} />
  )
);
Component.displayName = "Component";

export { Component, componentVariants };
```

---

## 3. Sincronizando tokens com o Pencil

O arquivo `docs/nico.dev.br.pen` é a **fonte da verdade** para tokens de design. Para sincronizar:

1. Abra o arquivo com o MCP do Pencil ou no Pencil app
2. Acesse **Variables** para ver os tokens atuais (cores, tipografia, radius, spacing)
3. Atualize `packages/ui/src/tokens/colors.ts`, `typography.ts`, `radius.ts` com os novos valores
4. Atualize `packages/ui/src/globals.css` — tanto `:root` quanto `.dark`, e o bloco `@theme inline`

**Convenção:** os tokens no código devem ser idênticos em nome e valor aos definidos no Pencil. Nenhum token deve existir apenas no código (sem equivalente no Pencil) ou vice-versa.

---

## 4. Convenção de nomes de stories no Storybook

| Regra | Exemplo |
|-------|---------|
| Arquivo: `<ComponentName>.stories.tsx` | `Badge.stories.tsx` |
| `title`: `"UI/<ComponentName>"` | `"UI/Badge"` |
| Story padrão: `Default` | `export const Default` |
| Variantes: nome da variante em PascalCase | `export const Success` |
| Composições: `AllVariants`, `WithLabel`, etc. | `export const AllVariants` |

**Estrutura mínima:**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Component } from "@nico.dev/ui";

const meta = {
  title: "UI/Component",
  component: Component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Component" } };
```

Para visualizar as stories:

```bash
pnpm dev --filter @nico.dev/storybook
# Abre em http://localhost:6106
```
