import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) throw new Error("Supabase Admin-Zugang ist nicht konfiguriert.")
  return createSupabaseClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function GET(request: Request) {
  try {
    const sessionClient = await createServerClient()
    const { data: { user: employer }, error: authError } = await sessionClient.auth.getUser()
    if (authError || !employer) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })

    const employeeId = new URL(request.url).searchParams.get("employeeId")?.trim()
    const requestId = new URL(request.url).searchParams.get("requestId")?.trim()
    if (!employeeId || !requestId) return NextResponse.json({ error: "employeeId und requestId sind erforderlich." }, { status: 400 })

    const admin = getAdminClient()
    const { data: contactRequest, error: requestError } = await admin
      .from("contact_requests")
      .select("id,employer_id,employee_id,status")
      .eq("id", requestId)
      .eq("employer_id", employer.id)
      .eq("employee_id", employeeId)
      .maybeSingle()

    if (requestError) return NextResponse.json({ error: requestError.message }, { status: 500 })
    if (!contactRequest) return NextResponse.json({ error: "Kontaktanfrage nicht gefunden." }, { status: 404 })
    if (contactRequest.status !== "accepted") {
      return NextResponse.json({ error: "Dokumente werden erst nach Annahme der Kontaktanfrage freigegeben." }, { status: 403 })
    }

    const { data: documents, error: documentsError } = await admin
      .from("employee_documents")
      .select("id,category,file_name,file_path,mime_type,file_size,created_at")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })

    if (documentsError) return NextResponse.json({ error: documentsError.message }, { status: 500 })

    const withUrls = await Promise.all((documents || []).map(async (document) => {
      const { data: signed, error: signedError } = await admin
        .storage
        .from("employee-documents")
        .createSignedUrl(document.file_path, 10 * 60)

      return {
        id: document.id,
        category: document.category,
        file_name: document.file_name,
        mime_type: document.mime_type,
        file_size: document.file_size,
        created_at: document.created_at,
        url: signedError ? null : signed?.signedUrl || null,
      }
    }))

    return NextResponse.json({ documents: withUrls })
  } catch (error) {
    console.error("Arbeitgeber Dokumente:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Dokumente konnten nicht geladen werden." }, { status: 500 })
  }
}
