export const dynamic = "force-dynamic"

import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const benefits = [
  {
    title: "Professionelle Profile",
    text: "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Skills und Persönlichkeit an einem Ort.",
  },
  {
    title: "Gezielte Suche",
    text: "Unternehmen definieren ihre Anforderungen und finden passende Fachkräfte.",
  },
  {
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht beide Seiten und macht passende Möglichkeiten sichtbar.",
  },
]

const steps = [
  {
    number: "01",
    title: "Profil erstellen",
    text: "Arbeitnehmer erstellen ein professionelles Profil mit Erfahrung, Ausbildung, Skills und persönlichen Wünschen.",
  },
  {
    number: "02",
    title: "Anforderungen definieren",
    text: "Unternehmen bestimmen, welche Fähigkeiten, Erfahrung, Standort und Bedingungen sie für ihre Stelle suchen.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht die Angaben und zeigt passende Kandidaten übersichtlich und nachvollziehbar an.",
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
    <main className="min-h-screen overflow-x-hidden bg-[#edf8fc] text-slate-950">

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            href="/"
            className="text-2xl font-black tracking-[-0.06em] text-slate-950"
          >
            STOYAN
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#vorteile"
              className="text-sm font-semibold text-slate-600 transition hover:text-sky-500"
            >
              Vorteile
            </a>

            <a
              href="#so-funktioniert"
              className="text-sm font-semibold text-slate-600 transition hover:text-sky-500"
            >
              So funktioniert&apos;s
            </a>

            <a
              href="#arbeitnehmer"
              className="text-sm font-semibold text-slate-600 transition hover:text-sky-500"
            >
              Arbeitnehmer
            </a>

            <a
              href="#arbeitgeber"
              className="text-sm font-semibold text-slate-600 transition hover:text-sky-500"
            >
              Arbeitgeber
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Registrieren
            </Link>
          </div>

        </div>
      </header>


      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">

            <ScrollReveal>
              <div className="flex min-h-[620px] flex-col justify-center rounded-[38px] border border-white bg-white px-7 py-14 shadow-[0_30px_100px_rgba(30,64,175,.09)] sm:px-12 lg:px-16">

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Job Matching Plattform
                </div>

                <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
                  Menschen finden.
                  <br />
                  <span className="text-sky-500">
                    Potenzial erkennen.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Stoyan verbindet Arbeitnehmer und Unternehmen.
                  Professionelle Profile, gezielte Suche und intelligentes
                  Matching auf einer modernen Plattform.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">

                  <Link
                    href="/registrieren?role=employee"
                    className="rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-[0_14px_35px_rgba(14,165,233,.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Als Arbeitnehmer starten
                  </Link>

                  <Link
                    href="/registrieren?role=employer"
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Als Unternehmen starten
                  </Link>

                </div>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-500">

                  <span>
                    <span className="mr-2 text-sky-500">✓</span>
                    Professionelle Profile
                  </span>

                  <span>
                    <span className="mr-2 text-sky-500">✓</span>
                    Intelligentes Matching
                  </span>

                  <span>
                    <span className="mr-2 text-sky-500">✓</span>
                    Für beide Seiten
                  </span>

                </div>

              </div>
            </ScrollReveal>


            <ScrollReveal className="[transition-delay:120ms]">
              <div className="relative flex min-h-[620px] items-center justify-center overflow-hidden rounded-[38px] border border-white bg-sky-50 shadow-[0_30px_100px_rgba(30,64,175,.08)]">

                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

                <div className="relative w-full max-w-[390px] px-6">

                  <div className="rounded-[32px] border border-white bg-white p-5 shadow-[0_25px_70px_rgba(30,64,175,.13)]">

                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          STOYAN MATCH
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-950">
                          Passende Fachkraft
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-lg font-black text-sky-500">
                        92%
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-lg font-black text-white">
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

                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                          BMW
                        </span>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                          Diagnose
                        </span>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                          MFK
                        </span>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-sky-50 p-4">
                        <p className="text-xs font-bold text-slate-400">
                          Pensum
                        </p>
                        <p className="mt-1 font-black text-slate-950">
                          80–100 %
                        </p>
                      </div>

                      <div className="rounded-2xl bg-sky-50 p-4">
                        <p className="text-xs font-bold text-slate-400">
                          Standort
                        </p>
                        <p className="mt-1 font-black text-slate-950">
                          Luzern
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="absolute -bottom-7 -left-2 rounded-2xl border border-white bg-white px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,.12)] sm:-left-8">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Stoyan
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-950">
                      Match gefunden
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Schnell · gezielt · transparent
                    </p>

                  </div>

                </div>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>


      {/* ========================= */}
      {/* VORTEILE */}
      {/* ========================= */}

      <section
        id="vorteile"
        className="px-4 py-6 sm:px-6 sm:py-8"
      >

        <div className="mx-auto max-w-7xl rounded-[38px] border border-white bg-white px-7 py-14 shadow-[0_25px_80px_rgba(30,64,175,.07)] sm:px-12 lg:px-16">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              Warum STOYAN?
            </p>

            <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:items-end">

              <h2 className="text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-5xl">
                Die Verbindung zwischen
                <br />
                <span className="text-sky-500">
                  Menschen und Unternehmen.
                </span>
              </h2>

              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Stoyan macht die Jobsuche und Mitarbeitersuche einfacher.
                Beide Seiten können sich professionell präsentieren und
                schneller zueinander finden.
              </p>

            </div>

          </ScrollReveal>


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

                <article className="group rounded-[26px] bg-[#f5fbfe] p-7 transition duration-500 hover:-translate-y-1 hover:bg-sky-50">

                  <div className="h-2 w-12 rounded-full bg-sky-500 transition-all duration-500 group-hover:w-20" />

                  <h3 className="mt-7 text-xl font-black text-slate-950">
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


      {/* ========================= */}
      {/* SO FUNKTIONIERT */}
      {/* ========================= */}

      <section
        id="so-funktioniert"
        className="px-4 py-6 sm:px-6 sm:py-8"
      >

        <div className="mx-auto max-w-7xl rounded-[38px] border border-white bg-white px-7 py-14 shadow-[0_25px_80px_rgba(30,64,175,.07)] sm:px-12 lg:px-16">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              So funktioniert&apos;s
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Drei Schritte.
              <br />
              <span className="text-sky-500">
                Ein besseres Match.
              </span>
            </h2>

          </ScrollReveal>


          <div className="mt-10 divide-y divide-slate-100">

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

                <div className="grid gap-5 py-9 md:grid-cols-[120px_1fr_1.3fr] md:items-center">

                  <div className="text-5xl font-black tracking-[-0.06em] text-sky-100">
                    {step.number}
                  </div>

                  <h3 className="text-2xl font-black text-slate-950">
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


      {/* ========================= */}
      {/* ARBEITNEHMER */}
      {/* ========================= */}

      <section
        id="arbeitnehmer"
        className="px-4 py-6 sm:px-6 sm:py-8"
      >

        <div className="mx-auto grid max-w-7xl gap-8 rounded-[38px] border border-white bg-white p-5 shadow-[0_25px_80px_rgba(30,64,175,.07)] lg:grid-cols-[.85fr_1.15fr]">

          <ScrollReveal>

            <div className="relative h-full min-h-[480px] overflow-hidden rounded-[30px] bg-sky-50">

              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl" />

              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />

              <div className="relative flex h-full min-h-[480px] items-center justify-center p-8">

                <div className="w-full max-w-[330px] rounded-[28px] border border-white bg-white p-6 shadow-[0_25px_60px_rgba(30,64,175,.10)]">

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                    Dein Profil
                  </p>

                  <div className="mt-6 flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-black text-white">
                      T
                    </div>

                    <div>
                      <p className="font-black text-slate-950">
                        Dein Profil
                      </p>

                      <p className="text-sm text-slate-500">
                        Professionell präsentiert
                      </p>
                    </div>

                  </div>

                  <div className="mt-7 space-y-3">

                    <div className="h-3 rounded-full bg-slate-100" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                    <div className="h-3 w-3/5 rounded-full bg-slate-100" />

                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">

                    <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600">
                      Skills
                    </span>

                    <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600">
                      Erfahrung
                    </span>

                    <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600">
                      Ausbildung
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </ScrollReveal>


          <ScrollReveal className="[transition-delay:120ms]">

            <div className="px-3 py-8 sm:px-8 lg:px-10 lg:py-12">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                Für Arbeitnehmer
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-5xl">
                Zeig, wer du bist.
                <br />
                <span className="text-sky-500">
                  Nicht nur deinen Lebenslauf.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Erstelle dein persönliches Profil und zeige Unternehmen,
                was dich ausmacht, was du kannst und wonach du suchst.
              </p>

              <div className="mt-8 grid gap-2 sm:grid-cols-2">

                {employeeFeatures.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700"
                  >

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-600">
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
                Profil erstellen
              </Link>

            </div>

          </ScrollReveal>

        </div>

      </section>


      {/* ========================= */}
      {/* ARBEITGEBER */}
      {/* ========================= */}

      <section
        id="arbeitgeber"
        className="px-4 py-6 sm:px-6 sm:py-8"
      >

        <div className="mx-auto max-w-7xl rounded-[38px] border border-white bg-white px-7 py-14 shadow-[0_25px_80px_rgba(30,64,175,.07)] sm:px-12 lg:px-16">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              Für Unternehmen
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-5xl">
              Die richtige Person.
              <br />
              <span className="text-sky-500">
                Nicht einfach irgendeine Bewerbung.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Definieren Sie Ihre Anforderungen und lassen Sie Stoyan
              passende Fachkräfte übersichtlich darstellen.
            </p>

          </ScrollReveal>


          <ScrollReveal className="mt-10 [transition-delay:120ms]">

            <div className="overflow-hidden rounded-[28px] border border-slate-100">

              <div className="grid bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-[0.15em] text-slate-400 sm:grid-cols-2">
                <span>Anforderung</span>
                <span>Gesucht</span>
              </div>

              {employerCriteria.map(([label, value]) => (

                <div
                  key={label}
                  className="grid gap-2 border-t border-slate-100 px-5 py-5 sm:grid-cols-2 sm:items-center"
                >

                  <span className="text-sm font-bold text-slate-500">
                    {label}
                  </span>

                  <span className="font-black text-slate-950">
                    {value}
                  </span>

                </div>

              ))}

            </div>

          </ScrollReveal>


          <div className="mt-8">

            <Link
              href="/registrieren?role=employer"
              className="inline-flex rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Unternehmen registrieren
            </Link>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* CTA */}
      {/* ========================= */}

      <section className="px-4 py-8 sm:px-6">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[38px] bg-slate-950 px-7 py-16 text-white shadow-[0_30px_100px_rgba(15,23,42,.18)] sm:px-12 lg:px-16">

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
                STOYAN
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-5xl">
                Bereit für den nächsten Schritt?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Erstelle dein Profil oder starte als Unternehmen und finde
                die passende Verbindung.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/registrieren?role=employee"
                className="rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white transition hover:bg-sky-400"
              >
                Arbeitnehmer
              </Link>

              <Link
                href="/registrieren?role=employer"
                className="rounded-xl border border-slate-700 px-6 py-3.5 font-bold text-white transition hover:bg-slate-800"
              >
                Unternehmen
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="px-5 py-10 sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xl font-black tracking-[-0.05em] text-slate-950">
              STOYAN
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Menschen finden. Potenzial erkennen.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500">

            <Link
              href="/impressum"
              className="transition hover:text-sky-500"
            >
              Impressum
            </Link>

            <Link
              href="/datenschutz"
              className="transition hover:text-sky-500"
            >
              Datenschutz
            </Link>

            <Link
              href="/login"
              className="transition hover:text-sky-500"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </main>
  )
}
