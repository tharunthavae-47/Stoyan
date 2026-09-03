import EmployerChat from "@/components/employer-chat"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

type Props = { params: Promise<{ requestId: string }> }

export default async function EmployerRequestPage({ params }: Props) {
  const { requestId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id,status")
    .eq("user_id", user.id)
    .eq("role", "employer")
    .in("status", ["active", "trialing"])
    .maybeSingle()

  if (!subscription || !["professional", "business"].includes(subscription.plan_id)) {
    redirect("/preise?upgrade=professional")
  }

  return (
    <main className="w-full">
      <EmployerChat requestId={requestId} />
    </main>
  )
}
