# Spec: Analisador de Texto Inteligente (tools.nico.dev)

**Status:** approved
**Data:** 2026-06-05
**Autor:** planner

---

## Problema

O tools.nico.dev já tem ferramentas de produtividade técnica (Debug Code) e financeira (Conversor de Moedas), mas não oferece nenhuma ferramenta de processamento de linguagem natural. Usuários que precisam analisar sentimento, extrair entidades, resumir conteúdo ou humanizar texto gerado por IA precisam de múltiplas ferramentas externas. Uma ferramenta unificada de análise de texto agrega valor direto à coleção, demonstra uso prático de LLMs e atende tanto devs quanto usuários não-técnicos.

---

## Cenários de Usuário

- **P1 (crítico):** Como usuário, quero colar um texto e receber em uma única análise: sentimento, entidades, resumo, insights e versão humanizada, para economizar tempo e ter tudo em um só lugar.
- **P1 (crítico):** Como usuário, quero que o texto humanizado reescreva meu conteúdo — seja gerado por IA ou não — com tom mais natural e fluido, para melhorar a qualidade da escrita.
- **P2 (importante):** Como usuário, quero ver o sentimento expresso visualmente (positivo/neutro/negativo com score), para interpretar o resultado rapidamente.
- **P2 (importante):** Como usuário, quero copiar cada seção do resultado individualmente (resumo, texto humanizado, etc.), para reutilizar o conteúdo sem precisar selecionar manualmente.
- **P3 (nice-to-have):** Como usuário, quero ver o idioma detectado do texto de entrada, para confirmar que a análise foi feita corretamente.

---

## Requisitos Funcionais

### Entrada
- **FR-001:** Campo de texto livre (textarea) com suporte a qualquer idioma.
- **FR-002:** Limite de entrada: 5.000 caracteres. Contador visível e bloqueio ao atingir o limite.
- **FR-003:** Botão "Analisar" desabilitado se o campo estiver vazio ou acima do limite.
- **FR-004:** Botão "Limpar" aparece após análise concluída.

### Análise (saída unificada)
- **FR-005:** **Sentimento** — classificação (Positivo / Neutro / Negativo) com score de 0–100 e frase explicativa em português.
- **FR-006:** **Entidades** — lista de entidades extraídas do texto, cada uma com: nome, tipo (Pessoa / Organização / Local / Produto / Evento / Outro) e relevância (Alta / Média / Baixa).
- **FR-007:** **Resumo** — parágrafo conciso em português preservando os pontos principais, independente do idioma original.
- **FR-008:** **Insights** — lista de 3–5 observações relevantes ou não-óbvias sobre o conteúdo em português.
- **FR-009:** **Texto humanizado** — reescrita do texto de entrada com tom mais natural e fluido, no mesmo idioma do original. Aplica-se tanto a texto gerado por IA quanto a qualquer texto que o usuário queira melhorar.
- **FR-010:** Todos os módulos retornam em uma única chamada à API do Gemini (JSON estruturado), sem múltiplos roundtrips.

### UX / Interação
- **FR-011:** Durante o processamento: estado de loading com skeleton nos resultados.
- **FR-012:** Sentimento exibido com indicador visual de cor (verde/cinza/vermelho) e barra de progresso do score.
- **FR-013:** Botão "Copiar" em cada seção de resultado (resumo, texto humanizado, insights).
- **FR-014:** Erros da API exibidos inline com mensagem amigável — sem quebrar o layout.
- **FR-015:** Idioma detectado exibido como badge discreto no card de resultado.

### Implementação
- **FR-016:** Provider: Google Gemini via `@google/genai` (já instalado em `apps/tools`).
- **FR-017:** Model: `gemini-2.5-flash-lite` (mesmo do debug-code — sem custo extra de dependência).
- **FR-018:** Prompt retorna JSON estruturado. O mesmo padrão de sanitização do debug-code se aplica (strip markdown fences antes de `JSON.parse`).
- **FR-019:** Route Handler `POST /api/analyze-text` — API key lida do server-side via `process.env.GEMINI_API_KEY`.
- **FR-020:** Nunca expor a API key no cliente.

---

## Critérios de Sucesso

- [ ] Usuário cola texto, clica "Analisar" e recebe os 5 módulos preenchidos em menos de 15s.
- [ ] Texto em inglês, espanhol, português e outros idiomas analisado corretamente.
- [ ] Sentimento exibe score visual além do label.
- [ ] Botões "Copiar" funcionam em cada seção.
- [ ] Erro de API (QUOTA_EXCEEDED, timeout) exibido com mensagem clara sem crash.
- [ ] Ferramenta acessível via `tools.nico.dev/analisador-texto`.
- [ ] Card da ferramenta aparece como `active` na homepage.

---

## Fora do Escopo

- Análise de URLs ou documentos (PDF, .txt) — somente texto colado.
- Persistência de histórico de análises (sem auth, sem banco).
- Configuração individual de módulos (todos sempre executados juntos).
- Exportação em PDF ou DOCX.
- Análise em lote (múltiplos textos de uma vez).

---

## Riscos e Premissas

- **Premissa:** `GEMINI_API_KEY` já existe no ambiente do Vercel (compartilhada com debug-code).
- **Premissa:** `gemini-2.5-flash-lite` retorna JSON válido para prompts estruturados com consistência suficiente.
- **Risco:** Textos próximos de 5.000 chars podem estourar context window do modelo → Mitigação: limitar a 5.000 chars no frontend e documentar no prompt o tamanho esperado.
- **Risco:** JSON mal-formado na resposta do Gemini → Mitigação: mesmo padrão do debug-code (strip fences + try/catch com fallback de erro).
- **Risco:** Latência alta para textos longos (> 3.000 chars) → Mitigação: streaming não implementado nesta versão; loading state cobre a espera.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
