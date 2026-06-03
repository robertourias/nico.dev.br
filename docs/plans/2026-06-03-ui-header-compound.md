# Plano: Header Compound Components — packages/ui

**Spec:** `docs/specs/2026-06-03-ui-header-compound.md`
**Status:** ready
**Data:** 2026-06-03

---

## Contexto Técnico

### Estado atual dos tokens

| App | Tokens | Dep @nico.dev/ui |
|-----|--------|-----------------|
| `apps/tools` | ✅ `@import "@nico.dev/ui/globals.css"` | ✅ |
| `apps/challenges` | ✅ `@import "@nico.dev/ui/globals.css"` | ✅ |
| `apps/blog` | ❌ vocab custom (`--color-bg`, `--color-text-heading`) + dark-default via className swap | ❌ |
| `apps/web-nico.dev.br` | ❌ Material Design vocab (`--on-surface`, `--surface`) | ❌ |

### Sistema de tokens (Tailwind v4)
FR-009 não requer novo arquivo em `packages/config` — Tailwind v4 usa CSS, não JS presets. O "preset canônico" já existe em `packages/ui/tokens.css` com `@theme inline`. Apps que `@import "@nico.dev/ui/globals.css"` obtêm o bridge automaticamente.

### Peculiaridade do blog
Blog usa **dark como padrão** (`document.documentElement.className = theme`). Sistema canônico usa `.dark` class para dark mode (light é padrão). A migração inverte: `:root` = light, `.dark` = dark. O script anti-FOUC e o ThemeToggle local devem ser atualizados.

### ThemeProvider de web-nico.dev.br
Já faz `classList.toggle("dark", ...)` — compatível com o ThemeToggle canônico. Só os nomes das CSS vars divergem.

---

## Tarefas

---

## T-01: packages/ui — ThemeToggle

**Tipo:** feature  
**Agente:** frontend

Criar `packages/ui/src/components/theme-toggle.tsx`.

**Comportamento:**
- Lê `localStorage['theme']` no mount; aplica `.dark` class no `<html>` se `theme === 'dark'`
- Toggle: inverte `.dark` class + persiste no `localStorage`
- SSR-safe: renderiza placeholder `<div className="w-9 h-9" />` antes do mount (evita hydration mismatch)
- Ícones: `Sun` / `Moon` de `lucide-react` (size 18)

**Interface:**
```tsx
export function ThemeToggle({ className }: { className?: string }): JSX.Element
```

**Classes Tailwind usadas:**
`flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent`

**Critérios de aceite:**
- [ ] Sem flash de tema (anti-FOUC): renderiza placeholder no servidor, aplica estado correto no primeiro `useEffect`.
- [ ] Persiste preferência em `localStorage['theme']`.
- [ ] Funciona em apps com Next.js (`"use client"`) e Astro (React island).

---

## T-02: packages/ui — NavLink

**Tipo:** feature  
**Agente:** frontend

Criar `packages/ui/src/components/nav-link.tsx`.

**Interface:**
```tsx
interface NavLinkProps {
  href: string
  external?: boolean
  active?: boolean
  className?: string
  children: React.ReactNode
}
export function NavLink(props: NavLinkProps): JSX.Element
```

**Comportamento:**
- `external={true}` → adiciona `target="_blank" rel="noopener noreferrer"`
- `active={true}` → aplica `text-foreground bg-accent` sobre os estilos base

**Classes base:** `text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors px-3 py-1.5 rounded-lg`

**Critérios de aceite:**
- [ ] Link externo abre em nova aba com `rel="noopener noreferrer"`.
- [ ] Estado `active` visualmente distinto do estado padrão.
- [ ] Aceita `className` para customização pontual.

---

## T-03: packages/ui — Header sub-components (Logo, Nav, Actions)

**Tipo:** feature  
**Agente:** frontend

Criar os três sub-componentes estruturais em `packages/ui/src/components/header.tsx` (mesmo arquivo do T-05, ou arquivo separado por sub-componente — decisão do agente).

