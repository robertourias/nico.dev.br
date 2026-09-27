# Spec & Plan: Home do catálogo (TASK05)

**Status:** approved **Data:** 2026-09-25
**Autor:** PLANNER (Claude)
**Backlog:** TASK05 em `docs/context/product-backlog.md`
**Depende de:** TASK02 (registry, `docs/specs/2026-09-24-skills-registry.md`) e TASK04 (`InstallCommandTabs`, `docs/specs/2026-09-25-install-command.md`), ambas concluídas

---

## 1. Problema e Visão Geral

`apps/skills` só tem um placeholder de página. A home é a vitrine do catálogo (`docs/context/product.md`, seção Skills Catalog): quem chega precisa entender em segundos o que é, copiar o comando geral de instalação e ver as skills disponíveis.

Esta tarefa entrega a home real, alimentada pelo `registry.json` no build: hero com banner ASCII "NICO SKILLS", tagline e comando geral; contadores; e a lista de skills com ordenação e ícone de copiar por linha. Busca e filtros são a TASK06 e o bloco "Encontre no skills.sh" é a TASK08: esta tarefa deixa o espaço e a fronteira de componentes prontos para elas, sem renderizar placeholder.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero ver o nome do catálogo, uma frase sobre ele e o comando `npx skills add robertourias/skills` com botão de copiar, para instalar tudo de uma vez.
- **P1 (crítico):** Como visitante, quero ver a lista das skills com nome, descrição curta, tags, status e data de atualização, para escolher a que me interessa.
- **P1 (crítico):** Como visitante, quero copiar o comando de uma skill direto da linha da lista, sem abrir a página dela.
- **P2 (importante):** Como visitante, quero ver quantas skills e packs existem e quando houve a última atualização, para julgar se o catálogo é mantido.
- **P2 (importante):** Como visitante, quero alternar a ordenação entre "mais recentes" e ordem alfabética.
- **P3 (nice-to-have):** Como visitante de teclado ou leitor de tela, quero alcançar tudo isso sem mouse, incluindo o ícone de copiar que só aparece no hover.

---

## 3. Requisitos Funcionais

### Dados

- **FR-001:** O objeto raiz do `registry.json` ganha `installCommands: { repository: string }`, gerado por `buildRegistry` a partir de `installCommandTemplates.repository` (mudança aditiva; `schemaVersion` continua `1`). Motivo: a regra do produto diz que comandos vêm do registry e nunca são montados no cliente, e o hero não pertence a nenhuma skill. Atualiza `registrySchema`, os testes existentes e o exemplo de contrato em `docs/specs/2026-09-24-skills-registry.md`.
- **FR-002:** `apps/skills/src/lib/registry.ts` (somente servidor, `import "server-only"` ou equivalente) lê `public/registry.json` com `fs` no build, valida com `registrySchema.parse` e expõe `getRegistry()`. Se o arquivo não existir, falha o build com mensagem apontando para `pnpm --filter @nico.dev/skills registry`.
- **FR-003:** Mapeamento para o cliente: o servidor converte cada skill em `SkillListItem` = `{ slug, title, description, tags, status, updated, command }` (`command` = `installCommands.skill`). **`content`, `files` e demais campos pesados nunca vão para o cliente.** Teste garante que o objeto serializado não contém `content`.
- **FR-004:** Funções puras em `src/lib/skills.ts`: `sortSkills(items, "recent" | "alpha")` (recent: `updated` desc, depois `title` asc; alpha: `title` asc com `localeCompare("pt-BR")`, sem mutar a entrada), e `formatUpdated(iso)` → data em pt-BR (ex.: `20 de set. de 2026`, `Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })`, sem deslocar o dia). Ambas cobertas por testes `node:test`.

### Hero

- **FR-005:** `<h1 className="sr-only">Nico Skills</h1>` seguido de um banner ASCII "NICO SKILLS" em `<pre aria-hidden="true">` (fonte monoespaçada, `whitespace-pre`, `select-none`). O h1 é o único título de nível 1 da página; o banner é decorativo. Abaixo, a tagline de `siteConfig.tagline`.
- **FR-006:** O banner é uma constante estática no código (gerada uma vez com figlet e colada; sem dependência nova). Responsivo: abaixo de `sm`, versão empilhada ("NICO" sobre "SKILLS", ≤ 40 colunas); a partir de `sm`, linha única. Nenhum overflow horizontal a 360 px. Cor pelos tokens (`text-primary`/`text-foreground`).
- **FR-007:** Comando geral: `InstallCommandTabs` com **uma única aba** (`id: "repository"`, `label: "Repositório"`, `command: registry.installCommands.repository`), o que renderiza só a caixa com a nota de telemetria (comportamento FR-013 da TASK04). Sem ícone de copiar extra: a caixa inteira já copia.

