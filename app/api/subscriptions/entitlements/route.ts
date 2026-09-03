import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { employerEntitlements, type EmployerPlanId } from "@/lib/plans"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("plan_id,status,role,current_period_end")
    .eq("user_id", user.id)
    .eq("role", "employer")
    .in("status", ["active", "trialing"])
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const plan = subscription?.plan_id as EmployerPlanId | undefined
  const entitlements = plan && employerEntitlements[plan] ? employerEntitlements[plan] : null

  return NextResponse.json({
    subscribed: Boolean(entitlements),
    plan: entitlements?.plan ?? null,
    entitlements,
    currentPeriodEnd: subscription?.current_period_end ?? null,
  }, { headers: { "Cache-Control": "private, no-store" } })
}
