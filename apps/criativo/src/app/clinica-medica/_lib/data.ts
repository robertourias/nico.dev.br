// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API nesta fase; trocar por fonte dinâmica (CRM médico real) não deve
// afetar a tipagem.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Especialidades", href: "#especialidades" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Convênios", href: "#convenios" },
  { label: "FAQ", href: "#faq" },
]

export interface CredentialStat {
  value: number
  suffix: string
  label: string
  decimals?: number
}

export const HERO_CREDENTIALS: CredentialStat[] = [
  { value: 15, suffix: " anos", label: "De cuidado com pacientes" },
  { value: 32000, suffix: "+", label: "Pacientes atendidos" },
  { value: 4.9, suffix: "/5", label: "Avaliação média", decimals: 1 },
]

export type DifferentialIcon =
  | "heart"
  | "calendar"
  | "building"
  | "shield"
  | "results"
  | "graduation"

export interface Differential {
  icon: DifferentialIcon
  title: string
  description: string
}

export const DIFFERENTIALS: Differential[] = [
  {
    icon: "heart",
    title: "Atendimento Humanizado",
    description: "Cada paciente é acolhido com atenção, escuta e cuidado em todas as etapas do atendimento.",
  },
  {
    icon: "calendar",
    title: "Agendamento Online",
    description: "Marque sua consulta em poucos minutos, escolhendo especialidade, médico, data e horário.",
  },
  {
    icon: "building",
    title: "Estrutura Moderna",
    description: "Ambientes confortáveis, equipamentos atualizados e tecnologia para o seu diagnóstico.",
  },
  {
    icon: "shield",
    title: "Convênios Aceitos",
    description: "Atendimento pelos principais planos de saúde, além de consultas particulares.",
  },
  {
    icon: "results",
    title: "Resultados Online",
    description: "Acesse exames e resultados de forma segura, direto do computador ou do celular.",
  },
  {
    icon: "graduation",
    title: "Equipe Especializada",
    description: "Médicos com formação e experiência comprovada em suas respectivas especialidades.",
  },
]

export type SpecialtyIcon =
  | "geral"
  | "cardiologia"
  | "dermatologia"
  | "pediatria"
  | "ginecologia"
  | "ortopedia"
  | "endocrinologia"

export interface Specialty {
  icon: SpecialtyIcon
  title: string
  description: string
  href: string
}

export const SPECIALTIES: Specialty[] = [
  {
    icon: "geral",
    title: "Clínica Geral",
    description: "Avaliação completa da sua saúde, prevenção e acompanhamento clínico contínuo.",
    href: "#agendamento",
  },
  {
    icon: "cardiologia",
    title: "Cardiologia",
    description: "Diagnóstico e tratamento de doenças cardiovasculares com exames especializados.",
    href: "#agendamento",
  },
  {
    icon: "dermatologia",
    title: "Dermatologia",
    description: "Cuidados com a pele, tratamentos estéticos e diagnóstico de doenças dermatológicas.",
    href: "#agendamento",
  },
  {
    icon: "pediatria",
    title: "Pediatria",
    description: "Acompanhamento do crescimento e desenvolvimento de crianças e adolescentes.",
    href: "#agendamento",
  },
  {
    icon: "ginecologia",
    title: "Ginecologia",
    description: "Saúde da mulher em todas as fases da vida, com acompanhamento humanizado.",
    href: "#agendamento",
  },
  {
    icon: "ortopedia",
    title: "Ortopedia",
    description: "Diagnóstico e tratamento de lesões e doenças dos ossos, músculos e articulações.",
    href: "#agendamento",
  },
  {
    icon: "endocrinologia",
    title: "Endocrinologia",
    description: "Tratamento de distúrbios hormonais, diabetes, tireoide e metabolismo.",
    href: "#agendamento",
  },
]

export interface AboutStat {
  value: number
  suffix: string
  label: string
  decimals?: number
}

export const ABOUT_STATS: AboutStat[] = [
  { value: 15, suffix: "", label: "Anos de atuação" },
  { value: 32000, suffix: "+", label: "Pacientes atendidos" },
  { value: 24, suffix: "+", label: "Médicos especialistas" },
  { value: 4.9, suffix: "/5", label: "Avaliação média", decimals: 1 },
]

export interface TeamMember {
  name: string
  role: string
  specialty: string
  initials: string
  crm: string
  experience: string
  bio: string
  fullBio: string
}

