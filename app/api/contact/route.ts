import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const body = await request.json().catch(() => null)
  const employeeId = typeof body?.employeeId === "string" ? body.employeeId : ""
  const jobId = typeof body?.jobId === "string" ? body.jobId : null
  const message = typeof body?.message === "string" ? body.message.trim() : ""
  if (!employeeId) return NextResponse.json({ error: "employeeId fehlt" }, { status: 400 })

  const { data: employer } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (employer?.role !== "employer") return NextResponse.json({ error: "Nur Arbeitgeber können Kontaktanfragen senden." }, { status: 403 })

  const { data: employee } = await supabase.from("employee_profiles").select("contact_visible").eq("id", employeeId).eq("profile_visible", true).maybeSingle()
  if (!employee) return NextResponse.json({ error: "Profil nicht gefunden." }, { status: 404 })
  if (!employee.contact_visible) return NextResponse.json({ error: "Dieser Arbeitnehmer erlaubt aktuell keine Kontaktanfragen." }, { status: 403 })

  const { data: requestRow, error } = await supabase.from("contact_requests").insert({ employer_id: user.id, employee_id: employeeId, job_id: jobId }).select("id").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (message) {
    await supabase.from("messages").insert({ sender_id: user.id, recipient_id: employeeId, contact_request_id: requestRow.id, body: message })
  }
  return NextResponse.json({ success: true, contactRequestId: requestRow.id })
}
