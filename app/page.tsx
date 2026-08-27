import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07090d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090d]/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-3xl font-black tracking-tight">Stoyan<span className="text-[#6f95ff]">.</span></Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
            <a href="#so-funktioniert">So funktioniert&apos;s</a>
            <a href="#arbeitnehmer">Arbeitnehmer</a>
            <a href="#arbeitgeber">Arbeitgeber</a>
          </div>
          <Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">Firmen-Login</Link>
        </nav>
      </header>

      <section className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-500/15 blur-[120px]" />
        </div>
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:py-28">
          <ScrollReveal>
            <p className="text-sm font-black uppercase tracking-[.22em] text-[#7ea2ff]">Stoyan · Job Matching</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[.96] tracking-[-.055em] sm:text-6xl lg:text-7xl">Menschen finden.<br/><span className="text-[#7598ff]">Potenzial erkennen.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Arbeitnehmer präsentieren sich mit einem vollständigen Profil. Unternehmen suchen nach ihren Anforderungen und entdecken passende Menschen anhand eines transparenten Matches.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/registrieren?role=employee" className="rounded-full bg-[#6f95ff] px-7 py-3.5 font-bold text-slate-950 shadow-2xl shadow-blue-900/30 transition hover:bg-[#88a8ff]">Als Arbeitnehmer registrieren</Link>
              <Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">Für Firmen einloggen</Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="[transition-delay:140ms]">
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0e131b] p-3 shadow-[0_35px_100px_rgba(0,0,0,.45)]">
              <div className="overflow-hidden rounded-[26px] bg-[#111824]"><img src="/images/employer.svg" alt="Modernes Unternehmen bei Stoyan" className="aspect-[4/3] h-full w-full object-cover" /></div>
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-[#0b0f15]/92 p-5 shadow-2xl backdrop-blur-xl sm:left-9 sm:right-auto sm:w-[360px]">
                <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Passendes Profil</p><h2 className="mt-2 text-lg font-black">Automobil-Mechatroniker EFZ</h2><p className="mt-1 text-sm text-slate-400">Luzern · 100 % · 6 Jahre Erfahrung</p></div><span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-black text-emerald-300">96 % MATCH</span></div>
                <div className="mt-4 flex gap-2 text-xs font-semibold text-slate-300"><span className="rounded-full bg-white/5 px-3 py-1.5">BMW</span><span className="rounded-full bg-white/5 px-3 py-1.5">Diagnose</span><span className="rounded-full bg-white/5 px-3 py-1.5">MFK</span></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="so-funktioniert" className="border-y border-white/10 bg-[#0b0f15]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <ScrollReveal><p className="text-sm font-black uppercase tracking-[.2em] text-[#7ea2ff]">So funktioniert&apos;s</p><h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-5xl">Zwei Seiten. Ein klares Ziel.</h2></ScrollReveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[['01','Profil','Arbeitnehmer tragen ihre Erfahrung, Ausbildung, Skills, Wünsche und Bilder zusammen.'],['02','Kriterien','Unternehmen definieren genau, welche Fähigkeiten und Bedingungen sie suchen.'],['03','Match','Stoyan vergleicht beides und zeigt die passendsten Profile zuerst.']].map(([n,t,d],i)=><ScrollReveal key={n} className={`${i ? `[transition-delay:${i*100}ms]` : ''}`}><article className="h-full rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:bg-white/[.06]"><span className="text-sm font-black text-[#7ea2ff]">{n}</span><h3 className="mt-5 text-2xl font-black">{t}</h3><p className="mt-3 leading-7 text-slate-400">{d}</p></article></ScrollReveal>)}
          </div>
        </div>
      </section>

      <section id="arbeitnehmer" className="bg-[#07090d]"><div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2"><ScrollReveal><div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#111720] shadow-2xl"><img src="/images/employee.svg" alt="Arbeitnehmerprofil auf Stoyan" className="aspect-[4/3] w-full object-cover"/></div></ScrollReveal><ScrollReveal className="[transition-delay:120ms]"><p className="text-sm font-black uppercase tracking-[.2em] text-[#7ea2ff]">Für Arbeitnehmer</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">Zeig, wer du bist.<br/>Nicht nur deinen Lebenslauf.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">Erstelle dein persönliches Profil, lade Bilder hoch und hinterlege alles, was für deinen nächsten Arbeitgeber wichtig ist.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{['Profilbild & Bilder','Ausbildung & Erfahrung','Skills & Sprachen','Wunschlohn & Pensum','Arbeitsort & Umkreis','Verfügbarkeit'].map(x=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm font-semibold text-slate-300">{x}</div>)}</div><Link href="/registrieren?role=employee" className="mt-8 inline-flex rounded-full bg-white px-6 py-3.5 font-bold text-slate-950">Profil erstellen</Link></ScrollReveal></div></section>

      <section id="arbeitgeber" className="border-y border-white/10 bg-[#0b0f15]"><div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_.9fr]"><ScrollReveal><p className="text-sm font-black uppercase tracking-[.2em] text-[#7ea2ff]">Für Arbeitgeber</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">Suchen Sie nicht länger.<br/>Finden Sie passende Menschen.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">Geben Sie Ihre Anforderungen ein und sehen Sie echte Kandidaten aus der Stoyan-Datenbank – nach Match priorisiert.</p><div className="mt-8 rounded-3xl border border-white/10 bg-white/[.035] p-6"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Position</p><p className="mt-2 font-bold">Automobil-Mechatroniker</p></div><div className="rounded-2xl bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Standort</p><p className="mt-2 font-bold">Luzern + 30 km</p></div><div className="rounded-2xl bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Erfahrung</p><p className="mt-2 font-bold">5+ Jahre</p></div><div className="rounded-2xl bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills</p><p className="mt-2 font-bold">Diagnose · BMW · MFK</p></div></div><Link href="/login" className="mt-5 inline-flex rounded-full bg-[#6f95ff] px-6 py-3 font-bold text-slate-950">Kandidaten suchen</Link></div></ScrollReveal><ScrollReveal className="[transition-delay:140ms]"><div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111720]"><img src="/images/office.svg" alt="Unternehmensumfeld" className="aspect-[4/5] w-full object-cover"/><div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-[#0b0f15]/90 p-5 backdrop-blur-xl"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Stoyan Match</p><div className="mt-2 flex items-end justify-between"><div><p className="text-lg font-black">Max Muster</p><p className="text-sm text-slate-400">Automobil-Mechatroniker</p></div><p className="text-3xl font-black text-[#7ea2ff]">96%</p></div></div></div></ScrollReveal></div></section>

      <section className="bg-[#07090d]"><div className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8"><ScrollReveal><p className="text-sm font-black uppercase tracking-[.2em] text-[#7ea2ff]">Stoyan</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-6xl">Der nächste passende Mensch ist näher, als du denkst.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">Ein professionelles Profil für Arbeitnehmer. Eine gezielte Suche für Unternehmen. Ein System, das beide Seiten zusammenführt.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/registrieren?role=employee" className="rounded-full bg-[#6f95ff] px-7 py-3.5 font-bold text-slate-950">Als Arbeitnehmer starten</Link><Link href="/login" className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-bold">Für Firmen einloggen</Link></div></ScrollReveal></div></section>

      <footer className="border-t border-white/10 bg-[#05070a]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span className="text-xl font-black text-white">Stoyan<span className="text-[#6f95ff]">.</span></span><span>Job Matching für Arbeitnehmer und Unternehmen.</span></div></footer>
    </main>
  )
}
