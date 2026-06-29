import {
  Briefcase,
  DollarSign,
  Building2,
  GitBranch,
  GraduationCap,
  GitCompareArrows,
  Bot,
  UserCircle,
  Trophy,
  BellRing,
  BookOpen,
  FileSearch,
} from "lucide-react"
import { Reveal } from "./Reveal"

const FEATURES = [
  {
    icon: Briefcase,
    title: "Busca de vagas",
    description: "Filtre por cargo, stack, senioridade, modelo de trabalho e tipo de contratação em um só lugar.",
    href: "#vagas",
  },
  {
    icon: DollarSign,
    title: "Pesquisa de salários",
    description: "Compare faixas salariais por cargo, tecnologia, cidade e nível de senioridade.",
    href: "#salarios",
  },
  {
    icon: Building2,
    title: "Empresas",
    description: "Perfis com stack predominante, avaliação, benefícios e vagas abertas de cada empresa.",
    href: "#empresas",
  },
  {
    icon: GitBranch,
    title: "Roadmaps interativos",
    description: "Trilhas completas por área, com etapas, recursos e acompanhamento de progresso.",
    href: "#roadmaps",
  },
  {
    icon: GraduationCap,
    title: "Trilhas de aprendizado",
    description: "Módulos por categoria — Frontend, Backend, Cloud, Dados, IA, Segurança e mais.",
    href: "#roadmaps",
  },
  {
    icon: GitCompareArrows,
    title: "Comparador de carreiras",
    description: "Salário, vagas, dificuldade, concorrência e tempo médio para entrar em cada área.",
    href: "#comparador",
  },
  {
    icon: Bot,
    title: "Assistente de IA",
    description: "Chat especializado em carreira: negociação salarial, transições, certificações e mais.",
    href: "#assistente",
  },
  {
    icon: UserCircle,
    title: "Perfil profissional",
    description: "Centralize experiência, projetos, certificações e objetivos de carreira.",
    href: "#planos",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description: "XP, conquistas, sequência diária e badges por roadmaps e projetos concluídos.",
    href: "#gamificacao",
  },
  {
    icon: FileSearch,
    title: "Análise de currículo",
    description: "Score ATS, palavras-chave e sugestões de melhoria para destacar seu currículo.",
    href: "#planos",
  },
  {
    icon: BellRing,
    title: "Alertas inteligentes",
    description: "Notificações de novas vagas, mudanças salariais e tecnologias em alta.",
    href: "#planos",
  },
  {
    icon: BookOpen,
    title: "Biblioteca tech",
    description: "Artigos, guias de arquitetura, boas práticas e conteúdo de soft skills e liderança.",
    href: "#planos",
  },
]

// Grid de módulos do portal — visão geral de todas as funcionalidades do
// briefing. Cada card é um anchor para a seção correspondente (quando
// existe) nesta própria landing.
export function FeaturesGrid() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="features-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// tudo_em_um_so_lugar</p>
          <h2 id="features-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-4">
            Seu centro de <span className="devpath-gradient-text">carreira em tecnologia</span>
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Do primeiro estágio ao cargo de liderança: tudo que você precisa para encontrar oportunidades e evoluir,
            sem precisar consultar dezenas de sites diferentes.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Reveal key={feature.title} delayMs={Math.min(i, 5) * 60}>
                <a
                  href={feature.href}
                  className="devpath-card-hover group flex flex-col gap-4 rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-6 h-full"
                >
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl text-[var(--devpath-green)] bg-[rgba(52,211,153,0.1)] group-hover:bg-[rgba(52,211,153,0.18)] transition-colors"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--devpath-fg)] mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-[var(--devpath-fg-muted)] leading-relaxed">{feature.description}</p>
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
