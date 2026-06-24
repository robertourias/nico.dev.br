// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API nesta fase; trocar por fonte dinâmica (sistema de gestão de
// academia real) não deve afetar a tipagem.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Estrutura", href: "#estrutura" },
  { label: "Modalidades", href: "#modalidades" },
  { label: "Planos", href: "#planos" },
  { label: "Professores", href: "#professores" },
  { label: "Resultados", href: "#resultados" },
  { label: "FAQ", href: "#faq" },
]

export interface HeroStat {
  value: number
  suffix: string
  label: string
  decimals?: number
}

export const HERO_STATS: HeroStat[] = [
  { value: 3000, suffix: "+", label: "Alunos ativos" },
  { value: 50, suffix: "+", label: "Professores especializados" },
  { value: 15, suffix: " anos", label: "De experiência" },
]

export type DifferentialIcon =
  | "equipment"
  | "clock"
  | "teacher"
  | "app"
  | "structure"
  | "parking"

export interface Differential {
  icon: DifferentialIcon
  title: string
  description: string
}

export const DIFFERENTIALS: Differential[] = [
  {
    icon: "equipment",
    title: "Equipamentos Modernos",
    description: "Máquinas de última geração e área de musculação completa para todos os níveis de treino.",
  },
  {
    icon: "clock",
    title: "Horários Flexíveis",
    description: "Funcionamento estendido todos os dias, para treinar no horário que encaixa na sua rotina.",
  },
  {
    icon: "teacher",
    title: "Professores Especializados",
    description: "Equipe certificada que acompanha sua evolução e ajusta o treino conforme seus objetivos.",
  },
  {
    icon: "app",
    title: "Aplicativo de Acompanhamento",
    description: "Acompanhe treinos, evolução e agende aulas direto do celular, em tempo real.",
  },
  {
    icon: "structure",
    title: "Estrutura Completa",
    description: "Vestiários, área de alongamento, espaço de recuperação e ambientes climatizados.",
  },
  {
    icon: "parking",
    title: "Estacionamento",
    description: "Vagas próprias e cobertas para alunos, com entrada exclusiva e segurança 24h.",
  },
]

export type AreaIcon = "musculacao" | "cardio" | "funcional" | "spinning" | "alongamento" | "vestiario"

export interface StructureArea {
  icon: AreaIcon
  title: string
  description: string
  size: string
}

export const STRUCTURE_AREAS: StructureArea[] = [
  {
    icon: "musculacao",
    title: "Musculação",
    description: "Área ampla com equipamentos de peso livre e máquinas guiadas das principais marcas do mercado.",
    size: "850 m²",
  },
  {
    icon: "cardio",
    title: "Cardio",
    description: "Esteiras, bikes e elípticos com telas individuais e vista panorâmica para a cidade.",
    size: "320 m²",
  },
  {
    icon: "funcional",
    title: "Funcional",
    description: "Espaço multiuso com cordas, kettlebells, racks e estrutura para treinos de alta intensidade.",
    size: "280 m²",
  },
  {
    icon: "spinning",
    title: "Sala de Spinning",
    description: "Bikes profissionais, som imersivo e iluminação cenográfica para aulas em grupo.",
    size: "140 m²",
  },
  {
    icon: "alongamento",
    title: "Área de Alongamento",
    description: "Ambiente tranquilo com tatames e acessórios para mobilidade e recuperação muscular.",
    size: "110 m²",
  },
  {
    icon: "vestiario",
    title: "Vestiários",
    description: "Vestiários completos com armários individuais, chuveiros e amenities premium.",
    size: "2 unidades",
  },
]

export type ModalityIcon =
  | "musculacao"
  | "funcional"
  | "spinning"
  | "pilates"
  | "cross"
  | "personal"
  | "corrida"
  | "alongamento"

export interface Modality {
  icon: ModalityIcon
  title: string
  description: string
  benefits: string[]
  audience: string
}

