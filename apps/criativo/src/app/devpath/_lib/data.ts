// Dados ilustrativos de exemplo para a landing DevPath — copy fixa, não
// representam telemetria real do produto nem integrações ativas com as
// plataformas de vagas citadas no briefing (LinkedIn Jobs, Gupy, Indeed etc.).

export type Modality = "remoto" | "hibrido" | "presencial"
export type ContractType = "CLT" | "PJ" | "Freelancer" | "Estágio" | "Trainee"
export type Seniority = "Estágio" | "Trainee" | "Júnior" | "Pleno" | "Sênior" | "Especialista"

export interface Job {
  id: string
  title: string
  company: string
  companyInitials: string
  companyColor: string
  location: string
  modality: Modality
  seniority: Seniority
  contractType: ContractType
  stack: string[]
  salaryLabel: string
  benefits: string[]
  postedLabel: string
  source: string
}

export const ROLES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Cloud",
  "QA",
  "Data Engineer",
  "Data Scientist",
  "UX/UI Designer",
] as const

export const JOBS: Job[] = [
  {
    id: "job-1",
    title: "Desenvolvedor(a) Frontend",
    company: "Nimbus Tech",
    companyInitials: "NT",
    companyColor: "#34d399",
    location: "São Paulo, SP",
    modality: "remoto",
    seniority: "Pleno",
    contractType: "CLT",
    stack: ["React", "TypeScript", "Next.js"],
    salaryLabel: "R$ 8.000 – R$ 11.000",
    benefits: ["VR/VA", "Plano de saúde", "Home office"],
    postedLabel: "há 2 dias",
    source: "LinkedIn Jobs",
  },
  {
    id: "job-2",
    title: "Engenheiro(a) de Backend",
    company: "Orbita Cloud",
    companyInitials: "OC",
    companyColor: "#22d3ee",
    location: "Remoto · Brasil",
    modality: "remoto",
    seniority: "Sênior",
    contractType: "PJ",
    stack: ["Node.js", "PostgreSQL", "AWS"],
    salaryLabel: "R$ 14.000 – R$ 19.000",
    benefits: ["Horário flexível", "Auxílio equipamento"],
    postedLabel: "há 5 horas",
    source: "Gupy",
  },
  {
    id: "job-3",
    title: "Desenvolvedor(a) Full Stack",
    company: "Vetor Labs",
    companyInitials: "VL",
    companyColor: "#a78bfa",
    location: "Belo Horizonte, MG",
    modality: "hibrido",
    seniority: "Pleno",
    contractType: "CLT",
    stack: ["Next.js", "NestJS", "Docker"],
    salaryLabel: "R$ 9.500 – R$ 13.000",
    benefits: ["VR/VA", "Gympass", "PLR"],
    postedLabel: "há 1 dia",
    source: "Indeed",
  },
  {
    id: "job-4",
    title: "Engenheiro(a) DevOps",
    company: "Fluxo Sistemas",
    companyInitials: "FS",
    companyColor: "#fbbf24",
    location: "Remoto · América Latina",
    modality: "remoto",
    seniority: "Sênior",
    contractType: "PJ",
    stack: ["Kubernetes", "Terraform", "GCP"],
    salaryLabel: "R$ 16.000 – R$ 22.000",
    benefits: ["Diária internacional", "Stock options"],
    postedLabel: "há 3 dias",
    source: "Remote OK",
  },
  {
    id: "job-5",
    title: "Desenvolvedor(a) Mobile",
    company: "Pulso App",
    companyInitials: "PA",
    companyColor: "#fb7185",
    location: "Curitiba, PR",
    modality: "hibrido",
    seniority: "Júnior",
    contractType: "CLT",
    stack: ["React Native", "TypeScript"],
    salaryLabel: "R$ 5.000 – R$ 7.000",
    benefits: ["VR/VA", "Plano de saúde"],
    postedLabel: "há 4 dias",
    source: "Vagas.com",
  },
  {
    id: "job-6",
    title: "Data Engineer",
    company: "Tera Insights",
    companyInitials: "TI",
    companyColor: "#34d399",
    location: "Remoto · Brasil",
    modality: "remoto",
    seniority: "Pleno",
    contractType: "PJ",
    stack: ["Python", "Airflow", "Spark"],
    salaryLabel: "R$ 11.000 – R$ 15.000",
    benefits: ["Horário flexível", "Bolsa de estudos"],
    postedLabel: "há 6 horas",
    source: "GeekHunter",
  },
  {
    id: "job-7",
    title: "QA Engineer",
    company: "Codex Software",
    companyInitials: "CS",
    companyColor: "#22d3ee",
    location: "Recife, PE",
    modality: "presencial",
    seniority: "Pleno",
    contractType: "CLT",
    stack: ["Cypress", "Playwright", "CI/CD"],
    salaryLabel: "R$ 7.500 – R$ 10.000",
    benefits: ["VR/VA", "Vale transporte"],
    postedLabel: "há 1 semana",
    source: "Catho",
  },
  {
    id: "job-8",
    title: "Estagiário(a) de Desenvolvimento",
    company: "Nimbus Tech",
    companyInitials: "NT",
    companyColor: "#34d399",
    location: "São Paulo, SP",
    modality: "hibrido",
    seniority: "Estágio",
    contractType: "Estágio",
    stack: ["JavaScript", "Git"],
    salaryLabel: "R$ 1.800 – R$ 2.200",
    benefits: ["Bolsa-auxílio", "VR/VA"],
    postedLabel: "há 2 dias",
    source: "Trampos",
  },
  {
    id: "job-9",
    title: "Tech Lead Frontend",
    company: "Vetor Labs",
    companyInitials: "VL",
    companyColor: "#a78bfa",
    location: "Remoto · Brasil",
    modality: "remoto",
    seniority: "Especialista",
    contractType: "CLT",
    stack: ["React", "Arquitetura", "Mentoria"],
    salaryLabel: "R$ 19.000 – R$ 25.000",
    benefits: ["Plano de saúde premium", "Stock options"],
    postedLabel: "há 3 dias",
    source: "LinkedIn Jobs",
  },
  {
    id: "job-10",
    title: "Cloud Engineer",
    company: "Orbita Cloud",
    companyInitials: "OC",
    companyColor: "#22d3ee",
    location: "Remoto · Brasil",
    modality: "remoto",
    seniority: "Sênior",
    contractType: "PJ",
    stack: ["AWS", "Terraform", "Go"],
    salaryLabel: "R$ 15.000 – R$ 20.000",
    benefits: ["Auxílio equipamento", "Horário flexível"],
    postedLabel: "há 8 horas",
    source: "We Work Remotely",
  },
  {
    id: "job-11",
    title: "UX/UI Designer",
    company: "Pulso App",
    companyInitials: "PA",
    companyColor: "#fb7185",
    location: "Florianópolis, SC",
    modality: "hibrido",
    seniority: "Pleno",
    contractType: "CLT",
    stack: ["Figma", "Design System"],
    salaryLabel: "R$ 8.000 – R$ 11.500",
    benefits: ["VR/VA", "Gympass"],
    postedLabel: "há 5 dias",
    source: "Revelo",
  },
  {
    id: "job-12",
    title: "Data Scientist",
    company: "Tera Insights",
    companyInitials: "TI",
    companyColor: "#34d399",
    location: "Remoto · Brasil",
    modality: "remoto",
    seniority: "Sênior",
    contractType: "PJ",
    stack: ["Python", "Machine Learning", "SQL"],
    salaryLabel: "R$ 17.000 – R$ 23.000",
    benefits: ["Bolsa de estudos", "Diária internacional"],
    postedLabel: "há 1 dia",
    source: "Wellfound",
  },
]

