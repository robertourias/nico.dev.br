---
title: "GTM: o que é, como implementar e ler os dados"
slug: "gtm-google-tag-manager-implementar-ler-dados"
date: "2026-10-09"
categories: ["tech", "business"]
status: "published"
featured: false
description: "Entenda o que é o Google Tag Manager, como instalar o contêiner, criar tags e eventos com dataLayer e ler os relatórios no GA4."
tags: ["google-tag-manager", "gtm", "google-analytics-4", "datalayer", "analytics"]
---

O time de marketing quer medir quantas pessoas clicam em "Assinar newsletter". Você abre o código, adiciona um trecho de JavaScript do Google Analytics, faz o deploy. Duas semanas depois, pedem para medir também o clique no banner e instalar o pixel de anúncios. Cada pedido vira outra mudança no código, outro deploy e outra fila de revisão.

O **Google Tag Manager** (GTM) existe para quebrar esse ciclo. Você instala um único snippet no site e passa a adicionar, alterar e remover ferramentas de medição por uma interface web, sem mexer no código a cada pedido.

Este post explica o que o GTM é, como implementá-lo passo a passo e, no fim, um ponto que costuma confundir: onde você lê os números. A resposta curta é que o GTM entrega os dados, mas quem mostra os relatórios é outra ferramenta, em geral o Google Analytics 4.

## O que é o Google Tag Manager

O GTM é um sistema de gerenciamento de tags. Uma **tag** é um trecho de código que envia dados a uma ferramenta, como um evento para o Google Analytics ou uma conversão para uma plataforma de anúncios. Sem o GTM, cada tag fica escrita no código do site. Com ele, as tags ficam dentro de um **contêiner**, que a documentação define como uma coleção de tags, gatilhos, variáveis e configurações relacionadas instalada em um site ou app.

O contêiner trabalha com três peças que vale decorar:

- **Tag**: o que enviar e para onde (por exemplo, um evento para o GA4).
- **Gatilho** (*trigger*): quando a tag dispara (ao carregar a página, ao clicar, ao receber um evento específico).
- **Variável**: um dado que tags e gatilhos usam, como a URL da página, o texto de um botão ou um valor vindo do código.

![Fluxo do Google Tag Manager: o site carrega o snippet e envia eventos pelo dataLayer; dentro do contêiner, um gatilho decide quando disparar uma tag, que usa variáveis e envia os dados ao Google Analytics 4 e a outras ferramentas](/images/gtm-google-tag-manager-implementar-ler-dados-fluxo.svg)

O diagrama mostra a divisão de trabalho. O site só precisa conhecer o GTM. A decisão de quem recebe o quê, e quando, mora na interface do contêiner.

## Para que serve

O uso mais comum é medir o comportamento no site e enviar esses dados ao **Google Analytics 4** (GA4): visualizações de página, cliques, envio de formulários, rolagem. Também serve para instalar pixels de plataformas de anúncios e outros scripts de terceiros.

O ganho para quem desenvolve é a separação de responsabilidades. O time de produto ou marketing cria e ajusta tags sem esperar um deploy, e o código do site fica limpo. O ganho para quem mede é o histórico: o GTM guarda **versões** do contêiner, então dá para ver o que mudou e voltar atrás.

Há um custo. Cada tag executa JavaScript no navegador, e um contêiner cheio de tags pode pesar no carregamento. Revise o que está publicado de tempos em tempos e remova o que ninguém usa. Sobre o impacto no desempenho, veja o post sobre [acessibilidade avançada, WCAG e Core Web Vitals](/posts/acessibilidade-avancada-wcag-core-web-vitals).

## Como implementar o GTM

### Passo 1: criar a conta e o contêiner

No GTM, crie uma conta para a empresa e um contêiner para cada site ou app. Para um site, escolha o tipo **Web**. A documentação recomenda nomear o contêiner com a URL de mais alto nível do site, como `www.exemplo.com.br`. Não é preciso um contêiner por página.

