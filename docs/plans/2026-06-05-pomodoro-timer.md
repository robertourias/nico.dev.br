# Plano Técnico: Pomodoro Timer Tool

**Status:** Planejamento
**Data:** 2026-06-05
**Escopo:** apps/tools (Next.js + Tailwind + localStorage)

---

## Visão Geral

Decomposição da feature Pomodoro Timer em 9 tarefas ordenadas logicamente. App frontend-only sem backend, usando localStorage para persistência e Web Worker para timer resiliente em background tabs.

---

## Contratos de Dados

### Schema de localStorage

```typescript
// Configuração do timer (salva em pomodoro:config)
interface TimerConfig {
  workDuration: number;        // minutos
  shortBreakDuration: number;  // minutos
  longBreakInterval: number;   // número de ciclos antes de long break
  longBreakDuration: number;   // minutos
}

// Task (salva em pomodoro:tasks)
interface Task {
  id: string;                  // UUID
  title: string;
  description?: string;
  estimatedCycles: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: number;           // timestamp
  completedAt?: number;        // timestamp
}

// Sessão em progresso (salva em pomodoro:session)
interface PomodoroSession {
  taskId: string | null;
  cycleCount: number;          // número de ciclos completados
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  secondsRemaining: number;
  startedAt: number;           // timestamp
  paused: boolean;
}

// Histórico de task completada (array em pomodoro:history)
interface CompletedTaskRecord {
  taskId: string;
  taskTitle: string;
  completedAt: number;         // timestamp
  cyclesToComplete: number;
  realTimeMinutes: number;
}

// Estado global (union de tudo)
interface PomodoroAppState {
  config: TimerConfig;
  tasks: Task[];
  currentSession: PomodoroSession;
  history: CompletedTaskRecord[];
}
```

### Eventos de domínio (para comunicação com Web Worker)

```typescript
// Main → Worker
type WorkerMessage = 
  | { type: 'START'; durationSeconds: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'SYNC_TIME'; serverTime: number };

// Worker → Main
type WorkerResponse = 
  | { type: 'TICK'; secondsRemaining: number }
  | { type: 'COMPLETE' }
  | { type: 'TIME_SYNC'; drift: number };
```

---

## Tarefas de Implementação

### Tarefa 1: Entidades de Domínio e Value Objects

**Tipo:** feature  
**Agente:** frontend

Criar tipos TypeScript e classes de domínio puras (sem dependências de framework, localStorage ou React). Estas são a base imutável do business logic.

**Implementação:**

1. Arquivo: `apps/tools/src/domain/pomodoro/Timer.ts`
   - Classe `Timer` com métodos `start()`, `pause()`, `resume()`, `reset()`, `getRemainingSeconds()`
   - Cálculo de fase (work → shortBreak → work → ... → longBreak) baseado em `cycleCount`
   - Nenhuma dependência externa, apenas lógica pura

2. Arquivo: `apps/tools/src/domain/pomodoro/Task.ts`
   - Value Object `TaskId` e classe `Task` imutável
   - Métodos: `isCompleted()`, `getRemainingCycles(actualCyclesUsed: number)`

3. Arquivo: `apps/tools/src/domain/pomodoro/History.ts`
   - Class `HistoryRecord` com agregação de task completada
   - Método `calculateProductivity()` (tarefas/horas)

4. Arquivo: `apps/tools/src/domain/pomodoro/config.ts`
   - Value Object `TimerConfig` com validação (durations > 0)
   - Factory method `createDefaultConfig(): TimerConfig`

**Critérios de Aceite:**
- [ ] Todos os tipos compilam sem erros TypeScript
- [ ] Métodos de cálculo retornam valores esperados (unit tests)
- [ ] Nenhuma dependência de `localStorage`, `React`, `Next.js`
- [ ] Imutabilidade garantida (sem mutações de estado)

**Notas:**  
Ubicação: `apps/tools/src/domain/pomodoro/` — core business logic. Sem testes (unit tests vêm em tarefa 8).

---

### Tarefa 2: Service de Persistência em localStorage

**Tipo:** feature  
**Agente:** frontend

Implementar camada de persistência abstrata para localStorage, permitindo salvar/carregar estado do app.

**Implementação:**

1. Arquivo: `apps/tools/src/infra/storage/StorageAdapter.ts`
   - Interface `StorageAdapter` com métodos `save(key, value)`, `load(key)`, `delete(key)`, `clear()`
   - Classe `LocalStorageAdapter` implementando interface
   - Validação de quota (localStorage ~5MB)
   - Error handling para cenários de full quota

2. Arquivo: `apps/tools/src/infra/storage/PomodoroStorage.ts`
   - Classe `PomodoroStorage` usando `StorageAdapter`
   - Métodos: `saveConfig()`, `loadConfig()`, `saveTasks()`, `loadTasks()`, `saveSession()`, `loadSession()`, `addHistoryRecord()`, `loadHistory()`
   - Serialização/desserialização JSON com tratamento de datas

