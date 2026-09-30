# Spec & Plan: Seleção de Comparação na Calculadora CLT vs PJ

**Status:** done
**Data:** 2026-09-30
**Autor:** Planner Agent
**Aprovado por:** Roberto Nicoletti

---

## 1. Problema e Visão Geral

Atualmente, a página da ferramenta "Calculadora CLT vs PJ" em `apps/tools/src/app/clt-pj` carrega diretamente o formulário comparando um cenário CLT com um cenário PJ. O objetivo é introduzir uma etapa de seleção inicial onde o usuário possa escolher exatamente o que deseja comparar antes de ver os formulários. As opções disponíveis serão: **CLT & PJ**, **PJ & PJ**, e **CLT & CLT**. Isso aumentará a flexibilidade e utilidade da ferramenta, permitindo que usuários comparem propostas do mesmo regime.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como usuário da calculadora, quero selecionar se desejo comparar "CLT & PJ", "PJ & PJ" ou "CLT & CLT" antes de visualizar os formulários, para que a ferramenta me exiba a comparação correta para a minha necessidade.
- **P2 (importante):** Como usuário que compartilhou um link, quero que a página carregue automaticamente o modo de comparação escolhido (ex: via URL) para não precisar selecionar novamente.

---

## 3. Requisitos Funcionais

- **FR-001:** A página `/clt-pj` (quando acessada sem parâmetros específicos) deve exibir uma interface de seleção com três opções: "CLT vs PJ", "PJ vs PJ" e "CLT vs CLT".
- **FR-002:** Ao selecionar uma opção, o usuário deve ser direcionado para o formulário de comparação correspondente.
- **FR-003:** O estado da seleção deve ser refletido na URL (usando `searchParams`, ex: `?mode=clt-pj`), permitindo que a página seja acessada diretamente no modo desejado.
- **FR-004:** Deve ser possível "voltar" ou limpar a seleção para escolher um modo diferente.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** A implementação completa das regras contábeis/fiscais e de interface para as calculadoras "PJ vs PJ" e "CLT vs CLT". Esta Spec foca na arquitetura da tela de seleção e roteamento, embora criemos os componentes base (scaffolds) para receberem a lógica futura. A calculadora atual ("CLT vs PJ") permanecerá intacta.
- **Premissa:** As opções de comparação serão controladas pelo parâmetro de URL `mode`.
- **Risco:** O formulário existente e o cabeçalho (`ToolPageHeader`) não estão adaptados para mudar de título dinamicamente com facilidade.
  - *Mitigação:* O `page.tsx` passará títulos e descrições apropriadas para o cabeçalho dependendo do modo, e o formulário atual será encapsulado no modo correspondente.

---

## 5. Contratos de API (Se aplicável)

*Não aplicável. Lógica 100% frontend.*

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1                  | —             |
| 2    | T2                  | T1            |

### Tarefa 1: Criar Componente de Seleção e Lógica de URL
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** —
- **Paralelizável com:** nenhuma
- **Arquivos:** `apps/tools/src/app/clt-pj/page.tsx`, `apps/tools/src/app/clt-pj/_components/comparison-selector.tsx`
- **Cobre:** FR-001, FR-003
- **Descrição:**
  - Criar o componente `ComparisonSelector.tsx` em `_components` que exibe 3 opções visuais (cards/botões) para as opções: CLT vs PJ, PJ vs PJ, CLT vs CLT.
  - Cada opção deve ser um `Link` do Next.js (ou atualizar o router de forma suave) que adiciona o parâmetro `?mode=clt-pj`, `?mode=pj-pj`, ou `?mode=clt-clt` à URL.
  - Atualizar `apps/tools/src/app/clt-pj/page.tsx` para ler o `searchParams.mode`. Se não houver `mode` válido, renderizar o `ComparisonSelector`. Se houver, preparar para renderizar o form adequado.
- **Critérios de Aceite:**
  - [x] Dado que não há query param `mode`, quando o usuário acessa `/clt-pj`, então o componente de seleção com as 3 opções é exibido em vez do formulário. — verificado visualmente.
  - [x] Dado um clique no card "CLT vs PJ", quando acionado, a URL muda para `/clt-pj?mode=clt-pj`. — verificado visualmente no browser.

### Tarefa 2: Conectar Scaffolds das Diferentes Calculadoras
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1
- **Paralelizável com:** nenhuma
- **Arquivos:** `apps/tools/src/app/clt-pj/page.tsx`, `apps/tools/src/app/clt-pj/_components/calculator-pj-pj.tsx`, `apps/tools/src/app/clt-pj/_components/calculator-clt-clt.tsx`, `apps/tools/src/app/clt-pj/_components/calculator-form.tsx` (se necessário isolar algo)
- **Cobre:** FR-002, FR-004
- **Descrição:**
  - Criar `calculator-pj-pj.tsx` e `calculator-clt-clt.tsx` inicialmente como scaffolds visuais simples (ex: "Em breve: Calculadora PJ vs PJ").
  - Atualizar `page.tsx` para que, dependendo do `mode`, renderize o formulário adequado (`CalculatorForm` atual para `clt-pj`, os novos para os respectivos).
  - Incluir um botão/link "Voltar para seleção" (ou "Trocar tipo de comparação") no topo ou junto ao cabeçalho (ou ajustar o `ToolPageHeader` para permitir um action de voltar).
- **Critérios de Aceite:**
  - [x] Dado a URL `/clt-pj?mode=clt-pj`, quando a página carrega, então o formulário original `CalculatorForm` é exibido. — verificado via dev server.
  - [x] Dado a URL `/clt-pj?mode=pj-pj`, quando a página carrega, então o novo scaffold `CalculatorPjPj` é exibido. — verificado via dev server.
  - [x] Dado um botão "Trocar comparação", quando clicado, o `mode` é removido da URL e o seletor reaparece. — verificado visualmente.

---

## 7. Rastreabilidade

| FR | Coberto por | Verificado por |
|----|-------------|-----------------|
| FR-001 | T1 | Manual (browser preview) |
| FR-002 | T2 | Manual (browser preview) |
| FR-003 | T1 | Manual (URL check) |
| FR-004 | T2 | Manual (botão voltar) |

---

## 8. Verificação

| O quê | Comando | Saída esperada |
|-------|---------|----------------|
| Lint | `pnpm --filter tools run lint` | sem erros |
| Type-check | `pnpm --filter tools run typecheck` | sem erros |
| Build | `pnpm --filter tools run build` | sucesso sem falhas de build |
| Manual | Navegar pelas opções no navegador e mudar URL diretamente | Componentes e telas atualizando corretamente |

---

<!-- 
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, rode `/approve` com o caminho desta Spec para liberar a implementação (ou altere o Status para approved no editor).
-->
