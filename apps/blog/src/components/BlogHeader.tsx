import { Menu, Github, Linkedin, Twitter } from 'lucide-react';
import { Header, NavLink, ThemeToggle } from '@nico.dev/ui';
import { SITE, SOCIAL, SITES } from '@/config';

export function BlogHeader() {
  return (
    <Header>
      {/* Hamburger direto — dispara toggle-sidebar sem abrir drawer de nav.
          CategorySidebar e PostSidebar já escutam este evento para se abrir. */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
        aria-label="Abrir menu de categorias"
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 cursor-pointer"
      >
        <Menu size={18} />
      </button>

      <Header.Logo href="/" label={SITE.name} />

      <Header.Nav className="sm:flex">
        <NavLink href={SITES.portfolio.url}>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.tools.url}>{SITES.tools.label}</NavLink>
      </Header.Nav>

      <Header.Actions>
        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Github size={18} />
        </a>
        <a
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Linkedin size={18} />
        </a>
        <div className="w-px h-4 mx-1 bg-border shrink-0" />
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
