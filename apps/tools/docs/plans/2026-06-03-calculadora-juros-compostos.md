# Plano: Calculadora de Juros Compostos

**Spec:** `apps/tools/docs/specs/2026-06-03-calculadora-juros-compostos.md`
**Status:** ready
**Data:** 2026-06-03

---

## Contexto técnico

### Estado atual de `apps/tools`

- Estrutura de feature: `src/app/clt-pj/_components/` — componentes colocados junto à rota
- `src/lib/salary-calculator.ts` — lógica de cálculo separada da UI
- `src/components/tool-page-header.tsx` — header reutilizável por tool
- `page.tsx` home: array `tools` hardcoded; novas tools exigem entrada neste array

### Biblioteca de gráficos
Nenhuma instalada no monorepo. Escolha: **`recharts`** — amplamente usada com React, suporte a área empilhada nativo (`AreaChart + Area`), TypeScript-first, compatível com Next.js App Router via `"use client"`.

### Estrutura de arquivos adotada
Seguindo padrão existente (`clt-pj`): componentes em `src/app/juros-compostos/_components/`, lógica pura em `src/lib/compound-interest.ts`.

---

## Tarefas

---

## T-01: Instalar `recharts`

**Tipo:** chore
**Agente:** frontend

```bash
pnpm add recharts --filter @nico.dev/tools
```

`recharts` tem `react` e `react-dom` como peer deps — já satisfeitos.

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/tools build` passa após instalação.

---

## T-02: Lógica matemática pura — `src/lib/compound-interest.ts`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/lib/compound-interest.ts` com as seguintes funções e tipos:

```ts
export type RateUnit = 'monthly' | 'annual';
export type PeriodUnit = 'months' | 'years';

export interface CompoundInterestParams {
  principal: number;        // capital inicial (pode ser 0)
  rate: number;             // taxa de juros (ex: 0.01 = 1%)
  rateUnit: RateUnit;
  period: number;           // período
  periodUnit: PeriodUnit;
  monthlyContribution: number; // aporte mensal (0 em modo fixo)
}

export interface MonthlySnapshot {
  month: number;
  openingBalance: number;
  contribution: number;
  interest: number;
  closingBalance: number;
  cumulativeContributions: number;
  cumulativeInterest: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInvested: number;       // principal + soma aportes
  totalInterest: number;
  interestPercentage: number;  // totalInterest / totalInvested * 100
  months: number;              // período em meses (calculado)
  monthlyRate: number;         // taxa mensal efetiva
  snapshots: MonthlySnapshot[];
}

/** Converte taxa anual para mensal equivalente */
export function annualToMonthlyRate(annual: number): number {
  return Math.pow(1 + annual, 1 / 12) - 1;
}

/** Retorna período em meses */
export function toMonths(period: number, unit: PeriodUnit): number {
  return unit === 'years' ? period * 12 : period;
}

/** Cálculo principal — gera snapshots mês a mês */
export function calculateCompoundInterest(
  params: CompoundInterestParams
): CompoundInterestResult { ... }

/** Reduz snapshots para pontos anuais (para gráfico com > 120 meses) */
export function sampleAnnually(snapshots: MonthlySnapshot[]): MonthlySnapshot[] {
  return snapshots.filter((s) => s.month % 12 === 0 || s.month === snapshots.length);
}
```

**Regras do cálculo (`calculateCompoundInterest`):**
- Converter taxa se necessário: se `rateUnit === 'annual'`, usar `annualToMonthlyRate(rate)`
- Converter período: se `periodUnit === 'years'`, usar `period * 12`
- Loop mês a mês: `interest = openingBalance * monthlyRate`; `closingBalance = openingBalance + contribution + interest`
- `totalInvested = principal + monthlyContribution * months`
- Usar 10+ casas decimais intermediárias; arredondar apenas nos snapshots

**Critérios de aceite:**
- [ ] `calculateCompoundInterest({ principal: 10000, rate: 0.01, rateUnit: 'monthly', period: 12, periodUnit: 'months', monthlyContribution: 0 }).finalAmount` ≈ `R$ 11.268,25`
- [ ] Mesmo cálculo com `rateUnit: 'annual', rate: 0.12` produz resultado idêntico (taxa equivalente).
- [ ] Modo 2 com `principal: 0, monthlyContribution: 500, rate: 0.01, period: 24, periodUnit: 'months'` ≈ `R$ 13.486,68`.

---

## T-03: Hook `useCompoundInterest.ts`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_hooks/useCompoundInterest.ts`:

