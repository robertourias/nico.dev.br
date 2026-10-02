# Spec & Plan: Renda Efetiva Mensal x Completa nos resultados de clt-pj

**Status:** approved
**Aprovado por:** Roberto Nicoletti em 2026-10-02
**Data:** 2026-10-02
**Autor:** Claude (planner)

---

## 1. Problema e Visão Geral

Nos três modos da página `/clt-pj` do app tools (CLT vs PJ, PJ vs PJ, CLT vs CLT), cada cartão de resultado termina em uma única linha "Renda Efetiva". No lado CLT, esse total soma FGTS, 13º e abono de férias (proporção mensal) — valores que não entram na conta bancária todo mês. O usuário não enxerga quanto realmente recebe no mês.

Esta Spec renomeia o total atual para "Renda Efetiva Completa" e acrescenta, imediatamente acima dele, a linha "Renda Efetiva Mensal": líquido + benefícios recebidos no mês (VA, VT, outros), **sem** FGTS, 13º e abono de férias. A comparação entre propostas ("é mais vantajoso") e a equivalência continuam usando a renda completa, sem mudança.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como usuário comparando propostas CLT, quero ver a renda mensal sem FGTS/13º/abono, para saber o valor real que cai na conta.
- **P2 (importante):** Como usuário, quero que o total antigo seja claramente rotulado "Completa", para não confundir com a renda mensal.

---

## 3. Requisitos Funcionais

- **FR-001:** `salary-calculator.ts` exporta `cltMonthlyEffectiveIncome(clt: CLTResult): number` = `round(netSalary + va + vt + otherBenefits)` (exclui `fgts`, `decimoTerceiro`, `abonoFerias`). `effectiveIncome` não muda.
- **FR-002:** `ResultCard` aceita prop opcional `monthlyTotal?: number`. Quando informada **e** diferente de `total`, renderiza no `<tfoot>`, imediatamente antes do total, uma linha "Renda Efetiva Mensal" com `formatBRL(monthlyTotal)`, visualmente secundária ao total.
- **FR-003:** Todo `totalLabel` de cartão de resultado em `/clt-pj` passa a ser "Renda Efetiva Completa" ("Renda Efetiva", "Renda Efetiva CLT" e "Renda Efetiva PJ" deixam de existir).
- **FR-004:** Cartões CLT dos três modos (CLT vs PJ, CLT vs CLT A e B) passam `monthlyTotal={cltMonthlyEffectiveIncome(...)}`.
- **FR-005:** Cartões PJ (PJ vs PJ A/B e PJ do CLT vs PJ) não exibem a linha Mensal: PJ não tem FGTS/13º/abono, então Mensal = Completa (FR-002 oculta a linha quando iguais).
- **FR-006:** Nenhuma outra lógica muda: diferença/"mais vantajoso", painel de equivalência e card informativo pré-cálculo seguem baseados em `effectiveIncome`.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** mudar a base da comparação para a renda mensal; alterar textos "mesma renda efetiva" do painel de equivalência; linha Mensal para PJ.
- **Premissa:** "Renda Efetiva Mensão" no pedido = "Renda Efetiva Mensal". "Benefícios que não são valor efetivo" = FGTS, 13º e abono de férias; VA, VT e outros benefícios contam como recebidos no mês.
- **Premissa:** o 13º e o abono de férias entram como proporção mensal, já assim no cartão atual.
- **Risco:** o app tools não tem runner de teste nem script `typecheck` → Mitigação: lógica em função pura (FR-001); verificação por `lint`, `build` (que roda type-check do Next) e conferência manual no navegador. Critérios de lógica ficam como Pendência Manual se o agente não conseguir abrir navegador.

---

## 5. Contratos de API (Se aplicável)

Não se aplica (client-side). Contrato de componente:

