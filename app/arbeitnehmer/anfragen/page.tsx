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
      <div className="ed-card ed-card-pad">
        <Link href="/login" className="font-medium text-[var(--brand)]">Zum Login</Link>
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
        <div className="border-b border-[#e2e7ee] pb-8">
          <p className="ed-eyebrow">Kommunikation</p>
          <h1 className="mt-4 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] text-balance">Kontaktanfragen</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">
            Hier siehst du von Anfang an, welche Firma dich kontaktiert hat. Deine E-Mail-Adresse und Telefonnummer werden erst nach deiner Annahme freigegeben.
          </p>
        </div>

        {error && (
          <div className="alert-error mt-6 text-sm font-medium">
            Kontaktanfragen konnten nicht geladen werden: {error.message}
          </div>
        )}

        {requestRows.length === 0 ? (
          <section className="mt-8 border border-dashed border-[var(--line-strong)] p-12 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-[var(--muted-light)]" />
            <h2 className="mt-4 text-lg font-normal text-[var(--navy)]">Noch keine Kontaktanfragen</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
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
                <section key={request.id} className={`ed-card ed-card-pad ${accepted ? "border-l-2 border-l-[var(--success)]" : ""}`}>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[6px] bg-[var(--navy)] text-xl font-normal text-white">
                        {(company?.name || "F").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="ed-eyebrow">Arbeitgeber</p>
                        <h2 className="mt-2 truncate text-2xl font-light tracking-tight text-[var(--navy)]">{company?.name || "Unternehmen"}</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {company?.industry || "Branche nicht angegeben"}
                          {company?.city ? ` · ${company.city}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {pending && <span className="ed-chip ed-chip-amber"><Clock3 className="h-4 w-4" /> Anfrage offen</span>}
                      {accepted && <span className="ed-chip ed-chip-green"><Check className="h-4 w-4" /> Angenommen</span>}
                      {rejected && <span className="ed-chip"><X className="h-4 w-4" /> Abgelehnt</span>}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-px overflow-hidden rounded-[4px] border border-[#e2e7ee] bg-[#e2e7ee] sm:grid-cols-3">
                    <div className="bg-white p-4">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Unternehmen</p>
                      <p className="mt-1 font-medium text-[var(--navy)]">{company?.name || "Nicht angegeben"}</p>
                    </div>
                    <div className="bg-white p-4">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Standort</p>
                      <p className="mt-1 font-medium text-[var(--navy)]">{company?.city || "Nicht angegeben"}</p>
                    </div>
                    <div className="bg-white p-4">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Anfrage</p>
                      <p className="mt-1 font-medium text-[var(--navy)]">{new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                    </div>
                  </div>

                  {pending && (
                    <div className="mt-5 border-l-2 border-l-[var(--brand)] bg-[var(--brand-soft)] p-4">
                      <p className="text-sm font-medium text-[var(--navy)]">Diese Firma möchte dich kontaktieren.</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                        Du kannst die Anfrage öffnen und annehmen oder ablehnen. Deine privaten Kontaktdaten bleiben bis zur Annahme geschützt.
                      </p>
                    </div>
                  )}

                  {accepted && (
                    <div className="mt-5 border-l-2 border-l-[var(--success)] bg-[var(--success-soft)] p-4">
                      <p className="text-sm font-medium text-[var(--navy)]">Kontakt angenommen</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                        Deine Telefonnummer und E-Mail-Adresse wurden für diesen Arbeitgeber freigegeben. Ihr könnt jetzt privat chatten.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <Link href={`/arbeitnehmer/anfragen/${request.id}`} className={accepted ? "ed-btn-primary" : "ed-btn-ghost"}>
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
