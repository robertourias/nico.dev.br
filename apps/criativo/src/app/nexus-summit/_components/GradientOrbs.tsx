// Fundo decorativo "premium" claro: blobs de gradiente translúcidos
// desfocados, em CSS puro (sem canvas/lib de partículas) — mesma estratégia
// de `pre-venda-metodo-apice/GradientOrbs.tsx`, adaptada para um fundo claro
// (cores com opacidade baixa em vez de blobs sólidos sobre fundo escuro).
//
// `variant` ajusta a composição: "hero" usa 3 blobs grandes assimétricos,
// "cta" usa uma composição mais centrada para a seção de conversão final.
export function GradientOrbs({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {variant === "hero" ? (
        <>
          <div
            className="nexus-blob nexus-float-slow w-[36rem] h-[36rem] -top-48 -left-40"
            style={{ background: "radial-gradient(circle, var(--nexus-purple), transparent 70%)", opacity: 0.18 }}
          />
          <div
            className="nexus-blob nexus-float-slower w-[30rem] h-[30rem] top-0 right-[-12rem]"
            style={{ background: "radial-gradient(circle, var(--nexus-blue), transparent 70%)", opacity: 0.16 }}
          />
          <div
            className="nexus-blob nexus-float-slow w-[24rem] h-[24rem] bottom-[-10rem] left-1/3"
            style={{
              background: "radial-gradient(circle, var(--nexus-cyan), transparent 70%)",
              opacity: 0.16,
              animationDelay: "1.5s",
            }}
          />
        </>
      ) : (
        <>
          <div
            className="nexus-blob nexus-float-slow w-[32rem] h-[32rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(circle, var(--nexus-purple), transparent 70%)", opacity: 0.14 }}
          />
          <div
            className="nexus-blob nexus-float-slower w-[24rem] h-[24rem] bottom-[-6rem] right-[-6rem]"
            style={{ background: "radial-gradient(circle, var(--nexus-orange), transparent 75%)", opacity: 0.12 }}
          />
        </>
      )}
    </div>
  )
}
