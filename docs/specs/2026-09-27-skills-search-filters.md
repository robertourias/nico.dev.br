# Spec & Plan: Busca e filtros da home (TASK06)

**Status:** approved
**Data:** 2026-09-27
**Autor:** PLANNER (Claude)
**Backlog:** TASK06 em `docs/context/product-backlog.md`
**Depende de:** TASK05 (home, `docs/specs/2026-09-25-skills-home.md`), concluída

---

## 1. Problema e Visão Geral

A home (TASK05) lista as skills com ordenação, mas sem busca nem filtros. Critério de aceite do produto: "Digitar `/` foca a busca, e o texto buscado filtra por nome, descrição e tags" e "filtros por categoria, tag e status" na home. Esta tarefa entrega os dois, client-side, sobre o mesmo `registry.json` já carregado pela home — sem nova rota nem chamada de rede.

Decisões já tomadas: estado local (sem sincronizar com a URL) e categoria de seleção única, tags e status de seleção múltipla.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero digitar `/` em qualquer lugar da página e ter o cursor na busca, para filtrar sem usar o mouse.
- **P1 (crítico):** Como visitante, quero que o texto buscado filtre por nome, descrição e tags, mesmo com erro de digitação leve.
- **P1 (crítico):** Como visitante, quero filtrar por categoria (uma de cada vez), e por tags e status (podendo combinar várias), para restringir a lista às skills que me interessam.
- **P2 (importante):** Como visitante, quero ver quantos resultados a busca/filtro atual encontrou, e limpar tudo com um clique.
- **P2 (importante):** Como visitante, quero uma mensagem clara quando a busca ou os filtros não encontram nada, diferente da mensagem de "catálogo vazio" (0 skills no total).
- **P3 (nice-to-have):** Como visitante de teclado ou leitor de tela, quero que a contagem de resultados seja anunciada quando eu buscar ou filtrar.

---

## 3. Requisitos Funcionais

### Dados

- **FR-001:** `SkillListItem` (`src/lib/skills.ts`) ganha `category: string`. `loadRegistry` (`src/lib/registry.ts`) inclui `skill.category` no mapeamento. Atualizar os testes existentes de `registry.test.ts`.
- **FR-002:** `apps/skills` ganha a dependência de runtime **Fuse.js** (primeira lib de busca do app; consultar a doc atual via Context7 antes de fixar a versão). Nenhuma outra dependência nova.

### Lógica de busca e filtro (testável, sem DOM)

- **FR-003:** `src/lib/search.ts`, função pura `filterSkills(items, criteria)`:
  ```ts
  interface SkillFilterCriteria {
    query: string;                 // já trim()ado ou não — a função trata
    category: string | null;       // null = todas
    tags: readonly string[];       // vazio = sem filtro de tag
    statuses: readonly string[];   // vazio = sem filtro de status
  }
  function filterSkills(items: readonly SkillListItem[], criteria: SkillFilterCriteria): SkillListItem[];
  ```
  Regras: `query` vazia ou só espaços → não filtra por texto (todos os itens elegíveis pelos outros critérios passam, na ordem original). `query` não vazia → Fuse.js sobre `keys: ["title", "description", "tags"]` (título com peso maior que descrição e tags — pesos exatos ficam a critério da implementação, documentados no código), `threshold` que aceite erro de digitação leve sem virar "quase tudo passa" (ponto de partida: `0.3`; ajustável em revisão se os testes de qualidade de busca pedirem). Resultado do Fuse mantém a ordem de relevância — a ordenação (`sortSkills`, já existente) só é aplicada quando `query` está vazia; com busca ativa, a lista **não** é reordenada por `recent`/`alpha` (a relevância da busca prevalece). Categoria: item passa se `category === criteria.category` ou `criteria.category === null`. Tags: item passa se `criteria.tags` vazio, ou se pelo menos uma tag de `criteria.tags` está em `item.tags` (**OR** dentro da faceta). Status: mesma regra que tags, sobre `item.status` (**OR** dentro da faceta). Entre facetas (busca, categoria, tags, status) a combinação é **AND**.
