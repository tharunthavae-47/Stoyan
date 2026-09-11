"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { EmployerEntitlements, EmployerPlanId } from "@/lib/plans"

type Filters = { profession: string; city: string; education: string; experience: string; employment: string; salary: string; skill: string }
type Candidate = { id: string; name: string; profession: string; city: string; education: string; experience: number; employment: number; salary: number | null; skills: string[]; avatar: string | null; contactVisible: boolean; score: number; reasons: string[] }
type CandidateRow = { id: string; profession: string | null; education: string | null; years_experience: number | null; desired_employment_percent: number | null; desired_salary_min: number | null; skills: unknown; contact_visible: boolean | null; first_name: string | null; last_name: string | null; city: string | null; avatar_url: string | null }
type RequestStatus = "pending" | "accepted" | "rejected"

const weights = [25, 20, 20, 15, 10, 5, 5]
const labels = ["Beruf", "Erfahrung", "Skills", "Ausbildung", "Pensum", "Lohn", "Ort"]
const emptyFilters: Filters = { profession: "", city: "", education: "", experience: "", employment: "", salary: "", skill: "" }

function calculateMatch(c: Candidate, f: Filters) {
  const values = [f.profession, f.experience, f.skill, f.education, f.employment, f.salary, f.city]
  const checks = [
    !f.profession || c.profession.toLowerCase().includes(f.profession.toLowerCase()),
    !f.experience || c.experience >= Number(f.experience),
    !f.skill || c.skills.some((s) => s.toLowerCase().includes(f.skill.toLowerCase())),
    !f.education || c.education.toLowerCase().includes(f.education.toLowerCase()),
    !f.employment || c.employment >= Number(f.employment),
    !f.salary || !c.salary || c.salary <= Number(f.salary),
    !f.city || c.city.toLowerCase().includes(f.city.toLowerCase()),
  ]
  let possible = 0
  let score = 0
  const reasons: string[] = []
  checks.forEach((ok, i) => { if (!values[i]) return; possible += weights[i]; if (ok) { score += weights[i]; reasons.push(`${labels[i]} passt`) } })
  return { score: possible ? Math.round((score / possible) * 100) : 0, reasons }
}

function Upgrade({ text = "Diese Funktion ist ab Professional verfügbar." }: { text?: string }) {
  return <div className="mt-2 border-l-2 border-l-[var(--brand)] bg-[var(--brand-soft)] p-3 text-xs font-medium text-[var(--navy)]">{text} <Link className="underline" href="/preise">Abo upgraden</Link></div>
}

