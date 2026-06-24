// Conteúdo fictício do restaurante ÂMBAR — Cozinha de Autor. Centralizado
// aqui para ser consumido por componentes de servidor e cliente sem duplicar
// dados (cardápio, eventos e a Reserva Inteligente compartilham as mesmas
// listas de opções).

export const NAV_LINKS = [
  { label: "Cardápio", href: "#cardapio" },
  { label: "Reservas", href: "#reservas" },
  { label: "Experiências", href: "#experiencias" },
  { label: "Contato", href: "#contato" },
] as const

export const HERO_CREDENTIALS = [
  { label: "Estrela em guias gastronômicos", value: 1 },
  { label: "Anos de cozinha de autor", value: 12 },
  { label: "Pratos assinados pelo chef", value: 38 },
] as const

// ---------- Jornada dos Sabores (substitui "Sobre Nós") ----------
export type JourneyIcon = "door-open" | "leaf" | "utensils-crossed" | "cherry"

export interface JourneyStep {
  title: string
  caption: string
  description: string
  icon: JourneyIcon
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "Recepção",
    caption: "O primeiro gesto",
    description:
      "Luz baixa, aroma de pão recém-saído do forno e uma taça de espumante para abrir os sentidos antes do primeiro prato.",
    icon: "door-open",
  },
  {
    title: "Entrada",
    caption: "Pratos leves",
    description:
      "Texturas delicadas e ingredientes da estação, pensados para despertar o apetite sem antecipar a intensidade do prato principal.",
    icon: "leaf",
  },
  {
    title: "Principal",
    caption: "Especialidades da casa",
    description:
      "O coração da experiência: técnicas de cocção lentas, carnes nobres e frutos do mar selecionados, assinados pelo chef.",
    icon: "utensils-crossed",
  },
  {
    title: "Sobremesa",
    caption: "Finalização da experiência",
    description:
      "Um fechamento sensorial — doçura equilibrada, café de torra exclusiva e a lembrança que fica depois da última garfada.",
    icon: "cherry",
  },
]

// ---------- Ingredientes em Evidência ----------
export type IngredientIcon = "gem" | "shell" | "beef" | "sprout"

export interface Ingredient {
  id: string
  name: string
  icon: IngredientIcon
  origem: string
  curiosidade: string
  pratosRelacionados: string[]
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: "trufas",
    name: "Trufas Negras",
    icon: "gem",
    origem: "Périgord, França — colhidas entre dezembro e março, sob carvalhos centenários.",
    curiosidade: "Cada exemplar é farejado por cães treinados; o aroma se intensifica nas primeiras 48h após a colheita.",
    pratosRelacionados: ["Risoto de Trufas Negras", "Filé ao Molho de Trufas"],
  },
  {
    id: "frutos-do-mar",
    name: "Frutos do Mar",
    icon: "shell",
    origem: "Pesca artesanal da costa de Santa Catarina, recebida fresca três vezes por semana.",
    curiosidade: "Trabalhamos com pescadores parceiros há 9 anos — rastreabilidade total, do mar à mesa em menos de 24h.",
    pratosRelacionados: ["Camarões na Manteiga de Alho Negro", "Risoto de Frutos do Mar"],
  },
  {
    id: "carnes-nobres",
    name: "Carnes Nobres",
    icon: "beef",
    origem: "Black Angus de criação a pasto nas pampas gaúchas, maturação seca de 28 dias.",
    curiosidade: "A maturação é feita em câmara própria, com controle diário de temperatura e umidade pela nossa equipe.",
    pratosRelacionados: ["Filé Mignon Maturado", "Costela Braseada 12h"],
  },
  {
    id: "ervas-frescas",
    name: "Ervas Frescas",
    icon: "sprout",
    origem: "Horta própria no terraço do restaurante, colhida poucas horas antes do serviço.",
    curiosidade: "Mais de 20 variedades cultivadas sem agrotóxicos, incluindo flores comestíveis usadas na finalização dos pratos.",
    pratosRelacionados: ["Salada de Folhas e Flores", "Peixe Branco com Ervas do Jardim"],
  },
]

// ---------- Mesa do Chef ----------
export type ChefTopic = "Filosofia Culinária" | "Técnica Favorita" | "Inspiração"

