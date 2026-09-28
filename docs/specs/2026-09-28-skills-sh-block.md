# Spec &amp; Plan: Bloco "Encontre no skills.sh" na home (TASK08)

**Status:** approved **Data:** 2026-09-28
**Autor:** PLANNER (Claude)
**Backlog:** TASK08 em `docs/context/product-backlog.md`
**Depende de:** TASK05 (home, `docs/archive/2026-09-25-skills-home.md`), concluída

---

## 1. Problema e Visão Geral

O glossário do produto já registra a regra: "skills.sh: diretório externo; só lista uma skill depois que ela é instalada (telemetria anônima do CLI)". Isso significa que uma skill recém-publicada no catálogo **não aparece de imediato** no skills.sh — quem visita a home não sabe disso, nem sabe como procurar por lá quando a skill já estiver listada.

Esta tarefa entrega um bloco estático na home, depois da lista de skills (espaço já reservado pela TASK05), explicando essa demora e ensinando os três caminhos pra achar uma skill deste catálogo no skills.sh, com placeholders de captura de tela (as imagens reais dependem de skills já indexadas lá — fora do escopo desta tarefa, ver seção 4).

Decisões já tomadas com o usuário (2026-09-28): os três caminhos são **link direto** (a partir da página da skill), **busca pelo nome** no diretório skills.sh e **navegação pelo repositório** `robertourias/skills` no skills.sh; as 3 capturas nascem como placeholder visual (sem imagem real ainda).

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como visitante, quero entender por que não acho uma skill recém-instalada no skills.sh, pra não achar que é um bug.
- **P1 (crítico):** Como visitante, quero saber os três jeitos de procurar uma skill deste catálogo no skills.sh (link direto, busca, navegar pelo repositório), pra escolher o que for mais conveniente.
- **P2 (importante):** Como visitante, quero abrir o skills.sh direto do caminho "buscar" ou "navegar pelo repositório" com um clique, sem digitar a URL.
- **P3 (nice-to-have):** Como visitante de teclado ou leitor de tela, quero que o bloco e seus links sejam navegáveis e anunciados corretamente, mesmo com as imagens em placeholder.

---

## 3. Requisitos Funcionais

### Dados

- **FR-001:** `catalog.config.ts`: `skillsShConfig` ganha `repoUrl: `${baseUrl}/$`{repoConfig.slug}`` (ex.: https://www.skills.sh/robertourias/skills`) — URL da página do repositório no skills.sh, fonte única pro caminho "navegar pelo repositório". `baseUrl` (`https://www.skills.sh`) já existe e serve de link pro caminho "buscar pelo nome" (a home do diretório, onde fica a busca).

### Componente

- **FR-002:** Novo componente `src/components/skills-sh-block.tsx` (Server Component, sem `"use client"` — nada interativo). Sem props: importa `repoConfig`/`skillsShConfig` de `catalog.config.ts` diretamente (mesmo padrão de `src/app/page.tsx`, que já importa `siteConfig`). Estrutura:
  - `<h2>Encontre no skills.sh</h2>`.
  - Parágrafo de aviso (aviso de demora): "As skills deste catálogo também aparecem no diretório do [skills.sh](https://www.skills.sh/) — mas só depois de instaladas ao menos uma vez (o diretório é alimentado por telemetria anônima da CLI). Acabou de instalar? Pode levar um tempo até aparecer por lá." Link do `skills.sh` inline aponta pra `skillsShConfig.baseUrl`, `target="_blank" rel="noopener noreferrer"`.
  - `<ol>` com os 3 caminhos (FR-003), numerados pela própria semântica de lista ordenada (sem número redundante no texto).
- **FR-003:** Os três itens, cada um com rótulo, descrição curta e placeholder de captura (FR-004):
  1. **Link direto** — "Abra a página de qualquer skill neste catálogo e clique em **Ver no skills.sh**." (sem link próprio: é uma instrução sobre o `SkillLinks` que já existe em `/s/[slug]`, TASK07 — não duplica a URL aqui, que é por skill).
  2. **Buscar pelo nome** — "No skills.sh, use a busca do diretório e digite o nome da skill ou uma das tags." Link "Abrir skills.sh" para `skillsShConfig.baseUrl`.
  3. **Navegar pelo repositório** — "Abra a página do repositório `robertourias/skills` no skills.sh e veja todas as skills publicadas ali." Link "Abrir repositório no skills.sh" para `skillsShConfig.repoUrl` (FR-001).
  Links (itens 2 e 3): `target="_blank" rel="noopener noreferrer"`, mesmo padrão de `SkillLinks` (TASK07): ícone Lucide `ExternalLink` + texto visível, foco visível.