**Estado gerenciado:**
```ts
interface FormState {
  mode: 'fixed' | 'contributions';
  principal: string;          // string para permitir digitação livre
  monthlyContribution: string;
  rate: string;
  rateUnit: RateUnit;
  period: string;
  periodUnit: PeriodUnit;
}
```

**Responsabilidades:**
- Manter `FormState`
- Fazer parse dos campos string → number (aceita `,` e `.` como decimal)
- Derivar `CompoundInterestResult | null` via `useMemo` quando inputs válidos
- Expor `chartData` (snapshots completos ou amostrados anualmente se `months > 120`)
- Expor `isValid: boolean` (todos os campos numéricos > 0, exceto `principal` que pode ser 0)

**Critérios de aceite:**
- [ ] Alterar qualquer input atualiza o resultado sem delay perceptível.
- [ ] Input com vírgula (ex: `"1,5"`) é parsado corretamente como `1.5`.
- [ ] Input inválido (letras, vazio) deixa resultado como `null` sem quebrar.

---

## T-04: `InputForm.tsx` — formulário de inputs

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_components/InputForm.tsx`.

**Layout:**
```
[Tabs: Valor fixo | Com aportes]

Capital inicial     R$ [_________]
Aporte mensal       R$ [_________]   ← só visível no modo aportes
Taxa de juros       [_________] %   [mensal | anual]  ← toggle inline
Período             [_________]     [meses | anos]    ← toggle inline
```

**Componentes usados de `@nico.dev/ui`:** `Input`, `Label`, `Tabs` (ou toggle customizado se o Tabs existente não servir).

**Detalhes de UX:**
- Troca de modo (tabs) preserva os inputs comuns (capital, taxa, período)
- Toggles de unidade (mensal/anual, meses/anos) são botões pill adjacentes ao input
- Todos os inputs do tipo `text` com `inputMode="decimal"` para mobile keyboard correto

**Critérios de aceite:**
- [ ] Trocar de modo não limpa capital, taxa ou período.
- [ ] Toggle mensal/anual e meses/anos refletem no cálculo imediatamente.
- [ ] Em mobile, teclado numérico aparece nos campos de valor.

---

## T-05: `ResultSummary.tsx` — cards de resultado

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_components/ResultSummary.tsx`.

**Layout:** 3 ou 4 cards em grid:

| Card | Valor | Subtítulo |
|------|-------|-----------|
| Montante final | R$ XXX.XXX,XX | — |
| Capital investido | R$ XXX.XXX,XX | Principal + aportes |
| Juros acumulados | R$ XXX.XXX,XX | XX,X% do capital |
| (opcional) Taxa efetiva | X,XXXX% ao mês | — |

- Valores formatados via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Estado vazio (sem resultado ainda): cards com `—` ou `Skeleton`
- Juros em destaque visual (cor `text-primary` ou `text-text-highlight`)

**Critérios de aceite:**
- [ ] Cards renderizam sem erro quando `result === null`.
- [ ] Valores corretos para os dois modos.

---

## T-06: `EvolutionChart.tsx` — gráfico de área empilhada

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_components/EvolutionChart.tsx`.

**Biblioteca:** `recharts` — `AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `Legend`, `ResponsiveContainer`.

**Séries:**
- `capital` — capital inicial (linha flat) — cor: `var(--primary)`
- `contributions` — aportes acumulados (modo 2 apenas) — cor: `var(--secondary)` ou variante
- `interest` — juros acumulados — cor: `var(--color-text-highlight)`

**Implementação:**
```tsx
"use client"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// chartData vem do hook, já amostrado anualmente se > 120 meses
// Cada ponto: { month, principal, cumulativeContributions, cumulativeInterest }
```

**Tooltip:** exibe mês, saldo total, breakdown em R$ BRL.

**Eixo Y:** formatado em `k` (ex: `150k`) ou em R$ completo dependendo da magnitude.

**Critérios de aceite:**
- [ ] Gráfico renderiza para períodos de 1 a 600 meses sem erro.
- [ ] Quando > 120 meses, exibe pontos anuais (eixo X mostra anos).
- [ ] Modo 1 (sem aportes): série `contributions` não aparece.
- [ ] `ResponsiveContainer` adapta a largura ao container pai.

---

