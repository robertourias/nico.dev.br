// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API nesta fase; trocar por fonte dinâmica não deve afetar a tipagem.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Áreas de Atuação", href: "#areas" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Blog", href: "#blog" },
  { label: "Processo", href: "#processo" },
  { label: "FAQ", href: "#faq" },
]

export interface CredentialStat {
  value: number
  suffix: string
  label: string
}

export const HERO_CREDENTIALS: CredentialStat[] = [
  { value: 18, suffix: " anos", label: "De atuação no mercado" },
  { value: 1200, suffix: "+", label: "Casos atendidos" },
  { value: 97, suffix: "%", label: "Índice de satisfação" },
]

export type DifferentialIcon =
  | "heart"
  | "graduation"
  | "eye"
  | "award"
  | "zap"
  | "globe"

export interface Differential {
  icon: DifferentialIcon
  title: string
  description: string
}

export const DIFFERENTIALS: Differential[] = [
  {
    icon: "heart",
    title: "Atendimento Personalizado",
    description: "Cada cliente é acompanhado de forma próxima, com atenção real às particularidades do seu caso.",
  },
  {
    icon: "graduation",
    title: "Equipe Especializada",
    description: "Advogados com formação e atuação dedicada em suas respectivas áreas de especialidade.",
  },
  {
    icon: "eye",
    title: "Transparência nos Processos",
    description: "Comunicação clara sobre estratégias, prazos, custos e andamento de cada etapa jurídica.",
  },
  {
    icon: "award",
    title: "Experiência Comprovada",
    description: "Mais de uma década de atuação consolidada, com histórico de resultados favoráveis aos clientes.",
  },
  {
    icon: "zap",
    title: "Agilidade Jurídica",
    description: "Respostas rápidas e condução eficiente dos processos, sem abrir mão do rigor técnico.",
  },
  {
    icon: "globe",
    title: "Atendimento Presencial e Online",
    description: "Flexibilidade para receber você em nosso escritório ou conduzir toda a consulta remotamente.",
  },
]

export type PracticeAreaIcon =
  | "civil"
  | "trabalhista"
  | "empresarial"
  | "tributario"
  | "imobiliario"
  | "familia"
  | "previdenciario"
  | "consumidor"

export interface PracticeArea {
  icon: PracticeAreaIcon
  title: string
  description: string
  href: string
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    icon: "civil",
    title: "Direito Civil",
    description: "Contratos, responsabilidade civil e indenizações com defesa estratégica dos seus interesses.",
    href: "#agendamento",
  },
  {
    icon: "trabalhista",
    title: "Direito Trabalhista",
    description: "Assessoria para empresas e profissionais em questões de relações de trabalho e processos laborais.",
    href: "#agendamento",
  },
  {
    icon: "empresarial",
    title: "Direito Empresarial",
    description: "Estruturação societária, contratos comerciais e governança para negócios de todos os portes.",
    href: "#agendamento",
  },
  {
    icon: "tributario",
    title: "Direito Tributário",
    description: "Planejamento fiscal, defesa em autuações e revisão de tributos pagos indevidamente.",
    href: "#agendamento",
  },
  {
    icon: "imobiliario",
    title: "Direito Imobiliário",
    description: "Due diligence, contratos de compra e venda, locação e regularização de imóveis.",
    href: "#agendamento",
  },
  {
    icon: "familia",
    title: "Direito de Família",
    description: "Divórcios, partilha de bens, guarda e pensão alimentícia com condução humanizada.",
    href: "#agendamento",
  },
  {
    icon: "previdenciario",
    title: "Direito Previdenciário",
    description: "Concessão e revisão de benefícios do INSS, aposentadorias e auxílios previdenciários.",
    href: "#agendamento",
  },
  {
    icon: "consumidor",
    title: "Direito do Consumidor",
    description: "Defesa em relações de consumo, cobranças indevidas, vícios de produtos e serviços.",
    href: "#agendamento",
  },
]

export interface AboutStat {
  value: number
  suffix: string
  label: string
}

export const ABOUT_STATS: AboutStat[] = [
  { value: 18, suffix: "", label: "Anos de experiência" },
  { value: 1200, suffix: "+", label: "Casos atendidos" },
  { value: 340, suffix: "+", label: "Clientes ativos" },
  { value: 97, suffix: "%", label: "Índice de satisfação" },
]

