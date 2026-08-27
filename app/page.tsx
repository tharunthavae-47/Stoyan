import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Stoyan<span className="text-blue-600">.</span>
          </Link>
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Firmen-Login
          </Link>
        </nav>
      </header>

      <section className="bg-[#f7f8fa]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Stoyan · Job Matching</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Menschen und Unternehmen zusammenbringen.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Arbeitnehmer erstellen ein vollständiges Profil und zeigen, wer sie sind, was sie können und was sie suchen. Unternehmen geben ihre Anforderungen ein und finden passende Profile anhand eines transparenten Matches.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/registrieren?role=employee" className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              Als Arbeitnehmer registrieren
            </Link>
            <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-bold text-slate-900 transition hover:bg-slate-50">
              Für Firmen einloggen
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-black text-blue-600">01</p>
            <h2 className="mt-4 text-2xl font-black">Arbeitnehmerprofil</h2>
            <p className="mt-3 leading-7 text-slate-600">Profilbild, persönliche Vorstellung, Ausbildung, Berufserfahrung, Skills, Sprachen, Wunschlohn, Arbeitsort, Pensum, Verfügbarkeit und weitere Angaben.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-black text-blue-600">02</p>
            <h2 className="mt-4 text-2xl font-black">Unternehmenssuche</h2>
            <p className="mt-3 leading-7 text-slate-600">Unternehmen suchen nach Beruf, Qualifikation, Erfahrung, Skills, Entfernung, Pensum, Lohn und weiteren Kriterien.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-black text-blue-600">03</p>
            <h2 className="mt-4 text-2xl font-black">Matching & Kontakt</h2>
            <p className="mt-3 leading-7 text-slate-600">Stoyan vergleicht die Kriterien, zeigt passende Arbeitnehmer nach Match an und ermöglicht die Kontaktaufnahme.</p>
          </article>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">Das Prinzip</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Der Arbeitnehmer präsentiert sich. Die Firma sucht gezielt. Stoyan verbindet beide.</h2>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="font-bold">Profil</p><p className="mt-2 text-sm leading-6 text-slate-300">Ein professioneller Auftritt statt eines einfachen Lebenslaufs.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="font-bold">Kriterien</p><p className="mt-2 text-sm leading-6 text-slate-300">Klare Anforderungen statt unübersichtlicher Bewerbungen.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="font-bold">Match</p><p className="mt-2 text-sm leading-6 text-slate-300">Passende Profile mit nachvollziehbarer Übereinstimmung.</p></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-black text-slate-950">Stoyan<span className="text-blue-600">.</span></span>
          <span>Job Matching für Arbeitnehmer und Unternehmen.</span>
        </div>
      </footer>
    </main>
  )
}
