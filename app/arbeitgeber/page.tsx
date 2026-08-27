"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

const demoCandidates = [
  { name: "Max Muster", profession: "Automobil-Mechatroniker EFZ", city: "Luzern", experience: 6, education: "EFZ", skills: ["BMW", "Diagnose", "MFK"], employment: 100, salary: 6200, score: 96, image: "/images/employee.svg" },
  { name: "Peter Meier", profession: "Automobil-Diagnostiker", city: "Kriens", experience: 4, education: "EFZ", skills: ["Diagnose", "Service", "Mercedes"], employment: 100, salary: 5800, score: 91, image: "/images/employee.svg" },
  { name: "Daniel Müller", profession: "Automobil-Mechatroniker", city: "Emmen", experience: 3, education: "EFZ", skills: ["BMW", "Reparatur", "Service"], employment: 80, salary: 5900, score: 87, image: "/images/employee.svg" },
]

export default function EmployerPage() {
  const [profession, setProfession] = useState("")
  const [city, setCity] = useState("")
  const [minExperience, setMinExperience] = useState("0")
  const [employment, setEmployment] = useState("0")
  const [education, setEducation] = useState("")
  const [skill, setSkill] = useState("")
  const [searched, setSearched] = useState(false)

  const results = useMemo(() => {
    return [...demoCandidates].filter((candidate) => {
      if (profession && !candidate.profession.toLowerCase().includes(profession.toLowerCase())) return false
      if (city && !candidate.city.toLowerCase().includes(city.toLowerCase())) return false
      if (Number(minExperience) > candidate.experience) return false
      if (employment && Number(employment) > candidate.employment) return false
      if (education && candidate.education !== education) return false
      if (skill && !candidate.skills.some((item) => item.toLowerCase().includes(skill.toLowerCase()))) return false
      return true
    }).sort((a, b) => b.score - a.score)
  }, [profession, city, minExperience, employment, education, skill])

  function contact(name: string) {
    alert(`Kontaktanfrage für ${name} – das Nachrichtensystem wird als nächster Schritt mit Supabase verbunden.`)
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black">Stoyan<span className="text-blue-600">.</span></Link>
          <nav className="hidden gap-8 text-sm font-semibold text-slate-600 md:flex"><Link href="/arbeitgeber">Kandidaten</Link><Link href="/arbeitgeber">Stellen</Link><Link href="#firma">Unternehmen</Link></nav>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold">Dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8"><p className="text-sm font-black uppercase tracking-[.16em] text-blue-600">Arbeitgeber</p><h1 className="mt-2 text-4xl font-black tracking-tight">Finden Sie passende Arbeitnehmer</h1><p className="mt-3 max-w-2xl text-slate-600">Geben Sie Ihre Anforderungen ein. Stoyan zeigt Ihnen passende Profile und sortiert sie nach Match.</p></div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Beruf / Position"><input value={profession} onChange={e=>setProfession(e.target.value)} placeholder="z. B. Automobil-Mechatroniker" className="input" /></Field>
            <Field label="Ort"><input value={city} onChange={e=>setCity(e.target.value)} placeholder="z. B. Luzern" className="input" /></Field>
            <Field label="Mindest-Erfahrung"><select value={minExperience} onChange={e=>setMinExperience(e.target.value)} className="input"><option value="0">Keine Vorgabe</option><option value="1">1+ Jahre</option><option value="3">3+ Jahre</option><option value="5">5+ Jahre</option><option value="7">7+ Jahre</option></select></Field>
            <Field label="Ausbildung"><select value={education} onChange={e=>setEducation(e.target.value)} className="input"><option value="">Keine Vorgabe</option><option>EFZ</option><option>EBA</option><option>Höhere Fachschule</option><option>Universität / FH</option></select></Field>
            <Field label="Mindest-Pensum"><select value={employment} onChange={e=>setEmployment(e.target.value)} className="input"><option value="0">Keine Vorgabe</option><option value="50">50 %</option><option value="80">80 %</option><option value="100">100 %</option></select></Field>
            <Field label="Skill"><input value={skill} onChange={e=>setSkill(e.target.value)} placeholder="z. B. Diagnose, BMW" className="input" /></Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-6"><button onClick={()=>setSearched(true)} className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-700">Kandidaten finden</button><button onClick={()=>{setProfession("");setCity("");setMinExperience("0");setEmployment("0");setEducation("");setSkill("");setSearched(false)}} className="rounded-xl border border-slate-300 px-6 py-3.5 font-bold">Filter zurücksetzen</button>{searched && <span className="ml-auto text-sm font-semibold text-slate-500">{results.length} passende Profile</span>}</div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Kandidaten</p><h2 className="mt-1 text-2xl font-black">{searched ? "Ihre Matches" : "Beispielhafte Matches"}</h2></div><span className="text-sm font-semibold text-slate-500">Nach Match sortiert</span></div>
          <div className="space-y-4">
            {results.map(candidate => <article key={candidate.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-center"><div className="flex min-w-0 items-center gap-4 lg:w-[360px]"><img src={candidate.image} alt="Kandidatenprofil" className="h-20 w-20 rounded-2xl bg-slate-100 object-cover"/><div className="min-w-0"><h3 className="truncate text-xl font-black">{candidate.name}</h3><p className="truncate font-semibold text-slate-700">{candidate.profession}</p><p className="mt-1 text-sm text-slate-500">{candidate.city} · {candidate.experience} Jahre Erfahrung · {candidate.employment} %</p></div></div><div className="flex-1"><div className="grid gap-3 sm:grid-cols-2"><Metric label="Ausbildung" value={candidate.education}/><Metric label="Erfahrung" value={`${candidate.experience} Jahre`}/><Metric label="Skills" value={candidate.skills.join(" · ")}/><Metric label="Wunschlohn" value={`CHF ${candidate.salary.toLocaleString("de-CH")}`}/></div></div><div className="flex items-center gap-4 lg:flex-col lg:items-end"><div className="text-right"><div className="text-3xl font-black text-blue-600">{candidate.score}%</div><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Match</div></div><div className="flex gap-2"><Link href="#" onClick={(e)=>e.preventDefault()} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold">Profil ansehen</Link><button onClick={()=>contact(candidate.name)} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Kontaktieren</button></div></div></div></article>)}
            {results.length===0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><h3 className="text-xl font-black">Keine passenden Profile</h3><p className="mt-2 text-slate-500">Passen Sie Ihre Kriterien an und starten Sie die Suche erneut.</p></div>}
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({label, children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>{children}</label>}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-slate-50 p-3"><div className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 text-sm font-bold text-slate-800">{value}</div></div>}
