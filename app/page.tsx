import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Arbeitnehmer erstellen ein professionelles Profil mit Foto, Erfahrung, Ausbildung, Skills und persönlichen Wünschen.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen bestimmen, welche Fähigkeiten, Erfahrung, Standort und Bedingungen sie für ihre Stelle suchen.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht die Angaben und zeigt die passendsten Kandidaten übersichtlich an.",
  },
]

const employeeFeatures = [
  "Profilbild & Bilder",
  "Ausbildung & Erfahrung",
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
  ["Match", "ab 85 %"],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#edf8fc] text-slate-950">

      {/* ================================================== */}
      {/* BACKGROUND */}
      {/* ================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-sky-200/50 blur-[120px]" />
        <div className="absolute right-[-180px] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-100/70 blur-[130px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[120px]" />
      </div>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
  <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between rounded-full border border-white/90 bg-white/95 px-5 shadow-[0_14px_45px_rgba(15,23,42,.08)] backdrop-blur-xl sm:px-7">

    <Link
      href="/"
      className="text-[26px] font-black tracking-[-0.06em] text-slate-950"
    >
      Stoyan<span className="text-sky-500">.</span>
    </Link>

    <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
      <a href="#so-funktioniert" className="transition hover:text-sky-600">
        So funktioniert&apos;s
      </a>

      <a href="#arbeitnehmer" className="transition hover:text-sky-600">
        Arbeitnehmer
      </a>

      <a href="#arbeitgeber" className="transition hover:text-sky-600">
        Arbeitgeber
      </a>
    </div>

    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
      >
        Einloggen
      </Link>

      <Link
        href="/registrieren?role=employee"
        className="hidden rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 sm:inline-flex"
      >
        Registrieren
      </Link>
    </div>

  </nav>
</header>

      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <section className="px-4 pt-4 sm:px-6 sm:pt-6">

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[38px] border border-white/90 bg-white shadow-[0_30px_90px_rgba(30,64,175,.10)] lg:grid-cols-[1.08fr_.92fr]">

          {/* HERO TEXT */}

          <ScrollReveal>
            <div className="flex h-full flex-col justify-center px-7 py-14 sm:px-12 sm:py-20 lg:px-14 lg:py-24">

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Job Matching Plattform
              </div>

              <h1 className="mt-7 max-w-[680px] text-5xl font-black leading-[0.94] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-[70px]">
                Menschen finden.
                <br />
                <span className="text-sky-500">
                  Potenzial erkennen.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Stoyan verbindet Arbeitnehmer und Unternehmen.
                Menschen präsentieren sich professionell und Unternehmen
                finden gezielt passende Fachkräfte.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <Link
                  href="/registrieren?role=employee"
                  className="rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-[0_14px_35px_rgba(14,165,233,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                >
                  Als Arbeitnehmer starten
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  Für Firmen einloggen
                </Link>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-500">

                <span className="flex items-center gap-2">
                  <span className="text-sky-500">✓</span>
                  Professionelle Profile
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-sky-500">✓</span>
                  Intelligentes Matching
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-sky-500">✓</span>
                  Für beide Seiten
                </span>

              </div>

            </div>
          </ScrollReveal>

          {/* HERO IMAGE AREA */}

          <ScrollReveal className="[transition-delay:120ms]">
            <div className="relative min-h-[470px] overflow-hidden bg-[#eaf6fb] lg:min-h-full">

              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85"
                alt="Modernes Team in einem professionellen Arbeitsumfeld"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/10" />

              {/* Kleine Matching-Karte */}

              <div className="absolute bottom-7 left-7 right-7 rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Matching
                    </p>

                    <p className="mt-2 text-lg font-black text-slate-950">
                      Passende Fachkräfte finden
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Schnell · übersichtlich · gezielt
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-lg font-black text-sky-600">
                    96%
                  </div>

                </div>

              </div>

            </div>
          </ScrollReveal>

        </div>

      </section>

      {/* ================================================== */}
      {/* INTRO / VALUES */}
      {/* ================================================== */}

      <section className="px-4 py-4 sm:px-6">

        <div className="mx-auto max-w-6xl rounded-[38px] border border-white/90 bg-white px-6 py-14 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-10 lg:px-14">

          <ScrollReveal>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                  Stoyan
                </p>

                <h2 className="mt-3 text-4xl font-black leading-[1] tracking-[-0.05em] text-slate-950 sm:text-5xl">
                  Ein moderner Weg,
                  <br />
                  <span className="text-sky-500">
                    Menschen zu verbinden.
                  </span>
                </h2>

              </div>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Keine endlosen Bewerbungslisten und kein unübersichtliches
                Suchen. Stoyan strukturiert Informationen und bringt
                Arbeitnehmer und Unternehmen gezielt zusammen.
              </p>

            </div>

          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">

            <ScrollReveal>
              <div className="rounded-[26px] bg-sky-50 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  01
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-950">
                  Professionelle Profile
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Ein vollständiges Profil zeigt mehr als nur einen Lebenslauf.
                </p>

              </div>
            </ScrollReveal>

            <ScrollReveal className="[transition-delay:100ms]">
              <div className="rounded-[26px] bg-slate-50 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  02
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-950">
                  Klare Anforderungen
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Unternehmen sehen genau die Kriterien, die für ihre Stelle wichtig sind.
                </p>

              </div>
            </ScrollReveal>

            <ScrollReveal className="[transition-delay:200ms]">
              <div className="rounded-[26px] bg-slate-50 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  03
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-950">
                  Intelligentes Matching
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Passende Kandidaten erscheinen dort, wo sie wirklich relevant sind.
                </p>

              </div>
            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* HOW IT WORKS */}
      {/* ================================================== */}

      <section
        id="so-funktioniert"
        className="px-4 py-4 sm:px-6"
      >

        <div className="mx-auto max-w-6xl rounded-[38px] border border-white/90 bg-white px-6 py-14 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-10 lg:px-14">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
              So funktioniert&apos;s
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Drei einfache Schritte.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Von der Erstellung des Profils bis zum passenden Kontakt bleibt
              alles übersichtlich und nachvollziehbar.
            </p>

          </ScrollReveal>

          <div className="mt-12 divide-y divide-slate-100">

            {steps.map((step, index) => (
              <ScrollReveal
                key={step.number}
                className={
                  index === 1
                    ? "[transition-delay:100ms]"
                    : index === 2
                      ? "[transition-delay:200ms]"
                      : ""
                }
              >

                <div className="grid gap-6 py-9 md:grid-cols-[90px_1fr_1.25fr] md:items-center">

                  <div className="text-4xl font-black tracking-[-0.05em] text-sky-500">
                    {step.number}
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                    {step.title}
                  </h3>

                  <p className="max-w-xl leading-7 text-slate-500">
                    {step.text}
                  </p>

                </div>

              </ScrollReveal>
            ))}

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* EMPLOYEE */}
      {/* ================================================== */}

      <section
        id="arbeitnehmer"
        className="px-4 py-4 sm:px-6"
      >

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[38px] border border-white/90 bg-white shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[.85fr_1.15fr]">

          <ScrollReveal>

            <div className="relative min-h-[460px] overflow-hidden bg-slate-100">

              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                alt="Professionelle Arbeitnehmerin im Büro"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

            </div>

          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">

            <div className="px-7 py-12 sm:px-12 lg:px-14">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                Für Arbeitnehmer
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-5xl">
                Zeig, wer du bist.
                <br />
                <span className="text-sky-500">
                  Nicht nur deinen Lebenslauf.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Erstelle dein persönliches Profil und zeige Unternehmen deine
                Erfahrung, Fähigkeiten, Wünsche und Persönlichkeit.
              </p>

              <div className="mt-8 grid gap-2 sm:grid-cols-2">

                {employeeFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-600">
                      ✓
                    </span>

                    {feature}
                  </div>
                ))}

              </div>

              <Link
                href="/registrieren?role=employee"
                className="mt-8 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
              >
                Mein Profil erstellen
              </Link>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ================================================== */}
      {/* EMPLOYER */}
      {/* ================================================== */}

      <section
        id="arbeitgeber"
        className="px-4 py-4 sm:px-6"
      >

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[38px] border border-white/90 bg-white shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[1.08fr_.92fr]">

          <ScrollReveal>

            <div className="px-7 py-12 sm:px-12 lg:px-14">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                Für Arbeitgeber
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-5xl">
                Finden Sie die
                <br />
                <span className="text-sky-500">
                  richtigen Menschen.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Definieren Sie Ihre Kriterien und erhalten Sie eine
                strukturierte Auswahl passender Arbeitnehmer.
              </p>

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Kandidatensuche
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      Ihre Anforderungen
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                    AKTIV
                  </span>

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  {employerCriteria.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {label}
                      </p>

                      <p className="mt-1.5 text-sm font-bold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}

                </div>

                <Link
                  href="/login"
                  className="mt-5 inline-flex rounded-xl bg-sky-500 px-6 py-3 font-bold text-white transition hover:bg-sky-600"
                >
                  Kandidaten suchen
                </Link>

              </div>

            </div>

          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">

            <div className="relative min-h-[500px] overflow-hidden bg-slate-100">

              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85"
                alt="Professioneller Mitarbeiter in einem modernen Büro"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">

                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Beispielhafte Suche
                    </p>

                    <p className="mt-2 text-lg font-black text-slate-950">
                      Automobil-Mechatroniker
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Luzern · 5+ Jahre Erfahrung
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-black text-sky-500">
                      96%
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Match
                    </p>
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[96%] rounded-full bg-sky-500" />
                </div>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ================================================== */}
      {/* FINAL CTA */}
      {/* ================================================== */}

      <section className="px-4 py-4 pb-8 sm:px-6">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[38px] bg-sky-500 px-7 py-16 text-center text-white shadow-[0_30px_80px_rgba(14,165,233,.20)] sm:px-12">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
              Stoyan
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Der nächste passende Mensch ist näher,
              als du denkst.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-sky-50">
              Ein professionelles Profil für Arbeitnehmer.
              Eine gezielte Suche für Unternehmen.
              Eine Plattform, die beide Seiten verbindet.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="/registrieren?role=employee"
                className="rounded-xl bg-white px-6 py-3.5 font-bold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white transition hover:bg-white/15"
              >
                Für Firmen einloggen
              </Link>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer className="px-4 pb-7 sm:px-6">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-2 py-6 text-sm text-slate-500 sm:flex-row">

          <Link
            href="/"
            className="text-xl font-black tracking-[-0.05em] text-slate-950"
          >
            Stoyan<span className="text-sky-500">.</span>
          </Link>

          <p>
            Job Matching für Arbeitnehmer und Unternehmen.
          </p>

        </div>

      </footer>

    </main>
  )
}
