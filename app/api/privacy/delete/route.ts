import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

export async function POST() {
  try {
    const session = await createServerClient()
    const { data: { user }, error } = await session.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })

    const admin = createAdminClient()

    // Remove user-owned files first. Supabase Storage is separate from Postgres FKs.
    const { data: files } = await admin.storage.from("employee-media").list(user.id, { limit: 1000 })
    if (files?.length) {
      await admin.storage.from("employee-media").remove(files.map(file => `${user.id}/${file.name}`))
    }

    // These tables are not all linked to auth.users by FK, so remove them explicitly.
    await admin.from("subscription_events").delete().eq("user_id", user.id)
    await admin.from("subscriptions").delete().eq("user_id", user.id)
    await admin.from("privacy_requests").delete().eq("user_id", user.id)

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Kontolöschung:", e)
    return NextResponse.json({ error: "Das Konto konnte nicht vollständig gelöscht werden. Bitte wenden Sie sich an den Datenschutzkontakt." }, { status: 500 })
  }
}