export interface TeamMember {
  name: string
  role: string
  specialty: string
  initials: string
  bio: string
  fullBio: string
  oab: string
}

export const TEAM: TeamMember[] = [
  {
    name: "Beatriz Lemos",
    role: "Sócia Fundadora",
    specialty: "Direito Empresarial e Tributário",
    initials: "BL",
    bio: "Mais de 18 anos estruturando operações societárias e planejamento tributário para empresas de todos os portes.",
    fullBio:
      "Beatriz fundou o escritório com o propósito de oferecer assessoria jurídica empresarial de alto nível com proximidade real ao cliente. Atua há 18 anos em direito empresarial e tributário, com passagem por grandes bancas antes de estruturar sua própria atuação. Já liderou processos de reestruturação societária, due diligence e defesa em autuações fiscais para empresas de diversos setores.",
    oab: "OAB/SP 184.532",
  },
  {
    name: "Rafael Bastos",
    role: "Sócio Fundador",
    specialty: "Direito Civil e Imobiliário",
    initials: "RB",
    bio: "Especialista em contratos e operações imobiliárias complexas, com forte atuação em negociação extrajudicial.",
    fullBio:
      "Rafael é sócio fundador do escritório e concentra sua atuação em direito civil e imobiliário, com ênfase em due diligence imobiliária, contratos de compra e venda e regularização de empreendimentos. Defende a resolução negociada de conflitos sempre que possível, reservando o litígio para os casos em que é estritamente necessário.",
    oab: "OAB/SP 191.047",
  },
  {
    name: "Camila Andrade",
    role: "Advogada Sênior",
    specialty: "Direito Trabalhista",
    initials: "CA",
    bio: "Atua na defesa de empresas e trabalhadores, com foco em prevenção de litígios e compliance trabalhista.",
    fullBio:
      "Camila é advogada sênior da equipe e concentra sua atuação em direito trabalhista, atendendo tanto empresas que buscam reduzir riscos de litígio quanto trabalhadores em busca de seus direitos. Tem experiência relevante em auditorias de compliance trabalhista e em processos perante a Justiça do Trabalho.",
    oab: "OAB/SP 203.918",
  },
  {
    name: "Thiago Monteiro",
    role: "Advogado Sênior",
    specialty: "Direito de Família e Sucessões",
    initials: "TM",
    bio: "Condução humanizada de processos sensíveis, com foco em mediação e acordos extrajudiciais.",
    fullBio:
      "Thiago dedica sua atuação ao direito de família e sucessões, com abordagem humanizada em processos como divórcios, partilha de bens, guarda de filhos e inventários. Prioriza a mediação e os acordos extrajudiciais, buscando reduzir o desgaste emocional das partes envolvidas sempre que possível.",
    oab: "OAB/SP 215.604",
  },
]

export type BlogCategory = "Trabalhista" | "Empresarial" | "Família" | "Tributário" | "Imobiliário"

export interface BlogPost {
  title: string
  category: BlogCategory
  date: string
  excerpt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Reforma trabalhista: o que mudou para empresas em 2026",
    category: "Trabalhista",
    date: "15 jun 2026",
    excerpt: "Principais pontos de atenção para adequar contratos e políticas internas às novas regras.",
  },
  {
    title: "Como estruturar um contrato societário à prova de conflitos",
    category: "Empresarial",
    date: "02 jun 2026",
    excerpt: "Cláusulas essenciais para evitar disputas entre sócios e proteger o negócio no longo prazo.",
  },
  {
    title: "Guarda compartilhada: direitos e deveres de cada responsável",
    category: "Família",
    date: "20 mai 2026",
    excerpt: "Entenda como funciona na prática e o que considerar antes de buscar um acordo ou ação judicial.",
  },
  {
    title: "Planejamento tributário: o que é lícito e o que é risco fiscal",
    category: "Tributário",
    date: "08 mai 2026",
    excerpt: "A linha entre elisão fiscal legítima e práticas que podem gerar autuação da Receita Federal.",
  },
  {
    title: "Due diligence imobiliária: o checklist antes de fechar negócio",
    category: "Imobiliário",
    date: "24 abr 2026",
    excerpt: "Documentos e certidões que evitam dores de cabeça em compras de imóveis residenciais e comerciais.",
  },
  {
    title: "Rescisão indireta: quando o trabalhador pode pedir o rompimento",
    category: "Trabalhista",
    date: "11 abr 2026",
    excerpt: "Situações que configuram falta grave do empregador e os direitos garantidos nesses casos.",
  },
]