export interface ChefThought {
  topic: ChefTopic
  quote: string
}

export const CHEF_THOUGHTS: ChefThought[] = [
  {
    topic: "Filosofia Culinária",
    quote:
      "Cozinhar é traduzir um lugar e um momento em um prato. Cada ingrediente carrega uma origem — meu trabalho é não atrapalhar essa história.",
  },
  {
    topic: "Técnica Favorita",
    quote:
      "A cocção lenta. Braseados de 12 horas, fundos que reduzem por um dia inteiro — é o tempo que transforma o simples em memorável.",
  },
  {
    topic: "Inspiração",
    quote:
      "Viajo para comer em mercados, não em restaurantes estrelados. É lá que encontro a verdade de um ingrediente.",
  },
]

export const CHEF_NAME = "Chef Lúcio Andrade"
export const CHEF_ROLE = "Chef Executivo & Sócio-fundador"

// ---------- Prato em Movimento ----------
export interface SignatureStage {
  step: string
  title: string
  description: string
}

export const SIGNATURE_DISH = {
  name: "Robalo em Crosta de Ervas, Beurre Blanc de Trufas",
  stages: [
    {
      step: "01",
      title: "Ingredientes surgindo",
      description: "Robalo fresco do dia, manteiga clarificada, trufas negras e ervas colhidas na hora da horta própria.",
    },
    {
      step: "02",
      title: "Processo de preparo",
      description: "Selagem em fogo alto para a crosta dourada, finalização lenta no forno e montagem do beurre blanc emulsionado.",
    },
    {
      step: "03",
      title: "Resultado final",
      description: "Camadas de aroma e textura: pele crocante, carne suculenta e um molho aveludado com lascas de trufa fresca.",
    },
  ] as SignatureStage[],
}

// ---------- Harmonizações Exclusivas ----------
export interface Pairing {
  dish: string
  wine: string
  drink: string
  dessert: string
}

export const PAIRINGS: Pairing[] = [
  {
    dish: "Filé Mignon Maturado",
    wine: "Malbec Reserva, Mendoza",
    drink: "Old Fashioned de Cacau",
    dessert: "Tarte Tatin com Sorvete de Canela",
  },
  {
    dish: "Risoto de Frutos do Mar",
    wine: "Chardonnay Barrel-Aged",
    drink: "Gin Tônica de Capim-Limão",
    dessert: "Cheesecake de Maracujá",
  },
  {
    dish: "Robalo em Crosta de Ervas",
    wine: "Sauvignon Blanc, Vale dos Vinhedos",
    drink: "Spritz de Manjericão",
    dessert: "Mousse de Chocolate 70%",
  },
  {
    dish: "Costela Braseada 12h",
    wine: "Cabernet Sauvignon, Vale Central",
    drink: "Negroni Envelhecido em Barril",
    dessert: "Petit Gateau com Doce de Leite",
  },
]

// ---------- Cardápio Digital ----------
export type DishCategory =
  | "Entradas"
  | "Pratos Principais"
  | "Massas"
  | "Carnes"
  | "Frutos do Mar"
  | "Sobremesas"
  | "Drinks"
  | "Vinhos"

export const DISH_CATEGORIES: DishCategory[] = [
  "Entradas",
  "Pratos Principais",
  "Massas",
  "Carnes",
  "Frutos do Mar",
  "Sobremesas",
  "Drinks",
  "Vinhos",
]

export type DishTag = "vegetariano" | "vegano" | "sem-gluten" | "mais-pedido" | "chef-recomenda"

export const DISH_FILTERS: { value: DishTag; label: string }[] = [
  { value: "vegetariano", label: "Vegetariano" },
  { value: "vegano", label: "Vegano" },
  { value: "sem-gluten", label: "Sem glúten" },
  { value: "mais-pedido", label: "Mais pedidos" },
  { value: "chef-recomenda", label: "Chef recomenda" },
]

export interface Dish {
  id: string
  name: string
  category: DishCategory
  description: string
  ingredients: string[]
  price: number
  tags: DishTag[]
}

