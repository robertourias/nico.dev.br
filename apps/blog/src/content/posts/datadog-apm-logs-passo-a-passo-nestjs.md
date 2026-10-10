---
title: "Datadog na prática: APM, logs e alertas numa API NestJS"
slug: "datadog-apm-logs-passo-a-passo-nestjs"
date: "2026-10-09"
categories: ["infra", "dev"]
status: "published"
featured: false
description: "O que é o Datadog, para que serve e um passo a passo: Agent no Docker Compose, tracing com dd-trace, logs correlacionados e um monitor numa API NestJS."
tags: ["datadog", "apm", "observabilidade", "nestjs", "docker"]
---

Datadog é uma plataforma SaaS de observabilidade: você instala um agente, aponta a aplicação para ele e passa a ver traces, logs, métricas e alertas numa interface só. Este post é o passo a passo prático dessa instalação. Para entender onde o Datadog se encaixa ao lado de OpenTelemetry, Grafana e Sentry, leia antes [Observabilidade: OpenTelemetry, Grafana, Sentry e Datadog](/posts/observabilidade-opentelemetry-grafana-sentry-datadog).

O cenário é uma API NestJS (`api-pedidos`) rodando em Docker Compose. O que você vai ter no final: a API aparecendo como serviço no APM, logs que levam ao trace da mesma requisição e um alerta que avisa quando a latência piora. O código é ilustrativo; adapte aos nomes do seu projeto.

## O que é o Datadog e para que serve

O Datadog junta, num produto comercial, o que normalmente seriam várias ferramentas:

- **APM** (Application Performance Monitoring): traces das requisições, com tempo de cada etapa (banco, chamadas HTTP, filas).
- **Logs**: coleta, busca e retenção dos logs da aplicação.
- **Infraestrutura**: métricas de hosts e containers, como CPU, memória e rede.
- **Monitors**: alertas sobre qualquer um desses dados.

O valor não está em cada recurso isolado, e sim na ligação entre eles. Do alerta você chega ao serviço, do serviço ao trace lento, do trace aos logs daquela requisição. Para isso funcionar, os dados precisam chegar com os mesmos rótulos, e isso é o que a parte de tags, mais abaixo, resolve.

Também vale saber o custo da conveniência: o preço depende do que você envia (volume de logs, de traces e quantidade de hosts). Consulte a página de preços atual antes de ligar tudo em produção.

## Como os dados chegam lá

Três peças participam, e entender o papel de cada uma evita a maior parte dos problemas de instalação:

1. **A biblioteca de tracing (`dd-trace`)** roda dentro da aplicação e gera os traces.
2. **O Datadog Agent** é um processo (aqui, um container) que recebe os traces da aplicação, lê os logs e as métricas dos containers e os envia ao Datadog.
3. **A plataforma** guarda e exibe tudo.

![Arquitetura: a API NestJS com dd-trace envia traces ao Datadog Agent na porta 8126; o Agent lê logs e metadados via Docker e envia tudo por HTTPS ao Datadog, que expõe APM, Logs, Infraestrutura e Monitors](/images/datadog-apm-logs-passo-a-passo-nestjs-arquitetura.svg)

A aplicação nunca fala diretamente com a plataforma. Ela só conhece o Agent, o que mantém a chave de API fora do código da API.

## Passo 1: conta, chave de API e site

Crie uma conta no Datadog e gere uma **API key** na área de configurações da organização (Organization Settings, API Keys). Anote também o **site** da sua conta, porque o Agent precisa enviar os dados para a região correta: `datadoghq.com` para a região padrão dos EUA, `datadoghq.eu` para a Europa, entre outras. O site aparece na URL do seu painel.

Guarde a chave num arquivo `.env`, fora do versionamento:

```bash
# .env
DD_API_KEY=cole-sua-chave-aqui
DD_SITE=datadoghq.com
```

Confirme que `.env` está no `.gitignore`. Uma chave de API commitada é uma chave vazada; se isso acontecer, revogue-a no painel e gere outra.

## Passo 2: subir o Agent no Docker Compose

O Agent entra no mesmo `docker-compose.yml` da API:

```yaml
services:
  api-pedidos:
    build: .
    ports:
      - "3000:3000"
    environment:
      DD_AGENT_HOST: datadog-agent
      DD_SERVICE: api-pedidos
      DD_ENV: dev
      DD_VERSION: 1.0.0
      DD_LOGS_INJECTION: "true"
    labels:
      com.datadoghq.tags.service: api-pedidos
      com.datadoghq.tags.env: dev
      com.datadoghq.tags.version: 1.0.0
      com.datadoghq.ad.logs: '[{"source": "nodejs", "service": "api-pedidos"}]'
    depends_on:
      - datadog-agent

  datadog-agent:
    image: gcr.io/datadoghq/agent:7
    container_name: datadog-agent
    environment:
      DD_API_KEY: ${DD_API_KEY}
      DD_SITE: ${DD_SITE}
      DD_APM_ENABLED: "true"
      DD_APM_NON_LOCAL_TRAFFIC: "true"
      DD_LOGS_ENABLED: "true"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
```

