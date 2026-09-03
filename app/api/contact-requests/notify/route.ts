import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

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
  if (!url || !serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY ist nicht konfiguriert.")
  return createSupabaseClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function POST(request: Request) {
  try {
    const sessionClient = await createServerClient()
    const { data: { user: employer }, error: authError } = await sessionClient.auth.getUser()
    if (authError || !employer) return Response.json({ error: "Nicht angemeldet." }, { status: 401 })

    const body = await request.json().catch(() => null) as { requestId?: string } | null
    const requestId = body?.requestId?.trim()
    if (!requestId) return Response.json({ error: "requestId fehlt." }, { status: 400 })

    const admin = getAdminClient()
    const { data: contactRequest, error: requestError } = await admin
      .from("contact_requests")
      .select("id,employer_id,employee_id,status,created_at")
      .eq("id", requestId)
      .eq("employer_id", employer.id)
      .maybeSingle()

    if (requestError) throw new Error(`Anfrage konnte nicht gelesen werden: ${requestError.message}`)
    if (!contactRequest) return Response.json({ error: "Anfrage nicht gefunden." }, { status: 404 })
    if (contactRequest.status !== "pending") return Response.json({ error: "Die Anfrage ist nicht mehr offen." }, { status: 409 })

    const { data: employee, error: employeeError } = await admin
      .from("employee_profiles")
      .select("id,contact_visible")
      .eq("id", contactRequest.employee_id)
      .maybeSingle()
    if (employeeError) throw new Error(`Arbeitnehmerprofil konnte nicht gelesen werden: ${employeeError.message}`)
    if (!employee || !employee.contact_visible) return Response.json({ error: "Der Arbeitnehmer möchte aktuell nicht kontaktiert werden." }, { status: 409 })

    const { data: employerProfile, error: employerProfileError } = await admin
      .from("profiles")
      .select("first_name,last_name,email")
      .eq("id", employer.id)
      .maybeSingle()
    if (employerProfileError) throw new Error(`Arbeitgeberprofil konnte nicht gelesen werden: ${employerProfileError.message}`)

    const { data: company, error: companyError } = await admin
      .from("companies")
      .select("name,city")
      .eq("owner_id", employer.id)
      .maybeSingle()
    if (companyError) throw new Error(`Unternehmensprofil konnte nicht gelesen werden: ${companyError.message}`)

    const { data: employeeProfile, error: employeeProfileError } = await admin
      .from("profiles")
      .select("first_name,last_name")
      .eq("id", contactRequest.employee_id)
      .maybeSingle()
    if (employeeProfileError) throw new Error(`Arbeitnehmerprofil konnte nicht gelesen werden: ${employeeProfileError.message}`)

    const { data: employeeAuth, error: employeeAuthError } = await admin.auth.admin.getUserById(contactRequest.employee_id)
    if (employeeAuthError) throw new Error(`E-Mail-Adresse des Arbeitnehmers konnte nicht gelesen werden: ${employeeAuthError.message}`)

    const employeeEmail = employeeAuth.user?.email
    if (!employeeEmail) return Response.json({ error: "Für diesen Arbeitnehmer ist keine E-Mail-Adresse hinterlegt." }, { status: 409 })

    const resendApiKey = process.env.RESEND_API_KEY
    const resendFromEmail = process.env.RESEND_FROM_EMAIL
    if (!resendApiKey || !resendFromEmail) {
      return Response.json({ error: "Resend ist noch nicht konfiguriert. Bitte RESEND_API_KEY und RESEND_FROM_EMAIL in Vercel hinterlegen." }, { status: 503 })
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://stoyan-job-matching.vercel.app").replace(/\/$/, "")
    const employeeName = `${employeeProfile?.first_name || ""} ${employeeProfile?.last_name || ""}`.trim() || "Hallo"
    const employerName = `${employerProfile?.first_name || ""} ${employerProfile?.last_name || ""}`.trim()
    const companyName = company?.name?.trim() || employerName || "Ein Arbeitgeber"
    const requestUrl = `${siteUrl}/arbeitnehmer/anfragen/${contactRequest.id}`
    const createdAt = new Date(contactRequest.created_at).toLocaleString("de-CH", { dateStyle: "medium", timeStyle: "short" })

    const html = `<!doctype html><html lang="de"><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#0f172a;color:#fff;border-radius:18px;padding:22px 24px"><div style="font-size:24px;font-weight:800;letter-spacing:-.5px">JOBMATCH24</div><div style="margin-top:6px;color:#cbd5e1">Neue Kontaktanfrage</div></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px 24px;margin-top:16px"><p style="font-size:18px;font-weight:700;margin:0 0 14px">Hallo ${escapeHtml(employeeName)},</p><p style="line-height:1.6;color:#475569">${escapeHtml(companyName)} möchte Sie über JobMatch24 kontaktieren.</p><div style="background:#f8fafc;border-radius:14px;padding:16px;margin:20px 0"><div style="font-weight:700">${escapeHtml(companyName)}</div>${company?.city ? `<div style="margin-top:5px;color:#64748b">${escapeHtml(company.city)}</div>` : ""}<div style="margin-top:8px;color:#64748b;font-size:14px">Anfrage am ${escapeHtml(createdAt)}</div></div><a href="${escapeHtml(requestUrl)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:10px">Anfrage ansehen</a><p style="margin-top:24px;color:#64748b;font-size:14px;line-height:1.6">Du kannst die Anfrage in deinem JobMatch24-Konto prüfen und dort annehmen oder ablehnen.</p></div><p style="text-align:center;color:#94a3b8;font-size:12px;margin:20px 0">JobMatch24 · Diese Nachricht wurde automatisch versendet.</p></div></body></html>`

    const text = `Hallo ${employeeName},\n\n${companyName} möchte Sie über JobMatch24 kontaktieren.\n\nAnfrage ansehen: ${requestUrl}\n\nSie können die Anfrage in Ihrem JobMatch24-Konto annehmen oder ablehnen.`

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [employeeEmail],
        reply_to: employerProfile?.email || employer.email || undefined,
        subject: `${companyName} möchte Sie auf JobMatch24 kontaktieren`,
        html,
        text,
      }),
    })

    const resendData = await resendResponse.json().catch(() => null)
    if (!resendResponse.ok) {
      console.error("Resend Fehler:", resendData)
      return Response.json({ error: "Resend konnte die E-Mail nicht versenden." }, { status: 502 })
    }

    return Response.json({ success: true, emailId: resendData?.id ?? null })
  } catch (error) {
    console.error("Kontaktanfrage-E-Mail:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Die Benachrichtigung konnte nicht versendet werden." }, { status: 500 })
  }
}
