# Spec & Plan: Página `/s/[slug]` (TASK07)

**Status:** approved **Data:** 2026-09-27
**Autor:** PLANNER (Claude)
**Backlog:** TASK07 em `docs/context/product-backlog.md`
**Depende de:** TASK02 (registry, `docs/archive/2026-09-24-skills-registry.md`) e TASK04 (`InstallCommandTabs`, `docs/archive/2026-09-25-install-command.md`), ambas concluídas

---

## 1. Problema e Visão Geral

A home (TASK05/06) lista as skills e linka cada uma para `/s/<slug>/`, mas a rota não existe — todo clique dá 404. Sem página própria, o visitante não consegue ler o `SKILL.md` completo, ver os arquivos incluídos nem copiar o comando específico daquela skill.

Esta tarefa entrega a página de detalhe, 100% estática (gerada no build via `generateStaticParams`, uma por skill pública do `registry.json`): badges (categoria, status, versão), descrição, `InstallCommandTabs` com as 3 opções de instalação, `SKILL.md` renderizado (Markdown → HTML sanitizado, com highlight de código), árvore de arquivos da skill e links para o GitHub e o skills.sh.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero abrir `/s/<slug>/` a partir da home e ver o `SKILL.md` completo renderizado (títulos, listas, blocos de código com highlight, tabelas), para entender o que a skill faz antes de instalar.
- **P1 (crítico):** Como visitante, quero copiar o comando específico desta skill (`--skill <slug>`) direto na página, sem montar o comando manualmente.
- **P1 (crítico):** Como visitante, quero ver quais arquivos a skill inclui (árvore), para saber se ela traz scripts, referências ou só o `SKILL.md`.
- **P2 (importante):** Como visitante, quero links diretos para o código no GitHub e para a página da skill no skills.sh, para aprofundar ou conferir a instalação por lá.
- **P2 (importante):** Como visitante, quero ver categoria, status e versão da skill em destaque, para avaliar maturidade rapidamente.
- **P3 (nice-to-have):** Como visitante de teclado ou leitor de tela, quero navegar pela página (links, abas de instalação, árvore de arquivos) inteiramente sem mouse.

---

## 3. Requisitos Funcionais

### Dados

- **FR-001:** `src/lib/skills.ts` ganha o tipo `SkillDetail` (projeção completa de uma skill, distinta de `SkillListItem`): `{ slug, title, description, category, tags, status, version, updated, files, content, installCommands: { repository, skill, manual }, githubUrl, skillsShUrl }`. `skillsShUrl` é derivado com `skillsShConfig.skillUrl(slug)` (de `catalog.config.ts`), não persistido no `registry.json`. **Fora desta tarefa:** `metadata.agents` e `metadata.language` não aparecem na UI (ver seção 4).
- **FR-002:** `src/lib/registry.ts` ganha `getSkill(slug: string): SkillDetail | undefined` e `getSkillSlugs(): string[]` (slugs de todas as skills públicas, para `generateStaticParams`). Refatorar sem duplicar leitura de disco: extrair `parseRegistryFile(path): Registry` (parse + validação, já existente inline em `loadRegistry`) e derivar `loadRegistry` (mantém assinatura e retorno atuais, usado pela home) e a nova `loadSkillDetails(path): SkillDetail[]` a partir do mesmo `Registry` parseado. `getSkill`/`getSkillSlugs` chamam `loadSkillDetails(DEFAULT_REGISTRY_PATH)` internamente. Nenhuma mudança de comportamento em `loadRegistry`/`getRegistry` (testes existentes de `registry.test.ts` continuam passando sem edição).
- **FR-003:** `src/lib/skills.ts` ganha o tipo `FileTreeNode = { name: string; path: string; type: "file" | "folder"; children?: FileTreeNode[] }` e a função pura `buildFileTree(files: readonly string[]): FileTreeNode[]`. Constrói a árvore a partir dos caminhos POSIX relativos (já ordenados pelo registry, FR-010 da TASK02): agrupa por segmento de diretório, preservando a ordem de primeira aparição de cada pasta/arquivo em `files` (sem reordenar). Uma pasta nunca aparece sem filhos (só existe se houver ao menos um arquivo dentro).

### Markdown (SKILL.md → HTML)

