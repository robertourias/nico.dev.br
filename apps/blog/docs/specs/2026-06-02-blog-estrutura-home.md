# Spec: Estrutura do Projeto Astro e Página Inicial

**Status:** approved
**Data:** 2026-06-02
**Autor:** planner

---

## Problema

O blog `blog.nico.dev.br` ainda não existe como aplicação. É necessário criar a estrutura base do projeto Astro e implementar a página inicial com navegação por categorias, exibição de posts e layout responsivo — fundação que desbloqueará todas as features subsequentes.

---

## Cenários de Usuário

- **P1 (crítico):** Como leitor, quero ver a lista de posts na página inicial agrupados por categoria, para encontrar conteúdo relevante rapidamente.
- **P1 (crítico):** Como leitor, quero filtrar posts clicando em uma categoria na sidebar, para ver apenas o conteúdo que me interessa.
- **P2 (importante):** Como leitor, quero que a lista carregue mais posts enquanto rolo a página (infinite scroll), para não esperar carregamento de página.
- **P2 (importante):** Como leitor no desktop, quero a sidebar de categorias sempre visível, para navegar sem perder o contexto.
- **P2 (importante):** Como leitor no mobile, quero abrir a sidebar como drawer ao tocar no botão, para não ocupar espaço útil na tela pequena.
- **P3 (nice-to-have):** Como leitor, quero alternar entre tema dark e light no header, para adaptar a leitura ao ambiente.

---

## Requisitos Funcionais

### Estrutura do Projeto

- **FR-001:** O projeto deve ser uma aplicação Astro com TypeScript habilitado, localizada em `apps/blog/`.
- **FR-002:** Posts devem ser arquivos `.md` em `src/content/posts/` com frontmatter obrigatório: `title`, `slug`, `date`, `category`, `status`, `featured`, `description`.
- **FR-003:** Categorias válidas: `tech` | `ia` | `organizacao` | `qualidade-de-vida` — definidas em código, não dinâmicas.
- **FR-004:** Posts com `status: archived` não devem aparecer em nenhuma listagem.
- **FR-005:** O projeto deve usar Tailwind CSS, shadcn/ui (React islands quando necessário) e Lucide React.
- **FR-006:** Os design tokens definidos em `docs/context/ui-guidelines.md` devem estar configurados no `tailwind.config`.

### Header

- **FR-007:** O header deve conter: logo/título do blog, links de redes sociais (ícones), toggle dark/light e botão para abrir a sidebar no mobile.
- **FR-008:** O header deve ser sticky (fixo no topo durante scroll).

### Sidebar

- **FR-009:** No desktop (≥ 1024px), a sidebar deve ser sempre visível à esquerda da listagem de posts.
- **FR-010:** No mobile (< 1024px), a sidebar deve ser um drawer que abre/fecha ao clicar no botão do header.
- **FR-011:** A sidebar deve listar todas as categorias com contagem de posts publicados em cada uma.
- **FR-012:** Clicar em uma categoria deve filtrar a listagem de posts client-side sem reload de página.
- **FR-013:** A sidebar deve exibir posts marcados como `featured: true` em uma seção "Favoritos".

### Listagem de Posts

- **FR-014:** A página inicial deve exibir posts com `status: published`, ordenados por `date` (mais recentes primeiro).
- **FR-015:** Cada card de post deve exibir: título, descrição, categoria (badge), data e tempo estimado de leitura.
- **FR-016:** A listagem deve implementar infinite scroll client-side com lote inicial de 10 posts e incrementos de 10.
- **FR-017:** Ao filtrar por categoria, o infinite scroll deve resetar para o início da lista filtrada.

---

## Critérios de Sucesso

- [ ] `apps/blog/` existe com estrutura Astro válida e build passa sem erros (`astro build`)
- [ ] Página inicial renderiza com header, sidebar e lista de posts
- [ ] Clicar em categoria na sidebar filtra posts sem reload
- [ ] Infinite scroll carrega mais posts ao chegar no fim da lista
- [ ] No desktop, sidebar sempre visível; no mobile, abre como drawer
- [ ] Toggle dark/light altera o tema e persiste entre navegações (localStorage)
- [ ] Post com `status: archived` não aparece na listagem
- [ ] Design tokens (cores, fontes, radius) aplicados corretamente

---

## Fora do Escopo

- Página individual de post (rota `/posts/[slug]`)
- Sistema de busca full-text
- Compartilhamento nas redes sociais
- Gerador de post para LinkedIn
- Slots de ads/Adsense/afiliados
- CMS ou painel de administração
- Integração com Turborepo (pode ser adicionada depois)

---

## Riscos e Premissas

- **Premissa:** shadcn/ui será portado para uso em Astro via React islands (`@astrojs/react`) — componentes interativos (drawer, toggle) precisam de `client:load` ou `client:visible`.
- **Premissa:** Infinite scroll é implementado com JavaScript puro ou biblioteca leve (sem TanStack Query — blog é estático).
- **Risco:** Configuração de Tailwind CSS v4 com Astro pode exigir plugin específico → Mitigação: usar `@tailwindcss/vite` conforme docs Astro.
- **Risco:** Fontes Fraunces e Instrument Sans precisam ser carregadas via `@astrojs/google-fonts` ou self-hosted → Mitigação: definir no `<head>` do layout base.

---

<!--
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
