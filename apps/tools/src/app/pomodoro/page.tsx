import { PomodoroApp } from './_components/PomodoroApp';

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'Ferramenta de Pomodoro com rastreamento de tarefas',
  icons: { icon: '/pomodoro-logo.svg' },
};

export default function PomodoroPage() {
  return <PomodoroApp />;
}
