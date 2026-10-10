---
title: "npm link com Module Federation no Vite"
slug: "npm-link-module-federation-vite"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Use npm link para desenvolver uma lib dentro de um remote com Module Federation no Vite, evite o erro de React duplicado e veja o que testei em dev e em build."
tags: ["npm-link", "module-federation", "vite", "react", "micro-frontends"]
---

Você linka uma lib de componentes no seu remote, abre a página e o console responde com `Cannot read properties of null (reading 'useState')`. O código da lib não mudou, o React é o mesmo de sempre, e mesmo assim nenhum hook funciona. Quase sempre a causa é uma só: o `npm link` trouxe um **segundo React** para dentro do bundle.

Este post mostra como usar `npm link` com Module Federation no Vite sem cair nisso. Em vez de repetir o que se lê por aí, montei um host, um remote e uma lib linkada, e testei cada cenário em dev e em build. O resultado tem uma surpresa: no Vite, o problema aparece menos do que se espera, mas não onde se espera.

## O que é o npm link e por que ele mexe com o React

`npm link` permite desenvolver uma lib e testá-la num app sem publicar nada. Em dois passos, ele cria um *symlink* (atalho de sistema de arquivos) em `node_modules` do app apontando para a pasta da lib. Qualquer edição na lib aparece no app na hora.

O efeito colateral vem da resolução de módulos. Quando o bundler encontra `import 'react'` dentro de um arquivo da lib, ele resolve o caminho **real** do arquivo, que fica fora do app, e procura `react` a partir dali. Se a lib tem sua própria pasta `node_modules/react` (e ela costuma ter, porque React é `devDependency` para a lib poder rodar testes e builds), o bundler encontra essa cópia em vez da cópia do app.

![Dois painéis comparando o build sem dedupe, em que o app e a ui-lib usam cópias diferentes do React, com o build com dedupe ou shared, em que ambos usam uma só instância](/images/npm-link-module-federation-vite-react-duplicado.svg)

O React guarda o estado dos hooks numa variável interna do próprio módulo (o *dispatcher*). O `react-dom` do app preenche o dispatcher da cópia dele. Quando a lib chama `useState` da outra cópia, esse dispatcher está vazio e o hook falha. Foi exatamente o erro do começo.

## O cenário de teste

Montei três pacotes, tudo com Node 22 e npm 10, e as versões abaixo:

- **ui-lib**: uma lib ESM já pronta (`dist/index.js`) com um componente `Counter` que usa `useState`. Tem `react` em `peerDependencies` **e** em `devDependencies`, o cenário típico de lib em desenvolvimento.
- **remote**: app Vite que expõe `./Widget`, componente que importa o `Counter` da `ui-lib`.
- **host**: app Vite que carrega `remote/Widget` com `React.lazy`.

Vite 8.3, `@module-federation/vite` 1.23, React 19.3 e `@vitejs/plugin-react` 6.1. A lib em si:

```js
import { createElement, useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return createElement('button', { onClick: () => setCount(count + 1) }, `cliques: ${count}`);
}
```

```json
{
  "name": "ui-lib",
  "type": "module",
  "main": "dist/index.js",
  "peerDependencies": { "react": "^19.0.0" },
  "devDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" }
}
```

O link é o de sempre: registra a lib e depois a consome no remote.

```bash
cd ui-lib && npm link
cd ../remote && npm link ui-lib
```

Para cada cenário, abri a página num Chromium headless pelo Playwright, cliquei no botão e li o console.

## O que aconteceu em cada cenário

| Cenário | Resultado |
| --- | --- |
| Vite sem federation, dev server | Funciona |
| Vite sem federation, `vite build` | **Quebra**: `Cannot read properties of null (reading 'useState')` |
| Vite sem federation, `vite build` com `resolve.dedupe` | Funciona |
| Module Federation com `react` em `shared`, dev e build | Funciona, mesmo sem `dedupe` |
| Module Federation sem `react` em `shared` | **Quebra**, em dev sem `dedupe` e em build com `dedupe` |

Três pontos merecem explicação.

**O dev server do Vite perdoa.** No dev, a lib linkada carregou normalmente. Não vi nenhuma requisição a uma segunda cópia do React: o `import 'react'` de dentro da lib acabou servido pelo mesmo módulo do app. Isso é o que eu observei, não uma garantia da documentação, então não conte com isso para outras versões.

**O build não perdoa.** Sem federation, o `vite build` resolveu o `react` da lib a partir da pasta dela e embutiu uma segunda cópia. O bundle ficou com 221,19 kB contra 219,69 kB com `dedupe`, e a página quebrou. É o bug clássico aparecendo só na hora de empacotar, o que o torna mais traiçoeiro: tudo funcionava em dev.