### Contadores

- **FR-008:** Três blocos: **Skills** (`counts.skills`), **Packs** (`counts.packs`) e **Atualizado em** (`lastUpdated` via `formatUpdated`, ou `—` se `null`). Semântica de lista de definição (`dl`/`dt`/`dd`) ou equivalente acessível; números com `tabular-nums`. Sem links (`/packs` só existe na TASK10).

### Lista

- **FR-009:** `SkillList` (`"use client"`) recebe `items: SkillListItem[]` e mantém só o estado de ordenação (`"recent"` padrão | `"alpha"`), com o controle `ToggleFilterGroup` de `@nico.dev/ui` ("Mais recentes" / "A–Z"). Persistir a ordenação não é requisito.
- **FR-010:** Cada linha (`<li>` de uma `<ol>`, numerada pela posição na ordenação atual) mostra: posição (`1`, `2`…), **título** (link para `/s/<slug>/`), descrição em **uma linha** (`line-clamp-1`), até 3 tags (`Badge` `default`) com "+N" se houver mais, **status** (`Badge`: `stable`→`success`, `beta`→`warning`, `draft`→`default`, com o texto do status) e a data de atualização em `<time dateTime="YYYY-MM-DD">`.
- **FR-011:** Ícone de copiar por linha: um `CopyButton` (novo, FR-013) irmão do link, **não** aninhado nele. Aparece ao passar o mouse na linha e ao receber foco (`opacity-0 group-hover:opacity-100 focus-visible:opacity-100`), e fica sempre visível em dispositivos sem hover (`@media (hover: none)`). Copia `item.command` (o `installCommands.skill` da skill).
- **FR-012:** Estado vazio: com 0 skills, em vez da lista aparece "Nenhuma skill publicada ainda." A tela nunca quebra com `items = []`.

### UI compartilhada

- **FR-013:** Em `packages/ui`: hook `useCopyToClipboard` (`src/hooks/use-copy-to-clipboard.ts`) que encapsula `navigator.clipboard.writeText`, o estado `idle | copied | fallback` com reset após 2000 ms e limpeza do timer, e aceita um callback `onFallback` (para `InstallCommand` selecionar o texto). `InstallCommand` passa a usar o hook **sem mudar comportamento nem testes** (os 21 testes atuais continuam passando sem edição). Novo componente `CopyButton` (`src/components/copy-button.tsx`): botão só com ícone (`Copy` → `Check`), props `value: string`, `label?: string` (padrão `"Copiar comando de instalação"`, vira `aria-label`), `copiedLabel?`, `className`; região `role="status"` `sr-only` anunciando "Copiado!"; foco visível; mesmo fallback de erro silencioso (sem lançar). Exportados em `index.ts`, com testes (Vitest) e story em `apps/storybook`.

### Página

