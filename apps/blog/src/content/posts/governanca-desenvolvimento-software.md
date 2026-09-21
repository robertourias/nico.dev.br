---
title: "Governança de software sem virar burocracia"
slug: "governanca-desenvolvimento-software"
date: "2026-09-20"
categories: ["architecture", "dev"]
status: "published"
featured: false
description: "O que é governança no desenvolvimento de software, por que ela costuma virar comitê e planilha, e como montar uma versão leve com ADRs, CODEOWNERS, guardrails no pipeline e métricas DORA."
tags: ["governanca", "adr", "codeowners", "dora", "engenharia-de-software"]
coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
---

Toda equipe tem governança. A dúvida é se ela está escrita ou se vive na cabeça de quem está há mais tempo no time. Quando a decisão sobre "qual biblioteca usamos para formulários" depende de quem estava na call de terça, isso é governança: só que informal, sem registro e impossível de auditar.

O problema é que a palavra tem má fama. Evoca comitê de arquitetura, formulário de aprovação e três semanas de espera para trocar uma dependência. Este post defende outra leitura: governança como **conjunto de decisões explícitas e verificáveis**, com o mínimo de gente no caminho.

## O que é governança em software

Governança responde a quatro perguntas, e nenhuma delas exige comitê:

- **Quem decide** o quê, e com que autoridade?
- **O que já foi decidido**, e por quê?
- **Como garantimos** que a decisão está sendo seguida?
- **Como sabemos** se a decisão continua boa?

Em contextos corporativos, isso costuma aparecer em frameworks como COBIT e na norma ISO/IEC 38500, que tratam governança de TI como direcionar, avaliar e monitorar o uso da tecnologia pela organização. São referências válidas para quem precisa de compliance formal.

Aqui o recorte é outro: governança **dentro do time de engenharia**, aquilo que decide como o código entra, quem responde por ele e como se aprende com o resultado.

## Os dois extremos que dão errado

**Anarquia.** Cada squad escolhe stack, padrão de commit e estratégia de deploy. Funciona enquanto o time é pequeno. Depois de alguns meses, ninguém consegue mover uma pessoa de um projeto para outro sem semanas de adaptação, e a mesma vulnerabilidade é corrigida três vezes de três jeitos.

**Portão manual.** Toda mudança relevante passa por uma aprovação humana centralizada. Funciona para reduzir risco no papel, mas o gargalo vira a própria pessoa aprovadora. O time aprende a contornar: junta mudanças em PRs gigantes para pedir aprovação uma vez só, o que aumenta o risco que o portão queria reduzir.

A saída não é um meio-termo entre os dois. É trocar o mecanismo: em vez de **portões** (uma pessoa diz sim ou não), **guardrails** (o sistema impede o erro e libera o resto).

## Governança em camadas

![Quatro camadas de governança leve: decisão com ADRs, responsabilidade com CODEOWNERS, automação com guardrails no pipeline e medição com métricas DORA, ligadas por um ciclo de feedback](/images/governanca-desenvolvimento-software-camadas.svg)

Cada camada é barata isoladamente. O valor está em elas se reforçarem: a decisão registrada vira regra automatizada, a regra automatizada gera dados, e os dados dizem se a decisão ainda faz sentido.

## Camada 1: registrar decisões com ADRs

Um Architecture Decision Record é um documento curto que registra uma decisão de arquitetura, o contexto em que ela foi tomada e as consequências. O formato foi popularizado por Michael Nygard no texto *Documenting Architecture Decisions*, de 2011.

O ganho é prático. Seis meses depois, alguém pergunta "por que usamos Postgres e não Mongo aqui?", e a resposta está no repositório, não na memória de quem saiu do time.

Um template mínimo, salvo em `docs/adr/0007-usar-postgres.md`:

```md
# 7. Usar Postgres como banco principal

Data: 2026-09-20
Status: aceita

## Contexto
O domínio de pedidos tem relacionamentos fortes e exige transações
entre pedido, estoque e pagamento.

## Decisão
Usar Postgres como banco principal do serviço de pedidos.

## Alternativas consideradas
- MongoDB: descartado por exigir transações multi-documento em fluxos centrais.
- DynamoDB: descartado pelo custo de modelar acessos relacionais.

## Consequências
- Time já conhece SQL, o que reduz curva de aprendizado.
- Escala de escrita horizontal fica limitada; revisitar se o volume crescer.
```

Duas regras mantêm o ADR útil. Primeiro, ele é **imutável**: se a decisão mudar, escreva um novo ADR marcando o antigo como "substituída". O histórico é o valor. Segundo, ele vive **no mesmo repositório do código** e passa por PR, então a discussão fica ao lado da mudança.

## Camada 2: responsabilidade com CODEOWNERS

Decisão sem dono não se sustenta. No GitHub, o arquivo `CODEOWNERS` associa caminhos do repositório a pessoas ou times, e o PR que toca aquele caminho pede review de quem responde por ele.

