---
title: "k6: guia prático de teste de carga com passo a passo"
slug: "k6-teste-de-carga-guia-pratico"
date: "2026-09-27"
categories: ["dev", "infra"]
status: "published"
featured: false
description: "O que é o k6, os seis tipos de teste de carga que ele documenta, e um passo a passo completo: instalar, escrever o script, rodar, ler o resultado e travar o CI com thresholds."
tags: ["k6", "teste-de-carga", "performance", "ci-cd", "grafana"]
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
---

Você só descobre a capacidade real do seu sistema de duas formas: esperando o tráfego real quebrar alguma coisa, ou simulando esse tráfego antes. **k6** é a ferramenta que a Grafana descreve como "uma ferramenta de teste de performance open-source, amigável ao desenvolvedor e extensível, que ajuda a pegar problemas de performance cedo e melhorar a confiabilidade proativamente". Este post explica o essencial e monta um passo a passo, com base na [documentação oficial](https://grafana.com/docs/k6/latest/).

Se você já escalou horizontalmente seu banco (veja [SQL vs NoSQL: quando usar e como escalar horizontal](/posts/sql-nosql-postgres-mongodb-escalabilidade-horizontal)), o k6 é a ferramenta que confirma se aquela decisão aguenta o tráfego que você projetou — ou some o número exato que ela aguenta.

## O que é o k6

k6 é uma CLI que executa script em **JavaScript** simulando usuários reais fazendo requisição contra o seu sistema. A unidade central é o **VU (Virtual User)**: cada VU roda o script em loop, de forma independente dos outros, e mais VUs simulando ao mesmo tempo significa mais tráfego simulado. Cada execução completa do script por um VU é uma **iteration**.

Diferente de gravar clique numa interface, você escreve o cenário como código — o que faz o teste de carga virar mais um artefato versionado no repositório, igual a um teste automatizado.

## Os seis tipos de teste

A documentação de testing guides do k6 descreve seis formatos, cada um respondendo uma pergunta diferente sobre o sistema:

![Seis formatos de teste de carga pelo número de VUs ao longo do tempo: smoke (baixo e curto), load (rampa, platô, rampa em carga típica), stress (platô acima do esperado), spike (pico curto e brutal), soak (platô longo em horas) e breakpoint (rampa sem teto até a falha)](/images/k6-teste-de-carga-guia-pratico-tipos-de-teste.svg)

| Tipo | Pergunta que responde | Forma típica |
|---|---|---|
| Smoke | O script funciona e o sistema aguenta uma carga mínima? | 1-2 VUs, minutos |
| Load (average-load) | Como o sistema se comporta na carga típica de produção? | rampa, platô, rampa; 5-60 min |
| Stress | O que acontece quando a carga passa do esperado? | platô acima do normal; 5-60 min |
| Spike | O sistema sobrevive e se recupera de um pico súbito? | subida e descida abruptas; minutos |
| Soak | Existe vazamento de memória, conexão ou recurso ao longo do tempo? | carga média, sustentada por horas |
| Breakpoint | Qual é o limite exato de capacidade do sistema? | rampa crescente sem teto, até falhar |

Todos usam a mesma estrutura de script — só o bloco `options` muda. Faz sentido rodar smoke sempre (é rápido, pega erro de script e regressão óbvia) e escolher entre load, stress, spike, soak ou breakpoint conforme a pergunta que você precisa responder naquele momento.

> **Antes de continuar:** só rode teste de carga contra um sistema que você tem autorização explícita pra testar — o seu, ou um ambiente de teste dedicado. Gerar tráfego pesado contra um serviço de terceiro sem permissão pode ser interpretado como ataque de negação de serviço. O exemplo deste post usa o `quickpizza.grafana.com`, alvo de demonstração que a própria documentação do k6 disponibiliza pra esse fim.

## Passo a passo

![Fluxo do teste: escrever o script com http.get e check, rodar com vus e duration ou stages, ler o resumo com http_req_duration e checks, definir thresholds, e o CI/CD decidir pelo exit code](/images/k6-teste-de-carga-guia-pratico-fluxo.svg)

### 1. Instalar

```bash
# macOS
brew install k6

# Windows
winget install k6 --source winget

# Linux (Debian/Ubuntu)
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Docker, sem instalar nada localmente
docker pull grafana/k6
```

### 2. Escrever o primeiro script

Um script de k6 é um módulo JS com uma função `default` — é ela que cada VU executa em loop:

```js
// script.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const res = http.get('https://quickpizza.grafana.com/');
  check(res, { 'status foi 200': (r) => r.status === 200 });
  sleep(1);
}
```

O `check` registra se a condição passou, sem interromper o teste quando falha — é uma verificação, não uma asserção que aborta. O `sleep(1)` simula uma pausa entre ações, do jeito que um usuário real não dispara requisição em loop instantâneo.

### 3. Rodar com um número de VUs e uma duração

```bash
k6 run --vus 10 --duration 30s script.js
```

Isso sobe 10 VUs simultâneos, cada um repetindo o script por 30 segundos. É o teste smoke: rápido, poucos VUs, só pra confirmar que o script e o sistema respondem.

### 4. Ler o resumo no fim da execução

Ao terminar, o k6 imprime um resumo no terminal. As métricas que mais importam:

| Métrica | O que mede |
|---|---|
| `http_reqs` | Total de requisições HTTP geradas |
| `http_req_duration` | Tempo total da requisição (enviar + esperar + receber) |
| `http_req_waiting` | Tempo até o primeiro byte da resposta (TTFB) |
| `http_req_failed` | Taxa de requisições que falharam |
| `checks` | Taxa de sucesso dos `check()` do script |
| `vus` / `vus_max` | VUs ativos no momento / máximo alcançado no teste |
| `iterations` | Quantas vezes, no total, os VUs executaram o script |
| `data_sent` / `data_received` | Volume de dados trafegado |

`http_req_duration` costuma vir detalhado por percentil (p90, p95). É o percentil, não a média, que importa pra decidir se o sistema está bom: a média esconde a cauda lenta que afeta uma fração real dos seus usuários.

### 5. Simular uma carga realista com `stages`

Subir os 10 VUs de uma vez não é como tráfego real chega. `stages` descreve uma rampa: sobe, sustenta, desce.

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3m', target: 20 },  // rampa de subida
    { duration: '5m', target: 20 },  // platô
    { duration: '3m', target: 0 },   // rampa de descida
  ],
};