export const SENIORITY_OPTIONS: Seniority[] = ["Estágio", "Trainee", "Júnior", "Pleno", "Sênior", "Especialista"]
export const MODALITY_OPTIONS: { value: Modality; label: string }[] = [
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
  { value: "presencial", label: "Presencial" },
]
export const CONTRACT_OPTIONS: ContractType[] = ["CLT", "PJ", "Freelancer", "Estágio", "Trainee"]

export const JOB_BOARD_SOURCES = [
  "LinkedIn Jobs",
  "Gupy",
  "Indeed",
  "Glassdoor",
  "Revelo",
  "GeekHunter",
  "Trampos",
  "Programathor",
  "Remote OK",
  "We Work Remotely",
  "Wellfound",
  "InfoJobs",
  "Catho",
  "Vagas.com",
]

// ---------- Roadmaps ----------

export interface RoadmapStep {
  id: string
  title: string
  description: string
  resources: { type: "Vídeo" | "Artigo" | "Curso" | "Documentação" | "Projeto"; label: string }[]
}

export interface RoadmapTrack {
  key: string
  title: string
  icon: string
  steps: RoadmapStep[]
}

export const ROADMAPS: RoadmapTrack[] = [
  {
    key: "frontend",
    title: "Frontend",
    icon: "🎨",
    steps: [
      {
        id: "fe-1",
        title: "HTML & CSS",
        description: "Estrutura semântica, acessibilidade básica, Flexbox e Grid.",
        resources: [
          { type: "Curso", label: "Fundamentos de HTML e CSS" },
          { type: "Projeto", label: "Construir um layout responsivo do zero" },
        ],
      },
      {
        id: "fe-2",
        title: "JavaScript",
        description: "Lógica, DOM, eventos, assincronismo e ES6+.",
        resources: [
          { type: "Curso", label: "JavaScript moderno (ES6+)" },
          { type: "Artigo", label: "Entendendo Event Loop e Promises" },
        ],
      },
      {
        id: "fe-3",
        title: "Git & GitHub",
        description: "Versionamento, branches, pull requests e fluxo colaborativo.",
        resources: [
          { type: "Vídeo", label: "Git na prática para o dia a dia" },
          { type: "Documentação", label: "Git Docs oficial" },
        ],
      },
      {
        id: "fe-4",
        title: "React",
        description: "Componentes, hooks, estado, contexto e renderização.",
        resources: [
          { type: "Curso", label: "React do zero ao avançado" },
          { type: "Projeto", label: "Dashboard interativo com hooks" },
        ],
      },
      {
        id: "fe-5",
        title: "Next.js & TypeScript",
        description: "SSR/SSG, App Router, tipagem estática e segurança de tipos.",
        resources: [
          { type: "Documentação", label: "Next.js App Router" },
          { type: "Curso", label: "TypeScript para devs React" },
        ],
      },
      {
        id: "fe-6",
        title: "Testes & CI/CD",
        description: "Testes unitários, end-to-end e pipelines de entrega contínua.",
        resources: [
          { type: "Curso", label: "Testes com Vitest e Playwright" },
          { type: "Artigo", label: "Montando um pipeline de CI/CD" },
        ],
      },
      {
        id: "fe-7",
        title: "Deploy & Cloud",
        description: "Deploy contínuo, CDN, observabilidade e escalabilidade.",
        resources: [
          { type: "Documentação", label: "Deploy na Vercel / Cloudflare" },
          { type: "Projeto", label: "Publicar e monitorar um app em produção" },
        ],
      },
    ],
  },
  {
    key: "backend",
    title: "Backend",
    icon: "🛠️",
    steps: [
      {
        id: "be-1",
        title: "Lógica & uma linguagem base",
        description: "Estruturas de dados, algoritmos e fundamentos de uma stack (Node, Java, Python...).",
        resources: [{ type: "Curso", label: "Lógica de programação aplicada" }],
      },
      {
        id: "be-2",
        title: "Banco de dados",
        description: "Modelagem relacional, SQL, índices e bancos NoSQL.",
        resources: [{ type: "Curso", label: "SQL na prática" }, { type: "Artigo", label: "Quando usar NoSQL" }],
      },
      {
        id: "be-3",
        title: "APIs REST & GraphQL",
        description: "Design de APIs, autenticação, versionamento e documentação.",
        resources: [{ type: "Documentação", label: "Boas práticas REST" }],
      },
      {
        id: "be-4",
        title: "Arquitetura & filas",
        description: "Microsserviços, mensageria (BullMQ/Kafka) e cache (Redis).",
        resources: [{ type: "Curso", label: "Arquitetura de sistemas distribuídos" }],
      },
      {
        id: "be-5",
        title: "Testes & observabilidade",
        description: "Testes automatizados, logs estruturados e monitoramento.",
        resources: [{ type: "Artigo", label: "Observabilidade para backend" }],
      },
      {
        id: "be-6",
        title: "Cloud & deploy",
        description: "Containers, orquestração e deploy em provedores cloud.",
        resources: [{ type: "Projeto", label: "Deploy de API com Docker + CI/CD" }],
      },
    ],
  },
  {
    key: "mobile",
    title: "Mobile",
    icon: "📱",
    steps: [
      {
        id: "mo-1",
        title: "Fundamentos",
        description: "UI declarativa, ciclo de vida e navegação entre telas.",
        resources: [{ type: "Curso", label: "Fundamentos de apps mobile" }],
      },
      {
        id: "mo-2",
        title: "React Native ou Flutter",
        description: "Escolha de framework, componentes nativos e estado.",
        resources: [{ type: "Curso", label: "React Native do zero" }],
      },
      {
        id: "mo-3",
        title: "Integração com APIs",
        description: "Consumo de dados, cache local e autenticação.",
        resources: [{ type: "Artigo", label: "Consumindo APIs REST no mobile" }],
      },
      {
        id: "mo-4",
        title: "Publicação nas lojas",
        description: "Build de produção, assinatura e publicação na App Store/Play Store.",
        resources: [{ type: "Documentação", label: "Guia de publicação Play Store" }],
      },
      {
        id: "mo-5",
        title: "Performance & monitoramento",
        description: "Otimização de renderização, crash reporting e analytics.",
        resources: [{ type: "Curso", label: "Performance em apps mobile" }],
      },
    ],
  },
  {
    key: "devops",
    title: "DevOps",
    icon: "⚙️",
    steps: [
      {
        id: "do-1",
        title: "Linux & redes",
        description: "Linha de comando, permissões, DNS e protocolos de rede.",
        resources: [{ type: "Curso", label: "Linux para devs e ops" }],
      },
      {
        id: "do-2",
        title: "Containers",
        description: "Docker, imagens, volumes e orquestração com Kubernetes.",
        resources: [{ type: "Curso", label: "Docker e Kubernetes na prática" }],
      },
      {
        id: "do-3",
        title: "CI/CD",
        description: "Pipelines automatizados de build, teste e deploy.",
        resources: [{ type: "Documentação", label: "GitHub Actions" }],
      },
      {
        id: "do-4",
        title: "Infraestrutura como código",
        description: "Terraform, provisionamento e gestão de ambientes.",
        resources: [{ type: "Curso", label: "Terraform do zero" }],
      },
      {
        id: "do-5",
        title: "Observabilidade",
        description: "Métricas, logs, tracing e alertas em produção.",
        resources: [{ type: "Artigo", label: "Stack de observabilidade moderna" }],
      },
    ],
  },
  {
    key: "data",
    title: "Data",
    icon: "📊",
    steps: [
      {
        id: "da-1",
        title: "SQL & estatística",
        description: "Consultas avançadas, modelagem e fundamentos estatísticos.",
        resources: [{ type: "Curso", label: "SQL para análise de dados" }],
      },
      {
        id: "da-2",
        title: "Python para dados",
        description: "Pandas, NumPy e visualização de dados.",
        resources: [{ type: "Curso", label: "Python para Data Science" }],
      },
      {
        id: "da-3",
        title: "Pipelines de dados",
        description: "ETL/ELT, orquestração (Airflow) e qualidade de dados.",
        resources: [{ type: "Documentação", label: "Apache Airflow" }],
      },
      {
        id: "da-4",
        title: "Machine Learning",
        description: "Modelos supervisionados, avaliação e deploy de modelos.",
        resources: [{ type: "Curso", label: "Machine Learning aplicado" }],
      },
      {
        id: "da-5",
        title: "MLOps & produção",
        description: "Versionamento de modelos, monitoramento e re-treino.",
        resources: [{ type: "Artigo", label: "Levando modelos para produção" }],
      },
    ],
  },
]

