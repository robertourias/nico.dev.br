---
title: "Module Federation na prática: micro frontends com React"
slug: "module-federation-micro-frontends-react"
date: "2026-09-20"
categories: ["architecture", "dev"]
status: "published"
featured: false
description: "O que é Module Federation, como host, remote e shared funcionam em runtime, e um tutorial passo a passo com um host e dois remotes em React + Vite."
tags: ["module-federation", "micro-frontends", "react", "vite", "arquitetura-frontend"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
---

Micro frontends prometem times deployando sozinhos. Na prática, o que costuma travar isso não é a divisão do código, é a **composição**: como três aplicações React, buildadas e publicadas separadamente, viram uma tela só para o usuário sem virar três bundles de React na mesma página.

Module Federation é a resposta mais direta a esse problema. Este post explica o que ele é, como funciona por dentro e monta um exemplo real: um shell (host) que carrega dois remotes, `catalog` e `cart`, em runtime.

## O que é Module Federation

Module Federation é um mecanismo de bundler que permite a uma aplicação **carregar módulos de outra aplicação em runtime**, sem que essa outra aplicação seja uma dependência instalada via npm. Nasceu no Webpack 5 e hoje existe como projeto independente (Module Federation 2.0), com plugins para Webpack, Rspack, Rsbuild e Vite.

Três termos definem todo o modelo:

- **Host** (ou shell): a aplicação que consome módulos de outras. É a que o usuário abre.
- **Remote**: a aplicação que expõe módulos para outras consumirem. Tem build e deploy próprios.
- **Shared**: dependências (React, React DOM, router) que host e remotes concordam em compartilhar, para que exista uma única cópia na página.

A diferença para as alternativas conhecidas está em *quando* a composição acontece:

| Abordagem | Composição em | Deploy independente | Custo principal |
|-----------|---------------|---------------------|-----------------|
| Pacote npm | build time | não — precisa republicar o host | acoplamento de versão |
| iframe | runtime | sim | isolamento excessivo (estado, rota, UX) |
| Module Federation | runtime | sim | contrato entre times e gestão de versões |

Com pacote npm, atualizar o `cart` exige rebuildar e redeployar o host. Com Module Federation, o `cart` publica um novo `remoteEntry.js` e o host passa a carregar a versão nova no próximo acesso.

## Como funciona por dentro

Cada remote gera, no build, um arquivo de entrada (`remoteEntry.js`) que funciona como um **catálogo**: lista o que o remote expõe e como carregar cada pedaço. O host, ao encontrar um `import('catalog/ProductList')`, não resolve isso no build — ele busca o `remoteEntry.js` do `catalog` via HTTP, pede o módulo e o executa.

![Diagrama de sequência: o host inicializa o share scope, busca o remoteEntry.js de cada remote e carrega os módulos expostos](/images/module-federation-micro-frontends-react-sequencia.svg)

O ponto sutil é o **share scope**. Antes de qualquer remote ser executado, host e remotes registram no mesmo escopo as dependências que declararam como `shared`. Quando o `catalog` precisa de React, ele consulta o escopo: se já existe uma versão compatível registrada, usa essa em vez de carregar a própria.

É isso que impede três cópias de React. E é também a principal fonte de bug em projetos com Module Federation — mais sobre isso na seção de armadilhas.

## Mão na massa: host + dois remotes

O exemplo usa React 18, Vite e o plugin oficial `@module-federation/vite`. A estrutura é um monorepo simples, cada app com seu próprio `package.json`:

```
mf-demo/
  host/       → shell, porta 3000
  catalog/    → remote, porta 3001
  cart/       → remote, porta 3002
```

### 1. Criar as três aplicações

```bash
mkdir mf-demo && cd mf-demo

npm create vite@latest host -- --template react-ts
npm create vite@latest catalog -- --template react-ts
npm create vite@latest cart -- --template react-ts
```

Em cada uma, instale as dependências e o plugin:

```bash
cd host && npm install && npm install -D @module-federation/vite
cd ../catalog && npm install && npm install -D @module-federation/vite
cd ../cart && npm install && npm install -D @module-federation/vite
```

### 2. Configurar o remote `catalog`

Primeiro o componente que será exposto:

```tsx
// catalog/src/ProductList.tsx
const products = [
  { id: 1, name: 'Teclado mecânico' },
  { id: 2, name: 'Monitor 27"' },
  { id: 3, name: 'Mouse ergonômico' },
];

export default function ProductList() {
  return (
    <section>
      <h2>Catálogo</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </section>
  );
}
```

Agora o `vite.config.ts`, onde a federação acontece:

```ts
// catalog/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
    react(),
  ],
  server: { port: 3001 },
  build: { target: 'chrome89' },
});
```

Três campos importam aqui: `name` (identificador único do remote), `exposes` (o que fica público — a chave `./ProductList` é o contrato) e `shared` (o que não deve ser duplicado).

O `build.target` mais alto existe porque o plugin usa top-level await no código gerado.

### 3. Configurar o remote `cart`

Mesma ideia, outro componente e outra porta:

```tsx
// cart/src/CartWidget.tsx
import { useState } from 'react';

export default function CartWidget() {
  const [items, setItems] = useState(0);

  return (
    <aside>
      <h2>Carrinho ({items})</h2>
      <button onClick={() => setItems((n) => n + 1)}>Adicionar item</button>
    </aside>
  );
}
```

```ts
// cart/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './CartWidget': './src/CartWidget.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
    react(),
  ],
  server: { port: 3002 },
  build: { target: 'chrome89' },
});
```

### 4. Configurar o host

O host declara onde encontrar cada remote. O formato é `nome`, URL do `remoteEntry.js` e o tipo do módulo:

```ts
// host/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        catalog: {
          type: 'module',
          name: 'catalog',
          entry: 'http://localhost:3001/remoteEntry.js',
        },
        cart: {
          type: 'module',
          name: 'cart',
          entry: 'http://localhost:3002/remoteEntry.js',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
    react(),
  ],
  server: { port: 3000 },
  build: { target: 'chrome89' },
});
```

Consumir os remotes é um `import()` dinâmico com `React.lazy`, como qualquer outro code splitting:

```tsx
// host/src/App.tsx
import { lazy, Suspense } from 'react';

const ProductList = lazy(() => import('catalog/ProductList'));
const CartWidget = lazy(() => import('cart/CartWidget'));

export default function App() {
  return (
    <main>
      <h1>Loja (host)</h1>
      <Suspense fallback={<p>Carregando catálogo…</p>}>
        <ProductList />
      </Suspense>
      <Suspense fallback={<p>Carregando carrinho…</p>}>
        <CartWidget />
      </Suspense>
    </main>
  );
}
```

Como o TypeScript não conhece módulos que só existem em runtime, declare-os para o compilador parar de reclamar:

```ts
// host/src/remotes.d.ts
declare module 'catalog/ProductList' {
  const ProductList: React.ComponentType;
  export default ProductList;
}

declare module 'cart/CartWidget' {
  const CartWidget: React.ComponentType;
  export default CartWidget;
}
```

### 5. Rodar

Em três terminais:

```bash
cd catalog && npm run dev   # :3001
cd cart && npm run dev      # :3002
cd host && npm run dev      # :3000
```

Abra `http://localhost:3000`. O host renderiza o catálogo e o carrinho, cada um vindo de um servidor diferente. Aba Network do navegador: você vê os dois `remoteEntry.js` sendo buscados, e **uma** cópia de React.

Para provar a independência de deploy, altere o texto do `CartWidget`, salve e recarregue o host. O host não foi rebuildado nem reiniciado — só o remote mudou.

## Arquitetura resultante

![Arquitetura do exemplo: host na porta 3000 carregando catalog e cart, com react e react-dom compartilhados como singleton](/images/module-federation-micro-frontends-react-arquitetura.svg)

## Armadilhas que aparecem em projeto real

**Duas cópias de React.** Se `singleton: true` faltar em algum lado, ou as versões forem incompatíveis com `requiredVersion`, cada app carrega o próprio React. O sintoma clássico é o erro de hooks inválidos (`Invalid hook call`), porque o componente do remote usa uma instância de React diferente da que o host renderizou. Ao debugar, comece sempre pelo `shared`.

**Contrato do `exposes` é API pública.** Renomear `./CartWidget` quebra todo host que o consome, e isso só aparece em runtime. Trate as chaves expostas como versionamento de API: adicione, deprecie, só depois remova.

**Remote fora do ar derrubaria a página.** Como a composição é em runtime, se o `cart` estiver indisponível o `import()` falha. Envolva cada remote em um Error Boundary com fallback — o resto da tela precisa continuar funcionando.

```tsx
// host/src/RemoteBoundary.tsx
import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback: ReactNode };

export class RemoteBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
```

**URLs hardcoded.** No exemplo, os remotes apontam para `localhost`. Em produção, essas URLs precisam vir de configuração por ambiente. O runtime do Module Federation oferece `registerRemotes` para registrar remotes dinamicamente (por exemplo, a partir de um manifesto buscado no boot da aplicação), em vez de fixar tudo no build do host.

**Estado compartilhado entre remotes.** Compartilhar código é fácil; compartilhar estado é onde o acoplamento volta. Prefira comunicação por eventos do navegador ou props vindas do host, e evite um store global que todos os remotes importam — isso recria o monólito distribuído.

## Quando faz sentido usar

Module Federation paga o custo quando há **times distintos com ciclos de deploy distintos** trabalhando na mesma interface. Nesse cenário, o ganho de autonomia supera o custo de manter contratos e gerenciar versões compartilhadas.

Para um time único com um produto único, é complexidade sem retorno: um monorepo com pacotes internos resolve com muito menos peças móveis. E se a necessidade for só dividir o código em partes carregadas sob demanda, `React.lazy` com code splitting comum já basta.

## O que fica

Module Federation muda o ponto de composição da aplicação: sai do build e vai para o runtime. Isso entrega deploy independente de verdade, mas transfere a responsabilidade para três decisões que precisam ser explícitas — o que cada remote expõe, o que é compartilhado como singleton, e o que acontece quando um remote falha.

Se essas três estiverem resolvidas, adicionar um quarto remote é copiar o `vite.config.ts` do `cart`. Se não estiverem, o primeiro `Invalid hook call` em produção vai cobrar a conta.

## Referências

- Module Federation — documentação oficial: https://module-federation.io
- `@module-federation/vite` — repositório e README: https://github.com/module-federation/vite
- Module Federation Core (runtime, `registerRemotes`, `shared`): https://github.com/module-federation/core
- Module Federation Examples: https://github.com/module-federation/module-federation-examples
