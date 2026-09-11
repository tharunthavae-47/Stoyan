"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check, Minus } from "lucide-react"
import { formatPrice, type Plan } from "@/lib/plans"
import { createClient } from "@/lib/supabase/client"

type PaidPlan = "basic" | "professional" | "business"
type CheckoutRole = "employer"
type BillingCycle = "month" | "year"

const annualPrices: Record<PaidPlan, number> = {
  basic: 1490,
  professional: 2990,
  business: 4990,
}

function getPaidPlanConfig(planId: string): { plan: PaidPlan; role: CheckoutRole } | null {
  if (planId === "basic" || planId === "professional" || planId === "business") {
    return { plan: planId, role: "employer" }
  }
  return null
}

export function PlanGrid({ plans }: { plans: Plan[] }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("month")
  const hasEmployerPlans = plans.some((plan) => getPaidPlanConfig(plan.id) !== null)

  async function startCheckout(planId: string) {
    const config = getPaidPlanConfig(planId)
    if (!config) return

    setError("")
    setLoadingPlan(planId)

    try {
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
        body: JSON.stringify({ ...config, billingCycle }),
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
      {hasEmployerPlans && (
        <div className="mb-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex border border-[#dfe4ea]">
            <button
              type="button"
              onClick={() => setBillingCycle("month")}
              className={
                "px-6 py-2.5 text-[0.875rem] font-medium transition " +
                (billingCycle === "month"
                  ? "bg-[#162940] text-white"
                  : "bg-white text-[#576373] hover:text-[#14243a]")
              }
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("year")}
              className={
                "px-6 py-2.5 text-[0.875rem] font-medium transition " +
                (billingCycle === "year"
                  ? "bg-[#2356d8] text-white"
                  : "bg-white text-[#576373] hover:text-[#14243a]")
              }
            >
              Jährlich
            </button>
          </div>
          <p className="flex items-center gap-2.5 text-[0.8125rem] font-medium tracking-[0.04em] text-[#2356d8]">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#2356d8]" />
            {billingCycle === "year" ? "JÄHRLICH ZAHLEN UND 2 MONATE SPAREN" : "3 MONATE KOSTENLOS TESTEN"}
          </p>
        </div>
      )}

      <div className="grid gap-0 border-t border-[#cdd6e0] lg:grid-cols-3">
        {plans.map((plan, index) => {
          const highlighted = Boolean(plan.highlighted)
          const paidConfig = getPaidPlanConfig(plan.id)
          const isLoading = loadingPlan === plan.id
          const annualPrice = paidConfig ? annualPrices[paidConfig.plan] : null
          const displayPrice = billingCycle === "year" && annualPrice !== null ? annualPrice : plan.price
          const displayPeriod = billingCycle === "year" && annualPrice !== null ? "/ Jahr" : plan.period
          const displayNote =
            billingCycle === "year" && annualPrice !== null
              ? "3 Monate kostenlos testen · 2 Monate sparen"
              : plan.priceNote

          return (
            <div
              key={plan.id}
              className={
                "flex flex-col border-b border-[#dfe4ea] p-8 lg:border-b-0 " +
                (index > 0 ? "lg:border-l lg:border-[#dfe4ea] " : "") +
                (highlighted ? "bg-[#f4f7fe]" : "bg-white")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[1.25rem] font-medium tracking-[-0.03em] text-[#14243a]">{plan.name}</h3>
                {plan.badge && (
                  <span
                    className={
                      "px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] " +
                      (highlighted ? "bg-[#2356d8] text-white" : "border border-[#c9d2dd] text-[#52667e]")
                    }
                  >
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-2.5 min-h-[42px] text-[0.9375rem] leading-[1.6] text-[#576373]">{plan.description}</p>

              <div className="mt-6 flex items-end gap-2 border-b border-[#dfe4ea] pb-6">
                <span className="text-[2.75rem] font-medium leading-none tracking-[-0.05em] text-[#14243a]">
                  {formatPrice(displayPrice)}
                </span>
                {displayPeriod && (
                  <span className="pb-1.5 text-[0.875rem] text-[#687384]">{displayPeriod}</span>
                )}
              </div>
              {displayNote && (
                <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#687384]">
                  {displayNote}
                </p>
              )}

              {paidConfig ? (
                <button
                  type="button"
                  onClick={() => startCheckout(plan.id)}
                  disabled={loadingPlan !== null}
                  className={
                    "mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[4px] px-6 text-[0.9375rem] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 " +
                    (highlighted
                      ? "bg-[#2356d8] text-white hover:bg-[#1844b6]"
                      : "border border-[#d3dbe4] text-[#14243a] hover:bg-[#f2f5f8]")
                  }
                >
                  {isLoading ? "Checkout wird geöffnet…" : billingCycle === "year" ? "Jährlich starten" : plan.ctaLabel}
                  {!isLoading && <ArrowRight className="h-[17px] w-[17px]" />}
                </button>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className={
                    "mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[4px] px-6 text-[0.9375rem] font-medium transition " +
                    (highlighted
                      ? "bg-[#2356d8] text-white hover:bg-[#1844b6]"
                      : "border border-[#d3dbe4] text-[#14243a] hover:bg-[#f2f5f8]")
                  }
                >
                  {plan.ctaLabel}
                  <ArrowRight className="h-[17px] w-[17px]" />
                </Link>
              )}

              <ul className="mt-8 grid gap-3.5 border-t border-[#dfe4ea] pt-6">
                {plan.features.map((feature, i) => {
                  const included = feature.included !== false
                  return (
                    <li key={i} className="flex items-start gap-3 text-[0.875rem]">
                      {included ? (
                        <Check className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#2356d8]" strokeWidth={2} />
                      ) : (
                        <Minus className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#a7b3c2]" strokeWidth={2} />
                      )}
                      <span className={included ? "text-[#38465a]" : "text-[#98a4b3] line-through"}>
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
        <p className="mt-6 border-l-2 border-[#da3839] bg-[#fef2f2] px-4 py-3 text-[0.875rem] text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  )
}
