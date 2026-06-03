export interface Project {
  id: number
  title: string
  description: string
  category: string
  image: string
  demoUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    id: 13,
    title: "Metrônomo",
    description:
      "Aplicativo web completo para músicos e entusiastas de música, com funcionalidades de metrônomo e gerenciamento de batidas.",
    category: "Utilitários",
    image: "/projects/metronomo.png",
    demoUrl: process.env.NEXT_PUBLIC_METRONOME_URL ?? "https://metronomo.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/nico.dev.br/tree/main/apps/metronome",
  },
  {
    id: 12,
    title: "Scaffold de projetos com IA",
    description:
      "Configuração agnóstica de IA para projetos com stack Next.js + NestJS + Turborepo.",
    category: "Dev",
    image: "/projects/scaffold.png",

    repoUrl: "https://github.com/robertourias/scaffold-ia-projetos",
  },
  {
    id: 2,
    title: "Sorteia Números",
    description:
      "Ferramenta simples para gerar números aleatórios de forma rápida e prática para sorteios e decisões.",
    category: "Utilitários",
    image: "/projects/projects (1).png",
    demoUrl: "https://sorteianumeros.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/sort-number-js",
  },
  {
    id: 1,
    title: "Hair Day",
    description:
      "Landing page elegante para salão de beleza, barbearia ou serviços de cuidados capilares.",
    category: "Beleza",
    image: "/projects/projects (11).png",
    demoUrl: "https://hairday.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/hairday-template",
  },
  {
    id: 3,
    title: "Landing Produto",
    description:
      "Página de apresentação de produto focada em conversão, destaque de benefícios e captura de leads",
    category: "Marketing",
    image: "/projects/projects (4).png",
    demoUrl: "https://landingproduto.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-produto",
  },
  {
    id: 4,
    title: "Festivite",
    description:
      "Plataforma temática para divulgação de eventos, festas e experiências comemorativas.",
    category: "Eventos",
    image: "/projects/projects (5).png",
    demoUrl: "https://festivite.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/formulario-convite",
  },
  {
    id: 5,
    title: "TechNews",
    description:
      "Portal moderno com notícias, tendências e atualizações do universo da tecnologia e desenvolvimento.",
    category: "Tecnologia",
    image: "/projects/projects (2).png",
    demoUrl: "https://technews.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-portal-noticias",
  },
  {
    id: 6,
    title: "LP Portfólio",
    description:
      "Landing page profissional para apresentar projetos, experiências e habilidades de forma moderna.",
    category: "Portfólio",
    image: "/projects/projects (3).png",
    demoUrl: "https://lpportifolio.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-portifolio-dev",
  },
  {
    id: 7,
    title: "Patins Experience",
    description:
      "Site voltado ao universo da patinação com foco em estilo, esporte e comunidade.",
    category: "Esportes",
    image: "/projects/projects (6).png",
    demoUrl: "https://patins.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-patins-responsivo",
  },
  {
    id: 8,
    title: "Estrelas",
    description:
      "Experiência visual inspirada no universo, astronomia e contemplação das estrelas.",
    category: "Entretenimento",
    image: "/projects/projects (7).png",
    demoUrl: "https://estrelas.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/formulario-matricula",
  },
  {
    id: 9,
    title: "Assinaturas+",
    description:
      "Plataforma para gerenciamento e apresentação de planos de assinatura digitais.",
    category: "SaaS",
    image: "/projects/projects (8).png",
    demoUrl: "https://assinaturas.nico.dev.br/",
    repoUrl:
      "https://github.com/robertourias/landing-animations-clube-assinatura",
  },
  {
    id: 10,
    title: "QuickList",
    description:
      "Aplicação prática para criação e organização rápida de listas e tarefas do dia a dia.",
    category: "Produtividade",
    image: "/projects/projects (9).png",
    demoUrl: "https://quicklist.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-lista-compras",
  },
  {
    id: 11,
    title: "Reembolso Fácil",
    description:
      "Sistema simplificado para solicitação e acompanhamento de reembolsos corporativos.",
    category: "Finanças",
    image: "/projects/projects (10).png",
    demoUrl: "https://reembolso.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/refund-template",
  },
]
