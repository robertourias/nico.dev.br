# Plano Técnico: Calculadora CLT vs PJ

**Spec:** `.ai-core/specs/2026-05-19-clt-pj-calculator.md`
**Data:** 2026-05-19
**Status:** pronto para implementação

---

## Contexto técnico

- `apps/tools` é Next.js 16 com App Router e Tailwind v4 (`@tailwindcss/postcss`)
- `packages/ui` NÃO está nas dependências de `apps/tools` — precisa ser adicionado
- `apps/tools/globals.css` usa tokens Material You (`--color-primary`, `--on-surface`, etc.) diferentes dos tokens Pencil que `packages/ui` espera (`--foreground`, `--border`, `--ring`, etc.)
- `apps/tools/page.tsx` usa esses tokens com classes inline `text-[var(--color-primary)]` — precisam ser atualizados

A Tarefa 1 alinha `apps/tools` ao design system antes de qualquer nova tela ser construída.

---

## Ordem de execução

```
Tarefa 1 → Tarefa 2 → Tarefas 3+4 (podem ser paralelas)
                    → Tarefa 5
```

---

## Tarefa 1 — Integrar @nico.dev/ui em apps/tools

**Tipo:** chore  
**Agente:** frontend

Adicionar `@nico.dev/ui` como dependência workspace e migrar os tokens CSS para usar o design system Pencil. Isso é pré-requisito para todas as tarefas seguintes.

**Critérios de aceite:**
- [ ] `@nico.dev/ui: "workspace:*"` adicionado em `apps/tools/package.json > dependencies`
- [ ] `apps/tools/globals.css` substituído por um que importa `@nico.dev/ui/globals.css` via `@import "@nico.dev/ui/globals.css"` (ou por equivalente inline com os mesmos tokens)
- [ ] `@source` adicionado no globals.css para escanear `packages/ui/src/**/*.tsx` (necessário com Tailwind v4 que não segue symlinks de workspace — testar e ajustar o path relativo conforme estrutura)
- [ ] `apps/tools/src/app/page.tsx` atualizado: classes `text-[var(--color-X)]` (onde X é um token como primary, foreground) substituídas por tokens Tailwind do Pencil (`text-primary`, `text-foreground`, `text-muted-foreground`, `bg-surface`, `border-border`, etc.)
- [ ] Home page renderiza sem erros visuais com os novos tokens
- [ ] `pnpm dev --filter @nico.dev/tools` sobe sem erros de CSS

**Notas:**
- Tokens mapeados:
  - `var(--color-primary)` → `text-primary`
  - `var(--color-on-surface)` → `text-foreground`
  - `var(--color-on-surface-variant)` → `text-muted-foreground`
  - `var(--color-surface-container-low)` → `bg-surface` ou `bg-surface-raised` (verificar visualmente)
  - `var(--color-outline-variant)` → `border-border`
  - `var(--color-surface-container)` → `bg-muted`
- Se o import direto de `@nico.dev/ui/globals.css` causar conflito (importação duplicada do Tailwind), preferir copiar apenas o bloco de variáveis CSS e `@theme inline` do arquivo `packages/ui/src/globals.css`, sem o `@import "tailwindcss"` duplicado.
- Dark mode: `packages/ui` usa `.dark` class; `apps/tools/layout.tsx` já adiciona `dark` no `<html>` via script inline — compatível.

---

## Tarefa 2 — Lógica de cálculo pura (TypeScript)

**Tipo:** feature  
**Agente:** frontend

Criar utilitário com toda a lógica de cálculo CLT e PJ sem nenhuma dependência React. Será importado pela página.

**Arquivo:** `apps/tools/src/lib/salary-calculator.ts`

