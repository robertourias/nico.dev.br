import { useEffect, useState } from 'react';
import { HandMetal } from 'lucide-react';
import { CATEGORY_LABELS, type PostCardProps } from '@/types/post';
import { ShareButton } from '@/components/ShareButton';
import { ReadFlag } from '@/components/ReadFlag';
import { isPostRead, onReadPostsChanged } from '@/lib/readPosts';

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

  const postUrl = `/posts/${slug}`;

  const [read, setRead] = useState(false);
  useEffect(() => {
    setRead(isPostRead(slug));
    return onReadPostsChanged((changedSlug) => {
      if (changedSlug === slug) setRead(true);
    });
  }, [slug]);

  return (
    <article
      className={`relative bg-bg-card rounded-card p-5 border transition-colors group ${
        read ? 'border-text-highlight/30' : 'border-border hover:border-text-highlight/30'
      }`}
    >
      <a href={postUrl} className="block">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-text-highlight uppercase tracking-wide">
            {CATEGORY_LABELS[category] ?? category}
          </span>
          <div className="flex items-center gap-3">
            {typeof clapsTotal === 'number' && (
              <span
                className="inline-flex items-center gap-1 text-xs text-text-body"
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

        <p className="text-text-body text-sm leading-relaxed mb-4">{description}</p>
      </a>

      <div className="flex items-center justify-between gap-3">
        <time className="text-xs text-text-body" dateTime={date.toISOString()}>
          {formatted}
        </time>
        <div className="flex items-center gap-2">
          <ReadFlag slug={slug} compact />
          <ShareButton compact title={title} text={description} url={postUrl} />
        </div>
      </div>
    </article>
  );
}