export default function EmployerSearch() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [entitlements, setEntitlements] = useState<EmployerEntitlements | null>(null)
  const [plan, setPlan] = useState<EmployerPlanId | null>(null)
  const [loading, setLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [requestStatuses, setRequestStatuses] = useState<Record<string, RequestStatus>>({})
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const subscriptionResponse = await fetch("/api/subscriptions/entitlements", { cache: "no-store" })
        const subscription = await subscriptionResponse.json()
        if (!subscriptionResponse.ok) throw new Error(subscription.error || "Abo konnte nicht geprüft werden.")
        if (!active) return
        setEntitlements(subscription.entitlements)
        setPlan(subscription.plan)
        if (!subscription.entitlements) { setLoading(false); return }

        const supabase = createClient()
        const { data: requests } = await supabase.from("contact_requests").select("id,employee_id,status,created_at").order("created_at", { ascending: false })
        const statuses: Record<string, RequestStatus> = {}
        for (const r of requests || []) if (r.employee_id && !statuses[r.employee_id] && ["pending", "accepted", "rejected"].includes(r.status)) statuses[r.employee_id] = r.status as RequestStatus
        if (active) setRequestStatuses(statuses)

        const { data, error: candidateError } = await supabase.from("employer_candidate_profiles").select("id,profession,education,years_experience,desired_employment_percent,desired_salary_min,skills,contact_visible,first_name,last_name,city,avatar_url")
        if (candidateError) throw new Error(`Kandidaten konnten nicht geladen werden: ${candidateError.message}`)
        const formatted = ((data || []) as CandidateRow[]).map((c) => ({
          id: c.id, name: `${c.first_name || "Kandidat"} ${c.last_name || ""}`.trim(), profession: c.profession || "Beruf nicht angegeben", city: c.city || "", education: c.education || "",
          experience: Number(c.years_experience || 0), employment: Number(c.desired_employment_percent || 100), salary: c.desired_salary_min == null ? null : Number(c.desired_salary_min),
          skills: Array.isArray(c.skills) ? c.skills.filter((s): s is string => typeof s === "string") : [], avatar: c.avatar_url || null, contactVisible: Boolean(c.contact_visible), score: 0, reasons: [],
        }))
        if (active) setCandidates(formatted)
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Die Kandidatensuche konnte nicht geladen werden.") }
      finally { if (active) setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [])

  const allowed = entitlements?.filters
  const setFilter = (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value }))
  const results = useMemo(() => candidates.map((c) => ({ ...c, ...calculateMatch(c, filters) })).filter((c) => {
    const status = requestStatuses[c.id]
    if (status === "pending" || status === "accepted") return false
    return !Object.values(filters).some(Boolean) || c.score >= 40
  }).sort((a, b) => b.score - a.score), [candidates, filters, requestStatuses])

  async function sendContactRequest(employeeId: string) {
    if (!entitlements?.contactRequests || sendingRequestId) return
    setSendingRequestId(employeeId); setError(""); setSuccessMessage("")
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = "/login"; return }
      const { data: employee, error: employeeError } = await supabase.from("employee_profiles").select("id,contact_visible").eq("id", employeeId).maybeSingle()
      if (employeeError) throw new Error(employeeError.message)
      if (!employee?.contact_visible) throw new Error("Dieser Kandidat möchte aktuell nicht kontaktiert werden.")
      const { data: inserted, error: insertError } = await supabase.from("contact_requests").insert({ employer_id: user.id, employee_id: employeeId, job_id: null, status: "pending" }).select("id").single()
      if (insertError) throw new Error(insertError.message)
      setRequestStatuses((s) => ({ ...s, [employeeId]: "pending" }))
      setSuccessMessage("Kontaktanfrage erfolgreich gesendet.")
      await fetch("/api/contact-requests/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId: inserted.id }) })
    } catch (e) { setError(e instanceof Error ? e.message : "Die Anfrage konnte nicht gesendet werden.") }
    finally { setSendingRequestId(null) }
  }

  if (!loading && !entitlements) return <div className="animate-fade-up"><div className="mx-auto max-w-4xl px-6 py-16"><div className="ed-card ed-card-pad text-center"><p className="ed-eyebrow">Arbeitgeber-Abo</p><h1 className="mt-4 text-3xl font-light tracking-tight text-[var(--navy)]">Kandidatensuche freischalten</h1><p className="mx-auto mt-3 max-w-xl leading-relaxed text-[var(--muted)]">Wählen Sie Basic, Professional oder Business. Ohne aktives Arbeitgeber-Abo können keine Kandidatenfunktionen genutzt werden.</p><Link href="/preise" className="ed-btn-primary mt-6 inline-flex">Abo auswählen</Link></div></div></div>

  return <div className="animate-fade-up"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col justify-between gap-4 border-b border-[#e2e7ee] pb-8 sm:flex-row sm:items-end"><div><p className="ed-eyebrow">Kandidatensuche · {plan}</p><h1 className="mt-4 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] text-balance">Finden Sie die passenden Menschen.</h1><p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">Die verfügbaren Suchfunktionen werden automatisch durch Ihr Abo bestimmt.</p></div><Link href="/preise" className="ed-btn-ghost">Abo verwalten</Link></div>
    {error && <div className="alert-error mt-5 text-sm font-medium">{error}</div>}
    {successMessage && <div className="alert-success mt-5 text-sm font-medium">{successMessage}</div>}

    <section className="ed-card ed-card-pad mt-8"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <input value={filters.profession} onChange={(e) => setFilter("profession", e.target.value)} placeholder="Beruf / Position" className="ed-input" />
      <div><input disabled={!allowed?.city} value={filters.city} onChange={(e) => setFilter("city", e.target.value)} placeholder="Ort / PLZ" className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]" />{!allowed?.city && <Upgrade />}</div>
      <div><select disabled={!allowed?.education} value={filters.education} onChange={(e) => setFilter("education", e.target.value)} className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]"><option value="">Ausbildung</option><option>EFZ</option><option>EBA</option><option>HF</option><option>Fachschule</option><option>FH</option><option>Universität</option></select>{!allowed?.education && <Upgrade />}</div>
      <div><select disabled={!allowed?.experience} value={filters.experience} onChange={(e) => setFilter("experience", e.target.value)} className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]"><option value="">Erfahrung</option><option value="1">1+ Jahre</option><option value="3">3+ Jahre</option><option value="5">5+ Jahre</option><option value="10">10+ Jahre</option></select>{!allowed?.experience && <Upgrade />}</div>
      <div><select disabled={!allowed?.employment} value={filters.employment} onChange={(e) => setFilter("employment", e.target.value)} className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]"><option value="">Pensum</option><option value="50">50 % +</option><option value="80">80 % +</option><option value="100">100 %</option></select>{!allowed?.employment && <Upgrade />}</div>
      <div><input disabled={!allowed?.salary} type="number" value={filters.salary} onChange={(e) => setFilter("salary", e.target.value)} placeholder="Max. Wunschlohn CHF" className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]" />{!allowed?.salary && <Upgrade />}</div>
      <div className="lg:col-span-2"><input disabled={!allowed?.skills} value={filters.skill} onChange={(e) => setFilter("skill", e.target.value)} placeholder="Skill, z. B. Diagnose" className="ed-input disabled:bg-[var(--surface-soft)] disabled:text-[var(--muted-light)]" />{!allowed?.skills && <Upgrade />}</div>
    </div><div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setSearched(true)} className="ed-btn-primary">Kandidaten finden</button><button type="button" onClick={() => { setFilters(emptyFilters); setSearched(false) }} className="ed-btn-ghost">Zurücksetzen</button><span className="ml-auto self-center text-sm font-medium text-[var(--muted-light)]">{loading ? "Kandidaten werden geladen…" : `${results.length} Profile`}</span></div></section>

    <section className="mt-8 divide-y divide-[#e2e7ee] border-y border-[#e2e7ee]">{!loading && results.map((c) => { const status = requestStatuses[c.id]; const requestDisabled = !c.contactVisible || sendingRequestId === c.id; return <article key={c.id} className="py-6"><div className="grid gap-6 lg:grid-cols-[300px_1fr_auto] lg:items-center"><div className="flex items-center gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] border border-[#e2e7ee] bg-[var(--surface-soft)]">{c.avatar ? <img src={c.avatar || "/placeholder.svg"} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-2xl font-light text-[var(--muted-light)]">{c.name.charAt(0)}</div>}</div><div><h2 className="text-xl font-normal tracking-tight text-[var(--navy)]">{c.name}</h2><p className="mt-0.5 text-[var(--foreground)]">{c.profession}</p><p className="mt-0.5 text-sm text-[var(--muted-light)]">{c.city || "Ort offen"} · {c.experience} Jahre · {c.employment}%</p></div></div><div><div className="flex flex-wrap gap-2">{c.skills.slice(0, 7).map((s) => <span key={s} className="ed-chip">{s}</span>)}</div><p className="mt-4 text-sm text-[var(--muted)]">{c.reasons.length ? c.reasons.join(" · ") : "Noch keine Suchkriterien ausgewählt."}</p>{!c.contactVisible && <p className="mt-3 text-xs font-medium text-[var(--muted-light)]">Dieser Kandidat möchte aktuell nicht kontaktiert werden.</p>}</div><div className="min-w-[190px] lg:text-right"><div className="text-4xl font-light tracking-tight text-[var(--brand)]">{searched && entitlements?.matchPercentage ? `${c.score}%` : "—"}</div><p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">{searched ? "Match" : "Profil"}</p><div className="mt-4 flex flex-col gap-2"><Link href={`/arbeitgeber/kandidat/${c.id}`} className="rounded-[4px] bg-[var(--navy)] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90">Profil ansehen</Link><button type="button" onClick={() => void sendContactRequest(c.id)} disabled={requestDisabled} className="rounded-[4px] bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{sendingRequestId === c.id ? "Wird gesendet…" : status === "rejected" ? "Erneut anfragen" : "Anfrage senden"}</button>{!entitlements?.chat && <Upgrade text="Direkter Chat ist ab Professional verfügbar." />}</div></div></div></article> })}{!loading && !results.length && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><h3 className="text-xl font-black">Keine passenden Profile gefunden</h3><p className="mt-2 text-slate-500">Passen Sie Ihre Suchkriterien an.</p></div>}</section>
  </div></div>
}