## T-07: `EvolutionTable.tsx` — tabela expansível

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_components/EvolutionTable.tsx`.

**Comportamento:**
- Fechada por padrão; toggle via botão "Ver detalhes mês a mês / Ocultar tabela"
- Quando `months > 60`: exibir apenas os 12 primeiros + 12 últimos meses + mensagem "... X meses omitidos para brevidade"
- Colunas: Mês, Saldo inicial, Aporte, Juros do mês, Saldo final (colunas BRL formatadas)
- Coluna Aporte só visível no modo 2

**Critérios de aceite:**
- [ ] Toggle abre/fecha tabela.
- [ ] Para 360 meses: exibe primeiros 12 + últimos 12, não os 360 (performance).
- [ ] Valores batem com os `snapshots` do cálculo.

---

## T-08: `CompoundInterestCalculator.tsx` — componente pai

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/_components/CompoundInterestCalculator.tsx`:

```tsx
"use client"

export function CompoundInterestCalculator() {
  const { formState, setField, result, chartData } = useCompoundInterest();

  return (
    <div className="flex flex-col gap-8">
      <InputForm state={formState} onChange={setField} />
      {result && (
        <>
          <ResultSummary result={result} />
          <EvolutionChart data={chartData} mode={formState.mode} />
          <EvolutionTable snapshots={result.snapshots} mode={formState.mode} />
        </>
      )}
    </div>
  );
}
```

**Critérios de aceite:**
- [ ] ResultSummary, Chart e Table só renderizam quando `result !== null`.
- [ ] Componente não quebra no SSR (todos os sub-componentes com `"use client"` ou seguros para SSR).

---

## T-09: Rota `src/app/juros-compostos/page.tsx`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/juros-compostos/page.tsx`:

```tsx
import type { Metadata } from "next"
import ToolPageHeader from "@/components/tool-page-header"
import { CompoundInterestCalculator } from "./_components/CompoundInterestCalculator"

export const metadata: Metadata = {
  title: "Calculadora de Juros Compostos | tools.nico.dev",
  description:
    "Simule o rendimento de investimentos com capital fixo ou aportes mensais. Visualize a evolução mês a mês com gráfico e tabela detalhada.",
}

export default function CompoundInterestPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Juros Compostos"
        description="Simule rendimentos com capital fixo ou aportes mensais. Taxa mensal ou anual, período em meses ou anos."
      />
      <CompoundInterestCalculator />
    </main>
  )
}
```

**Critérios de aceite:**
- [ ] Rota `/juros-compostos` acessível e renderiza sem erro.
- [ ] SSR passa sem erros (componentes client devidamente marcados).

---

## T-10: Registrar na home de tools

**Tipo:** feature
**Agente:** frontend

Adicionar entrada ao array `tools` em `apps/tools/src/app/page.tsx`:

```ts
{
  slug: "juros-compostos",
  name: "Juros Compostos",
  description: "Simule rendimento de investimentos com capital fixo ou aportes mensais. Gráfico e tabela detalhada.",
  icon: "📈",
  status: "active",
  href: "/juros-compostos",
},
```

Inserir antes da entrada `market` (mantém agrupamento temático de ferramentas financeiras).

**Critérios de aceite:**
- [ ] Card aparece na home com link funcional.
- [ ] Status `active` exibe o card clicável (sem badge "Em breve").

---

## Ordem de execução

```
T-01  instalar recharts                             (pré-requisito)
T-02  compound-interest.ts (lógica pura)            (depende de T-01 — base para tudo)
T-03  useCompoundInterest.ts (hook)                 (depende de T-02)
T-04  InputForm.tsx                                 (depende de T-03)
T-05  ResultSummary.tsx                             (depende de T-03, paralelo com T-04)
T-06  EvolutionChart.tsx                            (depende de T-03, paralelo)
T-07  EvolutionTable.tsx                            (depende de T-03, paralelo)
T-08  CompoundInterestCalculator.tsx               (depende de T-04 a T-07)
T-09  page.tsx                                      (depende de T-08)
T-10  home page.tsx                                 (depende de T-09)
```

---

## Riscos de implementação

| Risco | Mitigação |
|-------|-----------|
| `recharts` com SSR no Next.js App Router | Usar `dynamic(() => import('./EvolutionChart'), { ssr: false })` se hydration errors aparecerem |
| Arredondamento floating point acumulado | Loop com cálculo em alta precisão; arredondar só ao exibir |
| Tabela 600 linhas lenta | Mostrar primeiros + últimos 12; sem virtualização na v1 |
| `Intl.NumberFormat` locale no SSR vs cliente | Testar; se divergir, formatar apenas no cliente |
