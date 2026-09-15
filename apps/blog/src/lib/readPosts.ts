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

function writeStorage(slugs: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage indisponível (modo privado/quota cheia) — falha silenciosa.
  }
}

function setPostRead(slug: string, read: boolean): void {
  const current = readStorage();
  const already = current.includes(slug);
  if (read === already) return;

  writeStorage(read ? [...current, slug] : current.filter((s) => s !== slug));

  // localStorage não re-renderiza ilhas React já montadas na mesma aba (o
  // evento nativo "storage" só dispara em OUTRAS abas) — sem isso, a flag
  // "Lido" só atualizaria depois de um reload da página atual.
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { slug, read } }));
}

export function markPostAsRead(slug: string): void {
  setPostRead(slug, true);
}

/** Alterna lido/não-lido e devolve o novo estado — usado pelo botão manual. */
export function toggleReadPost(slug: string): boolean {
  const next = !isPostRead(slug);
  setPostRead(slug, next);
  return next;
}

/** Notifica quando o estado de "lido" de um post muda nesta aba (ver comentário acima). */
export function onReadPostsChanged(callback: (slug: string, read: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ slug: string; read: boolean }>).detail;
    if (detail?.slug) callback(detail.slug, detail.read);
  };

  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
