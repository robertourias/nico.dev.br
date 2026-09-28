# Spec & Plan: `<InstallCommand>` em `packages/ui` (TASK04)

**Status:** approved **Data:** 2026-09-25
**Autor:** PLANNER (Claude)
**Backlog:** TASK04 em `docs/context/product-backlog.md`
**Depende de:** TASK01 (`docs/specs/2026-09-24-skills-scaffold.md`, concluída)

---

## 1. Problema e Visão Geral

O produto gira em torno de copiar um comando de instalação com um clique, como no skills.sh. Esse elemento aparece em quatro lugares (hero da home, ícone na lista, página da skill, página de pack) e precisa do mesmo comportamento e da mesma acessibilidade em todos. Pelas regras do monorepo, componente novo de UI entra primeiro em `packages/ui` (`@nico.dev/ui`), nunca no app.

Esta tarefa entrega dois componentes e um hook em `packages/ui`, com testes e stories:

- `InstallCommand`: a caixa monoespaçada com `$`, que copia ao clicar.
- `InstallCommandTabs`: abas (Repositório / Esta skill / Manual) sobre o `InstallCommand`, com a aba escolhida persistida em `localStorage` e a nota sobre telemetria.
- `useStoredValue`: hook de valor persistido em `localStorage`, sincronizado entre instâncias.

Os componentes são **apresentacionais e genéricos**: recebem os comandos prontos por props. Os comandos vêm de `installCommands` do `registry.json` (regra do produto: nunca montados no cliente); quem monta as props é o app, nas TASK05 a TASK10. Esta tarefa também introduz o primeiro runner de teste de componentes do monorepo (Vitest + Testing Library), em `packages/ui`.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero clicar em qualquer ponto da caixa do comando e ter o comando exato copiado, com confirmação "Copiado!", para instalar sem selecionar texto.
- **P1 (crítico):** Como visitante de teclado ou leitor de tela, quero acionar a cópia por foco e Enter/Espaço e ouvir a confirmação, para ter a mesma função sem mouse.
- **P1 (crítico):** Como visitante, quero que, se a cópia automática falhar, o comando fique selecionado, para copiar manualmente.
- **P2 (importante):** Como visitante, quero que a aba que escolhi (ex.: Manual) seja lembrada nas outras páginas, para não reescolher a cada visita.
- **P2 (importante):** Como visitante que não quer telemetria, quero ver a nota sobre `DISABLE_TELEMETRY=1` logo abaixo do comando.
- **P3 (nice-to-have):** Como dev do site, quero stories no Storybook com os estados (repouso, copiado, falha, comando longo), para revisar visual e acessibilidade isoladamente.

---

## 3. Requisitos Funcionais

### `InstallCommand`

