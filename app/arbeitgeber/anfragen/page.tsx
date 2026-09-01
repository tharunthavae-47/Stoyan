import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Check, Clock3, MessageCircle, Users, X } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RequestRow = { id: string; status: string; created_at: string; employer_id: string; employee_id: string; job_id: string | null }
type EmployeeProfile = { id: string; vorname: string | null; nachname: string | null; beruf: string | null; city: string | null; stadt: string | null; email: string | null; phone: string | null }

export default async function ArbeitgeberAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="card card-pad"><Link href="/login" className="font-bold text-[var(--brand)]">Zum Login</Link></div>
  }

  const { data: requests, error } = await supabase
    .from("contact_requests")
    .select("id,status,created_at,employer_id,employee_id,job_id")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="card card-pad"><p className="font-bold text-red-600">Anfragen konnten nicht geladen werden: {error.message}</p></div>
  }

  const rows = (requests ?? []) as RequestRow[]
  const employeeIds = Array.from(new Set(rows.map((r) => r.employee_id).filter(Boolean)))

  let employees: Record<string, EmployeeProfile> = {}

  if (employeeIds.length) {
    const { data: employeeData, error: employeeError } = await supabase
      .from("employee_contact_details")
      .select("id,vorname,nachname,beruf,city,stadt,email,phone")
      .in("id", employeeIds)

    if (employeeError) {
      return <div className="card card-pad"><p className="font-bold text-red-600">Arbeitnehmerdaten konnten nicht geladen werden: {employeeError.message}</p></div>
    }

    const map: Record<string, EmployeeProfile> = {}
    ;(employeeData ?? []).forEach((employee) => {
      map[employee.id] = employee as EmployeeProfile
    })
    employees = map
  }

  const getEmployee = (id: string) => employees[id]
  const getName = (id: string) => {
    const employee = getEmployee(id)
    return employee ? [employee.vorname, employee.nachname].filter(Boolean).join(" ") || "Arbeitnehmer" : "Arbeitnehmer"
  }
  const getProfession = (id: string) => getEmployee(id)?.beruf || "Beruf nicht angegeben"
  const getLocation = (id: string) => getEmployee(id)?.city || getEmployee(id)?.stadt || null
  const getInitials = (id: string) => {
    const name = getName(id)
    return name === "Arbeitnehmer" ? "A" : name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  }

  return (
    <div className="animate-fade-up mx-auto max-w-5xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand)]">Kommunikation</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[var(--navy)]">Anfragen &amp; Nachrichten</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">Verwalten Sie Ihre Kontaktanfragen und öffnen Sie angenommene private Chats.</p>
        </div>
        {rows.length > 0 && (
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--muted-light)]">
            <Users className="h-4 w-4" />
            {rows.length} Anfrage{rows.length !== 1 ? "n" : ""}
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-[var(--line-strong)] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-xl font-black text-[var(--navy)]">Noch keine Kontaktanfragen</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">Wenn Sie einen passenden Arbeitnehmer gefunden haben, können Sie über dessen Profil eine Kontaktanfrage senden.</p>
          <Link href="/arbeitgeber/suche" className="btn-primary mt-6 inline-flex">
            Kandidaten suchen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((request) => {
            const employee = getEmployee(request.employee_id)
            const name = getName(request.employee_id)
            const accepted = request.status === "accepted"
            const pending = request.status === "pending"
            const rejected = request.status === "rejected"

            return (
              <div
                key={request.id}
                className={`rounded-[24px] border bg-white p-5 shadow-sm transition-all hover:shadow-md ${accepted ? "border-emerald-200 ring-1 ring-emerald-100" : "border-[var(--line)]"}`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-lg font-black text-white">
                    {getInitials(request.employee_id)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[var(--navy)]">{name}</h3>
                      {accepted && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"><Check className="h-3 w-3" />Angenommen</span>}
                      {pending && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700"><Clock3 className="h-3 w-3" />Ausstehend</span>}
                      {rejected && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600"><X className="h-3 w-3" />Abgelehnt</span>}
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{getProfession(request.employee_id)}</p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted-light)]">
                      {getLocation(request.employee_id) && <span>{getLocation(request.employee_id)}</span>}
                      <span>Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</span>
                    </div>

                    {accepted && employee && (employee.email || employee.phone) && (
                      <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                        {employee.email && <span className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">📧 {employee.email}</span>}
                        {employee.phone && <span className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">📞 {employee.phone}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    {accepted ? (
                      <Link href={`/arbeitgeber/anfragen/${request.id}`} className="btn-primary">
                        <MessageCircle className="h-4 w-4" />
                        Chat öffnen
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link href={`/arbeitgeber/anfragen/${request.id}`} className="btn-ghost">
                        Anfrage ansehen
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
