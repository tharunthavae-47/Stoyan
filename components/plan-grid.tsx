"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Minus } from "lucide-react"
import { formatPrice, type Plan } from "@/lib/plans"
import { createClient } from "@/lib/supabase/client"

type PaidPlan = "basic" | "professional" | "business"
type CheckoutRole = "employer"

function getPaidPlanConfig(planId: string): { plan: PaidPlan; role: CheckoutRole } | null {
  if (planId === "basic" || planId === "professional" || planId === "business") {
    return { plan: planId, role: "employer" }
  }
  return null
}

export function PlanGrid({ plans }: { plans: Plan[] }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function startCheckout(planId: string) {
    const config = getPaidPlanConfig(planId)
    if (!config) return

    setError("")
    setLoadingPlan(planId)

    try {
      // Die bestehende Supabase-Session wird direkt aus dem Browser verwendet.
      // Dadurch wird ein bereits angemeldeter Arbeitgeber nicht erneut zur
      // Registrierung geschickt, wenn er aus dem Dashboard ein Abo kauft.
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setLoadingPlan(null)
        setError("Bitte melde dich zuerst an. Deine Anmeldung bleibt danach für den Abo-Kauf erhalten.")
        return
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(config),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Der Checkout konnte nicht gestartet werden.")
      }

      window.location.assign(data.url)
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Der Checkout konnte nicht gestartet werden.",
      )
      setLoadingPlan(null)
    }
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const highlighted = Boolean(plan.highlighted)
          const paidConfig = getPaidPlanConfig(plan.id)
          const isLoading = loadingPlan === plan.id

          return (
            <div
              key={plan.id}
              className={
                highlighted
                  ? "relative flex flex-col rounded-3xl border-2 border-[var(--brand)] bg-white p-8 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.35)]"
                  : "relative flex flex-col rounded-3xl border border-[var(--line)] bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
              }
            >
              {plan.badge && (
                <span
                  className={
                    "absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider " +
                    (highlighted
                      ? "bg-[var(--brand)] text-white"
                      : "bg-[var(--navy)] text-white")
                  }
                >
                  {plan.badge}
                </span>
              )}

              <h3 className="text-xl font-black text-[var(--navy)]">{plan.name}</h3>
              <p className="mt-2 min-h-[42px] text-sm text-[var(--muted)]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight text-[var(--navy)]">
                  {formatPrice(plan.price)}
                </span>
                {plan.period && (
                  <span className="pb-1 text-sm font-medium text-[var(--muted)]">
                    {plan.period}
                  </span>
                )}
              </div>
              {plan.priceNote && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {plan.priceNote}
                </p>
              )}

              {paidConfig ? (
                <button
                  type="button"
                  onClick={() => startCheckout(plan.id)}
                  disabled={loadingPlan !== null}
                  className={
                    "mt-7 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 " +
                    (highlighted
                      ? "bg-[var(--brand)] text-white hover:brightness-110"
                      : "border border-[var(--line)] text-[var(--navy)] hover:bg-[var(--surface-2)]")
                  }
                >
                  {isLoading ? "Checkout wird geöffnet…" : plan.ctaLabel}
                </button>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className={
                    "mt-7 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition " +
                    (highlighted
                      ? "bg-[var(--brand)] text-white hover:brightness-110"
                      : "border border-[var(--line)] text-[var(--navy)] hover:bg-[var(--surface-2)]")
                  }
                >
                  {plan.ctaLabel}
                </Link>
              )}

              <ul className="mt-8 space-y-3 border-t border-[var(--line)] pt-6">
                {plan.features.map((feature, i) => {
                  const included = feature.included !== false
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span
                        className={
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                          (included
                            ? "bg-[var(--brand)]/12 text-[var(--brand)]"
                            : "bg-[var(--surface-2)] text-[var(--muted)]")
                        }
                      >
                        {included ? (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        ) : (
                          <Minus className="h-3 w-3" strokeWidth={3} />
                        )}
                      </span>
                      <span
                        className={
                          included
                            ? "font-medium text-[var(--navy)]"
                            : "text-[var(--muted)] line-through"
                        }
                      >
                        {feature.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {error && (
        <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