// ---------- Empresas ----------

export interface Company {
  id: string
  name: string
  initials: string
  color: string
  segment: string
  employeesLabel: string
  rating: number
  openJobs: number
  stack: string[]
  salaryRangeLabel: string
}

export const COMPANIES: Company[] = [
  {
    id: "nimbus-tech",
    name: "Nimbus Tech",
    initials: "NT",
    color: "#34d399",
    segment: "SaaS B2B",
    employeesLabel: "201–500",
    rating: 4.6,
    openJobs: 8,
    stack: ["React", "Next.js", "TypeScript"],
    salaryRangeLabel: "R$ 6k – R$ 22k",
  },
  {
    id: "orbita-cloud",
    name: "Orbita Cloud",
    initials: "OC",
    color: "#22d3ee",
    segment: "Infraestrutura Cloud",
    employeesLabel: "51–200",
    rating: 4.4,
    openJobs: 5,
    stack: ["AWS", "Go", "Terraform"],
    salaryRangeLabel: "R$ 9k – R$ 24k",
  },
  {
    id: "vetor-labs",
    name: "Vetor Labs",
    initials: "VL",
    color: "#a78bfa",
    segment: "Produtos Digitais",
    employeesLabel: "11–50",
    rating: 4.8,
    openJobs: 6,
    stack: ["Next.js", "NestJS", "Docker"],
    salaryRangeLabel: "R$ 7k – R$ 25k",
  },
  {
    id: "tera-insights",
    name: "Tera Insights",
    initials: "TI",
    color: "#34d399",
    segment: "Dados & IA",
    employeesLabel: "51–200",
    rating: 4.5,
    openJobs: 7,
    stack: ["Python", "Spark", "ML"],
    salaryRangeLabel: "R$ 10k – R$ 23k",
  },
  {
    id: "fluxo-sistemas",
    name: "Fluxo Sistemas",
    initials: "FS",
    color: "#fbbf24",
    segment: "Fintech",
    employeesLabel: "501–1000",
    rating: 4.2,
    openJobs: 4,
    stack: ["Kubernetes", "Java", "GCP"],
    salaryRangeLabel: "R$ 8k – R$ 22k",
  },
  {
    id: "pulso-app",
    name: "Pulso App",
    initials: "PA",
    color: "#fb7185",
    segment: "Healthtech",
    employeesLabel: "11–50",
    rating: 4.7,
    openJobs: 3,
    stack: ["React Native", "Figma"],
    salaryRangeLabel: "R$ 5k – R$ 18k",
  },
]

