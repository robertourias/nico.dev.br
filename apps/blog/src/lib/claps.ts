// Cliente HTTP fino para apps/api — o blog não tem nenhum cliente de banco/Redis
// próprio. A lógica de cap (50/usuário) e upsert atômico roda dentro de apps/api;
// aqui é só fetch + tratamento de erro.
// Ver docs/specs/2026-06-25-api-claps-backend.md (raiz) e
// docs/context/decisions.md (exceção "sem banco de dados").

const API_URL = import.meta.env.CLAPS_API_URL;
const API_SECRET = import.meta.env.CLAPS_API_SECRET;

export interface ClapsData {
  total: number;
  userClaps: number;
}

// Carrega o status HTTP da api para quem chama poder reagir (ex.: propagar 429
// como 429 em vez de virar 500 genérico) sem reimplementar parsing de Response.
export class ClapsApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ClapsApiError';
  }
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { 'X-Internal-Secret': API_SECRET, ...extra };
}

export async function getClaps(slug: string, uid: string | undefined): Promise<ClapsData> {
  const url = new URL(`${API_URL}/claps/${slug}`);
  if (uid) url.searchParams.set('uid', uid);

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (GET ${slug})`);
  return res.json() as Promise<ClapsData>;
}

// Usado pela listagem de posts: um fetch só com todos os slugs visíveis, em vez
// de um getClaps por card (evitaria gastar boa parte do rate limit da api só
// carregando a home).
export async function getClapsTotals(slugs: string[]): Promise<Record<string, number>> {
  const url = new URL(`${API_URL}/claps`);
  url.searchParams.set('slugs', slugs.join(','));

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (GET totals)`);
  return res.json() as Promise<Record<string, number>>;
}

export async function incrementClaps(slug: string, uid: string, amount: number): Promise<ClapsData> {
  const res = await fetch(`${API_URL}/claps/${slug}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ uid, amount }),
  });
  if (!res.ok) throw new ClapsApiError(res.status, `claps api ${res.status} (POST ${slug})`);
  return res.json() as Promise<ClapsData>;
}
