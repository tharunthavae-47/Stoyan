import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Building2, Check, Clock3, MessageCircle, X } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RequestRow = {
  id: string
  status: string
  created_at: string
  employer_id: string
  employee_id: string
  job_id: string | null
}

type Company = {
  owner_id: string
  name: string | null
  industry: string | null
  city: string | null
}

export default async function ArbeitnehmerAnfragenPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="card card-pad">
        <Link href="/login" className="font-bold text-[var(--brand)]">Zum Login</Link>
      </div>
    )
  }

  const { data: requests, error } = await supabase
    .from("contact_requests")
    .select("id,status,created_at,employer_id,employee_id,job_id")
    .eq("employee_id", user.id)
    .order("created_at", { ascending: false })

  const requestRows = (requests ?? []) as RequestRow[]
  const employerIds = Array.from(new Set(requestRows.map((request) => request.employer_id)))

  const { data: companyRows } = employerIds.length
    ? await supabase
        .from("companies")
        .select("owner_id,name,industry,city")
        .in("owner_id", employerIds)
    : { data: [] as Company[] }

  const companies = (companyRows ?? []) as Company[]
  const companyByOwner = new Map(companies.map((company) => [company.owner_id, company]))

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand)]">Kommunikation</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[var(--navy)]">Kontaktanfragen</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Hier siehst du von Anfang an, welche Firma dich kontaktiert hat. Deine E-Mail-Adresse und Telefonnummer werden erst nach deiner Annahme freigegeben.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Kontaktanfragen konnten nicht geladen werden: {error.message}
          </div>
        )}

        {requestRows.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-[var(--line-strong)] bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-black text-[var(--navy)]">Noch keine Kontaktanfragen</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
              Sobald ein Arbeitgeber dich kontaktieren möchte, erscheint die Firma hier.
            </p>
          </section>
        ) : (
          <div className="mt-8 space-y-4">
            {requestRows.map((request) => {
              const company = companyByOwner.get(request.employer_id)
              const accepted = request.status === "accepted"
              const pending = request.status === "pending"
              const rejected = request.status === "rejected"

              return (
                <section key={request.id} className={`rounded-3xl border bg-white p-6 shadow-sm ${accepted ? "border-emerald-200 ring-1 ring-emerald-100" : "border-[var(--line)]"}`}>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-xl font-black text-white">
                        {(company?.name || "F").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted-light)]">Arbeitgeber</p>
                        <h2 className="mt-1 truncate text-2xl font-black text-[var(--navy)]">{company?.name || "Unternehmen"}</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {company?.industry || "Branche nicht angegeben"}
                          {company?.city ? ` · ${company.city}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {pending && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-700"><Clock3 className="h-4 w-4" /> Anfrage offen</span>}
                      {accepted && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"><Check className="h-4 w-4" /> Angenommen</span>}
                      {rejected && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"><X className="h-4 w-4" /> Abgelehnt</span>}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Unternehmen</p>
                      <p className="mt-1 font-bold text-slate-900">{company?.name || "Nicht angegeben"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Standort</p>
                      <p className="mt-1 font-bold text-slate-900">{company?.city || "Nicht angegeben"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Anfrage</p>
                      <p className="mt-1 font-bold text-slate-900">{new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                    </div>
                  </div>

                  {pending && (
                    <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                      <p className="text-sm font-bold text-sky-900">Diese Firma möchte dich kontaktieren.</p>
                      <p className="mt-1 text-sm leading-6 text-sky-800/80">
                        Du kannst die Anfrage öffnen und annehmen oder ablehnen. Deine privaten Kontaktdaten bleiben bis zur Annahme geschützt.
                      </p>
                    </div>
                  )}

                  {accepted && (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-sm font-bold text-emerald-900">Kontakt angenommen</p>
                      <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                        Deine Telefonnummer und E-Mail-Adresse wurden für diesen Arbeitgeber freigegeben. Ihr könnt jetzt privat chatten.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <Link href={`/arbeitnehmer/anfragen/${request.id}`} className={accepted ? "btn-primary" : "btn-ghost"}>
                      {accepted ? <><MessageCircle className="h-4 w-4" /> Chat öffnen</> : <>Anfrage ansehen <ArrowRight className="h-4 w-4" /></>}
                    </Link>
                  </div>
                </section>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Building2 className="h-4 w-4" />
          Firmeninformationen sind ab dem Eingang der Anfrage sichtbar.
        </div>
      </div>
    </div>
  )
}
