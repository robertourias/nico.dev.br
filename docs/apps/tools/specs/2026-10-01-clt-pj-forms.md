# Spec & Plan: Formulários de Comparação PJ vs PJ e CLT vs CLT

**Status:** done
**Concluído em:** 2026-10-01
**Aprovado por:** Roberto Nicoletti em 2026-10-01
**Data:** 2026-10-01
**Autor:** Antigravity

---

## 1. Problema e Visão Geral

Atualmente, na página `/clt-pj` do app tools, apenas a calculadora "CLT vs PJ" está funcional com formulários de preenchimento e cálculo da diferença salarial. As opções "PJ vs PJ" e "CLT vs CLT" são apenas espaços reservados sem funcionalidade.
Para entregar valor completo na ferramenta de cálculo, é necessário implementar formulários específicos para as comparações entre duas propostas PJ e duas propostas CLT, trazendo também o cálculo da diferença da mesma forma que já ocorre no comparativo "CLT vs PJ".

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como usuário recebendo duas propostas PJ, quero preencher os dados de ambas para visualizar a diferença líquida real entre elas.
- **P1 (crítico):** Como usuário recebendo duas propostas CLT, quero preencher os dados (salário, benefícios) de ambas para entender qual me oferece o melhor pacote de remuneração líquida.

---

## 3. Requisitos Funcionais

- **FR-001:** O componente `CalculatorPjPj` deve renderizar formulários para duas propostas PJ distintas (ex: Proposta A e Proposta B).
- **FR-002:** O componente `CalculatorPjPj` deve calcular a diferença de rendimento líquido entre as duas propostas PJ fornecidas.
- **FR-003:** O componente `CalculatorCltClt` deve renderizar formulários para duas propostas CLT distintas (salário bruto, descontos, benefícios adicionais).
- **FR-004:** O componente `CalculatorCltClt` deve calcular a diferença de rendimento líquido total (salário + benefícios) entre as duas propostas CLT fornecidas.
- **FR-005:** As duas novas calculadoras devem exibir visualmente o resultado e a diferença ("Proposta X é R$ Y mais vantajosa") no mesmo padrão estético de `CalculatorForm` (CLT vs PJ).

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** Persistência de dados das simulações (backend) - a ferramenta continua 100% client-side. Geração de PDF dos resultados.
- **Premissa:** As regras de negócio para cálculos de descontos básicos do Simples Nacional/Lucro Presumido e do INSS/IRRF (CLT) já podem ser reutilizadas ou adaptadas das funções existentes no app.
- **Risco:** Inconsistência na interface entre as três abas de cálculo. → Mitigação: Reutilizar os mesmos componentes visuais (tipografia, cartões, sumários) e funções de formatação monetária já implementados em `calculator-form.tsx`.

---

## 5. Contratos de API (Se aplicável)

Não se aplica. O processamento é client-side em `apps/tools`.

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2              | —             |

### Tarefa 1: Implementar Formulário PJ vs PJ
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** —
- **Paralelizável com:** T2
- **Arquivos:** `apps/tools/src/app/clt-pj/_components/calculator-pj-pj.tsx`
- **Cobre:** FR-001, FR-002, FR-005
- **Descrição:** Atualizar o arquivo para implementar a interface do formulário e o gerenciamento de estado para duas propostas PJ. Realizar o cálculo do valor líquido de cada proposta considerando custos básicos de PJ e tributação média, e exibir a diferença entre elas, seguindo o padrão de UI do `calculator-form.tsx`.
- **Critérios de Aceite:**
  - [x] Dado o formulário PJ vs PJ preenchido, quando o usuário altera o valor da Proposta A, então a diferença exibida entre as propostas deve ser recalculada em tempo real. — cobre FR-001, FR-002, verificado por `pnpm --filter @nico.dev/tools lint`
  - [x] Dado o carregamento da página, quando em aba PJ vs PJ, então nenhum erro de lint ou tipagem deve acontecer. — cobre FR-005, verificado por `pnpm --filter @nico.dev/tools exec tsc --noEmit`

### Tarefa 2: Implementar Formulário CLT vs CLT
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** —
- **Paralelizável com:** T1
- **Arquivos:** `apps/tools/src/app/clt-pj/_components/calculator-clt-clt.tsx`
- **Cobre:** FR-003, FR-004, FR-005
- **Descrição:** Atualizar o arquivo para implementar o formulário e cálculo para duas propostas CLT. Deve considerar salários brutos, benefícios (VA, VR, plano de saúde) e deduções padrão (IRRF, INSS) de cada proposta para chegar no líquido real, exibindo a diferença.
- **Critérios de Aceite:**
  - [x] Dado o formulário CLT vs CLT preenchido com dois salários diferentes, quando exibido o resultado, então o cálculo do líquido + benefícios de ambas as propostas é sumarizado e a diferença é exibida. — cobre FR-003, FR-004, verificado por `pnpm --filter @nico.dev/tools lint`
  - [x] Dado o carregamento da página, quando em aba CLT vs CLT, então nenhum erro de lint ou tipagem deve acontecer. — cobre FR-005, verificado por `pnpm --filter @nico.dev/tools exec tsc --noEmit`

---

## 7. Rastreabilidade

| FR | Coberto por | Verificado por |
|----|-------------|-----------------|
| FR-001 | T1 | `pnpm --filter @nico.dev/tools lint` |
| FR-002 | T1 | `pnpm --filter @nico.dev/tools lint` |
| FR-003 | T2 | `pnpm --filter @nico.dev/tools lint` |
| FR-004 | T2 | `pnpm --filter @nico.dev/tools lint` |
| FR-005 | T1, T2 | `pnpm --filter @nico.dev/tools exec tsc --noEmit` |

---

## 8. Verificação

| O quê | Comando | Saída esperada |
|-------|---------|----------------|
| Lint | `pnpm --filter @nico.dev/tools lint` | sem erros |
| Type-check | `pnpm --filter @nico.dev/tools exec tsc --noEmit` | sem erros |

---

## Notas de Review

<!-- Preenchido pelo /hands-on: achados 🟢/💡 da review por onda e da final, no formato `- [onda N] arquivo:linha — texto`. Não é normativo. -->

---

## Emendas

<!-- Mudança normativa depois da aprovação (FR, tarefa, contrato, critério). Formato: `- YYYY-MM-DD — <o que mudou> — <por quê> — <quem>`. FR novo ou removido não é emenda: pare e escale ao humano. -->

---

<!-- 
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, rode `/approve` com o caminho desta Spec para liberar a implementação (ou altere o Status para approved no editor).
-->
