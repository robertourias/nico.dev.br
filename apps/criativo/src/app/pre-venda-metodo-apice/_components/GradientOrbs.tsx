// Fundo decorativo "premium": blobs de gradiente desfocados + partículas
// flutuantes, tudo em CSS puro (sem canvas/lib de partículas) para manter a
// página leve. `aria-hidden` porque é puramente estético.
//
// `variant` ajusta a composição: "hero" usa 3 blobs grandes assimétricos,
// "cta" usa uma composição mais centrada para a seção de conversão final.
export function GradientOrbs({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  const particles = Array.from({ length: 14 }, (_, i) => i)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {variant === "hero" ? (
        <>
          <div
            className="apice-blob apice-float-slow w-[34rem] h-[34rem] -top-40 -left-32"
            style={{ background: "radial-gradient(circle, var(--apice-purple), transparent 70%)" }}
          />
          <div
            className="apice-blob apice-float-slower w-[28rem] h-[28rem] top-10 right-[-10rem]"
            style={{ background: "radial-gradient(circle, var(--apice-blue), transparent 70%)" }}
          />
          <div
            className="apice-blob apice-float-slow w-[22rem] h-[22rem] bottom-[-8rem] left-1/3"
            style={{ background: "radial-gradient(circle, var(--apice-violet), transparent 70%)", animationDelay: "1.5s" }}
          />
        </>
      ) : (
        <>
          <div
            className="apice-blob apice-float-slow w-[30rem] h-[30rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(circle, var(--apice-purple), transparent 70%)" }}
          />
          <div
            className="apice-blob apice-float-slower w-[24rem] h-[24rem] bottom-[-6rem] right-[-6rem]"
            style={{ background: "radial-gradient(circle, var(--apice-neon), transparent 75%)", opacity: 0.25 }}
          />
        </>
      )}

      {particles.map((i) => (
        <span
          key={i}
          className="apice-particle"
          style={{
            left: `${(i * 7.3) % 100}%`,
            bottom: `${(i * 11) % 60}%`,
            width: i % 3 === 0 ? "4px" : "2px",
            height: i % 3 === 0 ? "4px" : "2px",
            animationDuration: `${8 + (i % 5) * 2}s`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}
