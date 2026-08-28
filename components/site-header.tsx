import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex h-[70px] max-w-6xl items-center rounded-full border border-white/90 bg-white/95 px-5 shadow-[0_14px_45px_rgba(15,23,42,.08)] backdrop-blur-xl sm:px-7">

        <Link
          href="/"
          className="text-[27px] font-black tracking-[-0.06em] text-slate-950"
        >
          Stoyan<span className="text-sky-500">.</span>
        </Link>

        <div className="mx-auto hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#so-funktioniert" className="transition hover:text-sky-600">
            So funktioniert&apos;s
          </a>

          <a href="#arbeitnehmer" className="transition hover:text-sky-600">
            Arbeitnehmer
          </a>

          <a href="#arbeitgeber" className="transition hover:text-sky-600">
            Arbeitgeber
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Einloggen
          </Link>

          <Link
            href="/registrieren?role=employee"
            className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600"
          >
            Registrieren
          </Link>
        </div>

      </nav>
    </header>
  )
}
