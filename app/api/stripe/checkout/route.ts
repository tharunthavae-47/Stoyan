import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { STRIPE_PRICE_IDS, getEmployeePremiumPriceId, type PaidPlan, type EmployeePaidPlan } from "@/lib/stripe"

export const runtime = "nodejs"

const annualEmployerPrices: Record<PaidPlan, number> = {
  basic: 1490,
  professional: 2990,
  business: 4990,
}

const annualEmployeePrices: Record<EmployeePaidPlan, number> = {
  premium: 190,
}

const planNames: Record<string, string> = {
  basic: "Basic",
  professional: "Professional",
  business: "Business",
  premium: "Premium",
}

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
    const plan = String(body?.plan || "")
    const billingCycle = body?.billingCycle === "year" ? "year" : "month"

    if (!user) {
      return NextResponse.json({ error: "Bitte melde dich zuerst an." }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: "Deine Kontorolle konnte nicht überprüft werden." }, { status: 500 })
    }

    const role = profile?.role
    if (role !== "employee" && role !== "employer") {
      return NextResponse.json({ error: "Deinem Konto ist noch keine gültige Rolle zugewiesen." }, { status: 403 })
    }

    const employerPlan = plan === "basic" || plan === "professional" || plan === "business"
    const employeePlan = plan === "premium"

    if (role === "employer" && !employerPlan) {
      return NextResponse.json({ error: "Dieser Plan passt nicht zu deiner Rolle." }, { status: 403 })
    }

    if (role === "employee" && !employeePlan) {
      return NextResponse.json({ error: "Dieser Plan passt nicht zu deiner Rolle." }, { status: 403 })
    }

    if (!employerPlan && !employeePlan) {
      return NextResponse.json({ error: "Ungültiger kostenpflichtiger Plan." }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY fehlt in den Vercel-Umgebungsvariablen." }, { status: 500 })
    }

    if (role === "employee" && !getEmployeePremiumPriceId() && billingCycle === "month") {
      return NextResponse.json(
        { error: "Der Stripe-Preis für Arbeitnehmer Premium ist noch nicht in Vercel hinterlegt." },
        { status: 500 },
      )
    }

    let customerId = ""

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

    const params = new URLSearchParams()
    params.set("mode", "subscription")
    params.set("customer", customerId)
    params.set("line_items[0][quantity]", "1")
    params.set("success_url", `${getOrigin(request)}/abo/erfolg?session_id={CHECKOUT_SESSION_ID}`)
    params.set("cancel_url", `${getOrigin(request)}/preise?checkout=cancelled`)
    params.set("client_reference_id", user.id)
    params.set("metadata[role]", role)
    params.set("metadata[plan_id]", plan)
    params.set("metadata[billing_cycle]", billingCycle)
    params.set("subscription_data[metadata][role]", role)
    params.set("subscription_data[metadata][plan_id]", plan)
    params.set("subscription_data[metadata][billing_cycle]", billingCycle)
    params.set("subscription_data[metadata][user_id]", user.id)

    if (billingCycle === "year") {
      const annualPrice = role === "employee"
        ? annualEmployeePrices[plan as EmployeePaidPlan]
        : annualEmployerPrices[plan as PaidPlan]

      params.set("line_items[0][price_data][currency]", "chf")
      params.set("line_items[0][price_data][unit_amount]", String(annualPrice * 100))
      params.set("line_items[0][price_data][recurring][interval]", "year")
      params.set(
        "line_items[0][price_data][product_data][name]",
        `JobMatch24 ${planNames[plan]} – Jahresabo`,
      )
    } else {
      const priceId = role === "employee"
        ? getEmployeePremiumPriceId()
        : STRIPE_PRICE_IDS[plan as PaidPlan]

      params.set("line_items[0][price]", priceId)
    }

    // Arbeitgeber behalten den bestehenden 90-Tage-Test.
    // Arbeitnehmer Premium startet ohne Trial.
    if (role === "employer") {
      params.set("subscription_data[trial_period_days]", "90")
      params.set("payment_method_collection", "always")
    }

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

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error", error)
    return NextResponse.json({ error: "Checkout konnte nicht gestartet werden." }, { status: 500 })
  }
}
