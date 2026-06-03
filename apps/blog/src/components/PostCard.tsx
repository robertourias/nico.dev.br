import { CATEGORY_LABELS, type PostCardProps } from '@/types/post';

export function PostCard({ title, description, category, date, slug, readingTimeMinutes }: PostCardProps) {
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
        <span className="text-xs text-text-body">{readingTimeMinutes} min</span>
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
