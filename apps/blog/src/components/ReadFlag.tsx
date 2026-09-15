import { useEffect, useState } from 'react';
import { Check, BookOpenCheck } from 'lucide-react';
import { isPostRead, onReadPostsChanged, toggleReadPost } from '@/lib/readPosts';

interface ReadFlagProps {
  slug: string;
  /** Ícone só, sem texto, não-clicável — usado nos cards da listagem. */
  compact?: boolean;
}

const badgeStyle = {
  borderColor: 'var(--color-border)',
  color: 'var(--color-text-highlight)',
  backgroundColor: 'var(--color-bg-card)',
};

/**
 * No card (compact): badge "Lido", só aparece depois de marcado (via scroll
 * na página do post). Não é clicável — a lista não deve permitir marcar como
 * lido sem abrir o post.
 *
 * Na página do post (!compact): botão de toggle manual. O post também é
 * marcado automaticamente ao rolar até o fim (ver [slug].astro) — o botão
 * é um segundo caminho para quem já leu antes, ou quer desmarcar.
 */
export function ReadFlag({ slug, compact = false }: ReadFlagProps) {
  const [read, setRead] = useState(false);

  useEffect(() => {
    setRead(isPostRead(slug));
    return onReadPostsChanged((changedSlug, changedRead) => {
      if (changedSlug === slug) setRead(changedRead);
    });
  }, [slug]);

  if (compact) {
    if (!read) return null;
    return (
      <span
        title="Lido"
        aria-label="Post já lido"
        className="inline-flex items-center justify-center rounded-full border p-1.5"
        style={badgeStyle}
      >
        <Check size={12} aria-hidden="true" />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRead(toggleReadPost(slug))}
      aria-pressed={read}
      title={read ? 'Marcado como lido — clique para desmarcar' : 'Marcar como lido'}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors"
      style={
        read
          ? badgeStyle
          : { borderColor: 'var(--color-border)', color: 'var(--color-text-body)' }
      }
    >
      {read ? <Check size={14} aria-hidden="true" /> : <BookOpenCheck size={14} aria-hidden="true" />}
      {read ? 'Lido' : 'Marcar como lido'}
    </button>
  );
}
