# Spec: Header Compound Components — packages/ui

**Status:** approved
**Data:** 2026-06-03
**Autor:** planner

---

## Problema

Cada app do monorepo implementou seu próprio header de forma independente, com padrões visuais, tokens CSS e comportamentos incompatíveis entre si:

- `web-nico.dev.br`: `Navbar.tsx` — fixed, scroll-aware, nav central, i18n, drawer mobile, CSS vars Material-style
- `tools`: `SiteHeader.tsx` — mínimo: logo + ThemeToggle, Tailwind semântico
- `challenges`: sem header
- `blog`: `Header.astro` — sticky, hamburger, social links, ThemeToggle, CSS vars custom

Resultado: nenhuma consistência visual entre os subdomínios, lógica duplicada (ThemeToggle, mobile menu), e o contrato arquitetural de usar `@nico.dev/ui` em todos os apps está sendo ignorado no ponto mais visível da UI.

---

## Cenários de Usuário

- **P1 (crítico):** Como desenvolvedor do monorepo, quero importar `<Header>` de `@nico.dev/ui` em qualquer app e montar o header com compound components, para que todos os subdomínios tenham estrutura e comportamento consistentes sem duplicar código.
- **P1 (crítico):** Como usuário final, quero que ThemeToggle e menu mobile funcionem de forma idêntica em todos os subdomínios, para que a experiência não quebre ao navegar entre eles.
- **P2 (importante):** Como desenvolvedor, quero que o `web-nico.dev.br` continue com o comportamento scroll-aware (transparente → frosted glass), passando apenas `scrollAware` ao `<Header>`.
- **P2 (importante):** Como desenvolvedor do blog (Astro), quero usar o Header React como island (`client:load`), mantendo os social links e o toggle de sidebar como `Header.Actions` customizável.
- **P3 (nice-to-have):** Como designer do sistema, quero que todos os apps usem os mesmos tokens Tailwind canônicos definidos em `packages/config`, eliminando divergências de vocabulário CSS.

---

## Requisitos Funcionais

### Componentes

