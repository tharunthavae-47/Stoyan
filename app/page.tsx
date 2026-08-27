import Link from "next/link"

const steps = [
  ["01", "Profil erstellen", "Erfahrung, Ausbildung, Fähigkeiten, Wünsche und Verfügbarkeit einmal hinterlegen."],
  ["02", "Anforderungen definieren", "Arbeitgeber beschreiben Stelle, Qualifikationen, Pensum, Ort und Rahmenbedingungen."],
  ["03", "Passende Menschen finden", "Stoyan vergleicht die Angaben und macht passende Matches transparent."],
]

const categories = [
  ["IT & Technologie", "Software, Support, Data & mehr", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"],
  ["Handwerk", "Technik, Bau, Werkstatt", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85"],
  ["Logistik", "Lager, Transport & Disposition", "https://images.unsplash.com/photo-1586528116493-da8b0c6c8a9d?auto=format&fit=crop&w=900&q=85"],
  ["Büro & Administration", "Administration, Finanzen & HR", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85"],
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-[30px] font-black tracking-[-0.04em]">Stoyan<span className="text-blue-600">.</span></Link>
          <div className="hidden items-center gap-8 text-[15px] font-semibold text-slate-700 lg:flex">
            <a href="#jobs" className="hover:text-blue-600">Jobs</a>
            <a href="#arbeitnehmer" className="hover:text-blue-600">Für Arbeitnehmer</a>
            <a href="#arbeitgeber" className="hover:text-blue-600">Für Arbeitgeber</a>
            <a href="#matching" className="hover:text-blue-600">Matching</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden px-3 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 sm:block">Anmelden</Link>
            <Link href="/registrieren?role=employer" className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">Stelle aufgeben</Link>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-sm font-bold text-blue-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-blue-600" /> Die Job-Matching-Plattform</div>
            <h1 className="max-w-3xl text-[44px] font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">Arbeit finden.<br /><span className="text-blue-600">Menschen finden.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Stoyan bringt Arbeitnehmer und Arbeitgeber zusammen – mit Profilen, Stellen und einem Matching-System, das Anforderungen und Fähigkeiten miteinander vergleicht.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registrieren?role=employee" className="rounded-md bg-blue-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700">Jobs entdecken</Link>
              <Link href="/registrieren?role=employer" className="rounded-md border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-900 transition hover:bg-slate-50">Stelle aufgeben</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500"><span>✓ Kostenloses Profil</span><span>✓ Transparente Matches</span><span>✓ Für Arbeitnehmer & Arbeitgeber</span></div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200"><div className="aspect-[4/3] bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=90')"}} /></div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:left-8 sm:min-w-[300px]"><div className="flex items-center gap-3"><div className="h-11 w-11 rounded-full bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85')"}} /><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Passender Kandidat</p><p className="font-bold">Automobil-Mechatroniker</p></div><div className="ml-auto text-right"><p className="text-2xl font-black text-blue-600">94%</p><p className="text-[11px] font-semibold text-slate-400">Match</p></div></div></div>
          </div>
        </div>
      </section>

      <section id="jobs" className="relative z-20 mx-auto -mt-1 max-w-6xl px-5 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:p-4"><div className="grid gap-2 md:grid-cols-[1.2fr_1fr_auto]"><div className="rounded-xl border border-slate-200 px-5 py-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Was suchst du?</p><p className="mt-1 font-semibold text-slate-800">Beruf, Position oder Stichwort</p></div><div className="rounded-xl border border-slate-200 px-5 py-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Wo?</p><p className="mt-1 font-semibold text-slate-800">Ort oder PLZ</p></div><Link href="/registrieren?role=employee" className="flex items-center justify-center rounded-xl bg-slate-950 px-7 py-4 font-bold text-white hover:bg-slate-800">Jobs suchen</Link></div></div>
      </section>

      <section id="matching" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Matching</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Nicht nur Jobs anzeigen.<br />Die richtigen zusammenbringen.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Arbeitgeber definieren Anforderungen. Arbeitnehmer hinterlegen Fähigkeiten und Wünsche. Stoyan macht daraus nachvollziehbare Matches.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-400">STELLE</p><h3 className="mt-2 text-2xl font-black">Automobil-Mechatroniker EFZ</h3><p className="mt-2 text-slate-400">Luzern · 100 % · Festanstellung</p></div><span className="rounded-full bg-blue-500/15 px-3 py-1.5 text-sm font-black text-blue-300">94 % Match</span></div><div className="mt-9 grid gap-4 sm:grid-cols-2"><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Ausbildung</span><b>100%</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-full rounded-full bg-blue-500" /></div></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Erfahrung</span><b>95%</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[95%] rounded-full bg-blue-500" /></div></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Skills</span><b>92%</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[92%] rounded-full bg-blue-500" /></div></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Arbeitsort</span><b>96%</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[96%] rounded-full bg-blue-500" /></div></div></div></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"><p className="text-sm font-bold uppercase tracking-wider text-slate-400">Warum Stoyan?</p><div className="mt-7 space-y-7"><div><p className="font-black">Strukturierte Profile</p><p className="mt-1 text-sm leading-6 text-slate-500">Qualifikationen, Erfahrung, Skills und Wünsche übersichtlich an einem Ort.</p></div><div><p className="font-black">Transparente Matches</p><p className="mt-1 text-sm leading-6 text-slate-500">Nicht nur eine Zahl – du siehst, welche Kriterien zum Match beitragen.</p></div><div><p className="font-black">Weniger Aufwand</p><p className="mt-1 text-sm leading-6 text-slate-500">Schneller passende Stellen oder Kandidaten finden und vergleichen.</p></div></div></div>
        </div>
      </section>

      <section id="arbeitnehmer" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2"><div className="overflow-hidden rounded-3xl"><div className="aspect-[4/3] bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=90')"}} /></div><div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Für Arbeitnehmer</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Dein Profil soll mehr können als ein Lebenslauf.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Hinterlege deine Ausbildung, Erfahrung, Skills, Wunschposition, Arbeitsort, Pensum und weitere Angaben. So können passende Arbeitgeber dich besser finden.</p><Link href="/registrieren?role=employee" className="mt-7 inline-flex rounded-md bg-slate-950 px-6 py-3.5 font-bold text-white hover:bg-slate-800">Profil erstellen</Link></div></div>
      </section>

      <section id="arbeitgeber" className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Für Arbeitgeber</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Ihre nächste Einstellung beginnt mit der richtigen Stelle.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Erstellen Sie eine strukturierte Stellenanzeige und definieren Sie genau, was Sie suchen. Danach zeigt Stoyan passende Arbeitnehmerprofile.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 p-5"><p className="font-black">Stelle erstellen</p><p className="mt-2 text-sm leading-6 text-slate-500">Anforderungen, Ort, Pensum, Lohn und Benefits.</p></div><div className="rounded-2xl border border-slate-200 p-5"><p className="font-black">Kandidaten vergleichen</p><p className="mt-2 text-sm leading-6 text-slate-500">Matches und Profile übersichtlich prüfen.</p></div></div><Link href="/registrieren?role=employer" className="mt-8 inline-flex rounded-md bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-700">Stellenanzeige schalten</Link></div><div className="overflow-hidden rounded-3xl shadow-xl"><div className="aspect-[4/3] bg-cover bg-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=90')"}} /></div></div></section>

      <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Branchen</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em]">Finde deine Richtung.</h2></div><Link href="/registrieren?role=employee" className="font-bold text-blue-600">Alle Jobs ansehen →</Link></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{categories.map(([title,desc,image])=><div key={title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-105" style={{backgroundImage:`url('${image}')`}} /><div className="p-5"><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-slate-500">{desc}</p></div></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="relative overflow-hidden rounded-3xl bg-blue-600 px-7 py-14 text-white sm:px-12 sm:py-16"><div className="relative z-10 max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-100">Stoyan</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Bereit für den nächsten Schritt?</h2><p className="mt-5 text-lg leading-8 text-blue-50">Erstelle dein Profil oder veröffentliche deine erste Stelle.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/registrieren?role=employee" className="rounded-md bg-white px-6 py-3.5 font-bold text-slate-950 hover:bg-slate-100">Als Arbeitnehmer starten</Link><Link href="/registrieren?role=employer" className="rounded-md border border-white/40 px-6 py-3.5 font-bold text-white hover:bg-white/10">Als Arbeitgeber starten</Link></div></div></div></section>

      <footer className="border-t border-slate-200"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-9 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><Link href="/" className="text-xl font-black text-slate-950">Stoyan<span className="text-blue-600">.</span></Link><p>Die Matching-Plattform für Arbeitnehmer und Arbeitgeber.</p></div></footer>
    </main>
  )
}
