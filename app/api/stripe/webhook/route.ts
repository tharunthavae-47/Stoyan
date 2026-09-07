import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { createClient } from "@supabase/supabase-js"

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

  return signatures.some(
    (value) =>
      value.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected)),
  )
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase server environment variables fehlen.")
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

function isoFromUnix(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : null
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getPlanName(planId: string | null) {
  const names: Record<string, string> = {
    basic: "Basic",
    professional: "Professional",
    business: "Business",
  }
  return planId ? names[planId] || planId : "Stoyan-Abo"
}

async function sendSubscriptionPurchaseEmail(email: string, planId: string | null) {
  const resendApiKey = process.env.RESEND_API_KEY
  const resendFromEmail = process.env.RESEND_FROM_EMAIL

  if (!resendApiKey || !resendFromEmail) {
    console.error("Resend ist für die Abo-Bestätigungs-E-Mail nicht konfiguriert.")
    return
  }

  const normalizedEmail = email.trim().toLowerCase()
  const safeEmail = escapeHtml(normalizedEmail)
  const planName = getPlanName(planId)
  const safePlanName = escapeHtml(planName)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://stoyan-job-matching.vercel.app").replace(/\/$/, "")
  const purchaseDate = new Intl.DateTimeFormat("de-CH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Zurich",
  }).format(new Date())

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#0f172a;color:#fff;border-radius:18px;padding:22px 24px"><div style="font-size:24px;font-weight:800;letter-spacing:-.5px">STOYAN</div><div style="margin-top:6px;color:#cbd5e1">Abo erfolgreich gekauft</div></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px 24px;margin-top:16px"><h1 style="font-size:24px;margin:0 0 14px">Ihr Abo wurde erfolgreich gekauft.</h1><p style="line-height:1.7;color:#475569;margin:0">Vielen Dank! Ihre Zahlung wurde erfolgreich verarbeitet und Ihr Stoyan-Abo wurde aktiviert.</p><div style="margin:22px 0;padding:16px;background:#f8fafc;border-radius:12px"><p style="margin:0 0 8px;color:#64748b;font-size:13px">Abo</p><p style="margin:0;font-weight:700">${safePlanName}</p><p style="margin:12px 0 0;color:#64748b;font-size:13px">Kaufdatum</p><p style="margin:4px 0 0">${escapeHtml(purchaseDate)}</p></div><p style="line-height:1.7;color:#475569">Das Abo ist mit Ihrer E-Mail-Adresse ${safeEmail} verknüpft.</p><a href="${siteUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px;margin-top:8px">Zu Stoyan</a><p style="margin-top:24px;color:#64748b;font-size:14px;line-height:1.6">Vielen Dank, dass Sie Stoyan nutzen.</p></div><p style="text-align:center;color:#94a3b8;font-size:12px;margin:20px 0">Stoyan · Diese Nachricht wurde automatisch versendet.</p></div></body></html>`

  const text = `Ihr Abo wurde erfolgreich gekauft.\n\nVielen Dank! Ihre Zahlung wurde erfolgreich verarbeitet und Ihr Stoyan-Abo wurde aktiviert.\n\nAbo: ${planName}\nKaufdatum: ${purchaseDate}\n\nDas Abo ist mit Ihrer E-Mail-Adresse ${normalizedEmail} verknüpft.\n\nZu Stoyan: ${siteUrl}\n\nVielen Dank, dass Sie Stoyan nutzen.`

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [normalizedEmail],
        subject: "Ihr Stoyan-Abo wurde erfolgreich gekauft",
        html,
        text,
      }),
    })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      console.error("Resend Abo-Bestätigungs-E-Mail:", data)
      return
    }

    console.log("Stoyan Abo-Bestätigungs-E-Mail versendet", {
      email: normalizedEmail,
      emailId: data?.id ?? null,
    })
  } catch (error) {
    console.error("Fehler beim Versand der Stoyan Abo-Bestätigungs-E-Mail:", error)
  }
}

async function ensureUser(admin: ReturnType<typeof getAdminClient>, email: string, role: "employee" | "employer") {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) throw new Error("Stripe hat keine gültige E-Mail-Adresse geliefert.")

  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (usersError) throw usersError

  const existing = usersData.users.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail)

  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, {
      app_metadata: {
        ...(existing.app_metadata || {}),
        role,
      },
    })
    return { userId: existing.id, invited: false }
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(normalizedEmail, {
    data: { role },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://stoyan-job-matching.vercel.app"}/login?invited=1`,
  })

  if (error || !data.user) {
    throw error || new Error("Supabase-Konto konnte nicht erstellt werden.")
  }

  await admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { role },
  })

  return { userId: data.user.id, invited: true }
}

