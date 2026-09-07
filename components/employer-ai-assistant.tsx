"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { Bot, BriefcaseBusiness, GraduationCap, MapPin, Send, Sparkles, UserRound, X } from "lucide-react"

type Candidate = {
  id: string
  profession: string | null
  education: string | null
  years_experience: number | null
  desired_employment_percent: number | null
  desired_salary_min: number | null
  skills: string[] | null
  contact_visible: boolean | null
  first_name: string | null
  last_name: string | null
  city: string | null
}

type Message = { role: "user" | "assistant"; content: string; candidates?: Candidate[] }

const suggestions = [
  "Wer sind die besten Kandidaten für eine Logistikstelle?",
  "Welche Kandidaten haben viel Berufserfahrung?",
  "Zeig mir passende Bewerber in Luzern.",
]

function candidateName(candidate: Candidate) { return `${candidate.first_name || "Kandidat"} ${candidate.last_name || ""}`.trim() }

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const skills = Array.isArray(candidate.skills) ? candidate.skills.filter(Boolean) : []
  const profileUrl = `/arbeitgeber/kandidat/${candidate.id}`

  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white"><UserRound className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black text-slate-950">{candidateName(candidate)}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-blue-600"><BriefcaseBusiness className="h-3.5 w-3.5" />{candidate.profession || "Beruf nicht angegeben"}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-2.5"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Ausbildung</p><p className="mt-1 text-xs font-bold text-slate-700">{candidate.education || "Nicht angegeben"}</p></div>
        <div className="rounded-xl bg-slate-50 p-2.5"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Erfahrung</p><p className="mt-1 text-xs font-bold text-slate-700">{candidate.years_experience ?? 0} Jahre</p></div>
        <div className="rounded-xl bg-slate-50 p-2.5"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Wunschpensum</p><p className="mt-1 text-xs font-bold text-slate-700">{candidate.desired_employment_percent ?? 100} Prozent</p></div>
        <div className="rounded-xl bg-slate-50 p-2.5"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Wunschlohn</p><p className="mt-1 text-xs font-bold text-slate-700">{candidate.desired_salary_min == null ? "Nicht angegeben" : `CHF ${candidate.desired_salary_min.toLocaleString("de-CH")}`}</p></div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
        {candidate.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{candidate.city}</span>}
        {candidate.education && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{candidate.education}</span>}
      </div>

      {skills.length > 0 && <div className="mt-3"><p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Fähigkeiten</p><div className="flex flex-wrap gap-1.5">{skills.slice(0, 8).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{skill}</span>)}</div></div>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href={profileUrl} className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800">Profil ansehen</Link>
        {candidate.contact_visible ? <Link href={profileUrl} className="inline-flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"><Send className="h-3.5 w-3.5" />Kontakt aufnehmen</Link> : <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-2.5 text-center text-[11px] font-bold text-slate-400">Kontakt nicht freigegeben</span>}
      </div>
    </article>
  )
}

export function EmployerAIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hallo! Ich bin dein persönlicher jobmatch24 KI-Assistent. Ich kann innerhalb von JobMatch24 nach passenden Kandidaten suchen, Profile vergleichen und dir bei Bewerbungen helfen. Ich suche nicht im Internet." }])

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: "user" as const, content: text }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)
    try {
      const response = await fetch("/api/arbeitgeber/ai-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages.slice(-12).map(({ role, content }) => ({ role, content })) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Der KI-Assistent konnte nicht antworten.")
      setMessages((current) => [...current, { role: "assistant", content: data.message, candidates: Array.isArray(data.candidates) ? data.candidates : undefined }])
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error instanceof Error ? error.message : "Es ist ein Fehler aufgetreten." }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button type="button" aria-label="Mein KI-Assistent öffnen" onClick={() => setOpen(true)} className="fixed bottom-5 left-5 z-[70] flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-[0_14px_45px_rgba(15,23,42,0.24)] transition-all duration-200 hover:-translate-y-1 hover:scale-105 sm:bottom-7 sm:left-7"><span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950"><img src="/jobmatch24-logo.png" alt="jobmatch24 KI" className="h-10 w-10 object-contain" /><span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" /></span></button>
      {open && <div className="fixed inset-0 z-[80] pointer-events-none sm:inset-auto sm:bottom-6 sm:left-6"><div className="pointer-events-auto absolute bottom-0 left-0 flex h-[min(720px,calc(100vh-24px))] w-full flex-col overflow-hidden rounded-t-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:static sm:h-[min(700px,calc(100vh-48px))] sm:w-[430px] sm:rounded-[28px]">
        <header className="flex items-center gap-3 bg-slate-950 px-5 py-4 text-white"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white"><img src="/jobmatch24-logo.png" alt="jobmatch24" className="h-8 w-8 object-contain" /></div><div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-sm font-black"><Sparkles className="h-4 w-4 text-blue-300" /> Mein KI-Assistent</p><p className="mt-0.5 text-xs text-slate-300">Nur JobMatch24 · kein Internet</p></div><button type="button" onClick={() => setOpen(false)} aria-label="KI-Assistent schliessen" className="rounded-xl p-2 hover:bg-white/10"><X className="h-5 w-5" /></button></header>
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "user" ? <div className="max-w-[88%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-6 text-white">{message.content}</div> : message.candidates && message.candidates.length > 0 ? <div className="w-full max-w-[98%]"><div className="mb-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Sparkles className="h-4 w-4" /></div><div><p className="text-sm font-black text-slate-950">JobMatch24 – Profile</p><p className="text-xs font-semibold text-slate-500">{message.candidates.length} Profil{message.candidates.length === 1 ? "" : "e"} gefunden</p></div></div></div><div className="space-y-3">{message.candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}</div></div> : <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm whitespace-pre-wrap">{message.content}</div>}
          </div>)}
          {loading && <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Bot className="h-4 w-4 animate-pulse" /> Ich prüfe die JobMatch24-Daten…</div>}
        </div>
        {messages.length === 1 && <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{suggestion}</button>)}</div>}
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Frag mich etwas über Kandidaten…" className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white" /><button type="submit" disabled={!input.trim() || loading} aria-label="Nachricht senden" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
      </div></div>}
    </>
  )
}
