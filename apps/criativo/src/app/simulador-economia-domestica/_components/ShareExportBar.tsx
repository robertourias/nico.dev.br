"use client"

import { useState } from "react"
import { Share2, FileDown, RotateCcw, Check, Save } from "lucide-react"
import { formatCurrency } from "../_lib/calculations"
import type { SimulationResult } from "../_lib/calculations"

interface ShareExportBarProps {
  result: SimulationResult
  scenarioLabel: string
  onReset: () => void
}

// `navigator.share` (Web Share API) ainda não está nas typings padrão do
// lib.dom.d.ts em todas as versões do TypeScript — declaramos a forma mínima
// aqui em vez de depender disso, evitando erro de compilação independente da
// versão instalada.
type NavigatorWithShare = Navigator & {
  share?: (data: { title?: string; text?: string }) => Promise<void>
}

// Recursos extras do briefing implementados sem dependências externas:
// - Compartilhar: Web Share API quando disponível (mobile/Safari/Chrome),
//   com fallback para copiar um resumo para a área de transferência.
// - Exportar PDF: `window.print()` com folha de estilo dedicada (classe
//   `.economia-no-print` em theme.css oculta header/footer/botões),
//   permitindo salvar como PDF pelo próprio diálogo de impressão do
//   navegador — sem lib de geração de PDF no cliente.
// - Salvar: a simulação já é persistida automaticamente em localStorage a
//   cada alteração (ver EconomySimulator); aqui só reforçamos isso e
//   oferecemos um botão de reset.
export function ShareExportBar({ result, scenarioLabel, onReset }: ShareExportBarProps) {
  const [feedback, setFeedback] = useState<string | null>(null)

  const shareText = `💰 Simulei minha economia doméstica: posso economizar ${formatCurrency(
    result.monthlySavings
  )}/mês, ${formatCurrency(result.annualSavings)}/ano e ${formatCurrency(
    result.fiveYearSavings
  )} em 5 anos no cenário ${scenarioLabel}. Investindo essa economia a 8% a.a., chego a ${formatCurrency(
    result.investedFiveYears
  )} em 5 anos!`

  const showFeedback = (message: string) => {
    setFeedback(message)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleShare = async () => {
    const nav = typeof navigator !== "undefined" ? (navigator as NavigatorWithShare) : undefined
    if (nav?.share) {
      try {
        await nav.share({ title: "Simulador de Economia Doméstica", text: shareText })
        return
      } catch {
        // Usuário cancelou o compartilhamento nativo ou ele falhou — segue
        // para o fallback de área de transferência abaixo.
      }
    }

    try {
      await navigator.clipboard.writeText(shareText)
      showFeedback("Resumo copiado para a área de transferência!")
    } catch {
      showFeedback("Não foi possível copiar automaticamente.")
    }
  }

  const handleExportPdf = () => {
    if (typeof window !== "undefined") window.print()
  }

  const handleReset = () => {
    onReset()
    showFeedback("Simulação reiniciada com os valores padrão.")
  }

  return (
    <div className="economia-no-print flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white economia-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundImage: "var(--economia-gradient-primary)" }}
        >
          <Share2 className="size-4" aria-hidden="true" />
          Compartilhar Simulação
        </button>

        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <FileDown className="size-4" aria-hidden="true" />
          Exportar PDF
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reiniciar
        </button>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Save className="size-3.5" aria-hidden="true" />
        Sua simulação é salva automaticamente neste navegador (localStorage) — sem cadastro, sem servidor.
      </p>

      {feedback && (
        <p className="economia-save-pulse text-xs font-medium text-primary flex items-center gap-1.5" role="status">
          <Check className="size-3.5" aria-hidden="true" />
          {feedback}
        </p>
      )}
    </div>
  )
}
