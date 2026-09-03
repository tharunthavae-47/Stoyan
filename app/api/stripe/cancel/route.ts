import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("id, provider_subscription_id, status")
      .eq("user_id", user.id)
      .maybeSingle()

    if (subscriptionError) {
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 })
    }

    const subscriptionId = subscription?.provider_subscription_id
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!subscriptionId || !stripeKey) {
      return NextResponse.json({ error: "Kein aktives Stripe-Abo gefunden." }, { status: 400 })
    }

    if (["canceled", "incomplete_expired"].includes(subscription.status || "")) {
      return NextResponse.json({ success: true, alreadyCanceled: true })
    }

    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${stripeKey}` },
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Das Stripe-Abo konnte nicht sofort gekündigt werden." },
        { status: 502 },
      )
    }

    const canceledAt = typeof data?.canceled_at === "number"
      ? new Date(data.canceled_at * 1000).toISOString()
      : new Date().toISOString()

    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        cancel_at_period_end: false,
        canceled_at: canceledAt,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Subscription canceled in Stripe but local sync failed", updateError)
      return NextResponse.json({
        success: true,
        warning: "Stripe wurde gekündigt. Die lokale Anzeige wird über den Stripe-Webhook synchronisiert.",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Stripe immediate cancellation error", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Abo konnte nicht gekündigt werden." },
      { status: 500 },
    )
  }
}
