// Conteúdo estático da landing — centralizado aqui para manter os
// componentes de _components/ focados em apresentação. Nenhum dado vem de
// CMS/API/portal imobiliário nesta fase; trocar por fonte dinâmica (ex.
// integração com CRM ou portal de anúncios) não deve afetar a tipagem.
//
// `Property.image` aponta para fotos reais do Unsplash (licença Unsplash —
// uso livre, sem necessidade de atribuição), uma por imóvel. Categorias sem
// foto correspondente (ex. estados vazios) continuam usando o fallback de
// gradiente + ícone em `PropertyVisual`. Ver _components/PropertyVisual.tsx.

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Imóveis", href: "#imoveis" },
  { label: "Estilos de Vida", href: "#estilos" },
  { label: "Regiões", href: "#regioes" },
  { label: "Simulador", href: "#simulador" },
  { label: "Tour Virtual", href: "#tour" },
  { label: "Mercado", href: "#mercado" },
  { label: "Blog", href: "#blog" },
]

export type LifestyleKey = "urbana" | "familia" | "investimento" | "alto-padrao" | "comercial"

export interface Lifestyle {
  key: LifestyleKey
  title: string
  description: string
}

export const LIFESTYLES: Lifestyle[] = [
  {
    key: "urbana",
    title: "Vida Urbana",
    description: "Apartamentos compactos e bem localizados, próximos a centros comerciais e vida noturna.",
  },
  {
    key: "familia",
    title: "Família",
    description: "Casas espaçosas em bairros residenciais tranquilos, com áreas verdes e escolas por perto.",
  },
  {
    key: "investimento",
    title: "Investimento",
    description: "Imóveis com potencial de valorização e boa liquidez para rentabilizar capital no médio prazo.",
  },
  {
    key: "alto-padrao",
    title: "Alto Padrão",
    description: "Empreendimentos exclusivos, com metragens generosas, vistas privilegiadas e acabamento premium.",
  },
  {
    key: "comercial",
    title: "Comercial",
    description: "Salas e escritórios em endereços estratégicos para empresas que buscam presença e prestígio.",
  },
]

export type RegionKey = "zona-sul" | "zona-oeste" | "centro" | "regiao-metropolitana"

export interface Region {
  key: RegionKey
  title: string
  propertiesCount: number
  averagePrice: string
  valuationTrend: string
  averageSqmPrice: number
  annualGrowth: number
}

export const REGIONS: Region[] = [
  {
    key: "zona-sul",
    title: "Zona Sul",
    propertiesCount: 184,
    averagePrice: "R$ 2,1 mi",
    valuationTrend: "+9,4% ao ano",
    averageSqmPrice: 14200,
    annualGrowth: 9.4,
  },
  {
    key: "zona-oeste",
    title: "Zona Oeste",
    propertiesCount: 132,
    averagePrice: "R$ 980 mil",
    valuationTrend: "+7,1% ao ano",
    averageSqmPrice: 11800,
    annualGrowth: 7.1,
  },
  {
    key: "centro",
    title: "Centro",
    propertiesCount: 96,
    averagePrice: "R$ 620 mil",
    valuationTrend: "+5,8% ao ano",
    averageSqmPrice: 8400,
    annualGrowth: 5.8,
  },
  {
    key: "regiao-metropolitana",
    title: "Região Metropolitana",
    propertiesCount: 211,
    averagePrice: "R$ 1,3 mi",
    valuationTrend: "+8,2% ao ano",
    averageSqmPrice: 6900,
    annualGrowth: 8.2,
  },
]

export interface Property {
  id: string
  name: string
  neighborhood: string
  region: RegionKey
  category: LifestyleKey
  area: number
  bedrooms: number | null
  parking: number
  price: number
  priceLabel: string
  tag?: string
  image: string
}

