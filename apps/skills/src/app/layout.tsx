import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "../../catalog.config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.tagline,
};

// Tema via prefers-color-scheme (decisions.md): os tokens de @nico.dev/ui só
// trocam com a classe `.dark`, então aplicamos a classe antes da hidratação
// para evitar flash de tema errado.
const themeScript = `(function(){var m=window.matchMedia('(prefers-color-scheme: dark)');function a(){document.documentElement.classList.toggle('dark',m.matches)}a();m.addEventListener('change',a)})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