Alguns pontos desse arquivo merecem explicação:

- `DD_APM_NON_LOCAL_TRAFFIC` permite que o Agent aceite traces vindos de **outros containers**. Sem ele, o Agent só aceita conexões locais e a API fica enviando para o vazio.
- `DD_AGENT_HOST` diz à API onde está o Agent. Dentro da rede do Compose, o nome do serviço serve de endereço.
- O volume `/var/run/docker.sock` deixa o Agent descobrir os containers; o `/var/lib/docker/containers` é de onde ele lê os logs.
- O label `com.datadoghq.ad.logs` liga a coleta de logs **só para esse container**, em vez de coletar tudo que roda no host. Isso evita pagar por log que ninguém vai consultar.

Suba o Agent e confira se ele aceitou a chave:

```bash
docker compose up -d datadog-agent
docker exec datadog-agent agent status
```

O `agent status` mostra a conexão com a plataforma e o estado de cada coletor. Se a chave ou o site estiverem errados, o erro aparece aqui.

## Passo 3: instrumentar a API

Instale a biblioteca de tracing:

```bash
npm install dd-trace
```

O ponto sensível do `dd-trace` é a **ordem**: ele precisa ser carregado antes de qualquer outro módulo, porque funciona interceptando bibliotecas como HTTP, Express e drivers de banco no momento em que elas são importadas. A forma mais segura de garantir isso é carregá-lo na linha de comando, sem tocar no código. No `Dockerfile`:

```dockerfile
CMD ["node", "--require", "dd-trace/init", "dist/main.js"]
```

Com isso, o tracer sobe com a aplicação e lê `DD_SERVICE`, `DD_ENV`, `DD_VERSION` e `DD_AGENT_HOST` do ambiente. Reconstrua e suba a API:

```bash
docker compose up -d --build api-pedidos
```

Sem mudar uma linha da aplicação, as requisições HTTP, as consultas ao banco e as chamadas de saída já viram spans de um trace.

Para detalhar um trecho do seu próprio código, como a cobrança de um pedido, crie um span manual:

```ts
import tracer from 'dd-trace';

async function cobrarPedido(pedido: Pedido) {
  return tracer.trace('pedido.cobrar', { resource: 'cobranca' }, async () => {
    return gateway.cobrar(pedido);
  });
}
```

Use isso com parcimônia. A instrumentação automática costuma cobrir o essencial, e o span manual serve para trechos de negócio que merecem aparecer com nome próprio.

## Passo 4: tags unificadas (service, env, version)

Repare que `DD_SERVICE`, `DD_ENV` e `DD_VERSION` aparecem duas vezes no Compose: como variáveis de ambiente e como labels `com.datadoghq.tags.*`. Não é redundância. As variáveis marcam os **traces e logs** gerados pela aplicação; os labels marcam as **métricas do container**, vistas pelo Agent. Juntas, elas formam o que o Datadog chama de *unified service tagging*.

O resultado é que o mesmo trio identifica a API em todas as telas. Você filtra por `env:prod` e `service:api-pedidos` e enxerga traces, logs e métricas do mesmo serviço. O `version` é o que permite comparar desempenho antes e depois de um deploy.

Dois cuidados práticos. Padronize os nomes: `api-pedidos` num lugar e `pedidos-api` em outro viram dois serviços distintos. E atualize o `DD_VERSION` a cada release, de preferência com o hash do commit ou a tag do build, para o campo servir de fato como marcador de deploy.

## Passo 5: logs que levam ao trace

Os logs só ajudam na investigação se forem estruturados e carregarem o ID do trace. Use logs em JSON, que o Agent interpreta sem regra de parsing. Com `pino`:

```ts
import pino from 'pino';

export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });

logger.info({ pedidoId: pedido.id }, 'pedido criado');
```

Com `DD_LOGS_INJECTION=true`, o `dd-trace` acrescenta automaticamente ao log os identificadores do trace e do span ativos. O log passa a sair mais ou menos assim:

```json
{
  "level": 30,
  "msg": "pedido criado",
  "pedidoId": 8123,
  "dd": { "trace_id": "…", "span_id": "…", "service": "api-pedidos", "env": "dev" }
}
```