- **FR-004:** `src/lib/search.ts` também exporta `getFacets(items)` → `{ categories: string[], tags: string[], statuses: string[] }`, cada lista derivada de `items` (só valores realmente presentes, sem duplicatas, ordenados: categorias e status por primeira aparição na ordem de `CATEGORIES`/`STATUSES` de `catalog.config.ts`; tags por ordem alfabética `pt-BR`). As opções de filtro **não mudam** quando outro filtro está ativo (facetas sempre calculadas sobre o catálogo completo, não sobre o resultado filtrado) — decisão de simplicidade para este catálogo pequeno; se o catálogo crescer, recalcular facetas por resultado filtrado é uma revisão futura, não desta tarefa.
- **FR-005:** Testes `node:test` cobrindo: busca vazia retorna todos (respeitando outros filtros); busca por termo de `description`; busca por tag; erro de digitação leve ainda encontra (ex.: `"mermaido"` ainda acha "mermaid"); categoria restringe a 1 opção; combinação categoria+tag+status+busca (AND entre facetas, OR dentro de tags e de status); `getFacets` sem duplicatas e sem categoria/tag/status ausente do dataset; smoke test de desempenho: `filterSkills` sobre 200 itens sintéticos executa abaixo de 50 ms (folga generosa sobre o NFR do produto, que é sobre a busca do usuário, não sobre este teste isolado).

### UI — busca

- **FR-006:** `src/components/search-bar.tsx` (`"use client"`): `<input type="search">` controlado, `aria-label="Buscar skills"`, placeholder `"Buscar por nome, descrição ou tag…"`, ícone Lucide `Search` decorativo (`aria-hidden`). Props: `value`, `onChange`, e `inputRef` (ou `React.forwardRef`) para o atalho de teclado alcançar o elemento.
- **FR-007:** `src/hooks/use-slash-shortcut.ts` (ou nome equivalente), hook puro de UI: escuta `keydown` no `document`; em `key === "/"` sem `ctrlKey`/`metaKey`/`altKey`, e com `document.activeElement` **fora** de `input`, `textarea` ou `[contenteditable]`, previne o default e foca o ref recebido. Sem dependência de dados do registry (reutilizável). Sem side effect quando o componente desmonta (listener removido).
- **FR-008:** Botão "Limpar" (visível só quando algum filtro ou busca está ativo) zera `query`, `category`, `tags` e `statuses` de uma vez e devolve o foco à busca.

### UI — filtros

- **FR-009:** `src/components/filter-bar.tsx` (`"use client"`): três grupos, cada um só renderizado se `getFacets` tiver ≥ 1 opção (nunca mostra grupo vazio):
  - **Categoria** (seleção única): `ToggleFilterGroup` (já existente em `@nico.dev/ui`, `mode` padrão `single`) com um item extra `"Todas"` (`value=""`) além de uma opção por categoria presente.
  - **Tags** (seleção múltipla): **não usar** `ToggleFilterGroup mode="multiple"` — ver risco abaixo. Uma linha de `ToggleFilter` standalone (um por tag presente), cada um com `active={tags.includes(tag)}` e `onClick` que adiciona/remove a tag do conjunto selecionado (mantendo ordem de `getFacets`, sem limite de seleção).
  - **Status** (seleção múltipla): mesmo padrão de `ToggleFilter` standalone, um por status presente (rótulo = tradução curta do valor: `stable`→"Estável", `beta`→"Beta", `draft`→"Rascunho").
  Cada grupo tem um rótulo visível curto (`<span>` ou `<legend>` semântico) e o `role="group"`/`aria-label` já embutido no `ToggleFilterGroup`; o grupo de tags e o de status recebem `role="group"` com `aria-label` próprio (`"Filtrar por tag"`, `"Filtrar por status"`) no container.
- **FR-010:** Estado combinado vive no componente que hoje é `SkillList` (`src/components/skill-list.tsx`), que passa a orquestrar: `query`, `category` (`string | null`), `tags: string[]`, `statuses: string[]`, `sort`. Pipeline: `getFacets(items)` (uma vez, via `useMemo` sobre `items`) → `filterSkills(items, { query, category, tags, statuses })` → `sortSkills(...)` só quando `query` trim está vazio (FR-003) → render.
- **FR-011:** Contagem de resultados: texto (`"5 de 5 skills"`, `"2 de 5 skills"`) acima da lista, dentro de uma região `aria-live="polite"` que também existe quando a lista fica vazia por filtro (para o leitor de tela ouvir a mudança sem precisar navegar até a lista).
- **FR-012:** Dois estados vazios distintos:
  - **Catálogo vazio** (`items.length === 0`, já existente na TASK05): "Nenhuma skill publicada ainda." — inalterado, sem busca/filtros renderizados (não há o que buscar).
  - **Filtro sem resultado** (`items.length > 0` e resultado filtrado vazio): "Nenhuma skill encontrada." + botão "Limpar filtros" (mesma ação do FR-008).
