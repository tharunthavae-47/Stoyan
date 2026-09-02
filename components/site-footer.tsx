import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 px-2 py-7 text-sm text-slate-500 sm:flex-row">

        <Link
          href="/"
          className="text-xl font-black tracking-[-0.05em] text-slate-950"
        >
          jobmacht24<span className="text-sky-500">.</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/login" className="hover:text-sky-600">
            Einloggen
          </Link>

          <Link
            href="/registrieren?role=employee"
            className="hover:text-sky-600"
          >
            Registrieren
          </Link>
        </div>

        <p>
          Job Matching für Arbeitnehmer und Unternehmen.
        </p>

      </div>
    </footer>
  )
}
