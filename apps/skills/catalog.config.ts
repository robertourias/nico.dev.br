// Fonte única de categorias, agentes, URLs e templates de comando do catálogo.
// TypeScript puro: sem imports de next/react/src, para que scripts/build-registry.ts
// (TASK02) possa carregá-lo fora do Next via tsx.

export const siteConfig = {
  name: 'Nico Skills',
  tagline: 'Catálogo curado das minhas skills de agentes, instalável com um comando.',
  // Sobrescrevível por env para previews/staging; o fallback é o domínio de produção.
  url: process.env.NEXT_PUBLIC_SKILLS_URL || 'https://skills.nico.dev.br',
} as const;

const OWNER = 'robertourias';
const REPO = 'skills';

export const repoConfig = {
  owner: OWNER,
  repo: REPO,
  slug: `${OWNER}/${REPO}`,
  githubUrl: `https://github.com/${OWNER}/${REPO}`,
  // Isolados aqui porque a origem de skills/ ainda está em aberto (TASK03).
  skillsDir: 'skills',
  packsDir: 'packs',
} as const;

export const skillsShConfig = {
  baseUrl: 'https://www.skills.sh',
  skillUrl: (slug: string) => `https://www.skills.sh/${repoConfig.slug}/${slug}`,
} as const;

// Tuplas `as const` para servirem direto em z.enum (TASK02) sem duplicar valores.
export const CATEGORIES = ['documentation', 'design', 'writing', 'product', 'engineering'] as const;
export const AGENTS = ['claude-code', 'cursor', 'codex'] as const;
export const STATUSES = ['stable', 'beta', 'draft'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Agent = (typeof AGENTS)[number];
export type Status = (typeof STATUSES)[number];

export const installCommandTemplates = {
  repository: `npx skills add ${repoConfig.slug}`,
  skill: (slug: string) => `npx skills add ${repoConfig.slug} --skill ${slug}`,
  manual: (slug: string) =>
    `git clone ${repoConfig.githubUrl} && cp -r skills/skills/${slug} ~/.claude/skills/`,
} as const;
