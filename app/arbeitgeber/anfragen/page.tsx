import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Building2, Check, Clock3, MessageCircle, X } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RequestRow = { id: string; status: string; created_at: string; employer_id: string; employee_id: string; job_id: string | null }
type Employee = { id: string; vorname: string | null; nachname: string | null; phone: string | null; city: string | null; stadt: string | null; beruf: string | null; education: string | null }

export default async function ArbeitgeberAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div className="card card-pad"><Link href="/login" className="font-bold text-[var(--brand)]">Zum Login</Link></div>

  const { data: requests, error } = await supabase.from("contact_requests").select("id,status,created_at,employer_id,employee_id,job_id").eq("employer_id", user.id).order("created_at", { ascending: false })
  if (error) return <div className="card card-pad"><p className="font-bold text-red-600">Kontaktanfragen konnten nicht geladen werden: {error.message}</p></div>

  const rows = (requests ?? []) as RequestRow[]
  const ids = Array.from(new Set(rows.map((r) => r.employee_id)))
  const { data: employeeRows } = ids.length ? await supabase.from("employee_contact_details").select("id,vorname,nachname,phone,city,stadt,beruf,education").in("id", ids) : { data: [] as Employee[] }
  const employees = new Map(((employeeRows ?? []) as Employee[]).map((e) => [e.id, e]))

  return <div className="animate-fade-up mx-auto max-w-5xl">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand)]">Kommunikation</p>
    <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[var(--navy)]">Kontaktanfragen & Chats</h1>
    <p className="mt-3 max-w-2xl text-[var(--muted)]">Hier findest du alle deine Kontaktanfragen. Bei angenommenen Anfragen kannst du direkt den privaten Chat auswählen.</p>

    {rows.length === 0 ? <section className="card card-pad mt-8 text-center"><MessageCircle className="mx-auto h-10 w-10 text-[var(--brand)]" /><h2 className="mt-4 text-xl font-black">Noch keine Kontaktanfragen</h2><p className="mt-2 text-sm text-[var(--muted)]">Sobald du einen Arbeitnehmer kontaktierst, erscheint die Anfrage hier.</p><Link href="/arbeitgeber/suche" className="btn-primary mt-6 inline-flex">Kandidaten suchen<ArrowRight className="h-4 w-4" /></Link></section> : <div className="mt-8 space-y-4">{rows.map((r) => { const e = employees.get(r.employee_id); const name = [e?.vorname, e?.nachname].filter(Boolean).join(" ") || "Arbeitnehmer"; const accepted = r.status === "accepted"; const location = e?.city || e?.stadt; return <section key={r.id} className={`rounded-3xl border bg-white p-6 shadow-sm ${accepted ? "border-emerald-200" : "border-[var(--line)]"}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-xl font-black text-white">{name.split(" ").slice(0,2).map((x) => x[0]).join("").toUpperCase() || "A"}</div><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted-light)]">Arbeitnehmer</p><h2 className="mt-1 truncate text-2xl font-black text-[var(--navy)]">{name}</h2><p className="mt-1 text-sm text-[var(--muted)]">{e?.beruf || "Beruf nicht angegeben"}{e?.education ? ` · ${e.education}` : ""}{location ? ` · ${location}` : ""}</p></div></div>
        {accepted ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"><Check className="h-4 w-4" /> Chat freigeschaltet</span> : r.status === "pending" ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-700"><Clock3 className="h-4 w-4" /> Anfrage offen</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"><X className="h-4 w-4" /> Abgelehnt</span>}
      </div>
      {accepted && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-sm font-bold text-emerald-900">Dieser Arbeitnehmer hat angenommen.</p><p className="mt-1 text-sm text-emerald-800/80">Der private Chat ist freigeschaltet. Die freigegebenen Kontaktdaten sind sichtbar.</p></div>}
      <div className="mt-5 flex justify-end"><Link href={`/arbeitgeber/anfragen/${r.id}`} className={accepted ? "btn-primary" : "btn-ghost"}>{accepted ? <><MessageCircle className="h-4 w-4" /> Chat öffnen</> : <>Anfrage ansehen<ArrowRight className="h-4 w-4" /></>}</Link></div>
    </section> })}</div>}
    <div className="mt-6 flex items-center gap-2 text-sm text-[var(--muted)]"><Building2 className="h-4 w-4" /> Im Chat erscheint der Arbeitgeber links und der Arbeitnehmer rechts.</div>
  </div>
}
