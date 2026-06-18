const AUDIENCES = [
  "Profissionais de tecnologia que querem se manter atualizados sem perder tempo",
  "Empreendedores buscando aplicar IA de forma prática no negócio",
  "Quem quer aumentar produtividade com ferramentas e métodos validados",
] as const

export function AudienceSection() {
  return (
    <section className="px-6 py-16 md:py-20" aria-labelledby="audience-title">
      <div className="max-w-2xl mx-auto">
        <h2
          id="audience-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
        >
          Para quem é a Newsletter Premium
        </h2>

        <ul className="flex flex-col gap-4">
          {AUDIENCES.map((text) => (
            <li key={text} className="flex items-start gap-3 text-foreground">
              <span aria-hidden="true" className="mt-1 text-secondary">
                ✓
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
