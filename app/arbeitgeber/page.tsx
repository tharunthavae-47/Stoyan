"use client"

import Link from "next/link"
import { useEffect, useState, type ComponentType } from "react"
import { ArrowRight, Building2, Check, Clock3, MessageCircle, RefreshCw, Search, Send, Users, X, type LucideProps } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Company = { name: string | null; industry: string | null; city: string | null }
type ContactRequest = { id: string; employer_id: string; employee_id: string; job_id: string | null; status: string; created_at: string }
type EmployeeProfile = { id: string; vorname: string | null; nachname: string | null; beruf: string | null; city: string | null; stadt: string | null; email: string | null; phone: string | null }
type Stat = { label: string; count: number; Icon: ComponentType<LucideProps>; style: string }

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

      const { data: companyData } = await supabase.from("companies").select("name,industry,city").eq("owner_id", user.id).maybeSingle()
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
    { label: "Alle Anfragen", count: requests.length, Icon: Send, style: "bg-[var(--brand)]/10 text-[var(--brand)]" },
    { label: "Ausstehend", count: pending.length, Icon: Clock3, style: "bg-amber-50 text-amber-600" },
    { label: "Angenommen", count: accepted.length, Icon: Check, style: "bg-emerald-50 text-emerald-600" },
    { label: "Abgelehnt", count: rejected.length, Icon: X, style: "bg-red-50 text-red-500" },
  ]

  if (loading) return <div className="card card-pad text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" /><p className="mt-5 font-semibold text-[var(--muted)]">Dashboard wird geladen…</p></div>

  return <div className="animate-fade-up">
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div><div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]"><Building2 className="h-4 w-4" />Arbeitgeber</div><h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-[var(--navy)] sm:text-5xl">Mitarbeiter finden.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">Suchen Sie nach Ihren Kriterien und entdecken Sie passende Arbeitnehmerprofile.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => void loadDashboard(false)} disabled={refreshing} className="btn-ghost shrink-0"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Aktualisieren</button><Link href="/arbeitgeber/suche" className="btn-primary shrink-0"><Search className="h-4 w-4" />Kandidaten suchen<ArrowRight className="h-4 w-4" /></Link></div>
    </div>

    {error && <div className="mt-6 rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/8 p-4 text-sm font-semibold text-[var(--danger)]">{error}</div>}

    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, count, Icon, style }) => <div key={label} className="card card-pad"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-[var(--muted)]">{label}</p><p className="mt-2 text-3xl font-black text-[var(--navy)]">{count}</p></div><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style}`}><Icon className="h-5 w-5" /></div></div></div>)}</section>

    <section className="card card-pad mt-6"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)] text-xl font-black text-white">{(company?.name || "O")[0]?.toUpperCase()}</div><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted-light)]">Unternehmen</p><h2 className="mt-1 text-xl font-black text-[var(--navy)]">{company?.name || "Ihr Unternehmen"}</h2><p className="mt-1 text-sm text-[var(--muted)]">{company?.industry || "Branche noch nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p></div></div><Link href="/arbeitgeber/firma" className="btn-ghost">Unternehmensprofil bearbeiten<ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>

    <section className="hero-navy mt-6 !p-8 sm:!p-10"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Nächster Schritt</p><h2 className="mt-3 text-3xl font-black tracking-[-0.035em]">Kandidaten finden</h2><p className="mt-3 max-w-2xl leading-7 text-blue-100/90">Beruf, Erfahrung, Skills, Ort, Pensum und weitere Kriterien eingeben und passende Arbeitnehmer entdecken.</p></div><Link href="/arbeitgeber/suche" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-[var(--navy)] transition hover:bg-slate-100">Suche starten<ArrowRight className="h-4 w-4" /></Link></div></section>

    <section className="mt-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand)]">Kommunikation</p><h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[var(--navy)]">Anfragen &amp; Nachrichten</h2><p className="mt-2 text-[var(--muted)]">Arbeitgeber links, Arbeitnehmer rechts. Kontaktdaten werden erst nach Annahme freigegeben.</p></div>{requests.length > 0 && <div className="flex items-center gap-2 text-sm font-bold text-[var(--muted-light)]"><Users className="h-4 w-4" />{requests.length} Anfrage{requests.length !== 1 ? "n" : ""}</div>}</div>
      {requests.length === 0 ? <div className="mt-6 rounded-[28px] border border-dashed border-[var(--line-strong)] bg-white p-12 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]"><MessageCircle className="h-7 w-7" /></div><h3 className="mt-5 text-xl font-black text-[var(--navy)]">Noch keine Kontaktanfragen</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">Wenn Sie einen passenden Arbeitnehmer gefunden haben, können Sie über dessen Profil eine Kontaktanfrage senden.</p><Link href="/arbeitgeber/suche" className="btn-primary mt-6 inline-flex">Kandidaten suchen<ArrowRight className="h-4 w-4" /></Link></div> : <div className="mt-6 space-y-3">{requests.map((request) => { const employee = getEmployee(request.employee_id); const name = getEmployeeName(request.employee_id); const accepted = request.status === "accepted"; return <div key={request.id} className={`rounded-[24px] border bg-white p-5 shadow-sm transition-all hover:shadow-md ${accepted ? "border-emerald-200 ring-1 ring-emerald-100" : "border-[var(--line)]"}`}><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-lg font-black text-white">{getInitials(request.employee_id)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-[var(--navy)]">{name}</h3>{accepted && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"><Check className="h-3 w-3" />Angenommen</span>}{request.status === "pending" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700"><Clock3 className="h-3 w-3" />Ausstehend</span>}{request.status === "rejected" && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600"><X className="h-3 w-3" />Abgelehnt</span>}</div><p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{getEmployeeProfession(request.employee_id)}</p><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted-light)]">{getEmployeeLocation(request.employee_id) && <span>{getEmployeeLocation(request.employee_id)}</span>}<span>Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</span></div>{accepted && employee && (employee.email || employee.phone) && <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold"><span className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">📧 {employee.email || "Keine E-Mail"}</span><span className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">📞 {employee.phone || "Keine Telefonnummer"}</span></div>}</div><div className="flex shrink-0 flex-col gap-2 sm:items-end">{accepted ? <Link href={`/arbeitgeber/anfragen/${request.id}`} className="btn-primary"><MessageCircle className="h-4 w-4" />Chat öffnen<ArrowRight className="h-4 w-4" /></Link> : <Link href={`/arbeitgeber/anfragen/${request.id}`} className="btn-ghost">Anfrage ansehen<ArrowRight className="h-4 w-4" /></Link>}</div></div></div> })}</div>}
    </section>
  </div>
}