**Critérios de Aceite:**
- [ ] Todos os métodos salvam e carregam dados corretamente
- [ ] Dados persistem após reload da página
- [ ] Erros de quota são tratados graciosamente
- [ ] Datas (timestamps) são preservadas exatamente

**Notas:**  
Ubicação: `apps/tools/src/infra/storage/` — abstração de persistência. Não depende de React.

---

### Tarefa 3: Web Worker para Timer Resiliente

**Tipo:** feature  
**Agente:** frontend

Implementar Web Worker que mantém precisão do timer mesmo quando aba perde foco ou JavaScript é pausado.

**Implementação:**

1. Arquivo: `apps/tools/public/workers/timer.worker.ts`
   - Listener para mensagens `START`, `PAUSE`, `RESUME`, `STOP`, `SYNC_TIME`
   - Usa `setInterval()` ou `requestAnimationFrame()` para tick
   - Calcula drift comparando `Date.now()` com tempo esperado
   - Envia `TICK` messages e `COMPLETE` no fim

2. Arquivo: `apps/tools/src/infra/worker/TimerWorkerManager.ts`
   - Classe que encapsula comunicação com Web Worker
   - Fila de mensagens se worker não iniciado
   - Fallback para `setInterval()` se Web Workers não suportado

**Critérios de Aceite:**
- [ ] Worker mantém timer correto mesmo com aba inativa por 30+ segundos
- [ ] Não há memory leaks (worker limpado ao parar)
- [ ] Fallback funciona em browsers sem Web Workers
- [ ] Drift calculado e reportado corretamente

**Notas:**  
Critical para FR-008. Web Worker roda separado do thread principal.

---

### Tarefa 4: Hooks de Estado e Lógica de Frontend (usePomodoro)

**Tipo:** feature  
**Agente:** frontend

Hooks React que gerenciam estado local do timer e sincronização com localStorage.

**Implementação:**

1. Arquivo: `apps/tools/src/hooks/useTimerConfig.ts`
   - Hook `useTimerConfig()` que carrega config do storage e oferece `updateConfig()`
   - Re-renders somente quando config muda

2. Arquivo: `apps/tools/src/hooks/usePomodoroSession.ts`
   - Hook `usePomodoroSession()` que gerencia sessão atual (tarefa ativa, fase, tempo restante)
   - Métodos: `startCycle(taskId)`, `pause()`, `resume()`, `skipToNextPhase()`, `stopSession()`
   - Integra com `TimerWorkerManager` e `PomodoroStorage`
   - Ao completar ciclo, calcula se próxima fase é long break

3. Arquivo: `apps/tools/src/hooks/useTaskManager.ts`
   - Hook `useTaskManager()` para CRUD de tasks
   - Métodos: `addTask(title, description, estimatedCycles)`, `updateTask(id, fields)`, `deleteTask(id)`, `completeTask(id)`
   - Salva em localStorage automaticamente

4. Arquivo: `apps/tools/src/hooks/useHistory.ts`
   - Hook `useHistory()` para acessar histórico de tasks completadas
   - Método `getCycleHistory(taskId)` para filtrar por task

**Critérios de Aceite:**
- [ ] Estado sincroniza com localStorage em cada mudança
- [ ] Hooks não causam renders desnecessários
- [ ] Ao recarregar página, estado é recuperado corretamente
- [ ] Transições entre fases (work → break) disparam som e notificação

**Notas:**  
Ubicación: `apps/tools/src/hooks/` — lógica reutilizável. Use `useEffect()` para side effects com localStorage.

---

### Tarefa 5: Componentes Reutilizáveis (sem rota)

**Tipo:** feature  
**Agente:** frontend

Componentes básicos reutilizáveis que formam a UI. Usam `packages/ui` como design system.

**Implementação:**

1. Arquivo: `apps/tools/src/components/TimerDisplay.tsx`
   - Componente que exibe contador (MM:SS ou HH:MM:SS)
   - Props: `secondsRemaining: number`, `phase: 'work' | 'shortBreak' | 'longBreak'`, `isRunning: boolean`
   - Animação de cores por fase (work = blue, break = green, long break = purple)
   - Uso de Tailwind classes do design system

2. Arquivo: `apps/tools/src/components/PhaseIndicator.tsx`
   - Badge que mostra fase atual e ciclo number (ex: "Work | Cycle 1 of 4")
   - Props: `phase`, `cycleCount`, `longBreakInterval`

3. Arquivo: `apps/tools/src/components/TaskList.tsx`
   - Lista de tasks com checkbox de conclusão, edição inline, delete
   - Props: `tasks: Task[]`, `onSelectTask`, `onCompleteTask`, `onDeleteTask`, `onEditTask`
   - Destaca task ativa