- **FR-001:** Arquivo `packages/ui/src/components/install-command.tsx`, com `"use client"`, exports nomeados, `React.forwardRef`, `cn` e tokens semânticos (sem hex), no padrão dos demais componentes. Props: `command: string` (obrigatória), `prompt?: string` (padrão `"$"`), `copiedLabel?: string` (padrão `"Copiado!"`), `fallbackLabel?: string` (padrão `"Selecione e copie: Ctrl+C"`), `onCopy?: (status: "copied" | "fallback") => void` e as props de `div` restantes (`Omit` de `children` e `onCopy`), espalhadas no elemento raiz.
- **FR-002:** O elemento raiz é um `<div>` (`forwardRef<HTMLDivElement>`) clicável com o mouse: clicar em qualquer ponto da caixa copia o comando, **exceto** quando o usuário acabou de selecionar texto por arraste (`window.getSelection()` não vazio e o alvo do clique não é o botão). Dentro dele há um `<button type="button">` com `aria-label="Copiar comando de instalação"` e `aria-describedby` apontando para o `<code>`; o botão é o **acionador por teclado e leitor de tela** (Enter/Espaço copiam, sempre, mesmo com texto selecionado). Um único handler de cópia (no root) atende clique na caixa e no botão, sem cópia dupla por bubbling.
- **FR-003:** Conteúdo (em ordem de Tab: `<code>` e depois o botão): prefixo `$` (`aria-hidden`, não selecionável), `<code>` **focável** (`tabIndex={0}`, **sem** `aria-label`: o nome vem do texto do comando, senão o `aria-describedby` do botão herdaria só o rótulo e esconderia o comando; `font-mono`, foco visível `focus-visible:ring-2 ring-ring`) e o botão com o ícone Lucide `Copy`, que vira `Check` mais o rótulo visível "Copiado!" no estado copiado. Fundo, borda e texto vêm dos tokens (`bg-surface-raised`, `border-border`, `text-foreground`), com contraste ≥ 4.5:1 em claro e escuro. Enter/Espaço no `<code>` não copiam.
- **FR-004:** O comando não quebra linha (`whitespace-nowrap`) e rola na horizontal quando não cabe (`overflow-x-auto` no `<code>`, `min-w-0`, `flex-1`), inclusive em 360 px, e a rolagem é alcançável por teclado porque o `<code>` é focável (WCAG 2.1.1, regra axe `scrollable-region-focusable`). O botão fica fora da região rolável (`shrink-0`). Nenhum overflow horizontal da página.
- **FR-005:** Cópia via `navigator.clipboard.writeText(command)`. Sucesso: mostra `copiedLabel` por **2000 ms** e volta ao estado de repouso; clicar de novo durante o intervalo reinicia o contador. O timer é limpo ao desmontar.
- **FR-006:** Anúncio: uma região `role="status"` (`aria-live="polite"`, `aria-atomic`) sempre presente no DOM, visualmente oculta (`sr-only`), recebe `copiedLabel` (ou `fallbackLabel`) ao copiar e é esvaziada ao fim dos 2 s. O rótulo visível "Copiado!" aparece ao lado do ícone.
- **FR-007:** Fallback: se `navigator.clipboard` não existir (contexto inseguro) ou `writeText` rejeitar, o texto do `<code>` é selecionado (`window.getSelection().selectAllChildren`), `fallbackLabel` é anunciado e exibido, e `onCopy("fallback")` é chamado. Nunca lança erro para o usuário.
- **FR-008:** O comando exibido e copiado é exatamente a string recebida, sem trim, prefixo ou alteração.

### `useStoredValue`

- **FR-009:** `packages/ui/src/hooks/use-stored-value.ts`, `"use client"`: `useStoredValue(key: string): readonly [string | null, (value: string) => void]`, sobre `useSyncExternalStore`. O snapshot do servidor é `null` (o export estático renderiza o padrão e reaplica o valor salvo após a hidratação).
- **FR-010:** Toda leitura e escrita de `localStorage` está em `try/catch`; se o storage lançar (modo privado, bloqueado), o hook funciona só em memória durante a sessão da página, sem erro. Semântica de prioridade: um valor presente no `localStorage` tem prioridade sobre o valor em memória; uma escrita bem-sucedida no `localStorage` remove a entrada em memória daquela chave; se o storage lança, o valor vive só em memória.
- **FR-011:** Sincroniza instâncias: escrita dispara um evento customizado no `window` (mesma aba) e o hook escuta também o evento `storage` (outras abas). Duas instâncias com a mesma `key` na mesma página mostram sempre o mesmo valor.

### `InstallCommandTabs`