// ---------- Salários ----------

export interface SalaryLevel {
  level: string
  rangeLabel: string
  min: number
  max: number
}

export const SALARY_BY_ROLE: Record<string, SalaryLevel[]> = {
  Frontend: [
    { level: "Júnior", rangeLabel: "R$ 3,5k – 5,5k", min: 3500, max: 5500 },
    { level: "Pleno", rangeLabel: "R$ 6k – 10k", min: 6000, max: 10000 },
    { level: "Sênior", rangeLabel: "R$ 11k – 17k", min: 11000, max: 17000 },
    { level: "Especialista", rangeLabel: "R$ 17k – 23k", min: 17000, max: 23000 },
    { level: "Tech Lead", rangeLabel: "R$ 19k – 26k", min: 19000, max: 26000 },
  ],
  Backend: [
    { level: "Júnior", rangeLabel: "R$ 4k – 6k", min: 4000, max: 6000 },
    { level: "Pleno", rangeLabel: "R$ 7k – 11k", min: 7000, max: 11000 },
    { level: "Sênior", rangeLabel: "R$ 12k – 19k", min: 12000, max: 19000 },
    { level: "Especialista", rangeLabel: "R$ 19k – 25k", min: 19000, max: 25000 },
    { level: "Tech Lead", rangeLabel: "R$ 21k – 28k", min: 21000, max: 28000 },
  ],
  Mobile: [
    { level: "Júnior", rangeLabel: "R$ 3,5k – 5k", min: 3500, max: 5000 },
    { level: "Pleno", rangeLabel: "R$ 6k – 9,5k", min: 6000, max: 9500 },
    { level: "Sênior", rangeLabel: "R$ 10k – 16k", min: 10000, max: 16000 },
    { level: "Especialista", rangeLabel: "R$ 16k – 21k", min: 16000, max: 21000 },
    { level: "Tech Lead", rangeLabel: "R$ 18k – 24k", min: 18000, max: 24000 },
  ],
  DevOps: [
    { level: "Júnior", rangeLabel: "R$ 4,5k – 6,5k", min: 4500, max: 6500 },
    { level: "Pleno", rangeLabel: "R$ 8k – 13k", min: 8000, max: 13000 },
    { level: "Sênior", rangeLabel: "R$ 14k – 21k", min: 14000, max: 21000 },
    { level: "Especialista", rangeLabel: "R$ 21k – 28k", min: 21000, max: 28000 },
    { level: "Tech Lead", rangeLabel: "R$ 23k – 30k", min: 23000, max: 30000 },
  ],
  Dados: [
    { level: "Júnior", rangeLabel: "R$ 4k – 6k", min: 4000, max: 6000 },
    { level: "Pleno", rangeLabel: "R$ 7,5k – 12k", min: 7500, max: 12000 },
    { level: "Sênior", rangeLabel: "R$ 13k – 20k", min: 13000, max: 20000 },
    { level: "Especialista", rangeLabel: "R$ 20k – 27k", min: 20000, max: 27000 },
    { level: "Tech Lead", rangeLabel: "R$ 22k – 29k", min: 22000, max: 29000 },
  ],
}

