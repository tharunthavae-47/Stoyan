import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SiteHeader } from "@/components/site-header"

const benefits = [
  ["Professionelle Profile", "Erfahrung, Ausbildung, Skills und Persönlichkeit übersichtlich an einem Ort."],
  ["Gezielte Suche", "Unternehmen definieren ihre Anforderungen und finden passende Fachkräfte."],
  ["Intelligentes Matching", "Stoyan vergleicht relevante Kriterien und macht passende Möglichkeiten sichtbar."],
]

const steps = [
  ["01", "Profil erstellen", "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Skills und persönliche Wünsche."],
  ["02", "Anforderungen definieren", "Unternehmen legen Beruf, Standort, Erfahrung, Pensum und gewünschte Skills fest."],
  ["03", "Passende Menschen finden", "Stoyan vergleicht die Angaben und zeigt passende Kandidaten nachvollziehbar an."],
]

const employeeFeatures = [
  "Profilbild & persönliche Bilder",
  "Ausbildung & Berufserfahrung",
  "Skills & Sprachen",
  "Wunschlohn & Pensum",
  "Arbeitsort & Umkreis",
  "Verfügbarkeit",
]

const employerCriteria = [
  ["Beruf", "Automobil-Mechatroniker"],
  ["Standort", "Luzern + 30 km"],
  ["Erfahrung", "5+ Jahre"],
  ["Pensum", "80–100 %"],
  ["Skills", "Diagnose · BMW · MFK"],
  ["Match", "92 %"],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
     <SiteHeader />

      <section className="border-b border-slate-200 bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <ScrollReveal>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-2.5 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,.10)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Job Matching Plattform</span>
              </div>
              <h1 className="mt-8 text-5xl font-black leading-[.9] tracking-[-.075em] text-slate-950 sm:text-7xl lg:text-[88px]">Menschen finden.<br /><span className="text-blue-600">Potenzial erkennen.</span></h1>
              <p className="mt-9 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Stoyan verbindet Arbeitnehmer und Unternehmen. Professionelle Profile, gezielte Suche und intelligentes Matching bringen Menschen und Möglichkeiten zusammen.</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/registrieren?role=employee" className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Als Arbeitnehmer starten</Link>
                <Link href="/registrieren?role=employer" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600">Für Unternehmen</Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                {["Professionelle Profile", "Intelligentes Matching", "Für beide Seiten"].map((item) => <span key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-500"><span className="text-blue-600">✓</span>{item}</span>)}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">
            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
              <div className="relative rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_35px_100px_rgba(15,23,42,.11)]">
                <div className="rounded-[27px] bg-slate-50 p-6 sm:p-7">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">STOYAN MATCH</p><p className="mt-1.5 text-lg font-black text-slate-950">Passende Fachkraft</p></div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-blue-100 bg-white text-sm font-black text-blue-600 shadow-sm">92%</div>
                  </div>
                  <div className="mt-7 flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-black text-white">A</div>
                    <div><p className="font-black text-slate-950">Automobil-Mechatroniker</p><p className="mt-1 text-sm text-slate-500">Luzern · 5+ Jahre Erfahrung</p></div>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    {[["Pensum", "80–100 %"], ["Standort", "Luzern"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 text-sm font-bold text-slate-700">{value}</p></div>)}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">{["BMW", "Diagnose", "MFK"].map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">{skill}</span>)}</div>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Match gefunden</p><p className="mt-1 text-sm font-black text-slate-950">Schnell · gezielt · transparent</p></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="ueber-stoyan" className="scroll-mt-28 border-b border-slate-200 bg-slate-50 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading number="01" label="Über STOYAN" title={<>Ein moderner Weg,<br /><span className="text-blue-600">Menschen zu verbinden.</span></>} text="Stoyan schafft eine klare Verbindung zwischen Menschen, die Arbeit suchen, und Unternehmen, die passende Fachkräfte suchen." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {benefits.map(([title, text], i) => <ScrollReveal key={title} className={i === 1 ? "[transition-delay:100ms]" : i === 2 ? "[transition-delay:200ms]" : ""}><article className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"><span className="text-xs font-black text-blue-600">0{i + 1}</span><h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-500">{text}</p></article></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section id="so-funktioniert" className="scroll-mt-28 border-b border-slate-200 bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading number="02" label="So funktioniert's" title={<>Ein klarer Weg.<br /><span className="text-blue-600">Ein passender Match.</span></>} text="Der Prozess bleibt von der Profilerstellung bis zur Kontaktaufnahme einfach, übersichtlich und nachvollziehbar." />
          <div className="mt-12 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-6">
            {steps.map(([number, title, text]) => <ScrollReveal key={number}><div className="grid gap-5 py-8 md:grid-cols-[100px_1fr_1.3fr] md:items-center"><span className="text-4xl font-black tracking-tight text-blue-600">{number}</span><h3 className="text-2xl font-black text-slate-950">{title}</h3><p className="leading-7 text-slate-500">{text}</p></div></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section id="arbeitnehmer" className="scroll-mt-28 border-b border-slate-200 bg-slate-50 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px] rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-14">
          <SectionHeading number="03" label="Arbeitnehmer" title={<>Zeig, wer du bist.<br /><span className="text-blue-600">Nicht nur deinen Lebenslauf.</span></>} text="Erstelle ein professionelles Profil und zeige Unternehmen, was dich ausmacht, was du kannst und wonach du suchst." />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{employeeFeatures.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-black text-blue-600">✓</span>{feature}</div>)}</div>
          <Link href="/registrieren?role=employee" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Profil erstellen</Link>
        </div>
      </section>

      <section id="arbeitgeber" className="scroll-mt-28 border-b border-slate-200 bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px] rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-14">
          <SectionHeading number="04" label="Arbeitgeber" title={<>Finden Sie die<br /><span className="text-blue-600">richtigen Menschen.</span></>} text="Definieren Sie Ihre Anforderungen und finden Sie schneller Arbeitnehmer, die fachlich und persönlich zu Ihrer Stelle passen." />
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">Kandidatensuche</p><p className="mt-1 font-black text-slate-950">Ihre Anforderungen</p></div><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black text-emerald-700">AKTIV</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{employerCriteria.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>)}</div>
            <Link href="/registrieren?role=employer" className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700">Kandidaten suchen</Link>
          </div>
        </div>
      </section>

      <section id="matching" className="scroll-mt-28 border-b border-slate-200 bg-slate-50 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px] rounded-[32px] border border-blue-100 bg-white p-8 text-center shadow-sm sm:p-14">
          <SectionHeading center number="05" label="Matching" title={<>Der richtige Match<br /><span className="text-blue-600">beginnt mit den richtigen Daten.</span></>} text="Stoyan bringt relevante Informationen zusammen und macht passende Chancen für beide Seiten sichtbar." />
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">{[["01", "Profil"], ["02", "Anforderungen"], ["03", "Match"]].map(([number, title]) => <div key={number} className="rounded-2xl border border-slate-200 p-5"><p className="text-3xl font-black text-blue-600">{number}</p><p className="mt-2 font-bold text-slate-900">{title}</p></div>)}</div>
        </div>
      </section>

      <footer className="px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-slate-950">STOYAN</p><p className="mt-1 text-sm text-slate-500">Menschen. Unternehmen. Matching.</p></div><div className="flex gap-5 text-sm font-semibold text-slate-500"><Link href="/login" className="hover:text-blue-600">Login</Link><Link href="/registrieren" className="hover:text-blue-600">Registrieren</Link></div></div></footer>
    </main>
  )
}

function SectionHeading({ number, label, title, text, center = false }: { number: string; label: string; title: React.ReactNode; text: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-4xl text-center" : "max-w-5xl"}>
      <div className={`mb-6 flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-blue-100 px-2 text-[10px] font-black text-blue-600">{number}</span>
        <span className="h-px w-10 bg-slate-300" />
        <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">{label}</span>
      </div>
      <h2 className="text-4xl font-black leading-[.96] tracking-[-.06em] text-slate-950 sm:text-5xl lg:text-6xl">{title}</h2>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">{text}</p>
    </div>
  )
}
