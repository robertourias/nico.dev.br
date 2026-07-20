import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['tech', 'ia', 'organizacao', 'qualidade-de-vida', 'livros']),
    status: z.enum(['published', 'archived']),
    featured: z.boolean().default(false),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    template: z.enum(['default', 'immersive']).default('default'),
    heroImage: z.string().optional(),
  }),
});

export const collections = { posts };
