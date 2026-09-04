---
title: "System design escalável: Next.js, BFF e Java na AWS"
slug: "system-design-escalavel-nextjs-bff-java-aws"
date: "2026-07-20"
categories: ["architecture"]
status: "published"
featured: false
description: "Passo a passo para desenhar o system design de um projeto escalável com Next.js, BFF em NestJS, API em Java, Postgres e AWS, usando como exemplo uma rede social de fotos."
tags: ["system-design", "arquitetura-de-software", "aws", "cache", "escalabilidade"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
---

Todo mundo que já fez entrevista de system design conhece o roteiro: requisitos, estimativa, diagrama, detalhamento. O que muda quando o projeto é de verdade — e não uma pergunta de entrevista — é que cada decisão vira código que alguém vai manter, e cada estimativa errada vira incidente em produção seis meses depois.

Esse post segue esse mesmo roteiro, mas aplicado numa stack real: frontend em Next.js, BFF em NestJS, API de domínio em Java, Postgres como banco principal, tudo rodando na AWS. O exemplo é uma rede social de fotos — usuário sobe imagem, segue outros usuários, vê feed — porque esse tipo de produto força decisão em quase toda camada: muito acesso de leitura, upload pesado, e a necessidade real de cache.

## Passo 1: requisitos antes de arquitetura

Antes de desenhar qualquer caixinha, dois grupos de pergunta.

Requisitos funcionais: o que o sistema faz. No nosso exemplo — cadastro, upload de foto, feed cronológico ou por relevância, curtir, seguir usuário.

Requisitos não funcionais: sob que condições isso precisa funcionar. Quantos usuários simultâneos, qual latência aceitável no feed, o sistema pode ficar fora do ar alguns segundos ou precisa de alta disponibilidade, os dados podem ser eventualmente consistentes ou precisam ser consistentes na hora.

É esse segundo grupo que decide a arquitetura — não o primeiro. Um feed que pode mostrar uma curtida com alguns segundos de atraso permite cache agressivo. Um saldo bancário, não.

## Passo 2: estimar a escala

Números aproximados, não precisão. O objetivo é descobrir se o gargalo vai ser leitura, escrita, armazenamento ou banda.

Para o exemplo: 2 milhões de usuários cadastrados, 400 mil ativos por dia, cada um abrindo o feed em média 8 vezes ao dia. Isso dá **32 milhões de leituras de feed por dia** — cerca de 370 por segundo em média, com pico bem maior em horário de uso comum.

Upload é mais raro que leitura — regra geral em rede social é proporção de 100:1 entre leitura e escrita. Com 5% dos usuários ativos subindo uma foto por dia, isso dá 20 mil uploads diários, cada foto gerando ~3MB antes de compressão. Esse número já diz que o gargalo não vai ser escrita no banco — vai ser **armazenamento e distribuição de imagem**, e é aí que a arquitetura precisa investir mais.

## Passo 3: desenhar o fluxo de alto nível

Com requisito e escala definidos, o diagrama de container (nível C4) mostra como as peças conversam, sem entrar em código ainda:

```
[Next.js — Web/SSR] --HTTPS--> [BFF: NestJS] --REST interno--> [API Java: Usuários]
                                              --REST interno--> [API Java: Feed]
                                              --REST interno--> [API Java: Mídia]

[API Java] --SQL--> [Postgres]
[API Java] --leitura/escrita--> [Redis: cache]
[Upload] --presigned URL--> [S3] --evento--> [Lambda: processa imagem] --> [CloudFront: CDN]
```

Cada seta é uma decisão de acoplamento. Frontend fala só com o BFF — nunca direto com as APIs Java, porque isso obrigaria toda mudança de contrato interno a virar mudança de contrato público. Upload de imagem não passa pelo backend Java — vai direto do navegador pro S3 via presigned URL, porque roteirizar 3MB de binário através de mais uma camada só adiciona latência e custo de banda sem benefício.

## Passo 4: o trabalho de cada camada

**Next.js** cuida de renderização — SSR para a primeira carga do feed (importa pra SEO e pra tempo de primeira exibição), e client-side para navegação seguinte. Imagem otimizada via `next/image`, servida já redimensionada pelo CDN, evita que o navegador baixe uma foto de 3MB pra mostrar um thumbnail de 200px.

**BFF em NestJS** agrega e adapta. A tela de feed precisa de dado de usuário, de mídia e de curtidas — três APIs Java diferentes — numa chamada só:

```ts
// bff/feed/feed.controller.ts
@Get('feed')
async getFeed(@Query('userId') userId: string) {
  const [posts, usuarios] = await Promise.all([
    this.feedService.buscarPosts(userId),
    this.usuarioService.buscarSeguidos(userId),
  ]);

  return posts.map((post) => ({
    id: post.id,
    imagemUrl: post.cdnUrl,
    autor: usuarios.find((u) => u.id === post.autorId)?.nome,
    curtidas: post.totalCurtidas,
  }));
}
```

**API Java** (Spring Boot, tipicamente) segura a regra de negócio e o acesso a dado transacional — cadastro, relação de seguir, contagem de curtida. É a camada que fala com o Postgres e decide o que fica em cache.

**Postgres** guarda usuário, relação de seguir, metadado de post (não o binário da imagem). Índice composto em `(autor_id, criado_em)` é o que sustenta a query de feed rápida; sem ele, listar posts recentes de quem o usuário segue vira table scan conforme a tabela cresce. Passado um certo volume — dezenas de milhões de linhas — particionamento por data e réplica de leitura tiram carga de escrita do banco primário.

## Cache: a peça que decide se o feed escala

Cache em três camadas, cada uma resolvendo um problema diferente.

CDN (CloudFront) serve a imagem em si — o recurso mais pesado e o que menos muda depois de publicado. Uma foto, uma vez processada, fica em cache de borda por dias.

Redis guarda resultado de query cara e repetida — contagem de curtidas, lista de seguidos, feed pré-computado dos usuários mais ativos:

```ts
// api-java equivalente conceitual, chamada via BFF
const cacheKey = `feed:${userId}`;
let feed = await redis.get(cacheKey);
if (!feed) {
  feed = await feedService.montar(userId);
  await redis.set(cacheKey, feed, 'EX', 60); // 60s de TTL
}
```

HTTP cache (`Cache-Control` no BFF) cobre o caso mais simples: resposta que não muda por usuário, como metadado de configuração pública.

O erro mais comum aqui não é esquecer de cachear — é não pensar em invalidação. Cache sem estratégia de expiração vira fonte de dado desatualizado; TTL curto (segundos, não minutos) resolve boa parte dos casos onde consistência perfeita não é crítica, como é o caso de contagem de curtida.

## AWS: onde cada peça roda

- **ECS ou EKS** para BFF e API Java, atrás de um Application Load Balancer, com auto scaling baseado em CPU e número de requisição.
- **RDS Postgres** com réplica de leitura, backup automático e Multi-AZ para failover.
- **ElastiCache (Redis)** gerenciado, evitando operar cluster de cache manualmente.
- **S3** para o binário da imagem, com política de ciclo de vida movendo foto antiga para Glacier se fizer sentido pro produto.
- **CloudFront** na frente do S3 e do ALB, reduzindo latência geográfica e absorvendo pico de tráfego antes de chegar no backend.
- **Lambda** processando a imagem após upload — gerar thumbnail, checar conteúdo impróprio — disparado por evento do S3, sem manter servidor rodando esperando upload acontecer.

## O fluxo completo: abrir o feed e subir uma foto

![Arquitetura final do ImageFeed: Next.js, BFF em NestJS, APIs Java, Postgres, Redis e AWS](/images/system-design-escalavel-nextjs-bff-java-aws-arquitetura.svg)

Juntando as decisões dos passos anteriores, esse é o desenho final: fluxo síncrono de leitura em cinza (navegador → Next.js → BFF → APIs Java → Postgres/Redis) e pipeline de imagem em laranja (upload direto pro S3, evento disparando o Lambda, resultado servido pelo CloudFront).

Usuário abre o app: Next.js renderiza o shell, BFF chama a API de feed, que checa o Redis antes de ir no Postgres — cache quente, resposta em poucos milissegundos. Cada imagem do feed já vem como URL do CloudFront, então o navegador busca a foto direto da CDN, sem passar pelo backend.

Usuário sobe uma foto: o Next.js pede ao BFF uma presigned URL, o navegador envia o arquivo direto pro S3, e só depois disso o BFF avisa a API Java que existe um post novo (registrando metadado no Postgres). O S3 dispara o Lambda que gera o thumbnail; quando terminar, o post fica visível no feed dos seguidores — sem que o usuário precise esperar o processamento pra terminar a ação de postar.

Esse fluxo é o motivo pelo qual dividir responsabilidade por camada importa: nenhuma peça individual precisa ser rápida o tempo todo — o sistema como um todo é que precisa parecer rápido pra quem está usando.

## Onde a maioria erra

Dimensionar o Postgres para o pico de escrita e esquecer que o gargalo real, em produto com muita leitura, é sempre leitura repetida do mesmo dado. Cache mal pensado — sem TTL, sem chave específica por usuário — que devolve dado errado pro usuário errado. E subestimar o custo de banda de imagem sem CDN, que é quase sempre o item mais caro da conta da AWS num produto desse tipo.

System design não é sobre acertar a arquitetura perfeita na primeira tentativa — é sobre deixar registrado por que cada escolha foi feita, pra poder revisitar quando a escala real mostrar onde a estimativa errou.
