import Link from "next/link"

export const metadata = {
  title: "Jobs Schweiz – passende Stellen finden | JobMatch24",
  description:
    "Finde passende Jobs in der Schweiz mit JobMatch24. Erstelle dein Profil und lass dich mit passenden Arbeitgebern und beruflichen Chancen verbinden.",
  alternates: { canonical: "https://jobmatch24.ch/jobs-schweiz" },
}

export default function JobsSchweizPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Jobs Schweiz</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">Passende Jobs in der Schweiz finden</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600">
          Mit JobMatch24 kannst du ein professionelles Arbeitnehmerprofil erstellen und deine beruflichen Erfahrungen, Skills und Vorstellungen sichtbar machen. So können passende Arbeitgeber dich gezielt finden.
        </p>
        <Link href="/registrieren?role=employee" className="mt-10 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white">Jetzt Profil erstellen</Link>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-black">Jobbörse Schweiz mit Matching</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            JobMatch24 setzt nicht nur auf eine klassische Jobsuche. Dein Profil kann anhand von Beruf, Erfahrung, Ausbildung, Skills, Pensum, Lohn und Ort mit den Anforderungen von Arbeitgebern verglichen werden.
          </p>
        </div>
      </section>
    </main>
  )
}