```
# .github/CODEOWNERS

# Padrão: qualquer arquivo sem dono específico
*                       @minha-org/engenharia

# Decisões de arquitetura precisam de quem responde por arquitetura
/docs/adr/              @minha-org/arquitetura

# Infraestrutura como código
/infra/                 @minha-org/plataforma

# Pipelines: quem muda o guardrail não deve ser o único a aprová-lo
/.github/workflows/     @minha-org/plataforma
```

A última linha importa. Um pipeline que qualquer um altera sem revisão deixa de ser guardrail: vira sugestão.

## Camada 3: guardrails no pipeline

Aqui a governança deixa de depender de disciplina. Uma regra que a máquina verifica não exige reunião, lembrete nem boa vontade.

Dois mecanismos cobrem a maior parte do valor.

**Proteção da branch principal.** Em `Settings → Rules` do repositório, configure a branch `main` para exigir PR, pelo menos uma aprovação, aprovação de code owners quando o caminho tiver dono e status checks obrigatórios passando. Isso impede push direto e merge com CI vermelho, sem ninguém precisar policiar.

**CI como contrato.** O workflow abaixo é o mínimo que vale a pena tornar obrigatório:

```yaml
# .github/workflows/ci.yml
name: ci

on:
  pull_request:

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm audit --audit-level=high
```

Depois de rodar uma vez, marque o job `checks` como status check obrigatório na regra da `main`. O passo `npm audit` transforma uma política ("não entra dependência com vulnerabilidade alta conhecida") em algo verificado a cada PR.

O critério para decidir o que automatizar é simples: se a regra é objetiva (formata, compila, testa, não tem vulnerabilidade alta), automatize. Se exige julgamento (esse design está bom?), deixe para review humano. Misturar os dois é o que faz o review virar checklist de estilo.

## Camada 4: medir com métricas DORA

Sem medição, governança é fé. As métricas DORA, do programa de pesquisa DevOps Research and Assessment e detalhadas no livro *Accelerate* (Forsgren, Humble e Kim, 2018), são o conjunto mais conhecido para medir a saúde da entrega:

| Métrica | O que mede |
|---------|-----------|
| Frequência de deploy | com que frequência o time coloca mudanças em produção |
| Lead time de mudança | tempo entre o commit e a mudança em produção |
| Taxa de falha de mudança | proporção de deploys que causam falha em produção |
| Tempo de recuperação | quanto demora para restaurar o serviço após uma falha |

Elas servem como termômetro de governança porque dois pares se equilibram. Frequência e lead time medem velocidade; taxa de falha e recuperação medem estabilidade. Um processo que melhora um par piorando o outro não está funcionando, e as métricas mostram isso.

Um cuidado: métrica de time não é métrica de pessoa. Usar DORA para ranquear desenvolvedores destrói o dado, porque as pessoas passam a otimizar o número e não a entrega.

## Como começar sem parar tudo

Não implemente as quatro camadas de uma vez. Uma ordem que costuma funcionar:

1. **Proteja a `main`.** Exigir PR e CI verde é a mudança de maior retorno e menor custo.
2. **Escreva o próximo ADR.** Não migre decisões antigas; registre a próxima decisão relevante que o time tomar.
3. **Crie o `CODEOWNERS`.** Comece com poucos caminhos: infra, pipelines e ADRs.
4. **Meça um número.** Escolha uma métrica DORA, comece a acompanhar e olhe a tendência antes de estabelecer meta.

Se alguma dessas etapas gerar reclamação frequente, o sinal é útil: ou a regra está mal calibrada, ou o motivo dela não foi explicado. Ambos se resolvem com um ADR.

## Anti-padrões comuns

- **Regra sem dono nem motivo.** "Sempre foi assim" não é justificativa. Toda regra rastreável a um ADR pode ser revisada; a que não é vira folclore.
- **Exceção informal.** Se o pipeline pode ser contornado "só dessa vez", em pouco tempo ele é contornado sempre. Se a exceção é legítima, ela precisa de um caminho explícito e registrado.
- **Governança só para código.** Decisões sobre acessos, segredos e ambientes também precisam de dono e registro, e costumam ser as de maior risco.
- **Medir sem agir.** Dashboard que ninguém revisa é custo sem retorno. Reserve um momento recorrente, como a retrospectiva, para olhar os números e decidir algo.

## O que fica

Governança boa é a que o time quase não percebe: as decisões estão registradas, cada área tem dono, o pipeline barra o erro óbvio e os números mostram quando algo deriva. O esforço humano fica concentrado onde há julgamento de verdade.

A pergunta prática para levar ao próximo planejamento é: das regras que o seu time segue hoje, quantas são verificadas por máquina e quantas dependem de alguém lembrar? Cada regra que muda de lista para pipeline é governança que deixa de custar atenção.

## Referências

- Michael Nygard, *Documenting Architecture Decisions* (2011): https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- ADR GitHub organization, templates e exemplos: https://adr.github.io
- Nicole Forsgren, Jez Humble, Gene Kim, *Accelerate: The Science of Lean Software and DevOps* (IT Revolution, 2018)
- DORA, métricas e pesquisa: https://dora.dev
- GitHub Docs, *About code owners*: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- GitHub Docs, *About rulesets*: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- ISO/IEC 38500, *Governance of IT for the organization*
