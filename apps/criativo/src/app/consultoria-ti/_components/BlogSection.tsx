import { Clock, Calendar, ArrowUpRight } from "lucide-react"
import { Reveal } from "./Reveal"
import { BLOG_POSTS } from "../_lib/data"

const CATEGORY_GRADIENTS: Record<string, string> = {
  Desenvolvimento: "linear-gradient(135deg, #6366f1, #818cf8)",
  Cloud: "linear-gradient(135deg, #06b6d4, #22d3ee)",
  DevOps: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  IA: "linear-gradient(135deg, #a855f7, #6366f1)",
  Arquitetura: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  "Gestão de Produto": "linear-gradient(135deg, #22c55e, #06b6d4)",
}

export function BlogSection() {
  return (
    <section id="blog" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="blog-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="blog-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Conteúdo <span className="consult-gradient-text">técnico</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Artigos práticos sobre desenvolvimento, cloud, DevOps, IA e arquitetura de software.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, index) => (
            <Reveal key={post.title} delayMs={index * 60}>
              <a href="#" className="consult-card-hover group block h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ backgroundImage: CATEGORY_GRADIENTS[post.category] ?? "var(--consult-gradient-primary)", opacity: 0.85 }}
                  aria-hidden="true"
                >
                  <span className="text-white/90 text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {post.readTime}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                    Ler artigo
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
