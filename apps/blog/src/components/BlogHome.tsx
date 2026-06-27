import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { PostList } from '@/components/PostList';
import type { PostCardProps } from '@/types/post';

interface Category {
  name: string;
  label: string;
  count: number;
}

interface FeaturedPost {
  title: string;
  slug: string;
}

interface TagEntry {
  tag: string;
  count: number;
}

interface BlogHomeProps {
  posts: PostCardProps[];
  categories: Category[];
  featuredPosts: FeaturedPost[];
  allTags: TagEntry[];
}

export function BlogHome({ posts, categories, featuredPosts, allTags }: BlogHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clapsTotals, setClapsTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const handler = () => setIsSidebarOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

  useEffect(() => {
    // Uma chamada só pra todos os posts da listagem (não por card) — evita
    // gastar o rate limit da api carregando a home. Falha silenciosa: sem
    // total carregado, o card simplesmente não mostra o ícone de claps.
    if (posts.length === 0) return;
    let cancelled = false;

    const slugs = posts.map((post) => post.slug).join(',');
    fetch(`/api/claps/totals?slugs=${encodeURIComponent(slugs)}`)
      .then((res) => (res.ok ? (res.json() as Promise<Record<string, number>>) : null))
      .then((data) => {
        if (!cancelled && data) setClapsTotals(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [posts]);

  function handleCategorySelect(category: string | null) {
    setSelectedCategory(category);
    setSelectedTag(null);
    setIsSidebarOpen(false);
  }

  function handleTagSelect(tag: string | null) {
    setSelectedTag(tag);
    setSelectedCategory(null);
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen max-w-3xl mx-auto">
      <CategorySidebar
        categories={categories}
        featuredPosts={featuredPosts}
        allTags={allTags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategorySelect={handleCategorySelect}
        onTagSelect={handleTagSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0 px-4 py-6 lg:px-8">
        <PostList
          posts={posts}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          clapsTotals={clapsTotals}
        />
      </main>
    </div>
  );
}
