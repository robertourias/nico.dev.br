// Dados centrais do evento NEXUS Summit — fonte única usada pelo countdown
// (Hero e CTA final), pela seção "Sobre" e pelo FAQ, para evitar datas e
// informações divergentes entre seções.
//
// INTEGRAÇÃO FUTURA: ler de uma variável de ambiente / CMS quando a data,
// local e formato do evento forem confirmados com o time de marketing.
export const EVENT_NAME = "NEXUS Summit"
export const EVENT_EDITION = "2026"
export const EVENT_FORMAT = "Híbrido (presencial + transmissão online)"
export const EVENT_VENUE = "Centro de Eventos Aurora — São Paulo, SP"
export const EVENT_DATE_ISO = "2026-09-17T09:00:00-03:00"
export const REGISTRATION_DEADLINE_ISO = "2026-09-10T23:59:59-03:00"
export const CONTACT_EMAIL = "contato@nexussummit.com.br"
export const CONTACT_PHONE = "+55 11 4000-1234"

export function getEventDate(): Date {
  return new Date(EVENT_DATE_ISO)
}

export function getRegistrationDeadline(): Date {
  return new Date(REGISTRATION_DEADLINE_ISO)
}

export function formatEventDateLabel(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(getEventDate())
}

export function formatDeadlineLabel(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(getRegistrationDeadline())
}