export const MODALITIES: Modality[] = [
  {
    icon: "musculacao",
    title: "Musculação",
    description: "Treino de força com acompanhamento técnico para ganho de massa muscular e definição.",
    benefits: ["Aumento de força", "Hipertrofia", "Mais metabolismo"],
    audience: "Iniciantes a avançados",
  },
  {
    icon: "funcional",
    title: "Treinamento Funcional",
    description: "Movimentos multiarticulares que aplicam força, equilíbrio e mobilidade na prática.",
    benefits: ["Condicionamento geral", "Queima calórica alta", "Treino dinâmico"],
    audience: "Todos os níveis",
  },
  {
    icon: "spinning",
    title: "Spinning",
    description: "Aulas em grupo de ciclismo indoor com música e ritmo guiado pelo professor.",
    benefits: ["Resistência cardiovascular", "Queima calórica", "Treino em grupo"],
    audience: "Cardio e emagrecimento",
  },
  {
    icon: "pilates",
    title: "Pilates",
    description: "Fortalecimento do core, consciência corporal e postura com exercícios de baixo impacto.",
    benefits: ["Postura", "Flexibilidade", "Baixo impacto"],
    audience: "Todas as idades",
  },
  {
    icon: "cross",
    title: "Cross Training",
    description: "Treino funcional de alta intensidade com variação constante de estímulos.",
    benefits: ["Performance", "Força e potência", "Treino desafiador"],
    audience: "Intermediário a avançado",
  },
  {
    icon: "personal",
    title: "Personal Trainer",
    description: "Acompanhamento individual com plano de treino 100% personalizado para seu objetivo.",
    benefits: ["Atenção exclusiva", "Resultados acelerados", "Flexibilidade de horário"],
    audience: "Qualquer objetivo",
  },
  {
    icon: "corrida",
    title: "Corrida",
    description: "Treinos de corrida em esteira ou ao ar livre com planilha progressiva de evolução.",
    benefits: ["Resistência", "Saúde cardiovascular", "Preparação para provas"],
    audience: "Corredores amadores",
  },
  {
    icon: "alongamento",
    title: "Alongamento",
    description: "Sessões guiadas de mobilidade e flexibilidade para complementar qualquer treino.",
    benefits: ["Prevenção de lesões", "Recuperação", "Mais mobilidade"],
    audience: "Todos os alunos",
  },
]

export type PlanTier = "basico" | "premium" | "vip"

export interface Plan {
  tier: PlanTier
  name: string
  price: number
  priceSuffix: string
  description: string
  features: string[]
  featured?: boolean
  cta: string
}

export const PLANS: Plan[] = [
  {
    tier: "basico",
    name: "Básico",
    price: 99,
    priceSuffix: "/mês",
    description: "Para quem quer começar a treinar com consistência.",
    features: ["Acesso em horário comercial", "Musculação liberada", "Avaliação física inicial", "App de acompanhamento"],
    cta: "Quero o Básico",
  },
  {
    tier: "premium",
    name: "Premium",
    price: 159,
    priceSuffix: "/mês",
    description: "Liberdade total de horário e todas as modalidades incluídas.",
    features: [
      "Horário livre, todos os dias",
      "Todas as modalidades",
      "Aulas em grupo ilimitadas",
      "Avaliação física trimestral",
      "App de acompanhamento",
    ],
    featured: true,
    cta: "Quero o Premium",
  },
  {
    tier: "vip",
    name: "VIP",
    price: 249,
    priceSuffix: "/mês",
    description: "Experiência completa com acompanhamento exclusivo.",
    features: [
      "Tudo do Premium incluso",
      "Avaliações físicas mensais",
      "1 sessão de personal trainer/mês",
      "Acesso a eventos exclusivos",
      "Convidado mensal gratuito",
    ],
    cta: "Quero o VIP",
  },
]

export const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const
export type Weekday = (typeof WEEKDAYS)[number]

