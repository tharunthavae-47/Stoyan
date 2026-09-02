"use client"

import Link from "next/link"
import { ArrowRight, Check, Search, UserRound, Building2 } from "lucide-react"

const steps = [
  { number: "01", title: "Profil erstellen", text: "Arbeitnehmer erstellen ein Profil mit Beruf, Ausbildung, Erfahrung und Fähigkeiten.", icon: UserRound },
  { number: "02", title: "Kriterien definieren", text: "Arbeitgeber legen fest, welche Qualifikationen und Eigenschaften sie suchen.", icon: Search },
  { number: "03", title: "Passende Matches", text: "jobmatch24 bringt passende Arbeitnehmer und Arbeitgeber zusammen.", icon: Building2 },
]

const employeeBenefits = [
  "Professionelles Profil erstellen",
  "Ausbildung und Fähigkeiten präsentieren",
  "Von passenden Arbeitgebern gefunden werden",
  "Direkt mit Unternehmen in Kontakt treten",
]

const employerBenefits = [
  "Kandidaten nach Kriterien suchen",
  "Ausbildung und Erfahrung filtern",
  "Passende Profile entdecken",
  "Direkt mit Arbeitnehmern kommunizieren",
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-[#f7f9fc]">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">jobmatch24</p>
            <h1 className="mt-5 text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              Menschen und Jobs.
              <span className="block text-blue-600">Einfach zusammenbringen.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              jobmatch24 verbindet qualifizierte Arbeitnehmer mit passenden Arbeitgebern – direkt, modern und ohne unnötige Umwege.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/registrieren?role=employee" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-600">
                Als Arbeitnehmer starten <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/registrieren?role=employer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
                Als Arbeitgeber starten <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="ueber-stoyan" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Über jobmatch24</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Arbeitssuche darf
                <span className="block text-blue-600">einfacher sein.</span>
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-600">
                jobmatch24 verbindet Menschen und Unternehmen auf einer modernen Plattform. Statt unübersichtlicher Bewerbungen und endloser Suche steht bei uns die passende Verbindung im Mittelpunkt.
              </p>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Arbeitnehmer präsentieren ihre Fähigkeiten. Arbeitgeber definieren ihre Anforderungen. Unser Matching hilft dabei, beide Seiten zusammenzubringen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="so-funktioniert" className="bg-[#f7f9fc]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">So funktioniert&apos;s</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Drei Schritte.
              <span className="block text-slate-400">Eine bessere Verbindung.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-blue-600">{step.number}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></div>
                  </div>
                  <h3 className="mt-8 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            <div id="arbeitnehmer" className="relative overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">Für Arbeitnehmer</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Zeige, was du<span className="block text-blue-400">kannst.</span></h2>
                <p className="mt-5 max-w-lg leading-7 text-slate-300">Erstelle dein professionelles Profil und werde von passenden Arbeitgebern gefunden.</p>
                <div className="mt-7 space-y-3">
                  {employeeBenefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-200"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600"><Check className="h-3.5 w-3.5" /></div>{benefit}</div>)}
                </div>
                <Link href="/registrieren?role=employee" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-blue-50">Profil erstellen <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>

            <div id="arbeitgeber" className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Für Arbeitgeber</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Finde Menschen,<span className="block text-blue-600">die wirklich passen.</span></h2>
                <p className="mt-5 max-w-lg leading-7 text-slate-600">Definiere deine Anforderungen und entdecke qualifizierte Kandidaten, die zu deinem Unternehmen passen.</p>
                <div className="mt-7 space-y-3">
                  {employerBenefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Check className="h-3.5 w-3.5" /></div>{benefit}</div>)}
                </div>
                <Link href="/registrieren?role=employer" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-600">Kandidaten finden <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="matching" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-400">jobmatch24 Matching</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Der richtige Job. Der richtige Mensch.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Weniger Suchen. Weniger Umwege. Mehr passende Verbindungen zwischen Arbeitnehmern und Unternehmen.</p>
          <Link href="/registrieren" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-blue-50">Jetzt bei jobmatch24 starten <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  )
}
