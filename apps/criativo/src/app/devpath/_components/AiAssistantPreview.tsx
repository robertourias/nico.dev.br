"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, Sparkles, User } from "lucide-react"
import { AI_QUESTIONS } from "../_lib/data"
import { Reveal } from "./Reveal"

interface ChatMessage {
  id: string
  role: "bot" | "user"
  text: string
}

const FALLBACK_ANSWER =
  "Essa é uma prévia do assistente, com respostas pré-definidas sobre carreira em tecnologia. Tente uma das perguntas sugeridas abaixo — na versão completa, o assistente responde qualquer pergunta."

let messageSeq = 0
function nextId() {
  messageSeq += 1
  return `msg-${messageSeq}`
}

// Centerpiece interativo: preview do assistente de IA. Não há modelo real —
// as respostas vêm de um conjunto fixo de perguntas e respostas (AI_QUESTIONS)
// e qualquer pergunta digitada que não corresponda a uma delas recebe uma
// resposta de fallback explicando que é uma demonstração.
export function AiAssistantPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "bot",
      text: "Olá! Sou o assistente de carreira do DevPath (prévia). Escolha uma das perguntas rápidas abaixo ou digite a sua.",
    },
  ])
  const [draft, setDraft] = useState("")
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  function respondTo(questionText: string) {
    const userMessage: ChatMessage = { id: nextId(), role: "user", text: questionText }
    setMessages((current) => [...current, userMessage])
    setDraft("")
    setTyping(true)

    const match = AI_QUESTIONS.find(
      (q) =>
        q.question.toLowerCase() === questionText.trim().toLowerCase() ||
        questionText.toLowerCase().includes(q.question.toLowerCase().slice(0, 10))
    )

    window.setTimeout(() => {
      setTyping(false)
      setMessages((current) => [
        ...current,
        { id: nextId(), role: "bot", text: match ? match.answer : FALLBACK_ANSWER },
      ])
    }, 900)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim() || typing) return
    respondTo(draft)
  }

  return (
    <section id="assistente" className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="ai-title">
      <div className="max-w-4xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// assistente_de_carreira</p>
          <h2 id="ai-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Tire dúvidas de carreira com o assistente
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Prévia do assistente de IA: pergunte sobre transições de carreira, negociação salarial, tecnologias e
            roadmaps. Esta demonstração usa respostas pré-definidas.
          </p>
        </Reveal>

        <Reveal>
          <div className="devpath-glow rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--devpath-border)]">
              <span
                className="inline-flex items-center justify-center size-9 rounded-full text-[#04140e]"
                style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
                aria-hidden="true"
              >
                <Bot className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--devpath-fg)]">Assistente DevPath</p>
                <p className="devpath-mono text-xs text-[var(--devpath-green)]">● preview · respostas simuladas</p>
              </div>
              <Sparkles className="size-4 text-[var(--devpath-fg-faint)] ml-auto" aria-hidden="true" />
            </div>

            <div ref={scrollRef} className="devpath-scroll flex flex-col gap-3 px-5 py-5 h-80 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`devpath-chat-bubble-in flex items-start gap-2.5 ${
                    message.role === "user" ? "flex-row-reverse self-end" : "self-start"
                  } max-w-[85%]`}
                >
                  <span
                    className="inline-flex items-center justify-center size-7 rounded-full shrink-0 text-[#04140e]"
                    style={{
                      background: message.role === "user" ? "var(--devpath-border-strong)" : "var(--devpath-green)",
                      color: message.role === "user" ? "var(--devpath-fg)" : "#04140e",
                    }}
                    aria-hidden="true"
                  >
                    {message.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                  </span>
                  <p
                    className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={
                      message.role === "user"
                        ? { background: "rgba(52,211,153,0.12)", color: "var(--devpath-fg)" }
                        : { background: "var(--devpath-bg)", color: "var(--devpath-fg-muted)", border: "1px solid var(--devpath-border)" }
                    }
                  >
                    {message.text}
                  </p>
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-2.5 self-start">
                  <span
                    className="inline-flex items-center justify-center size-7 rounded-full shrink-0 text-[#04140e]"
                    style={{ background: "var(--devpath-green)" }}
                    aria-hidden="true"
                  >
                    <Bot className="size-3.5" />
                  </span>
                  <span className="flex items-center gap-1.5 rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg)] px-4 py-3">
                    <span className="devpath-typing-dot inline-block size-1.5 rounded-full bg-[var(--devpath-green)]" />
                    <span className="devpath-typing-dot inline-block size-1.5 rounded-full bg-[var(--devpath-green)]" style={{ animationDelay: "0.15s" }} />
                    <span className="devpath-typing-dot inline-block size-1.5 rounded-full bg-[var(--devpath-green)]" style={{ animationDelay: "0.3s" }} />
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-[var(--devpath-border)]">
              <div className="flex flex-wrap gap-2 mb-3">
                {AI_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => !typing && respondTo(q.question)}
                    disabled={typing}
                    className="rounded-full border border-[var(--devpath-border)] px-3.5 py-1.5 text-xs font-medium text-[var(--devpath-fg-muted)] hover:border-[var(--devpath-green)] hover:text-[var(--devpath-green)] transition-colors disabled:opacity-50"
                  >
                    {q.question}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Digite sua pergunta de carreira..."
                  className="flex-1 rounded-xl border border-[var(--devpath-border)] bg-[var(--devpath-bg)] px-4 py-2.5 text-sm text-[var(--devpath-fg)] placeholder:text-[var(--devpath-fg-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--devpath-green)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || typing}
                  aria-label="Enviar pergunta"
                  className="inline-flex items-center justify-center size-10 rounded-xl text-[#04140e] shrink-0 disabled:opacity-50 transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
                >
                  <Send className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
