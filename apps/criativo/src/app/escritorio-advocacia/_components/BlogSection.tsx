import { Calendar, ArrowUpRight, ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"
import { BLOG_POSTS } from "../_lib/data"

const CATEGORY_GRADIENTS: Record<string, string> = {
  Trabalhista: "linear-gradient(135deg, #0b2545, #173a66)",
  Empresarial: "linear-gradient(135deg, #173a66, #44505f)",
  Família: "linear-gradient(135deg, #b08d45, #d4b878)",
  Tributário: "linear-gradient(135deg, #0b2545, #44505f)",
  Imobiliário: "linear-gradient(135deg, #44505f, #b08d45)",
}

export function BlogSection() {
  return (
    <section id="blog" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="blog-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="blog-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Conteúdo <span style={{ color: "var(--adv-gold)" }}>Jurídico</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Artigos práticos para entender seus direitos e tomar decisões mais seguras.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BLOG_POSTS.map((post, index) => (
            <Reveal key={post.title} delayMs={index * 60}>
              <a href="#" className="adv-card-hover group block h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
                <div
                  className="h-28 flex items-center justify-center"
                  style={{ backgroundImage: CATEGORY_GRADIENTS[post.category] ?? "var(--adv-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <span className="text-white/90 text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    {post.date}
                  </div>
                  <p className="font-semibold text-foreground leading-snug mb-2 group-hover:text-[var(--adv-gold)] transition-colors">
                    {post.title}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--adv-gold)" }}>
                    Ler artigo
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <a
            href="#"
            className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-foreground border border-border hover:border-[var(--adv-gold)] transition-colors"
          >
            Ver Todos os Artigos
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