export const SALARY_ROLE_OPTIONS = Object.keys(SALARY_BY_ROLE)

export const MAX_SALARY_REFERENCE = 30000

// ---------- Comparador de carreiras ----------

export interface CareerComparison {
  key: string
  title: string
  icon: string
  avgSalaryLabel: string
  openJobsLabel: string
  difficulty: number // 1–5
  competition: number // 1–5
  growthLabel: string
  timeToEntryLabel: string
}

export const CAREER_COMPARISONS: CareerComparison[] = [
  {
    key: "frontend",
    title: "Frontend",
    icon: "🎨",
    avgSalaryLabel: "R$ 9.800",
    openJobsLabel: "+3.200 vagas",
    difficulty: 3,
    competition: 4,
    growthLabel: "Alto",
    timeToEntryLabel: "6–9 meses",
  },
  {
    key: "backend",
    title: "Backend",
    icon: "🛠️",
    avgSalaryLabel: "R$ 11.500",
    openJobsLabel: "+2.900 vagas",
    difficulty: 4,
    competition: 4,
    growthLabel: "Alto",
    timeToEntryLabel: "8–12 meses",
  },
  {
    key: "mobile",
    title: "Mobile",
    icon: "📱",
    avgSalaryLabel: "R$ 9.200",
    openJobsLabel: "+1.100 vagas",
    difficulty: 3,
    competition: 3,
    growthLabel: "Médio",
    timeToEntryLabel: "7–10 meses",
  },
  {
    key: "devops",
    title: "DevOps",
    icon: "⚙️",
    avgSalaryLabel: "R$ 14.300",
    openJobsLabel: "+1.600 vagas",
    difficulty: 4,
    competition: 3,
    growthLabel: "Muito alto",
    timeToEntryLabel: "10–14 meses",
  },
  {
    key: "cloud",
    title: "Cloud",
    icon: "☁️",
    avgSalaryLabel: "R$ 15.100",
    openJobsLabel: "+1.300 vagas",
    difficulty: 4,
    competition: 3,
    growthLabel: "Muito alto",
    timeToEntryLabel: "10–14 meses",
  },
  {
    key: "data",
    title: "Data",
    icon: "📊",
    avgSalaryLabel: "R$ 13.700",
    openJobsLabel: "+1.800 vagas",
    difficulty: 5,
    competition: 3,
    growthLabel: "Muito alto",
    timeToEntryLabel: "9–13 meses",
  },
  {
    key: "ia",
    title: "IA",
    icon: "🤖",
    avgSalaryLabel: "R$ 16.400",
    openJobsLabel: "+700 vagas",
    difficulty: 5,
    competition: 2,
    growthLabel: "Em explosão",
    timeToEntryLabel: "12–18 meses",
  },
]