export const PROPERTIES: Property[] = [
  {
    id: "residencia-jardins-alto",
    name: "Residência Jardins Alto",
    neighborhood: "Jardim Europa",
    region: "zona-sul",
    category: "alto-padrao",
    area: 420,
    bedrooms: 5,
    parking: 4,
    price: 8900000,
    priceLabel: "R$ 8.900.000",
    tag: "Exclusivo",
    image: "https://images.unsplash.com/photo-1773427614314-6bd0b6115a40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "loft-vila-madalena",
    name: "Loft Urbano Vila Madalena",
    neighborhood: "Vila Madalena",
    region: "zona-oeste",
    category: "urbana",
    area: 68,
    bedrooms: 1,
    parking: 1,
    price: 720000,
    priceLabel: "R$ 720.000",
    tag: "Novo",
    image: "https://images.unsplash.com/photo-1736214544553-09f00710e345?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cobertura-itaim",
    name: "Cobertura Panorâmica Itaim",
    neighborhood: "Itaim Bibi",
    region: "zona-sul",
    category: "alto-padrao",
    area: 310,
    bedrooms: 4,
    parking: 3,
    price: 6200000,
    priceLabel: "R$ 6.200.000",
    tag: "Vista 360°",
    image: "https://images.unsplash.com/photo-1707905729981-c89310889b03?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "casa-alphaville",
    name: "Casa Família Alphaville",
    neighborhood: "Alphaville",
    region: "regiao-metropolitana",
    category: "familia",
    area: 280,
    bedrooms: 4,
    parking: 3,
    price: 2450000,
    priceLabel: "R$ 2.450.000",
    image: "https://images.unsplash.com/photo-1694556586916-7b5912ba8e62?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sala-faria-lima",
    name: "Sala Corporativa Faria Lima",
    neighborhood: "Faria Lima",
    region: "zona-sul",
    category: "comercial",
    area: 95,
    bedrooms: null,
    parking: 2,
    price: 1890000,
    priceLabel: "R$ 1.890.000",
    image: "https://images.unsplash.com/photo-1746021535489-00edc5efb203?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "apartamento-pinheiros",
    name: "Apartamento Investidor Pinheiros",
    neighborhood: "Pinheiros",
    region: "zona-oeste",
    category: "investimento",
    area: 52,
    bedrooms: 2,
    parking: 1,
    price: 540000,
    priceLabel: "R$ 540.000",
    tag: "Alta liquidez",
    image: "https://images.unsplash.com/photo-1768638687896-35bde623d532?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "residencia-centro-historico",
    name: "Residência Centro Histórico",
    neighborhood: "Centro Histórico",
    region: "centro",
    category: "urbana",
    area: 140,
    bedrooms: 3,
    parking: 2,
    price: 980000,
    priceLabel: "R$ 980.000",
    image: "https://images.unsplash.com/photo-1768141113540-53a89a536e11?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mansao-granja-viana",
    name: "Mansão Granja Viana",
    neighborhood: "Granja Viana",
    region: "regiao-metropolitana",
    category: "alto-padrao",
    area: 650,
    bedrooms: 6,
    parking: 6,
    price: 12500000,
    priceLabel: "R$ 12.500.000",
    tag: "Exclusivo",
    image: "https://images.unsplash.com/photo-1696008068310-936be0ff3a44?auto=format&fit=crop&w=1200&q=80",
  },
]

export interface TourStop {
  propertyId: string
  address: string
}

export const TOUR_STOPS: TourStop[] = [
  { propertyId: "residencia-jardins-alto", address: "Jardim Europa, São Paulo - SP" },
  { propertyId: "cobertura-itaim", address: "Itaim Bibi, São Paulo - SP" },
  { propertyId: "casa-alphaville", address: "Alphaville, Santana de Parnaíba - SP" },
  { propertyId: "mansao-granja-viana", address: "Granja Viana, Cotia - SP" },
]

export interface ProcessStep {
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Encontrar oportunidades", description: "Explore imóveis selecionados por região, estilo de vida e objetivo." },
  { title: "Receber consultoria especializada", description: "Um consultor entende seu perfil e refina as opções com você." },
  { title: "Agendar visita", description: "Visite presencialmente ou faça um tour virtual 360° antes de decidir." },
  { title: "Negociar", description: "Condução transparente da proposta, condições e documentação." },
  { title: "Fechar negócio", description: "Assinatura, registro e acompanhamento até a entrega das chaves." },
]

