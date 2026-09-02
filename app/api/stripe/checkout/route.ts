import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { STRIPE_PRICE_IDS, type PaidPlan } from "@/lib/stripe"

export const runtime = "nodejs"

function getOrigin(request: Request) {
  return new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json().catch(() => ({}))
    const plan = body?.plan as PaidPlan
    const requestedRole =
      body?.role === "employee"
        ? "employee"
        : body?.role === "employer"
          ? "employer"
          : null

    if (!plan || !(plan in STRIPE_PRICE_IDS)) {
      return NextResponse.json({ error: "Ungültiger kostenpflichtiger Plan." }, { status: 400 })
    }

    const planRole =
      plan === "premium"
        ? "employee"
        : plan === "professional"
          ? "employer"
          : null

    if (!planRole) {
      return NextResponse.json(
        { error: "Dieser Plan kann nicht über den Checkout gekauft werden." },
        { status: 400 },
      )
    }

    let role: "employee" | "employer"

    if (user) {
      // Bei eingeloggten Nutzern niemals user_metadata für Berechtigungen verwenden.
      // Die autoritative Rolle kommt aus der geschützten profiles-Tabelle.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) {
        return NextResponse.json(
          { error: "Deine Kontorolle konnte nicht überprüft werden." },
          { status: 500 },
        )
      }

      if (profile?.role !== "employee" && profile?.role !== "employer") {
        return NextResponse.json(
          { error: "Deinem Konto ist noch keine gültige Rolle zugewiesen." },
          { status: 403 },
        )
      }

      role = profile.role
    } else {
      // Gast-Checkout: die UI darf die gewünschte Rolle für den Kauf angeben.
      role = requestedRole || planRole
    }

    if (role !== planRole) {
      return NextResponse.json(
        { error: "Dieser Plan passt nicht zu deiner Rolle." },
        { status: 403 },
      )
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY fehlt in den Vercel-Umgebungsvariablen." },
        { status: 500 },
      )
    }

    let customerId = ""

    if (user) {
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("provider_customer_id")
        .eq("user_id", user.id)
        .maybeSingle()

      customerId = existing?.provider_customer_id || ""

      if (!customerId) {
        const customerParams = new URLSearchParams()
        if (user.email) customerParams.set("email", user.email)
        customerParams.set("metadata[user_id]", user.id)
        customerParams.set("metadata[role]", role)

        const customerResponse = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: customerParams.toString(),
        })

        const customer = await customerResponse.json()
        if (!customerResponse.ok) {
          return NextResponse.json(
            { error: customer?.error?.message || "Stripe-Kunde konnte nicht erstellt werden." },
            { status: 502 },
          )
        }

        customerId = customer.id
      }
    }

    const params = new URLSearchParams()
    params.set("mode", "subscription")
    if (customerId) params.set("customer", customerId)
    params.set("line_items[0][price]", STRIPE_PRICE_IDS[plan])
    params.set("line_items[0][quantity]", "1")
    params.set("success_url", `${getOrigin(request)}/abo/erfolg?session_id={CHECKOUT_SESSION_ID}`)
    params.set("cancel_url", `${getOrigin(request)}/preise?checkout=cancelled`)
    if (user) params.set("client_reference_id", user.id)
    params.set("metadata[role]", role)
    params.set("metadata[plan_id]", plan)
    if (user) params.set("metadata[user_id]", user.id)
    params.set("subscription_data[metadata][role]", role)
    params.set("subscription_data[metadata][plan_id]", plan)
    if (user) params.set("subscription_data[metadata][user_id]", user.id)
    params.set("billing_address_collection", "auto")

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const session = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        { error: session?.error?.message || "Stripe Checkout konnte nicht erstellt werden." },
        { status: 502 },
      )
    }

    // Die endgültige Speicherung in subscriptions übernimmt ausschließlich der signierte Stripe-Webhook.
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error", error)
    return NextResponse.json({ error: "Checkout konnte nicht gestartet werden." }, { status: 500 })
  }
}
