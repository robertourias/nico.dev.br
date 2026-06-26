import { Sparkles, TrendingDown } from "lucide-react"

// Cena isométrica simplificada do fluxo de energia (sol → painéis → casa),
// em SVG puro — sem libs de ilustração/3D, para manter o bundle leve. Brilho
// pulsante do sol, raios "chegando" aos painéis, reflexo no painel e traço
// de energia percorrendo o cabo até a casa são só CSS (`theme.css`), sempre
// em loop, reforçando a sensação de "produção contínua" mesmo sem interação.
export function HeroIllustration() {
  return (
    <div className="solar-fade-up-delay-2 relative max-w-lg w-full mx-auto">
      <div className="solar-glass solar-glow rounded-3xl p-4 md:p-5 overflow-hidden">
        <svg viewBox="0 0 480 360" className="w-full h-auto" role="img" aria-label="Ilustração: sol gerando energia para painéis solares que alimentam uma casa">
          <defs>
            <radialGradient id="solarSunGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE9B0" />
              <stop offset="55%" stopColor="#FFB627" />
              <stop offset="100%" stopColor="#F5A300" />
            </radialGradient>
            <linearGradient id="solarSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EAF6FB" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="solarPanelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C7FA6" />
              <stop offset="100%" stopColor="#0B3552" />
            </linearGradient>
            <linearGradient id="solarHouseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EEF5F9" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="480" height="360" rx="20" fill="url(#solarSkyGradient)" />

          {/* Sol */}
          <g className="solar-sun-core">
            <circle cx="370" cy="78" r="36" fill="url(#solarSunGradient)" />
          </g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x1 = 370 + Math.cos(rad) * 46
            const y1 = 78 + Math.sin(rad) * 46
            const x2 = 370 + Math.cos(rad) * 60
            const y2 = 78 + Math.sin(rad) * 60
            return (
              <line
                key={angle}
                className="solar-sun-ray"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFB627"
                strokeWidth={4}
                strokeLinecap="round"
                style={{ animationDelay: `${angle / 700}s` }}
              />
            )
          })}

          {/* Raios chegando aos painéis */}
          <line x1="338" y1="108" x2="270" y2="172" stroke="#FFC53D" strokeWidth={2} strokeDasharray="3 7" opacity={0.85} className="solar-flow-dash" />
          <line x1="352" y1="120" x2="300" y2="178" stroke="#FFC53D" strokeWidth={2} strokeDasharray="3 7" opacity={0.6} className="solar-flow-dash" style={{ animationDelay: "0.3s" }} />

          {/* Telhado / painéis (isométrico) */}
          <g>
            <polygon points="120,210 320,210 280,160 160,160" fill="#0a2c43" opacity={0.12} />
            <polygon points="130,205 235,205 215,168 150,168" fill="url(#solarPanelGradient)" stroke="#06283d" strokeWidth={1} />
            <polygon points="240,205 310,205 285,168 220,168" fill="url(#solarPanelGradient)" stroke="#06283d" strokeWidth={1} />
            {/* Linhas de grade dos painéis */}
            {[1, 2, 3].map((i) => (
              <line key={`gl-${i}`} x1={150 + i * 21} y1={168 + i * 0} x2={130 + i * 21} y2={205} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            ))}
            <rect x="130" y="168" width="105" height="37" fill="#fff" opacity={0} className="solar-panel-shine" />
            <polygon points="130,205 235,205 215,168 150,168" fill="#fff" opacity={0.18} className="solar-panel-shine" />
            <polygon points="240,205 310,205 285,168 220,168" fill="#fff" opacity={0.18} className="solar-panel-shine" style={{ animationDelay: "1.2s" }} />
          </g>

          {/* Cabo de energia até o inversor/casa */}
          <path
            id="solar-cable-path"
            d="M225 206 C 225 240, 225 240, 225 260 L 225 300"
            fill="none"
            stroke="#1C7FA6"
            strokeWidth={3}
          />
          <path
            d="M225 206 C 225 240, 225 240, 225 260 L 225 300"
            fill="none"
            stroke="#FFC53D"
            strokeWidth={3}
            strokeDasharray="6 10"
            className="solar-flow-dash"
          />

          {/* Inversor */}
          <rect x="208" y="255" width="34" height="22" rx="4" fill="#0B3552" />
          <circle cx="225" cy="266" r="4" fill="#FFC53D" className="solar-sun-core" />

          {/* Casa (isométrica) */}
          <g>
            <polygon points="90,300 360,300 360,355 90,355" fill="url(#solarHouseGradient)" stroke="#dbe6ec" strokeWidth={1} />
            <polygon points="90,300 225,260 360,300" fill="#0B3552" />
            <rect x="150" y="312" width="40" height="40" rx="3" fill="#EEF5F9" stroke="#cfe0e8" />
            <rect x="260" y="312" width="40" height="40" rx="3" fill="#FFE9B0" stroke="#f5d68a">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect x="210" y="318" width="30" height="37" rx="2" fill="#0B3552" />
          </g>
        </svg>
      </div>

      <div className="absolute -bottom-6 -left-6 solar-glass solar-glow-sun rounded-2xl px-4 py-3 flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center size-9 rounded-xl shrink-0 text-white"
          style={{ backgroundImage: "var(--solar-gradient-sun)" }}
          aria-hidden="true"
        >
          <TrendingDown className="size-4.5" />
        </span>
        <div>
          <p className="text-[0.65rem] text-muted-foreground leading-none mb-0.5">Redução média</p>
          <p className="text-lg font-bold text-foreground leading-none">até 95% na conta</p>
        </div>
      </div>

      <div
        className="absolute -top-3 -right-3 size-10 rounded-2xl flex items-center justify-center solar-glow-sun"
        style={{ backgroundImage: "var(--solar-gradient-sun)" }}
        aria-hidden="true"
      >
        <Sparkles className="size-5 text-white" />
      </div>
    </div>
  )
}