export interface ScheduleClass {
  modality: string
  teacher: string
  day: Weekday
  time: string
}

export const SCHEDULE: ScheduleClass[] = [
  { modality: "Spinning", teacher: "Rafael Nogueira", day: "Segunda", time: "07:00" },
  { modality: "Funcional", teacher: "Camila Duarte", day: "Segunda", time: "08:00" },
  { modality: "Pilates", teacher: "Beatriz Marin", day: "Segunda", time: "18:00" },
  { modality: "Cross Training", teacher: "Thiago Almeida", day: "Terça", time: "07:00" },
  { modality: "Spinning", teacher: "Rafael Nogueira", day: "Terça", time: "19:00" },
  { modality: "Musculação", teacher: "Diego Ferraz", day: "Terça", time: "06:30" },
  { modality: "Funcional", teacher: "Camila Duarte", day: "Quarta", time: "08:00" },
  { modality: "Corrida", teacher: "Thiago Almeida", day: "Quarta", time: "06:00" },
  { modality: "Pilates", teacher: "Beatriz Marin", day: "Quarta", time: "18:00" },
  { modality: "Spinning", teacher: "Rafael Nogueira", day: "Quinta", time: "07:00" },
  { modality: "Cross Training", teacher: "Thiago Almeida", day: "Quinta", time: "19:00" },
  { modality: "Musculação", teacher: "Diego Ferraz", day: "Quinta", time: "06:30" },
  { modality: "Funcional", teacher: "Camila Duarte", day: "Sexta", time: "08:00" },
  { modality: "Spinning", teacher: "Rafael Nogueira", day: "Sexta", time: "19:00" },
  { modality: "Alongamento", teacher: "Beatriz Marin", day: "Sexta", time: "17:00" },
  { modality: "Cross Training", teacher: "Thiago Almeida", day: "Sábado", time: "09:00" },
  { modality: "Corrida", teacher: "Diego Ferraz", day: "Sábado", time: "08:00" },
]

export const SCHEDULE_MODALITY_FILTERS = ["Todas", ...Array.from(new Set(SCHEDULE.map((c) => c.modality)))]
export const SCHEDULE_DAY_FILTERS: ("Todos" | Weekday)[] = ["Todos", ...WEEKDAYS]

export interface Teacher {
  name: string
  specialty: string
  bio: string
  certifications: string[]
  initials: string
}

export const TEACHERS: Teacher[] = [
  {
    name: "Rafael Nogueira",
    specialty: "Spinning e Cardio",
    bio: "10 anos formando turmas de ciclismo indoor com foco em energia e performance.",
    certifications: ["CREF 12345-G/SP", "Cycling Coach Cert."],
    initials: "RN",
  },
  {
    name: "Camila Duarte",
    specialty: "Treinamento Funcional",
    bio: "Especialista em condicionamento físico geral e treinos de alta intensidade em grupo.",
    certifications: ["CREF 23456-G/SP", "Functional Training Cert."],
    initials: "CD",
  },
  {
    name: "Diego Ferraz",
    specialty: "Musculação e Hipertrofia",
    bio: "Acompanha alunos de todos os níveis com foco em técnica de execução e progressão de carga.",
    certifications: ["CREF 34567-G/SP", "Pós-graduação em Fisiologia do Exercício"],
    initials: "DF",
  },
  {
    name: "Beatriz Marin",
    specialty: "Pilates e Mobilidade",
    bio: "Trabalha postura, flexibilidade e prevenção de lesões com método progressivo.",
    certifications: ["CREF 45678-G/SP", "Pilates Method Cert."],
    initials: "BM",
  },
  {
    name: "Thiago Almeida",
    specialty: "Cross Training e Corrida",
    bio: "Treina atletas amadores para provas de corrida e competições de cross training.",
    certifications: ["CREF 56789-G/SP", "Coach de Corrida"],
    initials: "TA",
  },
]

