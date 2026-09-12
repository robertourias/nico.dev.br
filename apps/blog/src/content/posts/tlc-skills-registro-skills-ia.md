---
title: "TLC Skills: skills validadas pro seu agente de IA"
slug: "tlc-skills-registro-skills-ia"
date: "2026-09-12"
categories: ["tech", "ia"]
status: "published"
featured: false
description: "Como instalar e usar o Agent Skills do Tech Leads Club, o registry que valida skills antes de deixar seu Claude Code ou Cursor rodar código de terceiros."
tags: ["claude-code", "ia", "cli", "developer-tools", "agent-skills"]
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
---

Toda skill que você instala num agente de IA é código rodando com as suas credenciais, no seu repositório, com acesso ao que o agente tem acesso. E o mercado de skills hoje é basicamente isso: pastas de markdown e scripts que qualquer pessoa publica, sem revisão nenhuma. O próprio [Agent Skills](https://github.com/tech-leads-club/agent-skills) do Tech Leads Club cita que mais de 13% das skills disponíveis em marketplaces abertos têm vulnerabilidades críticas. É pra resolver esse problema específico que o projeto existe.

## O que é

Agent Skills é um registry curado de skills para agentes de coding — Claude Code, Cursor, Copilot, Windsurf, Cline e mais de uma dúzia de outros, divididos em três tiers de suporte (dos mais populares aos enterprise, como Amazon Q e Sourcegraph Cody). Cada skill nesse catálogo passa por scan de segurança (Snyk Agent Scan) antes de ser publicada, e a CLI que instala essas skills tem proteção contra symlink attack, isolamento de path e lockfile com hash de conteúdo — ou seja, a preocupação não é só "ter um catálogo bonito", é garantir que o que cai no seu projeto é o que você pediu, sem modificação silenciosa.

A licença é dividida: o motor da aplicação é MIT, as skills produzidas pelo próprio Tech Leads Club são CC-BY-4.0 (exige atribuição), e skills de terceiros mantêm a licença original de quem publicou.

Uma skill, na prática, é uma pasta com essa estrutura:

```
packages/skills-catalog/skills/
  (categoria)/
    nome-da-skill/
      SKILL.md          # instruções principais
      templates/        # templates de arquivo
      references/       # documentação sob demanda
```

O `SKILL.md` é o que o agente lê quando a skill é ativada — é ali que fica o comportamento, os gatilhos de texto e as referências que ele pode carregar conforme precisa.

## Instalando

O caminho mais simples é rodar o wizard interativo, sem instalar nada globalmente:

```bash
npx @tech-leads-club/agent-skills
```

Ele te leva por cinco passos: escolher instalar ou atualizar, navegar pelo catálogo e selecionar a skill, escolher o agente-alvo (Claude Code, Cursor, etc.), escolher entre copiar o arquivo ou usar symlink, e definir se a instalação é global ou só do projeto atual.

Se você usa isso com frequência, vale instalar global:

```bash
npm install -g @tech-leads-club/agent-skills
agent-skills
```

Requisito único: Node.js 22+.

## Comandos do dia a dia

Fora do modo interativo, dá pra fazer tudo direto por flag — o que é bem mais rápido quando você já sabe o nome da skill:

```bash
# instalar uma skill específica pro Claude Code
agent-skills install -s tlc-spec-driven -a claude-code

# instalar várias de uma vez, pra vários agentes
agent-skills install -s aws-advisor coding-guidelines -a cursor claude-code

# atualizar uma skill (ou todas, sem -s)
agent-skills update -s tlc-spec-driven
agent-skills update

# remover
agent-skills remove -s tlc-spec-driven

# listar o catálogo
agent-skills list

# limpar o cache local (fica em ~/.cache/agent-skills/)
agent-skills cache --clear
```

Tem também `agent-skills audit`, que mostra as últimas instalações e a origem de cada skill — útil se você quer auditar o que entrou no projeto sem precisar abrir o lockfile na mão.

Se você prefere que o próprio agente descubra e carregue skills sob demanda em vez de instalar tudo antecipado, existe o pacote `@tech-leads-club/agent-skills-mcp`, que expõe o catálogo inteiro como servidor MCP (`list_skills`, `search_skills`, `read_skill`, `fetch_skill_files`). Configuração é a de qualquer MCP:

```json
{
  "mcpServers": {
    "agent-skills": {
      "command": "npx",
      "args": ["-y", "@tech-leads-club/agent-skills-mcp"]
    }
  }
}
```

## Fluxo real: cadastro de anúncios com a `tlc-spec-driven`

Pra ver isso funcionando, pega um projeto simples — um app de classificados, tipo OLX de bolso, onde a próxima feature é o cadastro de anúncio (título, descrição, preço, categoria, fotos). Em vez de pedir pro Claude Code "implementa o cadastro de anúncio" e torcer pra ele acertar o escopo, instala a skill de spec-driven development:

```bash
agent-skills install -s tlc-spec-driven -a claude-code
```

Essa skill organiza o trabalho em quatro fases — **Specify**, **Design**, **Tasks** e **Execute** — mas ela ajusta a profundidade conforme a complexidade da mudança: Design e Tasks são puladas se a feature for simples o suficiente. Specify e Execute nunca são puladas.

No terminal, o gatilho é o próprio texto do pedido. Pra feature de cadastro de anúncio, o fluxo fica assim:

**1. "specify feature: cadastro de anúncio"** — a skill produz um documento de requisitos em notação EARS ("quando o usuário submete o formulário sem preço, o sistema deve rejeitar com mensagem X"), com IDs rastreáveis e critérios de aceitação. Um script (`validate_spec.py`) garante que o formato está correto antes de deixar você avançar.

**2. "design"** — como cadastro de anúncio envolve upload de imagem, geração de slug e relação com categoria, a complexidade justifica essa fase. A skill documenta as decisões de arquitetura (onde a imagem é armazenada, como a categoria é validada, se o preço é decimal ou inteiro em centavos) sem escrever código ainda.

**3. "tasks"** — quebra o design em tarefas atômicas: criar migration da tabela `anuncios`, criar endpoint de upload, criar validação de formulário, criar tela de confirmação. Cada tarefa carrega o teste que a valida.

**4. "implement"** — execução tarefa por tarefa, com commit atômico (Conventional Commits) a cada uma. No final, um verificador independente roda sozinho e escreve um relatório de validação com evidência (arquivo e linha) de que cada requisito do Specify foi de fato atendido — não é só "rodei e parece que funciona".

Se você parar no meio — outra reunião, fim do expediente — o comando **"pause work"** salva o estado em `.specs/STATE.md`. Quando voltar, **"resume work"** lê esse arquivo, reconcilia contra o git (pra ver se algo mudou por fora) e propõe o próximo passo.

O ganho aqui não é a skill escrever o código por você — é o gate determinístico entre cada fase. Sem isso, é fácil o agente pular direto pra "implementação" com meia especificação na cabeça e você só descobrir o requisito faltando no code review.

## Vale a pena instalar

Se você já usa Claude Code ou Cursor no dia a dia e instala skills soltas da internet sem muito critério, trocar isso pelo Agent Skills não custa nada — é `npx` e pronto — e troca "confiar no README de quem publicou" por "confiar num scan de segurança e num lockfile". Pra quem lidera time e quer padronizar como os agentes trabalham (specs, commits, validação), a `tlc-spec-driven` sozinha já paga a instalação.
