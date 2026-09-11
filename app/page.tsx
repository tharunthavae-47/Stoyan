import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  Lock,
  MessageSquare,
  SlidersHorizontal,
  UserRound,
} from "lucide-react"
import { SiteFooter } from "@/components/site-footer"

const steps = [
  {
    number: "01",
    title: "Profil ausfüllen",
    text: "Trage deinen Beruf, deine bisherigen Tätigkeiten und deine Vorstellungen zur nächsten Stelle ein.",
    icon: UserRound,
    linkLabel: "Profil erstellen",
    href: "/registrieren?role=employee",
  },
  {
    number: "02",
    title: "Übereinstimmungen ansehen",
    text: "Beruf, Erfahrung, Pensum und Arbeitsort: Unser Matching zeigt, wo Fähigkeiten und Anforderungen zusammenpassen.",
    icon: SlidersHorizontal,
    linkLabel: "Matching kennenlernen",
    href: "/#matching",
  },
  {
    number: "03",
    title: "Kontakt aufnehmen",
    text: "Über eine private Kontaktanfrage kommt ihr miteinander in Verbindung. Der direkte Chat ist ab Professional enthalten.",
    icon: MessageSquare,
    detail: "Kontakt per privater Anfrage",
  },
]

const employeeBenefits = [
  "Ein Profil für Erfahrung und Fähigkeiten",
  "Passende Arbeitgeber auf dich aufmerksam machen",
  "Selbst entscheiden, mit wem du sprichst",
]

const employerBenefits = [
  "Gezielt nach Fähigkeiten und Erfahrung suchen",
  "Profile mit nachvollziehbarem Matching vergleichen",
  "Interessante Kandidaten direkt kontaktieren",
]

const criteria = ["Beruf", "Erfahrung", "Skills", "Ausbildung", "Pensum", "Lohn", "Arbeitsort"]

const matchBars = [
  ["Beruf", 100],
  ["Erfahrung", 95],
  ["Skills", 90],
] as const

