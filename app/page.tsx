import Link from "next/link"

const features = [
  ["👤", "Arbeitnehmerprofile", "Beruf, Erfahrung, Skills, Ausbildung und weitere Angaben zentral verwalten."],
  ["🏢", "Arbeitgeberbereich", "Unternehmen erstellen Stellen und definieren genau, wen sie suchen."],
  ["🤖", "Intelligentes Matching", "Kandidaten werden anhand der Anforderungen bewertet und sortiert."],
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-black tracking-tight">Stoyan<span className="text-blue-600">.</span></div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 font-semibold hover:bg-slate-100">Anmelden</Link>
          <Link href="/registrieren" className="rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800">Registrieren</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:pt-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Die neue Art, Jobs zu finden</div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">Die richtigen Menschen. <span className="text-blue-600">Der richtige Job.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Stoyan verbindet Arbeitnehmer und Arbeitgeber mit strukturierten Profilen und einem transparenten Matching-System.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/registrieren?role=employee" className="rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">Ich suche einen Job</Link>
            <Link href="/registrieren?role=employer" className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-bold hover:bg-slate-50">Ich suche Mitarbeiter</Link>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {features.map(([icon, title, text]) => <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><div className="text-3xl">{icon}</div><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></div>)}
        </div>
      </section>
    </main>
  )
}
