import { Menu, Github, Linkedin, Twitter } from 'lucide-react';
import { Header, ThemeToggle } from '@nico.dev/ui';
import { SOCIAL } from '@/config';
import { SearchBox } from '@/components/SearchBox';

export function BlogHeader() {
  return (
    <Header>
      {/* Dispara toggle-sidebar — CategorySidebar e PostSidebar escutam este
          evento pra abrir o drawer (categorias, favoritos, Portfólio/Tools).
          Sempre visível: em telas largas é o único jeito de abrir o drawer
          nas páginas de post, que não têm sidebar fixa (drawerOnly). */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
        aria-label="Abrir menu de categorias"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 cursor-pointer"
      >
        <Menu size={18} />
      </button>

      {/* mr-auto no wrapper (não no Header.Logo, que zera a própria margem em
          telas largas) — mantém o título colado no hamburguer à esquerda e
          empurra Actions pro fim, já que não há mais Header.Nav no meio. */}
      <div className="mr-auto">
        <Header.Logo href="/" label="Blog Nicoletti">
          Blog <span className="text-text-highlight">Nicoletti</span>
        </Header.Logo>
      </div>

      <Header.Actions>
        <SearchBox />
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
