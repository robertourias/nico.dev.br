---
title: "Storybook: instalar, usar e criar um design system"
slug: "storybook-design-system-react"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Como instalar o Storybook, escrever stories e montar um design system documentado em React, com tokens, docs automáticas e testes de interação."
tags: ["storybook", "design-system", "react", "documentacao-de-componentes", "testes-de-interacao"]
---

Alguém do time pergunta qual é a altura do botão pequeno, e a resposta depende de quem você chama. O designer lembra de um valor, o código tem outro, e a tela de login usa um terceiro porque alguém copiou o CSS de uma página antiga.

Um design system resolve isso ao transformar decisões visuais em componentes reutilizáveis e documentados. O Storybook é a ferramenta que mais ajuda a **ver e documentar** esses componentes: ele roda cada um isolado do resto da aplicação e vira, ao mesmo tempo, vitrine, documentação e campo de testes.

Este post cobre o caminho inteiro: instalar o Storybook num projeto React com Vite, escrever stories, testar interação e montar um pequeno design system com tokens, componente e página de documentação. Os exemplos seguem a documentação oficial da versão 10.

## O que é o Storybook

O Storybook é uma oficina de componentes de interface. Em vez de abrir a aplicação, navegar até a tela certa e forçar o estado que você quer ver, você descreve esse estado num arquivo e o Storybook o renderiza sozinho.

A unidade central é a **story**: um estado específico de um componente. O `Button` tem uma story para o estado primário, outra para o desabilitado, outra para o carregando. Cada story aparece na barra lateral e pode ser aberta, inspecionada e testada isoladamente.

Isso importa para um design system por um motivo prático. O sistema só funciona se as pessoas encontram os componentes, entendem as props e confiam no comportamento. O Storybook entrega as três coisas a partir do mesmo arquivo de stories.

![Fluxo de um design system no Storybook: tokens alimentam componentes, componentes ganham stories, cada story gera Controls, página de docs e teste de interação, e o build produz um site estático](/images/storybook-design-system-react-camadas.svg)

O diagrama mostra a ideia do post: as stories ficam no meio, e delas saem os controles interativos, a página de documentação e os testes. O build final empacota tudo num site estático.

## Como instalar o Storybook

Num projeto React com Vite já existente, o comando de instalação é um só, rodado na raiz:

```bash
npx storybook@latest init
```

O `init` detecta o framework, instala as dependências, cria a pasta `.storybook/` e adiciona alguns exemplos. Para começar do zero, crie o projeto Vite primeiro:

```bash
npm create vite@latest meu-design-system
cd meu-design-system
npx storybook@latest init
```

Depois suba o servidor de desenvolvimento do Storybook:

```bash
npm run storybook
```

Dois arquivos em `.storybook/` merecem atenção. O `main.ts` diz onde estão as stories e qual framework usar:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};

export default config;
```

O `stories` é um conjunto de padrões de arquivo: qualquer `*.stories.tsx` ou `*.mdx` dentro de `src/` entra. O `preview.ts` configura como todas as stories são renderizadas e é onde você importa os estilos globais do sistema, como veremos adiante.

## Como escrever stories

As stories seguem o formato **CSF** (Component Story Format): um arquivo que exporta um objeto de metadados como `default` e uma exportação nomeada por story. Com TypeScript, os tipos `Meta` e `StoryObj` fazem o editor validar as props de cada story:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  component: Button,
  title: 'Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Salvar',
  },
};
```

`args` são as props daquela story. Elas também alimentam o painel **Controls**: o Storybook infere os controles a partir dos tipos do componente, e quem está olhando a vitrine pode trocar a variante ou o texto sem editar código. Para forçar um controle específico, como um seletor com opções fixas, use `argTypes`:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'danger'],
  },
},
```

Se uma story precisa de composição, por exemplo vários botões lado a lado, defina a função `render` dela e devolva o JSX que quiser.

## Testando interação com play function

Uma story também pode simular o uso. A propriedade `play` roda depois da renderização e recebe utilitários para consultar o DOM e disparar eventos. O `fn()` cria uma função espiã, que registra se foi chamada:

```tsx
import { expect, fn } from 'storybook/test';

