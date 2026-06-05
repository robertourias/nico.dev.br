# Spec: Pomodoro Timer Tool

**Status:** approved
**Data:** 2026-06-05
**Autor:** PLANNER

---

## Problema

Usuários em busca de produtividade carecem de uma ferramenta integrada para gerenciar ciclos de trabalho focado (Pomodoro) com rastreamento de tarefas. Referência: pomofocus.io. A ferramenta deve permitir customização completa dos ciclos, criação e gestão de tasks, e manutenção de histórico local sem autenticação.

---

## Cenários de Usuário

- **P1 (crítico):** Como indivíduo, quero iniciar um ciclo Pomodoro customizável (25 min trabalho + 5 min pausa) e receber notificação (som + visual) ao término, para manter foco sem verificar relógio manualmente.
- **P1 (crítico):** Como indivíduo, quero criar múltiplas tasks e selecionar qual rodar em cada ciclo, para organizar meu trabalho do dia.
- **P2 (importante):** Como indivíduo, quero ver histórico de tasks completadas (quantos ciclos levou, tempo real gasto), para avaliar minha produtividade.
- **P2 (importante):** Como indivíduo, quero que o timer continua rodando se mudo de aba/janela, com um widget flutuante em miniatura no canto inferior da tela (desktop), para não perder ciclos ao navegar.
- **P3 (nice-to-have):** Como indivíduo, quero modo dark/light automático conforme tema do site, para consistência visual.

---

## Requisitos Funcionais

- **FR-001:** Timer customizável com campos: duração do ciclo de trabalho (min), pausa curta (min), número de ciclos antes de pausa longa, duração da pausa longa (min). Salvar presets em localStorage.
- **FR-002:** CRUD de tasks (criar, listar, editar, deletar, marcar como completa). Cada task armazena: título, descrição (opcional), ciclos estimados.
- **FR-003:** Ao completar ciclo, exibir notificação sonora + transição visual clara (cor, animação) indicando se é trabalho → pausa ou pausa → trabalho.
- **FR-004:** Rastreamento automático: ao completar task, registrar no histórico (timestamp de conclusão, ciclos reais gastos, tempo real gasto em minutos).
- **FR-005:** Persistência em localStorage: configurações de timer, lista de tasks (ativas + histórico), estado atual do ciclo.
- **FR-006 (Desktop):** Widget flutuante em miniatura no canto inferior direito ao navegar para outra aba/ferramenta, exibindo contador de tempo atual. Usuário pode fechar ou retornar à tela completa.
- **FR-007:** Interface responsiva (mobile, tablet, desktop). Dark mode como padrão visual do site.
- **FR-008:** Timer continua rodando mesmo se aba perde foco (usar Web Worker ou service worker para precisão).

---

## Critérios de Sucesso

- [ ] Usuário consegue configurar tempos de ciclo, iniciar ciclo, e receber som + notificação visual ao término.
- [ ] Usuário cria, edita, deleta tasks e marca como completas sem recarregar página.
- [ ] Histórico de tasks completadas está acessível com dados: data conclusão, ciclos levados, tempo real.
- [ ] Timer em miniatura flutua no canto inferior ao trocar de aba (desktop); funciona em mobile sem widget.
- [ ] Todos os dados (config, tasks, histórico) persistem após recarregar página.
- [ ] Interface responde em < 100ms a interações (cliques, input).

---

## Fora do Escopo

- Autenticação de usuário (localStorage only, sem sincronização cross-device).
- Relatórios avançados (gráficos, exportação CSV, etc.) — histórico é apenas visual/tabulado.
- Integração com calendários, Slack, Discord ou ferramentas externas.
- Modo colaborativo ou compartilhamento de tasks.
- Customização avançada de sons/temas (som padrão, tema light/dark fixo).

---

## Riscos e Premissas

- **Premissa:** localStorage tem limite ~5-10MB; número de tasks + histórico não excederá esse limite em uso normal.
- **Premissa:** Web Worker ou técnica similar é viável para manter timer preciso durante troca de abas (browsers modernos suportam).
- **Risco:** Timer pode perder precisão se dispositivo dorme ou suspenso → Mitigação: usar `Date.now()` para sincronização ao retomar foco.
- **Risco:** Widget flutuante pode conflitar com outras ferramentas do site → Mitigação: z-index alto, controle de posição relativo ao viewport.
- **Risco:** Som pode não disparar em alguns navegadores (autoplay policy restritiva) → Mitigação: primeira interação do usuário desbloqueia áudio context.

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