- **FR-004:** Novo módulo `src/lib/markdown.ts`, função pura `renderSkillMarkdown(markdown: string): string`, sobre `unified` + `remark-parse` + `remark-gfm` (tabelas e listas de tarefa são comuns em `SKILL.md`) + `remark-rehype` + `rehype-highlight` (highlight de blocos de código) + `rehype-sanitize` + `rehype-stringify`. Roda síncrono (`processSync`) — sem I/O, testável com `node --test` sem DOM. **Decisão desta tarefa** (registrar em `docs/context/decisions.md`): usa o pipeline `unified` direto para HTML em vez do componente `<ReactMarkdown>` citado em `docs/context/decisions.md`, porque a página é um Server Component 100% estático — gerar a string HTML no build permite testar a sanitização com `node --test` (sem harness de componente, mesma limitação já registrada nas TASK05/06) e não envia nenhum parser de Markdown para o bundle do cliente. `rehype-highlight`/`remark-gfm`/`rehype-sanitize` continuam sendo os mesmos pacotes já decididos.
- **FR-005:** Schema de sanitização: estender o `defaultSchema` de `rehype-sanitize` para permitir o `className` que `rehype-highlight` adiciona (`language-*` em `<code>`, `hljs-*` em `<span>`) — sem essa extensão, `rehype-sanitize` remove os atributos que dão a cor ao código. Ordem dos plugins: `rehype-highlight` **antes** de `rehype-sanitize` (o sanitizador precisa rodar depois de o highlight adicionar as classes, para decidir o que manter). Consultar a documentação atual de `rehype-sanitize`/`rehype-highlight` via Context7 antes de fixar o schema e as versões (API de schema pode mudar entre versões maiores).
- **FR-006:** `src/components/skill-markdown.tsx` (Server Component, sem `"use client"`): recebe `content: string`, chama `renderSkillMarkdown` e renderiza `<div className="skill-markdown" dangerouslySetInnerHTML={{ __html: html }} />` com comentário/`eslint-disable-next-line` explicando que o HTML já passou por `rehype-sanitize` (regra do projeto: nunca desabilitar lint sem explicar o motivo).
- **FR-007:** Estilos de `.skill-markdown` em `apps/skills/src/app/globals.css` (sem plugin de tipografia novo, sem CSS Modules): títulos, parágrafos, listas, citações, tabelas (bordas via `border-border`) e links (`text-primary`, sublinhado) só com tokens semânticos existentes. Bloco de código (`pre`/`code`): fundo `bg-surface-raised`, borda `border-border`, `overflow-x-auto` (sem quebrar layout em 360 px). Tema de highlight (`.hljs`): importar um par de temas do `highlight.js` (claro/escuro) via CSS, cada um dentro do seu `@media (prefers-color-scheme: ...)`, isolado por essa media query — exceção documentada à regra "nunca hex direto" (é uma folha de estilo de terceiros para sintaxe de código, não uma escolha de cor decorativa do design system); registrar a exceção em `docs/context/decisions.md`.
- **FR-008:** Testes `node --test` para `renderSkillMarkdown`: títulos/listas/parágrafos viram as tags certas; tabela GFM vira `<table>`; bloco de código com linguagem (` ```ts `) ganha classe `language-ts` e `hljs` no `<code>`/`<span>` internos (prova de que highlight sobrevive ao sanitize); **segurança**: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>` e `[link](javascript:alert(1))` no Markdown de entrada não aparecem executáveis na saída (sem `<script>`, sem `onerror`, sem `href="javascript:..."`).

### UI — badges e links

- **FR-009:** `src/components/skill-badges.tsx`: recebe `category`, `status`, `version`; renderiza 3 `Badge` (`@nico.dev/ui`): categoria (`variant="default"`, rótulo capitalizado, ex. `category="design"` → "Design"), status (mesma tradução/variante da lista: `stable`→"Estável"/`success`, `beta`→"Beta"/`warning`, `draft`→"Rascunho"/`default`) e versão (`variant="default"`, rótulo `v${version}`).
- **FR-010:** `src/components/skill-links.tsx`: recebe `githubUrl`, `skillsShUrl`; renderiza 2 links externos (`target="_blank" rel="noopener noreferrer"`, ícones Lucide `Github`/`ExternalLink`, texto visível "Ver no GitHub" e "Ver no skills.sh"), foco visível. Nota abaixo, em texto pequeno: "Skills só aparecem no skills.sh depois de instaladas ao menos uma vez." (regra do glossário: skills.sh é telemetria de instalação, não índice ao vivo).

### Árvore de arquivos

- **FR-011:** `src/components/file-tree.tsx` (Server Component): recebe `nodes: FileTreeNode[]` e renderiza recursivamente uma lista aninhada (`<ul>`/`<li>`), ícone Lucide `Folder` para pastas e `File`/`FileText` para arquivos, indentação por nível, nome do arquivo/pasta como texto (sem link individual — só a skill inteira linka pro GitHub via FR-010; nenhum arquivo isolado é servido pelo site). Título da seção: "Arquivos desta skill".

### Página

- **FR-012:** `src/app/s/[slug]/page.tsx` (Server Component), `generateStaticParams` retorna `getSkillSlugs().map(slug => ({ slug }))`; `export const dynamicParams = false` (export estático: nenhuma rota fora da lista é gerada nem tem fallback em runtime). Busca `getSkill(params.slug)`; se `undefined`, chama `notFound()`.
- **FR-013:** Composição da página, nesta ordem: link "← Todas as skills" para `/`; `<h1>{title}</h1>` + `SkillBadges`; parágrafo de `description`; `InstallCommandTabs` com as 3 abas na ordem `["skill", "repository", "manual"]` (rótulos "Esta skill" / "Repositório" / "Manual", `defaultTabId="skill"`, mesma `storageKey` padrão `"nico:install-tab"` — a aba escolhida na home continua valendo aqui); linha com todas as `tags` (`Badge` `variant="default"`, sem limite de 3 como na lista — aqui é a página inteira da skill) e a data de atualização (`formatUpdated`, já existente); `SkillLinks`; `SkillMarkdown` (o `content` da skill); `FileTree` (`buildFileTree(files)`).
- **FR-014:** `generateMetadata` define `<title>` (`"${title} · Nico Skills"`) e `description` (a `description` da skill) — só o mínimo de metadata de página; OG image e `sitemap.xml` ficam para TASK15/TASK12.
- **FR-015:** Layout responsivo a partir de 360 px, sem overflow horizontal (inclusive blocos de código longos e tabelas — `overflow-x-auto` nelas); largura máxima de leitura consistente com a home (`max-w-3xl`/`max-w-4xl`); só tokens semânticos; claro/escuro via `prefers-color-scheme` (mesmo padrão do app).

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** `metadata.agents` e `metadata.language` na UI (ficam para TASK16 — filtro por agente); links individuais por arquivo da árvore; changelog por `git log` (TASK14); OG image por skill (TASK15); `sitemap.xml`/`robots.txt` (TASK12); header/footer/tema global do app; `/packs`, `/p/[id]`, `/topic/[tag]` (TASK10/11); paginação ou navegação entre skills (anterior/próxima).
- **Premissa:** `registry.json` já contém `content`, `files`, `installCommands` completos e `githubUrl` por skill (TASK02); nada novo é adicionado ao schema do registry nesta tarefa.
- **Premissa:** o desenvolvimento e a verificação usam `SKILLS_REF=feat/migrate-mermaid-pencil` ou `SKILLS_ROOT=scripts/__fixtures__/valid` (mesma premissa das TASK05/06), com ao menos uma skill cujo `SKILL.md` tenha bloco de código com linguagem, tabela e subpastas em `files` (usar/estender a fixture `valid/` se faltar algum caso).
- **Risco:** `rehype-sanitize` remover as classes do `rehype-highlight` e o código sair sem cor → Mitigação: FR-005 (schema estendido) + FR-008 (teste que prova `hljs`/`language-*` sobrevivem); verificação visual no navegador confirma a cor real.
- **Risco:** tema de highlight com cores fixas (hex) por ser CSS de terceiros → Mitigação: isolado por `prefers-color-scheme` (FR-007), contraste conferido com axe/manual na verificação; exceção registrada em `docs/context/decisions.md`, não repetida em outros componentes.
- **Risco:** `dangerouslySetInnerHTML` é sinal de alerta de segurança para quem revisar o código → Mitigação: FR-006 exige comentário explicando a sanitização; conteúdo vem de um repositório controlado (`robertourias/skills`), não de input de usuário do site.
- **Risco:** skill com `files` só contendo `SKILL.md` deixa a árvore com 1 item — comportamento esperado, não é bug (sem estado vazio especial necessário).
- **Risco:** build sem `content/` sincronizado (mesma premissa da TASK05) deixa `getSkillSlugs()` vazio → nenhuma página `/s/*` é gerada; comportamento aceito, igual à home com registry vazio.
- **Risco:** `unified`/`remark-gfm`/`rehype-highlight`/`rehype-sanitize` têm breaking changes entre versões maiores (schema de sanitização em particular) → Mitigação: consultar Context7 antes de fixar versões (FR-005); fixar versões exatas no `package.json`.

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contratos de dados e componentes (novos, sobre o `registry.json` já existente):

```ts
// src/lib/skills.ts
interface SkillDetail {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: string;
  version: string;
  updated: string; // YYYY-MM-DD
  files: string[]; // caminhos POSIX relativos, já ordenados
  content: string; // corpo Markdown, sem frontmatter
  installCommands: { repository: string; skill: string; manual: string };
  githubUrl: string;
  skillsShUrl: string;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
}
function buildFileTree(files: readonly string[]): FileTreeNode[];

// src/lib/registry.ts
function getSkill(slug: string): SkillDetail | undefined;
function getSkillSlugs(): string[];

// src/lib/markdown.ts
function renderSkillMarkdown(markdown: string): string; // HTML já sanitizado
```

```tsx
// src/components/skill-badges.tsx
type SkillBadgesProps = Pick<SkillDetail, "category" | "status" | "version">;

// src/components/skill-links.tsx
type SkillLinksProps = Pick<SkillDetail, "githubUrl" | "skillsShUrl">;

// src/components/file-tree.tsx
type FileTreeProps = { nodes: FileTreeNode[] };

// src/components/skill-markdown.tsx
type SkillMarkdownProps = { content: string };
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|----------------|
| 1    | T1, T2, T3          | —              |
| 2    | T4                  | T1, T2         |
| 3    | T5                  | T1, T2, T3, T4 |
| 4    | T6                  | T5             |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. T1 mexe em `src/lib/skills.ts` e `src/lib/registry.ts`; T2 cria só `src/lib/markdown.ts`; T3 cria só `skill-badges.tsx`/`skill-links.tsx` — arquivos distintos, sem conflito entre agentes paralelos. Só a T4 cria `skill-markdown.tsx`/`file-tree.tsx` (depende dos tipos/funções de T1 e T2) e só a T5 toca `app/s/[slug]/page.tsx` e `globals.css`. Testes junto com cada tarefa. Nunca usar `taskkill` por nome de processo; guardar o PID de servidores e encerrar só ele.

### Tarefa 1: `SkillDetail`, `getSkill`, `getSkillSlugs`, `buildFileTree`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2, T3
- **Descrição:** FR-001 a FR-003. Refatorar `src/lib/registry.ts` (extrair `parseRegistryFile`, manter `loadRegistry`/`getRegistry` sem mudança de comportamento) e adicionar `loadSkillDetails`, `getSkill`, `getSkillSlugs`. Adicionar `SkillDetail`, `FileTreeNode` e `buildFileTree` em `src/lib/skills.ts`.
- **Critérios de Aceite:**
  - [x] `registry.test.ts` existente passa sem edição.
  - [x] Novo teste: `getSkill(slug)` (fixture própria com `alpha`/`beta`, já que `mermaid-diagrams` não existe em `scripts/__fixtures__/valid/`) retorna `content`, `files`, `installCommands` completos e `skillsShUrl` correto; slug inexistente retorna `undefined`.
  - [x] `getSkillSlugs()` retorna só skills públicas (`hidden` excluída), sem duplicatas.
  - [x] `buildFileTree(["SKILL.md", "references/c4.md", "references/notes.md"])` produz 1 arquivo + 1 pasta com 2 filhos, na ordem de entrada; `buildFileTree(["SKILL.md"])` produz 1 nó só.
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam.

### Tarefa 2: Pipeline de Markdown (`renderSkillMarkdown`)
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1, T3
- **Descrição:** FR-004, FR-005, FR-008. Adicionar dependências (`unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-highlight`, `rehype-sanitize`, `rehype-stringify`; consultar Context7 antes de fixar versões). Implementar `src/lib/markdown.ts` com o schema de sanitização estendido para classes de highlight.
- **Critérios de Aceite:**
  - [x] Todos os casos do FR-008 passam via `node --test`.
  - [x] `renderSkillMarkdown` não lança para Markdown vazio ou só texto simples.
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam.

### Tarefa 3: `SkillBadges` e `SkillLinks`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1, T2
- **Descrição:** FR-009, FR-010. Componentes apresentacionais puros, recebendo tudo por props (não importam `lib/registry`).
- **Critérios de Aceite:**
  - [x] `SkillBadges`: 3 badges com rótulo e variante corretos para cada combinação de `status` (`stable`/`beta`/`draft`); versão sempre prefixada com `v`.
  - [x] `SkillLinks`: 2 links `target="_blank" rel="noopener noreferrer"`, ícones e nota de skills.sh presentes.
  - [x] `lint`/`typecheck` passam; sem hex direto.

### Tarefa 4: `SkillMarkdown` e `FileTree`
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1, T2
- **Paralelizável com:** nenhuma
- **Descrição:** FR-006, FR-007 (parte de componente), FR-011. `SkillMarkdown` chama `renderSkillMarkdown` e injeta o HTML sanitizado; `FileTree` renderiza `FileTreeNode[]` recursivamente com ícones Lucide.
- **Critérios de Aceite:**
  - [x] `SkillMarkdown` renderiza título, lista e bloco de código de um Markdown de exemplo (verificado por asserção em HTML renderizado via `react-dom/server` em teste, ou leitura cuidadosa do código — sem harness de componente neste app, mesma limitação das TASK05/06).
  - [x] `FileTree` renderiza aninhamento correto para uma árvore de 2 níveis; ícone de pasta difere do de arquivo.
  - [x] `eslint-disable` do `dangerouslySetInnerHTML` tem comentário explicando a sanitização. (Nenhuma regra de lint cobre `dangerouslySetInnerHTML` neste app; comentário explicativo presente em `skill-markdown.tsx` sem necessidade de disable.)
  - [x] `lint`/`typecheck` passam.

### Tarefa 5: Página `/s/[slug]`, estilos e integração
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1, T2, T3, T4
- **Paralelizável com:** nenhuma
- **Descrição:** FR-007 (import dos temas hljs em `globals.css`), FR-012 a FR-015. Montar `src/app/s/[slug]/page.tsx` compondo todos os componentes; `generateStaticParams`/`dynamicParams = false`; `generateMetadata`. Estilos `.skill-markdown` em `globals.css`.
- **Critérios de Aceite:**
  - [x] `pnpm turbo build --filter=@nico.dev/skills` (com `SKILLS_REF`/`SKILLS_ROOT` de teste) gera `out/s/<slug>/index.html` para cada skill pública, com título, badges, comando, Markdown renderizado e árvore de arquivos no HTML.
  - [x] Slug fora da lista não gera página (ausente em `out/s/`).
  - [x] `<title>` da página é `"<título> · Nico Skills"`.
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam.

### Tarefa 6: Verificação no navegador
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T5
- **Paralelizável com:** nenhuma
- **Descrição:** Build com `SKILLS_REF=feat/migrate-mermaid-pencil` (ou fixture com bloco de código, tabela e subpastas), servir `out/` localmente (guardar o PID, encerrar só ele ao final). Verificar: link da home leva à página certa; clique real nas 3 abas de instalação copia o comando certo (`--skill <slug>` na aba padrão); árvore de arquivos reflete `files[]` real; links de GitHub e skills.sh abrem a URL certa em nova aba; bloco de código colorido em claro e escuro; tabela sem overflow a 360 px; navegação por teclado (abas, links, árvore) com foco visível; axe-core (0 violações, claro e escuro, transições desligadas); voltar para a home funciona. Atualizar a spec só com o que foi de fato verificado; marcar TASK07 `done` no backlog somente se tudo passar.
- **Critérios de Aceite:**
  - [x] Navegação home → skill → home verificada com cliques reais.
  - [x] As 3 abas de instalação copiam o comando certo (interceptando `writeText`).
  - [x] Árvore de arquivos e links (GitHub/skills.sh) conferidos contra o `registry.json` real.
  - [x] Highlight de código legível e com contraste ok no tema real da máquina (escuro); ver ressalva de claro abaixo.
  - [x] axe-core sem violações; sem overflow horizontal a 360 px (incluindo tabela e bloco de código).
  - [x] Itens não verificáveis (ex.: leitor de tela real) listados no relatório e na spec.

---

## Verificação no navegador (2026-09-28)

Build com fixture própria de verificação (fora de `scripts/__fixtures__/`, para não acoplar os testes automatizados a conteúdo rico: 1 skill com bloco de código `ts`, tabela GFM, lista de tarefas e subpasta em `files`), `out/` servido localmente (Chrome real via extensão, PID do `serve` guardado e encerrado sozinho ao final, 2 vezes — 1ª rodada achou os 2 bugs abaixo, 2ª confirmou a correção).

- **Navegação real:** clique no card da home leva a `/s/demo-skill/` (`<title>Demo Skill · Nico Skills</title>`); link "← Todas as skills" volta para `/`.
- **Instalação:** as 3 abas (`Esta skill` padrão, `Repositório`, `Manual`) copiam exatamente `installCommands.skill`/`.repository`/`.manual` (interceptado `navigator.clipboard.writeText`).
- **Markdown:** título, `<code>` inline, bloco `<pre><code class="hljs language-ts">` com spans `hljs-*` coloridos, `<table>` GFM e lista de tarefas (`<input type="checkbox" checked disabled>`) renderizados; nenhum HTML/atributo malicioso sobrevive (conferido também pelos testes de `markdown.test.ts`).
- **Árvore de arquivos:** reflete `files[]` do `registry.json` real (`SKILL.md` + pasta `references/` com `guide.md`).
- **Links:** GitHub e skills.sh com `href` exatos (`.../tree/main/skills/demo-skill`, `https://www.skills.sh/robertourias/skills/demo-skill`), `target="_blank"` `rel="noopener noreferrer"`.
- **Teclado:** Tab percorre back-link → abas → comando/botão de copiar → GitHub → skills.sh, sem armadilha de foco; array de arquivos não é interativo (por design, FR-011), nada a tabular ali.
- **360 px:** testado via `<iframe width="360">` carregando a própria página (o `resize_window` da sessão não reduziu o viewport real do Chrome abaixo de ~1175 CSS px nesta máquina — devicePixelRatio 1.875 — então a checagem de overflow foi feita nesse viewport isolado): `scrollWidth` 347 < 359, sem overflow horizontal, badges/tags quebram linha, comando e bloco de código rolam na horizontal.
- **axe-core 4.10.2** (wcag2a/aa, wcag21a/aa, best-practice), transições desligadas, tema real da máquina (`prefers-color-scheme: dark`): **0 violações** após as 2 correções abaixo.

**Achados corrigidos nesta verificação:**
1. **`label` (crítico):** checkbox da lista de tarefas GFM (`- [x] ...`) sem nome acessível — `remark-gfm` gera `<input type="checkbox" disabled>` como irmão solto do texto, sem `<label>`. Corrigido com um plugin `rehypeLabelTaskListCheckboxes` (`src/lib/markdown.ts`), que roda antes do `rehype-sanitize` e copia o texto do `<li>` para `aria-label` do `<input>`; schema de sanitização estendido para preservar `ariaLabel` em `input` (novo teste em `markdown.test.ts`). Decisão registrada em `docs/context/decisions.md`.
2. **`color-contrast` (falso positivo, não é bug real):** ao testar alternando a classe `.dark` manualmente (sem poder emular `prefers-color-scheme` do SO nesta sessão), o container ficou com token de fundo claro enquanto o tema `.hljs` (fixo por media query real, não pela classe) continuava escuro — combinação que **não ocorre em uso real**, já que o script de tema (`layout.tsx`) mantém `.dark` sempre em sincronia com `prefers-color-scheme`. Sem alteração de código; documentado aqui para não ser reaberto por engano.

**Não verificado (limitações desta sessão):**
- Tema **claro** do highlight.js (`github.css`) ao vivo: a máquina de desenvolvimento está em `prefers-color-scheme: dark` e as ferramentas de navegador disponíveis não emulam o media query do SO. O tema real **escuro** passou no axe-core sem violações; o par claro usa a paleta oficial `github.css` (mesma família, alto contraste por padrão) — risco residual baixo, mas não confirmado por render real.
- Leitor de tela real (JAWS/NVDA/VoiceOver) — mesma limitação já registrada nas TASK05/06.
- Emulação de dispositivo de toque para `@media (hover: none)` — não aplicável a esta página (sem elementos hover-only, ao contrário da TASK05).

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->
