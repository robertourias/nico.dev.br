import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';

interface Category {
  name: string;
  label: string;
  count: number;
}

interface FeaturedPost {
  title: string;
  slug: string;
}

interface PostSidebarProps {
  categories: Category[];
  featuredPosts: FeaturedPost[];
}

export function PostSidebar({ categories, featuredPosts }: PostSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

  // Na página do post, selecionar categoria navega para a home
  function handleCategorySelect(category: string | null) {
    setIsOpen(false);
    window.location.href = category ? `/?categoria=${category}` : '/';
  }

  return (
    <CategorySidebar
      categories={categories}
      featuredPosts={featuredPosts}
      selectedCategory={null}
      onCategorySelect={handleCategorySelect}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      drawerOnly
    />
  );
}
