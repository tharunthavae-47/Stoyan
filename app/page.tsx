import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const steps = [
  ["01", "Profil erstellen", "Arbeitnehmer präsentieren Erfahrung, Skills, Wünsche und sich als Person."],
  ["02", "Anforderungen definieren", "Unternehmen legen fest, welche Fähigkeiten und Bedingungen sie suchen."],
  ["03", "Passende Menschen finden", "Stoyan vergleicht Kriterien und zeigt passende Profile übersichtlich an."],
]

const employeeFeatures = [
  "Profilbild & Bilder",
  "Ausbildung & Erfahrung",
  "Skills & Sprachen",
  "Wunschlohn & Pensum",
  "Arbeitsort & Umkreis",
  "Verfügbarkeit",
]

const profileCards = [
  { image: "/images/employee.svg", name: "Max Muster", job: "Automobil-Mechatroniker EFZ", place: "Luzern", match: "96 %" },
  { image: "/images/office.svg", name: "Anna Keller", job: "Technische Mitarbeiterin", place: "Zürich", match: "92 %" },
  { image: "/images/employer.svg", name: "David Meier", job: "IT Support Specialist", place: "Rotkreuz", match: "89 %" },
  { image: "/images/employee.svg", name: "Nina Baumann", job: "Detailhandel & Verkauf", place: "Luzern", match: "87 %" },
  { image: "/images/office.svg", name: "Jonas Frei", job: "Logistikfachmann", place: "Emmen", match: "94 %" },
  { image: "/images/employer.svg", name: "Laura Schmid", job: "Administration", place: "Zug", match: "91 %" },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef8fc] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[520px] w-[520px] rounded-full bg-cyan-100/70 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-white/80 bg-white/90 px-5 shadow-[0_15px_45px_rgba(30,64,175,.10)] backdrop-blur-xl sm:px-7">
          <Link href="/" className="text-2xl font-black tracking-[-0.05em] text-slate-950">
            Stoyan<span className="text-sky-500">.</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <a href="#so-funktioniert" className="transition hover:text-sky-600">So funktioniert&apos;s</a>
            <a href="#arbeitnehmer" className="transition hover:text-sky-600">Arbeitnehmer</a>
            <a href="#arbeitgeber" className="transition hover:text-sky-600">Arbeitgeber</a>
          </div>

          <Link href="/login" className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 hover:-translate-y-0.5">
            Firmen-Login
          </Link>
        </nav>
      </header>

      <section className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-white/90 bg-white shadow-[0_25px_80px_rgba(30,64,175,.12)] lg:grid-cols-[1.05fr_.95fr]">
          <ScrollReveal>
            <div className="flex h-full flex-col justify-center px-7 py-12 sm:px-12 sm:py-16 lg:px-14 lg:py-20">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-600">Stoyan · Job Matching</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.055em] text-slate-950 sm:text-6xl">
                Fachkräfte einstellen mit Stoyan – so leicht wie noch nie.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Arbeitnehmer präsentieren sich mit einem starken Profil. Unternehmen finden gezielt Menschen, die zu ihren Anforderungen passen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/registrieren?role=employee" className="rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 hover:-translate-y-0.5">Als Arbeitnehmer registrieren</Link>
                <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">Für Firmen einloggen</Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
                <span>✓ Kostenloses Profil</span>
                <span>✓ Transparente Matches</span>
                <span>✓ Für beide Seiten</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:120ms]">
            <div className="relative h-full min-h-[390px] overflow-hidden bg-slate-100">
              <img src="/images/employer.svg" alt="Unternehmensumfeld bei Stoyan" className="h-full min-h-[390px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Perfektes Match</p>
                    <p className="mt-1 text-lg font-black text-slate-950">Automobil-Mechatroniker EFZ</p>
                    <p className="mt-1 text-sm text-slate-500">Luzern · 100 % · 6 Jahre Erfahrung</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">96 %</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[34px] border border-white/90 bg-white px-5 py-7 shadow-[0_20px_65px_rgba(30,64,175,.08)] sm:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Profile entdecken</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">Menschen hinter dem Lebenslauf.</h2>
              </div>
              <span className="hidden rounded-full bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 sm:inline-flex">Stoyan Matching</span>
            </div>
          </ScrollReveal>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {profileCards.map((card, index) => (
              <ScrollReveal key={`${card.name}-${index}`} className={index % 3 === 1 ? "[transition-delay:80ms]" : index % 3 === 2 ? "[transition-delay:160ms]" : ""}>
                <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,.11)]">
                  <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                    <img src={card.image} alt={`${card.name} – ${card.job}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">{card.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">{card.job}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">{card.match}</span>
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-slate-400">{card.place}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="so-funktioniert" className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[34px] border border-white/90 bg-white px-6 py-14 shadow-[0_20px_65px_rgba(30,64,175,.08)] sm:px-10 lg:px-12">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">So funktioniert&apos;s</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">Eine klare Plattform für zwei Seiten.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Weniger Suchen. Weniger unpassende Bewerbungen. Mehr Übersicht.</p>
            </div>
          </ScrollReveal>

          <div className="mt-10 divide-y divide-slate-100">
            {steps.map(([number, title, text], index) => (
              <ScrollReveal key={number} className={index === 1 ? "[transition-delay:100ms]" : index === 2 ? "[transition-delay:200ms]" : ""}>
                <div className="grid gap-5 py-8 md:grid-cols-[90px_1fr_1.4fr] md:items-center">
                  <div className="text-4xl font-black tracking-[-0.05em] text-sky-500">{number}</div>
                  <h3 className="text-2xl font-black text-slate-950">{title}</h3>
                  <p className="max-w-xl text-base leading-7 text-slate-500">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="arbeitnehmer" className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-white/90 bg-white shadow-[0_20px_65px_rgba(30,64,175,.08)] lg:grid-cols-[.9fr_1.1fr]">
          <ScrollReveal>
            <div className="h-full min-h-[390px] bg-slate-100">
              <img src="/images/employee.svg" alt="Professionelles Arbeitnehmerprofil" className="h-full min-h-[390px] w-full object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal className="[transition-delay:100ms]">
            <div className="px-7 py-12 sm:px-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Für Arbeitnehmer</p>
              <h2 className="mt-3 text-4xl font-black leading-[1] tracking-[-0.05em] text-slate-950 sm:text-5xl">Dein Profil.<br/><span className="text-sky-500">Deine Geschichte.</span></h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Präsentiere dich professionell – mit Profilbild, Erfahrung, Ausbildung, Skills, Wunschlohn, Pensum und deinen persönlichen Vorstellungen.</p>
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {employeeFeatures.map((feature) => <div key={feature} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">✓ {feature}</div>)}
              </div>
              <Link href="/registrieren?role=employee" className="mt-8 inline-flex rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 hover:-translate-y-0.5">Profil erstellen</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="arbeitgeber" className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-white/90 bg-white shadow-[0_20px_65px_rgba(30,64,175,.08)] lg:grid-cols-[1.05fr_.95fr]">
          <ScrollReveal>
            <div className="px-7 py-12 sm:px-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Für Arbeitgeber</p>
              <h2 className="mt-3 text-4xl font-black leading-[1] tracking-[-0.05em] text-slate-950 sm:text-5xl">Finden Sie die<br/><span className="text-sky-500">richtigen Menschen.</span></h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Definieren Sie Ihre Kriterien und erhalten Sie eine übersichtliche Auswahl passender Arbeitnehmer.</p>
              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[["Beruf", "Automobil-Mechatroniker"], ["Ort", "Luzern + 30 km"], ["Erfahrung", "5+ Jahre"], ["Pensum", "80–100 %"], ["Skills", "Diagnose · BMW · MFK"], ["Match", "ab 85 %"]].map(([label, value]) => <div key={label} className="rounded-xl bg-white px-4 py-3 shadow-sm"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>)}
                </div>
                <Link href="/login" className="mt-4 inline-flex rounded-xl bg-sky-500 px-5 py-3 font-bold text-white transition hover:bg-sky-600">Kandidaten suchen</Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal className="[transition-delay:120ms]">
            <div className="relative h-full min-h-[430px] overflow-hidden bg-slate-100">
              <img src="/images/office.svg" alt="Arbeitgeber und Unternehmen" className="h-full min-h-[430px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/80 bg-white/95 p-5 shadow-2xl">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Stoyan Match</p>
                <div className="mt-2 flex items-end justify-between gap-4"><div><p className="text-lg font-black text-slate-950">Automobil-Mechatroniker EFZ</p><p className="text-sm text-slate-500">96 % Übereinstimmung</p></div><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">Top Match</span></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[34px] bg-sky-500 px-7 py-14 text-center text-white shadow-[0_25px_70px_rgba(14,165,233,.20)] sm:px-12">
          <ScrollReveal>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-100">Stoyan</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black leading-[1] tracking-[-0.05em] sm:text-5xl">Der nächste passende Mensch ist näher, als du denkst.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-sky-50">Ein professionelles Profil für Arbeitnehmer. Eine gezielte Suche für Unternehmen. Ein System, das beide Seiten zusammenführt.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/registrieren?role=employee" className="rounded-xl bg-white px-6 py-3.5 font-bold text-sky-700 transition hover:bg-sky-50">Als Arbeitnehmer starten</Link>
              <Link href="/login" className="rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white transition hover:bg-white/15">Für Firmen einloggen</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="px-4 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-2 py-5 text-sm text-slate-500">
          <Link href="/" className="text-xl font-black tracking-[-0.04em] text-slate-950">Stoyan<span className="text-sky-500">.</span></Link>
          <span>Job Matching für Arbeitnehmer und Unternehmen.</span>
        </div>
      </footer>
    </main>
  )
}
