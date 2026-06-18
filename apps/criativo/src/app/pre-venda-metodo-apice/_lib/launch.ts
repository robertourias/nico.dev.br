// Data oficial de lançamento do Método Ápice — fonte única usada pelo
// countdown no Hero e no CTA final, e pela copy de escassez/FAQ. Mantida em
// um módulo só para evitar datas divergentes entre seções.
//
// INTEGRAÇÃO FUTURA: ler de uma variável de ambiente / CMS quando a data de
// lançamento for confirmada com o time de marketing.
export const LAUNCH_DATE_ISO = "2026-07-09T20:00:00-03:00"

export function getLaunchDate(): Date {
  return new Date(LAUNCH_DATE_ISO)
}

export function formatLaunchDateLabel(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(getLaunchDate())
}