4. Arquivo: `apps/tools/src/components/HistoryPanel.tsx`
   - Tabela ou lista de tasks completadas com colunas: título, data, ciclos, tempo real
   - Props: `records: CompletedTaskRecord[]`
   - Filtro por período (today, week, month)

5. Arquivo: `apps/tools/src/components/ConfigModal.tsx`
   - Modal para editar `TimerConfig` (4 inputs numéricos)
   - Props: `config`, `onSave`, `onCancel`
   - Validação (valores > 0)

6. Arquivo: `apps/tools/src/components/FloatingTimerWidget.tsx` (Desktop only)
   - Miniatura flutuante do timer no canto inferior direito
   - Props: `secondsRemaining`, `phase`, `isVisible`, `onClose`, `onRestore`
   - z-index alto, posição fixa

**Critérios de Aceite:**
- [ ] Todos componentes renderizam sem erros
- [ ] Usam `@nico.dev/ui` (não instalam libs alternativas)
- [ ] Tailwind dark mode é suportado
- [ ] Props bem documentadas em JSDoc
- [ ] Responsivos (mobile-first)

**Notas:**  
Ubicación: `apps/tools/src/components/` — componentes dumb/presentation. Sem lógica de negócio.

---

### Tarefa 6: Página Pomodoro e Rotas

**Tipo:** feature  
**Agente:** frontend

Página principal e layout que orquestra hooks + componentes.

**Implementação:**

1. Arquivo: `apps/tools/src/app/tools/pomodoro/page.tsx` (Next.js App Router)
   - Server component que chama client components
   - Layout com 3 colunas: Timer | TaskList | History (responsive em mobile = stack vertical)

2. Arquivo: `apps/tools/src/app/tools/pomodoro/layout.tsx`
   - Layout que inicia `TimerWorkerManager` e carrega estado do storage no mount
   - Context `PomodoroContext` que passa `usePomodoro*` hooks para página

3. Arquivo: `apps/tools/src/components/PomodoroApp.tsx` (Client component)
   - Integra `useTimerConfig()`, `usePomodoroSession()`, `useTaskManager()`, `useHistory()`
   - Controla qual componente renderizar (idle, running, paused, history view)
   - Buttons: Start, Pause, Resume, Skip Phase, Settings, Clear History
   - Sonoro: `src/utils/playNotificationSound.ts` que dispara `.mp3` ao completar fase

4. Arquivo: `apps/tools/src/utils/playNotificationSound.ts`
   - Função que toca som de notificação
   - Obtém permissão de áudio após primeira interação do usuário
   - Fallback se som bloqueado (silent mode)

**Critérios de Aceite:**
- [ ] Página carrega com config padrão ou config salva
- [ ] Timer inicia, conta regressiva, e completa
- [ ] Som dispara ao completar fase
- [ ] Tasks podem ser adicionadas, selecionadas, e completadas
- [ ] Histórico persiste entre reloads
- [ ] Mobile responsivo sem widget flutuante

**Notas:**  
Ubicación: `apps/tools/src/app/` — App Router do Next.js. Client component + server component.

---

### Tarefa 7: Widget Flutuante (Desktop) e Sincronização Entre Abas

**Tipo:** feature  
**Agente:** frontend

Implementar floating widget para desktop quando usuário muda de aba, e sincronização de estado entre abas/janelas.

**Implementação:**

1. Arquivo: `apps/tools/src/hooks/useFloatingWidget.ts`
   - Hook que detecta se aba perdeu foco (`document.visibilityChange`)
   - Se desktop (media query), exibe floating widget
   - Sincroniza estado com Web Worker

2. Arquivo: `apps/tools/src/components/PageContainer.tsx`
   - Componente wrapper que renderiza página principal + floating widget (desktop)
   - Detecta mobile vs desktop com Tailwind `hidden md:block`

3. Arquivo: `apps/tools/src/utils/tabSynchronization.ts`
   - Usa `BroadcastChannel` ou `localStorage` events para sincronizar entre abas
   - Se outra aba modifica tasks/history, carrega mudanças
   - Garante que timer não roda em 2 abas simultaneamente

**Critérios de Aceite:**
- [ ] Widget aparece ao mudar de aba no desktop
- [ ] Widget mostra contador correto sincronizado com worker
- [ ] Usuário pode fechar widget (volta ao background)
- [ ] Usuário clica em widget para voltar à página completa
- [ ] Mobile não mostra widget
- [ ] Múltiplas abas abertas sincronizam sem conflito

**Notas:**  
Ubicación: `apps/tools/src/` — hooks + components + utils. Complexidade: FR-006 + FR-008.

---

### Tarefa 8: Testes Unitários e de Integração

**Tipo:** feature  
**Agente:** frontend