- **FR-004:** Placeholder de captura de tela (os 3 itens, incluindo o item 1 sem link): caixa com proporção fixa (`aspect-[4/3]`), `rounded-lg border border-border bg-surface-raised`, ícone Lucide `ImageOff` centralizado (cinza, `text-muted-foreground`) e texto pequeno "Captura em breve" (`text-xs text-muted-foreground`) — nunca um `<img>` quebrado. Comentário no código, acima de cada placeholder, descrevendo exatamente a tela que a captura real deve mostrar (pra quem for tirar o screenshot depois saber o enquadramento certo — ver FR-004a):
  - Item 1: a página `/s/[slug]` com o link "Ver no skills.sh" em destaque/circulado.
  - Item 2: a home do skills.sh com a busca preenchida com o nome de uma skill deste catálogo.
  - Item 3: a página do repositório `robertourias/skills` no skills.sh listando as skills.
- **FR-004a:** O placeholder não é `aria-hidden`: cada caixa recebe `role="img"` com `aria-label` descrevendo o que a captura mostrará quando existir (mesmo texto do comentário de FR-004, versão curta), pra não ficar mudo pra leitor de tela enquanto não há imagem real.
- **FR-005:** Layout responsivo: `grid grid-cols-1 sm:grid-cols-3 gap-4` pros 3 itens; empilhado abaixo de `sm`, em linha a partir de `sm`; sem overflow horizontal a 360 px. Largura do bloco consistente com o resto da home (`max-w-3xl`, já herdado do `<main>`).
- **FR-006:** Só tokens semânticos (sem hex); ícones Lucide; nenhuma dependência nova.

### Integração

- **FR-007:** `src/app/page.tsx`: substitui o comentário `{/* TASK08 insere "Encontre no skills.sh" após a lista. */}` por `<section aria-label="Encontre no skills.sh"><SkillsShBlock /></section>`, depois da `<section aria-label="Skills">`. Nenhuma outra mudança na página.

---

## 4. Fora do Escopo &amp; Riscos

- **Fora do Escopo:** capturas de tela reais do skills.sh (dependem de skills deste catálogo já indexadas lá, o que por sua vez depende de instalações reais — condição que só se cumpre depois do deploy, TASK09); rota `/skills-sh` com o guia completo (TASK11); tópicos (`/topic/[tag]`, TASK11); qualquer mudança em `/s/[slug]` (TASK07, já entrega o link "Ver no skills.sh" referenciado no item 1).
- **Premissa:** `skillsShConfig.skillUrl`/`baseUrl` (TASK02/TASK07) e o link "Ver no skills.sh" de `/s/[slug]` (TASK07) já existem e não mudam nesta tarefa.
- **Risco:** placeholder de imagem ficar esquecido depois que as capturas reais existirem → Mitigação: comentário no código (FR-004) documenta o enquadramento exato esperado, facilitando a troca; registrar como pendência em `docs/context/current-state.md` ao final.
- **Risco:** texto do aviso de demora ficar redundante com a nota já presente em `SkillLinks` (`/s/[slug]`) → Aceito: são contextos diferentes (home explica o conceito uma vez; a página da skill só lembra rapidamente), mesma ideia, textos não precisam ser idênticos palavra por palavra.
- **Risco:** `role="img"` num placeholder sem imagem real pode confundir leitor de tela quanto ao tipo de conteúdo → Mitigação: `aria-label` deixa claro que é uma prévia/placeholder ("captura de tela: em breve — ..."), verificado na checagem de navegador.

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contrato de dados e componente:

```ts
// catalog.config.ts — campo novo
export const skillsShConfig = {
  baseUrl: 'https://www.skills.sh',
  repoUrl: `https://www.skills.sh/${repoConfig.slug}`, // novo (FR-001)
  skillUrl: (slug: string) => `https://www.skills.sh/${repoConfig.slug}/${slug}`,
} as const;
```

```tsx
// src/components/skills-sh-block.tsx
function SkillsShBlock(): React.JSX.Element; // sem props
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução &amp; Dependências


| Onda | Tarefas (paralelas) | Pré-requisito |
| ---- | ------------------- | ------------- |
| 1    | T1                  | —             |
| 2    | T2                  | T1            |


> Regra: `/hands-on` percorre as ondas em ordem. Tarefa única por onda (escopo pequeno, sem paralelismo útil). Nunca usar `taskkill` por nome de processo; guardar o PID de servidores e encerrar só ele.

### Tarefa 1: `skillsShConfig.repoUrl` + `SkillsShBlock`

- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** nenhuma
- **Descrição:** FR-001 a FR-006. Adicionar `repoUrl` em `catalog.config.ts`. Criar `src/components/skills-sh-block.tsx` com o aviso, os 3 caminhos e os placeholders de captura.
- **Critérios de Aceite:**
  - [x] `skillsShConfig.repoUrl` igual a `https://www.skills.sh/robertourias/skills`.
  - [x] `SkillsShBlock` renderiza `<h2>`, o parágrafo de aviso com link pro skills.sh, e os 3 itens (rótulo + descrição + placeholder); itens 2 e 3 têm link `target="_blank" rel="noopener noreferrer"` pras URLs certas; item 1 não tem link.
  - [x] Cada placeholder tem `role="img"` e `aria-label` descrevendo a captura futura; nenhum `<img>` sem `src` válido.
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck` passam (sem teste dedicado — componente puramente apresentacional, mesmo padrão de `ascii-banner.tsx`/`stats.tsx`).

### Tarefa 2: Integração na home e verificação no navegador

- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** nenhuma
- **Descrição:** FR-007. Trocar o comentário de reserva em `page.tsx` pelo `<SkillsShBlock />`. Build de verificação (`pnpm turbo build --filter=@nico.dev/skills`, `SKILLS_ROOT`/`SKILLS_REF` de teste), servir `out/` localmente (guardar o PID, encerrar só ele ao final). Verificar no navegador: bloco aparece depois da lista; os 2 links abrem as URLs certas em nova aba; navegação por teclado com foco visível; leitor de tela — conferir ao menos por leitura do DOM (`role="img"`/`aria-label`) o que cada placeholder anuncia; axe-core (0 violações, claro e escuro, transições desligadas); sem overflow horizontal a 360 px (grid empilhado). Atualizar `docs/context/current-state.md` registrando a pendência das capturas reais (FR-004, achado do risco). Marcar TASK08 `done` no backlog só com tudo verde.
- **Critérios de Aceite:**
  - [x] Bloco visível na home, depois da lista de skills, no tema real da máquina (escuro); tema claro não verificado ao vivo (mesma limitação registrada na TASK07 — sem emulação de `prefers-color-scheme`).
  - [x] Os 2 links (busca, repositório) abrem as URLs corretas (conferido de verdade, com clique real: cada um abriu uma nova aba, fechada em seguida).
  - [x] Teclado alcança os 2 links com foco visível, na ordem esperada (`:focus-visible` confirmado nos dois).
  - [x] axe-core sem violações no tema real (escuro).
  - [x] Sem overflow horizontal a 360 px; grid empilha corretamente (verificado via iframe de 360px — `resize_window` não reduz o viewport real do Chrome nesta máquina, mesma limitação da TASK07).
  - [x] `pnpm --filter @nico.dev/skills run lint typecheck test` passam; `pnpm turbo build --filter=@nico.dev/skills` conclui.
  - [x] Pendência das capturas reais registrada em `docs/context/current-state.md`.

---

## Verificação no navegador (2026-09-28)

`out/` servido localmente (Chrome real via extensão, PID do `serve` guardado e encerrado sozinho ao final).

- **Bloco:** aparece depois da lista, os 3 itens (rótulo, descrição, placeholder) e o parágrafo de aviso conferidos por leitura do DOM renderizado.
- **Links:** os 2 (`Abrir skills.sh` → `https://www.skills.sh/`, `Abrir repositório no skills.sh` → `https://www.skills.sh/robertourias/skills`) clicados de verdade — cada um abriu uma aba nova (`target="_blank"` funcionando na prática, não só no atributo), fechadas em seguida.
- **Placeholders:** `role="img"` + `aria-label` descritivo presentes nos 3, conferidos via `querySelectorAll`.
- **Teclado:** Tab percorre link inline do aviso → "Abrir skills.sh" → "Abrir repositório no skills.sh", `:focus-visible` true em ambos.
- **axe-core 4.10.2** (wcag2a/aa, wcag21a/aa, best-practice), transições desligadas, tema real da máquina (`prefers-color-scheme: dark`): **0 violações**.
- **360 px:** via `<iframe width="360">` (mesma técnica da TASK07 — `resize_window` não reduz o viewport real do Chrome abaixo de ~1175 CSS px nesta máquina): sem overflow horizontal, grid dos 3 itens em 1 coluna (`gridTemplateColumns` computado como uma única faixa).

**Não verificado (limitações, mesmas da TASK07):**
- Tema **claro** ao vivo — máquina em `prefers-color-scheme: dark`, sem emulação disponível nas ferramentas desta sessão.
- Leitor de tela real.

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->