export default function () {
  const res = http.get('https://quickpizza.grafana.com/');
  check(res, { 'status foi 200': (r) => r.status === 200 });
  sleep(1);
}
```

```bash
k6 run script.js
```

Com `options` no script, os parâmetros de execução não precisam mais vir por flag de linha de comando. Esse é o desenho de um teste de **load**: rampa, platô de 5 minutos em carga esperada, rampa de volta a zero.

### 6. Travar o resultado com `thresholds`

Ler o resumo à mão funciona pra um teste manual, mas não escala pra rodar em CI. `thresholds` transforma uma métrica em critério de aprovação — se a condição falhar, o k6 termina com status de falha (código de saída diferente de zero):

```js
export const options = {
  stages: [
    { duration: '3m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% das requisições abaixo de 500ms
    http_req_failed: ['rate<0.01'],     // menos de 1% de falha
  },
};
```

Isso é o que faz o teste de carga virar **gate de pipeline**: o job de CI roda `k6 run` e falha o build se o threshold não passar, do mesmo jeito que falharia por um teste unitário quebrado. Existe também `abortOnFail`, que interrompe o teste assim que o threshold falha em vez de esperar o fim — útil pra não gastar minutos de execução quando já se sabe que vai reprovar.

### 7. Escolher o próximo tipo de teste

Com o load test rodando e os thresholds definidos, trocar de tipo de teste é trocar só o bloco `stages` (ou os parâmetros de execução):

- **Stress:** eleve o `target` do platô bem acima da carga esperada e observe onde `http_req_failed` começa a subir.
- **Spike:** troque a rampa suave por uma subida e descida rápidas (poucos segundos) pra um `target` bem alto.
- **Soak:** mantenha o `target` na carga média, mas estenda o platô pra horas, de olho em métrica de memória e conexão do lado do servidor, não só do k6.
- **Breakpoint:** rampa contínua sem platô, subindo até o sistema falhar — esse número final é a sua capacidade real, e vira input real pra decisão de escala horizontal do próximo componente que travar primeiro.

## O que fica

Teste de carga não é sobre provar que o sistema aguenta — é sobre descobrir onde ele para de aguentar, antes que o tráfego real descubra por você. O k6 reduz isso a um script versionável: comece por smoke pra validar que o cenário funciona, suba pra load pra ver o comportamento na carga esperada, e reserve stress, spike, soak e breakpoint pra perguntas específicas que a sua arquitetura ainda não respondeu. `thresholds` é o que transforma essa investigação pontual em verificação contínua, do mesmo jeito que testes automatizados protegem contra regressão de funcionalidade.

## Referências

- Grafana. [k6 Documentation](https://grafana.com/docs/k6/latest/) — visão geral e posicionamento oficial.
- Grafana. [Installation](https://grafana.com/docs/k6/latest/get-started/installation/)
- Grafana. [Running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- Grafana. [k6 options reference — stages, vus, duration](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/)
- Grafana. [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- Grafana. [Metrics reference](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
- Grafana. [Test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/) — smoke, load, stress, spike, soak, breakpoint.
- No blog: [SQL vs NoSQL: quando usar e como escalar horizontal](/posts/sql-nosql-postgres-mongodb-escalabilidade-horizontal)