Cobertura de testes para lógica de domínio, hooks, e comportamentos críticos.

**Implementação:**

1. Arquivo: `apps/tools/src/__tests__/domain/Timer.test.ts`
   - Testes do Timer: startTime, pause/resume, phase transitions, long break calculation

2. Arquivo: `apps/tools/src/__tests__/domain/Task.test.ts`
   - Testes de Task: immutability, completion tracking

3. Arquivo: `apps/tools/src/__tests__/hooks/usePomodoroSession.test.tsx`
   - Renderização de hook em test environment
   - Testes de start cycle, pause, resume, complete cycle

4. Arquivo: `apps/tools/src/__tests__/hooks/useTaskManager.test.tsx`
   - CRUD operations em hook

5. Arquivo: `apps/tools/src/__tests__/infra/LocalStorageAdapter.test.ts`
   - Testes de save/load/delete com mock de localStorage

6. Arquivo: `apps/tools/src/__tests__/utils/tabSynchronization.test.ts`
   - Testes de sincronização entre abas (mock BroadcastChannel)

**Critérios de Aceite:**
- [ ] Todos os arquivos `.test.ts` rodam com `pnpm test`
- [ ] Cobertura > 80% nas funções críticas (Timer, Task, hooks)
- [ ] Testes passam em CI/CD (GitHub Actions)
- [ ] Não há memory leaks em hooks (cleanup verificado)

**Notas:**  
Framework: Jest (padrão do Turborepo). Fixtures de dados em `__tests__/fixtures/`.

---

### Tarefa 9: Testes E2E e Documentação

**Tipo:** feature  
**Agente:** frontend

Testes end-to-end simulando usuário real, e documentação de uso.

**Implementação:**

1. Arquivo: `apps/tools/e2e/pomodoro.e2e.ts` (Playwright ou Cypress)
   - Cenário 1: Usuário inicia timer, espera conclusão, recebe notificação
   - Cenário 2: Usuário cria task, inicia ciclo com task, completa, vê histórico
   - Cenário 3: Usuário customiza config, timer respeita novos valores
   - Cenário 4: Desktop: usuário muda de aba, widget flutua, clica para voltar

2. Arquivo: `apps/tools/docs/tools/pomodoro.md` (Markdown)
   - Como usar a ferramenta (interface, buttons)
   - FAQ: "Por que o som não dispara?", "Como sync entre dispositivos?", "Limite de tasks?"
   - Exemplos de workflows (pomodoro clássico, custom intervals)

3. Arquivo: `apps/tools/README.md` (atualizado)
   - Links para todas as ferramentas, incluindo Pomodoro

**Critérios de Aceite:**
- [ ] Testes E2E passam no navegador real (Chrome, Firefox)
- [ ] Documentação é clara e acessível
- [ ] FAQ responde questões comuns

**Notas:**  
Framework E2E: Playwright (padrão do Vercel). Rodam em CI/CD.

---

## Dependências e Ordem de Execução

```
Tarefa 1 (Domain)
    ↓
Tarefa 2 (Storage)
    ↓
Tarefa 3 (Worker) ← parallelizável com Tarefa 2
    ↓
Tarefa 4 (Hooks) ← depende de 1, 2, 3
    ↓
Tarefa 5 (Components) ← depende de 4
    ↓
Tarefa 6 (Page) ← depende de 4, 5
    ↓
Tarefa 7 (Floating Widget) ← depende de 4, 5, 6
    ↓
Tarefa 8 (Unit Tests) ← roda em paralelo com 1-7
    ↓
Tarefa 9 (E2E + Docs) ← roda após 6-7
```

---

## Milestones

| Milestone | Tarefas | ETA |
|-----------|---------|-----|
| Domain & Storage | 1, 2 | ~2h |
| Timer Core | 3, 4 | ~3h |
| UI Base | 5, 6 | ~4h |
| Advanced Features | 7 | ~2h |
| QA & Docs | 8, 9 | ~3h |
| **Total** | | ~14h |

---

## Riscos

1. **Web Worker em navegadores antigos:** Fallback obrigatório em Tarefa 3.
2. **localStorage quota exceeded:** Cleanup automático de histórico antigo (deletar records > 30 dias) em Tarefa 2.
3. **Sincronização entre abas:** BroadcastChannel pode não suportar todos navegadores — usar localStorage fallback em Tarefa 7.
4. **Precisão do timer:** Validar com testes que drift < 1s em 5 minutos.

---

## Próximos Passos

1. **Agente Frontend** executa Tarefas 1-9 em ordem (ou paralelo onde possível).
2. **Code Review** após cada tarefa de componente (5-9).
3. **QA** testa em mobile + desktop + múltiplas abas.
4. **Deploy** em `apps/tools` → `tools.nico.dev/pomodoro`.

