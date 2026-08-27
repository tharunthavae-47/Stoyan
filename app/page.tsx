import Link from "next/link"

const features = [
  ["01", "Strukturierte Profile", "Beruf, Erfahrung, Ausbildung, Skills, Wünsche und Verfügbarkeit an einem Ort."],
  ["02", "Gezielte Suche", "Arbeitgeber definieren Anforderungen und finden Kandidaten, die wirklich dazu passen."],
  ["03", "Transparentes Matching", "Ein nachvollziehbarer Match-Score zeigt, welche Anforderungen erfüllt werden."],
]

const heroImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
const officeImage = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-slate-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight">Stoyan<span className="text-blue-600">.</span></Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#so-funktionierts" className="hover:text-slate-950">So funktioniert's</a>
          <a href="#fuer-wen" className="hover:text-slate-950">Für wen?</a>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-white">Anmelden</Link>
          <Link href="/registrieren" className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800">Registrieren</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Die Matching-Plattform für Arbeit
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Talent trifft auf <span className="text-blue-600">Möglichkeit.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Stoyan bringt Menschen und Unternehmen zusammen – mit vollständigen Profilen, klaren Anforderungen und einem Matching, das verständlich bleibt.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/registrieren?role=employee" className="rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">Job finden</Link>
              <Link href="/registrieren?role=employer" className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50">Mitarbeiter finden</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-500">
              <span>✓ Strukturierte Profile</span><span>✓ Faire Auswahl</span><span>✓ Transparente Matches</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-100/70 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-300">
              <img src={heroImage} alt="Professionelles Team bei der Zusammenarbeit" className="h-[520px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Beispiel-Match</p><p className="mt-1 text-xl font-black">Automobil-Mechatroniker</p><p className="mt-1 text-sm text-slate-500">Luzern · 5 Jahre Erfahrung</p></div>
                  <div className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-white"><div className="text-2xl font-black">94%</div><div className="text-[10px] font-bold uppercase tracking-wider">Match</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="so-funktionierts" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">So funktioniert's</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Weniger suchen. Besser entscheiden.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Stoyan strukturiert die wichtigen Informationen, damit Arbeitnehmer passende Chancen entdecken und Arbeitgeber schneller die richtigen Menschen finden.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(([number,title,text]) => <div key={number} className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-7"><span className="text-sm font-black text-blue-600">{number}</span><h3 className="mt-8 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></div>)}</div>
        </div>
      </section>

      <section id="fuer-wen" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[2rem]"><img src={officeImage} alt="Modernes professionelles Arbeitsumfeld" className="h-full min-h-[420px] w-full object-cover" /></div>
        <div className="flex flex-col justify-center"><p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Für Menschen & Unternehmen</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Ein System. Zwei Seiten. Ein Ziel.</h2><div className="mt-8 space-y-5"><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="font-black">👤 Für Arbeitnehmer</p><p className="mt-2 text-slate-600">Erstelle dein vollständiges Profil und entdecke Stellen, die zu deinen Fähigkeiten, Wünschen und deiner Verfügbarkeit passen.</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="font-black">🏢 Für Arbeitgeber</p><p className="mt-2 text-slate-600">Definiere deine Stelle, gewichte Anforderungen und erhalte eine übersichtliche Auswahl passender Kandidaten.</p></div></div><Link href="/registrieren" className="mt-8 w-fit rounded-2xl bg-slate-950 px-6 py-3.5 font-bold text-white hover:bg-slate-800">Jetzt bei Stoyan starten →</Link></div>
      </section>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-black text-slate-950">Stoyan<span className="text-blue-600">.</span></span><span>Die Plattform für modernes Job-Matching.</span></div></footer>
    </main>
  )
}