export interface Testimonial {
  name: string
  initials: string
  property: string
  situation: string
  challenge: string
  solution: string
  result: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marina e Felipe Cordeiro",
    initials: "MF",
    property: "Cobertura Panorâmica Itaim",
    situation: "Casal buscando o primeiro imóvel de alto padrão após a venda da empresa.",
    challenge: "Encontrar uma cobertura com vista aberta sem abrir mão de localização central.",
    solution: "Curadoria de 4 opções compatíveis com o perfil, com tour virtual antes da visita presencial.",
    result: "Compra fechada em 3 semanas, com negociação de 6% abaixo do valor pedido.",
  },
  {
    name: "Renato Salgado",
    initials: "RS",
    property: "Apartamento Investidor Pinheiros",
    situation: "Investidor iniciante com capital disponível e pouca experiência no mercado imobiliário.",
    challenge: "Identificar a região com melhor relação entre liquidez e potencial de valorização.",
    solution: "Simulador de perfil indicou Pinheiros, com indicadores de mercado embasando a decisão.",
    result: "Imóvel alugado em 12 dias após a compra, com retorno acima da média da região.",
  },
  {
    name: "Família Andrade",
    initials: "FA",
    property: "Casa Família Alphaville",
    situation: "Família com duas crianças pequenas buscando mais espaço e segurança.",
    challenge: "Equilibrar orçamento, distância do trabalho e qualidade das escolas na região.",
    solution: "Filtro por estilo de vida 'Família' e consultoria dedicada para visitas no fim de semana.",
    result: "Mudança concluída em 45 dias, com financiamento aprovado já na primeira instituição.",
  },
]

export type BlogCategory = "Financiamento" | "Mercado" | "Regiões" | "Investidores"

export interface BlogPost {
  title: string
  category: BlogCategory
  date: string
  excerpt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Como financiar seu primeiro imóvel sem surpresas",
    category: "Financiamento",
    date: "18 jun 2026",
    excerpt: "Entenda taxas, entrada mínima e o que os bancos avaliam antes de aprovar o crédito.",
  },
  {
    title: "Tendências do mercado imobiliário para os próximos 12 meses",
    category: "Mercado",
    date: "09 jun 2026",
    excerpt: "Juros, oferta de novos lançamentos e o comportamento da demanda em capitais e regiões metropolitanas.",
  },
  {
    title: "As regiões com maior valorização nos últimos 3 anos",
    category: "Regiões",
    date: "27 mai 2026",
    excerpt: "Mapeamos os bairros que mais valorizaram e o que impulsionou esse movimento de preço.",
  },
  {
    title: "5 indicadores que todo investidor imobiliário deveria acompanhar",
    category: "Investidores",
    date: "14 mai 2026",
    excerpt: "Do cap rate ao tempo médio de locação: métricas práticas para decidir com mais segurança.",
  },
]

export const BUDGET_OPTIONS = [
  { value: "até-600k", label: "Até R$ 600 mil" },
  { value: "600k-1.5mi", label: "R$ 600 mil – R$ 1,5 mi" },
  { value: "1.5mi-4mi", label: "R$ 1,5 mi – R$ 4 mi" },
  { value: "acima-4mi", label: "Acima de R$ 4 mi" },
] as const

export const PURPOSE_OPTIONS = [
  { value: "morar", label: "Morar" },
  { value: "investir", label: "Investir" },
] as const

export const PRICE_RANGE_OPTIONS = [
  { value: "todos", label: "Qualquer valor" },
  { value: "até-800k", label: "Até R$ 800 mil" },
  { value: "800k-3mi", label: "R$ 800 mil – R$ 3 mi" },
  { value: "acima-3mi", label: "Acima de R$ 3 mi" },
] as const

export const BEDROOM_OPTIONS = [
  { value: "qualquer", label: "Qualquer" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
] as const

export const MAIN_INTEREST_OPTIONS = [
  { value: "comprar-morar", label: "Comprar para morar" },
  { value: "comprar-investir", label: "Comprar para investir" },
  { value: "vender", label: "Vender um imóvel" },
  { value: "alugar", label: "Alugar" },
] as const