export const DISHES: Dish[] = [
  {
    id: "burrata-trufada",
    name: "Burrata Trufada",
    category: "Entradas",
    description: "Burrata cremosa, mel de trufas, tomates confitados e torradas de fermentação natural.",
    ingredients: ["Burrata", "Mel de trufas", "Tomate confit", "Pão fermentação natural"],
    price: 68,
    tags: ["vegetariano", "chef-recomenda"],
  },
  {
    id: "carpaccio-carne-maturada",
    name: "Carpaccio de Carne Maturada",
    category: "Entradas",
    description: "Finas lâminas de carne maturada 21 dias, alcaparras, parmesão e azeite de manjericão.",
    ingredients: ["Carne maturada", "Alcaparras", "Parmesão", "Azeite de manjericão"],
    price: 72,
    tags: ["sem-gluten", "mais-pedido"],
  },
  {
    id: "salada-folhas-flores",
    name: "Salada de Folhas e Flores",
    category: "Entradas",
    description: "Mix de folhas da horta própria, flores comestíveis, nozes caramelizadas e vinagrete de mostarda.",
    ingredients: ["Folhas da horta", "Flores comestíveis", "Nozes", "Vinagrete de mostarda"],
    price: 54,
    tags: ["vegano", "sem-gluten"],
  },
  {
    id: "robalo-crosta-ervas",
    name: "Robalo em Crosta de Ervas",
    category: "Pratos Principais",
    description: "Robalo fresco, crosta de ervas da horta, beurre blanc de trufas e legumes da estação.",
    ingredients: ["Robalo", "Ervas frescas", "Beurre blanc", "Trufas negras"],
    price: 138,
    tags: ["sem-gluten", "chef-recomenda"],
  },
  {
    id: "file-mignon-maturado",
    name: "Filé Mignon Maturado",
    category: "Carnes",
    description: "Filé Black Angus maturado 28 dias, purê de mandioquinha trufado e jus de vinho tinto.",
    ingredients: ["Filé Black Angus", "Mandioquinha", "Trufas negras", "Jus de vinho tinto"],
    price: 168,
    tags: ["sem-gluten", "mais-pedido", "chef-recomenda"],
  },
  {
    id: "costela-braseada",
    name: "Costela Braseada 12h",
    category: "Carnes",
    description: "Costela braseada por 12 horas, redução do próprio fundo e farofa de castanhas.",
    ingredients: ["Costela bovina", "Fundo de carne", "Castanhas", "Ervas"],
    price: 142,
    tags: ["sem-gluten"],
  },
  {
    id: "risoto-trufas",
    name: "Risoto de Trufas Negras",
    category: "Massas",
    description: "Arbóreo no ponto, parmesão envelhecido 24 meses e lascas generosas de trufa negra.",
    ingredients: ["Arroz arbóreo", "Parmesão", "Trufas negras", "Manteiga"],
    price: 124,
    tags: ["vegetariano", "chef-recomenda"],
  },
  {
    id: "talharim-funghi",
    name: "Talharim ao Funghi Porcini",
    category: "Massas",
    description: "Massa artesanal, funghi porcini reidratado em vinho branco e manteiga de sálvia.",
    ingredients: ["Massa artesanal", "Funghi porcini", "Vinho branco", "Manteiga de sálvia"],
    price: 98,
    tags: ["vegetariano", "mais-pedido"],
  },
  {
    id: "camaroes-manteiga-alho-negro",
    name: "Camarões na Manteiga de Alho Negro",
    category: "Frutos do Mar",
    description: "Camarões frescos, manteiga de alho negro fermentado e farofa de pão crocante.",
    ingredients: ["Camarões", "Alho negro", "Manteiga", "Farofa de pão"],
    price: 132,
    tags: ["mais-pedido"],
  },
  {
    id: "risoto-frutos-do-mar",
    name: "Risoto de Frutos do Mar",
    category: "Frutos do Mar",
    description: "Risoto cremoso com lagosta, camarões e mexilhões da costa catarinense.",
    ingredients: ["Lagosta", "Camarões", "Mexilhões", "Arroz arbóreo"],
    price: 156,
    tags: ["sem-gluten", "chef-recomenda"],
  },
  {
    id: "tarte-tatin",
    name: "Tarte Tatin com Sorvete de Canela",
    category: "Sobremesas",
    description: "Maçãs caramelizadas, massa folhada amanteigada e sorvete artesanal de canela.",
    ingredients: ["Maçã", "Massa folhada", "Sorvete de canela"],
    price: 48,
    tags: ["vegetariano", "mais-pedido"],
  },
  {
    id: "mousse-chocolate",
    name: "Mousse de Chocolate 70%",
    category: "Sobremesas",
    description: "Mousse aerada de chocolate belga 70%, crumble de cacau e flor de sal.",
    ingredients: ["Chocolate 70%", "Crumble de cacau", "Flor de sal"],
    price: 44,
    tags: ["vegetariano", "sem-gluten"],
  },
  {
    id: "cheesecake-maracuja",
    name: "Cheesecake de Maracujá",
    category: "Sobremesas",
    description: "Base crocante, creme aveludado e calda fresca de maracujá da estação.",
    ingredients: ["Cream cheese", "Maracujá", "Base de biscoito"],
    price: 46,
    tags: ["vegetariano", "chef-recomenda"],
  },
  {
    id: "old-fashioned-cacau",
    name: "Old Fashioned de Cacau",
    category: "Drinks",
    description: "Bourbon, bitter de cacau, xarope de açúcar mascavo e casca de laranja flambada.",
    ingredients: ["Bourbon", "Bitter de cacau", "Açúcar mascavo", "Laranja"],
    price: 52,
    tags: ["sem-gluten", "mais-pedido"],
  },
  {
    id: "gin-tonica-capim-limao",
    name: "Gin Tônica de Capim-Limão",
    category: "Drinks",
    description: "Gin artesanal, água tônica premium e infusão de capim-limão da horta.",
    ingredients: ["Gin artesanal", "Água tônica", "Capim-limão"],
    price: 46,
    tags: ["vegano", "sem-gluten"],
  },
  {
    id: "negroni-barril",
    name: "Negroni Envelhecido em Barril",
    category: "Drinks",
    description: "Negroni clássico envelhecido 30 dias em barril de carvalho, aroma amadeirado intenso.",
    ingredients: ["Gin", "Campari", "Vermute rosso"],
    price: 58,
    tags: ["chef-recomenda"],
  },
  {
    id: "malbec-reserva",
    name: "Malbec Reserva — Mendoza",
    category: "Vinhos",
    description: "Tinto intenso de Mendoza, taninos macios e notas de frutas vermelhas maduras.",
    ingredients: ["Uva Malbec"],
    price: 96,
    tags: ["vegano", "sem-gluten", "chef-recomenda"],
  },
  {
    id: "chardonnay-barril",
    name: "Chardonnay Barrel-Aged",
    category: "Vinhos",
    description: "Branco envelhecido em barril, untuoso, com notas de manteiga e baunilha.",
    ingredients: ["Uva Chardonnay"],
    price: 88,
    tags: ["vegano", "sem-gluten"],
  },
  {
    id: "sauvignon-blanc",
    name: "Sauvignon Blanc — Vale dos Vinhedos",
    category: "Vinhos",
    description: "Branco fresco e cítrico, acidez vibrante, ideal para frutos do mar.",
    ingredients: ["Uva Sauvignon Blanc"],
    price: 82,
    tags: ["vegano", "sem-gluten", "mais-pedido"],
  },
]

