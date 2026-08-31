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
    text: "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Skills und persönliche Wünsche an einem Ort.",
  },
  {
    number: "02",
    title: "Gezielte Suche",
    text: "Unternehmen definieren ihre Anforderungen und finden gezielt passende Fachkräfte.",
  },
  {
    number: "03",
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht relevante Kriterien und macht passende Möglichkeiten sichtbar.",
  },
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Erstelle dein professionelles Profil mit Erfahrung, Ausbildung, Skills, Standort und deinen persönlichen Vorstellungen.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen legen fest, welche Fähigkeiten, Erfahrung, Standort und Bedingungen sie für eine Stelle suchen.",
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
    <main className="min-h-screen overflow-x-hidden bg-[#07090d] text-white">

      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute -right-64 top-[10%] h-[650px] w-[650px] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute bottom-[-300px] left-[30%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#07090d]/85 backdrop-blur-2xl">

        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-500/20">
              S
            </span>

            <span className="text-xl font-black tracking-[-0.06em] text-white">
              STOYAN
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">

            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}

          </nav>

          <div className="flex items-center gap-2">

            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-400"
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
        className="relative border-b border-white/[0.07] px-5 sm:px-8"
      >

        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">

          <div className="grid items-center gap-16 lg:grid-cols-[1.08fr_.92fr]">

            <ScrollReveal>

              <div className="max-w-3xl">

                <div className="flex items-center gap-3">

                  <span className="h-px w-10 bg-blue-500" />

                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                    Job Matching Plattform
                  </span>

                </div>

                <h1 className="mt-8 text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-[84px]">

                  Menschen finden.

                  <br />

                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Potenzial erkennen.
                  </span>

                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                  Stoyan verbindet Arbeitnehmer und Unternehmen.
                  Professionelle Profile, gezielte Suche und intelligentes
                  Matching bringen Menschen und Möglichkeiten zusammen.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-400"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Für Unternehmen
                  </Link>

                </div>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500">

                  {[
                    "Professionelle Profile",
                    "Intelligentes Matching",
                    "Für beide Seiten",
                  ].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <span className="text-blue-400">✓</span>
                      {item}
                    </span>
                  ))}

                </div>

              </div>

            </ScrollReveal>

            {/* HERO CARD */}

            <ScrollReveal className="[transition-delay:120ms]">

              <div className="relative mx-auto w-full max-w-[470px]">

                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />

                <div className="relative rounded-[32px] border border-white/10 bg-[#10151d]/90 p-4 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">

                  <div className="rounded-[25px] border border-white/[0.06] bg-[#0b1017] p-6">

                    <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1 text-lg font-bold text-white">
                          Passende Fachkraft
                        </p>

                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-400">
                        92%
                      </div>

                    </div>

                    <div className="mt-7 flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-xl font-black text-white">
                        A
                      </div>

                      <div>

                        <p className="font-bold text-white">
                          Automobil-Mechatroniker
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Luzern · 5+ Jahre Erfahrung
                        </p>

                      </div>

                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3">

                      {[
                        ["Pensum", "80–100 %"],
                        ["Standort", "Luzern"],
                      ].map(([label, value]) => (

                        <div
                          key={label}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                        >

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {label}
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-300">
                            {value}
                          </p>

                        </div>

                      ))}

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {["BMW", "Diagnose", "MFK"].map((skill) => (

                        <span
                          key={skill}
                          className="rounded-full border border-blue-400/10 bg-blue-500/5 px-3 py-1.5 text-xs font-semibold text-blue-300"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

                <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white/10 bg-[#111720]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Match gefunden
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Schnell · gezielt · transparent
                  </p>

                </div>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* 01 ÜBER STOYAN */}
      {/* ====================================================== */}

      <section
        id="ueber-stoyan"
        className="scroll-mt-24 border-b border-white/[0.07] bg-[#0b1017] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="max-w-3xl">

              <div className="flex items-center gap-4">

                <span className="text-sm font-bold text-blue-400">
                  01
                </span>

                <span className="h-px w-12 bg-white/10" />

                <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Über STOYAN
                </span>

              </div>

              <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl">

                Ein moderner Weg,

                <br />

                <span className="text-blue-400">
                  Menschen zu verbinden.
                </span>

              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Stoyan schafft eine klare Verbindung zwischen Menschen,
                die Arbeit suchen, und Unternehmen, die passende Fachkräfte
                suchen.
              </p>

            </div>

          </ScrollReveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">

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

                <article className="h-full bg-[#0e141c] p-8 transition duration-300 hover:bg-[#111923] sm:p-9">

                  <span className="text-sm font-bold text-blue-400">
                    {benefit.number}
                  </span>

                  <div className="mt-8 h-px bg-white/[0.07]" />

                  <h3 className="mt-8 text-xl font-bold text-white">
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
      {/* 02 SO FUNKTIONIERT'S */}
      {/* ====================================================== */}

      <section
        id="so-funktioniert"
        className="scroll-mt-24 border-b border-white/[0.07] bg-[#07090d] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div className="lg:sticky lg:top-28">

                <div className="flex items-center gap-4">

                  <span className="text-sm font-bold text-blue-400">
                    02
                  </span>

                  <span className="h-px w-12 bg-white/10" />

                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    So funktioniert&apos;s
                  </span>

                </div>

                <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.055em] text-white sm:text-5xl">

                  Einfach starten.

                  <br />

                  Gezielt suchen.

                  <br />

                  <span className="text-blue-400">
                    Passend verbinden.
                  </span>

                </h2>

                <p className="mt-7 max-w-lg text-lg leading-8 text-slate-500">
                  Von der Profilerstellung bis zum Match bleibt der gesamte
                  Prozess klar und nachvollziehbar.
                </p>

              </div>

            </ScrollReveal>

            <div className="space-y-4">

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

                  <article className="group rounded-[26px] border border-white/[0.07] bg-[#0d131b] p-7 transition duration-300 hover:border-blue-400/20 hover:bg-[#101720] sm:p-9">

                    <div className="grid gap-5 sm:grid-cols-[70px_1fr]">

                      <span className="text-sm font-bold text-blue-400">
                        {step.number}
                      </span>

                      <div>

                        <h3 className="text-2xl font-bold tracking-[-0.03em] text-white">
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
      {/* 03 ARBEITNEHMER */}
      {/* ====================================================== */}

      <section
        id="arbeitnehmer"
        className="scroll-mt-24 border-b border-white/[0.07] bg-[#0b1017] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div className="relative mx-auto max-w-[420px]">

                <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative rounded-[32px] border border-white/10 bg-[#111720] p-5 shadow-2xl">

                  <div className="rounded-[25px] bg-[#0b1017] p-7">

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                      Dein Profil
                    </p>

                    <div className="mt-8 flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-xl font-black text-white">
                        S
                      </div>

                      <div>

                        <p className="font-bold text-white">
                          Professionelles Profil
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Alles Wichtige auf einen Blick
                        </p>

                      </div>

                    </div>

                    <div className="mt-9 space-y-3">

                      <div className="h-2.5 rounded-full bg-white/[0.07]" />
                      <div className="h-2.5 w-4/5 rounded-full bg-white/[0.07]" />
                      <div className="h-2.5 w-3/5 rounded-full bg-white/[0.07]" />

                    </div>

                    <div className="mt-9 flex flex-wrap gap-2">

                      {["Skills", "Erfahrung", "Ausbildung"].map((item) => (

                        <span
                          key={item}
                          className="rounded-full border border-blue-400/10 bg-blue-500/5 px-3 py-2 text-xs font-semibold text-blue-300"
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

                <div className="flex items-center gap-4">

                  <span className="text-sm font-bold text-blue-400">
                    03
                  </span>

                  <span className="h-px w-12 bg-white/10" />

                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Für Arbeitnehmer
                  </span>

                </div>

                <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.055em] text-white sm:text-6xl">

                  Zeig, was

                  <br />

                  <span className="text-blue-400">
                    in dir steckt.
                  </span>

                </h2>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                  Dein Profil zeigt mehr als nur einen Lebenslauf. Präsentiere
                  deine Fähigkeiten, Erfahrung und Vorstellungen und werde für
                  passende Unternehmen sichtbar.
                </p>

                <div className="mt-9 grid gap-3 sm:grid-cols-2">

                  {employeeFeatures.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-4 text-sm font-medium text-slate-400"
                    >

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                        ✓
                      </span>

                      {feature}

                    </div>

                  ))}

                </div>

                <Link
                  href="/registrieren?role=employee"
                  className="mt-9 inline-flex rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-400"
                >
                  Profil erstellen
                </Link>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* 04 ARBEITGEBER */}
      {/* ====================================================== */}

      <section
        id="arbeitgeber"
        className="scroll-mt-24 border-b border-white/[0.07] bg-[#07090d] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="max-w-3xl">

              <div className="flex items-center gap-4">

                <span className="text-sm font-bold text-blue-400">
                  04
                </span>

                <span className="h-px w-12 bg-white/10" />

                <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Für Arbeitgeber
                </span>

              </div>

              <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.055em] text-white sm:text-6xl">

                Finden Sie die

                <br />

                <span className="text-blue-400">
                  richtigen Menschen.
                </span>

              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Definieren Sie Ihre Anforderungen und finden Sie schneller
                Kandidaten, die zu Ihrer Stelle und Ihrem Unternehmen passen.
              </p>

            </div>

          </ScrollReveal>

          <ScrollReveal className="mt-14">

            <div className="overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#0d131b]">

              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-8">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Kandidatensuche
                  </p>

                  <p className="mt-1 font-bold text-white">
                    Ihre Anforderungen
                  </p>

                </div>

                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold text-emerald-400">
                  AKTIV
                </span>

              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3">

                {employerCriteria.map(([label, value]) => (

                  <div
                    key={label}
                    className="border-b border-white/[0.07] p-6 sm:border-r"
                  >

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-300">
                      {value}
                    </p>

                  </div>

                ))}

              </div>

              <div className="px-6 py-6 sm:px-8">

                <Link
                  href="/registrieren?role=employer"
                  className="inline-flex rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400"
                >
                  Kandidaten suchen
                </Link>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ====================================================== */}
      {/* 05 MATCHING */}
      {/* ====================================================== */}

      <section
        id="matching"
        className="scroll-mt-24 border-b border-white/[0.07] bg-[#0b1017] px-5 py-24 sm:px-8 sm:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <ScrollReveal>

            <div className="mx-auto max-w-3xl text-center">

              <div className="flex items-center justify-center gap-4">

                <span className="text-sm font-bold text-blue-400">
                  05
                </span>

                <span className="h-px w-12 bg-white/10" />

                <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Matching
                </span>

              </div>

              <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-0.055em] text-white sm:text-6xl">

                Nicht irgendein Match.

                <br />

                <span className="text-blue-400">
                  Das passende.
                </span>

              </h2>

              <p className="mt-7 text-lg leading-8 text-slate-500">
                Stoyan betrachtet verschiedene Kriterien und hilft dabei,
                passende Menschen und Unternehmen zusammenzubringen.
              </p>

            </div>

          </ScrollReveal>

          <ScrollReveal className="mt-14">

            <div className="mx-auto max-w-4xl rounded-[32px] border border-white/[0.08] bg-[#0e141c] p-6 shadow-[0_30px_100px_rgba(0,0,0,.25)] sm:p-10">

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    STOYAN MATCH
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                    Automobil-Mechatroniker
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Luzern · 5+ Jahre Erfahrung · 80–100 %
                  </p>

                </div>

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-blue-500/10 bg-blue-500/5 text-xl font-black text-blue-400">
                  92%
                </div>

              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">

                {[
                  "Erfahrung",
                  "Standort",
                  "Skills",
                ].map((item) => (

                  <div
                    key={item}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5"
                  >

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {item}
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs text-emerald-400">
                        ✓
                      </span>

                      <span className="text-sm font-bold text-slate-400">
                        Passt
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

      <section className="bg-[#07090d] px-5 py-24 sm:px-8 sm:py-32">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-blue-400/10 bg-gradient-to-br from-blue-500/10 via-[#0e141c] to-cyan-500/5 px-7 py-16 text-center sm:px-12">

          <ScrollReveal>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              Bereit?
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl">

              Der nächste passende

              <br />

              <span className="text-blue-400">
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
                className="rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/registrieren?role=employer"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
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

      <footer className="border-t border-white/[0.07] bg-[#07090d] px-5 py-12 sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/"
              className="text-xl font-black tracking-[-0.06em] text-white"
            >
              STOYAN
            </Link>

            <p className="mt-2 text-sm text-slate-600">
              Menschen finden. Potenzial erkennen.
            </p>

          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">

            {navigation.map((item) => (

              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </a>

            ))}

            <Link
              href="/login"
              className="transition hover:text-white"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  )
}