async function ensureProfile(admin: ReturnType<typeof getAdminClient>, userId: string, role: "employee" | "employer") {
  const { error: profileError } = await admin.from("profiles").upsert(
    { id: userId },
    { onConflict: "id" },
  )

  if (profileError) throw new Error(`Profil konnte nicht angelegt werden: ${profileError.message}`)

  if (role === "employee") {
    const { error: employeeError } = await admin.from("employee_profiles").upsert(
      {
        id: userId,
        profile_visible: true,
        contact_visible: true,
      },
      { onConflict: "id" },
    )

    if (employeeError) {
      throw new Error(`Arbeitnehmerprofil konnte nicht angelegt werden: ${employeeError.message}`)
    }
  }
}

async function saveSubscription(
  admin: ReturnType<typeof getAdminClient>,
  values: Record<string, unknown>,
) {
  const { error } = await admin.from("subscriptions").upsert(values, {
    onConflict: "user_id",
  })

  if (error) throw new Error(`Abo konnte nicht gespeichert werden: ${error.message}`)
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
    const admin = getAdminClient()

    const { data: existingEvent, error: existingEventError } = await admin
      .from("subscription_events")
      .select("id")
      .eq("provider", "stripe")
      .eq("provider_event_id", event.id)
      .maybeSingle()

    if (existingEventError) throw existingEventError
    if (existingEvent) return NextResponse.json({ received: true, duplicate: true })

    const object = event.data?.object || {}
    const metadata = object.metadata || {}
    const planId = metadata.plan_id || null
    const role =
      metadata.role === "employee"
        ? "employee"
        : metadata.role === "employer"
          ? "employer"
          : null

    let userId = metadata.user_id || object.client_reference_id || null

    if (event.type === "checkout.session.completed") {
      const customerEmail =
        object.customer_details?.email ||
        object.customer_email ||
        null

      if (!userId && customerEmail && role) {
        const account = await ensureUser(admin, customerEmail, role)
        userId = account.userId
        console.log("Supabase-Konto aus Stripe erstellt/gefunden", {
          userId,
          email: customerEmail,
          role,
          invited: account.invited,
        })
      }

      const customerId = object.customer || null
      const subscriptionId = object.subscription || null

      if (userId && planId && role) {
        await ensureProfile(admin, userId, role)

        await saveSubscription(admin, {
          user_id: userId,
          provider: "stripe",
          provider_customer_id: customerId,
          provider_subscription_id: subscriptionId,
          plan_id: planId,
          role,
          status: "active",
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
      }

      if (customerEmail) {
        await sendSubscriptionPurchaseEmail(customerEmail, planId)
      }
    }

    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      const customerId = object.customer || null
      const subscriptionId = object.id || null
      const subscriptionMetadata = object.metadata || {}
      const resolvedUserId = subscriptionMetadata.user_id || userId
      const resolvedPlanId = subscriptionMetadata.plan_id || planId
      const resolvedRole =
        subscriptionMetadata.role === "employee"
          ? "employee"
          : subscriptionMetadata.role === "employer"
            ? "employer"
            : role

      if (resolvedUserId && resolvedPlanId && resolvedRole) {
        const status = event.type === "customer.subscription.deleted" ? "canceled" : object.status || "active"

        await saveSubscription(admin, {
          user_id: resolvedUserId,
          provider: "stripe",
          provider_customer_id: customerId,
          provider_subscription_id: subscriptionId,
          plan_id: resolvedPlanId,
          role: resolvedRole,
          status,
          current_period_start: isoFromUnix(object.current_period_start),
          current_period_end: isoFromUnix(object.current_period_end),
          cancel_at_period_end: Boolean(object.cancel_at_period_end),
          canceled_at: isoFromUnix(object.canceled_at),
          updated_at: new Date().toISOString(),
        })
      }
    }

    if (event.type === "invoice.payment_failed") {
      const customerId = object.customer
      if (customerId) {
        const { error } = await admin
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("provider_customer_id", customerId)

        if (error) throw error
      }
    }

    const { error: eventInsertError } = await admin.from("subscription_events").insert({
      provider: "stripe",
      provider_event_id: event.id,
      event_type: event.type,
      user_id: userId,
      payload: event,
    })

    if (eventInsertError && eventInsertError.code !== "23505") {
      throw eventInsertError
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook-Verarbeitung fehlgeschlagen." },
      { status: 500 },
    )
  }
}
