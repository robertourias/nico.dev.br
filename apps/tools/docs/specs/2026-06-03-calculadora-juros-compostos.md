# Spec: Calculadora de Juros Compostos

**Status:** approved
**Data:** 2026-06-03
**Autor:** planner

---

## Problema

Não existe em `tools.nico.dev` uma calculadora de juros compostos. Usuários que querem simular rendimento de investimentos — seja de um capital fixo ou com aportes mensais — precisam recorrer a ferramentas externas. O objetivo é fornecer essa calculadora diretamente no app, com visualização de evolução temporal.

---

## Cenários de Usuário

- **P1 (crítico):** Como investidor iniciante, quero inserir um capital inicial, uma taxa de juros e um prazo para ver quanto meu dinheiro vai render ao final do período.
- **P1 (crítico):** Como investidor com aportes mensais, quero simular quanto acumularia investindo mensalmente com uma taxa de juros por um período de tempo.
- **P2 (importante):** Como usuário, quero ver a evolução mês a mês do meu investimento em um gráfico e em uma tabela detalhada.
- **P2 (importante):** Como usuário, quero poder usar tanto taxa mensal quanto anual e tanto período em meses quanto em anos, com conversão automática.

---

## Requisitos Funcionais

### Modo 1 — Capital fixo

- **FR-001:** Inputs: Capital inicial (R$), Taxa de juros (%), Unidade da taxa (mensal | anual), Período, Unidade do período (meses | anos).
- **FR-002:** Output principal: Montante final, Capital investido, Juros acumulados (valor e % sobre o capital).
- **FR-003:** A calculadora converte automaticamente: taxa anual → mensal (`(1 + r_anual)^(1/12) - 1`) e período em anos → meses.
- **FR-004:** Fórmula: `M = PV × (1 + i)^n` onde `i` = taxa mensal e `n` = período em meses.

### Modo 2 — Com aportes mensais

- **FR-005:** Inputs: Capital inicial (R$, pode ser 0), Aporte mensal (R$), Taxa de juros (%), Unidade da taxa (mensal | anual), Período, Unidade do período (meses | anos).
- **FR-006:** Output principal: Montante final, Capital total investido (inicial + soma de aportes), Juros acumulados (valor e % sobre o capital total).
- **FR-007:** Fórmula: `M = PV × (1 + i)^n + PMT × ((1 + i)^n - 1) / i` onde `PMT` = aporte mensal, `i` = taxa mensal, `n` = período em meses.

### Visualização

- **FR-008:** Gráfico de área empilhada com 3 séries por período: capital inicial, aportes acumulados (modo 2 apenas), juros acumulados. Eixo X = meses, Eixo Y = R$.
- **FR-009:** Tabela expansível abaixo do gráfico com colunas: Mês, Saldo inicial do mês, Aporte (modo 2), Juros do mês, Saldo final. Fechada por padrão; abre com botão "Ver detalhes mês a mês".
- **FR-010:** Gráfico e tabela atualizam em tempo real conforme o usuário altera os inputs (sem botão "Calcular").
- **FR-011:** Quando o período resultar em mais de 120 meses, o gráfico exibe pontos anuais (1 por 12 meses) para evitar sobrecarga visual. A tabela continua com granularidade mensal.

### UX

- **FR-012:** Alternância entre Modo 1 e Modo 2 via tabs ou toggle no topo do formulário.
- **FR-013:** Inputs aceitam separador decimal vírgula (`,`) ou ponto (`.`).
- **FR-014:** Valores monetários são exibidos em formato BRL: `R$ 1.234,56`.
- **FR-015:** A calculadora funciona inteiramente no cliente — nenhuma chamada de API ou Server Action.

---

## API dos Componentes (estrutura esperada)

```
src/features/compound-interest/
  components/
    CompoundInterestCalculator.tsx  ← componente pai ("use client")
    InputForm.tsx                   ← formulário de inputs
    ResultSummary.tsx               ← cards de output principal
    EvolutionChart.tsx              ← gráfico de área empilhada
    EvolutionTable.tsx              ← tabela expansível
  hooks/
    useCompoundInterest.ts          ← lógica de cálculo e estado
  utils/
    compound-interest.ts            ← funções matemáticas puras
    format.ts                       ← formatação BRL
  index.ts                          ← barrel export
src/app/juros-compostos/
  page.tsx                          ← Server Component com metadata + import do feature
```

---

## Critérios de Sucesso

- [ ] Modo 1: resultado idêntico ao de calculadoras de referência (ex: calculadordojuros.com.br) para os mesmos inputs.
- [ ] Modo 2: resultado idêntico para os mesmos inputs.
- [ ] Gráfico renderiza sem erro para períodos de 1 a 600 meses.
- [ ] Tabela exibe corretamente os 12 primeiros e últimos meses.
- [ ] Troca de modo (fixo ↔ aportes) não quebra o estado dos inputs comuns.
- [ ] A página aparece listada na home do tools.nico.dev.

---

## Fora do Escopo

- Correção monetária (IPCA, SELIC, etc.) — seria uma tool separada.
- Múltiplos cenários lado a lado.
- Exportar resultado em PDF ou imagem.
- Frequência de aporte diferente de mensal.
- Suporte a taxas negativas.

---

## Riscos e Premissas

- **Premissa:** `apps/tools` já tem `@nico.dev/ui` como dependência e usa os tokens canônicos.
- **Premissa:** Uma biblioteca de gráficos já existe ou pode ser adicionada. Candidatos: `recharts` (mais usada com React) ou `chart.js` via `react-chartjs-2`. Verificar se alguma já está no monorepo antes de adicionar.
- **Risco:** Erros de arredondamento em floating point acumulados mês a mês. → Mitigação: usar 10 casas decimais nos cálculos intermediários; arredondar apenas na exibição.
- **Risco:** Tabela com muitas linhas (ex: 360 meses) pode ser lenta. → Mitigação: virtualização ou paginação na tabela quando > 60 linhas.

---

<!--
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