- **FR-013:** Todo o layout (busca, filtros, contagem, lista) responsivo a partir de 360 px, sem overflow horizontal; chips de tag/status quebram linha (`flex-wrap`).

### Integração com a página

- **FR-014:** `src/app/page.tsx` não muda de estrutura (o comentário que reservava o espaço da TASK06 é removido); `SkillList` recebe os mesmos `items` de antes. Sem novas props na fronteira servidor→cliente além do que `SkillListItem` já carrega (FR-001).

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** bloco "Encontre no skills.sh" (TASK08); páginas `/topic/[tag]` (TASK11) e `/s/[slug]` (TASK07); filtro por agente (TASK16, Fase 4); sincronizar filtros com a URL (decisão: estado local); persistir filtros em `localStorage`; corrigir `ToggleFilterGroup mode="multiple"` (achado nesta tarefa, ver risco).
- **Achado (fora do escopo, registrar para triagem):** `ToggleFilterGroup` de `@nico.dev/ui` tem a prop `mode="multiple"` documentada no TSDoc, mas a implementação atual (`toggle-filter.tsx`) trata `activeValue` como string única em qualquer modo — `mode="multiple"` não ativa múltiplos itens simultaneamente (nenhum consumidor usa esse modo hoje). Esta tarefa **não corrige** o componente compartilhado; usa `ToggleFilter` standalone (padrão já documentado no próprio componente) para tags e status. Sugestão: abrir uma tarefa própria em `packages/ui` para consertar ou remover a prop `mode`.
- **Premissa:** até 200 skills (NFR do produto) cabem em memória no cliente sem paginação; `registry.json` continua < 500 KB (regra da TASK02).
- **Premissa:** `catalog.config.ts` mantém `CATEGORIES`/`STATUSES` como hoje; `getFacets` usa essas tuplas só para ordenar, nunca para decidir o que mostrar (o que decide é o dado real, FR-004).
- **Risco:** threshold do Fuse.js solto demais faz busca por 1 letra "encontrar" quase tudo, e apertado demais não tolera erro de digitação → Mitigação: FR-005 cobre "erro leve funciona"; T5 ajusta o `threshold` se a verificação manual mostrar ruído.
- **Risco:** atalho `/` conflita com o campo de busca nativo do navegador (Ctrl+F usa `/` em alguns leitores de tela ou extensões) → Mitigação: escuta só o `/` puro sem modificadoras (FR-007); documentado como limitação conhecida se algum leitor de tela específico divergir (não testável nesta tarefa sem hardware assistivo).
- **Risco:** filtro por tag com muitas tags estoura a largura em 360 px → Mitigação: FR-013 (`flex-wrap`); verificado no navegador.
- **Risco:** dois estados vazios (catálogo vazio vs. filtro sem resultado) confundidos no código → Mitigação: FR-012 os separa explicitamente; teste de HTML exportado cobre o primeiro (já existe, TASK05), o segundo só é alcançável no cliente (verificado no navegador, T5).

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contrato de dados e funções:

