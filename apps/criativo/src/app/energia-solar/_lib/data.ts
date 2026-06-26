// Dados estáticos desta campanha — cidades, tipos de imóvel, indicadores,
// etapas do processo, projetos da galeria, benefícios e FAQ. Mantido
// separado do motor de cálculo (calculations.ts) para que conteúdo editorial
// e lógica numérica evoluam de forma independente.

export type CityKey =
  | "sao-paulo"
  | "rio-de-janeiro"
  | "belo-horizonte"
  | "brasilia"
  | "salvador"
  | "fortaleza"
  | "recife"
  | "porto-alegre"
  | "curitiba"
  | "manaus"
  | "goiania"
  | "outra"

// HSP = Horas de Sol Pico/dia, médias anuais aproximadas por região
// (valores didáticos, baseados em médias públicas de irradiância solar no
// Brasil — não substituem um estudo de viabilidade real por CEP).
export const CITIES: { key: CityKey; label: string; hsp: number }[] = [
  { key: "sao-paulo", label: "São Paulo, SP", hsp: 4.6 },
  { key: "rio-de-janeiro", label: "Rio de Janeiro, RJ", hsp: 4.9 },
  { key: "belo-horizonte", label: "Belo Horizonte, MG", hsp: 5.3 },
  { key: "brasilia", label: "Brasília, DF", hsp: 5.5 },
  { key: "salvador", label: "Salvador, BA", hsp: 5.2 },
  { key: "fortaleza", label: "Fortaleza, CE", hsp: 5.6 },
  { key: "recife", label: "Recife, PE", hsp: 5.4 },
  { key: "porto-alegre", label: "Porto Alegre, RS", hsp: 4.8 },
  { key: "curitiba", label: "Curitiba, PR", hsp: 4.4 },
  { key: "manaus", label: "Manaus, AM", hsp: 4.3 },
  { key: "goiania", label: "Goiânia, GO", hsp: 5.4 },
  { key: "outra", label: "Outra cidade", hsp: 5.0 },
]

export type PropertyTypeKey = "casa-terrea" | "sobrado" | "apartamento" | "comercial-rural"

export const PROPERTY_TYPES: { key: PropertyTypeKey; label: string; roofFactor: number; note: string }[] = [
  { key: "casa-terrea", label: "Casa térrea", roofFactor: 1, note: "Telhado com ótima exposição solar." },
  { key: "sobrado", label: "Sobrado", roofFactor: 0.95, note: "Boa área de instalação, leve perda por orientação." },
  { key: "apartamento", label: "Apartamento", roofFactor: 0.85, note: "Viabilidade depende de área comum do condomínio." },
  { key: "comercial-rural", label: "Comercial / Rural", roofFactor: 1.08, note: "Geralmente mais área de telhado disponível." },
]

export interface Indicator {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
}

export const INDICATORS: Indicator[] = [
  { value: 4500, prefix: "+", label: "Projetos entregues" },
  { value: 98, suffix: "%", label: "Satisfação dos clientes" },
  { value: 95, prefix: "até ", suffix: "%", label: "Redução na conta de luz" },
  { value: 25, suffix: " anos", label: "Vida útil do sistema" },
  { value: 100, suffix: "%", label: "Atendimento nacional" },
]

export interface ProcessStep {
  key: string
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    key: "descoberta",
    title: "Descoberta",
    description: "Entendemos seu consumo, sua conta de energia e o potencial do seu telhado.",
  },
  {
    key: "projeto",
    title: "Projeto",
    description: "Dimensionamos o sistema ideal e apresentamos o investimento e o retorno esperado.",
  },
  {
    key: "instalacao",
    title: "Instalação",
    description: "Equipe certificada instala os painéis e o inversor com segurança e agilidade.",
  },
  {
    key: "monitoramento",
    title: "Monitoramento",
    description: "Acompanhe a geração de energia em tempo real, direto do seu celular.",
  },
]

export interface Project {
  id: string
  city: string
  powerKwp: number
  monthlySavings: number
  image: string
  gallery: string[]
}

export const PROJECTS: Project[] = [
  {
    id: "p1",
    city: "Campinas, SP",
    powerKwp: 8.4,
    monthlySavings: 720,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p2",
    city: "Uberlândia, MG",
    powerKwp: 12.1,
    monthlySavings: 980,
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620912189868-1f5f57e90f56?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p3",
    city: "Fortaleza, CE",
    powerKwp: 6.2,
    monthlySavings: 510,
    image:
      "https://images.unsplash.com/photo-1637417494521-78b4d1d33029?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1637417494521-78b4d1d33029?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p4",
    city: "Curitiba, PR",
    powerKwp: 9.8,
    monthlySavings: 690,
    image:
      "https://images.unsplash.com/flagged/photo-1566838616838-c3a720672aad?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/flagged/photo-1566838616838-c3a720672aad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1655300256335-beef51a914fe?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p5",
    city: "Salvador, BA",
    powerKwp: 14.5,
    monthlySavings: 1180,
    image:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620912189868-1f5f57e90f56?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p6",
    city: "Porto Alegre, RS",
    powerKwp: 7.3,
    monthlySavings: 560,
    image:
      "https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1677938438553-74e2dd0005df?q=80&w=1200&auto=format&fit=crop",
    ],
  },
]

