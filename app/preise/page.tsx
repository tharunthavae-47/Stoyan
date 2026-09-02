"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
    <main className="min-h-screen bg-[var(--surface-2)]">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
          Preise
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-black leading-tight tracking-tight text-[var(--navy)] sm:text-5xl">
          Ein Preis, der zu deinem Vorhaben passt.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-[var(--muted)]">
          Transparent, fair und jederzeit anpassbar. Wähle den Plan, der zu dir
          passt – du kannst später jederzeit wechseln.
        </p>

        {loadingRole ? (
          <div className="mx-auto mt-8 h-11 w-72 animate-pulse rounded-full bg-white" />
        ) : userRole ? (
          <div className="mx-auto mt-8 inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--navy)] shadow-sm">
            {userRole === "employer" ? "Abo für Arbeitgeber" : "Abo für Arbeitnehmer"}
          </div>
        ) : (
          <div className="mx-auto mt-8 inline-flex rounded-full border border-[var(--line)] bg-white p-1 shadow-sm">
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
                  "rounded-full px-6 py-2.5 text-sm font-bold transition " +
                  (audience === value
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--navy)]")
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <PlanGrid plans={plans} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 rounded-3xl border border-[var(--line)] bg-white p-8 sm:grid-cols-3">
          {[
            ["Jederzeit kündbar", "Keine Mindestlaufzeit, keine versteckten Kosten."],
            ["Schweizer Datenschutz", "Alle Daten werden DSG-konform verarbeitet."],
            ["Persönlicher Support", "Unser Team hilft dir schnell und direkt weiter."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="font-black text-[var(--navy)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[var(--muted)]">
            Noch unsicher, welcher Plan passt?
          </p>
          <Link
            href="/registrieren"
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-white px-6 py-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>
    </main>
  )
}
