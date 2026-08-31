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
    title: "Professionelle Profile",
    text: "Erfahrung, Ausbildung, Skills und Persönlichkeit übersichtlich an einem Ort.",
  },
  {
    title: "Gezielte Suche",
    text: "Unternehmen definieren ihre Anforderungen und finden passende Fachkräfte.",
  },
  {
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht relevante Kriterien und macht passende Möglichkeiten sichtbar.",
  },
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Skills und persönliche Wünsche.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen legen Beruf, Standort, Erfahrung, Pensum und gewünschte Skills fest.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht die Angaben und zeigt passende Kandidaten nachvollziehbar an.",
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
  ["Match", "92 %"],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-[1440px]">

          <div className="flex min-h-[76px] items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-4 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:px-6">

            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:scale-105">
                S
              </div>

              <div className="hidden sm:block">
                <div className="text-xl font-black tracking-[-0.06em] text-slate-950">
                  STOYAN
                </div>

                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Menschen verbinden
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="ml-auto hidden items-center gap-2 lg:flex">

              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                >
                  {item.label}
                </a>
              ))}

            </nav>

            {/* Aktionen */}
            <div className="ml-2 flex shrink-0 items-center gap-2">

              <Link
                href="/login"
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:inline-flex"
              >
                Einloggen
              </Link>

              <Link
                href="/registrieren"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Registrieren
              </Link>

            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="mt-2 overflow-x-auto pb-1 lg:hidden">
            <div className="flex min-w-max gap-2">

              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}

            </div>
          </div>

        </div>
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="px-5 pb-24 pt-20 sm:px-8 lg:px-10 lg:pb-32 lg:pt-28">

        <div className="mx-auto max-w-[1440px]">

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">

            <ScrollReveal>

              <div className="max-w-4xl">

                <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />

                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                    Job Matching Plattform
                  </span>
                </div>

                <h1 className="mt-8 text-5xl font-black leading-[0.92] tracking-[-0.075em] text-slate-950 sm:text-7xl lg:text-[88px]">
                  Menschen finden.
                  <br />
                  <span className="text-blue-600">
                    Potenzial erkennen.
                  </span>
                </h1>

                <p className="mt-9 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Stoyan verbindet Arbeitnehmer und Unternehmen.
                  Professionelle Profile, gezielte Suche und intelligentes
                  Matching bringen Menschen und Möglichkeiten zusammen.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600"
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
                      className="flex items-center gap-2 text-sm font-semibold text-slate-500"
                    >
                      <span className="text-blue-600">✓</span>
                      {item}
                    </span>
                  ))}

                </div>

              </div>

            </ScrollReveal>

            {/* Match Card */}

            <ScrollReveal className="[transition-delay:120ms]">

              <div className="relative mx-auto w-full max-w-[500px]">

                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />

                <div className="relative rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_35px_100px_rgba(15,23,42,.10)]">

                  <div className="rounded-[27px] bg-slate-50 p-6 sm:p-7">

                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1.5 text-lg font-black text-slate-950">
                          Passende Fachkraft
                        </p>
                      </div>

                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-blue-100 bg-white text-sm font-black text-blue-600 shadow-sm">
                        92%
                      </div>

                    </div>

                    <div className="mt-7 flex items-center gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-black text-white">
                        A
                      </div>

                      <div>
                        <p className="font-black text-slate-950">
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
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {label}
                          </p>

                          <p className="mt-1.5 text-sm font-bold text-slate-700">
                            {value}
                          </p>
                        </div>
                      ))}

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {["BMW", "Diagnose", "MFK"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>

                <div className="absolute -bottom-7 -left-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Match gefunden
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-950">
                    Schnell · gezielt · transparent
                  </p>

                </div>

              </div>

            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* =====================================================
          ÜBER STOYAN
          ===================================================== */}

      <section
        id="ueber-stoyan"
        className="scroll-mt-32 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px] rounded-[36px] border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-10 lg:p-14">

          <SectionHeading
            label="Über STOYAN"
            title={
              <>
                Ein moderner Weg,
                <br />
                <span className="text-blue-600">
                  Menschen zu verbinden.
                </span>
              </>
            }
            text="Stoyan schafft eine klare Verbindung zwischen Menschen, die Arbeit suchen, und Unternehmen, die passende Fachkräfte suchen."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">

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

                <article className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-black text-blue-600">
                    {index + 1}
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    {benefit.text}
                  </p>

                </article>

              </ScrollReveal>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          SO FUNKTIONIERT'S
          ===================================================== */}

      <section
        id="so-funktioniert"
        className="scroll-mt-32 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px] rounded-[36px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-14">

          <SectionHeading
            label="So funktioniert's"
            title={
              <>
                Ein klarer Weg.
                <br />
                <span className="text-blue-600">
                  Ein passender Match.
                </span>
              </>
            }
            text="Der Prozess bleibt von der Profilerstellung bis zur Kontaktaufnahme einfach, übersichtlich und nachvollziehbar."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">

            {steps.map((step) => (
              <ScrollReveal key={step.number}>

                <article className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                    {step.number}
                  </div>

                  <h3 className="mt-7 text-2xl font-black text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-500">
                    {step.text}
                  </p>

                </article>

              </ScrollReveal>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          ARBEITNEHMER
          ===================================================== */}

      <section
        id="arbeitnehmer"
        className="scroll-mt-32 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px] rounded-[36px] border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-10 lg:p-14">

          <SectionHeading
            label="Arbeitnehmer"
            title={
              <>
                Zeig, wer du bist.
                <br />
                <span className="text-blue-600">
                  Nicht nur deinen Lebenslauf.
                </span>
              </>
            }
            text="Erstelle ein professionelles Profil und zeige Unternehmen, was dich ausmacht, was du kannst und wonach du suchst."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {employeeFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-slate-700 shadow-sm"
              >

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-black text-blue-600">
                  ✓
                </span>

                {feature}

              </div>
            ))}

          </div>

          <Link
            href="/registrieren?role=employee"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Profil erstellen
          </Link>

        </div>

      </section>

      {/* =====================================================
          ARBEITGEBER
          ===================================================== */}

      <section
        id="arbeitgeber"
        className="scroll-mt-32 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px] rounded-[36px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:p-14">

          <SectionHeading
            label="Arbeitgeber"
            title={
              <>
                Finden Sie die
                <br />
                <span className="text-blue-600">
                  richtigen Menschen.
                </span>
              </>
            }
            text="Definieren Sie Ihre Anforderungen und finden Sie schneller Arbeitnehmer, die fachlich und persönlich zu Ihrer Stelle passen."
          />

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">
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

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {employerCriteria.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {value}
                  </p>

                </div>
              ))}

            </div>

            <Link
              href="/registrieren?role=employer"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Kandidaten suchen
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          MATCHING
          ===================================================== */}

      <section
        id="matching"
        className="scroll-mt-32 px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >

        <div className="mx-auto max-w-[1440px] rounded-[36px] border border-blue-100 bg-blue-50/40 p-8 text-center shadow-sm sm:p-14">

          <SectionHeading
            center
            label="Matching"
            title={
              <>
                Der richtige Match
                <br />
                <span className="text-blue-600">
                  beginnt mit den richtigen Daten.
                </span>
              </>
            }
            text="Stoyan bringt relevante Informationen zusammen und macht passende Chancen für beide Seiten sichtbar."
          />

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">

            {[
              ["01", "Profil"],
              ["02", "Anforderungen"],
              ["03", "Match"],
            ].map(([number, title]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <p className="text-3xl font-black text-blue-600">
                  {number}
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {title}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="px-5 pb-10 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1440px] rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-black tracking-tight text-slate-950">
                STOYAN
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Menschen. Unternehmen. Matching.
              </p>
            </div>

            <div className="flex gap-5 text-sm font-semibold text-slate-500">

              <Link
                href="/login"
                className="transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/registrieren"
                className="transition hover:text-blue-600"
              >
                Registrieren
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </main>
  )
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  label,
  title,
  text,
  center = false,
}: {
  label: string
  title: React.ReactNode
  text: string
  center?: boolean
}) {
  return (
    <div
      className={
        center
          ? "mx-auto max-w-4xl text-center"
          : "max-w-5xl"
      }
    >

      <div
        className={`mb-6 flex items-center gap-4 ${
          center ? "justify-center" : ""
        }`}
      >

        <span className="h-2 w-2 rounded-full bg-blue-600" />

        <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
          {label}
        </span>

      </div>

      <h2 className="text-4xl font-black leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      <p
        className={`mt-6 text-lg leading-8 text-slate-500 ${
          center ? "mx-auto" : ""
        } max-w-2xl`}
      >
        {text}
      </p>

    </div>
  )
}
