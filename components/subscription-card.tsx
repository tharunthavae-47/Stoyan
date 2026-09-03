"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CreditCard, Settings2, X } from "lucide-react"

type Subscription = {
  id: string
  provider_customer_id: string | null
  provider_subscription_id: string | null
  plan_id: string | null
  role: string | null
  status: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
}

const PLAN_NAMES: Record<string, string> = { basic: "Basic", professional: "Professional", business: "Business", premium: "Premium" }
const STATUS_NAMES: Record<string, string> = { active: "Aktiv", trialing: "Testphase", past_due: "Zahlung ausstehend", canceled: "Gekündigt", unpaid: "Unbezahlt", incomplete: "Unvollständig", incomplete_expired: "Abgelaufen" }
const PLAN_DETAILS: Record<string, { price: number; jobs: string; saved: string; contacts: string; users: string; filters: string; chat: boolean; extras: string[] }> = {
  basic: { price: 149, jobs: "5", saved: "5", contacts: "5 / Monat", users: "1", filters: "Beruf", chat: false, extras: ["Matching-%", "Kandidatenprofile", "Live-Verfügbarkeit"] },
  professional: { price: 299, jobs: "10", saved: "10", contacts: "10 / Monat", users: "3", filters: "Alle Filter", chat: true, extras: ["Prioritäts-Support"] },
  business: { price: 499, jobs: "Unbegrenzt", saved: "Unbegrenzt", contacts: "Unbegrenzt", users: "Unbegrenzt", filters: "Alle Filter", chat: true, extras: ["Interviewplanung", "HR Copilot (KI)", "Advanced Verification", "Analytics & Reports", "Talent Pool Management", "Exporte & Integrationen", "Prioritäts-Support"] },
}

function formatDate(value: string | null) { return value ? new Date(value).toLocaleDateString("de-CH") : "—" }