// ---------- Eventos Gastronômicos ----------
export interface RestaurantEvent {
  id: string
  title: string
  date: string
  description: string
  price: number
  seatsLeft: number
}

export const EVENTS: RestaurantEvent[] = [
  {
    id: "noite-italiana",
    title: "Noite Italiana",
    date: "12 de julho · 19h30",
    description: "Menu especial de massas artesanais e vinhos da Toscana, com música ao vivo.",
    price: 280,
    seatsLeft: 14,
  },
  {
    id: "festival-vinhos",
    title: "Festival de Vinhos",
    date: "26 de julho · 19h",
    description: "Degustação guiada por sommelier com oito rótulos selecionados e petiscos autorais.",
    price: 320,
    seatsLeft: 8,
  },
  {
    id: "menu-degustacao",
    title: "Menu Degustação",
    date: "Toda sexta e sábado · 19h–23h",
    description: "Sete tempos assinados pelo chef, com harmonização opcional de vinhos.",
    price: 420,
    seatsLeft: 20,
  },
  {
    id: "chef-convidado",
    title: "Chef Convidado",
    date: "9 de agosto · 20h",
    description: "Jantar colaborativo com chef convidado internacional — edição única e limitada.",
    price: 480,
    seatsLeft: 6,
  },
]

// ---------- Menus Degustação, Workshops e Jantares Exclusivos (Experiências) ----------
export interface TastingMenu {
  name: string
  courses: number
  price: number
  description: string
}

