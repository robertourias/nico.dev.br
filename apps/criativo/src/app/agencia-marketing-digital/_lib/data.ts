// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API nesta fase; trocar por fonte dinâmica não deve afetar a tipagem.
// Marca e cases são fictícios — identidade própria, inspirada apenas na
// experiência de navegação do site de referência do briefing, sem copiar
// textos, logos ou imagens de terceiros.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Início", href: "#topo" },
  { label: "Serviços", href: "#servicos" },
  { label: "Cases", href: "#cases" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#proposta" },
]

export interface HeroStat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export const HERO_STATS: HeroStat[] = [
  { value: 200, prefix: "+", label: "Projetos entregues" },
  { value: 50, prefix: "+", label: "Clientes ativos" },
  { value: 5, prefix: "+", suffix: "M", label: "Em receita gerada" },
  { value: 98, suffix: "%", label: "De satisfação" },
]

export const CLIENT_LOGOS: string[] = [
  "Bloom Cosméticos",
  "Clínica Vitalis",
  "Órbita SaaS",
  "Grupo Marvale",
  "Studio Cedro",
  "Nimbus Foods",
  "Vetor Imóveis",
  "Aura Wellness",
  "Cresce.ai",
  "Porto Varejo",
  "Lumen Educação",
  "Fluxo Capital",
]

export interface Differential {
  icon: "data" | "team" | "transparency" | "scale"
  title: string
  description: string
}

export const DIFFERENTIALS: Differential[] = [
  {
    icon: "data",
    title: "Estratégia Data Driven",
    description: "Decisões orientadas por dados e testes contínuos, não por achismo.",
  },
  {
    icon: "team",
    title: "Equipe Especializada",
    description: "Especialistas dedicados em tráfego, SEO, conteúdo e tecnologia.",
  },
  {
    icon: "transparency",
    title: "Gestão Transparente",
    description: "Relatórios claros e acesso direto aos números da sua campanha.",
  },
  {
    icon: "scale",
    title: "Crescimento Escalável",
    description: "Processos pensados para crescer junto com a sua operação.",
  },
]

export interface Service {
  icon: "traffic" | "seo" | "social" | "web" | "automation" | "branding"
  title: string
  description: string
  items: string[]
}

export const SERVICES: Service[] = [
  {
    icon: "traffic",
    title: "Gestão de Tráfego",
    description: "Campanhas de performance nas plataformas que mais convertem para o seu negócio.",
    items: ["Google Ads", "Meta Ads", "TikTok Ads"],
  },
  {
    icon: "seo",
    title: "SEO",
    description: "Visibilidade orgânica sustentável nos canais de busca.",
    items: ["SEO Técnico", "SEO Local", "Conteúdo"],
  },
  {
    icon: "social",
    title: "Redes Sociais",
    description: "Presença de marca consistente e editorial estratégico.",
    items: ["Gestão de Conteúdo", "Planejamento Editorial"],
  },
  {
    icon: "web",
    title: "Desenvolvimento Web",
    description: "Sites e produtos digitais rápidos, responsivos e prontos para converter.",
    items: ["Landing Pages", "Sites Institucionais", "E-commerce"],
  },
  {
    icon: "automation",
    title: "Automação",
    description: "Fluxos automatizados que nutrem leads e aceleram vendas.",
    items: ["CRM", "Funis", "E-mail Marketing"],
  },
  {
    icon: "branding",
    title: "Branding",
    description: "Identidade de marca sólida, coerente em todos os pontos de contato.",
    items: ["Posicionamento", "Identidade Visual"],
  },
]

export interface CaseStudy {
  slug: string
  name: string
  segment: string
  objective: string
  resultHeadline: string
  problem: string
  solution: string
  results: string[]
  technologies: string[]
}

export const CASES: CaseStudy[] = [
  {
    slug: "bloom-cosmeticos",
    name: "Bloom Cosméticos",
    segment: "E-commerce",
    objective: "Aumentar vendas online em período de alta sazonalidade.",
    resultHeadline: "+320% em vendas",
    problem: "Dependência de poucas campanhas sazonais e baixo retorno sobre investimento em mídia paga.",
    solution: "Reestruturação completa de tráfego pago com segmentação por funil, testes A/B contínuos e automação de e-mail para recuperação de carrinho.",
    results: ["+320% em vendas", "+45% no ticket médio", "ROAS 6,8x"],
    technologies: ["Google Ads", "Meta Ads", "E-mail Marketing", "CRO"],
  },
  {
    slug: "clinica-vitalis",
    name: "Clínica Vitalis",
    segment: "Saúde",
    objective: "Aumentar o volume de agendamentos qualificados na rede de clínicas.",
    resultHeadline: "+180% em agendamentos",
    problem: "Baixa visibilidade local e processo manual de captação de pacientes via indicação.",
    solution: "SEO local, campanhas geolocalizadas e funil de WhatsApp integrado ao CRM da recepção.",
    results: ["+180% em agendamentos", "-32% custo por lead", "4,9 de avaliação média"],
    technologies: ["SEO Local", "Google Ads", "CRM", "Automação"],
  },
  {
    slug: "orbita-saas",
    name: "Órbita SaaS",
    segment: "Tecnologia",
    objective: "Gerar uma base previsível de leads qualificados para o time de vendas.",
    resultHeadline: "+250% em geração de leads",
    problem: "Pipeline de vendas irregular e dependência de indicações para gerar novos contratos.",
    solution: "Estratégia de conteúdo e SEO técnico combinada a campanhas de geração de demanda e nutrição automatizada por e-mail.",
    results: ["+250% em leads qualificados", "-28% custo por lead", "3x mais reuniões agendadas"],
    technologies: ["SEO Técnico", "Conteúdo", "Funis", "E-mail Marketing"],
  },
]

