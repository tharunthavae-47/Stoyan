"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowLeft, Building2, Check, CheckCheck, Loader2, MessageCircle, Send, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type RequestData = {
  id: string
  status: "pending" | "accepted" | "rejected" | string
  created_at: string
  employer_id: string
  employee_id: string
}

type Company = { name: string | null; industry: string | null; city: string | null }
type Message = { id: string; contact_request_id: string; sender_id: string; message: string; created_at: string; read_at: string | null }

export default function EmployeeContactPage({ params }: { params: Promise<{ requestId: string }> }) {
  const [requestId, setRequestId] = useState("")
  const [request, setRequest] = useState<RequestData | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const supabase = createClient()

  useEffect(() => { params.then((value) => setRequestId(value.requestId)) }, [params])

  useEffect(() => {
    if (!requestId) return
    let active = true

    async function load() {
      setLoading(true); setError("")
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser()
        if (authError) throw new Error(authError.message)
        if (!auth.user) { window.location.href = "/login"; return }
        const currentUserId = auth.user.id
        setUserId(currentUserId)

        const { data: requestData, error: requestError } = await supabase
          .from("contact_requests")
          .select("id,status,created_at,employer_id,employee_id")
          .eq("id", requestId)
          .eq("employee_id", currentUserId)
          .maybeSingle()
        if (requestError) throw new Error(`Anfrage konnte nicht geladen werden: ${requestError.message}`)
        if (!requestData) throw new Error("Diese Anfrage wurde nicht gefunden oder du hast keinen Zugriff darauf.")

        const typed = requestData as RequestData
        const { data: companyData } = await supabase
          .from("companies")
          .select("name,industry,city")
          .eq("owner_id", typed.employer_id)
          .maybeSingle()

        if (!active) return
        setRequest(typed); setCompany(companyData as Company | null)

        if (typed.status === "accepted") await loadMessages(requestId, currentUserId)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Anfrage konnte nicht geladen werden.")
      } finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [requestId])

  async function loadMessages(id: string, currentUserId: string) {
    const { data, error: messageError } = await supabase
      .from("contact_messages")
      .select("id,contact_request_id,sender_id,message,created_at,read_at")
      .eq("contact_request_id", id)
      .order("created_at", { ascending: true })
    if (messageError) throw new Error(`Nachrichten konnten nicht geladen werden: ${messageError.message}`)
    setMessages((data || []) as Message[])

    const unreadIds = ((data || []) as Message[]).filter((m) => m.sender_id !== currentUserId && !m.read_at).map((m) => m.id)
    if (unreadIds.length) await supabase.from("contact_messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  useEffect(() => {
    if (!requestId || !userId || request?.status !== "accepted") return
    const channel = supabase.channel(`employee-contact-chat-${requestId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages", filter: `contact_request_id=eq.${requestId}` }, (payload) => {
        const incoming = payload.new as Message
        setMessages((current) => current.some((m) => m.id === incoming.id) ? current : [...current, incoming])
      }).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [requestId, userId, request?.status])

  async function changeRequest(status: "accepted" | "rejected") {
    if (!request || !userId || request.status !== "pending") return
    setActionLoading(true); setError("")
    try {
      const { data, error: updateError } = await supabase
        .from("contact_requests")
        .update({ status })
        .eq("id", request.id)
        .eq("employee_id", userId)
        .eq("status", "pending")
        .select("id,status,created_at,employer_id,employee_id")
        .maybeSingle()
      if (updateError) throw new Error(updateError.message)
      if (!data) throw new Error("Die Anfrage wurde möglicherweise bereits bearbeitet.")
      const updated = data as RequestData
      setRequest(updated)
      if (status === "accepted") await loadMessages(updated.id, userId)
    } catch (err) { setError(err instanceof Error ? err.message : "Die Anfrage konnte nicht bearbeitet werden.") }
    finally { setActionLoading(false) }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!request || !userId || request.status !== "accepted" || !text.trim() || sending) return
    setSending(true); setError("")
    try {
      const { data, error: insertError } = await supabase.from("contact_messages").insert({ contact_request_id: request.id, sender_id: userId, message: text.trim() }).select("id,contact_request_id,sender_id,message,created_at,read_at").single()
      if (insertError) throw new Error(`Nachricht konnte nicht gesendet werden: ${insertError.message}`)
      if (data) setMessages((current) => current.some((m) => m.id === data.id) ? current : [...current, data as Message])
      setText("")
    } catch (err) { setError(err instanceof Error ? err.message : "Nachricht konnte nicht gesendet werden.") }
    finally { setSending(false) }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() }
  }

  function formatDate(value: string) { return new Date(value).toLocaleString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) }

  if (loading) return <div className="card card-pad text-center"><Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--brand)]" /><p className="mt-4 font-semibold text-[var(--muted)]">Anfrage wird geladen…</p></div>

  if (!request) return <div className="card card-pad"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">{error || "Anfrage nicht gefunden."}</div><Link href="/arbeitnehmer" className="btn-primary mt-6 inline-flex"><ArrowLeft className="h-4 w-4" />Zurück</Link></div>

  return (
    <div className="animate-fade-up">
      <div className="mb-6"><Link href="/arbeitnehmer" className="btn-ghost"><ArrowLeft className="h-4 w-4" />Zurück zum Dashboard</Link></div>
      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-sm">
        <header className="bg-[var(--navy)] px-6 py-5 text-white sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><Building2 className="h-7 w-7" /></div>
            <div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">Arbeitgeber</p><h1 className="mt-1 truncate text-2xl font-black">{company?.name || "Unternehmen"}</h1><p className="mt-1 text-sm text-blue-100/80">{company?.industry || "Branche nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p></div>
            {request.status === "accepted" && <span className="hidden items-center gap-2 text-sm font-bold text-emerald-300 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" />Chat aktiv</span>}
          </div>
        </header>

        {request.status === "pending" && <div className="p-8 text-center sm:p-12"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600"><MessageCircle className="h-8 w-8" /></div><h2 className="mt-5 text-2xl font-black">{company?.name || "Dieses Unternehmen"} möchte dich kontaktieren</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">Wenn du die Anfrage annimmst, wird der private Chat freigeschaltet.</p><div className="mt-7 flex justify-center gap-3"><button onClick={() => changeRequest("rejected")} disabled={actionLoading} className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><X className="mr-2 inline h-4 w-4" />Ablehnen</button><button onClick={() => changeRequest("accepted")} disabled={actionLoading} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"><Check className="mr-2 inline h-4 w-4" />Annehmen</button></div></div>}

        {request.status === "rejected" && <div className="p-10 text-center"><X className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-black">Anfrage abgelehnt</h2><p className="mt-2 text-sm text-slate-500">Diese Kontaktanfrage wurde abgelehnt.</p></div>}

        {request.status === "accepted" && <>
          <div className="h-[min(62vh,600px)] min-h-[420px] overflow-y-auto bg-slate-50 p-5 sm:p-7">
            {messages.length === 0 ? <div className="flex h-full items-center justify-center text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 font-black">Noch keine Nachrichten</h2><p className="mt-2 text-sm text-slate-500">Schreibe dem Arbeitgeber die erste Nachricht.</p></div></div> : <div className="space-y-4">
              {messages.map((message) => {
                // Arbeitgeber links, Arbeitnehmer rechts.
                const employerMessage = message.sender_id === request.employer_id
                return <div key={message.id} className={`flex ${employerMessage ? "justify-start" : "justify-end"}`}><div className="max-w-[85%] sm:max-w-[70%]"><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${employerMessage ? "rounded-bl-md bg-white text-slate-900 shadow-sm" : "rounded-br-md bg-blue-600 text-white"}`}>{message.message}</div><div className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-slate-400 ${employerMessage ? "justify-start" : "justify-end"}`}><span>{formatDate(message.created_at)}</span>{!employerMessage && <CheckCheck className="h-3 w-3" />}</div></div></div>
              })}<div ref={bottomRef} /></div>}
          </div>
          <form onSubmit={sendMessage} className="border-t border-[var(--line)] bg-white p-4 sm:p-5"><div className="flex gap-3"><textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nachricht an den Arbeitgeber schreiben…" rows={2} maxLength={5000} disabled={sending} className="min-h-[54px] flex-1 resize-none rounded-2xl border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/10" /><button type="submit" disabled={sending || !text.trim()} className="self-end inline-flex h-[54px] items-center gap-2 rounded-2xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}<span className="hidden sm:inline">Senden</span></button></div><p className="mt-2 text-xs text-slate-400">Enter = Senden · Shift + Enter = neue Zeile</p></form>
        </>}
      </section>
    </div>
  )
}
