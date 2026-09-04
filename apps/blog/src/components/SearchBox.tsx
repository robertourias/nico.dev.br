import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchPost {
  title: string;
  slug: string;
}

const MIN_QUERY_LENGTH = 3;
const MAX_RESULTS = 8;

const DIACRITICS_REGEX = /[̀-ͯ]/g;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase();
}

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<SearchPost[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  function openSearch() {
    setOpen(true);
    if (posts === null) {
      fetch('/search.json')
        .then((res) => (res.ok ? (res.json() as Promise<SearchPost[]>) : []))
        .then(setPosts)
        .catch(() => setPosts([]));
    }
  }

  function closeSearch() {
    setOpen(false);
    setQuery('');
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) closeSearch();
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const trimmed = query.trim();
  const showResults = open && trimmed.length >= MIN_QUERY_LENGTH;
  const results = showResults
    ? (posts ?? []).filter((p) => normalize(p.title).includes(normalize(trimmed))).slice(0, MAX_RESULTS)
    : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= 0) itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }
    if (!showResults || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const post = results[activeIndex];
      if (post) window.location.href = `/posts/${post.slug}`;
    }
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'w-40 sm:w-56 mr-1' : 'w-0'}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar posts..."
          aria-label="Buscar posts"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="search-results-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          className="w-full h-9 px-3 rounded-lg text-sm bg-accent/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        onClick={() => (open ? closeSearch() : openSearch())}
        aria-label={open ? 'Fechar busca' : 'Buscar posts'}
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 cursor-pointer"
      >
        {open ? <X size={18} /> : <Search size={18} />}
      </button>

      {showResults && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute right-0 top-11 w-72 max-h-80 overflow-y-auto rounded-lg border border-border bg-background shadow-lg z-50"
        >
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((post, index) => (
                <li key={post.slug}>
                  <a
                    id={`search-result-${index}`}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    href={`/posts/${post.slug}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`block px-3 py-2 text-sm transition-colors leading-snug ${
                      index === activeIndex ? 'bg-accent text-foreground' : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">Nenhum resultado.</p>
          )}
        </div>
      )}
    </div>
  );
}
