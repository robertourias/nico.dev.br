import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ClapsApiError, getClapsTotals } from '@/lib/claps';

// Não-estática, igual a [slug].ts — usada pela listagem (BlogHome) pra buscar
// o total de claps de todos os posts visíveis numa chamada só. Ver
// apps/blog/CLAUDE.md: o resto do blog é 100% pré-renderizado.
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const raw = url.searchParams.get('slugs');
  if (!raw) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Só repassa pra api slugs que de fato existem como posts — evita usar esta
  // rota pra sondar/floodar a api com slugs arbitrários (posts arquivados
  // continuam valendo, igual a [slug].ts, por isso sem filtro de status).
  const requested = [...new Set(raw.split(',').map((slug) => slug.trim()).filter(Boolean))];
  const posts = await getCollection('posts');
  const validSlugs = new Set(posts.map((post) => post.data.slug));
  const slugs = requested.filter((slug) => validSlugs.has(slug));

  if (slugs.length === 0) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const totals = await getClapsTotals(slugs);
    return new Response(JSON.stringify(totals), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const status = error instanceof ClapsApiError && error.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: 'claps_api_unavailable' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
