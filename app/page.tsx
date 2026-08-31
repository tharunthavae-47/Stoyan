import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const navigation = [
  { label: "Über STOYAN", href: "#ueber-stoyan" },
  { label: "So funktioniert's", href: "#so-funktioniert" },
  { label: "Arbeitnehmer", href: "#arbeitnehmer" },
  { label: "Arbeitgeber", href: "#arbeitgeber" },
  { label: "Matching", href: "#matching" },
]

const benefits = [
  {
    number: "01",
    title: "Professionelle Profile",
    text: "Zeige Erfahrung, Ausbildung, Skills und deine persönlichen Vorstellungen übersichtlich an einem Ort.",
  },
  {
    number: "02",
    title: "Gezielte Suche",
    text: "Unternehmen können ihre Anforderungen definieren und passende Fachkräfte gezielter finden.",
  },
  {
    number: "03",
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht wichtige Kriterien und macht passende Möglichkeiten sichtbar.",
  },
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Erstelle ein professionelles Profil mit deinen wichtigsten Informationen, Erfahrungen, Skills und Vorstellungen.",
  },
  {
    number: "02",
    title: "Anforderungen festlegen",
    text: "Unternehmen definieren Beruf, Standort, Erfahrung, Pensum und weitere Kriterien für ihre gewünschte Fachkraft.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht die Angaben und zeigt passende Kandidaten und Unternehmen übersichtlich an.",
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
  ["Match", "92 %"],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fbfd] text-slate-900">

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link
            href="/"
            className="text-[24px] font-semibold tracking-[-0.07em] text-slate-900"
          >
            STOYAN
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-500 transition hover:text-sky-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-600 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Registrieren
            </Link>
          </div>

        </div>
      </header>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section
        id="start"
        className="relative overflow-hidden border-b border-slate-200 bg-white"
      >

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-sky-100/70 blur-[140px]" />
          <div className="absolute -right-48 top-0 h-[600px] w-[600px] rounded-full bg-cyan-50 blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-blue-50 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-36">

          <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_.92fr]">

            <ScrollReveal>

              <div className="max-w-3xl">

                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-sky-500" />

                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                    Die moderne Job-Matching-Plattform
                  </span>
                </div>

                <h1 className="mt-8 text-[52px] font-semibold leading-[0.96] tracking-[-0.065em] text-slate-900 sm:text-[68px] lg:text-[80px]">
                  Menschen finden.
                  <br />

                  <span className="text-sky-500">
                    Potenzial erkennen.
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-500 sm:text-xl">
                  Stoyan verbindet Arbeitnehmer und Unternehmen.
                  Professionelle Profile, gezielte Suche und intelligentes
                  Matching machen den Weg zum passenden Job einfacher.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
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

              <div className="relative mx-auto w-full max-w-[480px]">

                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative rounded-[34px] border border-sky-100 bg-white p-4 shadow-[0_30px_90px_rgba(14,116,144,.12)]">

                  <div className="rounded-[26px] bg-[#f5fbfe] p-6">

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

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-semibold text-white">
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

                <div className="absolute -bottom-6 -left-4 rounded-2xl border border-sky-100 bg-white px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,.10)]">

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
      {/* ÜBER STOYAN */}
      {/* ====================================================== */}

      <section
        id="ueber-stoyan"
        className="scroll-mt-24 bg-[#f5fafc] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                01 · Über STOYAN
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-900 sm:text-6xl">
                Ein neuer Weg,
                <br />

                <span className="text-sky-500">
                  Menschen zu verbinden.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                Stoyan schafft eine moderne Verbindung zwischen Menschen,
                die Arbeit suchen, und Unternehmen, die passende Fachkräfte
                suchen.
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

                  <div className="mt-7 h-px bg-sky-100" />

                  <h3 className="mt-7 text-xl font-semibold text-slate-900">
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
        className="scroll-mt-24 bg-white px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div className="lg:sticky lg:top-28">

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  02 · So funktioniert&apos;s
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
                  Der gesamte Prozess bleibt klar und übersichtlich.
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

                  <article className="rounded-[28px] border border-slate-100 bg-[#f8fbfd] p-8 transition hover:border-sky-100 hover:bg-sky-50/40 sm:p-10">

                    <div className="grid gap-5 sm:grid-cols-[70px_1fr]">

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
        className="scroll-mt-24 bg-[#f5fafc] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-16 lg:grid-cols-[.8fr_1.2fr]">

            <ScrollReveal>

              <div className="relative mx-auto max-w-[430px]">

                <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative rounded-[32px] border border-white bg-white p-5 shadow-[0_25px_70px_rgba(14,116,144,.10)]">

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
                          Professionelles Profil
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
                  03 · Für Arbeitnehmer
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-900 sm:text-5xl">
                  Zeig, was
                  <br />

                  <span className="text-sky-500">
                    in dir steckt.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                  Dein Profil zeigt mehr als nur einen Lebenslauf. Präsentiere
                  deine Fähigkeiten, Erfahrung und Vorstellungen und werde für
                  passende Unternehmen sichtbar.
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
                  className="mt-9 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
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
        className="scroll-mt-24 bg-white px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_.85fr]">

            <ScrollReveal>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  04 · Für Arbeitgeber
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
                  Definieren Sie Ihre Anforderungen und finden Sie schneller
                  passende Kandidaten.
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
                  className="mt-9 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
                >
                  Unternehmen registrieren
                </Link>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* MATCHING */}
      {/* ====================================================== */}

      <section
        id="matching"
        className="scroll-mt-24 bg-[#f5fafc] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                05 · Matching
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl">
                Nicht irgendein Match.
                <br />

                <span className="text-sky-500">
                  Das passende.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-500">
                Stoyan betrachtet verschiedene Kriterien und hilft dabei,
                passende Menschen und Unternehmen zusammenzubringen.
              </p>

            </div>

          </ScrollReveal>

          <ScrollReveal className="mt-14">

            <div className="mx-auto max-w-4xl rounded-[32px] border border-white bg-white p-6 shadow-[0_25px_70px_rgba(14,116,144,.08)] sm:p-10">

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    STOYAN MATCH
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    Automobil-Mechatroniker
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Luzern · 5+ Jahre Erfahrung · 80–100 %
                  </p>

                </div>

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-sky-100 bg-white text-xl font-bold text-sky-500">
                  92%
                </div>

              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">

                {[
                  ["Erfahrung", "✓", "Passt"],
                  ["Standort", "✓", "Passt"],
                  ["Skills", "✓", "Passt"],
                ].map(([label, icon, value]) => (

                  <div
                    key={label}
                    className="rounded-2xl border border-slate-100 bg-[#f8fbfd] p-5"
                  >

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-600">
                        {icon}
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {value}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="bg-white px-5 py-24 sm:px-8 sm:py-32">

        <div className="mx-auto max-w-6xl rounded-[36px] border border-sky-100 bg-[#f3faff] px-7 py-16 text-center shadow-[0_25px_80px_rgba(14,116,144,.07)] sm:px-12">

          <ScrollReveal>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Bereit?
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
              und finde Menschen, die wirklich zu dir passen.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              <Link
                href="/registrieren?role=employee"
                className="rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/registrieren?role=employer"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
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

      <footer className="border-t border-slate-200 bg-white px-5 py-12 sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.06em] text-slate-900"
            >
              STOYAN
            </Link>

            <p className="mt-2 text-sm text-slate-400">
              Menschen finden. Potenzial erkennen.
            </p>

          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">

            <a
              href="#ueber-stoyan"
              className="transition hover:text-sky-600"
            >
              Über STOYAN
            </a>

            <a
              href="#so-funktioniert"
              className="transition hover:text-sky-600"
            >
              So funktioniert&apos;s
            </a>

            <a
              href="#arbeitnehmer"
              className="transition hover:text-sky-600"
            >
              Arbeitnehmer
            </a>

            <a
              href="#arbeitgeber"
              className="transition hover:text-sky-600"
            >
              Arbeitgeber
            </a>

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