- **FR-012:** Mesmo arquivo `install-command.tsx` (ou `install-command-tabs.tsx` reexportado). Props: `tabs: { id: string; label: string; command: string }[]` (mínimo 1), `defaultTabId?: string` (padrão: primeira aba), `storageKey?: string` (padrão `"nico:install-tab"`), `note?: React.ReactNode | false` (padrão: nota de telemetria; `false` remove), `variant?: "pill" | "underline"` (padrão `pill`), `className`.
- **FR-013:** Usa `Tabs`, `TabsList`, `TabsTrigger` e `TabsContent` já existentes em `packages/ui`; cada `TabsContent` contém um `InstallCommand`. Com **uma única aba**, não renderiza a lista de abas (só a caixa), para o hero da home e as páginas de pack.
- **FR-014:** Aba ativa: se o valor salvo em `storageKey` existe entre os `id` das `tabs` desta instância, é usado; senão vale `defaultTabId`. O valor salvo só é **escrito** quando o usuário troca de aba (nunca ao montar), e um valor salvo que não existe nesta página é preservado, não sobrescrito. Ex.: escolher "Manual" na página da skill e abrir a home (só "Repositório") mantém "Manual" salvo para a próxima página de skill.
- **FR-015:** Nota de telemetria (padrão, em pt-BR), abaixo do comando: "Para não enviar telemetria anônima, prefixe o comando com `DISABLE_TELEMETRY=1`." O `DISABLE_TELEMETRY=1` aparece em `<code>`. A nota é texto fixo: não monta nem altera o comando exibido.
- **FR-016:** O componente não conhece skills, registry nem URLs: só `tabs` e strings. Não importa nada de `apps/`.

### Infra, exports, stories e docs

- **FR-017:** Vitest em `packages/ui` (série 4, `vitest@4.1.11`; `globals: true` para o Testing Library registrar cleanup e o ambiente de `act` sozinho, tipos `vitest/globals` no `tsconfig`; fake timers com `shouldAdvanceTime` e `userEvent.setup({ advanceTimers })`, sem stub de `jest`): devDependencies `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` (versões fixadas; consultar a doc via Context7). `vitest.config.ts` com `environment: "jsdom"`, `esbuild.jsx: "automatic"` e arquivo de setup que registra `@testing-library/jest-dom`. Script `lint` (eslint flat config sobre `@nico.dev/config/eslint/base` + `typescript-eslint` + `react-hooks`). Script `test` em `packages/ui/package.json`; task `test` no `turbo.json` (`dependsOn: []`, sem outputs). Testes ficam ao lado do código (`*.test.tsx`), fora do bundle de exports.
- **FR-018:** `packages/ui/src/index.ts` exporta `InstallCommand`, `InstallCommandTabs` e `useStoredValue` (seção nova `// Components — Developer`).
- **FR-019:** Stories em `apps/storybook/src/stories/InstallCommand.stories.tsx` (`title: "UI/InstallCommand"`, `tags: ["autodocs"]`, padrão de `Tabs.stories.tsx`): Default, comando longo (rolagem horizontal), estado copiado (play function), fallback de clipboard, e `InstallCommandTabs` com 3 abas, 1 aba e `note={false}`. O addon a11y não acusa violações nas stories.
- **FR-020:** Docs: adicionar `InstallCommand`/`InstallCommandTabs`/`useStoredValue` à tabela de componentes em `packages/ui/docs/context/ui-guidelines.md`; registrar em `docs/context/decisions.md` que testes de componentes em `packages/ui` usam **Vitest + Testing Library** (desvio do Jest citado, nunca configurado); ajustar a seção Skills Catalog de `docs/context/ui-guidelines.md` para apontar o componente real; entrada no changelog do package seguindo o padrão de `packages/ui/docs/changelog/`.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** usar os componentes em páginas do `apps/skills` (TASK05, TASK07, TASK10); montar comandos por skill ou pack; ícone de copiar ao passar o mouse na lista (TASK05 reutiliza `InstallCommand`/`useStoredValue`); comando de instalar pack inteiro (TASK10); tema Nocturne; testes E2E; job de CI para `packages/ui` (TASK13 decide o pipeline).
- **Premissa:** os tokens `bg-surface-raised`, `border-border`, `text-muted-foreground` e `ring-ring` existem e passam contraste em claro e escuro (verificar no Storybook com o addon a11y).
- **Premissa:** o corpo da nota de telemetria segue a spec de produto; se o CLI do skills mudar a variável, editar só a constante do componente.
- **Risco:** `aria-label` no `<button>` substitui o conteúdo como nome acessível, e o leitor não leria o comando → Mitigação: FR-002 usa `aria-describedby` no `<code>`; teste verifica o vínculo. Ressalva (revisão 2026-09-25): o `<code>` agora também tem `aria-label`, e algoritmos de nome/descrição podem usar esse `aria-label` ao resolver o `aria-describedby`; reconferir com leitor de tela real.
- **Risco:** hidratação divergente (valor salvo só existe no cliente) → Mitigação: snapshot de servidor `null` (FR-009), o export renderiza a aba padrão e o cliente troca depois; teste com `getServerSnapshot`.
- **Risco:** `navigator.clipboard` exige contexto seguro e permissão → Mitigação: fallback de seleção (FR-007), testado com clipboard ausente e rejeitando.
- **Risco:** Vitest 4 / React 19 / jsdom têm arestas de compatibilidade (ex.: `act`, `user-event` com fake timers) → Mitigação: fixar versões pela doc atual e usar `advanceTimers` do `user-event` nos testes de 2 s.
- **Risco:** `packages/ui` hoje não tem `test` no Turbo; adicionar a task altera o grafo de todos os pacotes → Mitigação: task `test` sem `dependsOn` nem outputs; pacotes sem script `test` são ignorados pelo Turbo.

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contrato de componentes (exportado por `@nico.dev/ui`):