export const CliqueChamaOnClick: Story = {
  args: {
    children: 'Salvar',
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
```

Aqui a story vira um teste: se o clique não chamar `onClick`, a asserção falha e o Storybook mostra o erro na aba de interações. Consultar por `getByRole` também empurra você para marcação acessível, porque um `div` clicável não seria encontrado como botão.

## Criando um design system com Storybook

Um design system tem três camadas que o Storybook documenta bem: tokens, componentes e páginas de fundamentos. Vamos montar as três com um exemplo mínimo.

### Tokens

**Design tokens** são as decisões visuais de menor nível, como cor, espaçamento e tipografia, guardadas com nomes em vez de valores soltos. Aqui, variáveis CSS num arquivo `src/tokens/tokens.css`:

```css
:root {
  --ds-color-primary: #4f46e5;
  --ds-color-primary-contrast: #ffffff;
  --ds-color-danger: #b91c1c;
  --ds-space-2: 0.5rem;
  --ds-space-4: 1rem;
  --ds-radius: 0.5rem;
  --ds-font-family: system-ui, sans-serif;
}
```

Importe esse arquivo no `.storybook/preview.ts` para que todas as stories o enxerguem:

```ts
import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {};

export default preview;
```

### O componente

O `Button` usa só tokens, nunca valores literais. Se a cor primária mudar, muda em um lugar:

```tsx
import type { ComponentProps } from 'react';
import './Button.css';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={`ds-button ds-button--${variant}`} {...props} />;
}
```

```css
.ds-button {
  font-family: var(--ds-font-family);
  padding: var(--ds-space-2) var(--ds-space-4);
  border: 0;
  border-radius: var(--ds-radius);
  cursor: pointer;
}
.ds-button--primary {
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
}
.ds-button--danger {
  background: var(--ds-color-danger);
  color: var(--ds-color-primary-contrast);
}
.ds-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Stories e documentação automática

Acrescente a tag `autodocs` nos metadados e o Storybook gera uma página de documentação para o componente, com as stories renderizadas e a tabela de props extraída dos tipos do TypeScript:

```tsx
const meta = {
  title: 'Componentes/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Salvar' },
} satisfies Meta<typeof Button>;
```

O prefixo `Componentes/` no `title` agrupa os componentes numa seção da barra lateral. Cada variante vira uma story (`Primary`, `Secondary`, `Danger` e uma `Disabled` com `args: { disabled: true }`), e a página de docs lista todas elas sem você escrever uma linha de documentação.

### Página de fundamentos em MDX

Nem tudo é componente. Princípios de uso, tabela de tokens e orientações de acessibilidade pedem texto corrido. Para isso existe o **MDX**, que mistura Markdown e componentes React no mesmo arquivo. Crie `src/docs/Tokens.mdx`:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Fundamentos/Tokens" />

# Tokens

Toda cor, espaço e raio vem de uma variável `--ds-*`.
Nunca use valores literais nos componentes.

| Token | Uso |
|-------|-----|
| `--ds-color-primary` | Ação principal |
| `--ds-color-danger` | Ações destrutivas |
| `--ds-space-4` | Espaçamento padrão |
```

Quando uma página MDX precisa mostrar um componente ao vivo, importe as stories e use os blocos `Canvas` e `Controls`, que renderizam a story e o painel de props dentro do texto:

```mdx
import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Canvas of={ButtonStories.Primary} />
<Controls of={ButtonStories.Primary} />
```

Escolha uma forma por componente: ou `autodocs`, ou um MDX dedicado a ele. As duas ao mesmo tempo geram páginas de documentação concorrentes.

## Publicando o design system

O Storybook gera um site estático, que qualquer hospedagem de arquivos serve:

```bash
npm run build-storybook
```

O resultado vai para a pasta `storybook-static/`. Publicá-la num endereço fixo (e atualizar a cada merge) transforma o design system numa referência que designers, devs e quem faz QA consultam sem rodar o projeto.

## O que fica

A mudança de raciocínio é tratar a story como a unidade de trabalho de um componente. Ela é o exemplo de uso, a documentação, o caso de teste e o item da vitrine, tudo no mesmo arquivo. Quando a story é a fonte, não existe documentação separada para ficar desatualizada.

Para começar, não monte o sistema inteiro. Pegue o componente mais repetido do seu projeto, o botão na maioria dos casos, extraia os valores para tokens, escreva três stories e ative o `autodocs`. Se a página gerada responder as perguntas que o time faz, o resto é repetir o processo.

Se quiser a camada de arquitetura por trás disso, como organizar bibliotecas de componentes e governar mudanças, escrevi o [resumo de Frontend Architecture for Design Systems](/posts/frontend-architecture-for-design-systems-resumo).

## Referências

- Storybook, documentação oficial: [storybook.js.org/docs](https://storybook.js.org/docs)
- Storybook, repositório oficial: [github.com/storybookjs/storybook](https://github.com/storybookjs/storybook)
- [Frontend Architecture for Design Systems, resumo](/posts/frontend-architecture-for-design-systems-resumo)