// ---------- Assistente IA (preview, sem IA real) ----------

export interface AiQuestion {
  id: string
  question: string
  answer: string
}

export const AI_QUESTIONS: AiQuestion[] = [
  {
    id: "q1",
    question: "Como virar Tech Lead?",
    answer:
      "Aprofunde-se em arquitetura de software, pratique mentoria de outros devs e assuma decisões técnicas com visão de produto. Geralmente leva de 1 a 3 anos como sênior antes da transição.",
  },
  {
    id: "q2",
    question: "Vale aprender Rust?",
    answer:
      "Vale se você atua com sistemas de alta performance, infraestrutura ou WebAssembly. A demanda ainda é menor que JS/Python, mas a remuneração média é uma das mais altas do mercado.",
  },
  {
    id: "q3",
    question: "Quais empresas contratam React?",
    answer:
      "No portal, Nimbus Tech, Vetor Labs e Pulso App têm vagas abertas com React/React Native. Use o filtro de stack na busca de vagas para ver a lista completa atualizada.",
  },
  {
    id: "q4",
    question: "Como negociar salário?",
    answer:
      "Pesquise a faixa de mercado para seu nível (veja a seção de Salários), liste conquistas com impacto mensurável e apresente uma faixa, não um número fixo.",
  },
  {
    id: "q5",
    question: "Como estudar arquitetura de software?",
    answer:
      "Comece por padrões de design e SOLID, depois avance para arquitetura de sistemas distribuídos. Pratique desenhando arquiteturas de produtos reais que você usa no dia a dia.",
  },
  {
    id: "q6",
    question: "Como migrar para IA?",
    answer:
      "Fortaleça Python e estatística, estude fundamentos de Machine Learning e construa 2–3 projetos práticos no GitHub. A trilha de Data/IA no portal tem o roadmap completo.",
  },
]

