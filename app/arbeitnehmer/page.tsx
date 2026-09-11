import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MessageCircle, Check, Clock3, ArrowRight, X } from "lucide-react"
import { SubscriptionCard } from "@/components/subscription-card"

export default async function EmployeeDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="ed-card ed-card-pad">
        <Link href="/login" className="font-medium text-[var(--brand)]">Zum Login</Link>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name,last_name,city,avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("profession,headline,years_experience,profile_visible,desired_employment_percent,preferred_radius_km")
    .eq("id", user.id)
    .maybeSingle()

  const { data: contactRequests, error: contactRequestsError } = await supabase
    .from("contact_requests")
    .select("id,status,created_at,employer_id,job_id")
    .eq("employee_id", user.id)
    .order("created_at", { ascending: false })

  const employerIds = Array.from(new Set((contactRequests ?? []).map((request) => request.employer_id)))

  // companies has no avatar_url column. Load company data and employer profile images separately.
  const { data: companies, error: companiesError } = employerIds.length > 0
    ? await supabase
        .from("companies")
        .select("owner_id,name,industry,city")
        .in("owner_id", employerIds)
    : { data: [], error: null }

  const { data: employerProfiles, error: employerProfilesError } = employerIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id,avatar_url")
        .in("id", employerIds)
    : { data: [], error: null }

  if (companiesError) console.error("Unternehmen konnten nicht geladen werden:", companiesError)
  if (employerProfilesError) console.error("Arbeitgeberprofile konnten nicht geladen werden:", employerProfilesError)

  const requestsWithCompanies = (contactRequests ?? []).map((request) => {
    const company = companies?.find((item) => item.owner_id === request.employer_id)
    const employerProfile = employerProfiles?.find((item) => item.id === request.employer_id)
    return {
      ...request,
      company: company ? { ...company, avatar_url: employerProfile?.avatar_url ?? null } : null,
    }
  })

  const pendingRequests = requestsWithCompanies.filter((request) => request.status === "pending")
  const acceptedRequests = requestsWithCompanies.filter((request) => request.status === "accepted")

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col justify-between gap-5 border-b border-[#e2e7ee] pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="ed-eyebrow">Arbeitnehmer</p>
          <h1 className="mt-4 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] sm:text-5xl text-balance">Dein Profil. Deine Möglichkeiten.</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">Präsentiere dich professionell und zeige Arbeitgebern, was du kannst.</p>
        </div>
        <Link href="/arbeitnehmer/profil" className="ed-btn-primary shrink-0">Profil bearbeiten</Link>
      </div>

      <SubscriptionCard />

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="ed-card ed-card-pad">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-[6px] border border-[#e2e7ee] bg-[var(--surface-soft)]">
              {profile?.avatar_url ? <img src={profile.avatar_url || "/placeholder.svg"} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl font-light text-[var(--muted-light)]">+</div>}
            </div>
            <div>
              <p className="text-xl font-normal tracking-tight text-[var(--navy)]">{profile?.first_name || "Vorname"} {profile?.last_name || "Nachname"}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{employee?.profession || "Beruf noch nicht angegeben"}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{profile?.city || "Ort noch nicht angegeben"}</p>
            </div>
          </div>
          <div className="mt-7 border-t border-[#e2e7ee] pt-6">
            <div className="flex items-center justify-between text-sm"><span className="text-[var(--muted-light)]">Profilstatus</span><span className={`ed-chip ${employee?.profile_visible ? "ed-chip-green" : "ed-chip"}`}>{employee?.profile_visible ? "Sichtbar" : "Privat"}</span></div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">Je vollständiger dein Profil, desto besser können passende Arbeitgeber dich einschätzen.</p>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="ed-card ed-card-pad">
            <p className="ed-eyebrow">Profil</p>
            <h2 className="mt-3 text-xl font-normal tracking-tight text-[var(--navy)]">Berufliche Präsentation</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{employee?.headline || "Noch keine berufliche Überschrift hinterlegt."}</p>
            <div className="mt-5 border-t border-[#e2e7ee] pt-4 text-sm text-[var(--muted)]">Erfahrung: <span className="font-medium text-[var(--navy)]">{employee?.years_experience ?? 0} Jahre</span></div>
          </div>
          <div className="ed-card ed-card-pad">
            <p className="ed-eyebrow">Arbeitswunsch</p>
            <h2 className="mt-3 text-xl font-normal tracking-tight text-[var(--navy)]">Was du suchst</h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]"><p>Pensum: <span className="font-medium text-[var(--navy)]">{employee?.desired_employment_percent ?? 100} %</span></p><p>Umkreis: <span className="font-medium text-[var(--navy)]">{employee?.preferred_radius_km ?? 30} km</span></p></div>
          </div>
          <div className="ed-card ed-card-pad">
            <p className="ed-eyebrow">Kontaktanfragen</p>
            <p className="ed-metric mt-3">{pendingRequests.length}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Neue Anfrage{pendingRequests.length === 1 ? "" : "n"}</p>
          </div>
          <div className="rounded-[6px] bg-[var(--navy)] p-[22px] text-white sm:p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-blue-300">Nächster Schritt</p>
            <h2 className="mt-3 text-xl font-normal tracking-tight">Vervollständige dein Profil</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">Füge Foto, Ausbildung, Erfahrung, Skills und deine Wünsche hinzu.</p>
            <Link href="/arbeitnehmer/profil" className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-3 text-sm font-medium text-[var(--navy)] transition hover:bg-slate-100">Profil aufbauen <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </div>

      <section className="ed-section mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="ed-eyebrow">Kommunikation</p>
            <h2 className="mt-3 text-2xl font-light tracking-[-0.02em] text-[var(--navy)]">Anfragen &amp; Nachrichten</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Hier findest du deine Kontaktanfragen und deine privaten Chats.</p>
          </div>
          <div className="flex gap-3 text-xs font-medium text-[var(--muted-light)]"><span>{pendingRequests.length} offen</span><span>·</span><span>{acceptedRequests.length} Chat{acceptedRequests.length === 1 ? "" : "s"}</span></div>
        </div>

        {requestsWithCompanies.length === 0 ? (
          <div className="mt-6 border border-dashed border-[var(--line-strong)] p-12 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-[var(--muted-light)]" />
            <h3 className="mt-4 text-lg font-normal text-[var(--navy)]">Noch keine Kontaktanfragen</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Sobald ein Arbeitgeber dich kontaktieren möchte, erscheint die Anfrage hier.</p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-[#e2e7ee] border-y border-[#e2e7ee]">
            {requestsWithCompanies.map((request) => {
              const company = request.company
              const accepted = request.status === "accepted"
              const pending = request.status === "pending"
              return (
                <div key={request.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[var(--navy)] text-lg font-normal text-white">
                      {company?.avatar_url ? <img src={company.avatar_url || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : (company?.name || "U")[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-normal tracking-tight text-[var(--navy)]">{company?.name || "Unternehmen"}</p>
                        {accepted && <span className="ed-chip ed-chip-green"><Check className="h-3 w-3" /> Chat frei</span>}
                        {pending && <span className="ed-chip ed-chip-amber"><Clock3 className="h-3 w-3" /> Offen</span>}
                        {request.status === "rejected" && <span className="ed-chip"><X className="h-3 w-3" /> Abgelehnt</span>}
                      </div>
                      <p className="mt-1 text-sm text-[var(--muted)]">{company?.industry || "Branche nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-light)]">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                    </div>
                  </div>
                  <Link href={`/arbeitnehmer/anfragen/${request.id}`} className={`shrink-0 ${accepted ? "ed-btn-primary" : "ed-btn-ghost"}`}>
                    {accepted ? <><MessageCircle className="h-4 w-4" /> Chat öffnen</> : <>Ansehen <ArrowRight className="h-4 w-4" /></>}
                  </Link>
                </div>
              )
            })}
          </div>
        )}
        {contactRequestsError && <div className="alert-error mt-5 text-sm font-medium">Die Kontaktanfragen konnten nicht geladen werden.</div>}
      </section>
    </div>
  )
}
