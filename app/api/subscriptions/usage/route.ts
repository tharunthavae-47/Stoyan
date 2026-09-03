import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { employerEntitlements, type EmployerPlanId } from "@/lib/plans"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("plan_id,status")
    .eq("user_id", user.id)
    .eq("role", "employer")
    .in("status", ["active", "trialing"])
    .maybeSingle()

  if (subscriptionError) return NextResponse.json({ error: subscriptionError.message }, { status: 500 })

  const planId = subscription?.plan_id as EmployerPlanId | undefined
  const entitlements = planId ? employerEntitlements[planId] : null
  if (!entitlements) return NextResponse.json({ error: "Kein aktives Arbeitgeber-Abo gefunden." }, { status: 404 })

  const { data: companies, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)

  if (companyError) return NextResponse.json({ error: companyError.message }, { status: 500 })

  const companyIds = (companies ?? []).map((company) => company.id)
  let activeJobs = 0
  if (companyIds.length > 0) {
    const { count, error } = await supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .in("company_id", companyIds)
      .eq("active", true)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    activeJobs = count ?? 0
  }

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const { count: contactRequests, error: contactError } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("employer_id", user.id)
    .gte("created_at", monthStart.toISOString())

  if (contactError) return NextResponse.json({ error: contactError.message }, { status: 500 })

  return NextResponse.json({
    activeJobs: { used: activeJobs, limit: entitlements.activeJobsLimit },
    savedCandidates: { used: null, limit: entitlements.savedCandidatesLimit },
    contactRequests: { used: contactRequests ?? 0, limit: entitlements.contactRequestsPerMonth },
    hrUsers: { used: 1, limit: entitlements.hrUsersLimit },
  }, { headers: { "Cache-Control": "private, no-store" } })
}
