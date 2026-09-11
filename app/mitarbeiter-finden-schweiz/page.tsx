import Link from "next/link"

export const metadata = {
  title: "Mitarbeiter finden Schweiz – qualifizierte Kandidaten | JobMatch24",
  description:
    "Finde qualifizierte Mitarbeiter in der Schweiz mit JobMatch24. Definiere Anforderungen und entdecke passende Kandidaten mit intelligentem Job Matching.",
  alternates: { canonical: "https://jobmatch24.ch/mitarbeiter-finden-schweiz" },
}

export default function MitarbeiterFindenSchweizPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Für Arbeitgeber</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">Mitarbeiter in der Schweiz finden</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600">
          JobMatch24 unterstützt Unternehmen dabei, qualifizierte Kandidaten zu finden. Definiere deine Anforderungen und vergleiche passende Arbeitnehmerprofile anhand relevanter Kriterien.
        </p>
        <Link href="/registrieren?role=employer" className="mt-10 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white">Als Arbeitgeber starten</Link>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-black">Qualifizierte Kandidaten gezielt entdecken</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            JobMatch24 macht passende Profile anhand von Beruf, Erfahrung, Ausbildung, Skills, Pensum, Lohn und Ort vergleichbar. Bei Interesse können Arbeitgeber eine private Kontaktanfrage senden.
          </p>
        </div>
      </section>
    </main>
  )
}
