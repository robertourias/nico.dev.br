// Chave de localStorage compartilhada entre `PricingSection` (grava a
// intenção de compra ao clicar em "Escolher <plano>") e `RegistrationForm`
// (lê para pré-selecionar o campo "Plano de interesse"). Mantida em módulo
// próprio para não duplicar a string literal entre os dois componentes.
export const SELECTED_PLAN_STORAGE_KEY = "nexus-summit:selected-plan"

export const PLAN_LABELS: Record<string, string> = {
  standard: "Standard",
  premium: "Premium",
  vip: "VIP",
}
