# Plano: Gerador de Paleta de Cores

**Data:** 2026-06-05
**Spec:** `docs/specs/2026-06-05-gerador-paleta-cores.md`
**Escopo:** `apps/tools`
**Stack:** Next.js 16 (SSR) + Gemini API

---

## Visão Geral

Feature frontend-only integrada em `/tools`, sem backend separado. Fluxo:
1. Usuário seleciona cor base, tipo de harmonia, quantidade
2. Cliente valida e chama `/api/generate-palette`
3. Rota API chama Gemini com prompt estruturado → JSON de cores
4. Frontend renderiza grid visual (hex, RGB, HSL) + botões de exportação

---

## Contrato de API

### POST `/api/generate-palette`

**Request:**
```json
{
  "baseColor": "#FF5733",
  "harmonyType": "tríade" | "análoga" | "dividida" | "mono" | "UI app",
  "count": 3 | 5 | 7 | 10
}
```

**Response (200):**
```json
{
  "baseColor": "#FF5733",
  "harmonyType": "tríade",
  "colors": [
    {
      "hex": "#FF5733",
      "rgb": { "r": 255, "g": 87, "b": 51 },
      "hsl": { "h": 9, "s": 100, "l": 60 },
      "name": "Vermelho Vivo"
    },
    {
      "hex": "#33FF57",
      "rgb": { "r": 51, "g": 255, "b": 87 },
      "hsl": { "h": 130, "s": 100, "l": 60 },
      "name": "Verde Vibrante"
    }
  ]
}
```

**Errors:**
- `400 INVALID_COLOR`: cor inválida (ex: não é hex/RGB/HSL válido)
- `400 INVALID_HARMONY`: tipo de harmonia não suportado
- `400 INVALID_COUNT`: count ∉ {3, 5, 7, 10}
- `429 QUOTA_EXCEEDED`: limite Gemini atingido
- `502 GEMINI_API_ERROR`: falha ao chamar Gemini
- `500 GEMINI_PARSE_ERROR`: resposta inválida de Gemini

---

## Decomposição de Tarefas

### Tarefa 1: API Route `/api/generate-palette`
**Tipo:** feature | **Agente:** backend  
**Descrição:**
- Valida request (baseColor, harmonyType, count)
- Converte baseColor para formato normalizado (hex interno)
- Constrói prompt Gemini com JSON schema exigindo array de cores com hex/rgb/hsl/name
- Chama `gemini-2.5-flash-lite` com structured output
- Parse resposta JSON, valida que retorna `count` cores válidas
- Retorna estrutura de response acima

**Critérios de Aceite:**
- [ ] Aceita #RRGGBB, rgb(r,g,b), hsl(h,s%,l%) como entrada
- [ ] Rejeita entrada inválida com erro 400 específico
- [ ] Gemini retorna exatamente `count` cores com hex/rgb/hsl/name
- [ ] Resposta em < 3s sob carga normal
- [ ] Tratamento de 429/502/500 com erro HTTP apropriado

