import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const employeeFeatures = [
  "Profilbild & Bilder",
  "Ausbildung & Erfahrung",
  "Skills & Sprachen",
  "Wunschlohn & Pensum",
  "Arbeitsort & Umkreis",
  "Verfügbarkeit",
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Arbeitnehmer zeigen Erfahrung, Ausbildung, Skills und ihre persönlichen Wünsche.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen legen fest, welche Fähigkeiten und Bedingungen sie für eine Stelle suchen.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht beide Seiten und präsentiert passende Profile nach Match.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030508] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[650px] w-[650px] rounded-full bg-blue-600/[0.12] blur-[150px]" />
        <div className="absolute right-[-15%] top-[15%] h-[600px] w-[600px] rounded-full bg-violet-600/[0.10] blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#030508]/75 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group text-2xl font-black tracking-[-0.04em]"
          >
            Stoyan
            <span className="text-blue-400 transition group-hover:text-cyan-300">
              .
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a
              href="#so-funktioniert"
              className="transition hover:text-white"
            >
              So funktioniert&apos;s
            </a>
            <a
              href="#arbeitnehmer"
              className="transition hover:text-white"
            >
              Arbeitnehmer
            </a>
            <a
              href="#arbeitgeber"
              className="transition hover:text-white"
            >
              Arbeitgeber
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-bold transition duration-300 hover:border-blue-400/40 hover:bg-blue-500/10"
          >
            Firmen-Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.07] px-4 py-2 text-xs font-bold text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.9)]" />
              JOB MATCHING DER NÄCHSTEN GENERATION
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
              Menschen finden.
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Potenzial erkennen.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
              Stoyan verbindet Menschen und Unternehmen. Erstelle ein starkes
              Profil, definiere deine Anforderungen und entdecke passende
              Matches.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/registrieren?role=employee"
                className="group relative overflow-hidden rounded-full bg-white px-7 py-3.5 font-bold text-slate-950 shadow-[0_0_40px_rgba(96,165,250,.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <span className="relative z-10">
                  Als Arbeitnehmer starten
                </span>
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
              >
                Für Firmen einloggen
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Professionelle Profile
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Intelligentes Matching
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Für beide Seiten
              </div>
            </div>
          </ScrollReveal>

          {/* HERO CARD */}
          <ScrollReveal className="[transition-delay:140ms]">
            <div className="relative">
              <div className="absolute -inset-8 rounded-[50px] bg-blue-500/[0.08] blur-3xl" />

              <div className="relative rounded-[32px] border border-white/10 bg-white/[0.045] p-2 shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#0a0e15]">
                  <img
                    src="/images/employer.svg"
                    alt="Modernes Unternehmen bei Stoyan"
                    className="aspect-[4/3] h-full w-full object-cover opacity-90"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-transparent" />

                  {/* Floating match */}
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#080b11]/90 p-5 shadow-2xl backdrop-blur-xl sm:left-7 sm:right-auto sm:w-[390px]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Perfektes Match
                        </p>

                        <h2 className="mt-2 text-lg font-black">
                          Automobil-Mechatroniker EFZ
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Luzern · 100 % · 6 Jahre Erfahrung
                        </p>
                      </div>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                        96 %
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["BMW", "Diagnose", "MFK"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.07] sm:grid-cols-4">
          {[
            ["01", "Profil", "Deine Stärken"],
            ["02", "Kriterien", "Deine Anforderungen"],
            ["03", "Match", "Passende Menschen"],
            ["04", "Kontakt", "Neue Möglichkeiten"],
          ].map(([number, title, text]) => (
            <div key={number} className="px-5 py-8 sm:px-8">
              <p className="text-xs font-black tracking-[0.2em] text-blue-400">
                {number}
              </p>
              <p className="mt-2 font-black">{title}</p>
              <p className="mt-1 text-xs text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="so-funktioniert" className="relative">
        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
                So funktioniert&apos;s
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Einfacher finden.
                <br />
                Besser matchen.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-500">
                Beide Seiten geben an, was sie suchen und was sie mitbringen.
                Stoyan bringt die Informationen zusammen.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
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
                <article className="group relative h-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.045]">
                  <div className="absolute right-[-30px] top-[-30px] text-[130px] font-black leading-none text-white/[0.025] transition group-hover:text-blue-400/[0.06]">
                    {step.number}
                  </div>

                  <div className="relative">
                    <span className="text-sm font-black text-blue-400">
                      {step.number}
                    </span>

                    <h3 className="mt-6 text-2xl font-black">
                      {step.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EMPLOYEE */}
      <section
        id="arbeitnehmer"
        className="border-y border-white/[0.07] bg-white/[0.015]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[40px] bg-blue-500/[0.06] blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#090d13] p-2 shadow-2xl">
                <div className="overflow-hidden rounded-[24px]">
                  <img
                    src="/images/employee.svg"
                    alt="Arbeitnehmerprofil auf Stoyan"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              Für Arbeitnehmer
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[1] tracking-[-0.05em] sm:text-5xl">
              Zeig, wer du bist.
              <br />
              <span className="text-slate-500">
                Nicht nur deinen Lebenslauf.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Erstelle ein modernes Profil und zeige Unternehmen deine
              Erfahrung, Fähigkeiten, Wünsche und Persönlichkeit.
            </p>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {employeeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-sm font-semibold text-slate-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-400">
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/registrieren?role=employee"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Profil erstellen
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* EMPLOYER */}
      <section id="arbeitgeber">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
          <ScrollReveal>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              Für Arbeitgeber
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[1] tracking-[-0.05em] sm:text-5xl">
              Suchen Sie nicht länger.
              <br />
              <span className="text-slate-500">
                Finden Sie passende Menschen.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Definieren Sie Ihre Anforderungen und entdecken Sie Kandidaten,
              die zu Ihrer Stelle passen.
            </p>

            {/* Search preview */}
            <div className="mt-9 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-black">Kandidatensuche</p>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Aktiv
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Position", "Automobil-Mechatroniker"],
                  ["Standort", "Luzern + 30 km"],
                  ["Erfahrung", "5+ Jahre"],
                  ["Skills", "Diagnose · BMW · MFK"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/[0.06] bg-black/20 p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="mt-4 inline-flex rounded-full bg-blue-500 px-6 py-3 font-bold text-white shadow-[0_10px_35px_rgba(59,130,246,.18)] transition hover:bg-blue-400"
              >
                Kandidaten suchen
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:140ms]">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-violet-500/[0.05] blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#090d13] p-2">
                <div className="relative overflow-hidden rounded-[24px]">
                  <img
                    src="/images/office.svg"
                    alt="Unternehmensumfeld"
                    className="aspect-[4/5] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#080b11]/90 p-5 backdrop-blur-xl">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Stoyan Match
                        </p>

                        <p className="mt-2 text-lg font-black">
                          Max Muster
                        </p>

                        <p className="text-sm text-slate-400">
                          Automobil-Mechatroniker
                        </p>
                      </div>

                      <p className="text-4xl font-black text-blue-400">
                        96%
                      </p>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-blue-500 to-violet-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.07]">
        <div className="absolute inset-0 bg-blue-500/[0.025]" />

        <div className="relative mx-auto max-w-5xl px-5 py-32 text-center sm:px-8">
          <ScrollReveal>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              ✦
            </div>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              Stoyan
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Der nächste passende Mensch ist näher,
              <span className="text-slate-500"> als du denkst.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Ein professionelles Profil für Arbeitnehmer. Eine gezielte
              Suche für Unternehmen. Ein System, das beide Seiten
              zusammenführt.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/registrieren?role=employee"
                className="rounded-full bg-white px-7 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Als Arbeitnehmer starten
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-bold transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                Für Firmen einloggen
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07] bg-[#020305]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-[-0.04em]"
          >
            Stoyan<span className="text-blue-400">.</span>
          </Link>

          <p className="text-sm text-slate-600">
            Job Matching für Arbeitnehmer und Unternehmen.
          </p>
        </div>
      </footer>
    </main>
  )
}