// ---------- Gamificação ----------

export const GAMIFICATION_BADGES = [
  { icon: "🔥", label: "Sequência de 7 dias" },
  { icon: "🧭", label: "Roadmap Frontend 50%" },
  { icon: "🏆", label: "Primeiro projeto publicado" },
  { icon: "⭐", label: "Perfil completo" },
]

// ---------- Planos ----------

export interface Plan {
  key: string
  name: string
  price: string
  period: string
  highlight?: boolean
  description: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    key: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para começar a organizar sua carreira em tecnologia.",
    features: [
      "Busca de vagas ilimitada",
      "Pesquisa de salários",
      "1 roadmap em andamento",
      "Perfil profissional básico",
      "Newsletter semanal",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    highlight: true,
    description: "Para quem quer acelerar a evolução de carreira.",
    features: [
      "Tudo do plano Gratuito",
      "Roadmaps e trilhas ilimitados",
      "Assistente de IA sem limite de perguntas",
      "Simulador de evolução salarial",
      "Análise de currículo com score ATS",
      "Alertas de vagas em tempo real",
    ],
  },
  {
    key: "teams",
    name: "Empresas",
    price: "Sob consulta",
    period: "",
    description: "Para empresas que querem publicar vagas e atrair talentos.",
    features: [
      "Página de empresa com vitrine de vagas",
      "Painel de candidatos",
      "Métricas de atratividade salarial",
      "Selo de empresa verificada",
    ],
  },
]

// ---------- Depoimentos ----------

export interface Testimonial {
  name: string
  role: string
  company: string
  initials: string
  rating: number
  quote: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marina Costa",
    role: "Desenvolvedora Frontend",
    company: "Nimbus Tech",
    initials: "MC",
    rating: 5,
    quote:
      "Em três meses usando o roadmap e a busca de vagas, consegui migrar de suporte técnico para minha primeira vaga como devs. O comparativo salarial me deu segurança para negociar a proposta.",
  },
  {
    name: "Rafael Souza",
    role: "Backend Engineer",
    company: "Orbita Cloud",
    initials: "RS",
    rating: 5,
    quote:
      "O comparador de carreiras me ajudou a decidir entre Backend e DevOps. Acabei migrando para DevOps com base nos dados de crescimento e hoje ganho 40% mais.",
  },
  {
    name: "Juliana Alves",
    role: "Tech Lead",
    company: "Vetor Labs",
    initials: "JA",
    rating: 4,
    quote:
      "Uso o portal toda semana para acompanhar tendências de tecnologia e mandar vagas para o time. O assistente de carreira é ótimo para destravar dúvidas rápidas dos juniores.",
  },
]

// ---------- FAQ ----------

export const FAQS = [
  {
    question: "O DevPath é gratuito?",
    answer:
      "Sim. O plano Gratuito dá acesso completo à busca de vagas, pesquisa de salários e a um roadmap em andamento. Recursos avançados, como IA ilimitada e simulador salarial, ficam no plano Pro.",
  },
  {
    question: "De onde vêm as vagas listadas?",
    answer:
      "O portal agrega vagas de múltiplas plataformas públicas (LinkedIn Jobs, Gupy, Indeed, Remote OK, entre outras), sempre respeitando os termos de uso de cada uma. Nesta página de demonstração, os exemplos exibidos são ilustrativos.",
  },
  {
    question: "Preciso ter experiência para usar os roadmaps?",
    answer:
      "Não. Os roadmaps começam do zero absoluto e seguem até o nível avançado, com vídeos, artigos, cursos e projetos práticos em cada etapa.",
  },
  {
    question: "Como funciona o assistente de IA?",
    answer:
      "É um chat especializado em carreira de tecnologia, treinado para responder dúvidas sobre evolução profissional, tecnologias, negociação salarial e mais.",
  },
  {
    question: "Posso usar o portal sem criar conta?",
    answer:
      "Sim, a busca de vagas e a pesquisa de salários são abertas. Para salvar favoritos, acompanhar roadmaps e receber alertas, é necessário criar uma conta gratuita.",
  },
]
