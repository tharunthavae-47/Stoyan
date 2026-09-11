"use client"

import Link from "next/link"
import { useEffect, useState, type ComponentType } from "react"
import { ArrowRight, Check, Clock3, MessageCircle, RefreshCw, Search, Send, Users, X, type LucideProps } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SubscriptionCard } from "@/components/subscription-card"

type Company = { name: string | null; industry: string | null; city: string | null; avatar_url: string | null }
type ContactRequest = { id: string; employer_id: string; employee_id: string; job_id: string | null; status: string; created_at: string }
type EmployeeProfile = { id: string; vorname: string | null; nachname: string | null; beruf: string | null; city: string | null; stadt: string | null; email: string | null; phone: string | null }
type Stat = { label: string; count: number; Icon: ComponentType<LucideProps> }

export default function ArbeitgeberPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [employees, setEmployees] = useState<Record<string, EmployeeProfile>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  async function loadDashboard(showLoading = true) {
    const supabase = createClient()
    if (showLoading) setLoading(true); else setRefreshing(true)
    setError("")
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error(userError.message)
      if (!user) { window.location.href = "/login"; return }

      const { data: companyData } = await supabase.from("companies").select("name,industry,city,avatar_url").eq("owner_id", user.id).maybeSingle()
      setCompany(companyData || null)

      const { data: requestData, error: requestError } = await supabase.from("contact_requests").select("id,employer_id,employee_id,job_id,status,created_at").eq("employer_id", user.id).order("created_at", { ascending: false })
      if (requestError) throw new Error(`Anfragen konnten nicht geladen werden: ${requestError.message}`)
      const loadedRequests = (requestData || []) as ContactRequest[]
      setRequests(loadedRequests)

      const employeeIds = Array.from(new Set(loadedRequests.map((r) => r.employee_id)))
      if (employeeIds.length) {
        const { data: profileData, error: profileError } = await supabase.from("employee_contact_details").select("id,vorname,nachname,beruf,city,stadt,email,phone").in("id", employeeIds)
        if (profileError) throw new Error(`Arbeitnehmerdaten konnten nicht geladen werden: ${profileError.message}`)
        const map: Record<string, EmployeeProfile> = {}
        ;(profileData || []).forEach((profile) => { map[profile.id] = profile as EmployeeProfile })
        setEmployees(map)
      } else setEmployees({})
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Das Dashboard konnte nicht geladen werden.")
    } finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { void loadDashboard() }, [])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null
    async function subscribe() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !mounted) return
      channel = supabase.channel(`employer-requests-${user.id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "contact_requests", filter: `employer_id=eq.${user.id}` }, () => { void loadDashboard(false) })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_requests", filter: `employer_id=eq.${user.id}` }, () => { void loadDashboard(false) })
        .subscribe()
    }
    void subscribe()
    const onFocus = () => { void loadDashboard(false) }
    window.addEventListener("focus", onFocus)
    return () => { mounted = false; window.removeEventListener("focus", onFocus); if (channel) void supabase.removeChannel(channel) }
  }, [])

  function getEmployee(id: string) { return employees[id] }
  function getEmployeeName(id: string) { const e = getEmployee(id); return e ? [e.vorname, e.nachname].filter(Boolean).join(" ") || "Arbeitnehmer" : "Arbeitnehmer" }
  function getEmployeeProfession(id: string) { return getEmployee(id)?.beruf || "Beruf nicht angegeben" }
  function getEmployeeLocation(id: string) { const e = getEmployee(id); return e?.city || e?.stadt || null }
  function getInitials(id: string) { const name = getEmployeeName(id); return name === "Arbeitnehmer" ? "A" : name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase() }

  const pending = requests.filter((r) => r.status === "pending")
  const accepted = requests.filter((r) => r.status === "accepted")
  const rejected = requests.filter((r) => r.status === "rejected")
  const stats: Stat[] = [
    { label: "Alle Anfragen", count: requests.length, Icon: Send },
    { label: "Ausstehend", count: pending.length, Icon: Clock3 },
    { label: "Angenommen", count: accepted.length, Icon: Check },
    { label: "Abgelehnt", count: rejected.length, Icon: X },
  ]

  if (loading) return <div className="ed-card ed-card-pad text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--brand)]" /><p className="mt-5 text-[var(--muted)]">Dashboard wird geladen…</p></div>

  return <div className="animate-fade-up">
    <div className="flex flex-col justify-between gap-6 border-b border-[#e2e7ee] pb-8 lg:flex-row lg:items-end">
      <div>
        <p className="ed-eyebrow">Arbeitgeber</p>
        <h1 className="mt-4 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] sm:text-5xl text-balance">Mitarbeiter finden.</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">Suchen Sie nach Ihren Kriterien und entdecken Sie passende Arbeitnehmerprofile.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => void loadDashboard(false)} disabled={refreshing} className="ed-btn-ghost shrink-0"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Aktualisieren</button>
        <Link href="/arbeitgeber/suche" className="ed-btn-primary shrink-0"><Search className="h-4 w-4" />Kandidaten suchen<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>

    {error && <div className="alert-error mt-6 text-sm font-medium">{error}</div>}

    <section className="mt-8 grid gap-px overflow-hidden rounded-[6px] border border-[#e2e7ee] bg-[#e2e7ee] sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, count, Icon }) => <div key={label} className="bg-white p-6"><div className="flex items-center justify-between"><p className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">{label}</p><Icon className="h-4 w-4 text-[var(--muted-light)]" /></div><p className="ed-metric mt-4">{count}</p></div>)}</section>

    <section className="ed-card ed-card-pad mt-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[6px] bg-[var(--navy)] text-xl font-normal text-white">{company?.avatar_url ? <img src={company.avatar_url || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : (company?.name || "O")[0]?.toUpperCase()}</div><div><p className="ed-eyebrow">Unternehmen</p><h2 className="mt-2 text-xl font-normal tracking-tight text-[var(--navy)]">{company?.name || "Ihr Unternehmen"}</h2><p className="mt-1 text-sm text-[var(--muted)]">{company?.industry || "Branche noch nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p></div></div><Link href="/arbeitgeber/firma" className="ed-btn-ghost">Unternehmensprofil bearbeiten<ArrowRight className="ml-1 h-4 w-4" /></Link></div></section>

    <SubscriptionCard />

    <section className="mt-8 rounded-[6px] bg-[var(--navy)] p-8 text-white sm:p-10"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-blue-300">Nächster Schritt</p><h2 className="mt-3 text-3xl font-light tracking-[-0.02em]">Kandidaten finden</h2><p className="mt-3 max-w-2xl leading-relaxed text-blue-100/90">Beruf, Erfahrung, Skills, Ort, Pensum und weitere Kriterien eingeben und passende Arbeitnehmer entdecken.</p></div><Link href="/arbeitgeber/suche" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-white px-6 py-3.5 font-medium text-[var(--navy)] transition hover:bg-slate-100">Suche starten<ArrowRight className="h-4 w-4" /></Link></div></section>

    <section className="ed-section mt-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="ed-eyebrow">Kommunikation</p><h2 className="mt-3 text-2xl font-light tracking-[-0.02em] text-[var(--navy)]">Anfragen &amp; Nachrichten</h2><p className="mt-2 text-sm text-[var(--muted)]">Arbeitgeber links, Arbeitnehmer rechts. Kontaktdaten werden erst nach Annahme freigegeben.</p></div>{requests.length > 0 && <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-light)]"><Users className="h-4 w-4" />{requests.length} Anfrage{requests.length !== 1 ? "n" : ""}</div>}</div>
      {requests.length === 0 ? <div className="mt-6 border border-dashed border-[var(--line-strong)] p-12 text-center"><MessageCircle className="mx-auto h-8 w-8 text-[var(--muted-light)]" /><h3 className="mt-4 text-lg font-normal text-[var(--navy)]">Noch keine Kontaktanfragen</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--muted)]">Wenn Sie einen passenden Arbeitnehmer gefunden haben, können Sie über dessen Profil eine Kontaktanfrage senden.</p><Link href="/arbeitgeber/suche" className="ed-btn-primary mt-6 inline-flex">Kandidaten suchen<ArrowRight className="h-4 w-4" /></Link></div> : <div className="mt-6 divide-y divide-[#e2e7ee] border-y border-[#e2e7ee]">{requests.map((request) => { const name = getEmployeeName(request.employee_id); const isAccepted = request.status === "accepted"; const location = getEmployeeLocation(request.employee_id); return <div key={request.id} className={`flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center ${isAccepted ? "border-l-2 border-l-[var(--success)] pl-4" : ""}`}><div className="flex min-w-0 items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px] bg-[var(--navy)] text-lg font-normal text-white">{getInitials(request.employee_id)}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-normal tracking-tight text-[var(--navy)]">{name}</h3>{isAccepted && <span className="ed-chip ed-chip-green"><Check className="h-3 w-3" />Angenommen</span>}{request.status === "pending" && <span className="ed-chip ed-chip-amber"><Clock3 className="h-3 w-3" />Ausstehend</span>}{request.status === "rejected" && <span className="ed-chip"><X className="h-3 w-3" />Abgelehnt</span>}</div><p className="mt-1 text-sm text-[var(--muted)]">{getEmployeeProfession(request.employee_id)}{location ? ` · ${location}` : ""}</p><p className="mt-0.5 text-xs text-[var(--muted-light)]">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p></div></div><Link href={`/arbeitgeber/anfragen/${request.id}`} className={`shrink-0 ${isAccepted ? "ed-btn-primary" : "ed-btn-ghost"}`}>{isAccepted ? <><MessageCircle className="h-4 w-4" />Chat öffnen</> : <>Ansehen<ArrowRight className="h-4 w-4" /></>}</Link></div> })}</div>}
    </section>
  </div>
}
