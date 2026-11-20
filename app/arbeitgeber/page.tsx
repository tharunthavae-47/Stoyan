"use client"

import Link from "next/link"
import { useEffect, useState, type ComponentType } from "react"
import { ArrowRight, Building2, Check, Clock3, MessageCircle, RefreshCw, Search, Send, Users, X, type LucideProps } from "lucide-react"
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

  if (loading) return <div className="dash-card dash-card-pad py-16 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" /><p className="mt-5 text-[var(--muted)]">Dashboard wird geladen…</p></div>

  return <div className="animate-fade-up space-y-6">
    <section className="dash-hero">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">Willkommen zurück</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{company?.name ? `${company.name}, finden Sie Ihre nächsten Talente.` : "Finden Sie Ihre nächsten Talente."}</h1>
          <p className="mt-3 leading-relaxed text-blue-100/85">Suchen Sie nach Beruf, Erfahrung, Skills, Ort und Pensum – und kontaktieren Sie passende Arbeitnehmer direkt.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void loadDashboard(false)} disabled={refreshing} className="dash-btn dash-btn-glass"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />Aktualisieren</button>
          <Link href="/arbeitgeber/suche" className="dash-btn dash-btn-light"><Search className="h-4 w-4" aria-hidden="true" />Kandidaten suchen<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    {error && <div className="alert-error text-sm font-medium" role="alert">{error}</div>}

    <section aria-label="Kennzahlen" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, count, Icon }) => (
        <div key={label} className="dash-card dash-card-pad">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
            <span className="dash-kpi-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--navy)]">{count}</p>
        </div>
      ))}
    </section>

    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <section className="dash-card dash-card-pad" aria-labelledby="requests-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 id="requests-heading" className="text-lg font-semibold tracking-tight text-[var(--navy)]">Anfragen &amp; Nachrichten</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Kontaktdaten werden erst nach Annahme freigegeben.</p>
          </div>
          {requests.length > 0 && <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"><Users className="h-3.5 w-3.5" aria-hidden="true" />{requests.length} Anfrage{requests.length !== 1 ? "n" : ""}</span>}
        </div>

        {requests.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--background-soft)] p-10 text-center">
            <span className="dash-kpi-icon mx-auto"><MessageCircle className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="mt-4 font-semibold text-[var(--navy)]">Noch keine Kontaktanfragen</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">Wenn Sie einen passenden Arbeitnehmer gefunden haben, können Sie über dessen Profil eine Kontaktanfrage senden.</p>
            <Link href="/arbeitgeber/suche" className="dash-btn mt-6">Kandidaten suchen<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {requests.map((request) => {
              const name = getEmployeeName(request.employee_id)
              const isAccepted = request.status === "accepted"
              const location = getEmployeeLocation(request.employee_id)
              return (
                <li key={request.id} className="dash-row">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="dash-avatar">{getInitials(request.employee_id)}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[var(--navy)]">{name}</h3>
                        {isAccepted && <span className="ed-chip ed-chip-green"><Check className="h-3 w-3" aria-hidden="true" />Angenommen</span>}
                        {request.status === "pending" && <span className="ed-chip ed-chip-amber"><Clock3 className="h-3 w-3" aria-hidden="true" />Ausstehend</span>}
                        {request.status === "rejected" && <span className="ed-chip"><X className="h-3 w-3" aria-hidden="true" />Abgelehnt</span>}
                      </div>
                      <p className="mt-1 truncate text-sm text-[var(--muted)]">{getEmployeeProfession(request.employee_id)}{location ? ` · ${location}` : ""}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-light)]">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                    </div>
                  </div>
                  <Link href={`/arbeitgeber/anfragen/${request.id}`} className={`dash-btn shrink-0 ${isAccepted ? "" : "dash-btn-outline"}`}>
                    {isAccepted ? <><MessageCircle className="h-4 w-4" aria-hidden="true" />Chat öffnen</> : <>Ansehen<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <aside className="space-y-6">
        <section className="dash-card dash-card-pad" aria-labelledby="company-heading">
          <div className="flex items-center gap-4">
            <div className="dash-avatar h-14 w-14 bg-[var(--navy)] text-xl text-white">{company?.avatar_url ? <img src={company.avatar_url || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : (company?.name || "U")[0]?.toUpperCase()}</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Unternehmen</p>
              <h2 id="company-heading" className="mt-1 truncate text-lg font-semibold text-[var(--navy)]">{company?.name || "Ihr Unternehmen"}</h2>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Branche</dt><dd className="text-right font-medium text-[var(--navy)]">{company?.industry || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Standort</dt><dd className="text-right font-medium text-[var(--navy)]">{company?.city || "—"}</dd></div>
          </dl>
          <Link href="/arbeitgeber/firma" className="dash-btn dash-btn-outline mt-5 w-full"><Building2 className="h-4 w-4" aria-hidden="true" />Firmenprofil bearbeiten</Link>
        </section>

        <section className="dash-card dash-card-pad">
          <span className="dash-kpi-icon"><Search className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className="mt-4 font-semibold text-[var(--navy)]">Tipp: Präzise suchen</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Kombinieren Sie Beruf, Skills und Umkreis, um die Treffer mit dem höchsten Matching-Wert zu sehen.</p>
          <Link href="/arbeitgeber/suche" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline">Zur Suche<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>
      </aside>
    </div>

    <SubscriptionCard />
  </div>
}
