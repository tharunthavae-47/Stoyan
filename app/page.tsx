import Link from "next/link"

const benefits = [
  ["01", "Stellenanzeige erstellen", "Definieren Sie Position, Arbeitsort, Pensum, Lohn, Anforderungen und Benefits in wenigen Schritten."],
  ["02", "Passende Kandidaten finden", "Stoyan bewertet Profile anhand Ihrer Anforderungen und zeigt passende Kandidaten übersichtlich an."],
  ["03", "Schneller einstellen", "Kandidaten vergleichen, Favoriten markieren und direkt Kontakt aufnehmen – alles an einem Ort."],
]

const stats = [
  ["94 %", "Beispiel-Match"],
  ["24/7", "Kandidaten entdecken"],
  ["1", "Plattform für Recruiting"],
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-3xl font-black tracking-tight">Stoyan<span className="text-blue-600">.</span></Link>
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#fuer-arbeitgeber" className="hover:text-blue-600">Für Arbeitgeber</a>
            <a href="#fuer-arbeitnehmer" className="hover:text-blue-600">Für Arbeitnehmer</a>
            <a href="#so-funktionierts" className="hover:text-blue-600">So funktioniert's</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="hidden rounded-lg px-3 py-2 font-semibold hover:bg-slate-50 sm:block">Anmelden</Link>
            <Link href="/registrieren?role=employer" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">Stellenanzeige schalten</Link>
          </div>
        </nav>
      </header>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-2 text-sm font-semibold text-blue-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-blue-600" /> Recruiting neu gedacht</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Finden Sie passende Kandidaten für Ihre <span className="text-blue-600">offenen Stellen.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Erstellen Sie eine professionelle Stellenanzeige und erreichen Sie Arbeitnehmer, deren Erfahrung, Fähigkeiten und Wünsche wirklich zu Ihrem Unternehmen passen.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registrieren?role=employer" className="rounded-lg bg-blue-600 px-6 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700">Stellenanzeige schalten</Link>
              <Link href="/registrieren?role=employee" className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 font-bold hover:bg-slate-50">Jobs suchen</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Einfach starten · Profile vergleichen · passende Talente entdecken</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-slate-200">
            <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85')" }} />
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top-Kandidat</p><p className="mt-1 font-bold">Automobil-Mechatroniker</p></div><div className="text-right"><p className="text-2xl font-black text-blue-600">94 %</p><p className="text-xs text-slate-500">Match</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map(([number, label]) => <div key={label} className="px-6 py-8 text-center first:pl-0 last:pr-0"><div className="text-3xl font-black">{number}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>)}
        </div>
      </section>

      <section id="fuer-arbeitgeber" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm"><div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85')" }} /></div>
          <div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Für Arbeitgeber</p><h2 className="mt-3 text-4xl font-black tracking-tight">Ihr Recruiting. Einfacher, schneller, gezielter.</h2><p className="mt-5 leading-8 text-slate-600">Stoyan verbindet eine klassische Stellenanzeige mit strukturierten Kandidatenprofilen und einem transparenten Matching-System. So sehen Sie nicht nur Bewerbungen, sondern die Kandidaten, die zu Ihren Anforderungen passen.</p><div className="mt-7"><Link href="/registrieren?role=employer" className="font-bold text-blue-600 hover:text-blue-700">Arbeitgeberkonto erstellen →</Link></div></div>
        </div>
      </section>

      <section id="so-funktionierts" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">So funktioniert's</p><h2 className="mt-3 text-4xl font-black tracking-tight">Von der offenen Stelle zum passenden Menschen.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{benefits.map(([number,title,text]) => <div key={number} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="text-sm font-black text-blue-600">{number}</div><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></div>)}</div></div>
      </section>

      <section id="fuer-arbeitnehmer" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="rounded-2xl bg-slate-900 px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-blue-300">Für Arbeitnehmer</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Lassen Sie passende Arbeitgeber Sie finden.</h2><p className="mt-4 leading-7 text-slate-300">Erstellen Sie ein vollständiges Profil mit Beruf, Ausbildung, Skills, Erfahrung, Wunschlohn und Arbeitsort.</p></div><Link href="/registrieren?role=employee" className="mt-8 inline-block rounded-lg bg-white px-6 py-3.5 font-bold text-slate-900 hover:bg-slate-100 lg:mt-0">Arbeitnehmerkonto erstellen</Link></div>
      </section>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="font-black text-slate-900">Stoyan<span className="text-blue-600">.</span></div><div>Die Matching-Plattform für Arbeitnehmer und Arbeitgeber.</div></div></footer>
    </main>
  )
}
