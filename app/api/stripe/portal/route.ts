import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("provider_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    const customerId = subscription?.provider_customer_id
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!customerId || !stripeKey) {
      return NextResponse.json({ error: "Kein verwaltbares Stripe-Abo gefunden." }, { status: 400 })
    }

    const params = new URLSearchParams()
    params.set("customer", customerId)
    params.set("return_url", `${new URL(request.url).origin}/arbeitgeber`)

    const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "Stripe-Verwaltung konnte nicht geöffnet werden." }, { status: 502 })

    return NextResponse.json({ url: data.url })
  } catch (error) {
    console.error("Stripe portal error", error)
    return NextResponse.json({ error: "Abo-Verwaltung konnte nicht geöffnet werden." }, { status: 500 })
  }
}