**Header.Logo:**
```tsx
interface HeaderLogoProps {
  href: string
  label: string
  className?: string
}
```
Renderiza `<a href={href}>` com `font-semibold text-sm text-foreground shrink-0 hover:text-primary transition-colors`.

**Header.Nav:**
```tsx
interface HeaderNavProps { children: React.ReactNode; className?: string }
```
Renderiza `<nav>` com `hidden lg:flex items-center gap-1`. Contém `NavLink` filhos.

**Header.Actions:**
```tsx
interface HeaderActionsProps { children: React.ReactNode; className?: string }
```
Renderiza `<div>` com `flex items-center gap-1 ml-auto`. Contém ThemeToggle, ícones sociais, etc.

**Critérios de aceite:**
- [ ] Header.Nav oculto no mobile (`lg:hidden`).
- [ ] Header.Actions alinhado à direita automaticamente via `ml-auto`.

---

## T-04: packages/ui — Header.Menu (híbrido)

**Tipo:** feature  
**Agente:** frontend

Criar `packages/ui/src/components/header-menu.tsx`.

**Interface:**
```tsx
interface HeaderMenuProps {
  children: React.ReactNode
  open?: boolean                      // controlled
  onOpenChange?: (open: boolean) => void  // controlled callback
  triggerClassName?: string
  className?: string
}
```

**Comportamento:**
- Se `open` e `onOpenChange` não fornecidos: gerencia estado interno (`useState`).
- Se `open` e `onOpenChange` fornecidos: opera em modo controlado.
- Renderiza `<button>` hamburguer (`Menu` de lucide-react, size 18) visível apenas `lg:hidden`.
- Quando aberto: renderiza drawer `<div>` com `absolute left-0 right-0 border-b border-border bg-background py-4 px-4 flex flex-col gap-1`.
- Drawer posicionado relativamente ao `<Header>` — o Header root deve ter `relative` no seu wrapper.

**Critérios de aceite:**
- [ ] Modo uncontrolled: abre/fecha ao clicar no hamburguer.
- [ ] Modo controlled: respeita `open` externo; chama `onOpenChange` ao clicar.
- [ ] Hamburguer invisível em `lg:` (desktop).
- [ ] Drawer não renderizado no DOM quando fechado (usa renderização condicional, não `display: none`).

---

## T-05: packages/ui — Header root compound

**Tipo:** feature  
**Agente:** frontend

Criar / completar `packages/ui/src/components/header.tsx` com o componente raiz e a montagem do compound.

**Interface:**
```tsx
interface HeaderProps {
  children: React.ReactNode
  scrollAware?: boolean
  className?: string
}
```

**Comportamento sem `scrollAware`:**
```
position: sticky top-0 z-50
flex items-center px-4 h-14 gap-3
border-b border-border
bg-background/80 backdrop-blur-md
```

**Comportamento com `scrollAware={true}`:**
- `position: fixed top-0 w-full z-50 transition-all duration-300`
- Estado inicial: `py-6 bg-transparent`
- Após scroll > 20px: `py-4 bg-background/80 backdrop-blur-md border-b border-border`
- `useEffect` com listener `window.scroll`. SSR: render no estado inicial (sem scroll).

**Compound final:**
```tsx
Header.Logo = HeaderLogo
Header.Nav = HeaderNav
Header.Actions = HeaderActions
Header.Menu = HeaderMenu
```

**Critérios de aceite:**
- [ ] Sem `scrollAware`: sticky, sempre visível com fundo frosted.
- [ ] Com `scrollAware`: transparente no topo, frosted após scroll de 20px.
- [ ] Compound sub-components acessíveis via `Header.Logo`, `Header.Nav`, etc.
- [ ] Sem hydration mismatch no modo `scrollAware` (state inicial = sem scroll).

---

## T-06: packages/ui — Atualizar exports

**Tipo:** chore  
**Agente:** frontend

Atualizar `packages/ui/src/index.ts`:

```ts
// Components — Navigation (seção já existente)
export * from "./components/tabs";
export * from "./components/toggle-filter";
// adicionar:
export * from "./components/nav-link";
export * from "./components/header";
export * from "./components/header-menu";   // se arquivo separado
export * from "./components/theme-toggle";
```