export interface Testimonial {
  name: string
  since: string
  quote: string
  initials: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Lucas Andrade",
    since: "Aluno há 2 anos",
    quote: "Troquei de academia depois de anos sem resultado. Aqui, em 6 meses já vi minha hipertrofia decolar com o acompanhamento dos professores.",
    initials: "LA",
    rating: 5,
  },
  {
    name: "Fernanda Reis",
    since: "Aluna há 8 meses",
    quote: "O app de acompanhamento muda tudo. Consigo ver minha evolução de carga e isso me motiva a não faltar nenhum treino.",
    initials: "FR",
    rating: 5,
  },
  {
    name: "Bruno Castilho",
    since: "Aluno há 1 ano",
    quote: "A estrutura é impecável e o horário flexível encaixa perfeitamente na minha rotina de trabalho. Recomendo de olhos fechados.",
    initials: "BC",
    rating: 5,
  },
  {
    name: "Juliana Prado",
    since: "Aluna há 3 anos",
    quote: "Comecei sem nenhuma experiência e hoje me sinto outra pessoa. O personal trainer me deu confiança que eu nem sabia que tinha.",
    initials: "JP",
    rating: 4,
  },
]

export interface ResultStory {
  name: string
  goal: string
  duration: string
  before: string
  after: string
}

export const RESULTS: ResultStory[] = [
  {
    name: "Marcos Vinícius",
    goal: "Hipertrofia e ganho de massa muscular",
    duration: "8 meses",
    before: "68 kg de massa magra",
    after: "76 kg de massa magra",
  },
  {
    name: "Renata Lopes",
    goal: "Emagrecimento e condicionamento",
    duration: "6 meses",
    before: "82 kg",
    after: "69 kg",
  },
  {
    name: "Felipe Tanaka",
    goal: "Preparação para maratona",
    duration: "10 meses",
    before: "5 km em 32 min",
    after: "21 km em 1h38",
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Preciso agendar para treinar?",
    answer:
      "Não. Para musculação, cardio e funcional o acesso é livre dentro do horário do seu plano. Apenas as aulas em grupo (spinning, pilates, cross training) têm vagas limitadas e recomendamos reserva pelo app.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim, todos os planos podem ser cancelados sem multa com 30 dias de aviso prévio. Não exigimos fidelidade mínima em nenhum dos planos.",
  },
  {
    question: "A academia abre aos domingos?",
    answer:
      "Sim, funcionamos aos domingos em horário reduzido das 8h às 14h, ideal para quem quer manter a rotina de treino mesmo no fim de semana.",
  },
  {
    question: "Existe avaliação física?",
    answer:
      "Sim. Todo aluno passa por uma avaliação física na matrícula, e os planos Premium e VIP incluem reavaliações periódicas para acompanhar sua evolução.",
  },
  {
    question: "Vocês têm convênio com empresas?",
    answer:
      "Sim, oferecemos planos corporativos com condições especiais para empresas. Fale com um consultor pelo formulário de contato para receber uma proposta.",
  },
]

export const GOAL_OPTIONS = [
  { value: "hipertrofia", label: "Hipertrofia / ganho de massa" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "condicionamento", label: "Condicionamento físico" },
  { value: "saude", label: "Saúde e qualidade de vida" },
  { value: "performance", label: "Performance esportiva" },
] as const

export const MODALITY_OPTIONS = MODALITIES.map((m) => ({ value: m.title, label: m.title }))

export const TIME_PREFERENCE_OPTIONS = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
] as const

export const PAYMENT_OPTIONS = [
  { value: "cartao", label: "Cartão de crédito" },
  { value: "debito", label: "Débito automático" },
  { value: "pix", label: "Pix" },
  { value: "boleto", label: "Boleto bancário" },
] as const

export const PLAN_OPTIONS = PLANS.map((p) => ({ value: p.name, label: `${p.name} — R$ ${p.price}/mês` }))