export function SubscriptionCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [error, setError] = useState("")

  async function loadSubscription() {
    try {
      setError("")
      const response = await fetch("/api/subscriptions/me", { cache: "no-store" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || "Abo konnte nicht geladen werden.")
      setSubscription(data?.subscription ?? null)
    } catch (err) { setError(err instanceof Error ? err.message : "Abo konnte nicht geladen werden.") }
    finally { setLoading(false) }
  }

  async function openStripePortal() {
    try {
      setPortalLoading(true); setError("")
      const response = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.url) throw new Error(data?.error || "Abo-Verwaltung konnte nicht geöffnet werden.")
      window.location.href = data.url
    } catch (err) { setError(err instanceof Error ? err.message : "Abo-Verwaltung konnte nicht geöffnet werden."); setPortalLoading(false) }
  }

  async function cancelImmediately() {
    if (!window.confirm("Möchtest du dein Abo wirklich sofort kündigen? Dein Zugriff auf die kostenpflichtigen Funktionen endet unmittelbar.")) return
    try {
      setCancelLoading(true); setError("")
      const response = await fetch("/api/stripe/cancel", { method: "POST" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || "Abo konnte nicht gekündigt werden.")
      await loadSubscription()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Abo konnte nicht gekündigt werden.")
    } finally {
      setCancelLoading(false)
    }
  }

  useEffect(() => { void loadSubscription(); const onFocus = () => void loadSubscription(); window.addEventListener("focus", onFocus); return () => window.removeEventListener("focus", onFocus) }, [])

  const plan = subscription?.plan_id ? PLAN_DETAILS[subscription.plan_id] : null
  const active = subscription && ["active", "trialing"].includes(subscription.status || "")

  return (
    <>
      <section className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]"><CreditCard className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Mein Abo</p>
              {loading ? <p className="mt-2 text-sm font-semibold text-[var(--muted)]">Abo wird geladen…</p> : subscription ? <>
                <div className="mt-1 flex flex-wrap items-center gap-2"><h2 className="text-xl font-black text-[var(--navy)]">{PLAN_NAMES[subscription.plan_id || ""] || subscription.plan_id || "Abo"}</h2><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">{STATUS_NAMES[subscription.status || ""] || subscription.status || "—"}</span></div>
                <p className="mt-1 text-sm text-[var(--muted)]">{subscription.cancel_at_period_end ? `Kündigung zum ${formatDate(subscription.current_period_end)}` : `Läuft bis ${formatDate(subscription.current_period_end)}`}</p>
              </> : <><h2 className="mt-1 text-xl font-black text-[var(--navy)]">Noch kein kostenpflichtiges Abo</h2><p className="mt-1 text-sm text-[var(--muted)]">Wähle deinen passenden Plan.</p></>}
              {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
            </div>
          </div>
          <button type="button" onClick={() => subscription ? setOpen(true) : (window.location.href = "/preise")} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--surface-2)]">{subscription ? "Abo verwalten" : "Abo auswählen"}{subscription ? <Settings2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</button>
        </div>
        {subscription && <div className="mt-5 grid gap-3 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-3"><div><span className="text-[var(--muted)]">Plan</span><p className="mt-1 font-bold text-[var(--navy)]">{PLAN_NAMES[subscription.plan_id || ""] || subscription.plan_id || "—"}</p></div><div><span className="text-[var(--muted)]">Status</span><p className="mt-1 font-bold text-[var(--navy)]">{STATUS_NAMES[subscription.status || ""] || subscription.status || "—"}</p></div><div><span className="text-[var(--muted)]">Nächste Abrechnung</span><p className="mt-1 font-bold text-[var(--navy)]">{formatDate(subscription.current_period_end)}</p></div></div>}
      </section>

      {open && subscription && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Abo verwalten</p><h2 className="mt-1 text-2xl font-black text-[var(--navy)]">{PLAN_NAMES[subscription.plan_id || ""] || subscription.plan_id}</h2><p className="mt-1 text-sm text-[var(--muted)]">Hier siehst du deine Vorteile und kannst dein Abo ändern oder kündigen.</p></div><button onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
          {plan && <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-[var(--muted)]">Monatlicher Preis</p><p className="mt-1 text-xl font-black">CHF {plan.price}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-[var(--muted)]">Läuft bis</p><p className="mt-1 text-xl font-black">{formatDate(subscription.current_period_end)}</p></div></div>}
          {plan && <><h3 className="mt-7 text-lg font-black">Dein Abo bietet</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{plan.extras.map(item => <div key={item} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold">✓ {item}</div>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-4"><div className="rounded-xl border p-3"><p className="text-xs text-slate-500">Aktive Stellen</p><p className="font-black">{plan.jobs}</p></div><div className="rounded-xl border p-3"><p className="text-xs text-slate-500">Gespeicherte Kandidaten</p><p className="font-black">{plan.saved}</p></div><div className="rounded-xl border p-3"><p className="text-xs text-slate-500">Kontaktanfragen</p><p className="font-black">{plan.contacts}</p></div><div className="rounded-xl border p-3"><p className="text-xs text-slate-500">HR-Benutzer</p><p className="font-black">{plan.users}</p></div></div></>}
          <div className="mt-7 rounded-2xl border border-slate-200 p-4"><h3 className="font-black">Abo ändern</h3><p className="mt-1 text-sm text-slate-500">Du kannst deinen Plan oder deine Zahlungsmethode weiterhin über Stripe verwalten.</p><button type="button" onClick={openStripePortal} disabled={portalLoading || !active} className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{portalLoading ? "Wird geöffnet…" : "Abo bei Stripe verwalten"}</button></div>
          {active && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4"><h3 className="font-black text-red-900">Abo sofort kündigen</h3><p className="mt-1 text-sm text-red-800">Die Kündigung wird sofort an Stripe gesendet. Dein kostenpflichtiger Zugriff endet unmittelbar.</p><button type="button" onClick={cancelImmediately} disabled={cancelLoading} className="mt-4 w-full rounded-xl border border-red-300 bg-white px-5 py-3 font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">{cancelLoading ? "Abo wird gekündigt…" : "Abo sofort kündigen"}</button></div>}
          {!active && subscription.status === "canceled" && <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Dieses Abo ist bereits gekündigt. Für die kostenpflichtigen Funktionen kannst du jederzeit ein neues Abo auswählen.</div>}
          <p className="mt-4 text-xs text-slate-400">Eine sofortige Kündigung beendet das Stripe-Abo unmittelbar. Eine allfällige Rückerstattung wird nicht automatisch vorgenommen.</p>
        </div>
      </div>}
    </>
  )
}
