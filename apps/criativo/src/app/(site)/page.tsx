import Link from "next/link"
import { ItemCard } from "@ui"

type Page = {
  slug: string
  name: string
  description: string
  icon: string
  status: "active" | "coming-soon"
  href?: string
}

// Cada landing page de campanha vive em sua própria rota com tema e
// componentes independentes (ver src/app/<slug>/). Para listar uma nova
// página aqui, basta adicionar uma entrada — não há acoplamento com a
// implementação da página em si.
const campanhas: Page[] = [
  {
    slug: "landing-newsletter-premium",
    name: "Newsletter Premium",
    description: "Landing de captura de assinantes para newsletter premium de IA, tecnologia e produtividade.",
    icon: "✉️",
    status: "active",
    href: "/landing-newsletter-premium",
  },
  {
    slug: "desafio-30-dias-habitos",
    name: "Desafio 30 Dias de Hábitos",
    description: "Landing de captura de leads para desafio gratuito de 30 dias de hábitos por e-mail.",
    icon: "📅",
    status: "active",
    href: "/desafio-30-dias-habitos",
  },
  {
    slug: "pre-venda-metodo-apice",
    name: "Pré-venda Método Ápice",
    description: "Landing de pré-venda e lista de espera para lançamento de produto digital, com identidade visual exclusiva.",
    icon: "🚀",
    status: "active",
    href: "/pre-venda-metodo-apice",
  },
  {
    slug: "teste-perfil-profissional",
    name: "Teste de Perfil Profissional",
    description: "Landing de conversão para questionário inteligente que gera um perfil comportamental e recomendações de carreira.",
    icon: "🧭",
    status: "active",
    href: "/teste-perfil-profissional",
  },
  {
    slug: "simulador-economia-domestica",
    name: "Simulador de Economia Doméstica",
    description: "Simulador interativo que calcula em tempo real quanto pequenas mudanças de hábito podem economizar por mês, ano e em 5 anos.",
    icon: "💰",
    status: "active",
    href: "/simulador-economia-domestica",
  },
  {
    slug: "nexus-summit",
    name: "NEXUS Summit",
    description: "Landing de captação de inscritos para evento corporativo híbrido, com programação, palestrantes, planos de ingresso e formulário de inscrição.",
    icon: "🎫",
    status: "active",
    href: "/nexus-summit",
  },
]

export default function HomePage() {
  return (
    <main className="flex-1 px-6 pt-28 pb-12 max-w-5xl mx-auto w-full">
      <header className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">criativo.nico.dev</p>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Páginas criativas
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Landing pages de campanhas e layouts de portfólio, cada um com identidade visual e componentes próprios.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Campanhas</h2>
        <PageGrid pages={campanhas} />
      </section>
    </main>
  )
}

function PageGrid({ pages }: { pages: Page[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pages.map((page) => {
        const media = (
          <span className="text-3xl block px-5 pt-5" aria-hidden="true">
            {page.icon}
          </span>
        )

        if (page.status === "active" && page.href) {
          return (
            <Link key={page.slug} href={page.href}>
              <ItemCard
                media={media}
                title={page.name}
                description={page.description}
                className="hover:border-primary/50 transition-colors cursor-pointer h-full"
              />
            </Link>
          )
        }

        return (
          <div key={page.slug} className="relative opacity-60 cursor-not-allowed">
            <ItemCard
              media={media}
              title={page.name}
              description={page.description}
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
