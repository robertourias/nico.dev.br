---
title: "System Design Interview, de Alex Xu — resumo"
slug: "system-design-interview-alex-xu-resumo"
date: "2026-09-22"
categories: ["livros", "architecture"]
status: "published"
featured: false
description: "Resumo didático do volume 1 de System Design Interview, de Alex Xu — o framework de entrevista, estimativa de capacidade e os estudos de caso que ensinam a pensar em escala: rate limiter, consistent hashing, feed de notícias e mais."
tags: ["system-design-interview", "alex-xu", "system-design", "arquitetura-de-software", "resenha"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
---

Alex Xu publicou **System Design Interview – An Insider's Guide** em 2020, e o livro virou referência quase por acidente de formato: em vez de explicar teoria de sistema distribuído em abstrato, cada capítulo pega um produto real — rate limiter, encurtador de URL, feed de notícias, chat — e caminha do problema até uma arquitetura defensável, do jeito que se espera numa entrevista de 45 minutos.

Este resumo cobre o **volume 1**: os três capítulos de fundamentos (framework de entrevista, estimativa de capacidade e a evolução de um servidor até milhões de usuários) e os estudos de caso mais didáticos do livro. O volume 2 existe e cobre outro conjunto de sistemas (Google Maps, fila de mensagens distribuída, sistema de pagamento, entre outros) — fica para outro post.

## O framework de 4 passos

Antes de qualquer estudo de caso, Xu resolve o problema mais comum de quem nunca fez entrevista de system design: começar a desenhar sem saber o que está desenhando. O framework tem quatro passos, com tempo sugerido para uma entrevista de 45 minutos:

![Framework de quatro passos para entrevista de system design: entender e delimitar o escopo, desenhar em alto nível, aprofundar no gargalo real e fechar com trade-offs, com tempo sugerido de cerca de 5, 10 a 15, 15 a 20 e 5 minutos](/images/system-design-interview-alex-xu-resumo-framework.svg)

**1. Entender o problema e delimitar o escopo.** Perguntar antes de assumir: quantos usuários, qual a leitura vs. escrita esperada, é mobile ou web, precisa funcionar offline. Xu é enfático que candidato nenhum tem informação suficiente no início — quem não pergunta está resolvendo o problema errado com muita confiança.

**2. Design de alto nível.** Caixas e setas dos componentes principais — cliente, load balancer, servidor de aplicação, banco, cache. O objetivo aqui não é profundidade, é alinhar com quem está do outro lado que a direção geral faz sentido antes de investir tempo nela.

**3. Aprofundar (deep dive).** A parte que decide a entrevista. Depois de alinhado o alto nível, escolher — com a pessoa entrevistadora, não sozinho — qual parte merece mais atenção: como o sistema escala escrita, como evita ponto único de falha, como lida com um caso extremo específico do domínio.

**4. Wrap-up.** Resumir os trade-offs assumidos ao longo da conversa e apontar o que ainda quebraria com 10x mais usuários. Terminar aqui, mesmo que o tempo acabe no meio de um detalhe, é melhor do que nunca ter chegado a uma visão completa.

## Estimativa de capacidade (back-of-the-envelope)

O segundo capítulo do livro ensina a fazer conta de ordem de grandeza rápido, sem calculadora, pra sustentar decisão de arquitetura com número em vez de intuição. A base é lembrar potências de 2 e uma tabela de latência que já circulava na engenharia antes do livro — Xu a cita como referência, atribuída a estimativas que Jeff Dean, do Google, tornou populares:

| Operação | Latência aproximada |
|---|---|
| Referência em cache L1 | ~0,5 ns |
| Referência em memória RAM | ~100 ns |
| Leitura sequencial de 1 MB na memória | ~4 μs |
| Leitura aleatória em SSD | ~150 μs |
| Ida e volta dentro do mesmo datacenter | ~500 μs |
| Leitura sequencial de 1 MB em SSD | ~1 ms |
| Ida e volta entre EUA e Europa | ~150 ms |

A leitura prática dessa tabela: disco é ordens de magnitude mais lento que memória, e rede entre regiões geográficas é ordens de magnitude mais lenta que rede dentro do mesmo datacenter. Toda decisão de "onde colocar cache" e "replicar pra qual região" sai dessas duas linhas.

Uma conta típica do livro: estimar QPS (queries por segundo) de pico a partir de usuários ativos diários, e a partir do QPS decidir quantos servidores de aplicação e qual capacidade de banco o sistema precisa — sempre arredondando pra ordem de grandeza, nunca perseguindo precisão que a pergunta não pede.

## De um servidor a milhões de usuários

O primeiro capítulo é a espinha dorsal conceitual do livro: uma história de evolução, estágio por estágio, cada um resolvendo o gargalo que o anterior deixou.

![Evolução de um servidor único até uma arquitetura com load balancer, réplicas de leitura, cache, CDN, servidores stateless, fila de mensagens e sharding, cada estágio anotado com o gargalo que resolve](/images/system-design-interview-alex-xu-resumo-evolucao-escala.svg)

O ponto pedagógico central: cada peça de arquitetura que aparece nos capítulos seguintes do livro (load balancer, cache, CDN, fila, sharding) não é adicionada por modismo — é resposta a um gargalo específico que apareceu no estágio anterior. **Sessão fora do servidor de aplicação** é o detalhe que mais gente esquece: assim que existe mais de um servidor web atrás de um load balancer, guardar sessão de usuário na memória de um servidor específico quebra o balanceamento — a sessão precisa morar em cache compartilhado (Redis, Memcached) ou em cookie assinado no cliente.

Duas peças que atravessam todos os estágios seguintes, mas que o diagrama de arquitetura raramente mostra: **logging e métrica** (sem eles, ninguém enxerga qual estágio já virou gargalo) e **automação de deploy** (sem ela, cada estágio novo de infraestrutura vira operação manual arriscada).

## Rate limiter: onde colocar e como contar

Rate limiter é o primeiro estudo de caso do livro, e o mais direto: decidir onde a lógica de "esse cliente já passou do limite" mora, e qual algoritmo conta as requisições.

**Onde colocar:** no lado do cliente é fácil de burlar, então a decisão real é entre a lógica dentro do próprio servidor de aplicação ou num middleware separado (um API Gateway, por exemplo). Xu recomenda o middleware sempre que possível — desacopla o rate limiting da lógica de negócio e permite reconfigurar limite sem re-deploy do serviço.

**Como contar**, o livro compara quatro algoritmos:

| Algoritmo | Como funciona | Ponto forte | Ponto fraco |
|---|---|---|---|
| Token bucket | Um balde com tokens recarrega a taxa fixa; cada requisição consome um token | Simples, permite rajada controlada | Precisa ajustar tamanho do balde e taxa com cuidado |
| Leaking bucket | Fila de tamanho fixo processada a taxa constante | Saída suavizada, sem rajada | Requisição em rajada legítima é descartada |
| Fixed window counter | Contador zera a cada janela de tempo fixa (ex.: por minuto) | Fácil de implementar | Rajada na borda de duas janelas passa do dobro do limite |
| Sliding window log | Guarda timestamp de cada requisição, conta as que caem na janela móvel | Preciso, sem o problema de borda | Consome mais memória por cliente |

Xu não elege um vencedor — a escolha depende de quanto o sistema tolera rajada versus quanto precisa de contagem exata, e isso volta ao passo 1 do framework: perguntar o requisito antes de escolher o algoritmo.

## Consistent hashing: distribuir sem redistribuir tudo

Consistent hashing resolve um problema que aparece por trás de quase todo sistema distribuído do livro: como decidir em qual servidor um dado vive, sem que adicionar ou remover um servidor force redistribuir **todos** os dados existentes.

O hashing ingênuo (`hash(chave) % N`) tem esse defeito: mudar `N` (o número de servidores) muda o resultado do módulo pra quase toda chave, forçando migração maciça. A solução do livro é organizar os servidores como pontos num **anel de hash**: uma chave pertence ao primeiro nó encontrado ao percorrer o anel em sentido horário a partir da posição hash da chave.

![Anel de consistent hashing com nós A, B e C posicionados por hash, incluindo réplicas virtuais de cada nó, e uma chave sendo roteada para o próximo nó no sentido horário](/images/system-design-interview-alex-xu-resumo-consistent-hashing.svg)

Adicionar ou remover um nó agora só afeta as chaves entre ele e o nó anterior no anel — o resto permanece estável. O ajuste fino que o livro descreve é o de **nós virtuais**: em vez de cada servidor físico ocupar um único ponto no anel, ele ocupa vários pontos espalhados, o que distribui a carga de forma mais equilibrada quando os servidores têm capacidades parecidas. Esse mesmo mecanismo reaparece, sem repetir a explicação, no capítulo seguinte de key-value store — é a técnica que sustenta o particionamento de sistemas como Cassandra e DynamoDB.

## Key-value store: consistência ajustável com quorum

Design de key-value store é o capítulo que junta CAP theorem com decisão de engenharia concreta. A ideia central é o **quorum**: com `N` réplicas de cada dado, `W` réplicas precisam confirmar uma escrita e `R` réplicas precisam responder numa leitura. Escolher `W + R > N` garante que toda leitura vê pelo menos uma réplica com a escrita mais recente — o time decide o ponto de equilíbrio entre latência e consistência ajustando esses três números, sem trocar de banco.

O capítulo também introduz **vector clock** como mecanismo pra detectar quando duas réplicas divergiram de forma real (edições concorrentes genuínas) em vez de apenas estarem atrasadas uma em relação à outra — e explica por que resolver esse conflito na camada de aplicação, em vez de deixar "a escrita mais recente vence" apagar dado silenciosamente, é a escolha mais segura quando o negócio não pode perder informação.

## Gerador de ID único: por que não usar auto-incremento

Sistema distribuído com múltiplos bancos não pode confiar em auto-incremento de uma tabela só — duas réplicas gerando ID ao mesmo tempo colidem. O livro apresenta o **Snowflake**, esquema que o Twitter tornou público: um inteiro de 64 bits dividido em campos — 1 bit não usado, 41 bits de timestamp (milissegundos desde uma época customizada), 10 bits de identificador de máquina/datacenter e 12 bits de sequência (contador dentro do mesmo milissegundo, na mesma máquina).

O resultado é um ID que cresce de forma aproximadamente ordenada no tempo, sem coordenação entre máquinas no momento da geração — cada máquina gera o próprio ID de forma independente, e a estrutura do número garante que não colide com o de outra máquina.

## Encurtador de URL: hash, base62 e o "gerador de ID" reaproveitado

Design de URL shortener é, na prática, uma aplicação direta do capítulo anterior: gerar um identificador único, curto, e usar ele como chave pra buscar a URL original. O livro compara duas estratégias pra gerar o identificador curto — **hash da URL** (com tratamento de colisão) e **contador único**, convertido pra uma string curta em **base62** (dígitos + letras maiúsculas + minúsculas, 62 símbolos). A segunda evita colisão por construção e é a que Xu recomenda, reaproveitando exatamente o problema do gerador de ID único do capítulo anterior.

## Web crawler: politeness antes de velocidade

O capítulo de web crawler descreve uma arquitetura em pipeline: uma fila de URLs a visitar (**URL frontier**), um resolvedor de DNS, um downloader de HTML, um extrator de link e um deduplicador — pra não visitar a mesma página duas vezes nem entrar em loop entre páginas que se referenciam mutuamente.

O ponto que Xu mais enfatiza não é performance, é **politeness**: um crawler ingênuo bombardeia o mesmo domínio com requisições simultâneas e derruba o site alheio. A solução é manter uma fila por domínio, com um intervalo mínimo entre requisições ao mesmo host, respeitando `robots.txt`. Rapidez de crawling é secundária a não se comportar como um ataque de negação de serviço.

## Sistema de notificação: confiabilidade acima de tudo

O desenho de sistema de notificação junta serviços de terceiros (APNs para iOS, FCM para Android, provedor de SMS, provedor de e-mail) atrás de um conjunto de filas e workers, e o capítulo é menos sobre desenhar componente novo e mais sobre **garantia de entrega**: retry com backoff quando o provedor externo falha, fila de mensagens entre o serviço que decide notificar e o worker que efetivamente envia (pra não perder notificação se o worker cair no meio do processamento), e idempotência — o mesmo evento não pode gerar notificação duplicada se o retry acontecer.

## Feed de notícias: pré-computar ou calcular na hora

Este é, junto com consistent hashing, o estudo de caso mais citado do livro fora do contexto de entrevista, porque a decisão se generaliza bem além de feed social.

![Comparação entre fanout on write, que grava o post no feed pré-computado de cada seguidor no momento da publicação, e fanout on read, que busca os posts de quem o usuário segue e monta o feed no momento da leitura](/images/system-design-interview-alex-xu-resumo-news-feed-fanout.svg)

**Fanout on write (push):** quando alguém posta, o sistema já grava esse post no feed pré-computado de cada seguidor, na hora. Ler o feed depois é instantâneo — é só buscar o que já está pronto. O problema aparece com contas de milhões de seguidores: um post gera milhões de escritas simultâneas, o chamado **problema de hotkey/celebridade**.

**Fanout on read (pull):** o feed não é pré-computado — quando o usuário abre o app, o sistema busca os posts de quem ele segue e monta o feed ali. Escrita fica barata (grava o post uma vez), mas toda leitura paga o custo de agregar várias fontes.

A resposta do livro, como quase sempre em system design, é híbrida: push para a maioria das contas, pull só para as que têm seguidores demais para o push valer a pena — o sistema decide por conta, não por regra global.

## Chat, autocomplete, YouTube e Google Drive: a ideia central de cada um

Os capítulos finais do volume 1 cobrem produtos mais específicos. Resumo do que cada um contribui de conceito reaproveitável:

- **Sistema de chat.** WebSocket mantém conexão persistente cliente-servidor pra entrega em tempo real (o protocolo pergunta-resposta do HTTP tradicional não serve pra "empurrar" mensagem sem o cliente pedir). O desafio real não é enviar mensagem — é manter a **ordem** correta quando o remetente está offline e a mensagem chega depois, e sincronizar estado de "lido" entre múltiplos dispositivos do mesmo usuário.
- **Search autocomplete.** Estrutura de dados **trie** (árvore de prefixos) guarda os termos mais buscados, com a contagem de frequência anotada nos nós, pra retornar o top-k de sugestões por prefixo em tempo proporcional ao tamanho do prefixo digitado, não ao total de termos armazenados. Atualizar a contagem em tempo real para cada busca é caro demais — o padrão é recalcular o trie em lote, periodicamente.
- **Design do YouTube.** O núcleo é o pipeline de **transcodificação**: o vídeo enviado é convertido pra múltiplas resoluções e formatos antes de ficar disponível, e servido depois por CDN — o servidor de aplicação nunca serve o arquivo de vídeo em si.
- **Google Drive.** Metadado (nome, dono, versão, pasta) fica num banco separado do conteúdo binário do arquivo, que vai pra armazenamento de blob dedicado. Sincronização eficiente entre dispositivos manda só o **delta** do arquivo que mudou, não o arquivo inteiro de novo a cada edição.

## O que ainda vale hoje

O livro tem seis anos e não envelheceu no que importa: as ideias centrais (consistent hashing, quorum, fanout de feed, transcodificação de vídeo) são decisões de arquitetura que continuam aparecendo, com nomes de produto diferentes, em qualquer sistema que precise escalar. O que muda com o tempo são detalhes de produto específico (uma feature nova do Instagram, uma mudança de API do YouTube) — não o raciocínio de trade-off que o livro ensina a seguir.

A crítica mais comum, e justa, é que o livro é um ponto de partida, não uma implementação de referência: cada capítulo cobre em 15-20 páginas o que um sistema real de produção resolve com anos de iteração e uma equipe inteira. Ele não substitui ler a documentação de um Cassandra, de um Kafka ou de um Redis de verdade antes de decidir usar um deles — substitui o hábito, mais comum do que deveria, de desenhar arquitetura de sistema distribuído sem nunca ter praticado o raciocínio de escala nenhuma vez antes da entrevista valer.

## Referências

- Alex Xu. *System Design Interview – An Insider's Guide, Volume 1*. ByteByteGo Publishing, 2020.
- Jeff Dean, Peter Norvig. "Latency Numbers Every Programmer Should Know" — tabela de referência de latência citada e popularizada a partir de estimativas internas do Google.
- [ByteByteGo](https://bytebytego.com/) — newsletter e material complementar de Alex Xu sobre system design.