**Critérios de aceite:**
- [ ] `import { Header, NavLink, ThemeToggle } from "@nico.dev/ui"` funciona sem erro de TypeScript.

---

## T-07: apps/storybook — Stories do Header

**Tipo:** feature  
**Agente:** frontend

Criar stories em `apps/storybook/stories/Header.stories.tsx`.

**Stories obrigatórias:**
1. `Header/Minimal` — Logo + ThemeToggle
2. `Header/WithNav` — Logo + Nav com 3 NavLinks + Actions com ThemeToggle
3. `Header/WithMenu` — Logo + Nav + Actions + Menu mobile com links
4. `Header/ScrollAware` — mesmo que WithNav mas com `scrollAware` (nota: em Storybook estático pode ser demonstrado via controls)
5. `NavLink/States` — default, active, external

**Critérios de aceite:**
- [ ] Todas as 5 stories renderizam sem erro no Storybook.
- [ ] `ThemeToggle` alternável nas stories.

---

## T-08: apps/blog — Migração de tokens

**Tipo:** chore  
**Agente:** frontend

**8a. Adicionar `@nico.dev/ui` como dependência:**

Em `apps/blog/package.json`:
```json
"dependencies": {
  "@nico.dev/ui": "workspace:*",
  ...
}
```

**8b. Migrar `apps/blog/src/styles/global.css`:**

Substituir o conteúdo atual pelo padrão canônico, preservando a estética do blog:

```css
@import "tailwindcss";
@import "@nico.dev/ui/tokens.css";  /* bridge @theme inline canônico */

/* ─── Blog palette override ─────────────────────────── */
/* Light mode (creme quente) — padrão canônico: :root = light */
:root {
  --background: #f2ede4;
  --foreground: #1c1824;
  --surface: #e8e2d8;
  --muted-foreground: #5c5670;
  --border: rgba(28, 24, 36, 0.08);
  --primary: #5c3fc4;
}

/* Dark mode — ativado via .dark class (canônico) */
.dark {
  --background: #0a0a0f;
  --foreground: #f0efe8;
  --surface: #111118;
  --muted-foreground: #888898;
  --border: rgba(255, 255, 255, 0.08);
  --primary: #7b61ff;
}

/* Tokens exclusivos do blog (não no sistema canônico) */
@theme inline {
  --color-text-highlight: #e8c547;
  --font-heading: 'Fraunces', serif;
  --font-body: 'Instrument Sans', sans-serif;
  --radius-card: 16px;
}
/* Light override para highlight */
:root { --color-text-highlight: #9a7a1a; }
.dark  { --color-text-highlight: #e8c547; }

/* Base */
html { color-scheme: light dark; }
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}
```

**8c. Atualizar anti-FOUC script em `apps/blog/src/layouts/BaseLayout.astro`:**

```js
// antes (className swap, dark-default):
document.documentElement.className = theme;

// depois (canonical .dark class):
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'dark' || (!saved && prefersDark)) {
  document.documentElement.classList.add('dark');
}
```

Remover `class="dark"` do `<html>` estático (deixar sem class; script aplica se necessário).

**8d. Atualizar componentes do blog que usam vars antigas:**

Localizar usos de `var(--color-bg)`, `var(--color-text-heading)`, `var(--color-text-body)`, `var(--color-bg-card)` nos componentes React do blog e migrar para `var(--background)`, `var(--foreground)`, `var(--muted-foreground)`, `var(--surface)`.

> Nota: componentes Astro (`.astro`) fora do Header.astro podem ser atualizados gradualmente — não bloqueiam esta tarefa.

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/blog typecheck` passa sem erros.
- [ ] `pnpm --filter @nico.dev/blog build` compila sem erros.
- [ ] Visual do blog em dark mode idêntico ao atual.
- [ ] ThemeToggle do blog alterna entre dark/light preservando o visual.

---

## T-09: apps/blog — BlogHeader React island

**Tipo:** feature  
**Agente:** frontend

Criar `apps/blog/src/components/BlogHeader.tsx`:

```tsx
"use client";  // não necessário no Astro mas inofensivo