export default function HomePage() {
  return (
    <main id="main" className="bg-white text-[#14243a]">
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="mx-auto grid w-[min(1280px,calc(100%-48px))] items-stretch gap-10 pb-12 pt-10 sm:w-[min(1280px,calc(100%-64px))] lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:pt-12"
      >
        <div className="pt-2 lg:pt-8">
          <p className="mb-6 flex items-center gap-2.5 text-[0.72rem] font-semibold leading-relaxed tracking-[0.12em]">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#2356d8]" />
            JOBS UND MITARBEITENDE IN DER SCHWEIZ
          </p>
          <h1
            id="hero-title"
            className="mb-6 text-[clamp(3.25rem,5.5vw,5rem)] font-medium leading-[1.07] tracking-[-0.065em] text-balance"
          >
            Arbeit, die
            <br />
            zu dir <span className="text-[#2356d8]">passt.</span>
          </h1>
          <p className="mb-8 max-w-[430px] text-[1.0625rem] leading-[1.85] text-[#576373]">
            Erstelle dein Profil mit Beruf, Erfahrung und Wunschpensum. Passende Arbeitgeber können dich direkt
            kontaktieren.
          </p>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              href="/registrieren?role=employee"
              className="inline-flex min-h-[54px] items-center gap-7 rounded-[4px] bg-[#2356d8] px-6 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#1844b6]"
            >
              Mein Profil erstellen
              <ArrowRight className="h-[19px] w-[19px]" />
            </Link>
            <Link
              href="/#arbeitgeber"
              className="group inline-flex items-center gap-3 text-[0.875rem] font-medium transition-colors hover:text-[#2356d8]"
            >
              Ich suche Mitarbeitende
              <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[0.75rem] text-[#687384]">
            <Check className="h-4 w-4 text-[#42615a]" />
            Beruf · Erfahrung · Pensum · Arbeitsort
          </p>
        </div>

        <div className="relative min-h-[430px] overflow-hidden rounded-[5px] bg-[#9da9af] lg:min-h-[558px]">
          <img
            src="/editorial-werkstatt.png"
            alt="Ein Mechaniker arbeitet konzentriert an einer Werkbank in einer hellen Werkstatt."
            className="absolute inset-0 h-full w-full object-cover object-[50%_57%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,33,42,0.06) 25%, rgba(16,33,42,0) 40%, rgba(16,33,42,0.79) 100%)",
            }}
          />
          <div className="absolute bottom-16 left-7 right-7 text-white">
            <span className="text-[0.72rem] font-medium tracking-[0.12em]">HANDWERK &amp; TECHNIK</span>
            <strong className="mt-3 block text-[1.75rem] font-normal leading-[1.2] tracking-[-0.035em] sm:text-[2.15rem]">
              Deine Erfahrung
              <br />
              wird gebraucht.
            </strong>
          </div>
        </div>
      </section>

      {/* Benefit bar */}
      <div className="mx-auto grid w-[min(1280px,calc(100%-48px))] grid-cols-1 border-y border-[#dfe4ea] py-3 sm:w-[min(1280px,calc(100%-64px))] sm:grid-cols-3 sm:py-7">
        {[
          { icon: UserRound, label: "Beruf und Erfahrung im Profil" },
          { icon: SlidersHorizontal, label: "Übereinstimmungen nach Kriterien" },
          { icon: MessageSquare, label: "Persönliche Kontaktanfragen" },
        ].map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className={`flex items-center justify-start gap-3 py-3.5 text-[0.875rem] sm:justify-center sm:py-0 ${
              i > 0 ? "sm:border-l sm:border-[#dfe4ea]" : ""
            }`}
          >
            <Icon className="h-[21px] w-[21px] text-[#56728f]" strokeWidth={1.5} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section
        id="so-funktioniert"
        aria-labelledby="how-title"
        className="mx-auto w-[min(1280px,calc(100%-48px))] py-16 sm:w-[min(1280px,calc(100%-64px))] sm:py-24"
      >
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end sm:gap-12">
          <div>
            <p className="mb-4 text-[0.72rem] tracking-[0.1em] text-[#2356d8]">SO FUNKTIONIERT JOBMATCH24</p>
            <h2 id="how-title" className="text-[clamp(2.1rem,3.2vw,2.8rem)] font-medium leading-[1.18] tracking-[-0.05em]">
              Vom Profil zum
              <br />
              ersten Gespräch.
            </h2>
          </div>
          <p className="max-w-[280px] text-[0.9375rem] leading-[1.8] text-[#576373]">
            So funktioniert die Suche auf jobmatch24.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article key={step.number} className="border-t border-[#bec8d4] pt-5">
                <div className="mb-7 flex items-center justify-between">
                  <span className="text-[2.6rem] font-normal leading-none tracking-[-0.06em] text-[#98a7ba]">
                    {step.number}
                  </span>
                  <Icon className="h-[25px] w-[25px] text-[#52708f]" strokeWidth={1.4} />
                </div>
                <h3 className="mb-3.5 text-[1.125rem] font-semibold leading-[1.4] tracking-[-0.025em]">{step.title}</h3>
                <p className="mb-6 text-[1rem] leading-[1.8] text-[#576373]">{step.text}</p>
                {step.href ? (
                  <Link
                    href={step.href}
                    className="group inline-flex items-center gap-3 text-[0.875rem] font-medium text-[#2356d8]"
                  >
                    {step.linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[0.8125rem] text-[#667387]">
                    <Lock className="h-3.5 w-3.5" />
                    {step.detail}
                  </span>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* Audience */}
      <section aria-labelledby="audience-title" className="border-y border-[#e7ecf1] bg-[#f2f5f8] py-16 sm:py-20">
        <div className="mx-auto w-[min(1280px,calc(100%-48px))] sm:w-[min(1280px,calc(100%-64px))]">
          <div className="mb-9">
            <p className="mb-4 text-[0.72rem] tracking-[0.1em] text-[#2356d8]">FÜR ARBEITNEHMER UND ARBEITGEBER</p>
            <h2 id="audience-title" className="text-[clamp(2rem,3vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.05em]">
              Was möchtest du finden?
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Employee card */}
            <article
              id="arbeitnehmer"
              className="flex flex-col items-start rounded-[5px] border border-[#dce3ec] bg-white p-7 sm:p-10"
            >
              <div className="mb-7 flex w-full items-center justify-between text-[0.72rem] font-medium tracking-[0.1em] text-[#2356d8]">
                <span>FÜR ARBEITNEHMER</span>
                <UserRound className="h-[23px] w-[23px]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-5 text-[clamp(1.7rem,2.3vw,2rem)] font-medium leading-[1.25] tracking-[-0.035em]">
                Den nächsten Job finden.
              </h3>
              <p className="mb-6 max-w-[465px] text-[1rem] leading-[1.8] text-[#576373]">
                Gib deinen Beruf, deine bisherigen Tätigkeiten und deine Wünsche an. Arbeitgeber können dein Profil
                finden und dir eine Kontaktanfrage senden.
              </p>
              <ul className="mb-8 grid gap-3.5">
                {employeeBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-[0.875rem]">
                    <Check className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#2356d8]" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/registrieren?role=employee"
                className="mt-auto inline-flex min-h-[54px] items-center gap-7 rounded-[4px] bg-[#2356d8] px-6 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#1844b6]"
              >
                Als Arbeitnehmer starten
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
            </article>

            {/* Employer card */}
            <article
              id="arbeitgeber"
              className="flex flex-col items-start rounded-[5px] border border-[#162940] bg-[#162940] p-7 text-white sm:p-10"
            >
              <div className="mb-7 flex w-full items-center justify-between text-[0.72rem] font-medium tracking-[0.1em] text-[#b5c9e8]">
                <span>FÜR ARBEITGEBER</span>
                <Briefcase className="h-[23px] w-[23px]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-5 text-[clamp(1.7rem,2.3vw,2rem)] font-medium leading-[1.25] tracking-[-0.035em]">
                Eine Stelle besetzen.
              </h3>
              <p className="mb-6 max-w-[465px] text-[1rem] leading-[1.8] text-[#b9c7d8]">
                Definiere, was dein Unternehmen braucht. Entdecke qualifizierte Kandidaten und sieh auf einen Blick, wie
                gut ihr zusammenpasst.
              </p>
              <ul className="mb-8 grid gap-3.5">
                {employerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-[0.875rem]">
                    <Check className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#9bbcfb]" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/registrieren?role=employer"
                className="mt-auto inline-flex min-h-[54px] items-center gap-7 rounded-[4px] bg-white px-6 font-medium text-[#163153] transition-all hover:-translate-y-0.5 hover:bg-[#e5edf9]"
              >
                Als Arbeitgeber starten
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Matching */}
      <section
        id="matching"
        aria-labelledby="matching-title"
        className="mx-auto grid w-[min(1280px,calc(100%-48px))] items-center gap-10 py-16 sm:w-[min(1280px,calc(100%-64px))] sm:py-24 lg:grid-cols-2 lg:gap-28"
      >
        <div>
          <p className="mb-4 text-[0.72rem] tracking-[0.1em] text-[#2356d8]">SO WERDEN PROFILE VERGLICHEN</p>
          <h2 id="matching-title" className="text-[clamp(2.1rem,3.2vw,2.8rem)] font-medium leading-[1.18] tracking-[-0.05em]">
            Welche Anforderungen
            <br />
            passen zu deinem Profil?
          </h2>
          <p className="my-6 max-w-[465px] text-[1rem] leading-[1.85] text-[#576373]">
            jobmatch24 vergleicht deine Angaben mit den Anforderungen einer Stelle. Die Übersicht zeigt, bei welchen
            Kriterien ihr übereinstimmt.
          </p>
          <div className="mb-7 flex max-w-[380px] flex-wrap gap-2">
            {criteria.map((c) => (
              <span key={c} className="rounded-[3px] border border-[#dfe5ed] px-2.5 py-1.5 text-[0.8125rem] text-[#425770]">
                {c}
              </span>
            ))}
          </div>
          <Link
            href="/registrieren?role=employer"
            className="group inline-flex items-center gap-3 text-[0.875rem] font-medium text-[#2356d8]"
          >
            Passende Kandidaten entdecken
            <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Match example */}
        <div className="rounded-[5px] border border-[#dfe6f0] bg-[#f3f6fa] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4 text-[0.72rem] font-semibold tracking-[0.08em] text-[#52667e]">
            <span>MATCHING IM ÜBERBLICK</span>
            <span className="rounded-[3px] border border-[#d3dde9] px-2 py-0.5 text-[0.72rem] font-normal tracking-normal">
              Beispiel
            </span>
          </div>
          <div className="mb-6 mt-5 flex items-center justify-between border-b border-[#dbe3ed] pb-6">
            <div>
              <span className="text-[4.7rem] font-medium leading-[1.15] tracking-[-0.065em] text-[#2356d8]">
                94<span className="ml-1 text-[2.7rem]">%</span>
              </span>
              <p className="mt-1 text-[0.875rem] text-[#576a83]">Gesamtübereinstimmung</p>
            </div>
            <div className="mr-2 grid h-12 w-12 place-items-center rounded-full bg-[#e1ece9] text-[#326856]">
              <Check className="h-[26px] w-[26px]" strokeWidth={1.5} />
            </div>
          </div>
          <div className="grid gap-5">
            {matchBars.map(([label, value]) => (
              <div key={label} className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.875rem]">{label}</span>
                  <span className="text-[0.875rem] text-[#20364f]">{value}%</span>
                </div>
                <div className="h-1 bg-[#dbe4f0]">
                  <div className="h-full bg-[#2356d8]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 border-l-2 border-[#477c67] bg-white p-4">
            <span className="flex items-center gap-2 text-[0.8125rem] font-medium">
              <Check className="h-4 w-4 text-[#477c67]" />
              Auswertung nach Kriterien
            </span>
            <p className="mt-1.5 text-[0.75rem] text-[#68788b]">Beruf, Erfahrung und Fähigkeiten im Vergleich.</p>
          </div>
          <p className="mt-4 text-[0.75rem] leading-[1.65] text-[#68788b]">
            Illustrative Darstellung. Dein Match hängt von den jeweiligen Profilen und Anforderungen ab.
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="ueber-stoyan"
        className="mx-auto grid w-[min(1280px,calc(100%-48px))] gap-10 border-t border-[#dfe4ea] py-14 sm:w-[min(1280px,calc(100%-64px))] sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:gap-28"
      >
        <p className="mt-2.5 self-start text-[0.72rem] tracking-[0.1em] text-[#2356d8]">WARUM JOBMATCH24?</p>
        <div>
          <h2 className="mb-6 text-[2.2rem] font-medium leading-[1.18] tracking-[-0.05em]">
            Arbeitssuche beginnt
            <br />
            mit den richtigen Angaben.
          </h2>
          <p className="mb-4 text-[1rem] leading-[1.85] text-[#576373]">
            Welche Erfahrung bringst du mit? Wo möchtest du arbeiten und in welchem Pensum? Diese Angaben helfen
            Arbeitgebern, dein Profil einer offenen Stelle zuzuordnen.
          </p>
          <p className="text-[1rem] leading-[1.85] text-[#576373]">
            Im Matching siehst du die Übereinstimmungen nach einzelnen Kriterien. Ob die Zusammenarbeit auch persönlich
            passt, klärt ihr im Gespräch.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section aria-labelledby="closing-title" className="bg-[#2356d8] text-white">
        <div className="mx-auto flex w-[min(1280px,calc(100%-48px))] flex-col items-start justify-between gap-9 py-14 sm:w-[min(1280px,calc(100%-64px))] sm:py-16 lg:flex-row lg:items-center lg:gap-14">
          <div>
            <p className="mb-5 text-[0.72rem] tracking-[0.1em] text-[#d7e3ff]">DEIN PROFIL AUF JOBMATCH24</p>
            <h2 id="closing-title" className="text-[clamp(2.4rem,4vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.055em]">
              Erzähl uns,
              <br />
              was du beruflich suchst.
            </h2>
          </div>
          <div className="flex w-full min-w-0 flex-col items-start gap-5 lg:w-auto lg:min-w-[280px]">
            <Link
              href="/registrieren?role=employee"
              className="inline-flex min-h-[54px] w-full items-center justify-between rounded-[4px] bg-white px-6 font-medium text-[#163153] transition-all hover:-translate-y-0.5 hover:bg-[#e5edf9]"
            >
              Mein Profil erstellen
              <ArrowUpRight className="h-[21px] w-[21px]" />
            </Link>
            <Link
              href="/registrieren?role=employer"
              className="group inline-flex items-center gap-3 text-[0.875rem] font-medium text-white"
            >
              Ich suche Mitarbeitende
              <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