```tsx
type InstallCommandProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onCopy"> & {
  command: string;
  prompt?: string;            // "$"
  copiedLabel?: string;       // "Copiado!"
  fallbackLabel?: string;     // "Selecione e copie: Ctrl+C"
  onCopy?: (status: "copied" | "fallback") => void;
};

type InstallCommandTab = { id: string; label: string; command: string };

type InstallCommandTabsProps = {
  tabs: InstallCommandTab[];          // >= 1
  defaultTabId?: string;              // padrão: tabs[0].id
  storageKey?: string;                // "nico:install-tab"
  note?: React.ReactNode | false;     // nota de telemetria; false remove
  variant?: "pill" | "underline";     // "pill"
  className?: string;
};

function useStoredValue(key: string): readonly [string | null, (value: string) => void];
```

Uso esperado pelo app (referência para as TASK05/07, não implementado aqui):

```tsx
<InstallCommandTabs
  tabs={[
    { id: "skill", label: "Esta skill", command: skill.installCommands.skill },
    { id: "repository", label: "Repositório", command: skill.installCommands.repository },
    { id: "manual", label: "Manual", command: skill.installCommands.manual },
  ]}
  defaultTabId="skill"
/>
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1                  | —             |
| 2    | T2, T3              | T1            |
| 3    | T4                  | T2, T3        |
| 4    | T5                  | T4            |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. Testes são escritos junto com cada tarefa. T2 e T3 não tocam em `index.ts`; só a T4 edita os exports, para evitar conflito entre agentes paralelos.

### Tarefa 1: Infra de testes de componentes em `packages/ui`
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** nenhuma
- **Descrição:** Implementar o FR-017: dependências (versões fixadas via doc atual), `vitest.config.ts`, arquivo de setup (jest-dom + cleanup), script `test` em `packages/ui/package.json`, task `test` no `turbo.json`. Incluir um teste mínimo de sanidade (ex.: renderiza `Badge` e encontra o texto) só para provar o pipeline, mantido depois como teste de fumaça do package.
- **Critérios de Aceite:**
  - [x] `pnpm --filter @nico.dev/ui test` roda o teste de fumaça em jsdom e passa.
  - [x] `pnpm turbo test --filter=@nico.dev/ui` executa a task.
  - [x] `lint`/`typecheck` de `packages/ui` e de `apps/skills` continuam passando (o `tsconfig` do package inclui os `*.test.tsx` sem quebrar).
  - [x] Nenhum arquivo de teste entra nos exports públicos de `src/index.ts`.

### Tarefa 2: Componente `InstallCommand`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** T3
- **Descrição:** Implementar FR-001 a FR-008 em `packages/ui/src/components/install-command.tsx` com TSDoc e `@example` no padrão de `tabs.tsx`. Testes em `install-command.test.tsx` cobrindo: renderiza `$` e comando exato; clique chama `writeText` com o comando exato (mock de `navigator.clipboard`); "Copiado!" aparece e some após 2000 ms (fake timers); segundo clique reinicia o contador; região `role="status"` recebe o texto e é esvaziada; `aria-label` e `aria-describedby` corretos; clique em `$`/`<code>` copia; clique com texto selecionado no `<code>` não copia; botão copia via Enter e Espaço, uma única vez (`writeText` 1x); Enter no `<code>` não copia; `<code>` com `tabindex="0"` e nome acessível; ordem de Tab code → botão; `writeText` rejeitando e `navigator.clipboard` ausente → seleção do `<code>`, `fallbackLabel` e `onCopy("fallback")`; desmontar durante o timer não gera aviso de atualização de estado.
- **Critérios de Aceite:**
  - [x] Todos os testes acima passam.
  - [x] O `<code>` é focável (rolagem por teclado); o `<button>` é o acionador de cópia por teclado; a caixa inteira segue clicável com o mouse (exceto ao selecionar texto).
  - [x] Comando longo rola horizontalmente sem quebrar linha (classe e estilo verificados; visual conferido na T5).
  - [x] Sem hex direto; só tokens semânticos.

### Tarefa 3: Hook `useStoredValue`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** T2
- **Descrição:** Implementar FR-009 a FR-011 em `packages/ui/src/hooks/use-stored-value.ts`. Testes em `use-stored-value.test.tsx`: lê valor existente; retorna `null` sem valor; `set` grava e atualiza; duas instâncias com a mesma chave sincronizam na mesma página; evento `storage` de outra aba atualiza; `getItem`/`setItem` lançando não quebram e o valor vive em memória; snapshot de servidor é `null` (renderizar com `renderToString`/`getServerSnapshot`); limpeza dos listeners ao desmontar.
- **Critérios de Aceite:**
  - [x] Todos os testes acima passam.
  - [x] Nenhum acesso a `window`/`localStorage` durante a renderização no servidor.
  - [x] Nenhum vazamento de listener após desmontar (teste com `removeEventListener` observado).

### Tarefa 4: `InstallCommandTabs` e exports
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T2, T3
- **Paralelizável com:** nenhuma
- **Descrição:** Implementar FR-012 a FR-016 e FR-018. Testes em `install-command-tabs.test.tsx`: renderiza as 3 abas e mostra o comando da aba padrão; trocar de aba mostra o comando certo e grava em `localStorage` (`nico:install-tab`); remontar reaplica a aba salva; valor salvo inexistente nesta instância → `defaultTabId`, sem sobrescrever o salvo; nada é escrito ao montar; uma aba só → sem lista de abas; `note` padrão presente com `DISABLE_TELEMETRY=1` em `<code>`, `note={false}` remove, `note` customizada substitui; duas instâncias na mesma página trocam juntas quando compartilham a chave; navegação por setas entre abas (Radix); `storageKey` customizada isola. Adicionar exports ao `index.ts`.
- **Critérios de Aceite:**
  - [x] Todos os testes acima passam.
  - [x] `import { InstallCommand, InstallCommandTabs, useStoredValue } from "@nico.dev/ui"` compila em `apps/skills` (`pnpm --filter @nico.dev/skills typecheck` com um import temporário, removido em seguida).
  - [x] O comando exibido é sempre a string recebida; a nota não altera nem concatena o comando.
  - [x] `pnpm --filter @nico.dev/ui lint typecheck test` passam.

### Tarefa 5: Stories, docs e verificação visual
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T4
- **Paralelizável com:** nenhuma
- **Descrição:** Implementar FR-019 e FR-020. Subir o Storybook, conferir claro/escuro, foco visível, rolagem horizontal do comando longo em 360 px e o addon a11y. Rodar `pnpm turbo build --filter=@nico.dev/storybook` e `pnpm turbo lint typecheck test --filter=@nico.dev/ui`. Guardar o PID do servidor e encerrar só ele (nunca `taskkill` por nome de processo). Marcar TASK04 `done` no backlog só com tudo verde.
- **Critérios de Aceite:**
  - [x] Stories renderizam os estados Default, comando longo, copiado, fallback, 3 abas, 1 aba e `note={false}`.
  - [x] Addon a11y sem violações nas stories novas; contraste ok em claro e escuro.
  - [x] Sem overflow horizontal da página em 360 px.
  - [x] Build do Storybook conclui.
  - [x] Docs atualizados (FR-020): tabela em `packages/ui/docs/context/ui-guidelines.md`, decisão de Vitest em `docs/context/decisions.md`, seção Skills Catalog de `docs/context/ui-guidelines.md`, changelog do package.

---

## Revisão 2026-09-25 (pós-verificação no navegador)

**Achado.** A verificação real no navegador com axe-core nas 8 stories encontrou 1 violação *serious*: `scrollable-region-focusable` (WCAG 2.1.1). O `<code>` rola na horizontal (`overflow-x-auto`), mas estava **dentro de um único `<button>`**, então a região rolável não era alcançável por teclado.

**Decisão.** Separar o scroll do botão. O root passa a ser um `<div>` clicável com o mouse; o `<code>` vira irmão do botão e recebe `tabIndex={0}` (rolagem com setas); o `<button>` (ícone, "Copiado!") é o acionador por teclado e leitor de tela. Clicar em qualquer ponto da caixa continua copiando com o mouse, exceto ao selecionar texto por arraste no `<code>`. Um único handler de cópia evita cópia dupla quando o clique no botão borbulha.

**Contrato atualizado.** FR-001 (props de `div`), FR-002, FR-003, FR-004, FR-010 (semântica de prioridade do storage), FR-017 (Vitest com `globals`, script `lint`) e os critérios da T2 foram reescritos acima. Estrutura resultante: `div[root] > span[$] + code[tabindex=0] + button + span[role=status]`.

**Pendente (marcado pelo autor após reverificar).** Os critérios de verificação visual/a11y da T5 permanecem desmarcados até nova rodada de axe e conferência manual (foco no `<code>`, rolagem por setas, ordem de Tab, contraste).

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->

---

## Verificação no navegador (2026-09-25)

Storybook real (dev server) em Chrome/Edge, 8 stories, claro e escuro.

- **axe-core 4.10.2** (mesmo motor do addon a11y; regras wcag2a/aa, wcag21a/aa, best-practice): 0 violações nas 16 execuções (8 stories × 2 temas), com transições CSS desligadas para não medir cor no meio da animação. Antes da revisão havia `scrollable-region-focusable` (serious) nas 8 stories.
- **Contraste:** código 12,5:1; ícone e `$` 4,73:1 no escuro; `color-contrast` do axe sem violações.
- **Mouse real:** clicar no texto copia ("Copiado!" ~60 ms depois); arrastar para selecionar texto **não** copia.
- **Teclado real:** ordem de Tab `code` → botão, anel de foco visível nos dois; Enter no botão copia uma vez.
- **Acessibilidade:** o `<code>` não tem `aria-label`; o nome vem do comando, então o `aria-describedby` do botão expõe o comando (com `aria-label` ele expunha só "Comando de instalação"; corrigido nesta verificação).
- **360 px:** sem overflow da página em iframe de 360 px nas 8 stories; comando longo rola no `<code>`.
- **Abas:** troca, persistência após reload, chave só gravada ao trocar; 1 aba sem lista.

**Não verificado (limitações):** rolagem por setas no `<code>` (a ferramenta de teclas do navegador não dispara a ação nativa de scroll; um `div` rolável de controle também não rolou; é comportamento nativo de contêiner focável); leitor de tela real; duração exata do "Copiado!" no navegador (observada entre 2,2 s e 3,0 s numa aba com timers estrangulados; os 2000 ms são cobertos por teste unitário com fake timers).