export const TEAM: TeamMember[] = [
  {
    name: "Dra. Fernanda Costa",
    role: "Cardiologista",
    specialty: "Cardiologia Clínica e Preventiva",
    initials: "FC",
    crm: "CRM/SP 145.302",
    experience: "14 anos de experiência",
    bio: "Especialista em cardiologia clínica, com foco em prevenção de doenças cardiovasculares e acompanhamento de longo prazo.",
    fullBio:
      "Fernanda é cardiologista há 14 anos, com atuação dedicada ao diagnóstico precoce e à prevenção de doenças cardiovasculares. Acompanha pacientes em todas as faixas etárias, com ênfase em check-ups cardiológicos completos, ecocardiograma e manejo de hipertensão e colesterol. Defende que mudanças de hábito, quando bem orientadas, são tão importantes quanto o tratamento medicamentoso.",
  },
  {
    name: "Dr. Marcelo Tavares",
    role: "Clínico Geral",
    specialty: "Clínica Médica e Check-up",
    initials: "MT",
    crm: "CRM/SP 132.870",
    experience: "18 anos de experiência",
    bio: "Acompanhamento clínico completo, com foco em prevenção, diagnóstico precoce e encaminhamento especializado quando necessário.",
    fullBio:
      "Marcelo atua há 18 anos como clínico geral e costuma ser a porta de entrada dos pacientes na clínica. Conduz check-ups completos, investiga sintomas inespecíficos e organiza o encaminhamento para especialistas quando necessário, mantendo uma visão integral da saúde de cada paciente ao longo do tempo.",
  },
  {
    name: "Dra. Patrícia Lins",
    role: "Pediatra",
    specialty: "Pediatria e Puericultura",
    initials: "PL",
    crm: "CRM/SP 158.214",
    experience: "11 anos de experiência",
    bio: "Acompanhamento do crescimento e desenvolvimento infantil, com atenção próxima às famílias em cada fase.",
    fullBio:
      "Patrícia é pediatra há 11 anos e concentra sua atuação na puericultura — o acompanhamento contínuo do crescimento e desenvolvimento de crianças e adolescentes. Valoriza a relação de confiança com as famílias, explicando cada etapa de forma clara e tranquilizadora, especialmente nas primeiras consultas dos bebês.",
  },
  {
    name: "Dr. André Souza",
    role: "Ortopedista",
    specialty: "Ortopedia e Traumatologia",
    initials: "AS",
    crm: "CRM/SP 171.045",
    experience: "9 anos de experiência",
    bio: "Diagnóstico e tratamento de lesões músculo-esqueléticas, com foco em recuperação funcional e qualidade de vida.",
    fullBio:
      "André atua em ortopedia e traumatologia há 9 anos, com experiência em lesões esportivas, dores articulares e reabilitação pós-cirúrgica. Prioriza tratamentos conservadores sempre que possível, reservando a indicação cirúrgica para os casos em que realmente é a melhor alternativa para o paciente.",
  },
]

export interface ProcessStep {
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Escolha a Especialidade", description: "Selecione o tipo de consulta que você precisa." },
  { title: "Escolha o Profissional", description: "Veja os médicos disponíveis e os horários de atendimento." },
  { title: "Agende Online", description: "Confirme data, horário e convênio em poucos cliques." },
  { title: "Receba a Confirmação", description: "Receba os detalhes da consulta por e-mail ou WhatsApp." },
]

export interface InsurancePartner {
  name: string
}

export const INSURANCE_PARTNERS: InsurancePartner[] = [
  { name: "Unimed" },
  { name: "Bradesco Saúde" },
  { name: "SulAmérica" },
  { name: "Amil" },
  { name: "NotreDame Intermédica" },
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
    name: "Renata Alves",
    city: "São Paulo, SP",
    quote:
      "Levo meu filho para consultas com a Dra. Patrícia desde bebê. O atendimento é sempre atencioso e ela explica tudo com muita calma.",
    initials: "RA",
    rating: 5,
  },
  {
    name: "João Pedro Lima",
    city: "Campinas, SP",
    quote:
      "Fiz um check-up cardiológico completo e fui muito bem orientado em cada etapa. A estrutura da clínica é excelente.",
    initials: "JL",
    rating: 5,
  },
  {
    name: "Marta Souza",
    city: "São Paulo, SP",
    quote:
      "Agendei minha consulta pelo site em poucos minutos e recebi a confirmação no WhatsApp no mesmo dia. Muito prático.",
    initials: "MS",
    rating: 5,
  },
  {
    name: "Carlos Eduardo",
    city: "Santo André, SP",
    quote:
      "Levei minha mãe para uma consulta e o cuidado da equipe com ela foi excepcional, do agendamento até a saída.",
    initials: "CE",
    rating: 4,
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Como faço para agendar uma consulta?",
    answer:
      "Você pode agendar diretamente pelo nosso formulário online, escolhendo a especialidade, o médico, a data e o horário desejados. Nossa equipe entra em contato para confirmar os detalhes em até 1 dia útil. Também é possível agendar por telefone ou WhatsApp.",
  },
  {
    question: "A clínica atende convênios?",
    answer:
      "Sim. Atendemos os principais planos de saúde, como Unimed, Bradesco Saúde, SulAmérica, Amil e NotreDame Intermédica, além de consultas particulares. Indique seu convênio no formulário de agendamento para confirmarmos a cobertura.",
  },
  {
    question: "Posso remarcar minha consulta?",
    answer:
      "Sim, remarcações podem ser feitas sem custo com pelo menos 24 horas de antecedência. Basta entrar em contato pelo telefone ou WhatsApp informando o agendamento que deseja alterar.",
  },
  {
    question: "Vocês realizam exames?",
    answer:
      "Sim, a clínica conta com estrutura para exames de rotina e complementares conforme a especialidade, como eletrocardiograma e exames laboratoriais. Em casos que exigem equipamentos específicos, encaminhamos para parceiros de confiança.",
  },
  {
    question: "Como acessar meus resultados?",
    answer:
      "Os resultados de exames ficam disponíveis no portal online de resultados, com acesso seguro pelo computador ou celular. Você recebe um aviso por e-mail ou WhatsApp assim que o resultado é liberado.",
  },
]

export const SPECIALTY_OPTIONS = SPECIALTIES.map((specialty) => ({
  value: specialty.title,
  label: specialty.title,
}))

export const DOCTOR_OPTIONS = [
  { value: "sem-preferencia", label: "Sem preferência" },
  ...TEAM.map((member) => ({
    value: member.name,
    label: `${member.name} — ${member.specialty}`,
  })),
]

export const TIME_SLOT_OPTIONS = [
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
] as const

export const INSURANCE_OPTIONS = [
  ...INSURANCE_PARTNERS.map((partner) => ({ value: partner.name, label: partner.name })),
  { value: "particular", label: "Particular (sem convênio)" },
  { value: "outro", label: "Outro convênio" },
] as const