export interface Benefit {
  key: string
  label: string
  description: string
}

export const BENEFITS: Benefit[] = [
  { key: "economia", label: "Economia", description: "Reduza sua conta de luz em até 95% todos os meses." },
  { key: "valorizacao", label: "Valorização do imóvel", description: "Imóveis com energia solar valorizam até 8%." },
  { key: "sustentabilidade", label: "Sustentabilidade", description: "Energia limpa, sem emissão de carbono na geração." },
  { key: "autonomia", label: "Autonomia", description: "Menos dependência das tarifas da concessionária." },
  { key: "manutencao", label: "Baixa manutenção", description: "Sistema robusto, com manutenção mínima por 25 anos." },
  { key: "protecao", label: "Proteção tarifária", description: "Blindagem contra os aumentos anuais de energia." },
]

export interface ComparisonRow {
  label: string
  traditionalKey: "monthly" | "annual" | "carbon" | "dependency"
  unit?: string
  /** Valor "antes" (conta tradicional), exemplificativo para uma residência de consumo médio. */
  traditional: number
  /** Valor "depois" (com energia solar), exemplificativo. */
  solar: number
  /** Prefixo de exibição (ex.: "R$"). */
  prefix?: string
}

// Valores exemplificativos para uma residência com consumo médio de
// ~490 kWh/mês (conta de R$450) — mesma ordem de grandeza dos defaults do
// simulador (_lib/calculations.ts), para que a seção comparativa não pareça
// desconectada do restante da página, sem acoplar este conteúdo editorial
// ao estado do simulador (seções independentes, conforme estrutura da página).
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Valor mensal", traditionalKey: "monthly", prefix: "R$", traditional: 450, solar: 50 },
  { label: "Gasto anual", traditionalKey: "annual", prefix: "R$", traditional: 5400, solar: 600 },
  { label: "Emissão de carbono", traditionalKey: "carbon", unit: "kg CO₂/ano", traditional: 420, solar: 29 },
  { label: "Dependência da concessionária", traditionalKey: "dependency", unit: "%", traditional: 100, solar: 7 },
]

/** Economia acumulada (R$) ano a ano, para o quinto card do comparativo. */
export const ACCUMULATED_SAVINGS_5Y = [4800, 9600, 14400, 19200, 24300]

export interface EnergyFlowStep {
  key: string
  label: string
  description: string
}

export const ENERGY_FLOW_STEPS: EnergyFlowStep[] = [
  {
    key: "sol",
    label: "Sol",
    description: "A luz solar incide sobre os painéis instalados no telhado, em qualquer região do Brasil.",
  },
  {
    key: "paineis",
    label: "Painéis",
    description: "Os painéis fotovoltaicos convertem a luz solar em energia elétrica de corrente contínua (CC).",
  },
  {
    key: "inversor",
    label: "Inversor",
    description: "O inversor transforma a energia CC dos painéis em corrente alternada (CA), pronta para uso na casa.",
  },
  {
    key: "casa",
    label: "Casa",
    description: "A energia gerada abastece diretamente os equipamentos e eletrodomésticos da sua residência.",
  },
  {
    key: "rede",
    label: "Rede elétrica",
    description: "O excedente é injetado na rede da concessionária, gerando créditos de energia para meses futuros.",
  },
  {
    key: "economia",
    label: "Economia",
    description: "O resultado final: uma conta de energia drasticamente menor, todos os meses, por até 25 anos.",
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Quanto tempo dura a instalação de um sistema de energia solar?",
    answer:
      "Para a maioria das residências, a instalação leva de 1 a 3 dias. O prazo total do projeto, incluindo aprovação na concessionária, costuma variar entre 30 e 60 dias.",
  },
  {
    question: "Funciona em dias nublados ou à noite?",
    answer:
      "Sim. Em dias nublados o sistema continua gerando energia, com produção reduzida. À noite, sua casa utiliza energia da rede normalmente — o sistema funciona em conjunto com a concessionária, sem baterias na maioria dos projetos residenciais.",
  },
  {
    question: "Preciso de manutenção frequente?",
    answer:
      "Não. A manutenção é mínima: limpeza dos painéis a cada 6-12 meses e uma inspeção preventiva anual. Os painéis têm garantia de performance de até 25 anos.",
  },
  {
    question: "O que acontece se eu gerar mais energia do que consumo?",
    answer:
      "O excedente é injetado na rede da concessionária e gera créditos de energia, que podem ser usados para abater seu consumo em meses de menor geração, conforme o sistema de compensação de energia elétrica (SCEE/ANEEL).",
  },
  {
    question: "Quanto tempo leva para o investimento se pagar?",
    answer:
      "O retorno (payback) médio fica entre 3 e 6 anos, dependendo do consumo, da região e do valor atual da sua conta de energia. Use o simulador acima para uma estimativa personalizada.",
  },
]
