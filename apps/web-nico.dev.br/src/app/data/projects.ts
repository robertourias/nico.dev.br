export interface Project {
  id: number
  title: string
  description: string
  category: string[]
  image: string
  demoUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    id: 34,
    title: "Diagnóstico Gratuito de Negócios",
    description:
      "Quiz interativo que identifica os gargalos de crescimento do seu negócio e entrega um diagnóstico personalizado.",
    category: ["Marketing", "Design"],
    image: "/projects/diagnostico-negocio.png",
    demoUrl: "https://criativo.nico.dev.br/diagnostico-gratuito-negocios",
  },
  {
    id: 33,
    title: "Consultoria de TI",
    description:
      "Landing page institucional para consultoria de TI, com calculadora de maturidade digital, cases e captura de leads.",
    category: ["Marketing", "Design"],
    image: "/projects/consultoria-ti.png",
    demoUrl: "https://criativo.nico.dev.br/consultoria-ti",
  },
  {
    id: 32,
    title: "Calculadora de ROI",
    description:
      "Simule o retorno do investimento comparando cenários e visualize resultados em gráficos e tabelas.",
    category: ["Marketing", "Finanças", "Utilitários"],
    image: "/projects/calculadora-roi.png",
    demoUrl: "https://criativo.nico.dev.br/calculadora-roi",
  },
  {
    id: 28,
    title: "Minuto Estoico",
    description:
      "Reflexões sobre estoicismo para o dia a dia.",
    category: ["IA", "Utilitários"],
    image: "/projects/minuto-estoico.png",
    demoUrl: "https://minutoestoico.nico.dev.br/",
  },
  {
    id: 13,
    title: "Metrônomo",
    description:
      "Aplicativo web completo para músicos e entusiastas de música, com funcionalidades de metrônomo e gerenciamento de batidas.",
    category: ["Produtividade", "Utilitários"],
    image: "/projects/metronomo.png",
    demoUrl: process.env.NEXT_PUBLIC_METRONOME_URL ?? "https://metronomo.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/nico.dev.br/tree/main/apps/metronome",
  },
  {
    id: 29,
    title: "Gerador de Paleta de Cores",
    description:
      "Gere paletas harmônicas com IA. Escolha cor base, tipo de harmonia e quantidade. Exporte em CSS, SCSS, JSON ou Tailwind.",
    category: ["IA", "Utilitários", "Dev"],
    image: "/projects/paleta-cores.png",
    demoUrl: "https://tools.nico.dev.br/gerador-paleta",
  },
  {
    id: 15,
    title: "Páginas criativas",
    description:
      "Landing pages de campanhas e layouts de portfólio, cada um com identidade visual e componentes próprios.",
    category: ["Design", "Marketing"],
    image: "/projects/criativo.png",
    demoUrl: "https://criativo.nico.dev.br/",
  },
  {
    id: 14,
    title: "Tools — Ferramentas úteis",
    description:
      "Coleção de utilidades web para o dia a dia: calculadora de juros compostos, comparador CLT vs PJ e muito mais.",
    category: ["Utilitários"],
    image: "/projects/tools.png",
    demoUrl: "https://tools.nico.dev.br/",
  },

  {
    id: 16,
    title: "Teste de perfil profissional",
    description:
      "Responda algumas perguntas e receba uma análise personalizada com pontos fortes, áreas de desenvolvimento e recomendações para acelerar sua carreira.",
    category: ["Marketing", "Utilitários"],
    image: "/projects/perfil-profissional.png",
    demoUrl: "https://criativo.nico.dev.br/teste-perfil-profissional",
  },
  {
    id: 30,
    title: "Analisador de Texto",
    description:
      "Sentimento, entidades, resumo, insights e versão humanizada de qualquer texto. Powered by Gemini.",
    category: ["IA", "Utilitários"],
    image: "/projects/analisa-texto.png",
    demoUrl: "https://tools.nico.dev.br/analisador-texto",
  },
  {
    id: 31,
    title: "Debug Code",
    description:
      "Cole seu código e receba versão corrigida com apontamento de erros. Powered by Gemini.",
    category: ["IA", "Utilitários", "Dev"],
    image: "/projects/debug-code.png",
    demoUrl: "https://tools.nico.dev.br/debug-code",
  },
  {
    id: 17,
    title: "Pré-venda Método Apice",
    description:
      "Landing page de pré-venda do Método Apice, focada em capturar leads e gerar interesse no curso.",
    category: ["Marketing", "Design"],
    image: "/projects/lp-campanha.png",
    demoUrl: "https://criativo.nico.dev.br/pre-venda-metodo-apice",
  },
  {
    id: 18,
    title: "Economia Doméstica",
    description:
      "Landing page para o curso Economia Doméstica, focada em apresentar o curso e capturar leads.",
    category: ["Marketing", "Design"],
    image: "/projects/economia-domestica.png",
    demoUrl: "https://criativo.nico.dev.br/simulador-economia-domestica",
  },
  {
    id: 19,
    title: "Newsletter Premium",
    description:
      "Landing page para o curso Newsletter Premium, focada em apresentar o curso e capturar leads.",
    category: ["Marketing", "Design", "Utilitários"],
    image: "/projects/newsletter-premium.png",
    demoUrl: "https://criativo.nico.dev.br/landing-newsletter-premium",
  },
  {
    id: 20,
    title: "Rotina 30 dias",
    description:
      "Landing page para o curso Rotina 30 dias, focada em apresentar o curso e capturar leads.",
    category: ["Marketing", "Design", "Utilitários"],
    image: "/projects/rotina-30-dias.png",
    demoUrl: "https://criativo.nico.dev.br/desafio-30-dias-habitos",
  },
  {
    id: 21,
    title: "LP Evento",
    description:
      "Landing page para evento, focada em apresentar o evento e capturar leads.",
    category: ["Marketing", "Design"],
    image: "/projects/lp-evento.png",
    demoUrl: "https://criativo.nico.dev.br/nexus-summit",
  },
  {
    id: 22,
    title: "Mercado Financeiro",
    description:
      "Cotações, variações e histórico de ações B3, FIIs, índices e criptomoedas.",
    category: ["Finanças", "Utilitários"],
    image: "/projects/mercado-financeiro.png",
    demoUrl: "https://tools.nico.dev.br/mercado",
  },
  {
    id: 23,
    title: "Leitor de Documentos",
    description:
      "Extraia resumo, tipo e pontos-chave de PDFs, imagens e textos. Faça perguntas livres sobre o conteúdo com IA.",
    category: ["IA", "Utilitários", "Dev"],
    image: "/projects/leitor-documentos.png",
    demoUrl: "https://tools.nico.dev.br/leitor-documentos",
  },
  {
    id: 24,
    title: "Conversor de Moedas",
    description:
      "Converta entre moedas fiat e criptomoedas. Histórico de até 5 anos, cotações em BRL e USD e variação 24h.",
    category: ["Finanças", "Utilitários"],
    image: "/projects/conversor-moedas.png",
    demoUrl: "https://tools.nico.dev.br/conversor-moedas",
  },
  {
    id: 25,
    title: "CLT vs PJ",
    description:
      "Compare salário líquido entre regime CLT e PJ de forma simples.",
    category: ["Finanças", "Utilitários", "Dev"],
    image: "/projects/calc-clt-pj.png",
    demoUrl: "https://tools.nico.dev.br/clt-pj",
  },
  {
    id: 26,
    title: "Juros Compostos",
    description:
      "Simule rendimento de investimentos com capital fixo ou aportes mensais. Gráfico e tabela detalhada.",
    category: ["Finanças", "Utilitários"],
    image: "/projects/juros-compostos.png",
    demoUrl: "https://tools.nico.dev.br/juros-compostos",
  },
  {
    id: 27,
    title: "Pomodoro Timer",
    description:
      "Gerencie ciclos de trabalho focado com timer customizável, rastreamento de tarefas e histórico de produtividade.",
    category: ["Produtividade", "Utilitários", "Dev"],
    image: "/projects/pomodoro.png",
    demoUrl: "https://tools.nico.dev.br/pomodoro",
  },
  {
    id: 12,
    title: "Scaffold de projetos com IA",
    description:
      "Configuração agnóstica de IA para projetos com stack Next.js + NestJS + Turborepo.",
    category: ["Dev", "IA", "Utilitários"],
    image: "/projects/scaffold.png",
    repoUrl: "https://github.com/robertourias/scaffold-ia-projetos",
  },
  {
    id: 2,
    title: "Sorteia Números",
    description:
      "Ferramenta simples para gerar números aleatórios de forma rápida e prática para sorteios e decisões.",
    category: ["Utilitários"],
    image: "/projects/projects (1).png",
    demoUrl: "https://sorteianumeros.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/sort-number-js",
  },
  {
    id: 1,
    title: "Hair Day",
    description:
      "Landing page elegante para salão de beleza, barbearia ou serviços de cuidados capilares.",
    category: ["Design"],
    image: "/projects/projects (11).png",
    demoUrl: "https://hairday.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/hairday-template",
  },
  {
    id: 3,
    title: "Landing Produto",
    description:
      "Página de apresentação de produto focada em conversão, destaque de benefícios e captura de leads",
    category: ["Marketing", "Design"],
    image: "/projects/projects (4).png",
    demoUrl: "https://landingproduto.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-produto",
  },
  {
    id: 4,
    title: "Festivite",
    description:
      "Plataforma temática para divulgação de eventos, festas e experiências comemorativas.",
    category: ["Design"],
    image: "/projects/projects (5).png",
    demoUrl: "https://festivite.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/formulario-convite",
  },
  {
    id: 6,
    title: "LP Portfólio",
    description:
      "Landing page profissional para apresentar projetos, experiências e habilidades de forma moderna.",
    category: ["Design"],
    image: "/projects/projects (3).png",
    demoUrl: "https://lpportifolio.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-portifolio-dev",
  },
  {
    id: 7,
    title: "Patins Experience",
    description:
      "Site voltado ao universo da patinação com foco em estilo, esporte e comunidade.",
    category: ["Design"],
    image: "/projects/projects (6).png",
    demoUrl: "https://patins.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/landing-patins-responsivo",
  },
  {
    id: 8,
    title: "Estrelas",
    description:
      "Experiência visual inspirada no universo, astronomia e contemplação das estrelas.",
    category: ["Design"],
    image: "/projects/projects (7).png",
    demoUrl: "https://estrelas.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/formulario-matricula",
  },
  {
    id: 9,
    title: "Assinaturas+",
    description:
      "Plataforma para gerenciamento e apresentação de planos de assinatura digitais.",
    category: ["Design"],
    image: "/projects/projects (8).png",
    demoUrl: "https://assinaturas.nico.dev.br/",
    repoUrl:
      "https://github.com/robertourias/landing-animations-clube-assinatura",
  },
  {
    id: 11,
    title: "Reembolso Fácil",
    description:
      "Sistema simplificado para solicitação e acompanhamento de reembolsos corporativos.",
    category: ["Finanças", "Design"],
    image: "/projects/projects (10).png",
    demoUrl: "https://reembolso.nico.dev.br/",
    repoUrl: "https://github.com/robertourias/refund-template",
  },
]