**Critérios de aceite:**
- [ ] Constante `INSS_BRACKETS` com as 4 faixas progressivas 2025 (FR-006)
- [ ] Constante `IRRF_BRACKETS` com as 5 faixas 2025 + dedução por dependente R$ 189,59 (FR-007)
- [ ] Constante `TAX_REGIMES` com alíquotas de MEI (fixo R$ 75,90), Simples III (6%), Simples V (15,5%), Lucro Presumido (17%) (FR-009)
- [ ] Função `calculateINSS(grossSalary: number): number` — cálculo progressivo com teto R$ 908,86
- [ ] Função `calculateIRRF(base: number): number` — cálculo progressivo com dedução
- [ ] Função `calculateCLT(input: CLTInput): CLTResult` — retorna breakdown completo (bruto, INSS, IRRF, outros descontos, líquido)
- [ ] Função `calculatePJ(input: PJInput): PJResult` — retorna breakdown (faturamento, imposto regime, INSS sócio, IRRF sócio, despesas, plano saúde, líquido)
- [ ] Função `estimateCLTEquivalent(pjNet: number): { gross: number; result: CLTResult }` — busca binária/iteração até líquido CLT ≈ pjNet (tolerância ±0,01)
- [ ] Função `estimatePJEquivalent(cltNet: number, pjConfig: PJConfig): { revenue: number; result: PJResult }` — busca binária para encontrar faturamento PJ equivalente
- [ ] Tipos TypeScript exportados: `CLTInput`, `CLTResult`, `PJInput`, `PJResult`, `TaxRegime`, `PJConfig`
- [ ] Teste manual verificável: CLT R$ 10.000 com 0 dependentes → INSS ≈ R$ 908,86 (teto), IRRF ≈ R$ 1.856,22, líquido ≈ R$ 7.234,92

**Notas:**
- `CLTInput`: `{ grossSalary: number; dependents: number; otherDeductions: number }`
- `PJInput`: `{ revenue: number; regime: TaxRegime; prolabore: number; fixedExpenses: number; healthInsurance: number }`
- `TaxRegime`: `"mei" | "simples-iii" | "simples-v" | "lucro-presumido"`
- A busca iterativa para equivalente usa bisseção: baixo=0, alto=salário*10, 50 iterações máx
- MEI tem limite de faturamento R$ 6.750/mês — exibir alerta informativo se faturamento PJ calculado ultrapassar isso, mas sem bloquear o cálculo

---

## Tarefa 3 — Componente ToolPageHeader

**Tipo:** feature  
**Agente:** frontend  
**Depende de:** Tarefa 1

Criar componente de cabeçalho reutilizável para todas as páginas de ferramentas.

**Arquivo:** `apps/tools/src/components/tool-page-header.tsx`

**Critérios de aceite:**
- [ ] Props: `{ name: string; description: string }` 
- [ ] Exibe: link "tools.nico.dev" com `href="/"` (âncora estilizada como breadcrumb / eyebrow), título (`name`) como `<h1>`, descrição como `<p>`
- [ ] Usa tokens Tailwind do Pencil (sem classes inline com var() direto)
- [ ] Visual consistente com o header atual da home page (`apps/tools/src/app/page.tsx`)

---

## Tarefa 4 — Página CLT vs PJ

**Tipo:** feature  
**Agente:** frontend  
**Depende de:** Tarefas 1, 2, 3

Implementar a página completa em `apps/tools/src/app/clt-pj/page.tsx`.

**Estrutura de arquivos:**
```
apps/tools/src/app/clt-pj/
  page.tsx         ← Server Component (metadata) + importa client page
  _components/
    calculator-form.tsx   ← "use client" — formulário + estado
    result-tables.tsx     ← tabelas lado a lado
    info-section.tsx      ← seção informativa estática
```

**Critérios de aceite:**

