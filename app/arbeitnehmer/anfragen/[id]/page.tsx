"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle } from "lucide-react"

type Company = { name: string | null; industry: string | null; city: string | null; avatar_url: string | null }
type RequestData = { id: string; status: string; created_at: string; employer_id: string; employee_id: string; company: Company | null }
type Message = { id: string; contact_request_id: string; sender_id: string; message: string; created_at: string; read_at: string | null }
type Props = { params: Promise<{ id: string }> }

export default function ContactRequestPage({ params }: Props) {
  const [requestId, setRequestId] = useState<string | null>(null)
  const [request, setRequest] = useState<RequestData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    let active = true
    params.then((value) => { if (active && value?.id) setRequestId(value.id) })
    return () => { active = false }
  }, [params])

  useEffect(() => {
    if (!requestId) return
    let active = true
    async function loadRequest() {
      setLoading(true); setError(""); setSuccess("")
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw new Error(`Authentifizierung fehlgeschlagen: ${authError.message}`)
        if (!user) { window.location.href = "/login"; return }
        if (!active) return
        setUserId(user.id)

        const { data: requestData, error: requestError } = await supabase
          .from("contact_requests")
          .select("id,status,created_at,employer_id,employee_id")
          .eq("id", requestId)
          .eq("employee_id", user.id)
          .maybeSingle()
        if (requestError) throw new Error(`Anfrage konnte nicht geladen werden: ${requestError.message}`)
        if (!requestData) throw new Error("Diese Anfrage wurde nicht gefunden oder du hast keinen Zugriff darauf.")

        const { data: company } = await supabase.from("companies").select("name,industry,city,avatar_url").eq("owner_id", requestData.employer_id).maybeSingle()
        if (!active) return
        const formattedRequest: RequestData = { ...requestData, company: company || null }
        setRequest(formattedRequest)
        if (formattedRequest.status === "accepted") await loadMessages(supabase, formattedRequest.id)
      } catch (err) {
        console.error(err)
        if (active) setError(err instanceof Error ? err.message : "Die Anfrage konnte nicht geladen werden.")
      } finally { if (active) setLoading(false) }
    }
    void loadRequest()
    return () => { active = false }
  }, [requestId])

  async function loadMessages(supabase: ReturnType<typeof createClient>, contactRequestId: string) {
    setLoadingMessages(true)
    try {
      const { data, error: messagesError } = await supabase.from("contact_messages").select("id,contact_request_id,sender_id,message,created_at,read_at").eq("contact_request_id", contactRequestId).order("created_at", { ascending: true })
      if (messagesError) throw new Error(messagesError.message)
      setMessages((data || []) as Message[])
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? `Nachrichten konnten nicht geladen werden: ${err.message}` : "Nachrichten konnten nicht geladen werden.")
    } finally { setLoadingMessages(false) }
  }

  useEffect(() => {
    if (!requestId || !userId || !request || request.status !== "accepted") return
    const supabase = createClient()
    const channel = supabase.channel(`contact-messages-${requestId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages", filter: `contact_request_id=eq.${requestId}` }, (payload) => {
      const newMessage = payload.new as Message
      setMessages((current) => current.some((message) => message.id === newMessage.id) ? current : [...current, newMessage])
    }).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [requestId, userId, request?.status])

  async function acceptRequest() {
    if (!request || !userId) return
    setActionLoading(true); setError(""); setSuccess("")
    try {
      const supabase = createClient()
      const { data: updatedRequest, error: updateError } = await supabase.rpc("accept_contact_request", { p_request_id: request.id })
      if (updateError) throw new Error(`Anfrage konnte nicht angenommen werden: ${updateError.message}`)
      if (!updatedRequest) throw new Error("Die Anfrage konnte nicht angenommen werden.")
      setRequest((current) => current ? { ...current, status: "accepted" } : null)
      await loadMessages(supabase, request.id)
      setSuccess("Anfrage angenommen. Dein Name, Beruf und Ort bleiben sichtbar; deine Telefonnummer und E-Mail sind jetzt für diesen Arbeitgeber freigegeben.")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Die Anfrage konnte nicht angenommen werden.")
    } finally { setActionLoading(false) }
  }

  async function rejectRequest() {
    if (!request || !userId) return
    if (!window.confirm("Möchtest du diese Anfrage wirklich ablehnen?")) return
    setActionLoading(true); setError(""); setSuccess("")
    try {
      const supabase = createClient()
      const { data: updatedRequest, error: updateError } = await supabase.from("contact_requests").update({ status: "rejected" }).eq("id", request.id).eq("employee_id", userId).eq("status", "pending").select("id,status,created_at,employer_id,employee_id").maybeSingle()
      if (updateError) throw new Error(`Anfrage konnte nicht abgelehnt werden: ${updateError.message}`)
      if (!updatedRequest) throw new Error("Die Anfrage konnte nicht aktualisiert werden.")
      setRequest((current) => current ? { ...current, status: "rejected" } : null)
      setSuccess("Die Anfrage wurde abgelehnt.")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Die Anfrage konnte nicht abgelehnt werden.")
    } finally { setActionLoading(false) }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!request || !userId || request.status !== "accepted") return
    const text = messageText.trim()
    if (!text || sending) return
    setSending(true); setError(""); setSuccess("")
    try {
      const supabase = createClient()
      const { data: insertedMessage, error: sendError } = await supabase.from("contact_messages").insert({ contact_request_id: request.id, sender_id: userId, message: text }).select("id,contact_request_id,sender_id,message,created_at,read_at").maybeSingle()
      if (sendError) throw new Error(`Nachricht konnte nicht gesendet werden: ${sendError.message}`)
      if (insertedMessage) setMessages((current) => current.some((message) => message.id === insertedMessage.id) ? current : [...current, insertedMessage as Message])
      setMessageText("")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Die Nachricht konnte nicht gesendet werden.")
    } finally { setSending(false) }
  }

  if (loading) return <div className="ed-card ed-card-pad text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--brand)]" /><p className="mt-5 text-[var(--muted)]">Anfrage wird geladen…</p></div>
  if (!request) return <div className="ed-card ed-card-pad"><h1 className="text-2xl font-light tracking-tight text-[var(--navy)]">Anfrage nicht gefunden</h1><p className="mt-3 text-[var(--muted)]">{error || "Diese Anfrage existiert nicht oder du hast keinen Zugriff darauf."}</p><Link href="/arbeitnehmer" className="ed-btn-primary mt-6 inline-flex">Zurück zum Dashboard</Link></div>

  const companyName = request.company?.name || "Unternehmen"
  const companyAvatar = request.company?.avatar_url

  return (
    <div className="animate-fade-up"><div className="mx-auto max-w-5xl">
      {error && <div className="alert-error mb-5 text-sm font-medium">{error}</div>}
      {success && <div className="alert-success mb-5 text-sm font-medium">{success}</div>}
      <section className="ed-card ed-card-pad"><p className="ed-eyebrow">Kontaktanfrage</p><div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[var(--navy)] text-3xl font-normal text-white">{companyAvatar ? <img src={companyAvatar || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : companyName.charAt(0).toUpperCase()}</div><div><h1 className="text-3xl font-light tracking-tight text-[var(--navy)]">{companyName}</h1><p className="mt-2 text-[var(--muted)]">{request.company?.industry || "Branche nicht angegeben"}{request.company?.city ? ` · ${request.company.city}` : ""}</p><p className="mt-2 text-sm text-[var(--muted-light)]">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p></div></div>
        <div className="mt-7 border-l-2 border-l-[var(--brand)] bg-[var(--surface-soft)] p-5"><p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Status</p><p className="mt-2 text-lg font-normal text-[var(--navy)]">{request.status === "pending" && "Die Firma möchte dich kontaktieren."}{request.status === "accepted" && "Kontakt angenommen – ihr könnt jetzt privat chatten."}{request.status === "rejected" && "Diese Anfrage wurde abgelehnt."}</p></div>
        {request.status === "pending" && <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={acceptRequest} disabled={actionLoading} className="ed-btn-primary">{actionLoading ? "Wird gespeichert…" : "Anfrage annehmen"}</button><button type="button" onClick={rejectRequest} disabled={actionLoading} className="ed-btn-ghost">Anfrage ablehnen</button></div>}
      </section>

      {request.status === "accepted" && <section className="ed-card mt-7 overflow-hidden">
        <div className="bg-[var(--navy)] px-6 py-5 text-white"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white/10 text-sm font-normal">{companyAvatar ? <img src={companyAvatar || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : companyName.charAt(0).toUpperCase()}</div><div><p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-blue-300">Privater Chat</p><h2 className="mt-1 text-xl font-normal">{companyName}</h2></div></div><p className="mt-1 text-sm text-blue-100/80">Arbeitgeber links · Arbeitnehmer rechts</p></div>
        <div className="min-h-[420px] max-h-[550px] space-y-4 overflow-y-auto bg-[var(--surface-soft)] p-6">
          {loadingMessages && <p className="text-center text-sm text-[var(--muted)]">Nachrichten werden geladen…</p>}
          {!loadingMessages && messages.length === 0 && <div className="flex min-h-[350px] items-center justify-center text-center"><div><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#e2e7ee] bg-white"><MessageCircle /></div><h3 className="mt-4 font-normal text-[var(--navy)]">Noch keine Nachrichten</h3><p className="mt-2 text-sm text-[var(--muted)]">Schreibe der Firma eine erste Nachricht.</p></div></div>}
          {messages.map((message) => { const fromEmployer = message.sender_id === request.employer_id; return <div key={message.id} className={`flex ${fromEmployer ? "justify-start" : "justify-end"}`}><div className="max-w-[80%]"><div className={`rounded-[6px] px-4 py-3 ${fromEmployer ? "border border-[#e2e7ee] bg-white text-[var(--navy)]" : "bg-[var(--brand)] text-white"}`}><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.message}</p></div><p className={`mt-1 px-1 text-[10px] ${fromEmployer ? "text-left text-[var(--muted-light)]" : "text-right text-[var(--brand)]"}`}>{new Date(message.created_at).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" })}</p></div></div> })}
        </div>
        <form onSubmit={sendMessage} className="border-t border-[#e2e7ee] bg-white p-4"><div className="flex gap-3"><textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (messageText.trim() && !sending) e.currentTarget.form?.requestSubmit() } }} rows={2} maxLength={5000} placeholder="Nachricht schreiben…" className="ed-input min-h-[52px] flex-1 resize-none text-sm" /><button type="submit" disabled={sending || !messageText.trim()} className="ed-btn-primary self-end">{sending ? "…" : "Senden"}</button></div><p className="mt-2 text-xs text-[var(--muted-light)]">Enter = senden · Shift + Enter = neue Zeile</p></form>
      </section>}
    </div></div>
  )
}