```ts
// salary-calculator.ts
export function cltMonthlyEffectiveIncome(clt: CLTResult): number
// result-tables.tsx
interface ResultCardProps { /* existentes */ monthlyTotal?: number }
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1                  | —             |
| 2    | T2, T3              | T1            |

### Tarefa 1: Helper, ResultCard e aba CLT vs PJ
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** —
- **Paralelizável com:** nenhuma
- **Arquivos:** `apps/tools/src/lib/salary-calculator.ts`, `apps/tools/src/app/clt-pj/_components/result-tables.tsx`
- **Cobre:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
- **Descrição:** Adicionar `cltMonthlyEffectiveIncome`. Em `ResultCard`, nova prop `monthlyTotal?` e linha "Renda Efetiva Mensal" antes do total (só se definida e `!== total`). Em `ResultTables`: `totalLabel="Renda Efetiva Completa"` nos dois cartões; cartão CLT passa `monthlyTotal`; cartão PJ não passa.
- **Critérios de Aceite:**
  - [ ] Dado CLT com bruto, VA, VT e outros benefícios, quando se avalia `cltMonthlyEffectiveIncome`, então retorna `netSalary + va + vt + otherBenefits` (sem FGTS/13º/abono) e `effectiveIncome` segue igual ao atual. — cobre FR-001, verificado por conferência manual com valores conhecidos (sem runner de teste no app)
  - [ ] Dado resultado CLT vs PJ calculado, quando a página renderiza, então o cartão CLT mostra "Renda Efetiva Mensal" acima de "Renda Efetiva Completa" e o cartão PJ mostra só "Renda Efetiva Completa". — cobre FR-002, FR-003, FR-004, FR-005, verificado por conferência manual no navegador
  - [ ] Dado resultado calculado, quando exibido, então "mais vantajoso" e painel de equivalência mantêm os mesmos valores de antes. — cobre FR-006, verificado por conferência manual antes/depois
  - [ ] `pnpm --filter @nico.dev/tools lint` e `pnpm --filter @nico.dev/tools build` passam sem erros novos. — cobre FR-001 a FR-003, verificado pelos próprios comandos

### Tarefa 2: Aba CLT vs CLT
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** T3
- **Arquivos:** `apps/tools/src/app/clt-pj/_components/calculator-clt-clt.tsx`
- **Cobre:** FR-003, FR-004
- **Descrição:** Nos dois `ResultCard`, `totalLabel="Renda Efetiva Completa"` e `monthlyTotal={cltMonthlyEffectiveIncome(result.a | result.b)}`.
- **Critérios de Aceite:**
  - [ ] Dado CLT vs CLT calculado com VA/VT diferentes entre A e B, quando renderiza, então cada cartão mostra Mensal (sem FGTS/13º/abono) acima de Completa. — cobre FR-003, FR-004, verificado por conferência manual no navegador
  - [ ] `pnpm --filter @nico.dev/tools lint` passa. — cobre FR-003, verificado pelo comando

### Tarefa 3: Aba PJ vs PJ
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** T2
- **Arquivos:** `apps/tools/src/app/clt-pj/_components/calculator-pj-pj.tsx`
- **Cobre:** FR-003, FR-005
- **Descrição:** Nos dois `ResultCard`, `totalLabel="Renda Efetiva Completa"`; sem `monthlyTotal`.
- **Critérios de Aceite:**
  - [ ] Dado PJ vs PJ calculado, quando renderiza, então os cartões mostram "Renda Efetiva Completa" e nenhuma linha "Renda Efetiva Mensal". — cobre FR-003, FR-005, verificado por conferência manual no navegador
  - [ ] `pnpm --filter @nico.dev/tools lint` passa. — cobre FR-003, verificado pelo comando

---

## 7. Rastreabilidade

| FR | Coberto por | Verificado por |
|----|-------------|-----------------|
| FR-001 | T1 | conferência manual + `lint`/`build` |
| FR-002 | T1 | conferência manual no navegador |
| FR-003 | T1, T2, T3 | `lint`/`build` + conferência manual |
| FR-004 | T1, T2 | conferência manual no navegador |
| FR-005 | T1, T3 | conferência manual no navegador |
| FR-006 | T1 | conferência manual antes/depois |

---

## 8. Verificação

| O quê | Comando | Saída esperada |
|-------|---------|----------------|
| Type-check | (não configurado) em `apps/tools`; coberto por `pnpm --filter @nico.dev/tools build` | sem erros |
| Lint | `pnpm --filter @nico.dev/tools lint` | sem erros novos |
| Testes | (não configurado) em `apps/tools` | — |
| Manual | `pnpm --filter @nico.dev/tools dev`, abrir `/clt-pj`, calcular nos 3 modos | CLT: Mensal acima de Completa; PJ: só Completa |

> ⚠️ Testes não configurados no app: critérios de lógica são verificados por conferência manual. Guardrails da raiz (`docs/context/guardrails.md` §1) ainda estão com `TODO`.

---

## Notas de Review

<!-- Preenchido pelo /hands-on: achados 🟢/💡 da review por onda e da final. -->

---

## Emendas

<!-- Mudança normativa depois da aprovação (FR, tarefa, contrato, critério). -->
