---
title: "Hermes Agent na VPS: um agente de IA que trabalha por você"
slug: "hermes-agent-vps"
date: "2026-06-23"
category: "ia"
status: "published"
featured: false
description: "Como instalar o Hermes Agent numa VPS para ter um agente com memória persistente, tarefas agendadas e resumos diários direto no seu e-mail."
tags: ["ia", "automacao", "vps", "agentes-de-ia", "self-hosted"]
coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80"
---

Rodar um modelo de linguagem num chat resolve perguntas pontuais. Mas um agente que aprende com suas interações, guarda memória entre sessões e executa tarefas sozinho enquanto você dorme é outra categoria de ferramenta. É essa a proposta do **Hermes Agent**, projeto open source da Nous Research.

A diferença central: ele não espera você perguntar. Você configura uma vez, e ele continua trabalhando.

## O que o Hermes Agent faz

O Hermes roda em VPS, servidor dedicado, máquina local ou container Docker. Ele mantém memória persistente entre sessões, cria skills automaticamente conforme aprende novas tarefas, agenda execuções recorrentes pelo scheduler nativo e se conecta a MCP servers para estender suas próprias ferramentas.

Ele fala com você por Telegram, Discord, Slack, WhatsApp ou e-mail, e funciona com qualquer provider relevante — OpenAI, OpenRouter, Anthropic, Gemini, entre outros.

Na prática, é um funcionário digital que não tira folga.

## Arquitetura recomendada

Para uso pessoal ou projetos pequenos, uma VPS simples já basta:

| Recurso | Recomendação |
|---|---|
| Sistema operacional | Ubuntu 22.04+ |
| CPU | 2 vCPU |
| Memória | 4 GB RAM |
| Containerização | Docker (opcional) |
| Provedor de IA | OpenRouter ou OpenAI |

Nada de cluster, nada de GPU. O Hermes só precisa ficar de pé 24 horas — o processamento pesado acontece no provider de IA.

## Instalando na VPS

Atualize o servidor antes de qualquer coisa:

```bash
sudo apt update && sudo apt upgrade -y
```

Instale o Hermes com o script oficial. Ele resolve Python, Node.js e as dependências do agente automaticamente:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Confirme que a instalação funcionou:

```bash
hermes --version
```

Rode a configuração inicial e informe o provider, a API key e o modelo padrão:

```bash
hermes setup
```

```text
Provider: OpenRouter
Model: anthropic/claude-sonnet
```

## Mantendo o agente rodando 24/7

Instalar como serviço de sistema é o que garante que o Hermes sobreviva a reinicializações da VPS:

```bash
sudo hermes gateway install --system
sudo hermes gateway start --system
sudo hermes gateway status --system
```

A partir daqui, o agente fica de pé sozinho. Sem cron solto, sem `screen` aberto numa sessão SSH que alguém vai fechar por engano.

## O que dá pra automatizar

**Pesquisa de mercado.** Monitorar concorrentes, gerar relatórios semanais, acompanhar tendências de um setor específico sem abrir uma aba do navegador.

**Desenvolvimento.** Revisar código, manter documentação atualizada, monitorar repositórios e avisar quando algo relevante muda.

**Conteúdo.** Resumir notícias, rascunhar posts para LinkedIn, montar newsletters, gerar relatórios recorrentes.

**Negócios.** Relatórios financeiros, monitoramento de clientes, alertas estratégicos quando um número sai do esperado.

**Estudos.** Resumos diários de um tema, curadoria de artigos, roadmap de aprendizado que se ajusta conforme você avança.

O fio comum entre todos esses casos: você define a tarefa uma vez, e ela se repete sem precisar de você no meio do caminho.

## Caso real: notícias de IA direto no e-mail

Um fluxo concreto, do tipo que realmente vale configurar.

**Objetivo:** todos os dias às 08h, o Hermes pesquisa notícias sobre IA das últimas 24 horas, seleciona as mais relevantes, escreve um resumo e envia para o seu e-mail.

```
08:00 ──> Hermes Scheduler dispara a tarefa
            │
            ▼
      Pesquisa notícias de IA (últimas 24h)
            │
            ▼
      Seleciona e resume as mais relevantes
            │
            ▼
      Monta e-mail (título, fonte, resumo, impacto)
            │
            ▼
      Envia via SMTP para meuemail@dominio.com
```

Primeiro, configure o acesso SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
```

Se for Gmail, use uma Senha de Aplicativo — a senha normal da conta não funciona com SMTP de terceiros.

Depois, registre a tarefa no scheduler:

```bash
hermes schedule create
```

E cole uma instrução em linguagem natural, sem nenhuma sintaxe especial:

```text
Todos os dias às 08:00:
Pesquise as principais notícias sobre Inteligência Artificial publicadas
nas últimas 24 horas.
Crie um resumo contendo:
- Título
- Fonte
- Resumo de até 5 linhas
- Impacto para empresas
Envie o relatório para: meuemail@dominio.com
```

O mesmo padrão funciona pra qualquer assunto — React, Bitcoin, vagas de tecnologia, mercado imobiliário. Troca o tema da instrução, mantém a estrutura.

O e-mail que chega tem essa cara:

```text
Resumo Diário — Inteligência Artificial

OpenAI anuncia novo modelo
Resumo: A OpenAI lançou uma atualização focada em raciocínio avançado.
Impacto: Pode acelerar a adoção corporativa de agentes autônomos.

Google amplia recursos do Gemini
Resumo: Novas funcionalidades voltadas para automação empresarial.
Impacto: Maior competição no mercado de IA corporativa.
```

Sem necessidade de abrir o agente, perguntar nada, lembrar de checar. O resumo chega antes de você ligar o computador.

## Por que isso muda o jogo

A maioria das ferramentas de IA depende de você fazer a pergunta. O Hermes inverte essa lógica: você configura uma vez e passa a receber informação, análise e alerta de forma automática, sem precisar pedir de novo todo dia.

Para quem já tem uma VPS rodando, usa Docker no dia a dia ou só quer ver até onde um agente autônomo chega, o Hermes Agent é um dos projetos open source mais interessantes que apareceram nesse espaço recentemente.

A pergunta deixou de ser "qual IA eu vou usar". Passou a ser "quais agentes vão trabalhar por mim". O Hermes é um bom ponto de partida pra responder isso na prática, não na teoria.