import { Header, NavLink, ThemeToggle } from '@nico.dev/ui';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { SITE, SOCIAL } from '@/config';

export function BlogHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleMenuChange(open: boolean) {
    setSidebarOpen(open);
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  }

  return (
    <Header>
      <Header.Menu open={sidebarOpen} onOpenChange={handleMenuChange}>
        <NavLink href="https://nico.dev.br/" external>nico.dev.br</NavLink>
        <NavLink href="https://tools.nico.dev.br/" external>tools</NavLink>
      </Header.Menu>

      <Header.Logo href="/" label={SITE.name} />

      <Header.Nav>
        <NavLink href="https://nico.dev.br/" external>nico.dev.br</NavLink>
        <NavLink href="https://tools.nico.dev.br/" external>tools</NavLink>
      </Header.Nav>

      <Header.Actions>
        <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
           className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Github size={18} />
        </a>
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
           className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Linkedin size={18} />
        </a>
        <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
           className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Twitter size={18} />
        </a>
        <div className="w-px h-4 mx-1 bg-border shrink-0" />
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
```

Atualizar `apps/blog/src/layouts/BaseLayout.astro`:
- Substituir `<Header ... />` (Astro component) por `<BlogHeader client:load />`
- Importar de `@/components/BlogHeader`

Deletar `apps/blog/src/components/Header.astro`.

**Critérios de aceite:**
- [ ] Header renderiza em todas as páginas do blog.
- [ ] Hamburguer mobile abre CategorySidebar (via CustomEvent).
- [ ] Social links abrem em nova aba.
- [ ] ThemeToggle alterna tema corretamente.
- [ ] Sem hydration mismatch (ThemeToggle placeholder no servidor).

---

## T-10: apps/tools — Migrar SiteHeader

**Tipo:** refactor  
**Agente:** frontend

Substituir `apps/tools/src/components/site-header.tsx`:

```tsx
import { Header, ThemeToggle } from '@nico.dev/ui';

export function SiteHeader() {
  return (
    <Header>
      <Header.Logo href="/" label="tools.nico.dev" />
      <Header.Actions>
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
```

Tokens já canônicos — sem alteração de CSS necessária.

**Critérios de aceite:**
- [ ] Visual idêntico ao atual (logo esquerda, ThemeToggle direita).
- [ ] `pnpm --filter @nico.dev/tools build` passa.

---

## T-11: apps/challenges — Adicionar Header

**Tipo:** feature  
**Agente:** frontend

Criar `apps/challenges/src/components/site-header.tsx`:

```tsx
import { Header, ThemeToggle } from '@nico.dev/ui';

export function SiteHeader() {
  return (
    <Header>
      <Header.Logo href="/" label="challenges.nico.dev" />
      <Header.Actions>
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
```

Atualizar `apps/challenges/src/app/layout.tsx` para incluir `<SiteHeader />` antes do `{children}`.

Tokens já canônicos — sem alteração de CSS necessária.

**Critérios de aceite:**
- [ ] Header visível em todas as páginas de challenges.
- [ ] `pnpm --filter @nico.dev/challenges build` passa.

---

## T-12: apps/web-nico.dev.br — Migração parcial (header only)

**Tipo:** refactor  
**Agente:** frontend

**12a. Adicionar `@nico.dev/ui` como dependência:**

Em `apps/web-nico.dev.br/package.json` → `dependencies`:
```json
"@nico.dev/ui": "workspace:*"
```

**12b. Adicionar aliases canônicos em `globals.css`:**

Não importar `@nico.dev/ui/globals.css` (evita sobrescrever paleta Material). Em vez disso, adicionar aliases no bloco `:root` e `.dark` existentes:

```css
/* Canonical aliases — usados por @nico.dev/ui Header components */
:root {
  /* ... vars Material existentes ... */
  --background: var(--surface);
  --foreground: var(--on-surface);
  --border: var(--outline-variant);
  --muted-foreground: var(--on-surface-variant);
  --accent: var(--surface-container);
  --accent-foreground: var(--on-surface);
}
:root.dark {
  /* ... dark Material vars existentes ... */
  --background: var(--surface);
  --foreground: var(--on-surface);
  --border: var(--outline-variant);
  --muted-foreground: var(--on-surface-variant);
  --accent: var(--surface-container);
  --accent-foreground: var(--on-surface);
}
```

Adicionar também o `@theme inline` bridge para Tailwind gerar as classes `bg-background`, `text-foreground`, etc.:

```css
@theme inline {
  /* ... @theme inline existente ... */
  /* Canonical aliases */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
}
```

**12c. Criar `apps/web-nico.dev.br/src/components/SiteHeader.tsx`:**

```tsx
"use client";
import { Header, NavLink, ThemeToggle } from '@nico.dev/ui';
import { useTheme } from './ThemeProvider';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

export function SiteHeader() {
  const { toggleTheme } = useTheme(); // mantém ThemeProvider existente como controlador
  const locale = useLocale();
  const t = useTranslations('nav');

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#skills', label: t('skills') },
    { href: '#projects', label: t('projects') },
    { href: '#contact', label: t('contact') },
    { href: `/${locale}/curriculo`, label: t('resume') },
    { href: 'https://blog.nico.dev.br/', label: t('blog'), external: true },
  ];

  return (
    <Header scrollAware>
      <Header.Logo href={`/${locale}/`} label="Roberto Nicoletti" />
      <Header.Nav>
        {navLinks.map(link => (
          <NavLink key={link.href} href={link.href} external={link.external}>
            {link.label}
          </NavLink>
        ))}
      </Header.Nav>
      <Header.Actions>
        <LocaleSwitcher />
        <ThemeToggle />
      </Header.Actions>
      <Header.Menu>
        {navLinks.map(link => (
          <NavLink key={link.href} href={link.href} external={link.external}>
            {link.label}
          </NavLink>
        ))}
      </Header.Menu>
    </Header>
  );
}
```

> Nota: `ThemeToggle` de `@nico.dev/ui` opera via `.dark` class; `ThemeProvider` também usa `.dark` class → compatíveis. O scroll suave para âncoras (`scrollIntoView`) que estava em `Navbar.tsx` é movido para um `useEffect` no `NavLink` ou para um wrapper separado — fora do escopo desta tarefa.

**12d. Atualizar layout / componente que usa `Navbar.tsx`** para usar `SiteHeader` no lugar.

**Critérios de aceite:**
- [ ] Header com scroll-aware visualmente idêntico ao `Navbar.tsx` atual.
- [ ] Nav links visíveis no desktop, hamburguer no mobile.
- [ ] LocaleSwitcher funciona.
- [ ] ThemeToggle alterna tema.
- [ ] `pnpm --filter @nico.dev/web-nico.dev.br build` passa.

---

## Ordem de execução recomendada

```
T-01 → T-02 → T-03 → T-04 → T-05 → T-06   (packages/ui — sequencial, cada um depende do anterior)
T-07                                          (storybook — após T-06)
T-08 → T-09                                  (blog token migration antes do BlogHeader)
T-10, T-11                                   (podem ser paralelos — sem dependências entre si)
T-12                                         (web — mais complexo, por último)
```

---

## Riscos de implementação

| Risco | Onde | Mitigação |
|-------|------|-----------|
| `bg-background/80` não funciona no blog sem `@theme inline` correto | T-08 | Verificar que `@import "@nico.dev/ui/tokens.css"` traz o `@theme inline` bridge |
| Scroll suave de âncoras de `Navbar.tsx` não migrado | T-12 | Documentado como fora do escopo; criar issue de follow-up |
| Blog sidebar via CustomEvent pode ter race condition com `onOpenChange` | T-09 | Testar hamburger em mobile antes de marcar como concluído |
| `apps/web` build quebra por CSS circular (Material vars referenciando canonical aliases) | T-12 | Usar valores absolutos nos aliases se `var(--surface)` criar loop |