**Notas:**
- Usar `@google/genai` (já presente em projeto)
- Prompt deve forçar JSON puro (sem markdown fences)
- Validação: cada cor deve ter hex válido (6 dígitos hex após #)

---

### Tarefa 2: Hook `usePaletteGenerator`
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- Estado: baseColor, harmonyType, count, result, error, isLoading
- Função `generate()` que valida entrada client-side e POST para `/api/generate-palette`
- Função `reset()` que limpa tudo
- Função `copyColor(hex)` que copia cor para clipboard (reutilizar hook existente se houver)
- Retorna: { baseColor, setBaseColor, harmonyType, setHarmonyType, count, setCount, result, error, isLoading, generate, reset, copyColor }

**Critérios de Aceite:**
- [ ] Validação client: color não vazio, harmonyType válido, count ∈ {3,5,7,10}
- [ ] Desabilita botão de gerar enquanto isLoading
- [ ] Trata erro HTTP e parse error
- [ ] copyColor funciona em todos os navegadores modernos

**Notas:**
- Reutilizar padrão de `useTextAnalyzer` (mesmo estado, mesma lógica de error handling)

---

### Tarefa 3: Componentes de Entrada
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
Criar 3 componentes reutilizáveis:

1. **`<ColorInput />`**
   - Input com picker visual (HTML5 `<input type="color">`) + campo texto
   - Aceita #hex, rgb(...), hsl(...) e converte para exibição unificada
   - Exibe preview da cor selecionada
   - Props: value, onChange, disabled

2. **`<HarmonySelector />`**
   - Radio group ou select com 5 opções: análoga, tríade, dividida, mono, UI app
   - Cada opção tem descrição curta e ícone visual
   - Props: value, onChange, disabled

3. **`<QuantitySelector />`**
   - 4 botões (radio/segmented): 3, 5, 7, 10
   - Props: value, onChange, disabled

**Critérios de Aceite:**
- [ ] ColorInput aceita #RGB, #RRGGBB, rgb(r,g,b), hsl(h,s%,l%)
- [ ] HarmonySelector exibe 5 opções com descrição
- [ ] QuantitySelector possui 4 botões fixos
- [ ] Todos desabilitam corretamente quando prop disabled=true

**Notas:**
- Usar `@nico.dev/ui` para botões, input, etc
- Tailwind CSS para layout

---

### Tarefa 4: Componente de Exibição `<PaletteGrid />`
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- Grid responsivo (1 col mobile, 2-3 cols desktop) de cores
- Cada cor é um card contendo:
  - Swatch visual (80x80px ou maior)
  - Nome da cor (text pequeno)
  - Hex, RGB, HSL lado a lado
  - Botão "Copiar" ao lado de cada valor (copy para clipboard)
  - Hover: sombra aumenta

**Critérios de Aceite:**
- [ ] Renderiza corretamente `colors` array da resposta API
- [ ] Todos os botões "Copiar" funcionam
- [ ] Layout responsivo (mobile: 1 col, tablet: 2 cols, desktop: 3+ cols)
- [ ] Swatch mostra cor corretamente (verifica RGB → output visual)

**Notas:**
- Usar grid Tailwind (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

---

### Tarefa 5: Componente de Exportação `<ExportSection />`
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- 4 botões lado a lado: "CSS", "SCSS", "JSON", "Tailwind"
- Cada botão gera string de exportação (sem download, apenas copia para clipboard)
- Formatos:
  
  **CSS:** 
  ```css
  :root {
    --color-1: #FF5733;
    --color-2: #33FF57;
    ...
  }
  ```
  
  **SCSS:**
  ```scss
  $colors: (
    'color-1': #FF5733,
    'color-2': #33FF57,
    ...
  );
  ```
  
  **JSON:**
  ```json
  {
    "colors": [
      { "hex": "#FF5733", "name": "Vermelho" },
      ...
    ]
  }
  ```
  
  **Tailwind:**
  ```js
  colors: {
    'palette-1': '#FF5733',
    'palette-2': '#33FF57',
    ...
  }
  ```

**Critérios de Aceite:**
- [ ] Copia string exata para clipboard (sem truncamento)
- [ ] String é válida para cada formato (CSS/SCSS/JSON são parseable)
- [ ] Botões desabilitam quando result é null
- [ ] Toast ou feedback visual quando copia

**Notas:**
- Reutilizar hook de copy (ou criar utility `formatPaletteFor(format)`)
- Tailwind config pode ser snippet, não precisa estar 100% pronto para usar

---

### Tarefa 6: Componente Principal `<PaletteGenerator />`
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- Orquestra: ColorInput + HarmonySelector + QuantitySelector + botão Gerar
- Abaixo: condicional isLoading → Skeleton; result → PaletteGrid + ExportSection; error → mensagem
- Usa hook `usePaletteGenerator`

**Critérios de Aceite:**
- [ ] Layout limpo, espaçamento com Tailwind gap
- [ ] Botão "Gerar" desabilitado enquanto isLoading
- [ ] Skeleton mostra enquanto isLoading
- [ ] Erro exibido em cor vermelha
- [ ] Reset quando usuário muda entrada após ter resultado

**Notas:**
- Seguir padrão de `TextAnalyzer`

---

### Tarefa 7: Página `/gerador-paleta`
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- Arquivo: `apps/tools/src/app/gerador-paleta/page.tsx`
- Exporta `metadata` com title, description
- Renderiza `<ToolPageHeader name="Gerador de Paleta" description="..." />`
- Renderiza `<PaletteGenerator />`

**Critérios de Aceite:**
- [ ] Página acessível em `/gerador-paleta`
- [ ] SEO metadata correto
- [ ] Header e componente renderizam

**Notas:**
- Reutilizar estrutura de `analisador-texto/page.tsx`

---

### Tarefa 8: Integração em `/tools` (card na home)
**Tipo:** feature | **Agente:** frontend  
**Descrição:**
- Editar `apps/tools/src/app/page.tsx` para adicionar card do novo gerador
- Card deve ter:
  - Ícone (paleta de cores ou similar)
  - Título "Gerador de Paleta de Cores"
  - Descrição curta
  - Link para `/gerador-paleta`
- Deve seguir mesmo design/grid dos cards existentes

**Critérios de Aceite:**
- [ ] Card aparece em `/tools`
- [ ] Layout responsivo mantido
- [ ] Link funciona

**Notas:**
- Verificar existente `page.tsx` para entender grid e estrutura de cards

---

## Ordem de Execução Recomendada

1. ✅ **Tarefa 1** (API route) — bloqueadora para tudo
2. ✅ **Tarefa 2** (hook) — bloqueadora para UI
3. ✅ **Tarefas 3, 4, 5** (componentes) — paralelo, sem dependência
4. ✅ **Tarefa 6** (orquestrador) — depende de 2, 3, 4, 5
5. ✅ **Tarefa 7** (página) — depende de 6
6. ✅ **Tarefa 8** (integração home) — depende de 7

---

## Riscos Mitigados

| Risco | Mitigação |
|-------|-----------|
| Gemini retorna colors inválidas | Validar cada cor client + server lado |
| Timeout > 3s | Loader visual, timeout 5s com retry button |
| Cor de entrada inválida | Validação immediate client-side com parser |
| Copy to clipboard falha | Usar navigator.clipboard (moderne browsers) |
| Exportação com sintaxe inválida | Testar cada formato antes de shipar |
