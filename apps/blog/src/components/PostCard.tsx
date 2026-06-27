import { HandMetal } from 'lucide-react';
import { CATEGORY_LABELS, type PostCardProps } from '@/types/post';

interface PostCardWithClapsProps extends PostCardProps {
  // Opcional e separado de PostCardProps de propósito: PostCardProps é o shape
  // estático calculado no frontmatter do index.astro; o total de claps é
  // buscado depois, no client (ver BlogHome), e chega undefined até lá.
  clapsTotal?: number;
}

export function PostCard({
  title,
  description,
  category,
  date,
  slug,
  readingTimeMinutes,
  clapsTotal,
}: PostCardWithClapsProps) {
  const formatted = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <a
      href={`/posts/${slug}`}
      className="block bg-bg-card border border-border rounded-card p-5 hover:border-text-highlight/30 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-highlight uppercase tracking-wide">
          {CATEGORY_LABELS[category] ?? category}
        </span>
        <div className="flex items-center gap-3">
          {typeof clapsTotal === 'number' && (
            <span
              className="inline-flex items-center gap-1 text-xs text-text-body cursor-pointer"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              <HandMetal size={12} aria-hidden="true" />
              {clapsTotal}
            </span>
          )}
          <span className="text-xs text-text-body">{readingTimeMinutes} min</span>
        </div>
      </div>

      <h2 className="font-heading text-text-heading text-lg font-semibold mb-2 leading-snug group-hover:text-text-highlight transition-colors">
        {title}
      </h2>

      <p className="text-text-body text-sm leading-relaxed mb-4">
        {description}
      </p>

      <time className="text-xs text-text-body">{formatted}</time>
    </a>
  );
}
