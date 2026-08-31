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
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[82px] max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:px-10">

          {/* LOGO */}

          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-base font-black text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-105">
              S
            </div>

            <div className="hidden sm:block">

              <div className="text-xl font-black tracking-[-0.07em] text-[#0F172A]">
                STOYAN
              </div>

              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">
                Menschen verbinden
              </div>

            </div>

          </Link>

          {/* NAVIGATION */}

         <nav className="ml-auto hidden items-center gap-3 xl:flex">
  {navigation.map((item, index) => (
    <a
      key={item.href}
      href={item.href}
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        py-3
        text-sm
        font-semibold
        text-slate-600
        shadow-[0_4px_14px_rgba(15,23,42,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:bg-blue-50/40
        hover:text-blue-600
        hover:shadow-[0_10px_25px_rgba(37,99,235,0.10)]
      "
    >
      <span
        className="
          flex
          h-6
          min-w-6
          items-center
          justify-center
          rounded-lg
          bg-slate-50
          px-1.5
          text-[9px]
          font-black
          tracking-wider
          text-slate-400
          transition-all
          duration-300
          group-hover:bg-blue-100
          group-hover:text-blue-600
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="whitespace-nowrap">
        {item.label}
      </span>
    </a>
  ))}
</nav>

          {/* ACTIONS */}

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">

            <Link
              href="/login"
              className="hidden rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#475569] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              Registrieren
            </Link>

          </div>

        </div>

        {/* MOBILE NAVIGATION */}

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 xl:hidden">

          <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto pb-1">

            {navigation.map((item, index) => (

              <a
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#64748B] shadow-sm transition hover:border-[#BFDBFE] hover:text-[#2563EB]"
              >

                <span className="text-[9px] font-black text-[#94A3B8]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {item.label}

              </a>

            ))}

          </div>

        </div>

      </header>

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        id="start"
        className="border-b border-[#E2E8F0] bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">

          <div className="grid min-h-[720px] items-center gap-16 py-24 lg:grid-cols-[1.05fr_.95fr] lg:py-28">

            <ScrollReveal>

              <div className="max-w-4xl">

                <div className="flex items-center gap-3">

                  <span className="h-px w-10 bg-[#2563EB]" />

                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#2563EB]">
                    Job Matching Plattform
                  </span>

                </div>

                <h1 className="mt-8 text-5xl font-black leading-[0.9] tracking-[-0.075em] text-[#0F172A] sm:text-7xl lg:text-[88px]">

                  Menschen finden.

                  <br />

                  <span className="text-[#2563EB]">
                    Potenzial erkennen.
                  </span>

                </h1>

                <p className="mt-9 max-w-2xl text-lg leading-8 text-[#64748B] sm:text-xl">
                  Stoyan verbindet Arbeitnehmer und Unternehmen.
                  Professionelle Profile, gezielte Suche und intelligentes
                  Matching bringen Menschen und Möglichkeiten zusammen.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-3.5 text-sm font-bold text-[#0F172A] transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    Für Unternehmen
                  </Link>

                </div>

                <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">

                  {[
                    "Professionelle Profile",
                    "Intelligentes Matching",
                    "Für beide Seiten",
                  ].map((item) => (

                    <span
                      key={item}
                      className="flex items-center gap-2 text-sm font-semibold text-[#64748B]"
                    >

                      <span className="text-[#2563EB]">
                        ✓
                      </span>

                      {item}

                    </span>

                  ))}

                </div>

              </div>

            </ScrollReveal>

            {/* MATCH PREVIEW */}

            <ScrollReveal className="[transition-delay:120ms]">

              <div className="relative mx-auto w-full max-w-[500px]">

                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />

                <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-slate-100 blur-3xl" />

                <div className="relative rounded-[34px] border border-[#E2E8F0] bg-white p-4 shadow-[0_35px_100px_rgba(15,23,42,.11)]">

                  <div className="rounded-[27px] bg-[#F8FAFC] p-6 sm:p-7">

                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6">

                      <div>

                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1.5 text-lg font-black text-[#0F172A]">
                          Passende Fachkraft
                        </p>

                      </div>

                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-blue-100 bg-white text-sm font-black text-[#2563EB] shadow-sm">
                        92%
                      </div>

                    </div>

                    <div className="mt-7 flex items-center gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xl font-black text-white">
                        A
                      </div>

                      <div>

                        <p className="font-black text-[#0F172A]">
                          Automobil-Mechatroniker
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
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
                          className="rounded-2xl border border-[#E2E8F0] bg-white p-4"
                        >

                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                            {label}
                          </p>

                          <p className="mt-1.5 text-sm font-bold text-[#334155]">
                            {value}
                          </p>

                        </div>

                      ))}

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {["BMW", "Diagnose", "MFK"].map((skill) => (

                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB]"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

                <div className="absolute -bottom-7 -left-5 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-xl">

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
                    Match gefunden
                  </p>

                  <p className="mt-1 text-sm font-black text-[#0F172A]">
                    Schnell · gezielt · transparent
                  </p>

                </div>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* 01 ÜBER STOYAN */}
      {/* ===================================================== */}

      <section
        id="ueber-stoyan"
        className="scroll-mt-28 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px]">

          <ScrollReveal>

            <div className="flex items-center gap-4">

              <span className="text-sm font-black text-[#2563EB]">
                01
              </span>

              <span className="h-px w-12 bg-[#CBD5E1]" />

              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#64748B]">
                Über STOYAN
              </span>

            </div>

            <div className="mt-7 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">

              <h2 className="text-4xl font-black leading-[0.96] tracking-[-0.06em] text-[#0F172A] sm:text-6xl">

                Ein moderner Weg,

                <br />

                <span className="text-[#2563EB]">
                  Menschen zu verbinden.
                </span>

              </h2>

              <p className="max-w-2xl text-lg leading-8 text-[#64748B]">
                Stoyan schafft eine klare Verbindung zwischen Menschen,
                die Arbeit suchen, und Unternehmen, die passende Fachkräfte
                suchen. Einfach, professionell und transparent.
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

                <article className="group h-full rounded-[28px] border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/30 sm:p-9">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-black text-[#2563EB]">
                      {benefit.number}
                    </span>

                    <span className="h-2 w-2 rounded-full bg-[#2563EB] transition-transform duration-300 group-hover:scale-150" />

                  </div>

                  <div className="mt-8 h-px bg-[#E2E8F0]" />

                  <h3 className="mt-8 text-xl font-black tracking-[-0.02em] text-[#0F172A]">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#64748B]">
                    {benefit.text}
                  </p>

                </article>

              </ScrollReveal>

            ))}

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* 02 SO FUNKTIONIERT'S */}
      {/* ===================================================== */}

      <section
        id="so-funktioniert"
        className="scroll-mt-28 border-b border-[#E2E8F0] bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px]">

          <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div className="lg:sticky lg:top-32">

                <div className="flex items-center gap-4">

                  <span className="text-sm font-black text-[#2563EB]">
                    02
                  </span>

                  <span className="h-px w-12 bg-[#CBD5E1]" />

                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#64748B]">
                    So funktioniert&apos;s
                  </span>

                </div>

                <h2 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#0F172A] sm:text-6xl">

                  Einfach starten.

                  <br />

                  Gezielt suchen.

                  <br />

                  <span className="text-[#2563EB]">
                    Passend verbinden.
                  </span>

                </h2>

                <p className="mt-7 max-w-lg text-lg leading-8 text-[#64748B]">
                  Der Weg von der Profilerstellung bis zum passenden Match
                  bleibt klar, übersichtlich und nachvollziehbar.
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

                  <article className="group rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] p-7 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-100/30 sm:p-9">

                    <div className="grid gap-6 sm:grid-cols-[70px_1fr]">

                      <span className="text-sm font-black text-[#2563EB]">
                        {step.number}
                      </span>

                      <div>

                        <h3 className="text-2xl font-black tracking-[-0.03em] text-[#0F172A]">
                          {step.title}
                        </h3>

                        <p className="mt-4 max-w-2xl leading-7 text-[#64748B]">
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

      {/* ===================================================== */}
      {/* 03 ARBEITNEHMER */}
      {/* ===================================================== */}

      <section
        id="arbeitnehmer"
        className="scroll-mt-28 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px]">

          <div className="grid items-center gap-16 lg:grid-cols-[.75fr_1.25fr]">

            <ScrollReveal>

              <div className="relative mx-auto max-w-[430px]">

                <div className="absolute -left-10 top-10 h-52 w-52 rounded-full bg-blue-100 blur-3xl" />

                <div className="relative rounded-[34px] border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,.08)]">

                  <div className="rounded-[27px] bg-[#F8FAFC] p-7">

                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2563EB]">
                      Dein Profil
                    </p>

                    <div className="mt-8 flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] text-xl font-black text-white">
                        S
                      </div>

                      <div>

                        <p className="font-black text-[#0F172A]">
                          Professionelles Profil
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          Alles Wichtige auf einen Blick
                        </p>

                      </div>

                    </div>

                    <div className="mt-9 space-y-3">

                      <div className="h-2.5 rounded-full bg-[#E2E8F0]" />
                      <div className="h-2.5 w-4/5 rounded-full bg-[#E2E8F0]" />
                      <div className="h-2.5 w-3/5 rounded-full bg-[#E2E8F0]" />

                    </div>

                    <div className="mt-9 flex flex-wrap gap-2">

                      {["Skills", "Erfahrung", "Ausbildung"].map((item) => (

                        <span
                          key={item}
                          className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-[#2563EB]"
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

                  <span className="text-sm font-black text-[#2563EB]">
                    03
                  </span>

                  <span className="h-px w-12 bg-[#CBD5E1]" />

                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#64748B]">
                    Für Arbeitnehmer
                  </span>

                </div>

                <h2 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#0F172A] sm:text-6xl">

                  Zeig, was

                  <br />

                  <span className="text-[#2563EB]">
                    in dir steckt.
                  </span>

                </h2>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#64748B]">
                  Dein Profil zeigt mehr als nur einen Lebenslauf.
                  Präsentiere deine Fähigkeiten, Erfahrung und Vorstellungen
                  und werde für passende Unternehmen sichtbar.
                </p>

                <div className="mt-9 grid gap-3 sm:grid-cols-2">

                  {employeeFeatures.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-4 text-sm font-semibold text-[#475569]"
                    >

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-[#2563EB]">
                        ✓
                      </span>

                      {feature}

                    </div>

                  ))}

                </div>

                <Link
                  href="/registrieren?role=employee"
                  className="mt-9 inline-flex rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                >
                  Profil erstellen
                </Link>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* 04 ARBEITGEBER */}
      {/* ===================================================== */}

      <section
        id="arbeitgeber"
        className="scroll-mt-28 border-b border-[#E2E8F0] bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px]">

          <ScrollReveal>

            <div className="flex items-center gap-4">

              <span className="text-sm font-black text-[#2563EB]">
                04
              </span>

              <span className="h-px w-12 bg-[#CBD5E1]" />

              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#64748B]">
                Für Arbeitgeber
              </span>

            </div>

            <h2 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#0F172A] sm:text-6xl">

              Finden Sie die

              <br />

              <span className="text-[#2563EB]">
                richtigen Menschen.
              </span>

            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#64748B]">
              Definieren Sie Ihre Anforderungen und finden Sie schneller
              Kandidaten, die zu Ihrer Stelle und Ihrem Unternehmen passen.
            </p>

          </ScrollReveal>

          <ScrollReveal className="mt-14">

            <div className="overflow-hidden rounded-[30px] border border-[#E2E8F0] bg-[#F8FAFC]">

              <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-5 sm:px-8">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
                    Kandidatensuche
                  </p>

                  <p className="mt-1 font-black text-[#0F172A]">
                    Ihre Anforderungen
                  </p>

                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                  AKTIV
                </span>

              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3">

                {employerCriteria.map(([label, value]) => (

                  <div
                    key={label}
                    className="border-b border-[#E2E8F0] p-6 lg:border-r"
                  >

                    <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#334155]">
                      {value}
                    </p>

                  </div>

                ))}

              </div>

              <div className="bg-white px-6 py-6 sm:px-8">

                <Link
                  href="/registrieren?role=employer"
                  className="inline-flex rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Kandidaten suchen
                </Link>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ===================================================== */}
      {/* 05 MATCHING */}
      {/* ===================================================== */}

      <section
        id="matching"
        className="scroll-mt-28 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px]">

          <ScrollReveal>

            <div className="mx-auto max-w-3xl text-center">

              <div className="flex items-center justify-center gap-4">

                <span className="text-sm font-black text-[#2563EB]">
                  05
                </span>

                <span className="h-px w-12 bg-[#CBD5E1]" />

                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#64748B]">
                  Matching
                </span>

              </div>

              <h2 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#0F172A] sm:text-6xl">

                Nicht irgendein Match.

                <br />

                <span className="text-[#2563EB]">
                  Das passende.
                </span>

              </h2>

              <p className="mt-7 text-lg leading-8 text-[#64748B]">
                Stoyan betrachtet relevante Kriterien und hilft dabei,
                passende Menschen und Unternehmen zusammenzubringen.
              </p>

            </div>

          </ScrollReveal>

          <ScrollReveal className="mt-14">

            <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E2E8F0] bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,.07)] sm:p-10">

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
                    STOYAN MATCH
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#0F172A]">
                    Automobil-Mechatroniker
                  </h3>

                  <p className="mt-2 text-sm text-[#64748B]">
                    Luzern · 5+ Jahre Erfahrung · 80–100 %
                  </p>

                </div>

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-blue-100 bg-white text-xl font-black text-[#2563EB] shadow-sm">
                  92%
                </div>

              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">

                {["Erfahrung", "Standort", "Skills"].map((item) => (

                  <div
                    key={item}
                    className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                  >

                    <p className="text-xs font-black uppercase tracking-wider text-[#94A3B8]">
                      {item}
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">
                        ✓
                      </span>

                      <span className="text-sm font-bold text-[#475569]">
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

      {/* ===================================================== */}
      {/* CTA */}
      {/* ===================================================== */}

      <section className="bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32">

        <div className="mx-auto max-w-6xl rounded-[38px] bg-[#2563EB] px-7 py-20 text-center shadow-[0_30px_90px_rgba(37,99,235,.20)] sm:px-12">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
              Bereit?
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl">

              Der nächste passende

              <br />

              Schritt beginnt hier.

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Erstelle dein professionelles Profil oder starte als Unternehmen
              und finde Menschen, die wirklich zu dir passen.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              <Link
                href="/registrieren?role=employee"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#2563EB] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/registrieren?role=employer"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Für Unternehmen
              </Link>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="border-t border-[#E2E8F0] bg-white px-5 py-12 sm:px-8 lg:px-10">

        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/"
              className="text-xl font-black tracking-[-0.07em] text-[#0F172A]"
            >
              STOYAN
            </Link>

            <p className="mt-2 text-sm text-[#94A3B8]">
              Menschen finden. Potenzial erkennen.
            </p>

          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#64748B]">

            {navigation.map((item) => (

              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-[#2563EB]"
              >
                {item.label}
              </a>

            ))}

            <Link
              href="/login"
              className="transition hover:text-[#2563EB]"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  )
}
