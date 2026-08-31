```tsx
import Link from "next/link"

const navigation = [
  { label: "Über STOYAN", href: "#ueber-stoyan" },
  { label: "So funktioniert's", href: "#so-funktioniert" },
  { label: "Arbeitnehmer", href: "#arbeitnehmer" },
  { label: "Arbeitgeber", href: "#arbeitgeber" },
  { label: "Matching", href: "#matching" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 px-4 pt-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-[1440px]">

        <div className="flex min-h-[76px] items-center gap-5 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:px-6">

          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:scale-105">
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
          <nav className="ml-auto hidden items-center gap-3 lg:flex">

            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
              >
                {item.label}
              </a>
            ))}

          </nav>

          {/* Buttons */}
          <div className="ml-3 flex shrink-0 items-center gap-2">

            <Link
              href="/login"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:inline-flex"
            >
              Einloggen
            </Link>

            <Link
              href="/registrieren"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Registrieren
            </Link>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-2 overflow-x-auto lg:hidden">
          <div className="flex min-w-max gap-2 pb-2">

            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}

          </div>
        </div>

      </div>
    </header>
  )
}
```
