import Link from "next/link"

export const metadata = {
  title: "Job Matching Schweiz – passende Jobs und Mitarbeiter finden",
  description:
    "JobMatch24 ist die Job-Matching-Plattform für die Schweiz. Arbeitnehmer finden passende Stellen und Arbeitgeber qualifizierte Mitarbeiter.",
  alternates: { canonical: "https://jobmatch24.ch/job-matching-schweiz" },
}

export default function JobMatchingSchweizPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">JobMatch24 Schweiz</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">Job Matching in der Schweiz</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600">
          JobMatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Profile, Anforderungen und Erfahrungen werden übersichtlich miteinander verglichen, damit passende berufliche Verbindungen schneller entstehen.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/registrieren?role=employee" className="rounded-xl bg-slate-950 px-6 py-3.5 text-center font-bold text-white">Als Arbeitnehmer starten</Link>
          <Link href="/registrieren?role=employer" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center font-bold text-slate-800">Mitarbeiter finden</Link>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-black">Wie funktioniert Job Matching?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-6"><h3 className="font-black">1. Profil erstellen</h3><p className="mt-2 text-slate-600">Erfahrungen, Ausbildung, Skills und berufliche Vorstellungen hinterlegen.</p></article>
            <article className="rounded-2xl border border-slate-200 p-6"><h3 className="font-black">2. Anforderungen vergleichen</h3><p className="mt-2 text-slate-600">Arbeitgeber definieren Anforderungen und entdecken passende Kandidaten.</p></article>
            <article className="rounded-2xl border border-slate-200 p-6"><h3 className="font-black">3. Kontakt aufnehmen</h3><p className="mt-2 text-slate-600">Bei Interesse können beide Seiten über JobMatch24 Kontakt aufnehmen.</p></article>
          </div>
        </div>
      </section>
    </main>
  )
}