export const TASTING_MENUS: TastingMenu[] = [
  {
    name: "Menu Essência",
    courses: 5,
    price: 320,
    description: "Um percurso de cinco tempos pelos clássicos da casa, com entrada, principal e sobremesa assinados.",
  },
  {
    name: "Menu Origem",
    courses: 7,
    price: 420,
    description: "Sete tempos guiados pelas estações do ano, com ingredientes rastreados de produtores parceiros.",
  },
  {
    name: "Menu Autoral Completo",
    courses: 9,
    price: 580,
    description: "A experiência máxima: nove tempos com harmonização de vinhos e visita à cozinha com o chef.",
  },
]

export interface Workshop {
  name: string
  description: string
  duration: string
}

export const WORKSHOPS: Workshop[] = [
  {
    name: "Workshop de Massas Artesanais",
    description: "Aprenda a fazer talharim e ravioli do zero, com a equipe de cozinha.",
    duration: "3h · aos sábados",
  },
  {
    name: "Workshop de Harmonização",
    description: "Sessão guiada por sommelier sobre como combinar vinhos, drinks e pratos.",
    duration: "2h · uma vez por mês",
  },
]

// ---------- Mural de Experiências (depoimentos) ----------
export interface Testimonial {
  name: string
  initials: string
  quote: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marina Costa",
    initials: "MC",
    quote: "Uma noite que vou lembrar por anos. Cada prato contava uma história — e o atendimento foi impecável.",
    rating: 5,
  },
  {
    name: "Eduardo Lima",
    initials: "EL",
    quote: "O menu degustação superou qualquer expectativa. A harmonização de vinhos foi perfeita.",
    rating: 5,
  },
  {
    name: "Beatriz Nogueira",
    initials: "BN",
    quote: "Comemoramos nosso aniversário de casamento aqui e a equipe tornou tudo ainda mais especial.",
    rating: 5,
  },
  {
    name: "Rafael Tomé",
    initials: "RT",
    quote: "A Mesa do Chef foi a experiência mais marcante que já tive em um restaurante em São Paulo.",
    rating: 5,
  },
  {
    name: "Camila Duarte",
    initials: "CD",
    quote: "Ambiente sofisticado sem ser pretensioso. O robalo em crosta de ervas é simplesmente perfeito.",
    rating: 4,
  },
]

// ---------- Reserva Inteligente ----------
export const PARTY_SIZE_OPTIONS = [
  { value: "1-2", label: "1–2 pessoas" },
  { value: "3-4", label: "3–4 pessoas" },
  { value: "5-6", label: "5–6 pessoas" },
  { value: "7+", label: "7 ou mais" },
] as const

export const TIME_SLOT_OPTIONS = [
  { value: "19:00", label: "19h00" },
  { value: "19:30", label: "19h30" },
  { value: "20:00", label: "20h00" },
  { value: "20:30", label: "20h30" },
  { value: "21:00", label: "21h00" },
  { value: "21:30", label: "21h30" },
] as const

export type OccasionIcon = "heart" | "briefcase" | "cake" | "users"

export const OCCASION_OPTIONS: { value: string; label: string; icon: OccasionIcon }[] = [
  { value: "romantico", label: "Jantar romântico", icon: "heart" },
  { value: "negocios", label: "Negócios", icon: "briefcase" },
  { value: "aniversario", label: "Aniversário", icon: "cake" },
  { value: "familia", label: "Família", icon: "users" },
]

export const SEATING_OPTIONS = [
  { value: "interna", label: "Área interna" },
  { value: "externa", label: "Área externa" },
  { value: "janela", label: "Mesa próxima à janela" },
  { value: "celebracao", label: "Celebração especial" },
] as const
