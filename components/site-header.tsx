import Link from "next/link"

const navigation = [
  {
    number: "01",
    label: "Über STOYAN",
    href: "/#ueber-stoyan",
  },
  {
    number: "02",
    label: "So funktioniert's",
    href: "/#so-funktioniert",
  },
  {
    number: "03",
    label: "Arbeitnehmer",
    href: "/#arbeitnehmer",
  },
  {
    number: "04",
    label: "Arbeitgeber",
    href: "/#arbeitgeber",
  },
  {
    number: "05",
    label: "Matching",
    href: "/#matching",
  },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className="
          mx-auto
          flex
          min-h-[82px]
          max-w-7xl
          items-center
          gap-5
          rounded-[26px]
          border
          border-slate-200
          bg-white/95
          px-5
          py-3
          shadow-[0_15px_45px_rgba(15,23,42,0.08)]
          backdrop-blur-xl
          sm:px-7
        "
      >

        {/* LOGO */}
        <Link
          href="/"
          className="
            shrink-0
            text-[28px]
            font-black
            tracking-[-0.065em]
            text-slate-950
            transition
            hover:opacity-70
          "
        >
          STOYAN<span className="text-sky-500">.</span>
        </Link>

        {/* NAVIGATION */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group
                flex
                items-center
                gap-2.5
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-sky-200
                hover:bg-sky-50
                hover:shadow-[0_8px_22px_rgba(14,165,233,0.10)]
              "
            >
              <span
                className="
                  flex
                  h-6
                  min-w-6
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  px-1.5
                  text-[9px]
                  font-black
                  tracking-wider
                  text-slate-400
                  transition
                  group-hover:bg-sky-100
                  group-hover:text-sky-600
                "
              >
                {item.number}
              </span>

              <span
                className="
                  whitespace-nowrap
                  text-xs
                  font-bold
                  text-slate-600
                  transition
                  group-hover:text-sky-600
                "
              >
                {item.label}
              </span>
            </Link>
          ))}

        </div>

        {/* ACTIONS */}
        <div className="ml-2 hidden items-center gap-2 md:flex">

          <Link
            href="/login"
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-700
              transition
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-950
            "
          >
            Einloggen
          </Link>

          <Link
            href="/registrieren?role=employee"
            className="
              rounded-xl
              bg-sky-500
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-[0_8px_22px_rgba(14,165,233,0.18)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-sky-600
            "
          >
            Registrieren
          </Link>

        </div>

        {/* MOBILE */}
        <div className="ml-auto flex items-center gap-2 md:hidden">

          <Link
            href="/login"
            className="
              rounded-xl
              border
              border-slate-200
              px-3
              py-2
              text-xs
              font-bold
              text-slate-700
            "
          >
            Login
          </Link>

          <Link
            href="/registrieren?role=employee"
            className="
              rounded-xl
              bg-sky-500
              px-3
              py-2
              text-xs
              font-bold
              text-white
            "
          >
            Starten
          </Link>

        </div>

      </nav>
    </header>
  )
}
