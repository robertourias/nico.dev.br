# Pomodoro Timer

Ferramenta de Pomodoro com rastreamento de tarefas, timer customizável e histórico de produtividade.

## Features

- ✅ **Timer Customizável**: Configure trabalho, pausas curtas e longas
- ✅ **Gestão de Tarefas**: CRUD completo de tasks com estimativas
- ✅ **Histórico & Estatísticas**: Rastreie tarefas completadas e tempo gasto
- ✅ **Som & Notificações**: Alerta audiovisual ao término de ciclos
- ✅ **Persistência**: localStorage automático — nenhuma conta necessária
- ✅ **Web Worker**: Timer continua em background tabs
- ✅ **Dark Mode**: Tema automático conforme site
- ✅ **Responsivo**: Mobile, tablet, desktop

## Como Usar

### Começar um Ciclo

1. Clique em "Nova Tarefa" e adicione uma task
2. Clique em uma task para selecioná-la
3. Clique "Iniciar" para começar o timer

### Configurar Timer

1. Clique em ⚙️ (Settings)
2. Customize:
   - **Duração do Trabalho** (min)
   - **Pausa Curta** (min)
   - **Ciclos antes de Pausa Longa**
   - **Duração da Pausa Longa** (min)
3. Salve

### Controles During Ciclo

- **Retomar**: Resume timer pausado
- **Pausar**: Pause timer atual
- **Pular**: Avança para próxima fase
- **Parar**: Cancela ciclo

### Histórico

Na aba "Histórico & Estatísticas", veja:
- Total de tarefas completadas
- Ciclos gastos
- Tempo total
- Média por tarefa

## Arquitetura

```
domain/pomodoro/        → Timer, Task, History, Config (lógica pura)
infra/storage/          → localStorage adapter
infra/worker/           → Web Worker para timer background
_components/            → 6 componentes UI reutilizáveis
_hooks/                 → 4 custom hooks para estado
_utils/                 → Utilitários (som, sincronização)
```

## Dados Salvos (localStorage)

```
pomodoro:config    → Configurações de timer
pomodoro:tasks     → Lista de tasks
pomodoro:session   → Sessão atual (se em progresso)
pomodoro:history   → Histórico de tasks completadas
```

## Limites

- localStorage ~5-10MB (raramente atingido em uso normal)
- Sem sincronização cross-device (localStorage é local)
- Sem autenticação

## Troubleshooting

### Som não toca
- Verifique volume do navegador
- Clique em qualquer botão primeiro (desbloqueia AudioContext)
- Alguns navegadores bloqueiam áudio automático

### Timer parou ao trocar de aba
- Use Web Worker (automático em navegadores modernos)
- Fallback: setInterval em browsers antigos
- Não durará > 30 min com aba escondida (sistema de economia)

### Dados desapareceram
- localStorage foi limpo (pressione F12 → Storage → Clear)
- Domínio mudou (localhost vs 127.0.0.1)
- Navegador privado/incógnito (dados deletados ao fechar)

## Performance

- < 100ms resposta em interações
- Bundle ~15KB (gzipped)
- Web Worker de-clutters main thread
- Lazy-loaded: componentes pesados carregam sob demanda

## Próximas Melhorias

- [ ] Floating widget refinements (desktop)
- [ ] Cloud sync com autenticação
- [ ] Integração com calendários
- [ ] Export de histórico (CSV, JSON)
- [ ] Temas customizáveis
- [ ] Notificação do sistema (Web Notifications API)
