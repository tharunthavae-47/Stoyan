import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

async function rows(admin: ReturnType<typeof createAdminClient>, table: string, column: string, id: string) {
  const { data, error } = await admin.from(table).select("*").eq(column, id)
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

export async function GET() {
  try {
    const session = await createServerClient()
    const { data: { user }, error } = await session.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })

    const admin = createAdminClient()
    const [profile, employeeProfile, companies, requests, messages, contactMessages, conversations, chatMessages, applications, matches, subscriptions, subscriptionEvents, privacyRequests] = await Promise.all([
      rows(admin, "profiles", "id", user.id),
      rows(admin, "employee_profiles", "id", user.id),
      rows(admin, "companies", "owner_id", user.id),
      rows(admin, "contact_requests", "employer_id", user.id),
      rows(admin, "messages", "sender_id", user.id),
      rows(admin, "contact_messages", "sender_id", user.id),
      rows(admin, "chat_conversations", "employer_id", user.id),
      rows(admin, "chat_messages", "sender_id", user.id),
      rows(admin, "applications", "employee_id", user.id),
      rows(admin, "matches", "employee_id", user.id),
      rows(admin, "subscriptions", "user_id", user.id),
      rows(admin, "subscription_events", "user_id", user.id),
      rows(admin, "privacy_requests", "user_id", user.id),
    ])

    const companyIds = companies.data.map((c: { id?: string }) => c.id).filter(Boolean)
    let jobs: unknown[] = []
    if (companyIds.length) {
      const { data } = await admin.from("jobs").select("*").in("company_id", companyIds)
      jobs = data ?? []
    }

    const payload = {
      export_date: new Date().toISOString(),
      account: { id: user.id, email: user.email ?? null, created_at: user.created_at ?? null },
      personal_data: profile.data,
      employee_profile: employeeProfile.data,
      companies: companies.data,
      jobs,
      contact_requests: requests.data,
      messages_sent: messages.data,
      contact_messages_sent: contactMessages.data,
      chat_conversations: conversations.data,
      chat_messages_sent: chatMessages.data,
      applications: applications.data,
      matches: matches.data,
      subscriptions: subscriptions.data,
      subscription_events: subscriptionEvents.data,
      privacy_requests: privacyRequests.data,
    }

    const warnings = [profile, employeeProfile, companies, requests, messages, contactMessages, conversations, chatMessages, applications, matches, subscriptions, subscriptionEvents, privacyRequests].filter(x => x.error).map(x => x.error)
    return new NextResponse(JSON.stringify({ ...payload, warnings }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="jobmatch24-datenauskunft-${new Date().toISOString().slice(0,10)}.json"`, "Cache-Control": "no-store" },
    })
  } catch (e) {
    console.error("Datenauskunft:", e)
    return NextResponse.json({ error: "Die Datenauskunft konnte nicht erstellt werden." }, { status: 500 })
  }
}
