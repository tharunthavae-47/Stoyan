```tsx
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const benefits = [
  {
    number: "01",
    title: "Professionelle Profile",
    text: "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Fähigkeiten und Persönlichkeit übersichtlich an einem Ort.",
  },
  {
    number: "02",
    title: "Gezielte Suche",
    text: "Unternehmen definieren ihre Anforderungen und finden Kandidaten, die wirklich zu ihrer Stelle passen.",
  },
  {
    number: "03",
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht wichtige Kriterien und macht passende Möglichkeiten schnell sichtbar.",
  },
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Erstelle dein persönliches Profil mit Erfahrung, Ausbildung, Skills, Wunschlohn, Pensum und deinen persönlichen Vorstellungen.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen legen fest, welche Fähigkeiten, Erfahrung, Arbeitsorte und Bedingungen für eine Stelle wichtig sind.",
  },
  {
    number: "03",
    title: "Passendes Match finden",
    text: "Stoyan vergleicht die Angaben beider Seiten und zeigt passende Arbeitnehmer und Unternehmen übersichtlich an.",
  },
]

const employeeFeatures = [
  "Profilbild & persönliche Bilder",
  "Ausbildung & Berufserfahrung",
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
    <main className="min-h-screen overflow-x-hidden bg-[#f7fafc] text-slate-950">

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7fafc]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link
            href="/"
            className="text-[25px] font-semibold tracking-[-0.06em] text-slate-950"
          >
            STOYAN
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">

            <a
              href="#vorteile"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Vorteile
            </a>

            <a
              href="#so-funktioniert"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              So funktioniert&apos;s
            </a>

            <a
              href="#arbeitnehmer"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Arbeitnehmer
            </a>

            <a
              href="#arbeitgeber"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Arbeitgeber
            </a>

          </nav>

          <div className="flex items-center gap-2">

            <Link
              href="/login"
              className="hidden px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Registrieren
            </Link>

          </div>

        </div>
      </header>


      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative border-b border-slate-200 bg-white">

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full bg-sky-100/60 blur-[130px]" />
          <div className="absolute -right-40 top-20 h-[550px] w-[550px] rounded-full bg-blue-50 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">

            <ScrollReveal>

              <div className="max-w-3xl">

                <div className="mb-7 flex items-center gap-3">

                  <span className="h-px w-8 bg-sky-500" />

                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                    Die moderne Job-Matching-Plattform
                  </span>

                </div>

                <h1 className="text-[52px] font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-[68px] lg:text-[78px]">
                  Menschen finden.
                  <br />
                  <span className="text-sky-500">
                    Potenzial erkennen.
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-500 sm:text-xl">
                  Stoyan verbindet Menschen und Unternehmen auf einer
                  modernen Plattform. Professionelle Profile, gezielte Suche
                  und intelligentes Matching machen den nächsten Schritt
                  einfacher.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-lg bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  >
                    Für Unternehmen
                  </Link>

                </div>

                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">

                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-sky-500">✓</span>
                    Professionelle Profile
                  </span>

                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-sky-500">✓</span>
                    Intelligentes Matching
                  </span>

                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-sky-500">✓</span>
                    Für beide Seiten
                  </span>

                </div>

              </div>

            </ScrollReveal>


            {/* HERO VISUAL */}

            <ScrollReveal className="[transition-delay:120ms]">

              <div className="relative mx-auto w-full max-w-[500px]">

                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sky-100 blur-3xl" />

                <div className="relative border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,.10)]">

                  <div className="border border-slate-100 bg-slate-50 p-5">

                    <div className="flex items-center justify-between border-b border-slate-200 pb-5">

                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1 text-lg font-semibold text-slate-950">
                          Passende Fachkraft
                        </p>

                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-600">
                        92%
                      </div>

                    </div>


                    <div className="mt-6 flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-semibold text-white">
                        A
                      </div>

                      <div>

                        <p className="font-semibold text-slate-950">
                          Automobil-Mechatroniker
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Luzern · 5+ Jahre Erfahrung
                        </p>

                      </div>

                    </div>


                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <div className="border border-slate-200 bg-white p-4">

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Pensum
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          80–100 %
                        </p>

                      </div>

                      <div className="border border-slate-200 bg-white p-4">

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Standort
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Luzern
                        </p>

                      </div>

                    </div>


                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                        BMW
                      </span>

                      <span className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                        Diagnose
                      </span>

                      <span className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                        MFK
                      </span>

                    </div>

                  </div>

                </div>


                <div className="absolute -bottom-6 -left-5 border border-slate-200 bg-white px-5 py-4 shadow-xl">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Match gefunden
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    Schnell · gezielt · transparent
                  </p>

                </div>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* VORTEILE */}
      {/* ====================================================== */}

      <section
        id="vorteile"
        className="border-b border-slate-200 bg-[#f7fafc] px-5 py-20 sm:px-8 sm:py-28"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                Warum STOYAN
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-slate-950 sm:text-5xl">
                Weniger suchen.
                <br />
                <span className="text-sky-500">
                  Besser finden.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                Stoyan konzentriert sich auf das Wesentliche und bringt
                Arbeitnehmer und Unternehmen gezielter zusammen.
              </p>

            </div>

          </ScrollReveal>


          <div className="mt-14 grid border border-slate-200 bg-white md:grid-cols-3">

            {benefits.map((benefit, index) => (

              <ScrollReveal
                key={benefit.title}
                className={
                  index > 0
                    ? "[transition-delay:100ms]"
                    : ""
                }
              >

                <article className="h-full border-b border-slate-200 p-7 transition duration-300 hover:bg-sky-50/40 md:border-b-0 md:border-r last:md:border-r-0">

                  <span className="text-sm font-semibold text-sky-500">
                    {benefit.number}
                  </span>

                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-500">
                    {benefit.text}
                  </p>

                </article>

              </ScrollReveal>

            ))}

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* SO FUNKTIONIERT */}
      {/* ====================================================== */}

      <section
        id="so-funktioniert"
        className="border-b border-slate-200 bg-white px-5 py-20 sm:px-8 sm:py-28"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                  So funktioniert&apos;s
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                  Von der Suche
                  <br />
                  zum passenden
                  <br />
                  <span className="text-sky-500">
                    Match.
                  </span>
                </h2>

              </div>

            </ScrollReveal>


            <div className="border-t border-slate-200">

              {steps.map((step, index) => (

                <ScrollReveal
                  key={step.title}
                  className={
                    index > 0
                      ? "[transition-delay:100ms]"
                      : ""
                  }
                >

                  <div className="grid gap-5 border-b border-slate-200 py-9 sm:grid-cols-[80px_1fr]">

                    <span className="text-sm font-semibold text-sky-500">
                      {step.number}
                    </span>

                    <div>

                      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-slate-950">
                        {step.title}
                      </h3>

                      <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                        {step.text}
                      </p>

                    </div>

                  </div>

                </ScrollReveal>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* ARBEITNEHMER */}
      {/* ====================================================== */}

      <section
        id="arbeitnehmer"
        className="border-b border-slate-200 bg-[#f7fafc] px-5 py-20 sm:px-8 sm:py-28"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">

            <ScrollReveal>

              <div className="relative mx-auto max-w-[430px]">

                <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-sky-100 blur-3xl" />

                <div className="relative border border-slate-200 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,.08)]">

                  <div className="bg-slate-950 p-7 text-white">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400">
                      Dein Profil
                    </p>

                    <div className="mt-8 flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-semibold">
                        T
                      </div>

                      <div>

                        <p className="font-semibold">
                          Dein professionelles Profil
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Alles Wichtige auf einen Blick
                        </p>

                      </div>

                    </div>

                    <div className="mt-8 space-y-3">

                      <div className="h-2 rounded-full bg-white/10" />
                      <div className="h-2 w-4/5 rounded-full bg-white/10" />
                      <div className="h-2 w-3/5 rounded-full bg-white/10" />

                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">

                      <span className="border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                        Skills
                      </span>

                      <span className="border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                        Erfahrung
                      </span>

                      <span className="border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                        Ausbildung
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </ScrollReveal>


            <ScrollReveal className="[transition-delay:120ms]">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                  Für Arbeitnehmer
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                  Zeig, was
                  <br />
                  in dir steckt.
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                  Dein Profil zeigt mehr als nur einen Lebenslauf.
                  Präsentiere deine Fähigkeiten, Erfahrung und Vorstellungen
                  und werde für passende Unternehmen sichtbar.
                </p>


                <div className="mt-9 grid gap-x-6 gap-y-3 sm:grid-cols-2">

                  {employeeFeatures.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3 border-b border-slate-200 py-3 text-sm font-medium text-slate-700"
                    >

                      <span className="text-sky-500">
                        ✓
                      </span>

                      {feature}

                    </div>

                  ))}

                </div>


                <Link
                  href="/registrieren?role=employee"
                  className="mt-9 inline-flex rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Profil erstellen
                </Link>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* ARBEITGEBER */}
      {/* ====================================================== */}

      <section
        id="arbeitgeber"
        className="border-b border-slate-200 bg-white px-5 py-20 sm:px-8 sm:py-28"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">

            <ScrollReveal>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                  Für Arbeitgeber
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                  Die richtige
                  <br />
                  Person für
                  <br />
                  <span className="text-sky-500">
                    Ihre Stelle.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                  Definieren Sie Ihre Anforderungen und erhalten Sie einen
                  klaren Überblick über passende Kandidaten.
                </p>


                <div className="mt-9 border border-slate-200">

                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Kandidatensuche
                      </p>

                      <p className="mt-1 font-semibold text-slate-950">
                        Ihre Anforderungen
                      </p>

                    </div>

                    <span className="text-xs font-semibold text-emerald-600">
                      AKTIV
                    </span>

                  </div>


                  <div className="grid sm:grid-cols-2">

                    {employerCriteria.map(([label, value]) => (

                      <div
                        key={label}
                        className="border-b border-r border-slate-200 p-5 last:border-b-0"
                      >

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {label}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {value}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>


                <Link
                  href="/registrieren?role=employer"
                  className="mt-8 inline-flex rounded-lg bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/15 transition hover:bg-sky-600"
                >
                  Unternehmen registrieren
                </Link>

              </div>

            </ScrollReveal>


            <ScrollReveal className="[transition-delay:120ms]">

              <div className="relative mx-auto max-w-[400px]">

                <div className="absolute -right-10 top-10 h-52 w-52 rounded-full bg-sky-100 blur-3xl" />

                <div className="relative border border-slate-200 bg-slate-950 p-6 shadow-[0_30px_80px_rgba(15,23,42,.12)]">

                  <div className="flex items-center justify-between">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      STOYAN
                    </p>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  </div>

                  <div className="mt-10">

                    <p className="text-sm text-slate-500">
                      Passender Kandidat
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-white">
                      92 % Match
                    </p>

                  </div>

                  <div className="mt-8 h-2 bg-white/10">

                    <div className="h-full w-[92%] bg-sky-500" />

                  </div>

                  <div className="mt-8 space-y-4">

                    <div className="flex justify-between border-b border-white/10 pb-3">

                      <span className="text-sm text-slate-500">
                        Erfahrung
                      </span>

                      <span className="text-sm font-medium text-white">
                        5+ Jahre
                      </span>

                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-3">

                      <span className="text-sm text-slate-500">
                        Standort
                      </span>

                      <span className="text-sm font-medium text-white">
                        Luzern
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-sm text-slate-500">
                        Pensum
                      </span>

                      <span className="text-sm font-medium text-white">
                        80–100 %
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* CTA */}
      {/* ====================================================== */}

      <section className="bg-slate-950 px-5 py-20 sm:px-8 sm:py-28">

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                  STOYAN
                </p>

                <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  Der nächste passende Schritt beginnt hier.
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                  Erstelle dein Profil oder starte als Unternehmen und finde
                  die passende Verbindung.
                </p>

              </div>


              <div className="flex flex-wrap gap-3">

                <Link
                  href="/registrieren?role=employee"
                  className="rounded-lg bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Arbeitnehmer
                </Link>

                <Link
                  href="/registrieren?role=employer"
                  className="rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Unternehmen
                </Link>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>


      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <footer className="bg-white px-5 py-10 sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.05em] text-slate-950"
            >
              STOYAN
            </Link>

            <p className="mt-1 text-sm text-slate-400">
              Menschen finden. Potenzial erkennen.
            </p>

          </div>


          <div className="flex flex-wrap gap-6 text-sm text-slate-500">

            <Link
              href="/impressum"
              className="transition hover:text-slate-950"
            >
              Impressum
            </Link>

            <Link
              href="/datenschutz"
              className="transition hover:text-slate-950"
            >
              Datenschutz
            </Link>

            <Link
              href="/login"
              className="transition hover:text-slate-950"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  )
}
```