- **FR-001:** `packages/ui` exporta os seguintes componentes: `Header`, `Header.Logo`, `Header.Nav`, `NavLink`, `Header.Actions`, `Header.Menu`, `ThemeToggle`.
- **FR-002:** `Header` aceita prop `scrollAware?: boolean` — quando `true`, inicia com `position: fixed`, fundo transparente e padding `py-6`; ao scroll > 20px, transiciona para `bg-background/80 backdrop-blur-md py-4`.
- **FR-003:** `Header` usa `position: sticky top-0` por padrão (sem `scrollAware`).
- **FR-004:** `Header.Menu` é híbrido: gerencia próprio estado open/close por padrão; aceita `open` + `onOpenChange` para controle externo (padrão Radix). Renderiza o drawer com `children` dentro de si mesmo.
- **FR-005:** `Header.Menu` renderiza um `<button>` com ícone de hamburguer visível apenas em mobile (`lg:hidden`); o drawer aparece abaixo do header como menu vertical.
- **FR-006:** `NavLink` aceita `href`, `external?: boolean` e `active?: boolean`. Quando `external`, adiciona `target="_blank" rel="noopener noreferrer"`.
- **FR-007:** `ThemeToggle` lê e grava `localStorage['theme']`, aplica `dark` class no `<html>`, suporta SSR sem hydration mismatch (renderiza apenas após mount).
- **FR-008:** Todos os componentes usam exclusivamente os tokens Tailwind canônicos de `packages/config` (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-background/80`).

### Tokens Canônicos

- **FR-009:** `packages/config` exporta um Tailwind preset com os tokens semânticos canônicos do monorepo (light + dark mode via `.dark` class): `background`, `foreground`, `border`, `muted`, `muted-foreground`, `primary`, `primary-foreground`.
- **FR-010:** `apps/web-nico.dev.br`, `apps/blog`, `apps/tools`, `apps/challenges` e `apps/metronome` migram para consumir o preset de `packages/config` e remover definições de tokens locais que conflitem.

### Migração do Blog

- **FR-011:** `apps/blog` substitui `Header.astro` por um componente React `<BlogHeader client:load>` que consome `Header`, `Header.Logo`, `Header.Nav`, `NavLink`, `Header.Actions`, `ThemeToggle` e `Header.Menu` de `@nico.dev/ui`.
- **FR-012:** O `BlogHeader` preserva os social links (GitHub, LinkedIn, Twitter) via `Header.Actions` e o toggle de sidebar via `Header.Menu` com `onOpenChange` externo.

---

## API dos Componentes

```tsx
// Uso típico — tools / challenges
<Header>
  <Header.Logo href="/" label="tools.nico.dev" />
  <Header.Actions>
    <ThemeToggle />
  </Header.Actions>
</Header>

// Uso com nav e menu mobile — web / blog
<Header scrollAware>
  <Header.Logo href="/" label="Roberto Nicoletti" />
  <Header.Nav>
    <NavLink href="#about">Sobre</NavLink>
    <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
  </Header.Nav>
  <Header.Actions>
    <ThemeToggle />
  </Header.Actions>
  <Header.Menu>
    <NavLink href="#about">Sobre</NavLink>
    <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
  </Header.Menu>
</Header>

// Header.Menu controlado externamente — blog sidebar
<Header.Menu open={sidebarOpen} onOpenChange={setSidebarOpen}>
  {/* drawer content */}
</Header.Menu>
```

---

## Critérios de Sucesso

- [ ] `<Header>` importável de `@nico.dev/ui` e funcionando em `apps/tools` sem mudança visual observável.
- [ ] `apps/challenges` passa a ter header consistente com os demais.
- [ ] `apps/blog` usa React island para o header, mantendo social links e toggle de sidebar funcionando.
- [ ] `apps/web-nico.dev.br` usa `<Header scrollAware>` e o comportamento visual de scroll é idêntico ao atual.
- [ ] `ThemeToggle` funciona em todos os apps sem flash de tema (anti-FOUC).
- [ ] Todos os apps compilam sem erros de TypeScript após migração de tokens.
- [ ] Storybook (`apps/storybook`) tem story para cada componente do Header.

---

## Fora do Escopo

- `LocaleSwitcher` — componente i18n específico de `web-nico.dev.br`; não entra em `packages/ui` nesta iteração.
- Animações de entrada do drawer (slide/fade) — comportamento funcional apenas; animações são P3.
- Sub-menus (dropdown nav) — nenhum app usa hoje.
- Migração visual completa de `apps/web-nico.dev.br` para o preset canônico — apenas mapeamento dos tokens do header; outros tokens do app ficam para iteração futura.
- `Header.Breadcrumb` ou qualquer padrão além do header principal.

---

## Riscos e Premissas

- **Premissa:** `packages/ui` já está configurado como pacote React com Tailwind; o preset pode ser adicionado a `packages/config` sem quebrar builds existentes.
- **Premissa:** O blog (Astro) suporta React islands via `@astrojs/react` — já verificado (`ThemeToggle` e `BlogHome` já são islands React).
- **Risco:** Migração de tokens pode quebrar estilos em outras partes dos apps além do header. → Mitigação: migrar tokens apenas nos arquivos do header em cada app; não tocar CSS global de outros componentes nesta iteração.
- **Risco:** `scrollAware` + SSR pode gerar hydration mismatch (posição inicial indefinida no servidor). → Mitigação: servidor renderiza sempre o estado inicial (sem scroll), `useEffect` aplica a lógica de scroll apenas no cliente.
- **Risco:** Blog usa `CustomEvent('toggle-sidebar')` para desacoplar header da sidebar. Com `onOpenChange` externo no `Header.Menu`, o `BlogHeader` precisa manter esse despacho ou migrar para prop drilling/Context. → Mitigação: `BlogHeader` usa `onOpenChange` e internamente despacha o CustomEvent — compatibilidade mantida sem reescrever a sidebar.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
