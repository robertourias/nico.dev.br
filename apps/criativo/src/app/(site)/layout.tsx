import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

// Route group aplicado apenas à home (grid de páginas). Páginas de campanha
// vivem fora deste grupo e não recebem header/footer do site — ver nota em
// src/app/layout.tsx.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
