# Spec: Debug Code — Validador de Código com IA

**Status:** approved
**Data:** 2026-06-03
**Autor:** planner-agent

---

## Problema

O subprojeto `tools.nico.dev` reúne ferramentas utilitárias para desenvolvedores. Atualmente não existe uma ferramenta de análise e correção de código assistida por IA. Desenvolvedores precisam de um canal rápido para colar código quebrado e receber: (a) diagnóstico detalhado dos erros e (b) versão corrigida — sem sair do browser e sem configurar toolchain local.

---

## Cenários de Usuário

- **P1 (crítico):** Como desenvolvedor, quero colar meu código e receber uma versão corrigida com formatação de editor, para identificar e resolver erros rapidamente.
- **P1 (crítico):** Como desenvolvedor, quero ver explicações detalhadas por erro (linha, tipo, motivo), para entender o que estava errado e não repetir.
- **P2 (importante):** Como desenvolvedor, quero que a linguagem seja detectada automaticamente, para não precisar configurar nada antes de colar o código.
- **P3 (nice-to-have):** Como desenvolvedor, quero que o código de saída tenha highlight de sintaxe com tema de editor, para facilitar leitura e comparação.

---

## Requisitos Funcionais

- **FR-001:** A página `/debug-code` deve conter um textarea (ou editor) onde o usuário cola código em qualquer linguagem.
- **FR-002:** Um botão "Analisar" dispara chamada ao backend; enquanto processa, exibe estado de loading visível.
- **FR-003:** O backend expõe um Route Handler (`POST /api/debug-code`) que recebe o código e envia para a API do Google Gemini com prompt estruturado.
- **FR-004:** O Gemini deve retornar em formato JSON estruturado: `{ language, correctedCode, errors: [{ line, type, message, fix }] }`.
- **FR-005:** O frontend renderiza o `correctedCode` com syntax highlight (tema de editor escuro), usando a linguagem detectada pelo Gemini.
- **FR-006:** O frontend renderiza a lista de erros com: número de linha, tipo de erro, explicação e sugestão de correção.
- **FR-007:** A API key do Gemini é consumida apenas no Route Handler (`GEMINI_API_KEY` em variável de ambiente server-side); nunca exposta ao cliente.
- **FR-008:** Cada análise é stateless — sem persistência de histórico entre sessões ou usuários.
- **FR-009:** Se o Gemini não encontrar erros, exibir mensagem "Nenhum erro encontrado. Código parece correto."
- **FR-010:** Limite de caracteres no input: 10.000 chars (prevenir payloads abusivos).

---

## Critérios de Sucesso

- [ ] Usuário cola código com erros em qualquer linguagem suportada pelo Gemini e recebe código corrigido formatado.
- [ ] Lista de erros exibe linha, tipo e explicação para cada problema encontrado.
- [ ] Código de saída renderizado com syntax highlight via tema de editor.
- [ ] Linguagem detectada automaticamente sem input do usuário.
- [ ] API key do Gemini nunca aparece em network requests do browser.
- [ ] Estado de loading visível durante processamento.
- [ ] Input com 10.001+ chars é rejeitado com mensagem de erro antes de chamar a API.

---

## Fora do Escopo

- Histórico de análises anteriores ou persistência de sessão.
- Seleção manual de linguagem pelo usuário.
- Diff visual entre código original e corrigido (pode ser P3 futuro).
- Execução do código no browser (sandbox).
- Rate limiting por usuário (pode ser adicionado depois).
- Suporte a múltiplos arquivos ou uploads.

---

## Riscos e Premissas

- **Premissa:** `GEMINI_API_KEY` estará disponível nas variáveis de ambiente do projeto `apps/tools` no Vercel.
- **Premissa:** O projeto `apps/tools` já usa `packages/ui` como design system — componentes de UI devem vir de lá.
- **Risco:** Gemini pode retornar JSON mal-formado → Mitigação: parsear com `try/catch` e exibir erro genérico ao usuário se parse falhar.
- **Risco:** Latência alta da API Gemini para códigos grandes → Mitigação: limite de 10.000 chars + timeout de 30s no Route Handler.
- **Risco:** Prompt engineering inadequado gera saída inconsistente → Mitigação: prompt com schema JSON explícito e instrução de fallback para código sem erros.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
