import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "criativo.nico.dev — Landing pages e portfólio",
  description: "Estúdio de landing pages de campanhas e layouts de portfólio do nico.dev.",
}

// Layout raiz minimalista: header/site-wide e footer ficam no route group
// (site), aplicado apenas à home (grid de páginas). Páginas de campanha
// (ex: /landing-newsletter-premium) renderizam direto sob este layout, sem
// navegação do site, para manter foco total na conversão.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  )
}
