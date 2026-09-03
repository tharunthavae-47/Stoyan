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
  return <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs font-semibold text-blue-800">{text} <Link className="underline" href="/preise">Abo upgraden</Link></div>
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

  if (!loading && !entitlements) return <div className="animate-fade-up"><div className="mx-auto max-w-4xl px-6 py-16"><div className="card card-pad text-center"><p className="text-sm font-black uppercase tracking-widest text-blue-600">Arbeitgeber-Abo</p><h1 className="mt-3 text-3xl font-black text-[var(--navy)]">Kandidatensuche freischalten</h1><p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">Wählen Sie Basic, Professional oder Business. Ohne aktives Arbeitgeber-Abo können keine Kandidatenfunktionen genutzt werden.</p><Link href="/preise" className="btn-primary mt-6 inline-flex">Abo auswählen</Link></div></div></div>

  return <div className="animate-fade-up"><div className="mx-auto max-w-7xl px-6 py-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-black uppercase tracking-widest text-blue-600">Kandidatensuche · {plan}</p><h1 className="mt-2 text-4xl font-black tracking-tight">Finden Sie die passenden Menschen.</h1><p className="mt-3 max-w-2xl text-slate-600">Die verfügbaren Suchfunktionen werden automatisch durch Ihr Abo bestimmt.</p></div><Link href="/preise" className="btn-ghost">Abo verwalten</Link></div>
    {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    {successMessage && <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{successMessage}</div>}

    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <input value={filters.profession} onChange={(e) => setFilter("profession", e.target.value)} placeholder="Beruf / Position" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
      <div><input disabled={!allowed?.city} value={filters.city} onChange={(e) => setFilter("city", e.target.value)} placeholder="Ort / PLZ" className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400" />{!allowed?.city && <Upgrade />}</div>
      <div><select disabled={!allowed?.education} value={filters.education} onChange={(e) => setFilter("education", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400"><option value="">Ausbildung</option><option>EFZ</option><option>EBA</option><option>HF</option><option>Fachschule</option><option>FH</option><option>Universität</option></select>{!allowed?.education && <Upgrade />}</div>
      <div><select disabled={!allowed?.experience} value={filters.experience} onChange={(e) => setFilter("experience", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400"><option value="">Erfahrung</option><option value="1">1+ Jahre</option><option value="3">3+ Jahre</option><option value="5">5+ Jahre</option><option value="10">10+ Jahre</option></select>{!allowed?.experience && <Upgrade />}</div>
      <div><select disabled={!allowed?.employment} value={filters.employment} onChange={(e) => setFilter("employment", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400"><option value="">Pensum</option><option value="50">50 % +</option><option value="80">80 % +</option><option value="100">100 %</option></select>{!allowed?.employment && <Upgrade />}</div>
      <div><input disabled={!allowed?.salary} type="number" value={filters.salary} onChange={(e) => setFilter("salary", e.target.value)} placeholder="Max. Wunschlohn CHF" className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400" />{!allowed?.salary && <Upgrade />}</div>
      <div className="lg:col-span-2"><input disabled={!allowed?.skills} value={filters.skill} onChange={(e) => setFilter("skill", e.target.value)} placeholder="Skill, z. B. Diagnose" className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400" />{!allowed?.skills && <Upgrade />}</div>
    </div><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => setSearched(true)} className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-700">Kandidaten finden</button><button type="button" onClick={() => { setFilters(emptyFilters); setSearched(false) }} className="rounded-xl border border-slate-200 px-6 py-3.5 font-bold">Zurücksetzen</button><span className="ml-auto self-center text-sm font-semibold text-slate-500">{loading ? "Kandidaten werden geladen…" : `${results.length} Profile`}</span></div></section>

    <section className="mt-10 space-y-4">{!loading && results.map((c) => { const status = requestStatuses[c.id]; const requestDisabled = !c.contactVisible || sendingRequestId === c.id; return <article key={c.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-6 lg:grid-cols-[300px_1fr_auto] lg:items-center"><div className="flex items-center gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">{c.avatar ? <img src={c.avatar} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-2xl font-black text-slate-300">{c.name.charAt(0)}</div>}</div><div><h2 className="text-xl font-black">{c.name}</h2><p className="font-semibold">{c.profession}</p><p className="text-sm text-slate-500">{c.city || "Ort offen"} · {c.experience} Jahre · {c.employment}%</p></div></div><div><div className="flex flex-wrap gap-2">{c.skills.slice(0, 7).map((s) => <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{s}</span>)}</div><p className="mt-4 text-sm text-slate-500">{c.reasons.length ? c.reasons.join(" · ") : "Noch keine Suchkriterien ausgewählt."}</p>{!c.contactVisible && <p className="mt-3 text-xs font-semibold text-slate-400">Dieser Kandidat möchte aktuell nicht kontaktiert werden.</p>}</div><div className="min-w-[190px] text-right"><div className="text-4xl font-black text-blue-600">{searched && entitlements?.matchPercentage ? `${c.score}%` : "—"}</div><p className="text-xs font-black uppercase tracking-wider text-slate-400">{searched ? "Match" : "Profil"}</p><div className="mt-4 flex flex-col gap-2"><Link href={`/arbeitgeber/kandidat/${c.id}`} className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-slate-800">Profil ansehen</Link><button type="button" onClick={() => void sendContactRequest(c.id)} disabled={requestDisabled} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{sendingRequestId === c.id ? "Wird gesendet…" : status === "rejected" ? "Erneut anfragen" : "Anfrage senden"}</button>{!entitlements?.chat && <Upgrade text="Direkter Chat ist ab Professional verfügbar." />}</div></div></div></article> })}{!loading && !results.length && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><h3 className="text-xl font-black">Keine passenden Profile gefunden</h3><p className="mt-2 text-slate-500">Passen Sie Ihre Suchkriterien an.</p></div>}</section>
  </div></div>
}
