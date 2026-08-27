"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Filters = { profession: string; city: string; education: string; experience: string; employment: string; salary: string; skill: string }
type Candidate = { id: string; name: string; profession: string; city: string; education: string; experience: number; employment: number; salary: number | null; skills: string[]; avatar: string | null; contactVisible: boolean }
type SupabaseProfile = { id: string; first_name: string | null; last_name: string | null; city: string | null; avatar_url: string | null }
const weights = [25, 20, 20, 15, 10, 5, 5]
const labels = ["Beruf", "Erfahrung", "Skills", "Ausbildung", "Pensum", "Lohn", "Ort"]

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
  checks.forEach((ok, i) => {
    if (!values[i]) return
    possible += weights[i]
    if (ok) {
      score += weights[i]
      reasons.push(`${labels[i]} passt`)
    }
  })
  return { score: possible ? Math.round((score / possible) * 100) : 0, reasons }
}

export default function EmployerSearch() {
  const [filters, setFilters] = useState<Filters>({ profession: "", city: "", education: "", experience: "", employment: "", salary: "", skill: "" })
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = "/login"; return }
      const { data, error: employeeError } = await supabase.from("employee_profiles").select("id,profession,education,years_experience,desired_employment_percent,desired_salary_min,skills,profile_visible,contact_visible").eq("profile_visible", true)
      if (employeeError) { setError(employeeError.message); setLoading(false); return }
      const ids = (data || []).map((x) => x.id)
      const profiles: SupabaseProfile[] = ids.length ? (((await supabase.from("profiles").select("id,first_name,last_name,city,avatar_url").in("id", ids)).data || []) as SupabaseProfile[]) : []
      const byId = new Map<string, SupabaseProfile>(profiles.map((x) => [x.id, x]))
      setCandidates((data || []).map((x) => {
        const p: SupabaseProfile | undefined = byId.get(x.id)
        return {
          id: x.id,
          name: `${p?.first_name || "Kandidat"} ${p?.last_name || ""}`.trim(),
          profession: x.profession || "Beruf nicht angegeben",
          city: p?.city || "",
          education: x.education || "",
          experience: Number(x.years_experience || 0),
          employment: Number(x.desired_employment_percent || 100),
          salary: x.desired_salary_min ? Number(x.desired_salary_min) : null,
          skills: x.skills || [],
          avatar: p?.avatar_url || null,
          contactVisible: Boolean(x.contact_visible),
        }
      }))
      setLoading(false)
    })()
  }, [])

  const results = useMemo(() => {
    const active = Object.values(filters).some(Boolean)
    return candidates
      .map((c) => ({ ...c, ...calculateMatch(c, filters) }))
      .filter((c) => !active || c.score >= 40)
      .sort((a, b) => b.score - a.score)
  }, [candidates, filters])

  const reset = () => { setFilters({ profession: "", city: "", education: "", experience: "", employment: "", salary: "", skill: "" }); setSearched(false) }

  return <main className="min-h-screen bg-[#f7f8fa]"><header className="border-b bg-white"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"><Link href="/arbeitgeber" className="text-2xl font-black">Stoyan<span className="text-blue-600">.</span></Link><div className="flex gap-6 text-sm font-semibold"><Link href="/arbeitgeber/suche" className="text-blue-600">Kandidaten</Link><Link href="/arbeitgeber/firma">Unternehmen</Link></div><Link href="/dashboard" className="rounded-lg border px-4 py-2 text-sm font-bold">Dashboard</Link></div></header><div className="mx-auto max-w-7xl px-6 py-10"><p className="text-sm font-black uppercase tracking-widest text-blue-600">Kandidatensuche</p><h1 className="mt-2 text-4xl font-black tracking-tight">Finden Sie die passenden Menschen.</h1><p className="mt-3 max-w-2xl text-slate-600">Definieren Sie Ihre Anforderungen. Stoyan bewertet sichtbare Profile und zeigt nachvollziehbar, warum ein Kandidat passt.</p><section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><input value={filters.profession} onChange={e=>setFilters(f=>({...f,profession:e.target.value}))} placeholder="Beruf / Position" className="rounded-xl border px-4 py-3"/><input value={filters.city} onChange={e=>setFilters(f=>({...f,city:e.target.value}))} placeholder="Ort / PLZ" className="rounded-xl border px-4 py-3"/><select value={filters.education} onChange={e=>setFilters(f=>({...f,education:e.target.value}))} className="rounded-xl border px-4 py-3"><option value="">Ausbildung</option><option>EFZ</option><option>EBA</option><option>Fachschule</option><option>FH</option><option>Universität</option></select><select value={filters.experience} onChange={e=>setFilters(f=>({...f,experience:e.target.value}))} className="rounded-xl border px-4 py-3"><option value="">Erfahrung</option><option value="1">1+ Jahre</option><option value="3">3+ Jahre</option><option value="5">5+ Jahre</option><option value="10">10+ Jahre</option></select><select value={filters.employment} onChange={e=>setFilters(f=>({...f,employment:e.target.value}))} className="rounded-xl border px-4 py-3"><option value="">Pensum</option><option value="50">50 %+ </option><option value="80">80 %+ </option><option value="100">100 %</option></select><input type="number" value={filters.salary} onChange={e=>setFilters(f=>({...f,salary:e.target.value}))} placeholder="Max. Wunschlohn CHF" className="rounded-xl border px-4 py-3"/><input value={filters.skill} onChange={e=>setFilters(f=>({...f,skill:e.target.value}))} placeholder="Skill, z. B. Diagnose" className="rounded-xl border px-4 py-3 lg:col-span-2"/></div><div className="mt-5 flex flex-wrap gap-3"><button onClick={()=>setSearched(true)} className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white">Kandidaten finden</button><button onClick={reset} className="rounded-xl border px-6 py-3.5 font-bold">Zurücksetzen</button><span className="ml-auto self-center text-sm font-semibold text-slate-500">{loading?"Kandidaten werden geladen…":searched?`${results.length} passende Profile`:`${results.length} sichtbare Profile`}</span></div></section>{error&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<section className="mt-10 space-y-4">{results.map(c=><article key={c.id} className="rounded-3xl border bg-white p-6 shadow-sm"><div className="grid gap-6 lg:grid-cols-[300px_1fr_auto] lg:items-center"><div className="flex items-center gap-4"><div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">{c.avatar?<img src={c.avatar} alt="Profilbild" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-2xl font-black text-slate-300">{c.name[0]}</div>}</div><div><h2 className="text-xl font-black">{c.name}</h2><p className="font-semibold">{c.profession}</p><p className="text-sm text-slate-500">{c.city||"Ort offen"} · {c.experience} Jahre · {c.employment}%</p></div></div><div><div className="flex flex-wrap gap-2">{c.skills.slice(0,7).map(s=><span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{s}</span>)}</div><p className="mt-4 text-sm text-slate-500">{c.reasons.length?c.reasons.join(" · "):"Noch keine Suchkriterien ausgewählt."}</p></div><div className="text-right"><div className="text-4xl font-black text-blue-600">{searched?`${c.score}%`:"—"}</div><p className="text-xs font-black uppercase tracking-wider text-slate-400">{searched?"Match":"Profil"}</p><Link href={`/arbeitgeber/kandidat/${c.id}`} className="mt-4 inline-block rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Profil ansehen</Link></div></div></article>)}{!loading&&!results.length&&<div className="rounded-3xl border border-dashed bg-white p-10 text-center"><h3 className="text-xl font-black">Keine passenden Profile gefunden</h3><p className="mt-2 text-slate-500">Reduzieren Sie einige Kriterien und versuchen Sie es erneut.</p></div>}</section></div></main>}
