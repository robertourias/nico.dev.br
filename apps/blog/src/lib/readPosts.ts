// Controle client-side simples de posts lidos — sem cookie/backend, só
// localStorage. Guard de `typeof window` porque este módulo é importado
// tanto por ilhas React (SSR-safe) quanto por <script> em páginas Astro.

const STORAGE_KEY = 'nico_read_posts';
const CHANGE_EVENT = 'nico:read-posts-changed';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isPostRead(slug: string): boolean {
  return readStorage().includes(slug);
}

export function markPostAsRead(slug: string): void {
  const current = readStorage();
  if (current.includes(slug)) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, slug]));
  } catch {
    // localStorage indisponível (modo privado/quota cheia) — falha silenciosa.
  }

  // localStorage não re-renderiza ilhas React já montadas na mesma aba (o
  // evento nativo "storage" só dispara em OUTRAS abas) — sem isso, a flag
  // "Lido" só apareceria depois de um reload da página atual.
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { slug } }));
}

/** Notifica quando um post é marcado como lido nesta aba (ver comentário acima). */
export function onReadPostsChanged(callback: (slug: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const slug = (event as CustomEvent<{ slug: string }>).detail?.slug;
    if (slug) callback(slug);
  };

  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
