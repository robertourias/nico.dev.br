// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API nesta fase; trocar por fonte dinâmica não deve afetar a tipagem.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Serviços", href: "#servicos" },
  { label: "Como Trabalhamos", href: "#como-trabalhamos" },
  { label: "Cases", href: "#cases" },
  { label: "Maturidade Digital", href: "#maturidade" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
]

export interface HeroStat {
  value: number
  suffix: string
  label: string
}

export const HERO_STATS: HeroStat[] = [
  { value: 120, suffix: "+", label: "Projetos entregues" },
  { value: 50, suffix: "+", label: "Clientes atendidos" },
  { value: 98, suffix: "%", label: "Satisfação" },
]

export interface Service {
  icon: "code" | "cloud" | "network" | "refresh" | "users" | "bot"
  title: string
  description: string
  items: string[]
}

export const SERVICES: Service[] = [
  {
    icon: "code",
    title: "Desenvolvimento de Software",
    description: "Produtos digitais sob medida, do MVP à escala.",
    items: ["Sistemas Web", "Aplicações SaaS", "APIs", "Integrações"],
  },
  {
    icon: "cloud",
    title: "Consultoria Cloud",
    description: "Infraestrutura moderna, segura e elástica.",
    items: ["AWS", "Azure", "Google Cloud"],
  },
  {
    icon: "network",
    title: "Arquitetura de Software",
    description: "Bases técnicas preparadas para crescer.",
    items: ["Microsserviços", "Escalabilidade", "Performance"],
  },
  {
    icon: "refresh",
    title: "Modernização de Sistemas",
    description: "Tire o legado do caminho da inovação.",
    items: ["Migração", "Refatoração", "Atualização tecnológica"],
  },
  {
    icon: "users",
    title: "Outsourcing",
    description: "Times sob demanda, prontos para entregar.",
    items: ["Squads dedicados", "Alocação de profissionais"],
  },
  {
    icon: "bot",
    title: "Inteligência Artificial",
    description: "IA aplicada a resultados de negócio.",
    items: ["Automações", "Chatbots", "IA Generativa", "Agentes IA"],
  },
]

export interface ProcessStep {
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Diagnóstico", description: "Análise de cenário atual." },
  { title: "Planejamento", description: "Definição da estratégia." },
  { title: "Implementação", description: "Execução técnica." },
  { title: "Validação", description: "Testes e ajustes." },
  { title: "Evolução", description: "Melhoria contínua." },
]

export interface CaseStudy {
  name: string
  segment: string
  problem: string
  solution: string
  results: string[]
  technologies: string[]
}

export const CASES: CaseStudy[] = [
  {
    name: "Plataforma Logística",
    segment: "Logística & Transporte",
    problem: "Roteirização manual gerava atrasos recorrentes e retrabalho operacional.",
    solution: "Plataforma web com roteirização automatizada e integração com o ERP existente.",
    results: ["65% redução operacional", "40% ganho de produtividade"],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    name: "Marketplace B2B",
    segment: "E-commerce",
    problem: "Sistema legado não suportava picos de tráfego em campanhas promocionais.",
    solution: "Migração para arquitetura de microsserviços com escalonamento automático em cloud.",
    results: ["3x mais transações simultâneas", "99,9% de uptime"],
    technologies: ["React", "Kubernetes", "GCP", "Redis"],
  },
  {
    name: "Motor de Crédito",
    segment: "Serviços Financeiros",
    problem: "Análise de crédito lenta, manual e sujeita a inconsistências.",
    solution: "Motor de decisão com IA e automação completa da esteira de aprovação.",
    results: ["Aprovação de 48h para 4min", "70% menos inadimplência"],
    technologies: ["Python", "FastAPI", "AWS SageMaker", "Docker"],
  },
  {
    name: "Rede de Clínicas",
    segment: "Saúde",
    problem: "Agendamento e prontuário fragmentados em planilhas e sistemas isolados.",
    solution: "Sistema integrado de gestão clínica com aplicativo mobile para pacientes.",
    results: ["50% menos faltas em consultas", "35% mais eficiência administrativa"],
    technologies: ["React Native", "Node.js", "PostgreSQL", "Azure"],
  },
]

export interface Kpi {
  value: number
  suffix: string
  label: string
}

