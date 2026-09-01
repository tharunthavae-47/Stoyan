"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowLeft, Building2, CheckCheck, Loader2, MessageCircle, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type RequestData = { id: string; status: "pending" | "accepted" | "rejected" | string; created_at: string; employer_id: string; employee_id: string }
type Company = { name: string | null; industry: string | null; city: string | null }
type Employee = { vorname: string | null; nachname: string | null; beruf: string | null; city: string | null; stadt: string | null }
type Message = { id: string; contact_request_id: string; sender_id: string; message: string; created_at: string; read_at: string | null }
type Props = { requestId: string }

export default function EmployerChat({ requestId }: Props) {
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [request, setRequest] = useState<RequestData | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const employeeName = [employee?.vorname, employee?.nachname].filter(Boolean).join(" ") || "Arbeitnehmer"
  const initials = employeeName.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  useEffect(() => {
    let active = true
    async function loadChat() {
      setLoading(true); setError("")
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser()
        if (authError) throw new Error(authError.message)
        if (!auth.user) { window.location.href = "/login"; return }
        const currentUserId = auth.user.id
        if (active) setUserId(currentUserId)

        const { data: requestData, error: requestError } = await supabase.from("contact_requests").select("id,status,created_at,employer_id,employee_id").eq("id", requestId).eq("employer_id", currentUserId).maybeSingle()
        if (requestError) throw new Error(`Anfrage konnte nicht geladen werden: ${requestError.message}`)
        if (!requestData) throw new Error("Diese Anfrage wurde nicht gefunden oder du hast keinen Zugriff darauf.")
        const typedRequest = requestData as RequestData
        if (typedRequest.status !== "accepted") throw new Error("Der Chat ist erst verfügbar, wenn der Arbeitnehmer die Anfrage angenommen hat.")

        const [{ data: companyData }, { data: employeeData, error: employeeError }] = await Promise.all([
          supabase.from("companies").select("name,industry,city").eq("owner_id", typedRequest.employer_id).maybeSingle(),
          supabase.from("employee_profiles").select("vorname,nachname,beruf,city,stadt").eq("id", typedRequest.employee_id).maybeSingle(),
        ])

        let resolvedEmployee = employeeData as Employee | null
        if (!resolvedEmployee || (!resolvedEmployee.vorname && !resolvedEmployee.nachname)) {
          const { data: contactData } = await supabase.from("employee_contact_details").select("vorname,nachname,beruf,city,stadt").eq("employee_id", typedRequest.employee_id).maybeSingle()
          if (contactData) resolvedEmployee = contactData as Employee
        }
        if (employeeError) console.warn("Arbeitnehmerprofil konnte nicht geladen werden:", employeeError.message)

        const { data: messageData, error: messageError } = await supabase.from("contact_messages").select("id,contact_request_id,sender_id,message,created_at,read_at").eq("contact_request_id", requestId).order("created_at", { ascending: true })
        if (messageError) throw new Error(`Nachrichten konnten nicht geladen werden: ${messageError.message}`)
        if (!active) return

        setRequest(typedRequest); setCompany(companyData as Company | null); setEmployee(resolvedEmployee); setMessages((messageData || []) as Message[])
        const unreadIds = ((messageData || []) as Message[]).filter((message) => message.sender_id !== currentUserId && !message.read_at).map((message) => message.id)
        if (unreadIds.length > 0) await supabase.from("contact_messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds)
      } catch (err) {
        console.error(err); if (active) setError(err instanceof Error ? err.message : "Der Chat konnte nicht geladen werden.")
      } finally { if (active) setLoading(false) }
    }
    loadChat(); return () => { active = false }
  }, [requestId])

  useEffect(() => {
    if (!requestId || !userId) return
    const channel = supabase.channel(`employer-contact-chat-${requestId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages", filter: `contact_request_id=eq.${requestId}` }, (payload) => {
      const incoming = payload.new as Message
      setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [...current, incoming])
    }).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [requestId, userId])

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const message = text.trim(); if (!message || !request || !userId || sending) return
    setSending(true); setError("")
    try {
      const { data, error: insertError } = await supabase.from("contact_messages").insert({ contact_request_id: request.id, sender_id: userId, message }).select("id,contact_request_id,sender_id,message,created_at,read_at").single()
      if (insertError) throw new Error(`Nachricht konnte nicht gesendet werden: ${insertError.message}`)
      if (data) setMessages((current) => current.some((item) => item.id === data.id) ? current : [...current, data as Message])
      setText("")
    } catch (err) { console.error(err); setError(err instanceof Error ? err.message : "Nachricht konnte nicht gesendet werden.") } finally { setSending(false) }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }
  function formatDate(value: string) { return new Date(value).toLocaleString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) }

  if (loading) return <div className="card card-pad text-center"><Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--brand)]" /><p className="mt-4 font-semibold text-[var(--muted)]">Chat wird geladen…</p></div>
  if (error && !request) return <div className="card card-pad"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">{error}</div><Link href="/arbeitgeber" className="btn-primary mt-6 inline-flex"><ArrowLeft className="h-4 w-4" />Zurück zum Arbeitgeber-Dashboard</Link></div>

  return <div className="animate-fade-up">
    <div className="mb-6 flex items-center justify-between gap-4"><Link href="/arbeitgeber" className="btn-ghost"><ArrowLeft className="h-4 w-4" />Zurück</Link><span className="hidden items-center gap-2 text-sm font-bold text-emerald-600 sm:flex"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Privater Chat</span></div>
    {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-sm">
      <header className="bg-[var(--navy)] px-6 py-5 text-white sm:px-8"><div className="flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg font-black ring-1 ring-white/10">{initials || "A"}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-blue-300" /><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">Direkter Kontakt</p></div><h1 className="mt-1 truncate text-2xl font-black">{employeeName}</h1><p className="mt-1 text-sm text-blue-100/80">{employee?.beruf || "Beruf nicht angegeben"}{employee?.city || employee?.stadt ? ` · ${employee.city || employee.stadt}` : ""}</p></div><div className="hidden text-right sm:block"><p className="text-xs text-blue-200/70">Unternehmen</p><p className="mt-1 flex items-center gap-1 font-bold"><Building2 className="h-4 w-4" />{company?.name || "Ihr Unternehmen"}</p></div></div></header>
      <div className="h-[min(62vh,600px)] min-h-[420px] overflow-y-auto bg-slate-50 p-5 sm:p-7">{messages.length === 0 ? <div className="flex h-full items-center justify-center text-center"><div><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[var(--brand)] shadow-sm"><MessageCircle className="h-7 w-7" /></div><h2 className="mt-5 text-xl font-black text-[var(--navy)]">Noch keine Nachrichten</h2><p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Schreiben Sie dem Arbeitnehmer die erste Nachricht und starten Sie das Gespräch.</p></div></div> : <div className="space-y-4">{messages.map((message) => { const employerMessage = message.sender_id === request?.employer_id; return <div key={message.id} className={`flex ${employerMessage ? "justify-start" : "justify-end"}`}><div className="max-w-[85%] sm:max-w-[70%]"><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${employerMessage ? "rounded-bl-md bg-white text-[var(--navy)] shadow-sm" : "rounded-br-md bg-[var(--brand)] text-white"}`}>{message.message}</div><div className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-[var(--muted-light)] ${employerMessage ? "justify-start" : "justify-end"}`}><span>{formatDate(message.created_at)}</span>{employerMessage && <CheckCheck className="h-3 w-3" />}</div></div></div> })}<div ref={bottomRef} /></div>}</div>
      <form onSubmit={sendMessage} className="border-t border-[var(--line)] bg-white p-4 sm:p-5"><div className="flex gap-3"><textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={handleKeyDown} placeholder="Nachricht an den Arbeitnehmer schreiben…" rows={2} maxLength={5000} disabled={sending} className="min-h-[54px] flex-1 resize-none rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--navy)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/10 disabled:bg-slate-50" /><button type="submit" disabled={sending || !text.trim()} className="self-end inline-flex h-[54px] items-center gap-2 rounded-2xl bg-[var(--brand)] px-5 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}<span className="hidden sm:inline">Senden</span></button></div><p className="mt-2 text-xs text-[var(--muted-light)]">Enter = Senden · Shift + Enter = neue Zeile</p></form>
    </section>
  </div>
}