É esse bloco `dd` que costura as duas pontas: ao abrir um trace no APM, a aba de logs mostra as linhas da mesma requisição; ao abrir um log, há um atalho para o trace. A injeção cobre as bibliotecas de log mais comuns do Node, como `pino` e `winston`; confira na documentação se a sua está na lista.

Evite colocar dados sensíveis nesses logs. Senhas, tokens e dados pessoais enviados ao Datadog ficam fora do seu controle depois que saem da máquina.

## Passo 6: gerar tráfego e verificar

Dados só aparecem se houver requisições. Faça algumas chamadas à API:

```bash
for i in $(seq 1 30); do curl -s http://localhost:3000/pedidos > /dev/null; done
```

Depois de um ou dois minutos, procure estes sinais na plataforma:

1. **APM → Services**: `api-pedidos` aparece com latência, taxa de requisições e taxa de erro.
2. **Abrir um trace**: a lista de spans mostra onde o tempo foi gasto, com a consulta ao banco como um span separado.
3. **Logs**: as linhas da API aparecem filtráveis por `service:api-pedidos`.
4. **Do trace aos logs**: na aba de logs do trace, aparecem só as linhas daquela requisição.

Se o serviço não aparece, as causas mais comuns são sempre as mesmas: site da conta incorreto, `DD_APM_NON_LOCAL_TRAFFIC` ausente, API iniciada sem o `--require dd-trace/init` ou `DD_AGENT_HOST` apontando para o lugar errado. O `agent status` do passo 2 e os logs do container da API (`docker compose logs api-pedidos`) dizem qual é.

## Passo 7: um alerta que exige ação

Com os dados chegando, crie um **monitor**. Em Monitors, escolha um novo monitor do tipo APM, selecione o serviço `api-pedidos` no ambiente desejado e defina a condição, por exemplo, latência no percentil 95 acima de um limite, ou taxa de erro acima de um percentual, por alguns minutos seguidos.

Dois ajustes separam um alerta útil de um alerta ignorado:

- **Limite baseado no que é normal.** Olhe o gráfico dos últimos dias antes de escolher o número. Um limite arbitrário ou dispara toda hora ou nunca dispara.
- **Mensagem com próximo passo.** Escreva no texto do monitor o que quem recebe deve fazer primeiro: qual dashboard abrir, qual comando rodar, com quem falar. Um alerta sem ação vira ruído.

Defina também para onde o alerta vai (e-mail, Slack e outras integrações disponíveis) e teste com um limite baixo, para confirmar que a notificação chega antes de depender dela.

## Armadilhas

**Custo de logs.** Coletar tudo de todos os containers é a forma mais rápida de estourar o orçamento. Prefira ativar por container, como fizemos com o label, e filtre logs de baixo valor, como health checks.

**Cardinalidade de tags.** Tags com valores quase únicos, como `user_id` ou `pedido_id`, geram uma quantidade enorme de combinações em métricas. Identificadores únicos pertencem aos logs e aos atributos de span, não às tags de métrica.

**Ambientes misturados.** Se dev e produção usam o mesmo `DD_ENV`, os dados se confundem e o alerta de produção dispara por causa de teste. Defina o `env` em todos os ambientes.

**Chave de API no repositório.** Use `.env` ou o gerenciador de segredos da sua plataforma, e revogue a chave caso ela vaze.

**Agent sem acompanhamento.** O Agent também é software: mantenha a imagem atualizada e observe se ele está saudável, porque, se ele parar, a observabilidade para junto, sem alarde.

## Conclusão

Instalar o Datadog é a parte curta. O que dá retorno é a disciplina em volta: nomes de serviço consistentes, `version` atualizado a cada deploy, logs estruturados com o ID do trace e alertas com um próximo passo claro.

Comece com um serviço, o caminho do Passo 2 ao 7, e só depois replique para os demais. Se o seu time prefere manter a instrumentação independente de fornecedor, o Datadog também aceita dados em OTLP, como o post de observabilidade mostra; a escolha entre `dd-trace` e OpenTelemetry é sobre o quanto você valoriza a integração pronta contra a portabilidade.

## Referências

- Datadog, documentação do Agent em Docker: https://docs.datadoghq.com/agent/docker
- Datadog, rastreamento de aplicações Node.js (`dd-trace`): https://docs.datadoghq.com/tracing/trace_collection
- Datadog, *Unified Service Tagging*: https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging
- Datadog, coleta de logs: https://docs.datadoghq.com/agent/logs
- Post relacionado: [Observabilidade: OpenTelemetry, Grafana, Sentry e Datadog](/posts/observabilidade-opentelemetry-grafana-sentry-datadog)
