---
title: "SSR, SSG, CSR e ISR: quando usar cada renderização"
slug: "ssr-ssg-csr-isr-estrategias-de-renderizacao"
date: "2026-09-20"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "O que são CSR, SSR, SSG e ISR, como diferem em performance, SEO e frescor dos dados, quando usar cada um e exemplos em Next.js App Router."
tags: ["ssr", "ssg", "csr", "isr", "nextjs"]
coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80"
---

Toda estratégia de renderização responde à mesma pergunta: **em que momento e em que lugar o HTML da página é gerado?** Build, servidor no momento da requisição ou navegador do usuário. A sigla que você escolhe é só o nome da resposta.

Errar essa escolha não quebra nada de imediato. Cobra depois: uma página de produto que demora para aparecer, um blog que gasta servidor à toa, um painel que mostra dado de ontem.

Este post define cada estratégia, compara as quatro lado a lado e mostra exemplos em Next.js (App Router), que permite combiná-las por rota.

## Antes: o que é "renderizar"

Renderizar, aqui, é transformar componentes e dados em HTML. Toda página web acaba como HTML no navegador. O que varia é quem o produz.

Dois termos aparecem o tempo todo:

- **Hidratação (hydration):** quando o HTML já veio pronto, o navegador baixa o JavaScript e o "liga" ao HTML existente, para que botões e formulários funcionem.
- **Cache de CDN:** uma rede de servidores espalhados pelo mundo que guarda arquivos e os entrega do ponto mais próximo do usuário. Arquivo estático é o caso ideal para ela.

![Matriz comparando CSR, SSR, SSG e ISR: o HTML é gerado no navegador no CSR, no servidor a cada requisição no SSR, no build no SSG, e no build com regeneração em segundo plano no ISR](/images/ssr-ssg-csr-isr-estrategias-de-renderizacao-matriz.svg)

## CSR: Client-Side Rendering

O servidor entrega um HTML praticamente vazio e um bundle de JavaScript. O navegador executa o JS, busca os dados numa API e monta a página.

O usuário vê uma tela em branco ou um esqueleto (skeleton) até o JS baixar, executar e receber os dados. Por outro lado, depois do primeiro carregamento, a navegação entre telas é rápida, porque só trocam os dados.

**Bom para:** áreas autenticadas e interativas, como dashboards, painéis administrativos e editores, onde SEO não importa e o dado é específico de cada usuário.

**Limites:** o carregamento inicial é o mais lento das quatro estratégias, e buscadores dependem de executar JS para enxergar o conteúdo.

## SSR: Server-Side Rendering

A cada requisição, o servidor busca os dados, gera o HTML completo e responde. O navegador recebe a página já com conteúdo, e o JavaScript hidrata depois.

O conteúdo aparece antes do JS terminar de carregar, e o buscador recebe HTML completo. O dado é sempre o mais recente, porque a página é gerada na hora.

**Bom para:** páginas que precisam de SEO **e** dependem de dado que muda a cada acesso ou de quem está acessando, como um feed personalizado, resultados de busca ou uma página que depende de sessão.

**Limites:** cada requisição consome servidor, então o custo e a latência crescem com o tráfego. O HTML não pode ser simplesmente servido de uma CDN, porque é diferente a cada vez.

## SSG: Static Site Generation

O HTML é gerado **uma vez, no build**. O resultado são arquivos estáticos que a CDN entrega direto, sem executar código de servidor por requisição.

É a estratégia mais rápida e barata de servir: nenhum servidor consulta banco ou API enquanto o usuário espera. Este próprio blog funciona assim, como site estático em Astro.

**Bom para:** conteúdo que muda pouco e é igual para todo mundo: blogs, documentação, páginas institucionais, landing pages.

**Limites:** o conteúdo só atualiza com um novo build. Quanto mais páginas, mais longo o build. E não serve para dado personalizado por usuário.

## ISR: Incremental Static Regeneration

O ISR começa como SSG e resolve seu maior problema: como atualizar uma página estática **sem rebuildar o site inteiro**.

A página é gerada no build e servida do cache. Depois de um tempo definido, ou quando você pede, ela é regenerada. O comportamento é o do padrão *stale-while-revalidate*: no primeiro acesso depois de vencido, o usuário ainda recebe a versão antiga, enquanto a nova é gerada em segundo plano. Quem chega em seguida já recebe a atualizada.

