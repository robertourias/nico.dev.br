import { LineChart, Database, Users, MessageSquareText, Layers } from "lucide-react"
import { Reveal } from "./Reveal"
import { DIFFERENTIALS, type Differential } from "../_lib/data"

const ICONS: Record<Differential["icon"], typeof Database> = {
  data: Database,
  team: Users,
  transparency: MessageSquareText,
  scale: Layers,
}

export function AboutSection() {
  return (
    <section id="sobre" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <div className="agencia-glass agencia-glow rounded-3xl p-8 md:p-10 aspect-[4/5] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 agencia-grid-bg opacity-40" aria-hidden="true" />
            <span
              className="relative inline-flex items-center justify-center size-20 rounded-3xl text-white mb-6"
              style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
              aria-hidden="true"
            >
              <LineChart className="size-9" />
            </span>
            <p className="relative text-2xl font-bold text-foreground mb-2">8+ anos</p>
            <p className="relative text-sm text-muted-foreground max-w-[14rem]">
              construindo estratégias de marketing digital orientadas por dados para empresas em todo o Brasil.
            </p>
          </div>
        </Reveal>

        <Reveal variant="slide-left">
          <h2 id="about-title" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Sobre a <span className="agencia-gradient-text">Lumen Digital</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            A Lumen Digital nasceu da convicção de que marketing de verdade se mede em resultado, não em métricas
            de vaidade. Ao longo dos últimos anos, construímos uma metodologia própria que combina performance,
            conteúdo e tecnologia para transformar investimento em mídia em crescimento previsível.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Atuamos como uma extensão do time de marketing dos nossos clientes — com transparência total sobre
            números, processos ágeis de otimização e foco absoluto em metas de negócio, não apenas em entregáveis.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {DIFFERENTIALS.map((item, index) => {
              const Icon = ICONS[item.icon]
              return (
                <Reveal key={item.title} delayMs={index * 70}>
                  <div className="agencia-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 flex items-start gap-3.5">
                    <span
                      className="inline-flex items-center justify-center size-10 rounded-xl text-white shrink-0"
                      style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
