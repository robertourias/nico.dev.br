import { useState, useEffect, useRef, useCallback } from 'react';
import { PostCard } from '@/components/PostCard';
import type { PostCardProps } from '@/types/post';

const BATCH_SIZE = 10;

interface PostListProps {
  posts: PostCardProps[];
  selectedCategory: string | null;
}

export function PostList({ posts, selectedCategory }: PostListProps) {
  const filtered = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = filtered.slice(0, visibleCount);

  if (filtered.length === 0) {
    return (
      <p className="text-text-body text-sm py-12 text-center">
        Nenhum post nesta categoria ainda.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {visible.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
      {visibleCount < filtered.length && (
        <div ref={sentinelRef} className="h-4" aria-hidden="true" />
      )}
    </div>
  );
}
