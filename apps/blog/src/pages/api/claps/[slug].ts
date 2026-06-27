import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ClapsApiError, getClaps, incrementClaps } from '@/lib/claps';

// Única rota não-estática do blog. Mantém todo o resto do site 100% pré-renderizado.
// Ver docs/specs/2026-06-25-claps.md.
export const prerender = false;

const UID_COOKIE = 'nico_uid';
const UID_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

async function slugExists(slug: string): Promise<boolean> {
  // Posts arquivados continuam acessíveis por link direto e participam normalmente
  // do clap (decisão: arquivado não é modo só-leitura) — por isso sem filtro de status aqui.
  const posts = await getCollection('posts');
  return posts.some((post) => post.data.slug === slug);
}

export const GET: APIRoute = async ({ params, cookies }) => {
  const slug = params.slug;
  if (!slug || !(await slugExists(slug))) {
    return new Response(null, { status: 404 });
  }

  const uid = cookies.get(UID_COOKIE)?.value;

  try {
    const data = await getClaps(slug, uid);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[claps] GET falhou', error);
    const status = error instanceof ClapsApiError && error.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: 'claps_api_unavailable' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ params, cookies, request }) => {
  const slug = params.slug;
  if (!slug || !(await slugExists(slug))) {
    return new Response(null, { status: 404 });
  }

  let body: { amount?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const amount = Math.max(1, Math.min(5, Math.trunc(Number(body.amount) || 1)));

  let uid = cookies.get(UID_COOKIE)?.value;
  if (!uid) {
    uid = crypto.randomUUID();
    cookies.set(UID_COOKIE, uid, {
      path: '/',
      maxAge: UID_MAX_AGE,
      sameSite: 'lax',
    });
  }

  // Rate limit por IP não é mais responsabilidade desta rota — apps/api já aplica
  // (RateLimitGuard, Redis). Um 429 de lá é propagado tal qual ao client; outros
  // erros (rede, 5xx de apps/api) viram 502, deixando claro que a falha é externa.
  try {
    const data = await incrementClaps(slug, uid, amount);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[claps] POST falhou', error);
    const status = error instanceof ClapsApiError && error.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: 'claps_api_unavailable' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
