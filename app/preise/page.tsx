"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PlanGrid } from "@/components/plan-grid"
import { employerPlans, employeePlans } from "@/lib/plans"

type Audience = "arbeitgeber" | "arbeitnehmer"
type UserRole = "employer" | "employee"

export default function PreisePage() {
  const [audience, setAudience] = useState<Audience>("arbeitgeber")
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loadingRole, setLoadingRole] = useState(true)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function loadRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          if (active) setLoadingRole(false)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (!active) return

        if (profile?.role === "employee" || profile?.role === "employer") {
          setUserRole(profile.role)
          setAudience(profile.role === "employer" ? "arbeitgeber" : "arbeitnehmer")
        }
      } finally {
        if (active) setLoadingRole(false)
      }
    }

    void loadRole()

    return () => {
      active = false
    }
  }, [])

  const plans = audience === "arbeitgeber" ? employerPlans : employeePlans

  return (
    <main className="bg-white text-[#14243a]">
      <section className="mx-auto w-[min(1280px,calc(100%-48px))] pt-16 pb-10 sm:w-[min(1280px,calc(100%-64px))] sm:pt-20">
        <div className="max-w-[720px]">
          <p className="ed-eyebrow mb-5">PREISE UND ABOS</p>
          <h1 className="text-[clamp(2.4rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.055em] text-balance">
            Ein Preis, der zu
            <br />
            deinem Vorhaben passt.
          </h1>
          <p className="mt-6 max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#576373]">
            Transparent, fair und jederzeit anpassbar. Wähle den Plan, der zu dir passt – du kannst später jederzeit
            wechseln.
          </p>
        </div>

        {loadingRole ? (
          <div className="mt-9 h-11 w-72 animate-pulse rounded-[4px] bg-[#eef2f8]" />
        ) : userRole ? (
          <div className="mt-9 inline-flex items-center gap-2.5 border border-[#dfe4ea] px-4 py-2.5 text-[0.8125rem] font-medium tracking-[0.04em]">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#2356d8]" />
            {userRole === "employer" ? "ABO FÜR ARBEITGEBER" : "ABO FÜR ARBEITNEHMER"}
          </div>
        ) : (
          <div className="mt-9 inline-flex border border-[#dfe4ea]">
            {(
              [
                ["arbeitgeber", "Für Arbeitgeber"],
                ["arbeitnehmer", "Für Arbeitnehmer"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAudience(value)}
                className={
                  "px-6 py-3 text-[0.875rem] font-medium transition " +
                  (audience === value
                    ? "bg-[#162940] text-white"
                    : "bg-white text-[#576373] hover:text-[#14243a]")
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-[min(1280px,calc(100%-48px))] pb-16 sm:w-[min(1280px,calc(100%-64px))]">
        <PlanGrid plans={plans} />
      </section>

      <section className="border-t border-[#dfe4ea] bg-[#f2f5f8]">
        <div className="mx-auto grid w-[min(1280px,calc(100%-48px))] gap-8 py-14 sm:w-[min(1280px,calc(100%-64px))] sm:grid-cols-3">
          {[
            ["Jederzeit kündbar", "Keine Mindestlaufzeit, keine versteckten Kosten."],
            ["Schweizer Datenschutz", "Alle Daten werden DSG-konform verarbeitet."],
            ["Persönlicher Support", "Unser Team hilft dir schnell und direkt weiter."],
          ].map(([title, text]) => (
            <div key={title} className="border-t border-[#c9d2dd] pt-5">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-[#576373]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-[min(1280px,calc(100%-48px))] flex-col items-start gap-5 py-16 sm:w-[min(1280px,calc(100%-64px))] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[1.125rem] font-medium tracking-[-0.02em]">
          Noch unsicher, welcher Plan passt?
        </p>
        <Link
          href="/registrieren"
          className="ed-btn-primary"
        >
          Jetzt kostenlos starten
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </section>
    </main>
  )
}
