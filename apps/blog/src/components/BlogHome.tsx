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

interface BlogHomeProps {
  posts: PostCardProps[];
  categories: Category[];
  featuredPosts: FeaturedPost[];
}

export function BlogHome({ posts, categories, featuredPosts }: BlogHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsSidebarOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

  function handleCategorySelect(category: string | null) {
    setSelectedCategory(category);
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      <CategorySidebar
        categories={categories}
        featuredPosts={featuredPosts}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0 px-4 py-6 lg:px-8">
        <PostList posts={posts} selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
