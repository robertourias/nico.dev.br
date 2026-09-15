---
title: "TLC Skills: skills validadas pro seu agente de IA"
slug: "tlc-skills-registro-skills-ia"
date: "2026-09-13"
categories: ["ia", "tech"]
status: "published"
featured: false
description: "Guia completo do ecossistema Tech Leads Club pra agentes de IA: o registry Agent Skills (catálogo por categoria, spec-driven driven e lean), o AI Dev Flow e o Harness Toolkit."
tags: ["claude-code", "ia", "cli", "developer-tools", "agent-skills"]
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
---
Toda skill que você instala num agente de IA é código rodando com as suas credenciais, no seu repositório, com acesso ao que o agente tem acesso. E o mercado de skills hoje é basicamente isso: pastas de markdown e scripts que qualquer pessoa publica, sem revisão nenhuma. Um [relatório da Snyk publicado em fevereiro de 2026](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf), depois de analisar quase quatro mil skills em marketplaces públicos, encontrou mais de 13% com falhas críticas — não código ruim, ameaça ativa: dezenas de casos confirmados de exfiltração de variável de ambiente, roubo de credencial de nuvem e instalação de backdoor. O vetor mais comum nem parece malware tradicional — é **"malware em linguagem natural"**: injeção de prompt camuflada dentro da própria instrução da skill, que convence o agente a ignorar aviso de segurança e vazar chave de API por baixo dos panos, driblando varredura de código convencional. É pra resolver esse problema específico que o [Agent Skills](https://github.com/tech-leads-club/agent-skills) do Tech Leads Club existe — hoje com 1,4 mil estrelas no GitHub e v1 lançada.

Esse post segue uma ordem proposital, do conceito até o dia a dia: o que é o registry → como instalar → como uma skill funciona por dentro → um tour pelo catálogo organizado pela fase do ciclo de vida do software (arquitetura, design, desenvolvimento, qualidade, segurança, performance, operação) → os dois fluxos de spec-driven development que amarram várias dessas skills num processo (`tlc-spec-driven` e `tlc-spec-lean`) → o AI Dev Flow, que estica isso pra fábrica inteira → e o Harness Toolkit, a camada de governança que roda por baixo de tudo isso. Cada seção assume a anterior, então vale ler em ordem se for a primeira vez.

## O que é o Agent Skills

O conceito de skill como "pacote de instruções, fluxos de trabalho e material de referência que estende o que o agente sabe fazer" foi popularizado pela Anthropic no Claude, mas hoje é padrão cross-agent — o Tech Leads Club sustenta isso com um registry curado pra Claude Code, Cursor, Copilot, Windsurf, Cline e mais de uma dúzia de outros, divididos em três tiers de suporte (dos mais populares aos enterprise, como Amazon Q e Sourcegraph Cody).

A defesa contra o cenário descrito acima é em profundidade, não uma camada só: revisão técnica humana antes de qualquer skill ser publicada; bloqueio automático no pipeline de CI/CD via [`mcp-scan`](https://github.com/snyk/agent-scan) (o mesmo scanner por trás do relatório da Snyk), que detecta chamada de rede obscura e manipulação incorreta de credencial em tempo real; e, na CLI que instala essas skills, proteção contra symlink attack, isolamento de path e lockfile com hash de conteúdo. A preocupação não é só "ter um catálogo bonito", é garantir que o que cai no seu projeto é exatamente o que você pediu, sem modificação silenciosa — nada muda de versão sem você atualizar ativamente.

A licença é dividida: o motor da aplicação é MIT, as skills produzidas pelo próprio Tech Leads Club são CC-BY-4.0 (exige atribuição), e skills de terceiros mantêm a licença original de quem publicou.

O [catálogo completo](https://agent-skills.techleads.club/skills/) passa de 60 skills, organizadas por categoria — arquitetura, design, desenvolvimento, qualidade, segurança, performance, tooling, cloud, monitoramento, decisão, go-to-market, entre outras. Cada skill é uma pasta com essa estrutura:

```
(categoria)/
  nome-da-skill/
    SKILL.md          # instruções principais
    templates/        # templates de arquivo
    references/       # documentação sob demanda
```

## Instalando

O caminho mais simples é rodar o wizard interativo, sem instalar nada globalmente:

```bash
npx @tech-leads-club/agent-skills
```

Ele te leva por cinco passos: escolher instalar ou atualizar, navegar pelo catálogo e selecionar a skill, escolher o agente-alvo (Claude Code, Cursor, etc.), escolher entre copiar o arquivo ou usar symlink, e definir se a instalação é global (pasta do usuário) ou só do projeto atual.

Se você usa isso com frequência, vale instalar global:

```bash
npm install -g @tech-leads-club/agent-skills
agent-skills
```

Requisito único: Node.js 22+.

Fora do modo interativo, dá pra fazer tudo direto por flag:

```bash
# instalar uma skill específica pro Claude Code
agent-skills install -s tlc-spec-driven -a claude-code

# instalar várias de uma vez, pra vários agentes
agent-skills install -s security-best-practices coding-guidelines -a cursor claude-code

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

Tem também `agent-skills audit`, que mostra as últimas instalações e a origem de cada skill — útil se você quer auditar o que entrou no projeto sem abrir o lockfile na mão. Uma extensão nativa pra VS Code, trazendo esse mesmo gerenciamento pra dentro do editor sem passar pelo terminal, está em desenvolvimento.

Se você prefere que o próprio agente descubra e carregue skills sob demanda em vez de instalar tudo antecipado, existe o pacote `@tech-leads-club/agent-skills-mcp`, que expõe o catálogo inteiro como servidor MCP (`list_skills`, `search_skills`, `read_skill`, `fetch_skill_files`):

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

## Como uma skill funciona por dentro

Esse é o pedaço que costuma ficar vago: instalar não é o mesmo que usar, e uma skill não fica "ativa" o tempo todo consumindo contexto. O ciclo é este:

1. **Instalação copia o `SKILL.md`** pra onde o seu agente procura skill. No Claude Code, por exemplo, isso é uma pasta tipo `.claude/skills/<nome-da-skill>/` (local) ou o equivalente global na home — é por isso que a CLI pergunta agente-alvo e escopo antes de instalar.
2. **O agente só carrega o conteúdo quando o gatilho bate.** Cada `SKILL.md` documenta explicitamente quando a skill se aplica — geralmente um conjunto de frases-gatilho e uma lista do que ela *não* cobre. A `security-best-practices`, por exemplo, ativa em "security review" ou "vulnerability report", mas explicitamente não ativa pra debugging genérico. Isso existe pra evitar que toda skill instalada dispute atenção do agente o tempo todo — só a relevante pro pedido atual entra em jogo.
3. **A skill roda em fases, não em um prompt só.** A maioria das skills mais robustas do catálogo segue um pipeline de 3 a 4 etapas — descoberta, execução, validação — em vez de tentar resolver tudo numa resposta.
4. **Ela produz artefato, não só resposta em texto.** Um relatório markdown, uma spec, um plano de tarefas — algo que fica no repositório e sobrevive ao fim da sessão de chat, pra próxima pessoa (ou próximo agente) ler sem precisar reconstruir o raciocínio do zero.

Na prática, você não "invoca" uma skill como quem chama uma função — você **descreve o que quer** em linguagem natural, e se o texto bate com o gatilho de alguma skill instalada, o agente puxa aquele `SKILL.md` pro contexto antes de responder.

## O catálogo por fase do ciclo de vida

Com o mecanismo entendido, vale ver o que tem no catálogo — e a forma mais útil de organizar isso não é a lista alfabética, é a ordem em que você realmente usaria cada categoria construindo uma feature: primeiro decide a estrutura (arquitetura), depois a interface (design), depois implementa (development), depois valida (qualidade e segurança), depois otimiza e opera (performance, tooling, monitoramento). Uso o mesmo projeto de exemplo do resto do post — um app de classificados com cadastro de anúncio (título, descrição, preço, categoria, fotos) — pra ilustrar onde cada categoria entraria.

### Arquitetura — antes de escrever código

- **Subdomain Identification &amp; Bounded Context Analysis** — mapeia os subdomínios do seu sistema e onde ficam as fronteiras entre eles. Útil no momento em que "anúncio" deixa de ser uma tabela e vira um domínio com moderação, destaque pago e mensageria.
- **Tactical DDD — Rich Domain Modeling** — modela entidade e regra de negócio como objeto rico (o `Anuncio` sabe se pode ser publicado), não como struct anêmica só com getters e setters.
- **Modular Decomposition** / **Evolutionary Modular Architecture** — quebram um sistema já grande em módulos que evoluem de forma independente, sem forçar reescrita completa.
- **ADR Creator** — gera o registro formal de uma decisão de arquitetura (contexto, alternativas, consequência), pra "por que escolhemos armazenar foto assim" não morar só na memória de quem decidiu.

### Design — a interface antes do backend

- **Frontend Blueprint** / **Frontend Design** — geram a estrutura de tela a partir de requisito funcional, antes de qualquer componente existir. Pro formulário de anúncio: definem campos, ordem, e onde entra validação inline.
- **Figma MCP** — conecta o agente direto num arquivo do Figma e traduz o design em componente de código, em vez de você recriar visualmente na mão.
- **Web Interface Guidelines** — aplica princípio de UI consistente (espaçamento, hierarquia, estado de erro) sem exigir um design system pronto.
- **Implement Design** — pega um design já aprovado (Figma ou imagem) e implementa fiel ao que foi desenhado, sem "melhorar" por conta própria.
- **Excalidraw Studio** / **Mermaid Studio** — geram diagrama de fluxo ou arquitetura pra documentação, direto em formato editável.

### Development — implementação

- **Coding Guidelines** — comportamental, não gera arquivo: força o agente a explicitar suposição antes de codificar, implementar só o que foi pedido e editar cirurgicamente em vez de reescrever arquivo inteiro. Pedido vago tipo "adiciona validação no formulário de anúncio" vira: teste pra entrada inválida (preço negativo, categoria inexistente) → implementação → teste passando. Critério mensurável em vez de "parece que funciona".
- **CodeNavi** — navega uma base de código grande pra achar onde uma mudança realmente precisa entrar, antes de tocar em qualquer arquivo.
- **Modular Monolith Specialist** — relevante se o backend é NestJS (como os produtos do Nico Platform). Ativa com "bounded contexts" ou "clean architecture NestJS", não em CRUD simples. Pro cadastro de anúncio, faz sentido quando o domínio cresce: mapeia contextos, desenha módulos isolados com comunicação explícita, e valida ao final que não há tabela compartilhada nem import cruzado indevido.
- **Technical Design Doc Creator** — documenta a decisão técnica de uma feature antes de implementar, um degrau abaixo de um ADR completo.
- **React Composition Patterns** / **Vercel React Best Practices** / **React Native Expert** / **Rails Conventions** / **Shopify Developer Reference** — especialistas por stack; ativam só quando o projeto detectado bate com aquele framework.
- **docs-writer** — mantém documentação em markdown consistente com o código. Lê o código-fonte antes de escrever, então o README do endpoint de anúncios sai batendo com os parâmetros reais da API.
- **Tech Lead's Club - Spec-Driven Development** e **Spec, Lean** — os dois fluxos estruturados de planejamento e execução de feature. Detalhados na próxima seção.

### Qualidade e segurança — antes do PR

- **Accessibility (a11y)** — audita e corrige acessibilidade seguindo WCAG 2.1. No formulário de anúncio, pega label ausente em campo, contraste insuficiente no botão de "publicar", foco de teclado quebrado no upload de foto.
- **Web quality audit** — auditoria multi-área (performance, SEO, acessibilidade, boas práticas) num só relatório.
- **Best practices** — aplica prática moderna de desenvolvimento web de forma genérica, quando não há uma skill mais específica pro caso.
- **Playwright Browser Automation** — automação de navegador de verdade: detecta servidor local, escreve script parametrizado (nunca com URL hardcoded) e executa com navegador visível. "Testa se o formulário de anúncio funciona em mobile e desktop" gera um teste que preenche os campos, sobe a imagem, submete e tira screenshot em três viewports.
- **Security Best Practices** — pedida com "faz uma security review do endpoint de cadastro de anúncio". Detecta linguagem e framework, carrega a referência de segurança daquele stack, e ou já escreve código seguro desde o início, ou aponta vulnerabilidade durante o desenvolvimento, ou gera relatório priorizado por severidade. No upload de foto, é onde mora a checagem de tipo de arquivo, tamanho máximo e sanitização de nome.
- **Security Ownership Map** — mapeia quem é responsável por qual parte da superfície de ataque do sistema — útil quando o time cresce e "segurança é responsabilidade de todo mundo" na prática vira responsabilidade de ninguém.
- **Threat Model Source Code Repo** — gera modelagem de ameaça a partir do código real do repositório, não de um diagrama abstrato desatualizado.

### Performance, tooling, monitoramento e cloud — depois que já está no ar

- **Core Web Vitals optimization** / **Lighthouse Audits** / **Web Performance Optimization** / **Astro Performance Playbook** — otimizam métrica real de carregamento; a última é específica pra quem usa Astro (como o blog do Nico Platform).
- **Chrome DevTools Agent** — debug e profiling de performance direto no navegador, via protocolo do Chrome DevTools.
- **Nx Workspace Management** / **Run Nx Generator** / **Nx Run Tasks** — pra quem organiza o repo como monorepo Nx: geram código a partir de generator e rodam task do jeito certo pro grafo de dependência do workspace.
- **CI Monitor Command** — acompanha execução de pipeline de CI e avisa o motivo real da falha, sem precisar abrir o dashboard.
- **Sentry** — observabilidade somente-leitura: lê erro capturado em produção sem dar ao agente permissão de alterar configuração de monitoramento.
- **Gh Pr Checks Plan Fix** / **PR Comment Handler** — leem checks que falharam num PR do GitHub e endereçam comentário de revisão de forma estruturada.
- **AWS Advisor** — consultoria de arquitetura, segurança e implementação específica pra AWS.
- **Cloudflare Deploy** / **Vercel Deploy** / **Netlify Deployment Skill** / **Deploy to Render** — automatizam o deploy pra cada provedor, sem você decorar flag de CLI de cada um.

### Decisão e outras categorias

- **The Judge** / **The Jury** / **The Fool** — skills de avaliação: `The Judge` já aparece como o gate do AI Dev Flow (revisão baseada em evidência); `The Jury` e `The Fool` são variações do mesmo princípio — usar um agente separado pra julgar o trabalho de outro, com papéis e critérios diferentes.
- **Skill Architect** / **Subagent Creator** / **RFC Creator** — pra quem quer criar suas próprias skills ou subagentes seguindo o mesmo padrão do catálogo. A arquitetura do repositório é aberta por design: contribuir é fork, gerar a skill nova com os geradores internos baseados em Nx, testar e abrir PR — e essa contribuição passa pelas mesmas validações estritas de segurança de qualquer outra skill do catálogo, revisão humana e `mcp-scan` incluídos.
- **Go-to-Market** (quase 20 skills: outreach, pricing, SEO programático, positioning) — fora do escopo técnico deste post, mas relevante se você também usa chapéu de product owner: cobre da precificação de um produto de IA até desenho de programa de afiliados.

Isso ainda é uma fração resumida — vale abrir o [catálogo completo](https://agent-skills.techleads.club/skills/) e rodar `agent-skills list` pra ver o que existe hoje, porque cresce com frequência.

## Spec-driven: Driven vs. Lean

As duas skills de `(development)` que amarram várias das anteriores num processo — e a diferença entre elas é exatamente a pergunta "quanto processo essa mudança merece". Spec-driven development não é exclusividade do Tech Leads Club: o mesmo princípio aparece no `spec-kit` do GitHub e no `OpenSpec`, e a ideia central é comum aos três — separar "decidir o que construir" de "deixar o agente construir" evita o retrabalho de um agente implementando a coisa errada rápido demais. A diferença prática do `tlc-spec-driven` é rodar sobre o mesmo catálogo de skills e (se você ligar) sobre o Harness Toolkit descrito mais adiante, então a mesma spec já nasce falando com quem audita segurança e quem barra comando perigoso, em vez de ser um processo isolado. As quatro fases funcionam em qualquer agente que suporte skills — Claude Code, Cursor, Copilot, Windsurf — e o ganho fica mais visível em mudança grande: o `Tasks` quebra o trabalho em pedaços que múltiplos subagentes conseguem executar em paralelo (via worktree ou Cloud Agents), e o estado salvo em `.specs/STATE.md` é o que permite pausar no meio de uma tarde e retomar no dia seguinte sem o agente perder o fio da meada.

### `tlc-spec-driven` — o completo

Quatro fases, cada uma opcional a partir da segunda: **Specify** (obrigatória) produz requisitos em notação EARS com critérios de aceitação; **Design** (pulável em mudança simples) documenta decisões de arquitetura sem código; **Tasks** (pulável se forem ≤3 passos óbvios) quebra o trabalho em tarefas atômicas, cada uma com teste associado; **Execute** (obrigatória) implementa tarefa por tarefa com commit atômico (Conventional Commits) e termina com um verificador independente escrevendo evidência (arquivo:linha) de que cada requisito foi cumprido. Scripts (`validate_spec.py`, `validate_tasks.py`, `check_commit.py`) barram a passagem de fase se o formato não estiver correto. Dá pra pausar (`"pause work"`, salva em `.specs/STATE.md`) e retomar depois reconciliando contra o git.

### `tlc-spec-lean` — o enxuto

Também quatro movimentos, mas sem a decomposição em tarefas e sem catálogo de componentes: **Plan** é uma proposta única — problema, critérios EARS, superfícies expostas, fluxo, entidades, pontos irreversíveis — revisada por humano uma vez só; **Checks** lista reivindicações observáveis com prova (teste ou comando que confirma cada uma) e mapeia cobertura; **Build** implementa escrevendo os testes *das verificações*, não da implementação; **Verify** é sempre um agente diferente do que implementou, validando cada checagem de forma independente. Os arquivos saem em `.specs/features/<feature>/plan.md`, `checks.md` e `verification.md`. Gatilhos: `"plan feature"`, `"write the checks"`, `"build this plan"`, `"verify work"`.

A frase que resume a diferença: a `tlc-spec-driven` **planeja o plano** (quantas tarefas, em que ordem); a `tlc-spec-lean` **congela obrigações** (o que tem que ser verdade no final) e deixa o "como chegar lá" pro diff. Menos documento intermediário, mesma exigência de prova.

### Os dois fluxos aplicados ao cadastro de anúncio

**Com `tlc-spec-driven`** (mudança maior, várias decisões de arquitetura — upload de imagem, geração de slug, categoria):

```
"specify feature: cadastro de anúncio"
  → requisitos EARS + critérios de aceitação, validados por script

"design"
  → decide onde a imagem é armazenada, como a categoria é validada,
    se o preço é decimal ou inteiro em centavos

"tasks"
  → migration da tabela anuncios, endpoint de upload,
    validação de formulário, tela de confirmação — cada uma com teste

"implement"
  → uma tarefa por vez, commit atômico, verificador independente
    confere no final que cada requisito do Specify foi atendido
```

**Com `tlc-spec-lean`** (a mesma feature, mas tratada como unidade só — sem quebrar em quatro tarefas):

```
"plan feature: cadastro de anúncio"
  → plan.md único: título/descrição/preço/categoria/fotos como
    entidade Anuncio, endpoint POST /anuncios, upload como
    ponto irreversível (uma vez salvo, precisa de rota de exclusão)

"write the checks"
  → checks.md: "POST sem preço retorna 400", "upload aceita só
    jpg/png até 5MB", "anúncio aparece na listagem após criado" —
    cada uma com o teste que prova

"build this plan"
  → implementação escrita para satisfazer os checks, não o contrário

"verify work"
  → um agente fresco, que não escreveu nada disso, roda cada
    check de forma independente e escreve verification.md
```

Na prática: se o cadastro de anúncio é só mais um CRUD com upload — sem contexto delimitado novo, sem decisão de arquitetura pra debater — o `tlc-spec-lean` entrega a mesma garantia de prova com um documento a menos e sem reunião de design. Se a feature abre um domínio novo (por exemplo, o anúncio passa a ter status de moderação, fila de aprovação, notificação pro vendedor), a fase de Design da `tlc-spec-driven` paga o custo extra por deixar essas decisões explícitas antes de alguém escrever código em cima de uma suposição errada.

## TLC AI Dev Flow: a fábrica de software agentic

As duas skills de spec-driven resolvem uma feature de cada vez. O [TLC AI Dev Flow](https://agent-skills.techleads.club/tlc-ai-dev-flow/) mira mais alto: é a proposta do Tech Leads Club pra tratar o desenvolvimento inteiro como uma **agentic software factory** — um sistema orientado a eventos, não uma conversa manual com o agente. A frase que resume a tese: "code got cheap, proof did not" — escrever código ficou barato, provar que ele está certo, não.

Isso muda onde a pessoa desenvolvedora entra no processo. Em vez de ficar no meio, revisando linha por linha enquanto o agente escreve, ela se desloca pras pontas: define a intenção antes do código existir, e valida a direção depois que a prova já está pronta. No meio, quem executa e quem verifica nunca são o mesmo agente — "the author is never the verifier" é regra, não sugestão.

O fluxo completo prevê sete estações; a v1 (a que já dá pra instalar) implementa quatro, cada uma com sua skill:

- **RESEARCH** (`tlc-discover`) — transforma um problema ainda bagunçado num documento de design com decisões literais: o problema, a métrica de sucesso, a arquitetura e as assinaturas de função, tudo antes de qualquer linha de código.
- **PLAN** (`tlc-plan`) — corta o trabalho já decidido em tarefas com critério observável de "pronto".
- **IMPLEMENT** (`tlc-implement`) — extrai o checklist do plano e constrói em fatias verticais (um fluxo fino ponta a ponta primeiro, aprofundado depois).
- **GATE** (`the-judge`) — revisão baseada em evidência antes do PR: roda teste, tipo e lint primeiro (barato), integração e segurança depois (caro), e consolida tudo num relatório no GitHub.

Duas checagens de sanidade valem guardar: rodar o teste novo contra o código *anterior* ao patch (se passar mesmo assim, não testa nada), e nunca aceitar que o próprio agente reescreva a suíte de testes existente pra fazer o teste passar.

Trabalho entra sempre no mesmo formato — issue, pedido de usuário, alerta de incidente ou item de backlog — com escopo, critério de aceitação e responsável definidos. As estações futuras (v2+) são TRIAGE, INTAKE e PRODUCTION.

Instala as quatro skills da v1 de uma vez:

```bash
npx @tech-leads-club/agent-skills install --skill tlc-discover tlc-plan tlc-implement the-judge
```

### Como fica na prática: o quadro V2

![Diagrama da Fábrica de Software Agêntica V2, mostrando o fluxo Backlog → Triagem → ToDo → In Review → Done, com Research/Plan alimentando o ToDo e o par Implement/Verify dentro dele](/images/tlc-ai-dev-flow-v2.png)

Esse diagrama do time do Tech Leads Club mostra a fábrica como um quadro Kanban de verdade, não só uma lista de estações. Três coisas que o texto sozinho não deixa tão claras:

Trabalho entra por três portas, não uma só. **Backlog** é o caminho manual — CEO/Visão, Product Managers e Engenheiros enfileirando o que decidiram. **Usuários** (reclamações, pedidos de feature) e **Monitoramento** (incidentes) entram direto na **Triagem**, e essa triagem já é feita por agente, não por humano decidindo prioridade um por um.

O envolvimento humano varia por coluna, e o diagrama marca isso explicitamente. No Backlog, o humano faz o discovery e deixa clara a intenção antes de qualquer coisa virar Research; a saída documentada (PRD ou Design Doc) é onde humanos discutem a solução antes de implementar. No Plan, o envolvimento cai pra mínimo — "dado um bom input": se o Research foi bem feito, o Plan quase não precisa de babá. Dentro do ToDo, o par **Implement → Verify** roda sob um "contrato de verificação" que confirma que tudo do plano foi feito, de novo com envolvimento humano mínimo — e pode ser paralelizado com worktrees ou Cloud Agents. Só no **In Review** o humano volta a pesar mais: valida o que o agente não conseguiu resolver sozinho e garante que a direção está certa antes do Code Review. Em **Done**, envolvimento humano volta a ser mínimo.

O diagrama também dá números de expectativa que o texto do site não menciona: construir (Research → ToDo) é medido em horas; a revisão em In Review é medida em minutos a horas — uma forma concreta de perceber que, depois de automatizar o resto, o gargalo real do time deixa de ser escrever código e passa a ser revisar.

Voltando pro cadastro de anúncio: onde `tlc-spec-driven`/`tlc-spec-lean` te dão um fluxo dentro de uma feature isolada, o AI Dev Flow trataria essa mesma feature como um evento único passando pela fábrica inteira — `tlc-discover` decide como upload de imagem e validação de preço vão funcionar, `tlc-plan` quebra isso em tarefas observáveis, `tlc-implement` sobe primeiro um fluxo fino (formulário → salvar → listar, sem foto ainda) e só depois aprofunda, e `the-judge` audita o PR final com evidência antes de você olhar. São modelos vizinhos no mesmo catálogo: spec-driven pra uma mudança pontual, AI Dev Flow completo pra quando o time quer o pipeline inteiro automatizado, da issue ao PR revisado.

## Harness Toolkit: guardrails determinísticos pro agente

Skill resolve "o que o agente sabe fazer". O [Harness Toolkit](https://github.com/tech-leads-club/harness-toolkit) resolve outro problema: "o que o agente tem permissão de fazer, e quem garante isso mesmo se ele tentar". É um middleware de governança que se interpõe entre o editor (Cursor ou Claude Code) e o agente, respondendo a cada ação — rodar comando, editar arquivo, abrir PR — com uma decisão auditável: `allow`, `ask`, `deny` ou `inject` (injeta contexto no turno).

São dois repositórios e dois pacotes npm separados — `@tech-leads-club/agent-skills` e `@tech-leads-club/harness-toolkit` não têm dependência um do outro — mas o ponto de contato é direto: o Harness expõe uma **`harness-init` skill**, instalável pelo mesmo mecanismo do resto do catálogo, que dispara o wizard de setup de dentro do próprio chat do agente (é o `"setup harness"` que aparece mais adiante). Skill dá capacidade; Harness decide se aquela capacidade pode ser exercida naquele momento — são as duas metades do mesmo problema, não dois produtos concorrentes.

### O que resolve

Sem isso, "não deixa o agente fazer coisa perigosa" vive só na cabeça de quem escreve o prompt — e prompt é sugestão, não trava. O Harness parte do princípio de que alguns comportamentos não podem depender de o agente "se lembrar" da instrução: precisam ser barrados na camada de execução, sempre, independente do que está no contexto daquela sessão.

### Como funciona por dentro

```
Evento do editor → hook user-level → tlc-exec.mjs → entrypoints TypeScript
→ core + adapter do provider → decisão (allow/ask/deny/inject) → registro
```

A checagem roda em três camadas, cada uma com um nível diferente de rigidez:

**Tier 1 — Piso (floor).** Oito regras que nenhuma configuração desativa, porque rodam *antes* de qualquer política ser lida: negam comando destrutivo fora do repositório, bloqueiam exclusão cujo alvo está numa variável (não dá pra provar o que vai ser apagado), impedem acesso a segredo (`.env`, `~/.ssh`, `~/.aws`), negam `git push --force` (mas permitem `--force-with-lease`), bloqueiam shutdown/reboot da máquina, negam executar programa baixado da rede na hora, e protegem os próprios arquivos de configuração e hooks contra edição pelo agente.

**Tier 2 — Sempre ativo.** Três verificações contínuas sem bypass: alerta se a config mudou no meio da sessão sem passar por comando `tlc`, nega escrita na política via ferramenta de edição do próprio agente, e pergunta se outra sessão mexeu no mesmo arquivo recentemente.

**Tier 3 — Trilhos (rails).** 25 capacidades opcionais que você liga conforme a necessidade — lint/test automático ao parar (`grind`), validação de claim de deploy (`ship gate`), detecção de código duplicado, checagem de dependência nova (`supply-chain gate`), allowlist de modelo pra subagente, detecção de loop de comando travado, injeção de lições aprendidas de falhas anteriores, entre outras.

No fim de cada turno (`stop`), os rails ativados rodam; se algum bloqueia, o agente recebe um follow-up com os gaps a fechar antes de seguir. Tudo fica registrado em `.tlc/harness/state/`, com um comando de auditoria (`attest`) que gera um relatório à prova de adulteração com a política vigente, rails ativos e resultado de cada gate.

### Instalação

```bash
npm i -g @tech-leads-club/harness-toolkit && tlc harness install
```

São dois passos em um comando: o `npm i` traz o pacote, e `tlc harness install` materializa o runtime em `~/.tlc/harness`, cria o `config.json`, linka o binário `tlc` em `~/.local/bin` e registra os hooks nos editores que detectar instalados (Cursor via `~/.cursor`, Claude Code via `~/.claude`).

Requisitos: Bun (recomendado) ou Node.js 24+, e npm pra instalar. Roda em Linux, macOS ou Windows.

### Comandos principais

```bash
tlc harness status         # modo operacional, gates e sessões ativas
tlc harness doctor         # verifica saúde da instalação, rails mal configurados
tlc harness init --minimal # cria config.json mínimo no projeto atual
tlc harness update         # atualiza pacote, runtime, skill e wiring
tlc harness uninstall --purge  # remove tudo, inclusive config e state

tlc harness grind on|off   # liga/desliga lint/test automático ao parar
tlc harness pause / resume # desativa/reativa verificações temporariamente
tlc harness mode solo|paired|focus  # muda postura operacional (não afrouxa checagem)

tlc harness obs live       # stream de sinais em tempo real da sessão
tlc harness obs report     # relatório consolidado de gates e recusas
tlc harness why [n]        # últimas n decisões, com a regra por trás de cada uma
tlc harness attest         # registro à prova de adulteração da sessão

tlc harness handoff        # estado de handoff entre turnos/sessões (gaps, bloqueios, próxima ação)
tlc harness policy         # lista mudança de política feita no meio da sessão
tlc harness policy accept <path>  # aceita explicitamente uma mudança de política

tlc harness lessons list                       # lições armazenadas
tlc harness lessons add "..." --ref path:symbol --pin   # grava lição manual

tlc harness gate test-command node --test 'src/**/__test__/*.test.ts'  # define gate custom
```

Qualquer comando de leitura aceita `--json` (`status`, `doctor`, `obs`, `lessons`, `prices lookup`) pra integrar com outro script.

### Como conectar a um projeto

```bash
# 1. abre o repo no editor
cursor .        # ou: claude-code .

# 2. inicializa a config do projeto — duas formas
tlc harness init --minimal
# ou, direto no agente: "setup harness" (dispara wizard interativo via skill)

# 3. confere a saúde da instalação
tlc harness doctor
```

Isso cria `.tlc/harness/config.json` (esse vai pro git — é a política do time) e `.tlc/harness/state/` (esse não vai — é `gitignored`), além dos shims específicos de cada editor (`.cursor/hooks.json` ou `.claude/settings.json`).

Por padrão o projeto sobe só com o piso ativo — nada de lint automático ou gate de deploy até você ligar. Ativa rail por rail editando o `config.json`:

```json
{
  "grind": { "enabled": true },
  "shipGate": { "enabled": true },
  "duplication": { "enabled": false },
  "supplyChain": { "enabled": true },
  "secrets": { "redactOutput": true }
}
```

Pro cadastro de anúncio, os rails que mais valem a pena ligar cedo são `grind` (testa e linta sozinho a cada stop, então o teste que valida "preço negativo é rejeitado" não fica esquecido) e `supplyChain` (avisa se o agente decidir instalar uma lib nova pra lidar com upload de imagem sem você ter pedido).

Regra customizada é um markdown com frontmatter em `.tlc/harness/rules/`:

```markdown
---
on: pr-open
require:
  - subagent(reviewer) since HEAD
otherwise: deny
---

PR de endpoint público precisa passar por um subagente revisor
antes de abrir, sem exceção.
```

Esse `subagent(reviewer)` é onde os dois projetos se encaixam de verdade: em vez de confiar que alguém vai lembrar de rodar o `the-judge` (o GATE do AI Dev Flow, visto na seção anterior) antes de abrir o PR, a regra vira gate de execução — o Harness nega a abertura do PR até o registro daquele subagente aparecer no histórico do turno. O mesmo raciocínio vale pro `tlc harness handoff`: como ele lê o mesmo tipo de estado que a `tlc-spec-driven` grava em `.specs/STATE.md`, pausar uma feature no meio (`"pause work"`) e retomar depois não depende só da skill lembrar onde parou — o Harness também sabe, e pode negar uma ação que ignore um handoff pendente.

É a mesma lógica do restante do ecossistema Tech Leads Club: em vez de confiar que o agente vai lembrar da regra, a regra vira código que roda de verdade — e cada decisão fica registrada pra auditoria depois. Licença Elastic License 2.0: uso, modificação e redistribuição livres, inclusive comercial, mas sem oferecer como serviço hospedado.

## Por onde começar

Se você já usa Claude Code ou Cursor no dia a dia e instala skills soltas da internet sem muito critério, trocar isso pelo Agent Skills não custa nada — é `npx` e pronto — e troca "confiar no README de quem publicou" por "confiar num scan de segurança e num lockfile". A ordem que faz sentido pra começar, seguindo a mesma linha deste post:

1. `coding-guidelines` — comportamento, zero fricção pra instalar, efeito imediato em qualquer pedido vago.
2. Uma das duas specs — `tlc-spec-lean` pro dia a dia, `tlc-spec-driven` pra feature grande com decisão de arquitetura.
3. `security-best-practices` — no que toca dado sensível (upload, autenticação, pagamento).
4. O Harness Toolkit por cima de tudo isso — porque skill dá capacidade, e capacidade sem freio é onde o acidente acontece quando ninguém está olhando.

O resto do catálogo — design, performance, cloud, GTM — você vai puxando conforme a categoria bater com o que já dói no seu projeto.

## Exemplo enxuto: do zero ao primeiro PR

Juntando tudo num fluxo mínimo, pro Claude Code, do install até o PR revisado. Cinco comandos de terminal e quatro frases no chat do agente:

```bash
# 1. instala duas skills — comportamento (zero fricção) + spec do dia a dia
npx @tech-leads-club/agent-skills install -s coding-guidelines tlc-spec-lean -a claude-code

# 2. confere o que foi instalado
agent-skills list
```

A partir daqui, tudo acontece em linguagem natural, no chat do agente — sem flag, sem sintaxe pra decorar:

```
"plan feature: cadastro de anúncio"
  → gera .specs/features/cadastro-anuncio/plan.md
    (título/descrição/preço/categoria/fotos como entidade Anuncio,
    upload marcado como ponto irreversível)

"write the checks"
  → gera checks.md: "POST sem preço retorna 400",
    "upload aceita só jpg/png até 5MB", cada uma com o teste que prova

"build this plan"
  → implementação escrita pra satisfazer os checks

"verify work"
  → agente fresco roda cada check e escreve verification.md
```

Se o endpoint mexe com dado sensível (aqui, upload de arquivo), vale rodar a skill de segurança antes de abrir o PR:

```bash
agent-skills install -s security-best-practices -a claude-code
```

```
"faz uma security review do endpoint de cadastro de anúncio"
```

E se você quer que parte disso pare de depender de o agente "lembrar" a regra — trocar a review por um bloqueio real de execução — o Harness Toolkit entra por cima, em dois comandos:

```bash
npm i -g @tech-leads-club/harness-toolkit && tlc harness install
tlc harness init --minimal
```

Com isso instalado, `.specs/features/cadastro-anuncio/verification.md` na mão e o `security-best-practices` sem apontar nada crítico, o PR está no ponto de abrir. Esse é o ciclo curto — o resto do catálogo (design, performance, cloud) entra conforme a categoria bater com o que dói no seu projeto.

## Referências

- [tech-leads-club/agent-skills — repositório no GitHub](https://github.com/tech-leads-club/agent-skills)
- [Catálogo completo de skills](https://agent-skills.techleads.club/skills/)
- [Post de lançamento do TLC Agent-Skills](https://www.techleads.club/c/blog/lancamento-tlc-agent-skills-skills-de-qualidade-com-seguranca)
- [Relatório da Snyk sobre vulnerabilidades em skills (fev/2026)](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf)
- [Spec-Driven Development: Guia Completo (vídeo)](https://www.techleads.club/c/blog/spec-driven-development-guia-completo)
- [SKILL.md da `tlc-spec-driven`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(development)/tlc-spec-driven/SKILL.md)
- [SKILL.md da `tlc-spec-lean`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(development)/tlc-spec-lean/SKILL.md)
- [SKILL.md da `coding-guidelines`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(development)/coding-guidelines/SKILL.md)
- [SKILL.md da `security-best-practices`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(security)/security-best-practices/SKILL.md)
- [SKILL.md da `playwright-skill`](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(web-automation)/playwright-skill/SKILL.md)
- [TLC AI Dev Flow — Skills for Agentic Software Factories](https://agent-skills.techleads.club/tlc-ai-dev-flow/)
- [tech-leads-club/harness-toolkit — repositório no GitHub](https://github.com/tech-leads-club/harness-toolkit)

