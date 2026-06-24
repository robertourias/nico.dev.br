import { ArrowRight } from "lucide-react"
import { BLOG_POSTS } from "../_lib/data"
import { Reveal } from "./Reveal"

export function BlogSection() {
  return (
    <section id="blog" className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Blog imobiliário
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Conteúdo para decidir com confiança</h2>
          <p className="text-muted-foreground">
            Financiamento, tendências de mercado e dicas práticas para compradores e investidores.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BLOG_POSTS.map((post, index) => (
            <Reveal key={post.title} delayMs={index * 80}>
              <a
                href="#"
                className="imob-card-hover h-full flex flex-col gap-3 rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6"
              >
                <span
                  className="inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundImage: "var(--imob-gradient-soft)", color: "var(--imob-moss)" }}
                >
                  {post.category}
                </span>
                <p className="text-xs text-muted-foreground">{post.date}</p>
                <p className="font-semibold imob-font-serif text-foreground leading-snug">{post.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto pt-1" style={{ color: "var(--imob-moss)" }}>
                  Ler artigo
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