O contêiner recebe um identificador no formato `GTM-XXXXXX`, que aparece na aba **Workspace**.

### Passo 2: instalar os dois snippets

O GTM fornece dois trechos de código, e os dois entram em **todas as páginas** do site. O primeiro vai o mais alto possível dentro do `<head>`:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->
```

O segundo, um `noscript` para navegadores sem JavaScript, vai logo depois da abertura do `<body>`:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

Troque `GTM-XXXXXX` pelo ID do seu contêiner nos dois lugares. Em frameworks, o lugar certo é o layout raiz, que envolve todas as páginas. Se o site usa CMS ou um construtor de sites, prefira a integração própria do GTM em vez de editar páginas.

### Passo 3: criar a tag do Google Analytics

Com o contêiner instalado, crie no GTM uma tag do Google (Google tag) apontando para o ID de medição do GA4, que começa com `G-`, e configure-a para disparar em todas as páginas. Isso já registra as visualizações de página.

Em sites de página única (SPA), a navegação não recarrega a página. Nesse caso, configure um gatilho de mudança de histórico (*History Change*) para registrar as trocas de rota.

### Passo 4: medir um evento com o dataLayer

Para eventos que o GTM não enxerga sozinho, o código do site avisa o contêiner pelo **dataLayer**: um array JavaScript chamado `dataLayer`, que o GTM lê para decidir o que disparar. O envio é feito com `dataLayer.push()` e um objeto com a chave `event`:

```tsx
function aoAssinarNewsletter() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'newsletter_signup',
    origem: 'rodape',
  });
}
```

Algumas regras da documentação evitam os erros mais comuns. O nome é sensível a maiúsculas: `datalayer.push` não funciona. Não reatribua o array (`dataLayer = [...]`), porque isso apaga o que já estava lá; use o padrão `window.dataLayer = window.dataLayer || []`. E não envie dados pessoais, como e-mail ou CPF, nos eventos.

Depois, no GTM, crie um gatilho do tipo **Evento personalizado** com o nome `newsletter_signup` e uma tag de evento do GA4 que dispare nesse gatilho. A variável `origem` pode ser lida do dataLayer por uma variável do GTM e enviada como parâmetro do evento.

### Passo 5: testar no modo de visualização

Antes de publicar, teste. No **Workspace**, clique em **Preview**: o Tag Assistant abre numa nova aba. Informe a URL do site, clique em **Connect**, e depois em **Continue** para abrir a interface de depuração.

Navegue pelo site e a interface mostra, a cada interação, quais tags dispararam, qual gatilho as acionou e quais não dispararam. Repita a ação do exemplo (assinar a newsletter) e confirme que a tag aparece como disparada. O modo de visualização só funciona no seu navegador (ou para quem recebeu o link), então visitantes normais não o veem.

### Passo 6: publicar

Satisfeito com o teste, publique o contêiner (botão **Submit**). Cada publicação gera uma **versão**, e você pode voltar a uma anterior se algo quebrar. Dê um nome descritivo à versão, como "Evento de assinatura da newsletter", porque o histórico depende disso.

## Como ler os dados

Aqui está o ponto de confusão: o GTM não tem um painel de métricas de negócio. A interface dele serve para **configurar e depurar**. Os números ficam na ferramenta que recebe os dados, o GA4 no caso deste post.

### O que olhar no GTM

Na aba **Workspace**, a visão geral resume o que está pendente de publicação. As seções de Tags, Gatilhos e Variáveis mostram o que existe. A aba **Versions** guarda o histórico. E o modo **Preview** responde à pergunta "esta tag está disparando quando deveria?". É o painel de saúde da implementação, não dos resultados.

### O que olhar no GA4

O GA4 organiza os relatórios em grupos. Os nomes abaixo seguem a documentação em inglês, e a interface aparece no idioma da sua conta.

| Relatório | Pergunta que responde |
|-----------|-----------------------|
| Realtime | Os dados estão chegando agora? Útil para validar uma implementação nova |
| Acquisition (Traffic acquisition) | De onde vêm as pessoas: busca, redes sociais, e-mail, tráfego direto |
| Engagement (Pages and screens) | Quais páginas são mais vistas e quais retêm mais |
| Engagement (Events) | Quantas vezes cada evento aconteceu, incluindo os que você criou |
| Monetization | Compras e receita, quando há e-commerce configurado |

Dentro desses relatórios, quatro conceitos dão a maior parte do valor:

- **Sessões**: um grupo de interações dentro de uma janela de tempo. Por padrão, a sessão termina após 30 minutos sem atividade.
- **Usuários**: o GA4 distingue *total users* (quem disparou qualquer evento no período) de *active users* (quem teve uma sessão engajada). Compare métricas sempre dentro da mesma definição.
- **Taxa de engajamento**: o percentual de sessões engajadas. Uma sessão conta como engajada se durar mais de 10 segundos, tiver um evento-chave ou tiver duas ou mais visualizações de página ou tela. A taxa de rejeição é o complemento: se o engajamento é de 60%, a rejeição é de 40%.
- **Eventos-chave** (*key events*): os eventos que você marca como importantes para o negócio, como uma compra ou o envio de um formulário. O `newsletter_signup` do exemplo seria um bom candidato.

Uma leitura prática costuma seguir esta ordem: começar pela aquisição, para saber de onde vem o público; passar pelas páginas e pela taxa de engajamento, para ver o que funciona; e fechar nos eventos-chave, para ligar o comportamento ao resultado de negócio.

Cuidado com a conclusão apressada. Um número baixo de eventos pode indicar pouco uso ou uma tag que não está disparando. Confirme sempre no modo Preview antes de interpretar um dado como comportamento do usuário.

## Cuidados

Medição envolve dados de pessoas. Defina quais dados coletar, evite informações pessoais no dataLayer e verifique as exigências de consentimento aplicáveis ao seu público, como as da LGPD, com quem cuida do jurídico e da privacidade na empresa. Esses requisitos afetam como e quando as tags podem disparar.

Para acompanhar a saúde do site em produção além da análise de uso, como erros e desempenho, o foco é outro, e o post sobre [observabilidade com OpenTelemetry, Grafana, Sentry e Datadog](/posts/observabilidade-opentelemetry-grafana-sentry-datadog) cobre esse lado.

## O que fica

O GTM muda quem decide a medição: em vez de cada pedido virar código e deploy, o código do site expõe fatos (o dataLayer) e o contêiner decide o que fazer com eles. Isso funciona bem enquanto os eventos têm nomes claros e o contêiner é mantido com disciplina.

Para começar, instale o contêiner, crie a tag do GA4 e escolha um único evento que importe para o negócio. Implemente-o com `dataLayer.push`, teste no Preview, publique, e confirme no relatório de Realtime do GA4. Se esse ciclo completo funcionar uma vez, o resto é repetição.

## Referências

- Google. [Instalar um contêiner da Web (Tag Manager)](https://support.google.com/tagmanager/answer/14847097), ajuda do Google Tag Manager.
- Google. [Introdução e criação de contêiner](https://support.google.com/tagmanager/answer/14842164), ajuda do Google Tag Manager.
- Google. [Preview e depuração de contêineres](https://support.google.com/tagmanager/answer/6107056), ajuda do Google Tag Manager.
- Google. [The data layer](https://developers.google.com/tag-platform/tag-manager/datalayer), documentação para desenvolvedores.
- Google. [Relatórios do Google Analytics 4](https://support.google.com/analytics/answer/9212670), ajuda do Google Analytics.
- Google. [Taxa de engajamento e taxa de rejeição](https://support.google.com/analytics/answer/12195621) e [Entender as métricas de usuários](https://support.google.com/analytics/answer/12253918), ajuda do Google Analytics.
