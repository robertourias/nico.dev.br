export const SITE = {
  name: 'Blog Nico',
  description: 'Posts sobre tech, IA, organização e qualidade de vida.',
  url: 'https://blog.nico.dev.br',
};

export const SOCIAL = {
  github: 'https://github.com/robertourias',
  linkedin: 'https://linkedin.com/in/robertourias'
};

declare const __PORTFOLIO_URL__: string;
declare const __PORTFOLIO_LABEL__: string;
declare const __TOOLS_URL__: string;
declare const __TOOLS_LABEL__: string;
declare const __CHALLENGES_URL__: string;
declare const __CHALLENGES_LABEL__: string;

export const SITES = {
  portfolio: { url: __PORTFOLIO_URL__, label: __PORTFOLIO_LABEL__ },
  tools: { url: __TOOLS_URL__, label: __TOOLS_LABEL__ },
  challenges: { url: __CHALLENGES_URL__, label: __CHALLENGES_LABEL__ },
};