export interface ProcessStep {
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Diagnóstico", description: "Análise do cenário atual, concorrência e oportunidades." },
  { title: "Planejamento", description: "Estratégia e metas claras para os próximos ciclos." },
  { title: "Execução", description: "Implementação das campanhas e ativos digitais." },
  { title: "Otimização", description: "Testes contínuos guiados por dados de performance." },
  { title: "Escala", description: "Investimento ampliado nos canais que mais retornam." },
]

export interface Kpi {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export const KPIS: Kpi[] = [
  { value: 200, prefix: "+", label: "Projetos entregues" },
  { value: 50, prefix: "+", label: "Clientes atendidos" },
  { value: 5, prefix: "+", suffix: "M", label: "Em receita gerada" },
  { value: 98, suffix: "%", label: "Taxa de retenção" },
]

export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  initials: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Camila Resende",
    role: "Fundadora",
    company: "Bloom Cosméticos",
    quote:
      "Em seis meses, o faturamento online mais que triplicou. O time entende de performance e de marca ao mesmo tempo — algo raro de encontrar.",
    initials: "CR",
    rating: 5,
  },
  {
    name: "Diego Salomão",
    role: "Diretor Comercial",
    company: "Órbita SaaS",
    quote:
      "Finalmente temos um pipeline previsível. Os relatórios são claros e as decisões são sempre baseadas em dados, não em opinião.",
    initials: "DS",
    rating: 5,
  },
  {
    name: "Fernanda Lacerda",
    role: "Gerente de Marketing",
    company: "Clínica Vitalis",
    quote:
      "A agência se comporta como parte do nosso time. Cada real investido em mídia tem retorno claro e acompanhado de perto.",
    initials: "FL",
    rating: 5,
  },
  {
    name: "Henrique Ataíde",
    role: "CEO",
    company: "Grupo Marvale",
    quote:
      "Trocamos de agência três vezes antes de chegar aqui. A diferença na transparência e na velocidade de execução é gigante.",
    initials: "HA",
    rating: 4,
  },
]

export interface Plan {
  id: string
  name: string
  audience: string
  price: string
  priceNote: string
  description: string
  features: string[]
  highlight?: boolean
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    audience: "Pequenas empresas",
    price: "R$ 1.990",
    priceNote: "/mês + verba de mídia",
    description: "Para quem está começando a investir em marketing digital com previsibilidade.",
    features: [
      "1 canal de tráfego pago",
      "Gestão de redes sociais",
      "Relatório mensal de performance",
      "Suporte via WhatsApp",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    audience: "Empresas em expansão",
    price: "R$ 3.990",
    priceNote: "/mês + verba de mídia",
    description: "Estratégia multicanal para empresas que querem acelerar o crescimento.",
    features: [
      "Até 3 canais de tráfego pago",
      "SEO técnico e de conteúdo",
      "Automação de e-mail e funis",
      "Relatórios quinzenais com especialista",
      "Reunião de estratégia mensal",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    audience: "Operações avançadas",
    price: "Sob consulta",
    priceNote: "plano customizado",
    description: "Estrutura completa para operações com múltiplas frentes e metas agressivas.",
    features: [
      "Canais ilimitados de aquisição",
      "Time dedicado e gestor de conta sênior",
      "Branding e identidade visual",
      "Dashboards em tempo real",
      "SLA de atendimento prioritário",
    ],
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Como funciona o processo?",
    answer:
      "Começamos com um diagnóstico gratuito do seu cenário atual, montamos um plano de ação priorizado e seguimos um ciclo contínuo de execução, otimização e escala, com relatórios periódicos.",
  },
  {
    question: "Quanto custa?",
    answer:
      "Trabalhamos com planos a partir de R$ 1.990/mês (mais verba de mídia), além de propostas customizadas para operações maiores. O valor exato depende dos canais e do escopo combinado no diagnóstico.",
  },
  {
    question: "Qual o prazo para ver resultados?",
    answer:
      "Primeiros sinais de performance costumam aparecer entre 30 e 60 dias, com resultados mais consistentes a partir do terceiro mês, conforme os canais maturam e os testes são otimizados.",
  },
  {
    question: "Quais canais vocês atendem?",
    answer:
      "Google Ads, Meta Ads, TikTok Ads, SEO, redes sociais, e-mail marketing, automação de CRM e desenvolvimento de sites e landing pages.",
  },
  {
    question: "Como acompanho os resultados?",
    answer:
      "Você recebe relatórios periódicos com linguagem clara, além de acesso direto ao especialista responsável pela sua conta para tirar dúvidas a qualquer momento.",
  },
]
