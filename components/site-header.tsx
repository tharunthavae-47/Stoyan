```tsx
import Link from "next/link"

const links = [
  { href: "#ueber-stoyan", label: "Über STOYAN" },
  { href: "#so-funktioniert", label: "So funktioniert's" },
  { href: "#arbeitnehmer", label: "Arbeitnehmer" },
  { href: "#arbeitgeber", label: "Arbeitgeber" },
  { href: "#matching", label: "Matching" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1440px]">

        <nav className="flex min-h-[76px] items-center rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">

          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
              S
            </div>

            <div className="hidden sm:block">
              <div className="text-xl font-black tracking-[-0.06em] text-slate-950">
                STOYAN
              </div>

              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Menschen verbinden
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  rounded-xl
                  border border-transparent
                  px-4 py-3
                  text-sm font-semibold
                  text-slate-600
                  transition-all
                  duration-200
                  hover:border-slate-200
                  hover:bg-slate-50
                  hover:text-blue-600
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Login / Registrierung */}
          <div className="ml-4 flex items-center gap-2">

            <Link
              href="/login"
              className="
                hidden
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-2.5
                text-sm font-bold
                text-slate-700
                transition
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                sm:inline-flex
              "
            >
              Einloggen
            </Link>

            <Link
              href="/registrieren"
              className="
                rounded-xl
                bg-blue-600
                px-5 py-2.5
                text-sm font-bold
                text-white
                shadow-lg shadow-blue-600/20
                transition
                hover:-translate-y-0.5
                hover:bg-blue-700
              "
            >
              Registrieren
            </Link>

          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="mt-2 overflow-x-auto lg:hidden">
          <div className="flex min-w-max gap-2 pb-2">

            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-2.5
                  text-xs font-bold
                  text-slate-600
                  shadow-sm
                  transition
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                {link.label}
              </a>
            ))}

          </div>
        </div>

      </div>
    </header>
  )
}
```
