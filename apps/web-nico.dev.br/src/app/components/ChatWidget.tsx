"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations } from "next-intl"
import MarkdownMessage from "./MarkdownMessage"

interface Message {
  role: "user" | "assistant"
  content: string
}

const STORAGE_KEY = "chat-history"
const MAX_HISTORY = 20

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // localStorage indisponível (modo privado)
  }
}

export default function ChatWidget() {
  const t = useTranslations("chat")
  const suggestions = t.raw("suggestions") as string[]

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Hidratação do localStorage pós-mount: ler no render causaria mismatch de SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage só existe no cliente
    setMessages(loadHistory())
    setMounted(true)

    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return

      const userMessage: Message = { role: "user", content: text.trim() }
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      saveHistory(updatedMessages)
      setInput("")
      setIsStreaming(true)

      const assistantPlaceholder: Message = { role: "assistant", content: "" }
      setMessages((prev) => [...prev, assistantPlaceholder])

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages.slice(-MAX_HISTORY) }),
        })

        if (!res.ok || !res.body) throw new Error("API error")

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6)
            if (data === "[DONE]") break
            try {
              const parsed = JSON.parse(data)
              if (typeof parsed === "string") {
                accumulated += parsed
                setMessages((prev) => {
                  const next = [...prev]
                  next[next.length - 1] = { role: "assistant", content: accumulated }
                  return next
                })
              }
            } catch {
              // chunk parcial
            }
          }
        }

        setMessages((prev) => {
          saveHistory(prev)
          return prev
        })
      } catch {
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = { role: "assistant", content: t("errorMessage") }
          saveHistory(next)
          return next
        })
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, isStreaming, t]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearHistory = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignorar */ }
    setMessages([])
  }

  if (!mounted) return null

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm md:max-w-96 h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-surface"
          role="dialog"
          aria-label={t("ariaExpanded")}
          aria-modal="false"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-outline-variant/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-display font-semibold text-sm text-on-surface">{t("title")}</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors text-xs"
                  aria-label={t("ariaClear")}
                  title={t("ariaClear")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                aria-label={t("ariaClose")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-end gap-4 pb-2">
                <p className="text-xs text-on-surface-variant text-center px-4">{t("greeting")}</p>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-outline-variant transition-all leading-relaxed min-h-[44px]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-on-primary rounded-br-sm"
                          : "bg-surface-container text-on-surface rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        msg.content || null
                      ) : msg.content ? (
                        <MarkdownMessage content={msg.content} />
                      ) : (
                        <span className="flex gap-1 items-center py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce [animation-delay:300ms]" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="px-3 py-3 border-t border-outline-variant/20 bg-surface-container shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none bg-surface rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 border border-outline-variant/30 focus:outline-none focus:border-primary/60 disabled:opacity-50 transition-colors min-h-[44px] max-h-28 leading-relaxed"
                style={{ height: "44px" }}
                onInput={(e) => {
                  const el = e.currentTarget
                  el.style.height = "44px"
                  el.style.height = Math.min(el.scrollHeight, 112) + "px"
                }}
                aria-label={t("ariaField")}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="p-2.5 bg-primary text-on-primary rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t("ariaSend")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant/50 text-center mt-2">{t("footer")}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center"
        aria-label={isOpen ? t("ariaClose") : t("ariaOpen")}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>
    </>
  )
}
