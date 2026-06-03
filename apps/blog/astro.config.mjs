import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://blog.nico.dev.br',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __PORTFOLIO_URL__: JSON.stringify(process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://nico.dev.br'),
      __PORTFOLIO_LABEL__: JSON.stringify(process.env.NEXT_PUBLIC_PORTFOLIO_LABEL ?? 'Portfólio'),
      __TOOLS_URL__: JSON.stringify(process.env.NEXT_PUBLIC_TOOLS_URL ?? 'https://tools.nico.dev.br'),
      __TOOLS_LABEL__: JSON.stringify(process.env.NEXT_PUBLIC_TOOLS_LABEL ?? 'Tools'),
      __BLOG_URL__: JSON.stringify(process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.nico.dev.br'),
      __BLOG_LABEL__: JSON.stringify(process.env.NEXT_PUBLIC_BLOG_LABEL ?? 'Blog'),
      __CHALLENGES_URL__: JSON.stringify(process.env.NEXT_PUBLIC_CHALLENGES_URL ?? 'https://challenges.nico.dev.br'),
      __CHALLENGES_LABEL__: JSON.stringify(process.env.NEXT_PUBLIC_CHALLENGES_LABEL ?? 'Challenges'),
    },
  },
});
