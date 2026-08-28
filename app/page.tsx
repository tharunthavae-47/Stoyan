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
    text: "Unternehmen legen fest, welche Fähigkeiten, Erfahrung, Standort und weitere Kriterien sie suchen.",
  },
  {
    number: "03",
    title: "Passende Menschen finden",
    text: "Stoyan vergleicht die Angaben und zeigt passende Arbeitnehmer übersichtlich nach Match an.",
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

const profileCards = [
  {
    image: "/images/employee.svg",
    name: "Max Muster",
    job: "Automobil-Mechatroniker EFZ",
    place: "Luzern",
    match: "96 %",
  },
  {
    image: "/images/office.svg",
    name: "Anna Keller",
    job: "Technische Mitarbeiterin",
    place: "Zürich",
    match: "92 %",
  },
  {
    image: "/images/employer.svg",
    name: "David Meier",
    job: "IT Support Specialist",
    place: "Rotkreuz",
    match: "89 %",
  },
  {
    image: "/images/employee.svg",
    name: "Nina Baumann",
    job: "Detailhandel & Verkauf",
    place: "Luzern",
    match: "87 %",
  },
  {
    image: "/images/office.svg",
    name: "Jonas Frei",
    job: "Logistikfachmann",
    place: "Emmen",
    match: "94 %",
  },
  {
    image: "/images/employer.svg",
    name: "Laura Schmid",
    job: "Administration",
    place: "Zug",
    match: "91 %",
  },
  {
    image: "/images/employee.svg",
    name: "Simon Weber",
    job: "Polymechaniker",
    place: "Kriens",
    match: "95 %",
  },
  {
    image: "/images/office.svg",
    name: "Sarah Meier",
    job: "Kauffrau EFZ",
    place: "Luzern",
    match: "90 %",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#edf8fc] text-slate-950">

      {/* -------------------------------------------------- */}
      {/* BACKGROUND */}
      {/* -------------------------------------------------- */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-sky-200/50 blur-[110px]" />
        <div className="absolute right-[-180px] top-[20%] h-[600px] w-[600px] rounded-full bg-cyan-100/70 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-100/70 blur-[120px]" />
      </div>

      {/* -------------------------------------------------- */}
      {/* NAVIGATION */}
      {/* -------------------------------------------------- */}

      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between rounded-full border border-white/90 bg-white/90 px-5 shadow-[0_12px_40px_rgba(15,23,42,.08)] backdrop-blur-xl sm:px-7">

          <Link
            href="/"
            className="text-[25px] font-black tracking-[-0.06em] text-slate-950"
          >
            Stoyan
            <span className="text-sky-500">.</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a
              href="#so-funktioniert"
              className="transition-colors hover:text-sky-600"
            >
              So funktioniert&apos;s
            </a>

            <a
              href="#arbeitnehmer"
              className="transition-colors hover:text-sky-600"
            >
              Arbeitnehmer
            </a>

            <a
              href="#arbeitgeber"
              className="transition-colors hover:text-sky-600"
            >
              Arbeitgeber
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Firmen-Login
            </Link>
          </div>
        </nav>
      </header>

      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}

      <section className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] border border-white/90 bg-white shadow-[0_30px_90px_rgba(30,64,175,.10)] lg:grid-cols-[1.04fr_.96fr]">

          <ScrollReveal>
            <div className="flex h-full flex-col justify-center px-7 py-14 sm:px-12 sm:py-20 lg:px-14">

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-600">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Job Matching Plattform
              </div>

              <h1 className="mt-6 max-w-[650px] text-5xl font-black leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[68px]">
                Menschen finden.
                <br />
                <span className="text-sky-500">
                  Potenzial erkennen.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Arbeitnehmer präsentieren sich professionell.
                Unternehmen finden gezielt Menschen, die zu ihren
                Anforderungen passen.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/registrieren?role=employee"
                  className="rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
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

          <ScrollReveal className="[transition-delay:120ms]">
            <div className="relative min-h-[430px] overflow-hidden bg-slate-100 lg:min-h-full">

              <img
                src="/images/employer.svg"
                alt="Unternehmen bei Stoyan"
                className="h-full min-h-[430px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Perfektes Match
                    </p>

                    <h2 className="mt-2 text-lg font-black text-slate-950">
                      Automobil-Mechatroniker EFZ
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Luzern · 100 % · 6 Jahre Erfahrung
                    </p>
                  </div>

                  <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                    96 %
                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {["BMW", "Diagnose", "MFK"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}

                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* PROFILE */}
      {/* -------------------------------------------------- */}

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/90 bg-white px-5 py-8 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-8 sm:py-10">

          <ScrollReveal>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                  Profile entdecken
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                  Menschen hinter dem Lebenslauf.
                </h2>

                <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                  Ein Profil zeigt mehr als nur einen Lebenslauf:
                  Erfahrung, Persönlichkeit, Skills und Wünsche.
                </p>
              </div>

              <Link
                href="/registrieren?role=employee"
                className="hidden rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-100 sm:inline-flex"
              >
                Eigenes Profil erstellen
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {profileCards.map((profile, index) => (
              <ScrollReveal
                key={`${profile.name}-${index}`}
                className={
                  index % 4 === 1
                    ? "[transition-delay:80ms]"
                    : index % 4 === 2
                      ? "[transition-delay:140ms]"
                      : index % 4 === 3
                        ? "[transition-delay:200ms]"
                        : ""
                }
              >
                <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_26px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,.12)]">

                  <div className="relative aspect-[4/4.7] overflow-hidden bg-slate-100">

                    <img
                      src={profile.image}
                      alt={`${profile.name} – ${profile.job}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-emerald-700 shadow-sm backdrop-blur">
                      {profile.match} Match
                    </div>

                  </div>

                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-slate-950">
                          {profile.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                          {profile.job}
                        </p>
                      </div>

                    </div>

                    <p className="mt-3 text-[11px] font-bold text-slate-400">
                      {profile.place}
                    </p>

                  </div>
                </article>
              </ScrollReveal>
            ))}

          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* HOW IT WORKS */}
      {/* -------------------------------------------------- */}

      <section
        id="so-funktioniert"
        className="px-4 py-4 sm:px-6"
      >
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/90 bg-white px-6 py-14 shadow-[0_24px_70px_rgba(30,64,175,.08)] sm:px-10 lg:px-12">

          <ScrollReveal>
            <div className="max-w-2xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                So funktioniert&apos;s
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Einfacher finden.
                <br />
                <span className="text-sky-500">
                  Besser matchen.
                </span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Arbeitnehmer präsentieren sich.
                Unternehmen definieren ihre Anforderungen.
                Stoyan bringt beide Seiten zusammen.
              </p>

            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">

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
                <article className="group relative h-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-7 transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,.08)]">

                  <div className="absolute right-[-15px] top-[-25px] select-none text-[125px] font-black leading-none text-slate-200/70 transition duration-500 group-hover:text-sky-100">
                    {step.number}
                  </div>

                  <div className="relative">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-sm font-black text-white shadow-lg shadow-sky-500/20">
                      {step.number}
                    </div>

                    <h3 className="mt-7 text-2xl font-black tracking-[-0.03em] text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-500">
                      {step.text}
                    </p>

                  </div>

                </article>
              </ScrollReveal>
            ))}

          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* EMPLOYEE */}
      {/* -------------------------------------------------- */}

      <section
        id="arbeitnehmer"
        className="px-4 py-4 sm:px-6"
      >
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] border border-white/90 bg-white shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[.9fr_1.1fr]">

          <ScrollReveal>
            <div className="relative h-full min-h-[500px] overflow-hidden bg-slate-100">

              <img
                src="/images/employee.svg"
                alt="Arbeitnehmerprofil bei Stoyan"
                className="h-full min-h-[500px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur">

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Arbeitnehmerprofil
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">

                  <div>
                    <p className="font-black text-slate-950">
                      Professionelles Profil
                    </p>

                    <p className="text-xs text-slate-500">
                      Sichtbar für passende Unternehmen
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                    Aktiv
                  </span>

                </div>

              </div>

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
                Erstelle ein persönliches Profil und zeige Unternehmen,
                was dich ausmacht, was du kannst und wonach du suchst.
              </p>

              <div className="mt-8 grid gap-2 sm:grid-cols-2">

                {employeeFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700"
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
                className="mt-8 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
              >
                Mein Profil erstellen
              </Link>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* EMPLOYER */}
      {/* -------------------------------------------------- */}

      <section
        id="arbeitgeber"
        className="px-4 py-4 sm:px-6"
      >
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] border border-white/90 bg-white shadow-[0_24px_70px_rgba(30,64,175,.08)] lg:grid-cols-[1.06fr_.94fr]">

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
                Geben Sie Ihre Anforderungen ein und entdecken Sie passende
                Arbeitnehmer auf einen Blick.
              </p>

              {/* SEARCH BOX */}

              <div className="mt-8 rounded-[26px] border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Kandidatensuche
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-950">
                      Ihre Anforderungen
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                    Aktiv
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
                  className="mt-5 inline-flex rounded-xl bg-sky-500 px-6 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
                >
                  Kandidaten suchen
                </Link>

              </div>

            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">

            <div className="relative min-h-[500px] overflow-hidden bg-slate-100">

              <img
                src="/images/office.svg"
                alt="Unternehmen und Recruiting"
                className="h-full min-h-[500px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Stoyan Match
                    </p>

                    <p className="mt-2 text-lg font-black text-slate-950">
                      Automobil-Mechatroniker EFZ
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

      {/* -------------------------------------------------- */}
      {/* FINAL CTA */}
      {/* -------------------------------------------------- */}

      <section className="px-4 py-4 pb-8 sm:px-6">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-sky-500 px-7 py-16 text-center text-white shadow-[0_30px_80px_rgba(14,165,233,.20)] sm:px-12">

          <ScrollReveal>

            <div className="mx-auto max-w-3xl">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
                Stoyan
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
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
                  className="rounded-xl bg-white px-6 py-3.5 font-bold text-sky-700 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  Als Arbeitnehmer starten
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Für Firmen einloggen
                </Link>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* FOOTER */}
      {/* -------------------------------------------------- */}

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