**Bom para:** conteúdo estático na maior parte do tempo, mas que muda de forma previsível: catálogo de e-commerce, páginas de produto, listagens de notícias.

**Limites:** existe uma janela em que o usuário vê dado levemente desatualizado, e o primeiro acesso após o vencimento não vê a versão nova. Para dado que precisa ser exato a cada acesso (saldo, estoque crítico), não serve.

## Comparação direta

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| HTML gerado | no navegador | no servidor, por requisição | no build | no build, com regeneração |
| Primeiro conteúdo na tela | mais lento | rápido | mais rápido | mais rápido |
| SEO | mais frágil | bom | bom | bom |
| Frescor do dado | sempre atual (busca ao carregar) | sempre atual | só a cada build | até o próximo ciclo de revalidação |
| Custo de servidor | baixo (API) | alto, cresce com o tráfego | mínimo | baixo |
| Dado por usuário | sim | sim | não | não |

## Exemplos em Next.js (App Router)

Os exemplos usam Next.js 16 com o App Router, sem o recurso de Cache Components ativado. Com ele ligado, o modelo muda para as diretivas `'use cache'` e `cacheLife`, e as configurações de segmento como `revalidate` deixam de ser o caminho. Confira a versão e a documentação do seu projeto.

### SSG: página gerada no build

Uma página de post que lista os slugs no build via `generateStaticParams`:

```tsx
// app/posts/[slug]/page.tsx
interface Post {
  slug: string;
  title: string;
  content: string;
}

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.exemplo.com/posts', {
    cache: 'force-cache',
  }).then((res) => res.json());

  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post = await fetch(`https://api.exemplo.com/posts/${slug}`, {
    cache: 'force-cache',
  }).then((res) => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

Como a página não usa nenhuma API dinâmica (cookies, headers, parâmetros de busca), o Next.js a pré-renderiza no build. O `cache: 'force-cache'` deixa explícita a intenção, já que desde o Next.js 15 o `fetch` não é cacheado por padrão.

### ISR: estática, mas que se atualiza

O mesmo tipo de página, agora com revalidação por tempo:

```tsx
// app/produtos/[id]/page.tsx
export const revalidate = 60; // regenera, no máximo, a cada 60 segundos

export async function generateStaticParams() {
  const produtos: { id: string }[] = await fetch(
    'https://api.exemplo.com/produtos',
  ).then((res) => res.json());

  return produtos.map((p) => ({ id: String(p.id) }));
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produto = await fetch(`https://api.exemplo.com/produtos/${id}`, {
    next: { tags: ['produtos'] },
  }).then((res) => res.json());

  return (
    <main>
      <h1>{produto.nome}</h1>
      <p>R$ {produto.preco}</p>
    </main>
  );
}
```

Produtos não listados no `generateStaticParams` são gerados sob demanda no primeiro acesso e depois ficam em cache.

Quando o preço muda e esperar 60 segundos não serve, a revalidação **sob demanda** invalida o cache na hora, por tag:

```ts
// app/produtos/actions.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function atualizarPreco() {
  // ...salva o novo preço no banco...
  revalidateTag('produtos');
}
```

Em versões recentes do Next.js, a assinatura de `revalidateTag` pode aceitar um segundo argumento de perfil de cache. Consulte a documentação da sua versão.

### SSR: HTML gerado a cada requisição

Ler `cookies()` ou `headers()` torna a rota dinâmica automaticamente. Para uma página que depende da sessão:

```tsx
// app/minha-conta/page.tsx
import { cookies } from 'next/headers';

export default async function MinhaConta() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  const perfil = await fetch('https://api.exemplo.com/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  }).then((res) => res.json());

  return <h1>Olá, {perfil.nome}</h1>;
}
```

Se a página não usa `cookies()`, mas precisa ser sempre dinâmica, dá para forçar com `export const dynamic = 'force-dynamic'`.

### CSR: busca no navegador

Um componente de cliente que busca os dados depois de montar:

```tsx
// app/dashboard/Metricas.tsx
'use client';

