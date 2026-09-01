import { NextResponse } from "next/server"
import crypto from "node:crypto"

export const runtime = "nodejs"

function verifyStripeSignature(payload: string, signature: string, secret: string) {
  const parts = signature.split(",")
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2)
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3))
  if (!timestamp || signatures.length === 0) return false
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp))
  if (!Number.isFinite(age) || age > 300) return false
  const signedPayload = `${timestamp}.${payload}`
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex")
  return signatures.some((value) => value.length === expected.length && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected)))
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase server environment variables fehlen.")
  const headers = new Headers(init.headers)
  headers.set("apikey", key)
  headers.set("Authorization", `Bearer ${key}`)
  headers.set("Content-Type", "application/json")
  return fetch(`${url}/rest/v1/${path}`, { ...init, headers })
}

function isoFromUnix(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : null
}

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret || !verifyStripeSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Ungültige Stripe-Signatur." }, { status: 400 })
  }

  try {
    const event = JSON.parse(payload)
    const object = event.data?.object || {}
    const metadata = object.metadata || {}
    const userId = metadata.user_id || object.client_reference_id || null
    const planId = metadata.plan_id || null
    const role = metadata.role === "employee" ? "employee" : metadata.role === "employer" ? "employer" : null

    // Idempotenz: denselben Stripe-Event nicht zweimal verarbeiten.
    const eventResponse = await supabaseRequest("subscription_events", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ provider: "stripe", provider_event_id: event.id, event_type: event.type, user_id: userId, payload: event }),
    })
    if (!eventResponse.ok && eventResponse.status !== 409) {
      const text = await eventResponse.text()
      throw new Error(`Subscription event konnte nicht gespeichert werden: ${text}`)
    }

    if (event.type === "checkout.session.completed") {
      const customerId = object.customer || null
      const subscriptionId = object.subscription || null
      if (userId && planId && role) {
        await supabaseRequest(`subscriptions?user_id=eq.${encodeURIComponent(userId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ provider: "stripe", provider_customer_id: customerId, provider_subscription_id: subscriptionId, plan_id: planId, role, status: "active", cancel_at_period_end: false, updated_at: new Date().toISOString() }),
        })
      }
    }

    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      const customerId = object.customer || null
      const subscriptionId = object.id || null
      const subscriptionMetadata = object.metadata || {}
      const resolvedUserId = subscriptionMetadata.user_id || userId
      const resolvedPlanId = subscriptionMetadata.plan_id || planId
      const resolvedRole = subscriptionMetadata.role === "employee" ? "employee" : subscriptionMetadata.role === "employer" ? "employer" : role
      if (resolvedUserId && resolvedPlanId && resolvedRole) {
        const status = event.type === "customer.subscription.deleted" ? "canceled" : object.status || "active"
        await supabaseRequest(`subscriptions?user_id=eq.${encodeURIComponent(resolvedUserId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ provider: "stripe", provider_customer_id: customerId, provider_subscription_id: subscriptionId, plan_id: resolvedPlanId, role: resolvedRole, status, current_period_start: isoFromUnix(object.current_period_start), current_period_end: isoFromUnix(object.current_period_end), cancel_at_period_end: Boolean(object.cancel_at_period_end), canceled_at: isoFromUnix(object.canceled_at), updated_at: new Date().toISOString() }),
        })
      }
    }

    if (event.type === "invoice.payment_failed") {
      const customerId = object.customer
      if (customerId) await supabaseRequest(`subscriptions?provider_customer_id=eq.${encodeURIComponent(customerId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "past_due", updated_at: new Date().toISOString() }) })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error", error)
    return NextResponse.json({ error: "Webhook-Verarbeitung fehlgeschlagen." }, { status: 500 })
  }
}
