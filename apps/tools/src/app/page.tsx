import Link from "next/link"
import { ItemCard } from "@ui"

type Tool = {
  slug: string
  name: string
  description: string
  icon: string
  status: "active" | "coming-soon"
  href?: string
}

const utilidades: Tool[] = [
  {
    slug: "pomodoro",
    name: "Pomodoro Timer",
    description: "Gerencie ciclos de trabalho focado com timer customizável, rastreamento de tarefas e histórico de produtividade.",
    icon: "🍅",
    status: "active",
    href: "/pomodoro",
  },
  {
    slug: "juros-compostos",
    name: "Juros Compostos",
    description: "Simule rendimento de investimentos com capital fixo ou aportes mensais. Gráfico e tabela detalhada.",
    icon: "📈",
    status: "active",
    href: "/juros-compostos",
  },
  {
    slug: "clt-pj",
    name: "CLT vs PJ",
    description: "Compare salário líquido entre regime CLT e PJ de forma simples.",
    icon: "💰",
    status: "active",
    href: "/clt-pj",
  },
  {
    slug: "conversor-moedas",
    name: "Conversor de Moedas",
    description: "Converta entre moedas fiat e criptomoedas. Histórico de até 5 anos, cotações em BRL e USD e variação 24h.",
    icon: "💱",
    status: "active",
    href: "/conversor-moedas",
  },
  {
    slug: "metronome",
    name: "Metrônomo",
    description: "Metrônomo online audiovisual para músicos. Controle de BPM, beats, subdivisões e acento no primeiro tempo.",
    icon: "🎵",
    status: "active",
    href: "https://metronomo.nico.dev.br",
  },
  {
    slug: "weather",
    name: "Dashboard de Clima",
    description: "Previsão do tempo por localidade com dados atualizados em tempo real.",
    icon: "🌤️",
    status: "coming-soon",
  },
  {
    slug: "leitor-documentos",
    name: "Leitor de Documentos",
    description: "Extraia resumo, tipo e pontos-chave de PDFs, imagens e textos. Faça perguntas livres sobre o conteúdo com IA.",
    icon: "📄",
    status: "active",
    href: "/leitor-documentos",
  },
  {
    slug: "market",
    name: "Mercado Financeiro",
    description: "Cotações, variações e histórico de ações B3, FIIs, índices e criptomoedas.",
    icon: "💹",
    status: "active",
    href: "/mercado",
  },
]

const ferramentasParaDevs: Tool[] = [
  {
    slug: "debug-code",
    name: "Debug Code",
    description: "Cole seu código e receba versão corrigida com apontamento de erros. Powered by Gemini.",
    icon: "🐛",
    status: "active",
    href: "/debug-code",
  },
  {
    slug: "analisador-texto",
    name: "Analisador de Texto",
    description: "Sentimento, entidades, resumo, insights e versão humanizada de qualquer texto. Powered by Gemini.",
    icon: "🧠",
    status: "active",
    href: "/analisador-texto",
  },
  {
    slug: "gerador-paleta",
    name: "Gerador de Paleta de Cores",
    description: "Gere paletas harmônicas com IA. Escolha cor base, tipo de harmonia e quantidade. Exporte em CSS, SCSS, JSON ou Tailwind.",
    icon: "🎨",
    status: "active",
    href: "/gerador-paleta",
  },
]

export default function HomePage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <header className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">tools.nico.dev</p>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Ferramentas úteis
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Coleção de utilidades web para o dia a dia. Cada ferramenta resolve um problema real de forma simples e direta.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Utilidades</h2>
        <ToolGrid tools={utilidades} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Ferramentas para devs</h2>
        <ToolGrid tools={ferramentasParaDevs} />
      </section>
    </main>
  )
}

function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => {
        const media = (
          <span className="text-3xl block px-5 pt-5" aria-hidden="true">
            {tool.icon}
          </span>
        )

        if (tool.status === "active" && tool.href) {
          return (
            <Link key={tool.slug} href={tool.href}>
              <ItemCard
                media={media}
                title={tool.name}
                description={tool.description}
                className="hover:border-primary/50 transition-colors cursor-pointer h-full"
              />
            </Link>
          )
        }

        return (
          <div key={tool.slug} className="relative opacity-60 cursor-not-allowed">
            <ItemCard
              media={media}
              title={tool.name}
              description={tool.description}
              className="bg-muted"
            />
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Em breve
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
