import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { isPostRead, onReadPostsChanged } from '@/lib/readPosts';

interface ReadFlagProps {
  slug: string;
  /** Ícone só, sem texto — usado nos cards da listagem. */
  compact?: boolean;
}

/** Badge "Lido" — só renderiza depois do check client-side em localStorage. */
export function ReadFlag({ slug, compact = false }: ReadFlagProps) {
  const [read, setRead] = useState(false);

  useEffect(() => {
    setRead(isPostRead(slug));
    return onReadPostsChanged((changedSlug) => {
      if (changedSlug === slug) setRead(true);
    });
  }, [slug]);

  if (!read) return null;

  const style = {
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-highlight)',
    backgroundColor: 'var(--color-bg-card)',
  };

  if (compact) {
    return (
      <span
        title="Lido"
        aria-label="Post já lido"
        className="inline-flex items-center justify-center rounded-full border p-1.5"
        style={style}
      >
        <Check size={12} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      title="Lido"
      aria-label="Post já lido"
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm"
      style={style}
    >
      <Check size={14} aria-hidden="true" />
      Lido
    </span>
  );
}
