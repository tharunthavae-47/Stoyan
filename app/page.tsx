import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Check,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

const steps = [
  { number: "01", title: "Profil erstellen", text: "Erstelle ein professionelles Profil mit deinen Erfahrungen, Skills und Vorstellungen.", icon: Users },
  { number: "02", title: "Passende Menschen finden", text: "jobmatch24 vergleicht Anforderungen und Profile und zeigt dir passende Matches.", icon: Search },
  { number: "03", title: "Kontakt aufnehmen", text: "Bei Interesse kann eine private Kontaktanfrage gesendet werden.", icon: MessageCircle },
]

const employeeBenefits = [
  "Professionelles Arbeitnehmerprofil",
  "Von passenden Arbeitgebern gefunden werden",
  "Intelligentes Matching",
  "Private Kontaktanfragen",
  "Direkter Chat nach Annahme",
]

const employerBenefits = [
  "Kandidaten gezielt suchen",
  "Matching-Prozent anzeigen",
  "Profile detailliert ansehen",
  "Kontaktanfragen senden",
  "Direkter Chat nach Annahme",
]

const matchValues = [
  ["94%", "Gesamt-Match"],
  ["100%", "Beruf"],
  ["95%", "Erfahrung"],
  ["90%", "Skills"],
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-[-200px] top-[300px] h-[450px] w-[450px] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Die moderne Plattform für Arbeit
              </div>
              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
                Menschen und
                <span className="block text-blue-600">Unternehmen.</span>
                Besser verbunden.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                jobmatch24 bringt Arbeitnehmer und Arbeitgeber zusammen. Professionelle Profile, intelligentes Matching und direkte Kommunikation – einfach und transparent.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/registrieren?role=employee" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20">
                  Als Arbeitnehmer starten <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/registrieren?role=employer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                  Für Arbeitgeber <Building2 className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Professionelle Profile</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Intelligentes Matching</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Private Kommunikation</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[36px] bg-blue-500/10 blur-2xl" />
              <div className="relative rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_rgba(15,23,42,0.10)] sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">jobmatch24 MATCHING</p>
                    <h2 className="mt-1 text-xl font-black">Passende Kandidaten</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Search className="h-5 w-5" /></div>
                </div>

                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">TT</div>
                    <div className="min-w-0 flex-1"><p className="font-black">Tharun Thava</p><p className="text-sm text-slate-500">Prozesstechniker</p></div>
                    <div className="text-right"><p className="text-xl font-black text-blue-600">94%</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</p></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Diagnose", "Service", "Mechanik"].map((skill) => <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{skill}</span>)}
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">ST</div>
                    <div className="min-w-0 flex-1"><p className="font-black">Stoyan Tanovski</p><p className="text-sm text-slate-500">Automobil-Fachmann</p></div>
                    <div className="text-right"><p className="text-xl font-black text-blue-600">88%</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</p></div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white">
                  <div><p className="text-sm font-bold">Intelligentes Matching</p><p className="mt-1 text-xs text-slate-400">Anforderungen automatisch vergleichen</p></div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600"><Check className="h-4 w-4" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ueber-stoyan" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Über jobmatch24</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Arbeitssuche darf<span className="block text-blue-600">einfacher sein.</span></h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-600">jobmatch24 verbindet Menschen und Unternehmen auf einer modernen Plattform. Statt unübersichtlicher Bewerbungen und endloser Suche steht bei uns die passende Verbindung im Mittelpunkt.</p>
              <p className="mt-5 text-lg leading-8 text-slate-600">Arbeitnehmer präsentieren ihre Fähigkeiten. Arbeitgeber definieren ihre Anforderungen. Unser Matching hilft dabei, beide Seiten zusammenzubringen.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="so-funktioniert" className="bg-[#f7f9fc]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">So funktioniert&apos;s</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Drei Schritte.<span className="block text-slate-400">Eine bessere Verbindung.</span></h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => { const Icon = step.icon; return <div key={step.number} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between"><span className="text-sm font-black text-blue-600">{step.number}</span><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></div></div><h3 className="mt-8 text-xl font-black">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p></div> })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            <div id="arbeitnehmer" className="relative overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">Für Arbeitnehmer</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Zeige, was du<span className="block text-blue-400">kannst.</span></h2>
                <p className="mt-5 max-w-lg leading-7 text-slate-300">Erstelle dein professionelles Profil und werde von passenden Arbeitgebern gefunden.</p>
                <div className="mt-7 space-y-3">{employeeBenefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-200"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600"><Check className="h-3.5 w-3.5" /></div>{benefit}</div>)}</div>
                <Link href="/registrieren?role=employee" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-blue-50">Profil erstellen <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>

            <div id="arbeitgeber" className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Für Arbeitgeber</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Finde Menschen,<span className="block text-blue-600">die wirklich passen.</span></h2>
                <p className="mt-5 max-w-lg leading-7 text-slate-600">Definiere deine Anforderungen und entdecke qualifizierte Kandidaten, die zu deinem Unternehmen passen.</p>
                <div className="mt-7 space-y-3">{employerBenefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Check className="h-3.5 w-3.5" /></div>{benefit}</div>)}</div>
                <Link href="/registrieren?role=employer" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-600">Kandidaten finden <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="matching" className="bg-[#f7f9fc]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Sparkles className="h-6 w-6" /></div>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-blue-600">Matching</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Nicht einfach irgendein<span className="block text-blue-600">Match.</span></h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">jobmatch24 bewertet verschiedene Kriterien wie Beruf, Erfahrung, Skills, Ausbildung, Pensum, Lohn und Ort. Dadurch wird sichtbar, wie gut ein Profil zu den Anforderungen passt.</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{matchValues.map(([value, label]) => <div key={label} className="rounded-2xl bg-slate-50 p-5 text-center"><p className="text-3xl font-black text-blue-600">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p></div>)}</div>
            <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600"><Check className="h-5 w-5" /></div><div><p className="font-black">Warum passt dieser Kandidat?</p><p className="mt-1 text-sm text-slate-400">Beruf passt · Erfahrung passt · Skills passen · Ort passt</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="relative overflow-hidden rounded-[30px] bg-blue-600 px-7 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute left-1/2 top-[-180px] h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">Bereit für den nächsten Schritt?</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Starte jetzt mit jobmatch24</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">Erstelle dein Profil oder registriere dein Unternehmen und entdecke neue Möglichkeiten.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/registrieren?role=employee" className="rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50">Als Arbeitnehmer starten</Link>
                <Link href="/registrieren?role=employer" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20">Als Arbeitgeber starten</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-black tracking-[-0.04em]">jobmatch24</div>
              <p className="mt-1 text-sm text-slate-500">Menschen verbinden.</p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-400">
              <Link href="/login" className="transition hover:text-white">Einloggen</Link>
              <Link href="/registrieren" className="transition hover:text-white">Registrieren</Link>
              <Link href="/arbeitnehmer" className="transition hover:text-white">Arbeitnehmer</Link>
              <Link href="/arbeitgeber" className="transition hover:text-white">Arbeitgeber</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-600">© {new Date().getFullYear()} jobmatch24. Alle Rechte vorbehalten.</div>
        </div>
      </footer>
    </main>
  )
}
