"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const APP_ROUTE_PREFIXES = ["/arbeitgeber", "/arbeitnehmer", "/dashboard"]

const links = [
  { href: "/#ueber-stoyan", label: "Über jobmacht24" },
  { href: "/#so-funktioniert", label: "So funktioniert's" },
  { href: "/#arbeitnehmer", label: "Arbeitnehmer" },
  { href: "/#arbeitgeber", label: "Arbeitgeber" },
  { href: "/#matching", label: "Matching" },
  { href: "/preise", label: "Preise" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)

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

  if (APP_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto max-w-[1440px]">
        <nav className="flex min-h-[68px] items-center rounded-2xl border border-slate-200/80 bg-white/95 px-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:min-h-[74px] sm:px-5">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-base font-black text-white shadow-lg shadow-slate-950/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl sm:h-11 sm:w-11 sm:text-lg">
              <span className="relative z-10">J</span>
              <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-blue-600/80 blur-xl" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[19px] font-black tracking-[-0.055em] text-slate-950">jobmacht24</div>
              <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400">Menschen verbinden</div>
            </div>
          </Link>

          <div className="ml-auto hidden items-center gap-1.5 lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="group relative rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950">
                {link.label}
                <span className="absolute bottom-1.5 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-blue-600 transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-2">
            {loggedIn ? (
              <Link href="/konto" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 sm:px-5 sm:text-sm">
                <UserRound className="h-4 w-4" />
                Konto
              </Link>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 sm:px-4 sm:text-sm">Einloggen</Link>
                <Link href="/registrieren" className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 sm:px-5 sm:text-sm">Registrieren</Link>
              </>
            )}
          </div>
        </nav>

        <div className="mt-2 lg:hidden">
          <div className="flex w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 pr-1 touch-pan-x snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" style={{ WebkitOverflowScrolling: "touch" }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="shrink-0 snap-start rounded-xl border border-slate-200/80 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98]">{link.label}</Link>
            ))}
          </div>
          <div className="pointer-events-none -mt-1 flex justify-center"><span className="h-1 w-10 rounded-full bg-slate-200" aria-hidden="true" /></div>
        </div>
      </div>
    </header>
  )
}
