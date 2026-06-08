# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-07
**Resumo da última sessão:** Ajustes visuais na página `/pomodoro`: layout do timer compactado, controles viram accordions recolhidos por padrão, botão de configurações fixo no canto superior direito, controles em modo ícone-only no mobile.

---

## Feature em andamento

**Spec ativo:** (nenhum — ajustes visuais pontuais, sem spec formal)
**Plano ativo:** (nenhum)

---

## Tasks

### ✅ Concluídas

**apps/tools — Pomodoro (`/pomodoro`) — ajustes visuais:**
- Removido header com título "Pomodoro Timer"; botão de configurações saiu do header
- Botão de configurações agora fixo (`fixed top-20 right-4`) como ícone no canto superior direito
- Contador (`TimerDisplay`) reduzido (`w-64→w-36`, fonte `text-6xl→text-4xl`), legenda de fase removida (`getPhaseLabel` deletado)
- Espaçamento entre indicador de fase e contador reduzido (`gap-4→gap-1`)
- Botões de controle (Retomar/Pausar/Pular/Parar/Iniciar): no mobile mostram apenas ícone (`<span className="hidden sm:inline">label</span>`); "Parar" trocou texto por ícone `Square` (lucide-react)
- Seções "Tarefas" e "Histórico & Estatísticas" viram accordions recolhidos por padrão (`tasksOpen`/`historyOpen` state + `ChevronDown` rotativo)
- `TaskList` e `HistoryPanel` ganharam prop `hideTitle` para evitar título duplicado dentro do accordion
- Commit: `b557443 refactor(tools/pomodoro): collapse panels into accordions, trim timer UI`

### 🔄 Em progresso
- (nenhum — todas as tasks concluídas)

### ⏭ Próximos passos
1. Testar autenticação Yahoo Finance (crumb) em produção — verificar se `fc.yahoo.com` responde corretamente no Vercel
2. Gerar nova GEMINI_API_KEY válida e atualizar `apps/tools/.env.local` (chave atual sem quota free tier)
3. Deploy do blog no Vercel (`blog.nico.dev.br`) e testar visual em produção
4. Implementar compartilhamento social (botões Share na página do post do blog)
5. Lighthouse audit no post imersivo do blog (meta: ≥ 90 Performance)

---

## Decisões desta sessão

- Accordion implementado via state local (`useState` + render condicional) em vez de componente de UI compartilhado — escopo pequeno, não justifica nova abstração em `@nico.dev/ui`
- Título das seções movido para o header do accordion; `hideTitle` evita duplicação sem quebrar API existente dos componentes (prop opcional, default `false`)
- Botão de configurações centralizado num único local fixo (top-right) em vez de duplicado por estado de sessão — simplifica e evita inconsistência visual

---

## Bloqueadores / Perguntas abertas

- Crumb Yahoo Finance precisa de validação em ambiente de produção (IP de servidor pode ser bloqueado)
- Chave GEMINI_API_KEY atual (`AQ.Ab8...`) tem `limit: 0` em todos os modelos free tier — precisa nova chave do AI Studio
- Deploy do blog não configurado no Vercel ainda
- `brapi.ts` em `apps/tools/src/lib/mercado/` — arquivo morto, remover
