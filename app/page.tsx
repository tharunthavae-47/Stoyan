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
  "Profilbild & persönliche Informationen",
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
    <main className="min-h-screen overflow-x-hidden bg-[#f8fbfd] text-slate-900">
      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-[24px] font-semibold tracking-[-0.06em] text-slate-900"
          >
            STOYAN
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#vorteile"
              className="text-sm font-medium text-slate-500 transition hover:text-sky-600"
            >
              Vorteile
            </a>

            <a
              href="#so-funktioniert"
              className="text-sm font-medium text-slate-500 transition hover:text-sky-600"
            >
              So funktioniert&apos;s
            </a>

            <a
              href="#arbeitnehmer"
              className="text-sm font-medium text-slate-500 transition hover:text-sky-600"
            >
              Arbeitnehmer
            </a>

            <a
              href="#arbeitgeber"
              className="text-sm font-medium text-slate-500 transition hover:text-sky-600"
            >
              Arbeitgeber
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-sky-600 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-48 h-[580px] w-[580px] rounded-full bg-sky-100/70 blur-[130px]" />
          <div className="absolute -right-48 top-0 h-[600px] w-[600px] rounded-full bg-cyan-50 blur-[140px]" />
          <div className="absolute bottom-0 left-[30%] h-[300px] w-[400px] rounded-full bg-blue-50 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <ScrollReveal>
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-sky-500" />

                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                    Die moderne Job-Matching-Plattform
                  </span>
                </div>

                <h1 className="mt-8 text-[50px] font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-[68px] lg:text-[78px]">
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
                    className="rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
                  >
                    Für Unternehmen
                  </Link>
                </div>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">
                      ✓
                    </span>
                    Professionelle Profile
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">
                      ✓
                    </span>
                    Intelligentes Matching
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">
                      ✓
                    </span>
                    Für beide Seiten
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="[transition-delay:120ms]">
              <div className="relative mx-auto w-full max-w-[500px]">
                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative rounded-[32px] border border-white bg-white/90 p-4 shadow-[0_30px_80px_rgba(14,116,144,.12)] backdrop-blur">
                  <div className="rounded-[24px] border border-sky-100 bg-[#f8fcfe] p-6">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          Passende Fachkraft
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                        92%
                      </div>
                    </div>

                    <div className="mt-7 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-semibold text-white shadow-lg shadow-sky-500/20">
                        A
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          Automobil-Mechatroniker
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Luzern · 5+ Jahre Erfahrung
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-sky-100 bg-white p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Pensum
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          80–100 %
                        </p>
                      </div>

                      <div className="rounded-2xl border border-sky-100 bg-white p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Standort
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          Luzern
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["BMW", "Diagnose", "MFK"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-4 rounded-2xl border border-sky-100 bg-white/95 px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,.10)] backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Match gefunden
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
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
        className="bg-[#f5fafc] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                Warum STOYAN
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] text-slate-900 sm:text-5xl">
                Weniger suchen.
                <br />

                <span className="text-sky-500">
                  Besser finden.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                Stoyan konzentriert sich auf das Wesentliche und bringt
                Arbeitnehmer und Unternehmen gezielter zusammen.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <ScrollReveal
                key={benefit.title}
                className={
                  index === 1
                    ? "[transition-delay:100ms]"
                    : index === 2
                      ? "[transition-delay:200ms]"
                      : ""
                }
              >
                <article className="h-full rounded-[28px] border border-white bg-white p-8 shadow-[0_15px_50px_rgba(30,64,175,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(14,116,144,.10)]">
                  <span className="text-sm font-semibold text-sky-500">
                    {benefit.number}
                  </span>

                  <div className="mt-7 h-px w-full bg-sky-100" />

                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em] text-slate-900">
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
        className="bg-white px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <ScrollReveal>
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  So funktioniert&apos;s
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-900 sm:text-5xl">
                  Einfach starten.
                  <br />
                  Gezielt suchen.
                  <br />

                  <span className="text-sky-500">
                    Passend verbinden.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">
                  Der gesamte Prozess bleibt klar, übersichtlich und auf die
                  wirklich wichtigen Informationen konzentriert.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-5">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  className={
                    index === 1
                      ? "[transition-delay:100ms]"
                      : index === 2
                        ? "[transition-delay:200ms]"
                        : ""
                  }
                >
                  <article className="rounded-[28px] border border-slate-100 bg-[#f8fbfd] p-7 transition hover:border-sky-100 hover:bg-sky-50/50 sm:p-9">
                    <div className="grid gap-5 sm:grid-cols-[80px_1fr]">
                      <span className="text-sm font-semibold text-sky-500">
                        {step.number}
                      </span>

                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-3 max-w-xl leading-7 text-slate-500">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </article>
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
        className="bg-[#f5fafc] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <ScrollReveal>
              <div className="relative mx-auto max-w-[440px]">
                <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative rounded-[32px] border border-white bg-white p-4 shadow-[0_25px_70px_rgba(14,116,144,.10)]">
                  <div className="rounded-[25px] bg-sky-50 p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                      Dein Profil
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-semibold text-white">
                        S
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          Dein professionelles Profil
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Alles Wichtige auf einen Blick
                        </p>
                      </div>
                    </div>

                    <div className="mt-9 space-y-3">
                      <div className="h-3 rounded-full bg-sky-100" />
                      <div className="h-3 w-4/5 rounded-full bg-sky-100" />
                      <div className="h-3 w-3/5 rounded-full bg-sky-100" />
                    </div>

                    <div className="mt-9 flex flex-wrap gap-2">
                      {["Skills", "Erfahrung", "Ausbildung"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="[transition-delay:120ms]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Für Arbeitnehmer
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-900 sm:text-5xl">
                  Zeig, was
                  <br />

                  <span className="text-sky-500">
                    in dir steckt.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                  Dein Profil zeigt mehr als nur einen Lebenslauf.
                  Präsentiere deine Fähigkeiten, Erfahrung und Vorstellungen
                  und werde für passende Unternehmen sichtbar.
                </p>

                <div className="mt-9 grid gap-3 sm:grid-cols-2">
                  {employeeFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white px-4 py-4 text-sm font-medium text-slate-600"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">
                        ✓
                      </span>

                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href="/registrieren?role=employee"
                  className="mt-9 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
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
        className="bg-white px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <ScrollReveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Für Arbeitgeber
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-900 sm:text-5xl">
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
                  klaren Überblick über Kandidaten, die wirklich zu Ihrem
                  Unternehmen passen.
                </p>

                <div className="mt-9 overflow-hidden rounded-[28px] border border-sky-100 bg-[#f8fcfe]">
                  <div className="flex items-center justify-between border-b border-sky-100 bg-white px-6 py-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Kandidatensuche
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        Ihre Anforderungen
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                      AKTIV
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2">
                    {employerCriteria.map(([label, value]) => (
                      <div
                        key={label}
                        className="border-b border-sky-100 bg-white p-5 sm:border-r"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {label}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/registrieren?role=employer"
                  className="mt-9 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                >
                  Unternehmen registrieren
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal className="[transition-delay:120ms]">
              <div className="relative mx-auto max-w-[400px]">
                <div className="absolute -right-12 top-10 h-52 w-52 rounded-full bg-sky-100 blur-3xl" />

                <div className="relative rounded-[32px] border border-white bg-[#f5fbfe] p-5 shadow-[0_30px_80px_rgba(14,116,144,.10)]">
                  <div className="rounded-[24px] border border-sky-100 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                        STOYAN
                      </p>

                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="mt-10">
                      <p className="text-sm text-slate-400">
                        Passender Kandidat
                      </p>

                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                        92 % Match
                      </p>
                    </div>

                    <div className="mt-7 h-3 overflow-hidden rounded-full bg-sky-100">
                      <div className="h-full w-[92%] rounded-full bg-sky-500" />
                    </div>

                    <div className="mt-9 space-y-5">
                      <div className="flex justify-between border-b border-slate-100 pb-4">
                        <span className="text-sm text-slate-400">
                          Erfahrung
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          5+ Jahre
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-100 pb-4">
                        <span className="text-sm text-slate-400">
                          Standort
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          Luzern
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">
                          Pensum
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          80–100 %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="bg-[#f3faff] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-sky-100 bg-white px-7 py-16 text-center shadow-[0_25px_80px_rgba(14,116,144,.08)] sm:px-12">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              STOYAN
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-6xl">
              Der nächste passende
              <br />

              <span className="text-sky-500">
                Schritt beginnt hier.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Erstelle dein professionelles Profil oder starte als Unternehmen
              und finde die Menschen, die wirklich passen.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/registrieren?role=employee"
                className="rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/registrieren?role=employer"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
              >
                Für Unternehmen
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.05em] text-slate-900"
            >
              STOYAN
            </Link>

            <p className="mt-2 text-sm text-slate-400">
              Menschen finden. Potenzial erkennen.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
            <Link
              href="/impressum"
              className="transition hover:text-sky-600"
            >
              Impressum
            </Link>

            <Link
              href="/datenschutz"
              className="transition hover:text-sky-600"
            >
              Datenschutz
            </Link>

            <Link
              href="/login"
              className="transition hover:text-sky-600"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
