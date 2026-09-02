"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, CreditCard, Sparkles } from "lucide-react"

type Subscription = {
  id: string
  provider: string
  provider_customer_id: string | null
  provider_subscription_id: string | null
  plan_id: string | null
  role: string | null
  status: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  canceled_at: string | null
}

const PLAN_NAMES: Record<string, string> = {
  premium: "Premium",
  professional: "Professional",
}

const STATUS_NAMES: Record<string, string> = {
  active: "Aktiv",
  trialing: "Testphase",
  past_due: "Zahlung ausstehend",
  canceled: "Gekündigt",
  unpaid: "Unbezahlt",
  incomplete: "Unvollständig",
  incomplete_expired: "Abgelaufen",
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("de-CH")
}

export function SubscriptionCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadSubscription() {
    try {
      setError("")
      const response = await fetch("/api/subscriptions/me", { cache: "no-store" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || "Abo konnte nicht geladen werden.")
      setSubscription(data?.subscription ?? null)
    } catch (err) {
      console.error("Subscription card error", err)
      setError(err instanceof Error ? err.message : "Abo konnte nicht geladen werden.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSubscription()
    const onFocus = () => { void loadSubscription() }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  return (
    <section className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Mein Abo</p>
            {loading ? (
              <p className="mt-2 text-sm font-semibold text-[var(--muted)]">Abo wird geladen…</p>
            ) : subscription ? (
              <>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-[var(--navy)]">
                    {PLAN_NAMES[subscription.plan_id || ""] || subscription.plan_id || "Abo"}
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                    {STATUS_NAMES[subscription.status || ""] || subscription.status || "—"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {subscription.cancel_at_period_end
                    ? `Kündigung zum ${formatDate(subscription.current_period_end)}`
                    : `Läuft bis ${formatDate(subscription.current_period_end)}`}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">Noch kein kostenpflichtiges Abo</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Wähle deinen passenden Plan und erweitere dein Konto.</p>
              </>
            )}
            {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
          </div>
        </div>

        <Link
          href="/preise"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
        >
          {subscription ? "Abo verwalten" : "Abo auswählen"}
          {subscription ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Link>
      </div>

      {subscription && (
        <div className="mt-5 grid gap-3 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-3">
          <div><span className="text-[var(--muted)]">Plan</span><p className="mt-1 font-bold text-[var(--navy)]">{PLAN_NAMES[subscription.plan_id || ""] || subscription.plan_id || "—"}</p></div>
          <div><span className="text-[var(--muted)]">Status</span><p className="mt-1 font-bold text-[var(--navy)]">{STATUS_NAMES[subscription.status || ""] || subscription.status || "—"}</p></div>
          <div><span className="text-[var(--muted)]">Nächste Abrechnung</span><p className="mt-1 font-bold text-[var(--navy)]">{formatDate(subscription.current_period_end)}</p></div>
        </div>
      )}
    </section>
  )
}
