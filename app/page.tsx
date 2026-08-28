import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const features = [
  {
    number: "01",
    title: "Profil",
    text: "Arbeitnehmer zeigen Erfahrung, Ausbildung, Skills, Wünsche und Persönlichkeit in einem professionellen Profil.",
  },
  {
    number: "02",
    title: "Suche",
    text: "Unternehmen definieren ihre Anforderungen und suchen gezielt nach passenden Kandidatinnen und Kandidaten.",
  },
  {
    number: "03",
    title: "Matching",
    text: "Stoyan verbindet beide Seiten und macht die wichtigsten Übereinstimmungen sofort sichtbar.",
  },
]

const employeeBenefits = [
  "Profilbild & persönliche Bilder",
  "Ausbildung & Berufserfahrung",
  "Skills & Sprachen",
  "Wunschlohn & Pensum",
  "Arbeitsort & Umkreis",
  "Verfügbarkeit",
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05070b] text-white selection:bg-[#7d9dff]/30">
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05070b]/75 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group text-[28px] font-black tracking-[-0.04em]">
            Stoyan<span className="text-[#7f9eff]">.</span>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-medium text-slate-400 md:flex">
            <a className="transition hover:text-white" href="#so-funktioniert">So funktioniert&apos;s</a>
            <a className="transition hover:text-white" href="#arbeitnehmer">Arbeitnehmer</a>
            <a className="transition hover:text-white" href="#arbeitgeber">Arbeitgeber</a>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Firmen-Login
          </Link>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[8%] top-[-12%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.11] blur-[150px]" />
          <div className="absolute right-[-8%] top-[22%] h-[460px] w-[460px] rounded-full bg-violet-500/[0.08] blur-[150px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7f9eff] shadow-[0_0_14px_rgba(127,158,255,.9)]" />
                Stoyan · Job Matching
              </div>

              <h1 className="mt-7 text-[clamp(3.5rem,7vw,6.8rem)] font-black leading-[0.92] tracking-[-0.065em]">
                Menschen finden.
                <br />
                <span className="bg-gradient-to-r from-[#9bb3ff] via-[#718fff] to-[#a4a2ff] bg-clip-text text-transparent">
                  Potenzial erkennen.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl sm:leading-9">
                Arbeitnehmer präsentieren sich mit einem vollständigen Profil. Unternehmen suchen nach ihren Anforderungen und entdecken passende Menschen anhand eines transparenten Matches.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/registrieren?role=employee"
                  className="rounded-full bg-white px-7 py-3.5 font-bold text-slate-950 shadow-[0_18px_50px_rgba(255,255,255,.08)] transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Als Arbeitnehmer starten
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Für Firmen einloggen
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2"><span className="text-[#8ca8ff]">✓</span> Kostenloses Profil</span>
                <span className="flex items-center gap-2"><span className="text-[#8ca8ff]">✓</span> Transparente Matches</span>
                <span className="flex items-center gap-2"><span className="text-[#8ca8ff]">✓</span> Für Arbeitnehmer & Unternehmen</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:140ms]">
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -inset-10 rounded-[42px] bg-blue-500/[0.08] blur-3xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0b1017]/90 p-2.5 shadow-[0_40px_120px_rgba(0,0,0,.5)] backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[27px] bg-[#111823]">
                  <img
                    src="/images/employer.svg"
                    alt="Modernes Unternehmensumfeld bei Stoyan"
                    className="aspect-[4/3] h-full w-full object-cover opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
                </div>

                <div className="absolute left-7 right-7 bottom-7 sm:left-9 sm:right-auto sm:w-[390px]">
                  <div className="rounded-[22px] border border-white/10 bg-[#090e15]/88 p-5 shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Passendes Profil</p>
                        <h2 className="mt-2 text-lg font-black">Automobil-Mechatroniker EFZ</h2>
                        <p className="mt-1 text-sm text-slate-400">Luzern · 100 % · 6 Jahre Erfahrung</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-emerald-300/10 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">96 %</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
                      <span className="rounded-full bg-white/[0.05] px-3 py-1.5">BMW</span>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1.5">Diagnose</span>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1.5">MFK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="so-funktioniert" className="border-y border-white/[0.07] bg-[#080c12]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86a2ff]">So funktioniert&apos;s</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">Zwei Seiten. Ein intelligenter Weg zum Match.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">Stoyan reduziert den Aufwand auf beiden Seiten und bringt die Informationen dorthin, wo sie wirklich gebraucht werden.</p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.number} className={index ? `[transition-delay:${index * 100}ms]` : ""}>
                <article className="group h-full bg-[#0b1017] p-8 transition hover:bg-[#0e141d] sm:p-10">
                  <span className="text-xs font-black tracking-[0.18em] text-[#7f9eff]">{feature.number}</span>
                  <div className="mt-16 max-w-sm">
                    <h3 className="text-2xl font-black tracking-tight">{feature.title}</h3>
                    <p className="mt-4 leading-7 text-slate-400">{feature.text}</p>
                  </div>
                  <div className="mt-8 h-px w-12 bg-white/15 transition-all duration-500 group-hover:w-20 group-hover:bg-[#7f9eff]" />
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="arbeitnehmer" className="relative overflow-hidden bg-[#05070b]">
        <div className="pointer-events-none absolute left-[-120px] top-1/4 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-[120px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0d131b] p-2 shadow-[0_35px_90px_rgba(0,0,0,.35)]">
              <div className="overflow-hidden rounded-[26px]">
                <img src="/images/employee.svg" alt="Arbeitnehmerprofil auf Stoyan" className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">
            <div className="max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86a2ff]">Für Arbeitnehmer</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">Zeig, wer du bist. Nicht nur deinen Lebenslauf.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">Erstelle ein Profil, das deine Erfahrung, deine Persönlichkeit und deine Ziele sichtbar macht. Unternehmen können dich dadurch gezielter entdecken.</p>

              <div className="mt-8 grid gap-x-4 gap-y-3 sm:grid-cols-2">
                {employeeBenefits.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-[#93abff]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/registrieren?role=employee" className="mt-9 inline-flex rounded-full bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">Profil erstellen</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="arbeitgeber" className="border-y border-white/[0.07] bg-[#080c12]">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:py-32">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86a2ff]">Für Arbeitgeber</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">Weniger Suchen. Mehr passende Kandidaten.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">Definieren Sie Ihre wichtigsten Kriterien und entdecken Sie Kandidaten, deren Profil wirklich zu Ihrer Stelle passt.</p>

              <div className="mt-9 overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0a0f15]">
                <div className="grid gap-px bg-white/[0.07] sm:grid-cols-2">
                  {[
                    ["Position", "Automobil-Mechatroniker"],
                    ["Standort", "Luzern + 30 km"],
                    ["Erfahrung", "5+ Jahre"],
                    ["Skills", "Diagnose · BMW · MFK"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#0a0f15] p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">{label}</p>
                      <p className="mt-2 text-sm font-bold text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">Gefundenes Profil</p>
                    <p className="mt-1 font-black">Max Muster · Automobil-Mechatroniker</p>
                  </div>
                  <span className="text-2xl font-black text-[#86a2ff]">96%</span>
                </div>
              </div>

              <Link href="/login" className="mt-9 inline-flex rounded-full bg-[#819fff] px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#9ab3ff]">Kandidaten suchen</Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:140ms]">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-8 rounded-[36px] bg-violet-500/[0.06] blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d131b] p-2 shadow-[0_35px_90px_rgba(0,0,0,.4)]">
                <div className="relative overflow-hidden rounded-[26px]">
                  <img src="/images/office.svg" alt="Unternehmensumfeld bei Stoyan" className="aspect-[4/5] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a10] via-transparent to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 rounded-[22px] border border-white/10 bg-[#080d14]/88 p-5 backdrop-blur-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Stoyan Match</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-lg font-black">96 % Match</p>
                        <p className="mt-1 text-sm text-slate-400">Hohe Übereinstimmung bei Skills & Erfahrung</p>
                      </div>
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-300/10 bg-emerald-400/10 text-sm font-black text-emerald-300">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#05070b]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.05] blur-[140px]" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:px-8 lg:py-36">
          <ScrollReveal>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86a2ff]">Stoyan</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-7xl">Der nächste passende Mensch ist näher, als du denkst.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">Ein professionelles Profil für Arbeitnehmer. Eine gezielte Suche für Unternehmen. Ein System, das beide Seiten zusammenführt.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/registrieren?role=employee" className="rounded-full bg-white px-7 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">Als Arbeitnehmer starten</Link>
              <Link href="/login" className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]">Für Firmen einloggen</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] bg-[#04060a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-xl font-black text-white">Stoyan<span className="text-[#7f9eff]">.</span></span>
          <span>Job Matching für Arbeitnehmer und Unternehmen.</span>
        </div>
      </footer>
    </main>
  )
}
