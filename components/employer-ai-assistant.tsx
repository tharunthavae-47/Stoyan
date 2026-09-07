"use client"

import { FormEvent, useState } from "react"
import { Bot, Send, Sparkles, X } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

const suggestions = [
  "Wer sind die besten Kandidaten für eine Logistikstelle?",
  "Welche Kandidaten haben viel Berufserfahrung?",
  "Zeig mir passende Bewerber in Luzern.",
]

export function EmployerAIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein persönlicher jobmatch24 KI-Assistent. Ich kann innerhalb von JobMatch24 nach passenden Kandidaten suchen, Profile vergleichen und dir bei Bewerbungen helfen. Ich suche nicht im Internet.",
    },
  ])

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: "user" as const, content: text }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/arbeitgeber/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Der KI-Assistent konnte nicht antworten.")
      setMessages((current) => [...current, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Es ist ein Fehler aufgetreten." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Mein KI-Assistent öffnen"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[70] flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-[0_14px_45px_rgba(15,23,42,0.24)] transition-all duration-200 hover:-translate-y-1 hover:scale-105 sm:bottom-7 sm:left-7"
      >
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950">
          <img src="/jobmatch24-logo.png" alt="jobmatch24 KI" className="h-10 w-10 object-contain" />
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] pointer-events-none sm:inset-auto sm:bottom-6 sm:left-6">
          <div className="pointer-events-auto absolute bottom-0 left-0 flex h-[min(720px,calc(100vh-24px))] w-full flex-col overflow-hidden rounded-t-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:static sm:h-[min(700px,calc(100vh-48px))] sm:w-[430px] sm:rounded-[28px]">
            <header className="flex items-center gap-3 bg-slate-950 px-5 py-4 text-white">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img src="/jobmatch24-logo.png" alt="jobmatch24" className="h-8 w-8 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-black"><Sparkles className="h-4 w-4 text-blue-300" /> Mein KI-Assistent</p>
                <p className="mt-0.5 text-xs text-slate-300">Nur JobMatch24 · kein Internet</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="KI-Assistent schliessen" className="rounded-xl p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Bot className="h-4 w-4 animate-pulse" /> Ich prüfe die JobMatch24-Daten…</div>}
            </div>

            {messages.length === 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{suggestion}</button>
                ))}
              </div>
            )}

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Frag mich etwas über Kandidaten…" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white" />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Nachricht senden" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