- **FR-014:** `src/app/page.tsx` (Server Component) compõe: hero → contadores → `SkillList`. Seções separadas por espaço suficiente para a TASK06 inserir busca e filtros entre contadores e lista, e a TASK08 inserir "Encontre no skills.sh" depois da lista, sem reestruturar. Sem header/footer nesta tarefa.
- **FR-015:** Layout responsivo a partir de 360 px, sem overflow horizontal da página; largura máxima de leitura (`max-w-3xl`/`max-w-4xl`, centralizada). Só tokens semânticos; claro e escuro via classe `.dark` já aplicada pelo layout.
- **FR-016:** O HTML exportado (`out/index.html`) já contém o hero, os contadores e todas as linhas da lista (renderização estática; a lista é um Client Component mas o HTML inicial vem no build). Sem fontes web nem requisições externas nesta tarefa (usa a pilha de fontes dos tokens).
- **FR-017:** Não adicionar dependências de runtime novas em `apps/skills`.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** busca, atalho `/` e filtros (TASK06); bloco "Encontre no skills.sh" (TASK08); página `/s/[slug]` (TASK07); `/packs` e `/p/[id]` (TASK10); página `/topic/[tag]` (TASK11); header, footer e alternador de tema; fontes web; OG image e sitemap; auditoria Lighthouse (TASK17); ordenação persistida; paginação.
- **Premissa:** a `main` de `robertourias/skills` ainda tem 3 skills até o PR #1 ser mergeado. O desenvolvimento e a verificação usam `SKILLS_REF=feat/migrate-mermaid-pencil` (5 skills) ou `SKILLS_ROOT=scripts/__fixtures__/valid`.
- **Premissa:** o `SKILL.md` de cada skill tem `description` de 20 a 1024 caracteres; a linha da lista corta em uma linha por CSS, sem truncar o dado.
- **Risco:** links `/s/<slug>/` apontam para uma página que só existe na TASK07 (404 até lá) → Mitigação: aceito; a TASK09 (deploy) depende de TASK05 e TASK07, então nada sai em produção antes.
- **Risco:** o ícone que só aparece no hover é inacessível por teclado ou toque → Mitigação: FR-011 (visível no foco e em `hover: none`); verificado com teclado real e axe.
- **Risco:** o banner ASCII estoura a largura em 360 px ou é lido por leitor de tela como ruído → Mitigação: FR-005/FR-006 (`aria-hidden`, versão empilhada, teste de overflow no navegador).
- **Risco:** refatorar `InstallCommand` para o hook novo pode regredir a TASK04 → Mitigação: FR-013 exige os 21 testes existentes verdes sem edição e nova checagem no Storybook.
- **Risco:** `apps/skills` não tem runner de teste de componentes → Mitigação: lógica testável fica em `src/lib/*.ts` (`node:test`); a renderização é verificada por asserções sobre `out/index.html` e no navegador (T6). Introduzir Vitest em `apps/skills` fica fora do escopo.
- **Risco:** `content/` vazio deixa a home em estado vazio no dev local → Mitigação: FR-012 e as instruções de `SKILLS_REF`/`SKILLS_ROOT` acima.

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contratos de dados e componentes:

```ts
// registry.json (raiz) — campo novo
{ ..., "installCommands": { "repository": "npx skills add robertourias/skills" } }

// src/lib/skills.ts
type SkillListItem = {
  slug: string; title: string; description: string;
  tags: string[]; status: "stable" | "beta" | "draft";
  updated: string;   // YYYY-MM-DD
  command: string;   // installCommands.skill
};
type SkillSort = "recent" | "alpha";
function sortSkills(items: readonly SkillListItem[], sort: SkillSort): SkillListItem[];
function formatUpdated(iso: string): string;

// @nico.dev/ui
function useCopyToClipboard(opts?: { resetMs?: number; onFallback?: () => void }):
  { status: "idle" | "copied" | "fallback"; copy: (text: string) => Promise<void> };

type CopyButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  value: string;
  label?: string;        // "Copiar comando de instalação"
  copiedLabel?: string;  // "Copiado!"
};
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2              | —             |
| 2    | T3, T4              | T1 (para T3)  |
| 3    | T5                  | T2, T3        |
| 4    | T6                  | T3, T4, T5    |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. T1 mexe só em `apps/skills/scripts/`, T2 só em `packages/ui` e `apps/storybook`, T3/T4/T5/T6 só em `apps/skills/src`, para não haver conflito entre agentes paralelos. Testes junto com cada tarefa. Nunca usar `taskkill` por nome de processo; guardar o PID de servidores e encerrar só ele.

### Tarefa 1: `installCommands` na raiz do registry
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2
- **Descrição:** FR-001. Adicionar `installCommands.repository` ao schema e à montagem do registry, atualizar os testes (`build-registry.test.ts`, `cli.test.ts`, `schema.test.ts` conforme couber) e o exemplo de contrato em `docs/specs/2026-09-24-skills-registry.md`. Sem alterar `schemaVersion`.
- **Critérios de Aceite:**
  - [x] `registry.json` gerado contém `installCommands.repository` igual a `installCommandTemplates.repository`.
  - [x] Teste falha se o campo faltar ou tiver valor diferente do template.
  - [x] `pnpm --filter @nico.dev/skills run lint`, `typecheck` e `test` passam; registry de `content/` vazio continua válido.
  - [x] Execuções repetidas continuam byte a byte iguais.

### Tarefa 2: `useCopyToClipboard` e `CopyButton` em `packages/ui`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1
- **Descrição:** FR-013. Extrair o hook do `InstallCommand`, refatorar o componente para usá-lo sem mudar comportamento, criar `CopyButton` e a story `UI/CopyButton` (Default, Copiado via play function, Fallback). Testes Vitest do hook e do componente: copia o valor exato, "Copiado!" some em 2000 ms, timer reiniciado, fallback (clipboard ausente/rejeitado) sem erro, `aria-label` e `role="status"`, desmontar sem aviso. Atualizar `packages/ui/docs/context/ui-guidelines.md` e o changelog do package.
- **Critérios de Aceite:**
  - [x] Os 21 testes atuais de `install-command.test.tsx` passam **sem edição**.
  - [x] Novos testes de hook e `CopyButton` passam, sem avisos de `act` no stderr.
  - [x] `pnpm turbo test typecheck lint --filter=@nico.dev/ui` passa.
  - [x] `pnpm turbo build --filter=@nico.dev/storybook` conclui.
  - [x] `CopyButton` e o hook exportados por `@nico.dev/ui`.

### Tarefa 3: Camada de dados e lógica da home
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** T4
- **Descrição:** FR-002 a FR-004: `src/lib/registry.ts` (leitura e validação no build, mapeamento para `SkillListItem`) e `src/lib/skills.ts` (`sortSkills`, `formatUpdated`, tipos). Testes `node:test`: ordenação recent/alpha (empate de data desempata por título; não muta a entrada), locale pt-BR com acentos, `formatUpdated("2026-09-20")` sem deslocar o dia, `items` sem `content`, erro claro quando o arquivo falta. Incluir os novos testes no script `test` do app.
- **Critérios de Aceite:**
  - [x] Ordenações e formatação de data corretas nos casos acima.
  - [x] JSON serializado de um `SkillListItem` não contém `content` nem `files`.
  - [x] Leitura falha com mensagem que cita o comando `registry` se `public/registry.json` não existe.
  - [x] `lint`, `typecheck` e `test` do app passam.

### Tarefa 4: Banner ASCII e blocos de contadores
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T3
- **Descrição:** FR-005, FR-006 e FR-008 como componentes puramente apresentacionais em `apps/skills/src/components/` (`ascii-banner.tsx`, `stats.tsx`), recebendo tudo por props (sem importar `lib/registry`). Gerar o banner uma vez com figlet (`npx figlet`, sem adicionar dependência ao projeto) em duas versões: empilhada (< `sm`) e linha única (≥ `sm`); colar como constantes.
- **Critérios de Aceite:**
  - [x] `<pre aria-hidden="true">` e `<h1 className="sr-only">Nico Skills</h1>` presentes; nenhum outro `h1`.
  - [x] Versão empilhada com ≤ 40 colunas por linha; linha única legível em ≥ 640 px.
  - [x] Contadores renderizam `dl/dt/dd` com os três valores e `—` quando `lastUpdated` é `null`.
  - [x] Só tokens semânticos, sem hex; `lint` e `typecheck` passam.

### Tarefa 5: `SkillList` (cliente)
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T2, T3
- **Paralelizável com:** nenhuma
- **Descrição:** FR-009 a FR-012 em `src/components/skill-list.tsx`: `ToggleFilterGroup` de ordenação, `<ol>` com linhas conforme FR-010, `CopyButton` irmão do link com visibilidade por hover/foco/`hover: none`, estado vazio. Usa `sortSkills` e `formatUpdated`; recebe `SkillListItem[]`.
- **Critérios de Aceite:**
  - [x] Ordenação padrão "mais recentes"; alternar para A–Z reordena e renumera as posições.
  - [x] O `CopyButton` de cada linha copia exatamente `item.command`; não está dentro do `<a>`.
  - [x] Tags: no máximo 3, com "+N" quando houver mais; descrição em uma linha; status com a variante certa de `Badge`.
  - [x] `items = []` mostra "Nenhuma skill publicada ainda." sem erro.
  - [x] `lint` e `typecheck` passam; nenhum campo além de `SkillListItem` chega ao componente.

### Tarefa 6: Página, integração e verificação
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T3, T4, T5
- **Paralelizável com:** nenhuma
- **Descrição:** FR-007, FR-014 a FR-017. Recompor `src/app/page.tsx`: hero (banner + tagline + `InstallCommandTabs` de aba única), contadores e `SkillList`, com `getRegistry()` no servidor. Build de verificação com `SKILLS_REF=feat/migrate-mermaid-pencil pnpm turbo build --filter=@nico.dev/skills` (ou `SKILLS_ROOT` com fixture) e asserções sobre `out/index.html` (contadores, 5 títulos, ausência de `content` das skills no HTML/JS da página, banner com `aria-hidden`). Verificação no navegador (Storybook não; app com `next dev` ou `out/` servido) em claro/escuro e 360 px: clique real no comando e em um ícone de linha, ordenação, foco por teclado no ícone, axe-core (0 violações, transições desligadas na medição), sem overflow horizontal. Guardar o PID do servidor e encerrar só ele. Atualizar `docs/context/product.md`/`decisions.md` se alguma decisão mudar, spec e backlog só com o que foi verificado.
- **Critérios de Aceite:**
  - [x] `pnpm turbo build --filter=@nico.dev/skills` conclui e `out/index.html` contém hero, contadores e todas as linhas.
  - [x] Nenhum `content` de skill vai para o cliente (verificado no HTML e nos bundles da rota).
  - [x] Clique real no comando do hero copia `npx skills add robertourias/skills`; clique real no ícone de uma linha copia o comando `--skill <slug>` daquela skill.
  - [x] Ícone de linha alcançável e visível por teclado; visível sem hover em dispositivo `hover: none` (emulado).
  - [x] axe-core sem violações em claro e escuro; contraste de texto secundário e badges ok.
  - [x] Sem overflow horizontal da página a 360 px (banner empilhado).
  - [x] `pnpm --filter @nico.dev/skills run lint`, `typecheck` e `test` passam.
  - [x] Itens que não puderem ser verificados (ex.: leitor de tela real) listados no relatório e na spec.

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->

---

## Verificação no navegador (2026-09-25)

`out/` servido localmente (build com `SKILLS_REF=feat/migrate-mermaid-pencil`, 5 skills e 1 pack), Chrome/Edge conectado, tema escuro e claro.

- **Hero:** clique real no comando copia `npx skills add robertourias/skills` ("Copiado!" some em 2,04 s). Banner ASCII legível (figlet Standard); único `h1` é o `sr-only`.
- **Lista:** clique real no ícone da linha copia `npx skills add robertourias/skills --skill pencil-design-system` (verificado interceptando `writeText`), sem navegar para o link; o botão está fora do `<a>`. Enter no ícone via teclado copia `--skill mermaid-diagrams` uma vez.
- **Teclado:** ordem de Tab `comando → botão → ordenação (2) → link → ícone → …`; o ícone fica visível (opacidade 1) e com foco visível ao receber foco por teclado.
- **Ordenação:** "Mais recentes" desempata por título; "A–Z" renumera 1–5; `aria-pressed` correto.
- **360 px** (iframe): sem overflow da página nos dois temas, banner empilhado visível (231 px) e o de linha única oculto, sem sobreposição do botão de copiar com o texto das 5 linhas.
- **Estado vazio:** build com a fixture `empty`: "Nenhuma skill publicada ainda.", nenhum `<ol>`, contadores em 0 e "Atualizado em —" (verificado no HTML exportado).
- **axe-core 4.10.2** (wcag2a/aa, wcag21a/aa, best-practice), transições desligadas: 0 violações nos dois temas, **depois de duas correções** achadas por esta verificação:
  1. Claro: `Badge` `warning` (3,33:1) e `destructive` (4,28:1) abaixo de 4,5:1 sobre o fundo tingido. Tokens novos `--color-badge-warning-fg` (#9A5200, 5,27:1) e `--color-badge-destructive-fg` (#B42323, 5,45:1), usados só em `Badge` e `Alert`; no escuro mantêm os valores atuais. Espelhados em `src/tokens/colors.ts`. O `.pen` (fonte de verdade no Pencil) precisa ser atualizado à mão.
  2. Escuro: banner ASCII com `text-primary` (3,96:1) passou para `text-primary-hover` (7,5:1 no claro, 5,1:1 no escuro).

**Não verificado (limitações):**
- Variante `success` (skills `stable`): a home ainda não tem skill nesse status. Contraste calculado nos tokens (4,93:1 claro, 8,77:1 escuro), sem render.
- `hover: none`: confirmada a regra CSS `@media (hover: none)` na folha de estilo com `opacity: 1`; não houve emulação de dispositivo de toque.
- Leitor de tela real; rolagem por setas (mesma limitação de injeção de teclas da TASK04).
- Lighthouse (fica para a TASK17).
- Links das linhas (`/s/<slug>/`) levam a 404 até a TASK07.