**Formulário (FR-001 a FR-005):**
- [ ] Duas seções "CLT" e "PJ" com campos conforme spec
- [ ] Select de regime tributário (MEI, Simples III, Simples V, Lucro Presumido)
- [ ] Input de pró-labore com default R$ 1.518 (salário mínimo)
- [ ] Botão "Calcular" ativo apenas se pelo menos um dos campos obrigatórios tiver valor
- [ ] Se só CLT preenchido → calcula PJ equivalente automaticamente
- [ ] Se só PJ preenchido → calcula CLT equivalente automaticamente
- [ ] Se ambos preenchidos → calcula ambos independentemente
- [ ] Botão "Refazer cálculo" aparece após o resultado, limpa tudo e esconde o resultado

**Resultado (FR-013 a FR-014):**
- [ ] Duas colunas lado a lado: CLT | PJ
- [ ] Linhas: Bruto, (−) INSS, (−) IRRF, (−) Impostos PJ (só PJ), (−) Despesas (só se preenchido), = Líquido
- [ ] Linha do "Líquido" com estilo destacado (negrito, cor primary)
- [ ] Rodapé com diferença absoluta (R$) e percentual entre os líquidos
- [ ] Badge "Equivalente estimado" + nota de premissa quando aplicável (FR-014)

**Seção informativa (FR-015):**
- [ ] Como funciona o cálculo CLT (INSS progressivo, IRRF, 13º/FGTS como contexto)
- [ ] Como funciona o cálculo PJ (regimes, pró-labore, carga tributária)
- [ ] Principais diferenças (FGTS, férias, 13º, previdência, riscos PJ)
- [ ] Nota de disclaimer: "Este cálculo é uma estimativa..."

**Header e navegação (FR-016, FR-017):**
- [ ] Usa `ToolPageHeader` com name="Calculadora CLT vs PJ" e description adequada
- [ ] Metadata da página: title e description corretamente definidos
- [ ] URL: `/clt-pj`

**Componentes de packages/ui utilizados:**
- `Input` — campos monetários e numéricos
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` — regime tributário
- `Button` — Calcular, Refazer cálculo
- `Card`, `CardHeader`, `CardTitle`, `CardContent` — containers das seções
- `Badge` — "Equivalente estimado"
- `FormGroup`, `Label` — wrapping dos campos com label
- `Alert` — aviso de MEI se faturamento > R$ 6.750

**Notas:**
- Os inputs monetários são `type="number"` ou `type="text"` com formatação? → Usar `type="number"` com `min="0"` e `step="0.01"` para simplicidade; placeholder com "Ex: 10000"
- Estado global da página com `useState` em `calculator-form.tsx`; resultado é derivado (calculado no submit, não em tempo real)
- Responsividade: formulário em coluna única em mobile; tabelas resultado em coluna única em mobile, lado a lado em sm+

---

## Tarefa 5 — Atualizar home page (card CLT vs PJ)

**Tipo:** chore  
**Agente:** frontend  
**Depende de:** Tarefa 4 (página precisa existir antes de linkar)

**Arquivo:** `apps/tools/src/app/page.tsx`

**Critérios de aceite:**
- [ ] Card com `slug: "salary-calculator"` transformado em `<Link href="/clt-pj">` (usando `next/link`)
- [ ] Badge "Em breve" removido do card
- [ ] Estilo do card: remover `opacity-60 cursor-not-allowed` e adicionar hover state (`hover:border-primary/50 transition-colors`)
- [ ] Os outros cards ainda mostram "Em breve" e permanecem desabilitados

---

## Riscos mapeados

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Import de `@nico.dev/ui/globals.css` duplica `@import "tailwindcss"` | Build quebra | Copiar apenas tokens CSS e @theme inline sem o @import do Tailwind |
| @source path para packages/ui errado | Classes dos componentes não geradas | Testar `pnpm build` e verificar; ajustar path relativo |
| Tokens Pencil diferentes dos tokens Material You da home | Home page perde estilos | Inspecionar visualmente após migração e corrigir classes inline |
| Cálculo do equivalente não converge | Loop infinito | Limite de 50 iterações + bisseção garantem convergência |
