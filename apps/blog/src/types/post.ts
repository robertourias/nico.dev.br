export interface PostCardProps {
  title: string;
  description: string;
  categories: string[];
  date: Date;
  slug: string;
  readingTimeMinutes: number;
  tags: string[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  tech: 'Tech',
  ia: 'IA',
  organizacao: 'Organização',
  'qualidade-de-vida': 'Qualidade de Vida',
  livros: 'Livros',
  business: 'Negócios',
  prog: 'Programação',
  infra: 'Infra',
  architecture: 'Arquitetura',
  investimentos: 'Investimentos',
};