**Com `shared`, o plugin resolve por você.** Com `react` declarado em `shared`, o plugin de federation substitui o import de `react` por um módulo compartilhado, qualquer que seja o arquivo que importa, inclusive o da lib linkada. Em dev, as únicas requisições de React no remote foram para esses módulos virtuais de compartilhamento. Em build, o botão também funcionou.

## A configuração que recomendo

Declare `react` e `react-dom` como singleton em `shared` e adicione o `resolve.dedupe`. As entradas com barra final cobrem os subcaminhos como `react/jsx-runtime` e `react-dom/client`, como diz a [documentação do Module Federation sobre subpath imports](https://module-federation.io/guide/troubleshooting/runtime.html).

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: { './Widget': './src/Widget.jsx' },
      shared: {
        react: { singleton: true },
        'react/': { singleton: true },
        'react-dom': { singleton: true },
        'react-dom/': { singleton: true },
      },
    }),
  ],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { port: 5001, strictPort: true, origin: 'http://localhost:5001' },
});
```

O `shared` com `singleton` é o que garante um único React **entre host e remote**. O `dedupe` garante um único React **dentro de cada app**, inclusive contra libs linkadas. Nos meus testes só o primeiro era estritamente necessário com federation, mas o `dedupe` custa uma linha e protege o caso do build sem federation, que quebrou.

Na lib, mantenha `react` como `peerDependency`. É isso que diz ao consumidor "traga o seu", e o `dedupe` faz o resto.

## O erro que não é do link

O quinto cenário da tabela merece atenção: sem `react` em `shared`, quebrou mesmo com `dedupe` ligado. Isso não tem relação com o link. O que os resultados indicam é que o host renderizava o componente do remote com o React do host, enquanto o remote trazia o dele. O `dedupe` junta as cópias dentro do remote, mas não une as do host e do remote. Só o `shared` faz isso.

Se você linkar uma lib e o erro persistir, confira antes o `shared` dos dois lados. O [post sobre Module Federation com React](/posts/module-federation-micro-frontends-react) explica por que o singleton importa e quais outras armadilhas aparecem em projeto real.

## Hot reload e o npm install

Dois detalhes do dia a dia, que também testei.

**A edição na lib aparece sem reiniciar.** Com o dev server do remote rodando, troquei um texto em `ui-lib/dist/index.js` e a página atualizou sozinha em poucos segundos, sem configuração extra. Se a sua lib tem um passo de build, rode-o em modo watch (`tsup --watch`, `tsc -w` ou o equivalente), porque o remote lê o `dist`, não o código-fonte.

**O `npm install` apaga o link.** Rodei `npm i` no remote e o symlink da `ui-lib` sumiu de `node_modules`. O npm trata o link como pacote que não está no `package.json` e o remove. Depois de qualquer `npm install` no consumidor, refaça `npm link ui-lib`.

## O que não testei

O experimento cobre uma configuração: Vite 8, plugin `@module-federation/vite`, React 19, npm. Não testei webpack ou Rspack (cuja resolução de symlinks é outra), nem `pnpm link`, nem um host que também linka a lib, nem renderização no servidor. O formato do erro e o comportamento do dev server podem variar entre versões.

Em monorepo, vale considerar workspaces do pnpm ou do npm no lugar do `npm link`. Eles instalam as dependências de forma centralizada e evitam parte desses problemas. O [guia de arquitetura de frontend em escala](/posts/arquitetura-frontend-escala-micro-frontends-bff) discute a estrutura de repositório em cenários maiores.

## O que fica

`npm link` não quebra o Module Federation; ele expõe um problema que já estava lá: um módulo com estado, como o React, só pode existir uma vez. Se o link tem o poder de criar uma segunda cópia, é porque a resolução do bundler passou a olhar para uma pasta que você não vigiava.

A pergunta útil na hora do erro é "quantos Reacts existem neste bundle?". Declare `react` como singleton em `shared`, adicione `dedupe`, mantenha `react` como `peerDependency` na lib e teste com `vite build`, não só com o dev server. Foi o build que mostrou o defeito.

## Referências

- [Module Federation: troubleshooting de runtime (subpath imports)](https://module-federation.io/guide/troubleshooting/runtime.html)
- [Module Federation para Vite (`@module-federation/vite`)](https://github.com/module-federation/vite)
- [Vite: `resolve.dedupe`](https://vite.dev/config/shared-options.html#resolve-dedupe)
- [npm: `npm link`](https://docs.npmjs.com/cli/commands/npm-link)
- [React: regras dos Hooks e erro de React duplicado](https://react.dev/warnings/invalid-hook-call-warning)
