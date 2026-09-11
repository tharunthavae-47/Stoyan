"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, Menu, UserRound, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const APP_ROUTE_PREFIXES = ["/arbeitgeber", "/arbeitnehmer", "/dashboard"]

const links = [
  { href: "/#arbeitnehmer", label: "Für Arbeitnehmer" },
  { href: "/#arbeitgeber", label: "Für Arbeitgeber" },
  { href: "/#so-funktioniert", label: "So funktioniert's" },
  { href: "/#matching", label: "Matching" },
  { href: "/preise", label: "Preise" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (mounted) setLoggedIn(Boolean(data.session))
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setLoggedIn(Boolean(session))
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (APP_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null

  return (
    <>
      {/* Utility bar */}
      <div className="bg-[#15263c] text-[#dbe4ee]">
        <div className="mx-auto flex min-h-[34px] w-[min(1280px,calc(100%-48px))] items-center justify-between text-[0.72rem] tracking-wide sm:w-[min(1280px,calc(100%-64px))]">
          <span>jobmatch24 · Schweiz</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span
              aria-hidden="true"
              className="inline-flex h-[15px] w-[15px] items-center justify-center bg-[#da3839] text-[13px] font-bold leading-none text-white"
            >
              +
            </span>
            Jobs und Mitarbeitende in der Schweiz
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e6e9ee] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[80px] w-[min(1280px,calc(100%-48px))] items-center gap-8 sm:w-[min(1280px,calc(100%-64px))] sm:min-h-[88px]">
          <Link href="/" aria-label="jobmatch24 Startseite" className="shrink-0 transition-opacity hover:opacity-85">
            <img
              src="/jobmatch24-logo.png"
              alt="JOBMATCH24"
              className="h-auto w-[160px] object-contain sm:w-[185px]"
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="ml-auto hidden items-center gap-7 text-[0.875rem] font-medium lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-[#14243a] transition-colors hover:text-[#2356d8]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-4 text-[0.875rem] lg:ml-0 lg:gap-6">
            {loggedIn ? (
              <Link
                href="/konto"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[4px] bg-[#2356d8] px-4 font-medium text-white transition-colors hover:bg-[#1844b6]"
              >
                <UserRound className="h-4 w-4" />
                Konto
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden font-medium text-[#14243a] transition-colors hover:text-[#2356d8] sm:inline">
                  Einloggen
                </Link>
                <Link
                  href="/registrieren"
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[4px] bg-[#2356d8] px-4 font-medium text-white transition-colors hover:bg-[#1844b6]"
                >
                  Jetzt starten
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center text-[#14243a] lg:hidden"
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[#14243a]/40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 flex h-full w-[min(90vw,380px)] flex-col gap-7 overflow-y-auto bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[1.6rem] font-semibold tracking-[-0.065em] text-[#14243a]">
                  jobmatch<span className="font-normal text-[#2356d8]">24</span>
                </p>
                <p className="mt-1 text-[0.875rem] text-[#576373]">Jobs und Mitarbeitende in der Schweiz.</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Menü schliessen"
                className="grid h-11 w-11 place-items-center text-[#14243a]"
              >
                <X className="h-[23px] w-[23px]" />
              </button>
            </div>

            <nav aria-label="Mobile Hauptnavigation" className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between border-b border-[#dfe4ea] py-4 text-[1rem] text-[#14243a]"
                >
                  {link.label}
                  <ArrowRight className="h-[18px] w-[18px] text-[#8593a3]" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-5 py-3">
              <Link
                href="/registrieren"
                className="inline-flex min-h-[54px] items-center justify-between rounded-[4px] bg-[#2356d8] px-5 font-medium text-white"
              >
                Jetzt registrieren
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 text-[0.875rem] font-medium text-[#14243a]">
                Bereits dabei? Einloggen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
