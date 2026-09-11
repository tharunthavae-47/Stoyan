import Link from "next/link"

const columns = [
  {
    title: "Dein nächster Schritt",
    links: [
      { href: "/registrieren?role=employee", label: "Profil erstellen" },
      { href: "/#arbeitnehmer", label: "Für Arbeitnehmer" },
      { href: "/login", label: "Einloggen" },
    ],
  },
  {
    title: "Für Arbeitgeber",
    links: [
      { href: "/registrieren?role=employer", label: "Kandidaten finden" },
      { href: "/#arbeitgeber", label: "Für Arbeitgeber" },
      { href: "/preise", label: "Preise" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/datenschutz-einstellungen", label: "Einstellungen" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto w-[min(1280px,calc(100%-48px))] sm:w-[min(1280px,calc(100%-64px))]">
        <div className="grid gap-11 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr]">
          <div>
            <p className="text-[1.75rem] font-semibold tracking-[-0.065em] text-[#14243a]">
              jobmatch<span className="font-normal text-[#2356d8]">24</span>
            </p>
            <p className="my-4 text-[0.875rem] leading-[1.75] text-[#657489]">
              Jobs und Mitarbeitende
              <br />
              in der Schweiz.
            </p>
            <span className="flex items-center gap-2 text-[0.75rem] text-[#657489]">
              <span
                aria-hidden="true"
                className="inline-flex h-[15px] w-[15px] items-center justify-center bg-[#da3839] text-[13px] font-bold leading-none text-white"
              >
                +
              </span>
              Zuhause in der Schweizer Arbeitswelt.
            </span>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col items-start gap-3 text-[0.875rem]">
              <h3 className="mb-1 font-semibold text-[#14243a]">{col.title}</h3>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-[#667488] transition-colors hover:text-[#2356d8]">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-[#dfe4ea] py-6 text-[0.75rem] text-[#657489] sm:flex-row">
          <span>© {new Date().getFullYear()} jobmatch24. Alle Rechte vorbehalten.</span>
          <span>Job Matching für Arbeitnehmer und Unternehmen.</span>
        </div>
      </div>
    </footer>
  )
}