import { useEffect, useState } from 'react';

interface Metricas {
  visitas: number;
  conversoes: number;
}

export default function Metricas() {
  const [dados, setDados] = useState<Metricas | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/metricas', { signal: controller.signal })
      .then((res) => res.json())
      .then(setDados)
      .catch(() => {});

    return () => controller.abort();
  }, []);

  if (!dados) return <p>Carregando…</p>;

  return (
    <ul>
      <li>Visitas: {dados.visitas}</li>
      <li>Conversões: {dados.conversoes}</li>
    </ul>
  );
}
```

Em projetos reais, bibliotecas como SWR ou TanStack Query cuidam de cache, revalidação e erro nesse padrão, em vez de um `useEffect` manual.

## Como escolher

Duas perguntas resolvem a maioria dos casos:

1. **O conteúdo é o mesmo para todos os usuários?** Se sim, prefira estático (SSG ou ISR). Se depende de quem acessa, é SSR ou CSR.
2. **Ele precisa de SEO ou de primeiro conteúdo rápido?** Se sim, o HTML precisa vir pronto (SSG, ISR ou SSR). Se não, CSR resolve.

Aplicando as duas a casos comuns:

| Caso | Estratégia | Por quê |
|------|-----------|---------|
| Blog, documentação | SSG | conteúdo igual para todos, muda pouco |
| Página de produto de e-commerce | ISR | estática e rápida, com preço atualizado periodicamente |
| Página institucional | SSG | quase nunca muda |
| Feed personalizado com SEO | SSR | depende do usuário e precisa de HTML |
| Resultados de busca | SSR | depende da consulta, muda a cada acesso |
| Dashboard autenticado | CSR | sem SEO, dado por usuário, muita interação |
| Painel em tempo real | CSR | precisa atualizar sem recarregar a página |

## Combinando estratégias

Na prática, um site raramente usa uma estratégia só. No Next.js, a decisão é **por rota**, e dá para misturar dentro de uma página: um cabeçalho estático, uma lista de produtos em ISR e um bloco "meu carrinho" em CSR.

Essa é a razão de tratar renderização como decisão de cada tela, não como decisão do projeto. Comece pela mais estática que atende à necessidade, e só migre para uma mais dinâmica quando o requisito exigir.

## Erros comuns

- **SSR por padrão em tudo.** É o caminho mais caro. Se a página é igual para todo mundo, ela deveria estar em cache.
- **SSG com dado que muda toda hora.** O site fica desatualizado até o próximo build. Se o dado tem ciclo previsível, ISR resolve.
- **CSR em página que precisa ser encontrada por buscadores.** O conteúdo pode não ser indexado direito, e o primeiro carregamento fica lento.
- **Esquecer da janela do ISR.** Quem acessa logo após o vencimento pode ver a versão antiga. Se isso é inaceitável, use revalidação sob demanda ou SSR.
- **Diferença entre HTML do servidor e do cliente.** Renderizar algo diferente no servidor e no navegador (por exemplo, usando `Date.now()` ou `window` direto no render) gera erro de hidratação.

## O que fica

CSR, SSR, SSG e ISR não são níveis de qualidade. São posições diferentes numa mesma escala: quanto do trabalho de gerar HTML acontece antes do usuário chegar. Quanto mais cedo, mais barato e rápido de servir, e menos fresco e personalizado o resultado.

Na próxima tela que você construir, faça as duas perguntas antes de escrever qualquer código: o conteúdo é igual para todos, e precisa de HTML pronto? A resposta já aponta para a estratégia.

## Referências

- Next.js, *Incremental Static Regeneration*: https://nextjs.org/docs/app/guides/incremental-static-regeneration
- Next.js, *Fetching Data*: https://nextjs.org/docs/app/getting-started/fetching-data
- Next.js, *Upgrading to version 15* (mudança de cache padrão do `fetch`): https://nextjs.org/docs/app/guides/upgrading/version-15
- Jason Miller e Addy Osmani, *Rendering on the Web*, web.dev: https://web.dev/articles/rendering-on-the-web
- RFC 5861, *HTTP Cache-Control Extensions for Stale Content* (origem do `stale-while-revalidate`): https://www.rfc-editor.org/rfc/rfc5861
