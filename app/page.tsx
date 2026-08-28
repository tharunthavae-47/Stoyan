import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const benefits = [
  {
    number: "01",
    title: "Professionelle Profile",
    text: "Arbeitnehmer präsentieren Erfahrung, Ausbildung, Skills und Persönlichkeit an einem Ort.",
  },
  {
    number: "02",
    title: "Gezielte Suche",
    text: "Unternehmen definieren ihre Anforderungen und finden passende Fachkräfte.",
  },
  {
    number: "03",
    title: "Intelligentes Matching",
    text: "Stoyan vergleicht beide Seiten und macht passende Möglichkeiten sichtbar.",
  },
]

const employeeFeatures = [
  "Profilbild & persönliche Bilder",
  "Ausbildung & Erfahrung",
  "Skills & Sprachen",
  "Wunschlohn & Pensum",
  "Arbeitsort & Umkreis",
  "Verfügbarkeit",
]

const employerCriteria = [
  ["Beruf", "Automobil-Mechatroniker"],
  ["Ort", "Luzern + 30 km"],
  ["Erfahrung", "5+ Jahre"],
  ["Pensum", "80–100 %"],
  ["Skills", "Diagnose · BMW · MFK"],
  ["Match", "ab 85 %"],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#edf8fc] text-slate-950">

      {/* ========================================================= */}
      {/* SOFTER BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-sky-200/50 blur-[110px]" />
        <div className="absolute right-[-180px] top-[15%] h-[600px] w-[600px] rounded-full bg-cyan-100/70 blur-[130px]" />
        <div className="absolute bottom-[-220px] left-[25%] h-[550px] w-[550px] rounded-full bg-blue-100/60 blur-[120px]" />
      </div>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="px-4 pt-5 sm:px-6 sm:pt-8">
        <div className="mx-auto max-w-6xl">

          <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_.9fr]">

            {/* LINKER TEXT-BEREICH */}

            <ScrollReveal>
              <div className="rounded-[42px] border border-white/90 bg-white px-7 py-14 shadow-[0_30px_90px_rgba(30,64,175,.10)] sm:px-12 sm:py-16 lg:px-14">

                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
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
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
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

            {/* RECHTES KLEINES BILD */}

            <ScrollReveal className="[transition-delay:120ms]">
              <div className="relative flex justify-center lg:justify-end">

                <div className="absolute right-0 top-10 h-44 w-44 rounded-full bg-sky-200/60 blur-3xl" />

                <div className="relative w-full max-w-[400px]">

                  <div className="rounded-[38px] border border-white/90 bg-white p-3 shadow-[0_25px_70px_rgba(30,64,175,.13)]">

                    <div className="overflow-hidden rounded-[30px] bg-slate-100">

                      <img
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85"
                        alt="Professionelles Team in einem modernen Arbeitsumfeld"
                        className="h-[300px] w-full object-cover sm:h-[350px]"
                      />

                    </div>

                  </div>

                  <div className="absolute -bottom-6 left-3 rounded-[24px] border border-white/90 bg-white px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,.12)] sm:-left-6">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Stoyan
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-950">
                      Passende Menschen finden
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

      {/* ========================================================= */}
      {/* WAS IST STOYAN */}
      {/* ========================================================= */}

      <section className="px-4 py-7 sm:px-6">

        <div className="mx-auto max-w-6xl rounded-[42px] border border-white/90 bg-white px-7 py-14 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-12 lg:px-14">

          <ScrollReveal>

            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                  Was ist Stoyan?
                </p>

                <h2 className="mt-4 text-4xl font-black leading-[.98] tracking-[-0.055em] text-slate-950 sm:text-5xl">
                  Ein moderner Weg,
                  <br />
                  <span className="text-sky-500">
                    Menschen zu verbinden.
                  </span>
                </h2>
              </div>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Eine Plattform für Menschen und Unternehmen, die nicht einfach
                irgendwelche Kontakte suchen, sondern die passenden.
              </p>

            </div>

          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">

            {benefits.map((benefit, index) => (
              <ScrollReveal
                key={benefit.number}
                className={
                  index === 1
                    ? "[transition-delay:100ms]"
                    : index === 2
                      ? "[transition-delay:200ms]"
                      : ""
                }
              >

                <article className="group rounded-[28px] bg-[#f4fbfe] p-7 transition duration-500 hover:-translate-y-1 hover:bg-sky-50">

                  <span className="text-sm font-black text-sky-500">
                    {benefit.number}
                  </span>

                  <h3 className="mt-5 text-xl font-black tracking-[-0.02em] text-slate-950">
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

      {/* ========================================================= */}
      {/* SO FUNKTIONIERT */}
      {/* ========================================================= */}

      <section
        id="so-funktioniert"
        className="px-4 py-2 sm:px-6"
      >

        <div className="mx-auto max-w-6xl rounded-[42px] border border-white/90 bg-white px-7 py-14 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-12 lg:px-14">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
              So funktioniert&apos;s
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-slate-950 sm:text-5xl">
              Einfach.
              <br />
              <span className="text-sky-500">
                Übersichtlich.
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

                <div className="grid gap-5 py-8 md:grid-cols-[75px_1fr_1.25fr] md:items-center">

                  <span className="text-3xl font-black tracking-[-0.05em] text-sky-500">
                    {step.number}
                  </span>

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

      {/* ========================================================= */}
      {/* ARBEITNEHMER */}
      {/* ========================================================= */}

      <section
        id="arbeitnehmer"
        className="px-4 py-7 sm:px-6"
      >

        <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[42px] border border-white/90 bg-white p-4 shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[.72fr_1.28fr] lg:p-5">

          {/* kleines Bild links */}

          <ScrollReveal>

            <div className="relative overflow-hidden rounded-[32px] bg-slate-100">

              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85"
                alt="Professionelle Arbeitnehmerin"
                className="h-[360px] w-full object-cover"
              />

            </div>

          </ScrollReveal>

          {/* Text rechts */}

          <ScrollReveal className="[transition-delay:120ms]">

            <div className="px-4 py-8 sm:px-8 lg:px-10">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                Für Arbeitnehmer
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[.98] tracking-[-0.055em] text-slate-950 sm:text-5xl">
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
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
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

      {/* ========================================================= */}
      {/* ARBEITGEBER */}
      {/* ========================================================= */}

      <section
        id="arbeitgeber"
        className="px-4 py-2 sm:px-6"
      >

        <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[42px] border border-white/90 bg-white p-4 shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[1.2fr_.8fr] lg:p-5">

          {/* Text links */}

          <ScrollReveal>

            <div className="px-4 py-8 sm:px-8 lg:px-10">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                Für Arbeitgeber
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[.98] tracking-[-0.055em] text-slate-950 sm:text-5xl">
                Finden Sie die
                <br />
                <span className="text-sky-500">
                  richtigen Menschen.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Definieren Sie Ihre Anforderungen und erhalten Sie eine
                strukturierte Auswahl passender Arbeitnehmer.
              </p>

              <div className="mt-8 rounded-[28px] bg-[#f4fbfe] p-5">

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

                <div className="mt-5 grid gap-2 sm:grid-cols-2">

                  {employerCriteria.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white px-4 py-3 shadow-sm"
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
                  href="/login"
                  className="mt-5 inline-flex rounded-xl bg-sky-500 px-6 py-3 font-bold text-white transition hover:bg-sky-600"
                >
                  Kandidaten suchen
                </Link>

              </div>

            </div>

          </ScrollReveal>

          {/* kleines Bild rechts */}

          <ScrollReveal className="[transition-delay:120ms]">

            <div className="relative flex justify-center px-2 py-4 lg:justify-end">

              <div className="overflow-hidden rounded-[32px] border border-white bg-slate-100 p-2 shadow-[0_20px_60px_rgba(30,64,175,.10)]">

                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85"
                  alt="Professioneller Mitarbeiter"
                  className="h-[370px] w-full max-w-[340px] rounded-[26px] object-cover"
                />

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="px-4 py-7 pb-8 sm:px-6">

        <div className="mx-auto max-w-6xl rounded-[42px] bg-sky-500 px-7 py-16 text-center text-white shadow-[0_30px_80px_rgba(14,165,233,.20)] sm:px-12">

          <ScrollReveal>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
              Stoyan
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
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

    </main>
  )
}
