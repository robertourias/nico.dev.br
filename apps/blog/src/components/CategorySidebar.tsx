import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface Category {
  name: string;
  label: string;
  count: number;
}

interface FeaturedPost {
  title: string;
  slug: string;
}

interface NavLink {
  href: string;
  label: string;
}

interface CategorySidebarProps {
  categories: Category[];
  featuredPosts: FeaturedPost[];
  totalCount: number;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  drawerOnly?: boolean;
  navLinks?: NavLink[];
}

function SidebarContent({
  categories,
  featuredPosts,
  totalCount,
  selectedCategory,
  onCategorySelect,
  navLinks,
}: Pick<
  CategorySidebarProps,
  'categories' | 'featuredPosts' | 'totalCount' | 'selectedCategory' | 'onCategorySelect' | 'navLinks'
>) {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  return (
    <nav className="flex flex-col gap-6 p-4">

      {/* Links de navegação — exibidos quando passados (ex: página do post no mobile) */}
      {navLinks && navLinks.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-heading mb-3">
            Navegação
          </p>
          <ul className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block px-3 py-2 text-sm text-text-body hover:text-text-heading transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Categorias */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-heading mb-3">
          Categorias
        </p>
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              onClick={() => onCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === null
                  ? 'text-text-highlight font-medium'
                  : 'text-text-body hover:text-text-heading'
              }`}
            >
              <span>Todos</span>
              <span className="text-xs opacity-50">{totalCount}</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() => onCategorySelect(cat.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  selectedCategory === cat.name
                    ? 'text-text-highlight font-medium'
                    : 'text-text-body hover:text-text-heading'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-xs opacity-50">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Favoritos */}
      {featuredPosts.length > 0 && (
        <div>
          <button
            onClick={() => setFavoritesOpen((v) => !v)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-text-heading">
              Favoritos
            </span>
            {favoritesOpen
              ? <ChevronUp size={12} className="text-text-body" />
              : <ChevronDown size={12} className="text-text-body" />
            }
          </button>
          {favoritesOpen && (
            <ul className="flex flex-col gap-0.5">
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/posts/${post.slug}`}
                    className="block px-3 py-2 text-sm text-text-body hover:text-text-heading transition-colors leading-snug"
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}

export function CategorySidebar({
  categories,
  featuredPosts,
  totalCount,
  selectedCategory,
  onCategorySelect,
  isOpen,
  onClose,
  drawerOnly = false,
  navLinks,
}: CategorySidebarProps) {
  const shared = { categories, featuredPosts, totalCount, selectedCategory, onCategorySelect, navLinks };

  return (
    <>
      {/* Desktop: sempre visível (omitido quando drawerOnly) */}
      <aside className={`${drawerOnly ? 'hidden' : 'hidden lg:block'} w-56 shrink-0 border-r border-border`}>
        <SidebarContent {...shared} />
      </aside>

      {/* Drawer overlay — em telas largas só quando drawerOnly (páginas de
          post não têm sidebar fixa; sem isso o drawer nunca aparece lá) */}
      {isOpen && (
        <div className={`${drawerOnly ? '' : 'lg:hidden'} fixed inset-0 z-40`}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-bg-card border-r border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-medium text-text-heading">Menu</span>
              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-text-body hover:text-text-heading transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent {...shared} />
          </aside>
        </div>
      )}
    </>
  );
}