```ts
// src/lib/skills.ts — campo novo
interface SkillListItem { /* ...campos existentes... */ category: string }

// src/lib/search.ts
interface SkillFilterCriteria {
  query: string;
  category: string | null;
  tags: readonly string[];
  statuses: readonly string[];
}
function filterSkills(items: readonly SkillListItem[], criteria: SkillFilterCriteria): SkillListItem[];
function getFacets(items: readonly SkillListItem[]): {
  categories: string[];
  tags: string[];
  statuses: string[];
};

// src/hooks/use-slash-shortcut.ts
function useSlashShortcut(ref: React.RefObject<HTMLInputElement | null>): void;
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2, T3           | —             |
| 2    | T4                  | T1, T2, T3    |
| 3    | T5                  | T4            |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. T1 mexe em `src/lib/`; T2 cria `search-bar.tsx` e `use-slash-shortcut.ts`; T3 cria `filter-bar.tsx` — arquivos distintos, sem conflito entre agentes paralelos. Só a T4 edita `skill-list.tsx` e `page.tsx`. Nunca usar `taskkill` por nome de processo; guardar o PID de qualquer servidor e encerrar só ele.

### Tarefa 1: `category` no dado + `filterSkills`/`getFacets`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2, T3
- **Descrição:** FR-001 a FR-005. Adicionar Fuse.js (consultar Context7 para a versão/API atual antes de escrever o import). Implementar `src/lib/search.ts` e atualizar `src/lib/skills.ts`/`registry.ts` (+ testes existentes) conforme FR-001.
- **Critérios de Aceite:**
  - [x] Todos os casos do FR-005 passam via `node --test`.
  - [x] `SkillListItem` inclui `category`; `registry.test.ts` cobre o campo novo.
  - [x] `filterSkills`/`getFacets` são funções puras, sem `window`/`document`.
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam.

### Tarefa 2: Busca + atalho de teclado
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1, T3
- **Descrição:** FR-006, FR-007. Componente puramente controlado (sem estado próprio de dados) e hook de atalho reutilizável, sem importar `lib/search` nem `lib/registry`.
- **Critérios de Aceite:**
  - [x] `SearchBar` renderiza `aria-label`, ícone `aria-hidden`, e reflete `value`/`onChange` corretamente. (Verificado por leitura cuidadosa do código — sem harness de teste de componente neste app; ver relatório da T2.)
  - [x] `useSlashShortcut`: ignora `/` quando o foco já está em campo editável; ignora com modificadoras; foca o input e previne o default no caso normal; remove o listener ao desmontar. (Verificado por leitura cuidadosa do código — sem jsdom configurado neste app; comportamento fino fica para T5.)
  - [x] `lint`/`typecheck` do app passam.

### Tarefa 3: Barra de filtros
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1, T2
- **Descrição:** FR-009. Recebe `facets`, valores selecionados e callbacks (`onCategoryChange`, `onTagsChange`, `onStatusesChange`) por props — não conhece `SkillListItem` nem lê o registry diretamente. Usa `ToggleFilterGroup` (categoria) e `ToggleFilter` standalone (tags/status), conforme decidido no risco do `mode="multiple"`.
- **Critérios de Aceite:**
  - [x] Grupo de categoria inclui "Todas" e é seleção única.
  - [x] Tags e status aceitam múltiplas seleções simultâneas (`aria-pressed` correto em cada botão).
  - [x] Grupo com 0 opções não renderiza (nem o rótulo).
  - [x] `lint`/`typecheck` do app passam; sem hex direto.

### Tarefa 4: Integração em `SkillList` e na página
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1, T2, T3
- **Paralelizável com:** nenhuma
- **Descrição:** FR-010 a FR-014. Orquestra estado, pipeline de busca/filtro/ordenação, contagem com `aria-live`, os dois estados vazios (FR-012) e o botão "Limpar" (FR-008). Remove o comentário de reserva de espaço em `page.tsx`.
- **Critérios de Aceite:**
  - [x] Busca por nome, descrição e tag filtra a lista (a lógica em si é coberta por `search.test.ts`, já existente da T1; não há harness de teste de componente neste app para exercitar `SkillList` com DOM — delegado à T5 no navegador).
  - [x] Categoria + tags + status combinam em AND entre facetas, OR dentro de tags/status (mesma ressalva acima: lógica coberta em `search.test.ts`, wiring no componente não verificado por teste automatizado — delegado à T5).
  - [x] Contagem atualiza a cada mudança; "Limpar" zera tudo e devolve foco à busca (sem harness de DOM neste app; delegado à T5 no navegador).
  - [x] Estado "catálogo vazio" (TASK05) continua intacto; estado "sem resultado por filtro" aparece só quando aplicável (nenhum teste de HTML exportado cobre `SkillList` hoje, apesar do texto do risco na seção 4; delegado à T5).
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam; `pnpm turbo build --filter=@nico.dev/skills` conclui.

### Tarefa 5: Verificação no navegador
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T4
- **Paralelizável com:** nenhuma
- **Descrição:** Build com `SKILLS_REF=feat/migrate-mermaid-pencil` (ou `SKILLS_ROOT` de fixture com ≥ 5 skills variadas em categoria/tag/status), servir `out/` localmente (guardar o PID, encerrar só ele ao final). Verificar: atalho `/` funciona e não dispara dentro de um campo já focado; busca com erro leve de digitação encontra a skill; cada faceta filtra sozinha e em combinação; "Limpar" restaura tudo e foca a busca; contagem muda e é anunciada (`aria-live`); os dois estados vazios aparecem nos momentos certos; sem overflow a 360 px com várias tags visíveis; axe-core (0 violações, claro e escuro, transições desligadas); navegação por teclado por toda a barra de filtros e busca, com foco visível. Atualizar a spec só com o que foi de fato verificado; marcar TASK06 `done` no backlog somente se tudo passar.
- **Critérios de Aceite:**
  - [x] Atalho `/` e busca com erro leve verificados no navegador real.
  - [x] Cada filtro e as combinações verificados com cliques reais.
  - [x] Os dois estados vazios (catálogo vazio vs. sem resultado) aparecem corretamente.
  - [x] axe-core sem violações em claro e escuro.
  - [x] Sem overflow horizontal a 360 px.
  - [x] Navegação e foco por teclado cobrindo busca, "Limpar" e todos os chips.
  - [x] Itens não verificáveis (ex.: leitor de tela real) listados no relatório e na spec.

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->

---

## Verificação no navegador (2026-09-27)

`out/` servido localmente (build com `SKILLS_REF=feat/migrate-mermaid-pencil`, 5 skills e 1 pack), Chrome real, claro e escuro.

- **Atalho `/`:** com foco no `<body>`, `/` move o foco para o `input[type=search]` (`aria-label="Buscar skills"`). Com o input já focado, `/` digitado vira texto normal (não reaciona o atalho) — confirmado digitando `/x` dentro do campo.
- **Erro leve de digitação:** `"mermaido"` encontra "Mermaid Diagrams" ("1 de 5 skills"). Limpar a busca restaura os 5 itens e a ordenação "Mais recentes".
- **Filtros combinados (AND entre facetas):** categoria "design" → 2 (Pencil + Excalidraw); + tag "pencil" → 1 (Pencil Design System); + status "Rascunho" (que não é o status de Pencil) → 0 resultados, com "Nenhuma skill encontrada." e botão "Limpar filtros".
- **Limpar filtros:** zera busca, categoria, tags e status (conferido que só "Todas" e o controle de ordenação continuavam com `aria-pressed=true` — nenhum chip de tag/status/categoria ficou preso), volta a "5 de 5 skills" e devolve o foco à busca.
- **Teclado:** ordem de Tab search → Todas → documentation → design → writing → product → 9 tags → …; Espaço no chip "seo" ativa o filtro (1 de 5, "Article Writer") e o foco permanece visível em cada parada.
- **360 px:** sem overflow de página com todos os grupos de filtro visíveis (tags quebram em várias linhas); busca com foco visível.
- **axe-core 4.10.2** (wcag2a/aa, wcag21a/aa, best-practice), transições desligadas: 0 violações em claro e escuro.

**Não verificado (limitações):**
- Leitor de tela real (JAWS/NVDA/VoiceOver); a região `aria-live="polite"` foi conferida só por leitura do DOM (texto presente e atualizado), não por áudio real.
- Qualidade fina do `threshold` do Fuse.js além do caso de erro leve testado (`mermaido`); não foram testados termos muito distantes do esperado.
- Emulação de dispositivo de toque para a regra `@media (hover: none)` (mesma limitação já registrada na TASK05 para o `CopyButton`).

**Achado à parte, fora do escopo desta tarefa:** build a partir da `main` de `robertourias/skills` falha porque a skill `playwright-review` (presente na `main`, não no branch de migração usado para verificar) tem `metadata.category` fora da tupla `CATEGORIES`. É um problema de dado no repo de skills (ou tupla desatualizada em `catalog.config.ts`), não introduzido por esta tarefa — recomendo triagem antes de mergear o PR #1 ou de rodar o build sem `SKILLS_REF` fixo.
