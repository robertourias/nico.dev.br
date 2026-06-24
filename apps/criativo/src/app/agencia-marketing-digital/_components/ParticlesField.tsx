// Campo de partículas decorativo para o Hero. Posições, tamanhos e atrasos
// são fixos (não usam Math.random no render) para evitar mismatch de
// hidratação entre servidor e cliente — o movimento orgânico vem inteiramente
// das keyframes CSS (`.agencia-particle`), não de JS.
interface ParticleConfig {
  top: string
  left: string
  size: number
  color: string
  duration: string
  delay: string
  x: string
  y: string
}

const PARTICLES: ParticleConfig[] = [
  { top: "12%", left: "8%", size: 5, color: "#60a5fa", duration: "8s", delay: "0s", x: "18px", y: "-24px" },
  { top: "22%", left: "22%", size: 3, color: "#c4b5fd", duration: "10s", delay: "0.6s", x: "-14px", y: "20px" },
  { top: "8%", left: "38%", size: 4, color: "#22d3ee", duration: "7.5s", delay: "1.2s", x: "16px", y: "18px" },
  { top: "32%", left: "52%", size: 3, color: "#f472b6", duration: "9.5s", delay: "0.3s", x: "-20px", y: "-16px" },
  { top: "15%", left: "68%", size: 5, color: "#818cf8", duration: "11s", delay: "1.8s", x: "22px", y: "-20px" },
  { top: "40%", left: "80%", size: 4, color: "#60a5fa", duration: "8.8s", delay: "0.9s", x: "-18px", y: "22px" },
  { top: "55%", left: "12%", size: 3, color: "#22d3ee", duration: "9s", delay: "2.1s", x: "14px", y: "-18px" },
  { top: "62%", left: "30%", size: 5, color: "#c4b5fd", duration: "10.5s", delay: "0.4s", x: "-16px", y: "20px" },
  { top: "70%", left: "60%", size: 4, color: "#f472b6", duration: "7.8s", delay: "1.4s", x: "20px", y: "16px" },
  { top: "78%", left: "85%", size: 3, color: "#818cf8", duration: "9.2s", delay: "2.4s", x: "-14px", y: "-22px" },
  { top: "48%", left: "92%", size: 4, color: "#60a5fa", duration: "8.4s", delay: "1.6s", x: "16px", y: "20px" },
  { top: "85%", left: "40%", size: 3, color: "#22d3ee", duration: "10.2s", delay: "0.7s", x: "-18px", y: "-18px" },
]

export function ParticlesField() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="agencia-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            "--agencia-particle-color": particle.color,
            "--agencia-particle-duration": particle.duration,
            "--agencia-particle-delay": particle.delay,
            "--agencia-particle-x": particle.x,
            "--agencia-particle-y": particle.y,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
