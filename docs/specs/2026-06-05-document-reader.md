# Spec: Leitor de Documentos Inteligente (tools.nico.dev)

**Status:** approved
**Data:** 2026-06-05
**Autor:** planner

---

## Problema

O tools.nico.dev já oferece análise de texto colado manualmente, mas não há suporte a documentos reais — PDFs, imagens digitalizadas ou arquivos de texto. Usuários que precisam extrair informações de contratos, notas fiscais, currículos, artigos ou qualquer documento digitalizado precisam de ferramentas externas pagas. Um leitor unificado com OCR e IA (Gemini) permite analisar qualquer documento com upload direto, extraindo estrutura, pontos-chave e respondendo perguntas específicas sobre o conteúdo — sem custo e sem sair do tools.nico.dev.

---

## Cenários de Usuário

- **P1 (crítico):** Como usuário, quero fazer upload de um documento (PDF, imagem ou texto) e receber automaticamente um resumo, o tipo de documento identificado e os pontos-chave, para entender o conteúdo sem precisar ler tudo.
- **P1 (crítico):** Como usuário, quero fazer uma pergunta livre sobre o documento após o upload, para extrair informações específicas sem precisar ler o documento inteiro.
- **P2 (importante):** Como usuário, quero ver o status do processamento durante o upload e análise, para saber que o sistema está trabalhando.
- **P2 (importante):** Como usuário, quero poder fazer múltiplas perguntas sobre o mesmo documento sem precisar fazer upload novamente, para explorar o conteúdo livremente.
- **P3 (nice-to-have):** Como usuário, quero ver o tipo de documento detectado como badge destacado (ex: "Nota Fiscal", "Contrato", "Currículo"), para confirmar rapidamente que o documento foi identificado corretamente.

---

## Requisitos Funcionais

### Upload
- **FR-001:** Suporte a arquivos PDF, imagens (JPG, JPEG, PNG, WebP) e texto (.txt, .md). Outros formatos são rejeitados com mensagem clara.
- **FR-002:** Limite de 5 MB por arquivo. Arquivos acima do limite são rejeitados antes do upload com mensagem de erro inline.
- **FR-003:** Interface de upload com drag-and-drop e botão de seleção de arquivo.
- **FR-004:** Preview do arquivo: nome + tamanho + ícone de tipo. Para imagens, exibir thumbnail.
- **FR-005:** Botão "Analisar Documento" habilitado somente após seleção de arquivo válido.

### Análise Fixa
- **FR-006:** Ao submeter, a API retorna em uma única chamada Gemini os 3 módulos:
  - **Tipo de Documento** — classificação livre (ex: "Nota Fiscal", "Contrato de Prestação de Serviços", "Artigo Científico", "Currículo", "Receita Médica")
  - **Resumo** — parágrafo conciso (2–4 frases) em português brasileiro, independente do idioma original
  - **Pontos-chave** — lista de 3–7 informações mais relevantes em português brasileiro
- **FR-007:** Para PDFs e imagens, o arquivo é enviado como base64 (inline_data) para o Gemini — OCR nativo, sem biblioteca externa.
- **FR-008:** Para arquivos .txt e .md, o conteúdo é lido como texto e enviado diretamente ao prompt.
- **FR-009:** Resultado exibido em cards separados por módulo, com idioma detectado como badge no card de Resumo.

### Perguntas Livres
- **FR-010:** Campo de pergunta aparece após análise fixa concluída com sucesso.
- **FR-011:** Ao enviar uma pergunta, nova requisição à API envia o arquivo original (base64 ou texto) + a pergunta para o Gemini, retornando resposta em texto livre.
- **FR-012:** Múltiplas perguntas podem ser feitas sobre o mesmo documento sem novo upload. Cada resposta aparece abaixo da anterior em thread simples (lista de pares pergunta/resposta).
- **FR-013:** Campo de pergunta com botão "Perguntar" e ícone de loading durante processamento.

### UX / Interação
- **FR-014:** Estado de loading com skeleton durante análise fixa.
- **FR-015:** Erros da API exibidos inline com mensagem amigável — sem quebrar o layout.
- **FR-016:** Botão "Novo documento" redefine todo o estado (arquivo, análise, perguntas).
- **FR-017:** Idioma detectado exibido como badge no topo do resultado.

### Implementação
- **FR-018:** Provider: Google Gemini via `@google/genai` (já instalado em `apps/tools`).
- **FR-019:** Model: `gemini-2.5-flash` — necessário para processamento multimodal confiável de PDFs e imagens com alto detalhe. (gemini-2.5-flash-lite pode não ter suporte a PDFs inline estável.)
- **FR-020:** Dois Route Handlers:
  - `POST /api/analyze-document` — análise fixa (upload + extração dos 3 módulos)
  - `POST /api/ask-document` — pergunta livre (upload + question)
- **FR-021:** Arquivo nunca armazenado no servidor — processado em memória e descartado após a resposta.
- **FR-022:** API key lida exclusivamente do `process.env.GEMINI_API_KEY` server-side.

---

## Critérios de Sucesso

- [ ] Upload de PDF gera resumo, tipo e pontos-chave corretos em < 30s.
- [ ] Upload de imagem (foto de documento) extrai texto via OCR nativo do Gemini.
- [ ] Upload de .txt/.md funciona sem conversão.
- [ ] Arquivo acima de 5 MB é rejeitado antes do envio ao servidor.
- [ ] Pergunta livre retorna resposta relevante ao conteúdo do documento.
- [ ] Múltiplas perguntas sobre o mesmo documento funcionam sem novo upload.
- [ ] Erros de API exibidos com mensagem amigável sem crash.
- [ ] Ferramenta acessível via `tools.nico.dev/leitor-documentos`.
- [ ] Card da ferramenta aparece como `active` na homepage.

---

## Fora do Escopo

- Suporte a Word (.docx), Excel (.xlsx) ou PowerPoint — somente PDF, imagens e texto.
- Persistência de documentos ou histórico de sessões (sem auth, sem banco).
- Extração de tabelas estruturadas ou export para JSON/CSV.
- OCR em múltiplos documentos simultaneamente (um por vez).
- Comparação entre documentos.
- Anotações ou highlights no documento original.

---

## Riscos e Premissas

- **Premissa:** `GEMINI_API_KEY` já existe no ambiente do Vercel (compartilhada com debug-code e analisador-texto).
- **Premissa:** `gemini-2.5-flash` suporta PDFs via `inline_data` com base64 de forma estável.
- **Risco:** PDFs com muitas páginas próximos de 5 MB podem gerar respostas lentas (> 30s) → Mitigação: loading state explícito; sem timeout no cliente.
- **Risco:** Imagens com baixa qualidade podem resultar em OCR impreciso → Mitigação: documentado; fora do controle da aplicação.
- **Risco:** Base64 de arquivos de 5 MB aumenta payload da requisição em ~33% (≈ 6.7 MB) → Mitigação: dentro dos limites do Next.js Route Handler por padrão (body limit 4 MB precisa ser aumentado para `sizeLimit: '10mb'` na config da route).
- **Risco:** Custo de tokens do `gemini-2.5-flash` maior que `gemini-2.5-flash-lite` → Risco aceito; qualidade de OCR compensa.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