export const KPIS: Kpi[] = [
  { value: 120, suffix: "+", label: "Projetos entregues" },
  { value: 50, suffix: "+", label: "Clientes ativos" },
  { value: 12, suffix: "", label: "Anos de experiência" },
  { value: 30000, suffix: "+", label: "Horas de consultoria" },
  { value: 98, suffix: "%", label: "Taxa de satisfação" },
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
    name: "Marina Tavares",
    role: "CTO",
    company: "LogTech Brasil",
    quote:
      "A consultoria entendeu nosso problema de negócio antes de propor qualquer tecnologia. O resultado foi uma plataforma que realmente resolveu o gargalo operacional.",
    initials: "MT",
    rating: 5,
  },
  {
    name: "Eduardo Lins",
    role: "CEO",
    company: "Vértice Commerce",
    quote:
      "Migramos para uma arquitetura escalável sem parar a operação um único dia. Time sênior, comunicação transparente em cada etapa.",
    initials: "EL",
    rating: 5,
  },
  {
    name: "Patrícia Nogueira",
    role: "Head de Produto",
    company: "Finbridge",
    quote:
      "O squad dedicado se integrou ao nosso time como se sempre tivesse estado aqui. Entregas constantes e qualidade de código acima do que esperávamos.",
    initials: "PN",
    rating: 5,
  },
  {
    name: "Rafael Cordeiro",
    role: "Diretor de TI",
    company: "Grupo Saúde+",
    quote:
      "Os agentes de IA implementados reduziram drasticamente o tempo de atendimento. Suporte técnico excelente mesmo após o go-live.",
    initials: "RC",
    rating: 4,
  },
]

export interface Differential {
  icon: "award" | "agile" | "target" | "transparency" | "scalable" | "shield"
  title: string
  description: string
}

export const DIFFERENTIALS: Differential[] = [
  { icon: "award", title: "Time Sênior", description: "Profissionais experientes em cada etapa do projeto." },
  { icon: "agile", title: "Metodologia Ágil", description: "Entregas incrementais com visibilidade constante." },
  { icon: "target", title: "Foco em Resultado", description: "Tecnologia a serviço de métricas de negócio." },
  { icon: "transparency", title: "Transparência Total", description: "Comunicação clara sobre prazos, custos e riscos." },
  { icon: "scalable", title: "Arquitetura Escalável", description: "Soluções preparadas para crescer com a empresa." },
  { icon: "shield", title: "Segurança e Compliance", description: "Boas práticas de segurança desde o desenho da solução." },
]

export type BlogCategory = "Desenvolvimento" | "Cloud" | "DevOps" | "IA" | "Arquitetura" | "Gestão de Produto"

export interface BlogPost {
  title: string
  category: BlogCategory
  readTime: string
  date: string
  excerpt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Como migrar para microsserviços sem parar a operação",
    category: "Arquitetura",
    readTime: "8 min",
    date: "12 mai 2026",
    excerpt: "Um guia prático para decompor monolitos de forma incremental e segura.",
  },
  {
    title: "FinOps: como controlar custos de cloud sem perder performance",
    category: "Cloud",
    readTime: "6 min",
    date: "28 abr 2026",
    excerpt: "Estratégias para equilibrar elasticidade e orçamento em AWS, Azure e GCP.",
  },
  {
    title: "Agentes de IA generativa em produção: o que aprendemos",
    category: "IA",
    readTime: "10 min",
    date: "15 abr 2026",
    excerpt: "Lições reais de implantação de agentes IA em fluxos de atendimento e back-office.",
  },
  {
    title: "Pipelines de CI/CD que realmente aceleram entregas",
    category: "DevOps",
    readTime: "7 min",
    date: "02 abr 2026",
    excerpt: "Como reduzir lead time sem sacrificar qualidade e segurança no deploy.",
  },
  {
    title: "Roadmap de produto: priorização baseada em dados",
    category: "Gestão de Produto",
    readTime: "5 min",
    date: "20 mar 2026",
    excerpt: "Frameworks práticos para decidir o que construir a seguir.",
  },
  {
    title: "Clean Architecture na prática: vale o investimento?",
    category: "Desenvolvimento",
    readTime: "9 min",
    date: "08 mar 2026",
    excerpt: "Trade-offs reais de adotar camadas e regras de dependência em projetos comerciais.",
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Como funciona a consultoria?",
    answer:
      "Começamos com um diagnóstico gratuito do seu cenário atual, definimos um plano de ação priorizado e executamos com squads dedicados, com pontos de validação contínuos.",
  },
  {
    question: "Qual o prazo médio dos projetos?",
    answer:
      "Varia com o escopo: diagnósticos levam dias, evoluções pontuais semanas, e projetos de modernização ou novos produtos costumam ser estruturados em ciclos trimestrais com entregas incrementais.",
  },
  {
    question: "Vocês trabalham com equipes dedicadas?",
    answer:
      "Sim. Montamos squads dedicados (desenvolvimento, QA, DevOps, gestão) alocados parcial ou integralmente ao seu projeto, conforme a necessidade.",
  },
  {
    question: "Fazem desenvolvimento sob demanda?",
    answer:
      "Sim, desenvolvemos sistemas web, aplicações SaaS, APIs e integrações sob demanda, do zero ou evoluindo uma base existente.",
  },
  {
    question: "Trabalham com IA?",
    answer:
      "Sim. Implementamos automações, chatbots, soluções de IA generativa e agentes IA integrados aos seus sistemas e processos de negócio.",
  },
]

export const COLABORADORES_OPTIONS = [
  { value: "1-10", label: "1 a 10" },
  { value: "11-50", label: "11 a 50" },
  { value: "51-200", label: "51 a 200" },
  { value: "201-500", label: "201 a 500" },
  { value: "500+", label: "Mais de 500" },
] as const
