export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function requestNotificationPermission(): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

const PHASE_MESSAGES: Record<string, { title: string; body: string }> = {
  work: { title: 'Hora de focar! 🍅', body: 'Comece o próximo ciclo de trabalho.' },
  shortBreak: { title: 'Pausa curta! ☕', body: 'Descanse por alguns minutos.' },
  longBreak: { title: 'Pausa longa! 🛋️', body: 'Você merece um descanso maior.' },
};

export function sendPhaseNotification(phase: string): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  const msg = PHASE_MESSAGES[phase];
  if (!msg) return;
  try {
    new Notification(msg.title, { body: msg.body });
  } catch {
    // ignore — Notification API may be unavailable in some contexts
  }
}
