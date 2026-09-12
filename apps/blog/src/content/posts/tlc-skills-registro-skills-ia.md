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

## TLC AI Dev Flow: a fábrica de software agentic

A `tlc-spec-driven` resolve uma feature de cada vez. O [TLC AI Dev Flow](https://agent-skills.techleads.club/tlc-ai-dev-flow/) mira mais alto: é a proposta do Tech Leads Club pra tratar o desenvolvimento inteiro como uma **agentic software factory** — um sistema orientado a eventos, não uma conversa manual com o agente. A frase que resume a tese do documento é direta: "code got cheap, proof did not" — escrever código ficou barato, provar que ele está certo, não.

Isso muda onde a pessoa desenvolvedora entra no processo. Em vez de ficar no meio, revisando linha por linha enquanto o agente escreve, ela se desloca pras pontas: define a intenção antes do código existir, e valida a direção depois que a prova já está pronta. No meio, quem executa e quem verifica nunca são o mesmo agente — "the author is never the verifier" é regra, não sugestão.

O fluxo completo prevê sete estações, mas a v1 (a que já dá pra instalar) implementa quatro, cada uma com sua própria skill:

- **RESEARCH** (`tlc-discover`) — transforma um problema ainda bagunçado num documento de design com decisões literais: o problema, a métrica de sucesso, a arquitetura e as assinaturas de função, tudo antes de qualquer linha de código.
- **PLAN** (`tlc-plan`) — corta o trabalho já decidido em tarefas com critério observável de "pronto", pensadas pra qualquer agente executar sem precisar adivinhar nada.
- **IMPLEMENT** (`tlc-implement`) — extrai o checklist do plano e constrói em fatias verticais (um fluxo fino ponta a ponta primeiro, aprofundado depois), em vez de levantar a aplicação inteira horizontalmente sem nada testável no meio.
- **GATE** (`the-judge`) — revisão baseada em evidência antes do PR: roda teste, tipo e lint primeiro (barato), integração e segurança depois (caro), e consolida tudo num relatório no GitHub.

Duas checagens de sanidade aparecem em mais de uma estação e valem a pena guardar: rodar o teste novo contra o código *anterior* ao patch (se ele passar mesmo assim, não está testando nada), e nunca aceitar que o próprio agente reescreva a suíte de testes existente pra fazer o teste passar.

Trabalho entra no fluxo sempre no mesmo formato — issue, pedido de usuário, alerta de incidente ou item de backlog — com escopo, critério de aceitação e responsável definidos, o que é o que permite tratar isso como fila de eventos e não como papo solto no chat. As estações futuras (v2+) são TRIAGE, INTAKE e PRODUCTION, ainda não lançadas.

Instala as quatro skills da v1 de uma vez:

```bash
npx @tech-leads-club/agent-skills install --skill tlc-discover tlc-plan tlc-implement the-judge
```

### Como fica na prática: o quadro V2

![Diagrama da Fábrica de Software Agêntica V2, mostrando o fluxo Backlog → Triagem → ToDo → In Review → Done, com Research/Plan alimentando o ToDo e o par Implement/Verify dentro dele](/images/tlc-ai-dev-flow-v2.png)

Esse diagrama do time do Tech Leads Club mostra a fábrica como um quadro Kanban de verdade, não só uma lista de estações. Dá pra ver três coisas que o texto sozinho não deixa tão claras:

Trabalho entra por três portas, não uma só. **Backlog** é o caminho manual — CEO/Visão, Product Managers e Engenheiros enfileirando o que decidiram. **Usuários** (reclamações, pedidos de feature) e **Monitoramento** (incidentes) entram direto na **Triagem**, e essa triagem já é feita por agente, não por humano decidindo prioridade um por um.

O envolvimento humano não é constante — ele varia por coluna, e o diagrama marca isso explicitamente. No Backlog, o humano faz o discovery e deixa clara a intenção antes de qualquer coisa virar Research; a saída documentada (PRD ou Design Doc) é onde humanos discutem a solução antes de implementar. No Plan, o envolvimento já cai pra mínimo — "dado um bom input", ou seja, se o Research foi bem feito, o Plan quase não precisa de babá. Dentro do ToDo, o par **Implement → Verify** roda sob um "contrato de verificação" que confirma que tudo do plano foi de fato feito, de novo com envolvimento humano mínimo — e essa etapa pode ser paralelizada com worktrees ou Cloud Agents, porque as tarefas ali são independentes. Só no **In Review** o humano volta a pesar mais: é ali que ele valida o que o agente não conseguiu resolver sozinho e garante que a direção está certa antes do Code Review. Em **Done**, envolvimento humano volta a ser mínimo.

O diagrama também dá números de expectativa que o texto do site não menciona: construir (Research → ToDo) é medido em horas; a revisão em In Review é medida em minutos a horas. É uma forma concreta de perceber onde o gargalo real do time vai estar depois de automatizar o resto — normalmente não é mais escrever código, é revisar.

Voltando pro cadastro de anúncio: onde a `tlc-spec-driven` te dá quatro fases dentro de uma feature, o AI Dev Flow trataria essa mesma feature como um evento único passando pela fábrica inteira — `tlc-discover` decide como o upload de imagem e a validação de preço vão funcionar, `tlc-plan` quebra isso em tarefas observáveis, `tlc-implement` sobe primeiro um fluxo fino (formulário → salvar → listar, sem foto ainda) e só depois aprofunda, e `the-judge` audita o PR final com evidência antes de você olhar. São modelos vizinhos no mesmo catálogo — dá pra usar a `tlc-spec-driven` numa mudança pontual e reservar o AI Dev Flow completo pra quando o time quer o pipeline inteiro automatizado, da issue ao PR revisado.

## Vale a pena instalar

Se você já usa Claude Code ou Cursor no dia a dia e instala skills soltas da internet sem muito critério, trocar isso pelo Agent Skills não custa nada — é `npx` e pronto — e troca "confiar no README de quem publicou" por "confiar num scan de segurança e num lockfile". Pra quem lidera time e quer padronizar como os agentes trabalham (specs, commits, validação), a `tlc-spec-driven` sozinha já paga a instalação.

## Referências

- [tech-leads-club/agent-skills — repositório no GitHub](https://github.com/tech-leads-club/agent-skills)
- [SKILL.md da `tlc-spec-driven`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(development)/tlc-spec-driven/SKILL.md)
- [TLC AI Dev Flow — Skills for Agentic Software Factories](https://agent-skills.techleads.club/tlc-ai-dev-flow/)
