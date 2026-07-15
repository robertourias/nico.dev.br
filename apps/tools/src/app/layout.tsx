import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "tools.nico.dev — Ferramentas para devs",
  description: "Coleção de ferramentas web para desenvolvedores, potencializadas por IA.",
  icons: { icon: "/toolhub-logo.svg" },
}

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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
