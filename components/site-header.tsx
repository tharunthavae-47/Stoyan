"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Routes that use the dedicated dark sidebar shell instead of the marketing header
const APP_ROUTE_PREFIXES = ["/arbeitgeber", "/arbeitnehmer", "/dashboard"]

const links = [
  { href: "#ueber-stoyan", label: "Über STOYAN" },
  { href: "#so-funktioniert", label: "So funktioniert's" },
  { href: "#arbeitnehmer", label: "Arbeitnehmer" },
  { href: "#arbeitgeber", label: "Arbeitgeber" },
  { href: "#matching", label: "Matching" },
]

export function SiteHeader() {
  const pathname = usePathname()

  if (APP_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1440px]">

        {/* =====================================================
            DESKTOP HEADER
        ===================================================== */}

        <nav
          className="
            flex min-h-[74px]
            items-center
            rounded-2xl
            border border-slate-200/80
            bg-white/95
            px-4
            shadow-[0_8px_30px_rgba(15,23,42,0.06)]
            backdrop-blur-xl
            sm:px-5
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >

            {/* Logo Icon */}
            <div
              className="
                relative
                flex h-11 w-11
                items-center justify-center
                overflow-hidden
                rounded-xl
                bg-slate-950
                text-lg
                font-black
                text-white
                shadow-lg
                shadow-slate-950/10
                transition-all
                duration-300
                group-hover:-translate-y-0.5
                group-hover:shadow-xl
              "
            >
              <span className="relative z-10">
                S
              </span>

              <div
                className="
                  absolute
                  -right-4
                  -top-4
                  h-10
                  w-10
                  rounded-full
                  bg-blue-600/80
                  blur-xl
                "
              />
            </div>

            {/* Brand */}
            <div className="hidden sm:block">

              <div
                className="
                  text-[19px]
                  font-black
                  tracking-[-0.055em]
                  text-slate-950
                "
              >
                STOYAN
              </div>

              <div
                className="
                  mt-0.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-slate-400
                "
              >
                Menschen verbinden
              </div>

            </div>

          </Link>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="ml-auto hidden items-center gap-1.5 lg:flex">

            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  group
                  relative
                  rounded-xl
                  px-4
                  py-3
                  text-[13px]
                  font-semibold
                  text-slate-600
                  transition-all
                  duration-200
                  hover:bg-slate-50
                  hover:text-slate-950
                "
              >
                {link.label}

                {/* Hover Line */}
                <span
                  className="
                    absolute
                    bottom-1.5
                    left-4
                    right-4
                    h-[2px]
                    origin-left
                    scale-x-0
                    rounded-full
                    bg-blue-600
                    transition-transform
                    duration-200
                    group-hover:scale-x-100
                  "
                />
              </a>
            ))}

          </div>

          {/* =================================================
              AUTH BUTTONS
          ================================================= */}

          <div className="ml-3 flex items-center gap-2">

            {/* Login */}
            <Link
              href="/login"
              className="
                hidden
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-700
                transition-all
                duration-200
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-950
                sm:inline-flex
              "
            >
              Einloggen
            </Link>

            {/* Registrierung */}
            <Link
              href="/registrieren"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-slate-950
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-slate-950/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-blue-600
                hover:shadow-blue-600/20
              "
            >
              Registrieren
            </Link>

          </div>

        </nav>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        <div className="mt-2 lg:hidden">

          <div
            className="
              flex
              min-w-max
              gap-2
              overflow-x-auto
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  rounded-xl
                  border
                  border-slate-200/80
                  bg-white/95
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-slate-600
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-200
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