export interface ProcessStep {
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Primeiro Contato", description: "Você nos conta brevemente sobre o seu caso." },
  { title: "Análise do Caso", description: "Avaliamos a situação e a documentação disponível." },
  { title: "Reunião Consultiva", description: "Conversa detalhada, presencial ou online, sobre o cenário." },
  { title: "Estratégia Jurídica", description: "Definimos juntos o melhor caminho a seguir." },
  { title: "Acompanhamento", description: "Atualizações constantes sobre o andamento do processo." },
]

export interface Testimonial {
  name: string
  city: string
  quote: string
  initials: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marcos Vieira",
    city: "São Paulo, SP",
    quote:
      "Fui muito bem orientado durante todo o processo de divórcio. A equipe foi clara em cada etapa e conseguiu um acordo justo sem desgaste desnecessário.",
    initials: "MV",
    rating: 5,
  },
  {
    name: "Juliana Pires",
    city: "Campinas, SP",
    quote:
      "Como empresária, precisava de segurança jurídica para revisar contratos com fornecedores. O atendimento foi rápido e extremamente competente.",
    initials: "JP",
    rating: 5,
  },
  {
    name: "Eduardo Salles",
    city: "São Paulo, SP",
    quote:
      "Recuperei valores pagos indevidamente em um processo tributário que já considerava perdido. Profissionalismo do início ao fim.",
    initials: "ES",
    rating: 5,
  },
  {
    name: "Renata Coutinho",
    city: "Santo André, SP",
    quote:
      "O acompanhamento do meu processo trabalhista foi transparente em cada audiência. Sempre fui informada antes de qualquer decisão importante.",
    initials: "RC",
    rating: 4,
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Como funciona a primeira consulta?",
    answer:
      "A primeira consulta serve para entendermos seu caso, avaliar a documentação disponível e apresentar um panorama inicial das possibilidades jurídicas. Pode ser feita presencialmente em nosso escritório ou de forma online.",
  },
  {
    question: "O atendimento pode ser online?",
    answer:
      "Sim. Conduzimos consultas, reuniões e até o acompanhamento de boa parte dos processos de forma totalmente remota, por videochamada ou telefone, sem perda de qualidade no atendimento.",
  },
  {
    question: "Quais documentos são necessários?",
    answer:
      "Varia conforme a área do direito envolvida. Em geral, pedimos documentos pessoais, contratos relacionados ao caso e qualquer correspondência ou notificação recebida. Orientamos a lista completa já na primeira conversa.",
  },
  {
    question: "Como posso acompanhar meu processo?",
    answer:
      "Você recebe atualizações periódicas da equipe responsável pelo seu caso, com explicações claras sobre cada movimentação processual relevante, sem jargões desnecessários.",
  },
  {
    question: "Qual o prazo para retorno?",
    answer:
      "Respondemos a solicitações de contato em até 1 dia útil. Para clientes com processos em andamento, o prazo de retorno sobre dúvidas pontuais costuma ser ainda mais rápido.",
  },
]

export const INTEREST_AREAS = [
  { value: "civil", label: "Direito Civil" },
  { value: "trabalhista", label: "Direito Trabalhista" },
  { value: "empresarial", label: "Direito Empresarial" },
  { value: "tributario", label: "Direito Tributário" },
  { value: "imobiliario", label: "Direito Imobiliário" },
  { value: "familia", label: "Direito de Família" },
  { value: "previdenciario", label: "Direito Previdenciário" },
  { value: "consumidor", label: "Direito do Consumidor" },
  { value: "outro", label: "Outro assunto" },
] as const

export const BEST_TIME_OPTIONS = [
  { value: "manha", label: "Manhã (8h às 12h)" },
  { value: "tarde", label: "Tarde (12h às 18h)" },
  { value: "noite", label: "Noite (18h às 20h)" },
] as const
