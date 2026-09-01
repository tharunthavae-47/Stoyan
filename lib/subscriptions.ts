import { createClient } from "@/lib/supabase/client"

export type Subscription = {
  plan_id: string
  role: "employer" | "employee"
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export async function getMySubscription() {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("get_my_subscription")
  if (error) throw error
  return (data?.[0] ?? null) as Subscription | null
}

export async function hasActivePlan(planId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("has_active_plan", { required_plan: planId })
  if (error) throw error
  return Boolean(data)
}
