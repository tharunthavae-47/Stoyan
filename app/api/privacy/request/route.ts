import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

const allowed = new Set(["access", "rectification", "deletion", "objection"])

export async function POST(request: Request) {
  try {
    const session = await createServerClient()
    const { data: { user }, error } = await session.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })

    const body = await request.json().catch(() => null) as { type?: string; details?: string } | null
    const type = body?.type?.trim() ?? ""
    const details = body?.details?.trim().slice(0, 5000) || null
    if (!allowed.has(type)) return NextResponse.json({ error: "Ungültige Anfrageart." }, { status: 400 })

    const admin = createAdminClient()
    const { data, error: insertError } = await admin.from("privacy_requests").insert({ user_id: user.id, request_type: type, details }).select("id,request_type,status,created_at").single()
    if (insertError) throw insertError
    return NextResponse.json({ success: true, request: data })
  } catch (e) {
    console.error("Datenschutzanfrage:", e)
    return NextResponse.json({ error: "Die Anfrage konnte nicht gespeichert werden." }, { status: 500 })
  }
}
