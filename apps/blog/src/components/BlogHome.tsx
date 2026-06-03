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

  useEffect(() => {
    const handler = () => setIsSidebarOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

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
        <PostList posts={posts} selectedCategory={selectedCategory} selectedTag={selectedTag} />
      </main>
    </div>
  );
}
