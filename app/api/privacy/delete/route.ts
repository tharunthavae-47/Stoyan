import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

export async function POST() {
  try {
    const session = await createServerClient()
    const { data: { user }, error } = await session.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })

    const admin = createAdminClient()
    const { data: subscriptions, error: subscriptionError } = await admin.from("subscriptions").select("provider,provider_subscription_id,status").eq("user_id", user.id)
    if (subscriptionError) throw subscriptionError

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    for (const subscription of subscriptions ?? []) {
      const activeStripe = subscription.provider === "stripe" && subscription.provider_subscription_id && !["canceled", "incomplete_expired"].includes(subscription.status)
      if (!activeStripe) continue
      if (!stripeSecret) return NextResponse.json({ error: "Das Konto hat ein aktives Stripe-Abonnement. Bitte STRIPE_SECRET_KEY in Vercel konfigurieren, damit es vor der Löschung gekündigt wird." }, { status: 503 })
      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscription.provider_subscription_id)}`, { method: "DELETE", headers: { Authorization: `Basic ${Buffer.from(`${stripeSecret}:`).toString("base64")}` } })
      if (!response.ok) return NextResponse.json({ error: "Das aktive Abonnement konnte nicht gekündigt werden. Das Konto wurde aus Sicherheitsgründen noch nicht gelöscht." }, { status: 502 })
    }

    const { data: files } = await admin.storage.from("employee-media").list(user.id, { limit: 1000 })
    if (files?.length) await admin.storage.from("employee-media").remove(files.map(file => `${user.id}/${file.name}`))

    const cleanup = await Promise.all([
      admin.from("subscription_events").delete().eq("user_id", user.id),
      admin.from("subscriptions").delete().eq("user_id", user.id),
      admin.from("privacy_requests").delete().eq("user_id", user.id),
    ])
    const cleanupError = cleanup.find(result => result.error)?.error
    if (cleanupError) throw cleanupError

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Kontolöschung:", e)
    return NextResponse.json({ error: "Das Konto konnte nicht vollständig gelöscht werden. Bitte wenden Sie sich an den Datenschutzkontakt." }, { status: 500 })
  }
}
