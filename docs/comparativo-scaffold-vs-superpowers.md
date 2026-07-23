# Comparativo: scaffold-ia-projetos vs. Superpowers

> Gerado por análise retroativa em 2026-07-22, a partir dos dois sistemas
> efetivamente ativos neste projeto/sessão: o scaffold próprio em `docs/` +
> `.claude/commands/` deste repositório, e o plugin `superpowers` instalado
> no Claude Code do usuário. Não é um doc oficial de nenhum dos dois
> projetos — é a leitura de como eles se sobrepõem **aqui**.

## O que cada um é

| | scaffold-ia-projetos (este repo) | Superpowers |
|---|---|---|
| Natureza | Estrutura de documentação (`docs/`) + slash commands (`.claude/commands/*.md`, um shim por comando) específicos deste monorepo | Plugin de skills do Claude Code, instalado globalmente, reutilizável entre projetos |
| Unidade central | Papel de agente (Planner/Backend/Frontend/Reviewer) com contexto lido de arquivos `docs/skills/*.md` | Skill (`using-superpowers`, `brainstorming`, `systematic-debugging`, `test-driven-development`, etc.), invocada via tool `Skill` |
| Gate de processo | Spec com `Status: review → approved` em `docs/specs/` — nenhuma implementação começa sem esse gate (`docs/workflows/feature-delivery.md`) | Skill `brainstorming` antes de trabalho criativo, `systematic-debugging` antes de fix de bug — gate é "invoque a skill", não um artefato aprovado por humano |
| Memória de sessão | `docs/context/current-state.md`, atualizado via `/checkpoint`, lido via `/retomar` | Não observado equivalente direto neste plugin — memória de sessão fica a cargo do harness (auto memory, `CLAUDE.md`) |
| Revisão de código | `/review` — processo em dois estágios (Funcional → Qualidade), checklist fixo em `docs/skills/quality.md` | `requesting-code-review` / `receiving-code-review` — skills que orientam o *processo* de pedir e receber review, sem checklist de domínio fixo |

## Onde se sobrepõem

- **Planejamento antes de codar**: `docs/workflows/feature-delivery.md` (Fase 0: Spec & Plan) cobre o mesmo espaço que `superpowers:brainstorming` + `superpowers:writing-plans`. Neste projeto, o gate formal (`Status: approved`) é o mecanismo usado — as skills de planning do Superpowers não têm, hoje, um artefato equivalente commitado em `docs/`.
- **Debugging**: nenhum arquivo em `docs/skills/` documenta processo de debug — `superpowers:systematic-debugging` preenche essa lacuna sem conflito.
- **TDD**: `docs/skills/backend.md` e `frontend.md` exigem cobertura mínima de teste, mas não prescrevem *quando* escrever o teste. `superpowers:test-driven-development` é mais prescritivo (teste antes do código) e não conflita com as métricas de cobertura já documentadas.
- **Trabalho paralelo**: `docs/commands/hands-on.md` ("executa o Plano de Implementação em ondas, agentes em paralelo") cobre o mesmo objetivo de `superpowers:subagent-driven-development` e `superpowers:dispatching-parallel-agents`. [INFERIDO — confirmar: não li o conteúdo completo de `hands-on.md` para comparar a mecânica exata]

## Onde não se sobrepõem

- Superpowers não sabe nada sobre este produto (Nico.dev, blog, claps, etc.) — isso só existe no scaffold local (`docs/context/`, `docs/architecture/`).
- O scaffold local não tem skill de `using-git-worktrees` nem de `finishing-a-development-branch` — fluxo de branch/PR não é padronizado em nenhum arquivo de `docs/` hoje.

## Recomendação prática (não uma decisão registrada — sinalizar para o usuário confirmar)

Os dois não competem: Superpowers preenche processo genérico (debug, TDD, git, review mechanics) que o scaffold nunca tentou cobrir; o scaffold cobre o que é específico deste produto e impõe o gate humano de aprovação de spec que Superpowers não tem. Onde houver skill do Superpowers e instrução do scaffold para a mesma situação (ex: planejamento), a regra já em vigor no projeto (`CLAUDE.md` raiz: "User instructions... take precedence over skills") resolve o conflito a favor do scaffold. [INFERIDO — confirmar: esta é uma leitura, não uma decisão que o usuário tenha tomado explicitamente]
