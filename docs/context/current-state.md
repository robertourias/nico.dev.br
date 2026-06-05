# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-04
**Resumo da última sessão:** Migração do debug-code para @google/genai com UI pt-BR e tratamento de quota; Wake Lock API no metrônomo para manter tela acesa durante treino ativo.

---

## Feature em andamento

**Spec ativo:** `docs/specs/2026-06-04-wake-lock.md` (Status: approved — implementação concluída)
**Plano ativo:** `docs/plans/2026-06-04-wake-lock.md`

---

## Tasks

### ✅ Concluídas

**apps/tools — debug-code:**
- Migração `@google/generative-ai` → `@google/genai@2.8.0` (novo SDK Google)
- Split de erros: `GEMINI_API_ERROR` (502) vs `QUOTA_EXCEEDED` (429) — detecta 429/RESOURCE_EXHAUSTED
- Mensagens de erro em pt-BR na UI
- Badges de tipo de erro traduzidos (SyntaxError → "Erro de Sintaxe" etc.)
- Prompt instrui IA a responder `message` e `fix` em pt-BR
- Modelo: `gemini-2.5-flash-lite`

**apps/tools — página inicial:**
- Cards "Em breve" com `bg-muted` para aparecerem mais escuros que cards ativos

**apps/metronome — Wake Lock (spec 2026-06-04):**
- TASK-01: `src/hooks/use-wake-lock.ts` — hook reutilizável com guard de concorrência (`isAcquiringRef`), reativação em `visibilitychange`, graceful fallback para browsers sem suporte, Strict Mode compatível
- TASK-02: `useWakeLock(isPlaying)` em `use-metronome.ts` — interface pública inalterada

### 🔄 Em progresso
- (nenhum — todas as tasks concluídas e commitadas)

### ⏭ Próximos passos
1. Deploy do blog no Vercel (`blog.nico.dev.br`) e testar visual em produção
2. Gerar nova GEMINI_API_KEY válida e atualizar `apps/tools/.env.local` (chave atual sem quota free tier)
3. Implementar compartilhamento social (botões Share na página do post do blog)
4. Implementar scroll suave para âncoras no `SiteHeader.tsx` do `web-nico.dev.br`
5. Lighthouse audit no post imersivo (meta: ≥ 90 Performance)

---

## Decisões desta sessão

- `@google/genai` usa API diferente: `GoogleGenAI` + `ai.models.generateContent({ model, contents })` + `response.text` (property, não método)
- Erros da Gemini API agora split em dois códigos: `QUOTA_EXCEEDED` para 429/RESOURCE_EXHAUSTED, `GEMINI_API_ERROR` para demais falhas
- `useWakeLock` aceita `isActive: boolean` — desacoplado de `isPlaying`, reutilizável em outros contextos
- `isAcquiringRef` serializa chamadas assíncronas para evitar race condition em toggle rápido
- Wake Lock integrado internamente em `useMetronome` sem exposição na interface pública

---

## Bloqueadores / Perguntas abertas

- Chave GEMINI_API_KEY atual (`AQ.Ab8...`) tem `limit: 0` em todos os modelos free tier — precisa nova chave do AI Studio
- Deploy do blog não configurado no Vercel ainda
- Scroll suave para âncoras no `web-nico.dev.br` ainda pendente
- `NEXT_PUBLIC_METRONOME_URL` adicionada às envs mas metrônomo não tem URL de produção definida ainda
