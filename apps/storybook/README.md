# @nico.dev/storybook

Catálogo visual de todos os componentes de `@nico.dev/ui`. É a referência viva do design system — toda variante, estado e prop documentados e interativos.

## Como rodar

```bash
pnpm dev --filter @nico.dev/storybook
```

Abre em **http://localhost:6106**

Para rodar a partir da raiz do monorepo com os outros apps:

```bash
pnpm dev
```

---

## Estrutura

```
apps/storybook/
├── .storybook/
│   ├── main.ts        ← configuração do Storybook (addons, framework, Vite)
│   └── preview.tsx    ← globals.css, decorator de tema, parâmetros
└── src/
    └── stories/       ← uma story por componente de @nico.dev/ui
        ├── Button.stories.tsx
        ├── Badge.stories.tsx
        └── ...
```

Cada arquivo em `src/stories/` corresponde a uma família de componentes em `packages/ui/src/components/`.

---

## Como adicionar uma story

Ao adicionar um novo componente em `packages/ui`, crie a story correspondente:

### 1. Crie o arquivo

```
apps/storybook/src/stories/<ComponentName>.stories.tsx
```

### 2. Estrutura mínima

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

export const Default: Story = {
  args: { children: "Component" },
};
```

### 3. Convenções de nomenclatura

| Regra | Exemplo |
|-------|---------|
| Arquivo | `Badge.stories.tsx` |
| `title` | `"UI/Badge"` |
| Story padrão | `export const Default` |
| Variante específica | `export const Success` (PascalCase) |
| Composições | `export const AllVariants`, `export const WithLabel` |

### 4. Boas práticas

- Inclua todas as variantes do componente como stories separadas
- Use `tags: ["autodocs"]` — gera documentação automática de props
- Prefira `args` a JSX estático: permite o painel de controles do Storybook
- Se o componente exigir contexto (ex: form provider), adicione um decorator local na story

---

## Build estático

Para gerar o Storybook como site estático (ex: deploy para revisão):

```bash
pnpm build --filter @nico.dev/storybook
```

A saída fica em `apps/storybook/storybook-static/`.

---

## Configuração

### `main.ts`

Define o framework (`@storybook/react-vite`), addons e passa o plugin Tailwind CSS v4 para o Vite:

```ts
viteFinal: async (config) => {
  config.plugins = [...(config.plugins ?? []), tailwindcss()];
  return config;
},
```

Isso é necessário para que o Tailwind v4 gere as classes dos componentes consumidos via workspace symlink.

### `preview.tsx`

Importa `@nico.dev/ui/globals.css` (tokens CSS + estilos base) e envolve cada story em um decorator que aplica `bg-background text-foreground` — garantindo que o tema do design system esteja ativo em todos os componentes.

```tsx
import "@nico.dev/ui/globals.css";

decorators: [
  (Story) => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Story />
    </div>
  ),
],
```
