import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { SITES } from '@/config';

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
  totalCount: number;
}

export function PostSidebar({ categories, featuredPosts, totalCount }: PostSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handler);
    return () => window.removeEventListener('toggle-sidebar', handler);
  }, []);

  // Na página do post, seleção navega para a home com filtro aplicado
  function handleCategorySelect(category: string | null) {
    setIsOpen(false);
    window.location.href = category ? `/?categoria=${category}` : '/';
  }

  const navLinks = [
    { href: SITES.portfolio.url, label: SITES.portfolio.label },
    { href: SITES.tools.url, label: SITES.tools.label },
  ];

  return (
    <CategorySidebar
      categories={categories}
      featuredPosts={featuredPosts}
      totalCount={totalCount}
      selectedCategory={null}
      onCategorySelect={handleCategorySelect}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      drawerOnly
      navLinks={navLinks}
    />
  );
}
