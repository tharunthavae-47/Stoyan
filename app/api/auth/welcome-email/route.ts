import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ist nicht konfiguriert.")
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as { userId?: string; email?: string } | null
    const userId = body?.userId?.trim()
    const email = body?.email?.trim().toLowerCase()

    if (!userId || !email) {
      return Response.json({ error: "Registrierungsdaten fehlen." }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const resendFromEmail = process.env.RESEND_FROM_EMAIL
    if (!resendApiKey || !resendFromEmail) {
      return Response.json({ error: "Resend ist noch nicht konfiguriert." }, { status: 503 })
    }

    const admin = getAdminClient()
    const { data, error } = await admin.auth.admin.getUserById(userId)

    if (error || !data.user || data.user.email?.toLowerCase() !== email) {
      return Response.json({ error: "Registrierung konnte nicht verifiziert werden." }, { status: 403 })
    }

    const safeEmail = escapeHtml(email)
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://stoyan-job-matching.vercel.app").replace(/\/$/, "")

    const html = `<!doctype html><html lang="de"><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#0f172a;color:#fff;border-radius:18px;padding:22px 24px"><div style="font-size:24px;font-weight:800;letter-spacing:-.5px">JOBMATCH24</div><div style="margin-top:6px;color:#cbd5e1">Willkommen bei JobMatch24</div></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px 24px;margin-top:16px"><h1 style="font-size:24px;margin:0 0 14px">Sie haben sich erfolgreich registriert.</h1><p style="line-height:1.7;color:#475569;margin:0">Ihr JobMatch24-Konto wurde erfolgreich erstellt.</p><p style="line-height:1.7;color:#475569">Mit Ihrer E-Mail-Adresse ${safeEmail} können Sie sich bei JobMatch24 anmelden.</p><a href="${siteUrl}/login" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px;margin-top:8px">Zu JobMatch24</a><p style="margin-top:24px;color:#64748b;font-size:14px;line-height:1.6">Vielen Dank, dass Sie JobMatch24 nutzen.</p></div><p style="text-align:center;color:#94a3b8;font-size:12px;margin:20px 0">JobMatch24 · Diese Nachricht wurde automatisch versendet.</p></div></body></html>`

    const text = `Sie haben sich erfolgreich bei JobMatch24 registriert.\n\nIhr JobMatch24-Konto wurde erfolgreich erstellt.\n\nAnmeldung: ${siteUrl}/login\n\nVielen Dank, dass Sie JobMatch24 nutzen.`

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [email],
        subject: "Sie haben sich erfolgreich bei JobMatch24 registriert",
        html,
        text,
      }),
    })

    const resendData = await resendResponse.json().catch(() => null)
    if (!resendResponse.ok) {
      console.error("Resend Registrierungs-E-Mail:", resendData)
      return Response.json({ error: "Die Registrierungs-E-Mail konnte nicht versendet werden." }, { status: 502 })
    }

    return Response.json({ success: true, emailId: resendData?.id ?? null })
  } catch (error) {
    console.error("Welcome email error:", error)
    return Response.json({ error: "Die Registrierungs-E-Mail konnte nicht versendet werden." }, { status: 500 })
  }
}
