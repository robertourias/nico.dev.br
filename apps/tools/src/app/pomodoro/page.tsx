import { PomodoroApp } from './_components/PomodoroApp';

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'Ferramenta de Pomodoro com rastreamento de tarefas',
  icons: { icon: '/pomodoro-favicon.ico' },
};

export default function PomodoroPage() {
  return <PomodoroApp />;
}
