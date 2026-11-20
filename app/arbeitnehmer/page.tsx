import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MessageCircle, Check, CheckCircle2, Circle, Clock3, ArrowRight, X, Briefcase, MapPin, Eye, EyeOff, UserRound } from "lucide-react"
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

  const checklist = [
    { label: "Profilbild", done: Boolean(profile?.avatar_url), href: "/arbeitnehmer/bilder" },
    { label: "Name", done: Boolean(profile?.first_name && profile?.last_name), href: "/arbeitnehmer/profil" },
    { label: "Wohnort", done: Boolean(profile?.city), href: "/arbeitnehmer/profil" },
    { label: "Beruf", done: Boolean(employee?.profession), href: "/arbeitnehmer/profil" },
    { label: "Berufliche Überschrift", done: Boolean(employee?.headline), href: "/arbeitnehmer/profil" },
    { label: "Berufserfahrung", done: (employee?.years_experience ?? 0) > 0, href: "/arbeitnehmer/profil" },
  ]
  const completion = Math.round((checklist.filter((item) => item.done).length / checklist.length) * 100)
  const openItems = checklist.filter((item) => !item.done)
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ")

  const stats = [
    { label: "Neue Anfragen", value: String(pendingRequests.length), Icon: Clock3 },
    { label: "Aktive Chats", value: String(acceptedRequests.length), Icon: MessageCircle },
    { label: "Wunsch-Pensum", value: `${employee?.desired_employment_percent ?? 100} %`, Icon: Briefcase },
    { label: "Umkreis", value: `${employee?.preferred_radius_km ?? 30} km`, Icon: MapPin },
  ]

  return (
    <div className="animate-fade-up space-y-6">
      <section className="dash-hero">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              {profile?.avatar_url ? <img src={profile.avatar_url || "/placeholder.svg"} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><UserRound className="h-8 w-8 text-white/60" aria-hidden="true" /></div>}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">Hallo{profile?.first_name ? ` ${profile.first_name}` : ""}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Dein Profil. Deine Möglichkeiten.</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                <span>{employee?.profession || "Beruf noch nicht angegeben"}</span>
                {profile?.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{profile.city}</span>}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${employee?.profile_visible ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-slate-200"}`}>
                  {employee?.profile_visible ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                  {employee?.profile_visible ? "Für Arbeitgeber sichtbar" : "Profil privat"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-slate-200">Profil vollständig</p>
              <p className="text-2xl font-semibold">{completion}%</p>
            </div>
            <div className="dash-progress mt-3" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Profil-Vollständigkeit"><span style={{ width: `${completion}%` }} /></div>
            <Link href="/arbeitnehmer/profil" className="dash-btn dash-btn-light mt-4 w-full">Profil bearbeiten<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section aria-label="Kennzahlen" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="dash-card dash-card-pad">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
              <span className="dash-kpi-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--navy)]">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="dash-card dash-card-pad" aria-labelledby="requests-heading">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 id="requests-heading" className="text-lg font-semibold tracking-tight text-[var(--navy)]">Anfragen &amp; Nachrichten</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Arbeitgeber, die dich kennenlernen möchten.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">{pendingRequests.length} offen · {acceptedRequests.length} Chat{acceptedRequests.length === 1 ? "" : "s"}</span>
          </div>

          {requestsWithCompanies.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--background-soft)] p-10 text-center">
              <span className="dash-kpi-icon mx-auto"><MessageCircle className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="mt-4 font-semibold text-[var(--navy)]">Noch keine Kontaktanfragen</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">Sobald ein Arbeitgeber dich kontaktieren möchte, erscheint die Anfrage hier. Ein vollständiges Profil erhöht deine Chancen.</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {requestsWithCompanies.map((request) => {
                const company = request.company
                const accepted = request.status === "accepted"
                const pending = request.status === "pending"
                return (
                  <li key={request.id} className="dash-row">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="dash-avatar">
                        {company?.avatar_url ? <img src={company.avatar_url || "/placeholder.svg"} alt="Unternehmensprofilbild" className="h-full w-full object-cover" /> : (company?.name || "U")[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[var(--navy)]">{company?.name || "Unternehmen"}</h3>
                          {accepted && <span className="ed-chip ed-chip-green"><Check className="h-3 w-3" aria-hidden="true" />Chat frei</span>}
                          {pending && <span className="ed-chip ed-chip-amber"><Clock3 className="h-3 w-3" aria-hidden="true" />Offen</span>}
                          {request.status === "rejected" && <span className="ed-chip"><X className="h-3 w-3" aria-hidden="true" />Abgelehnt</span>}
                        </div>
                        <p className="mt-1 truncate text-sm text-[var(--muted)]">{company?.industry || "Branche nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p>
                        <p className="mt-0.5 text-xs text-[var(--muted-light)]">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                      </div>
                    </div>
                    <Link href={`/arbeitnehmer/anfragen/${request.id}`} className={`dash-btn shrink-0 ${accepted ? "" : "dash-btn-outline"}`}>
                      {accepted ? <><MessageCircle className="h-4 w-4" aria-hidden="true" />Chat öffnen</> : <>Ansehen<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          {contactRequestsError && <div className="alert-error mt-5 text-sm font-medium" role="alert">Die Kontaktanfragen konnten nicht geladen werden.</div>}
        </section>

        <aside className="space-y-6">
          <section className="dash-card dash-card-pad" aria-labelledby="checklist-heading">
            <h2 id="checklist-heading" className="font-semibold text-[var(--navy)]">{openItems.length === 0 ? "Dein Profil ist komplett" : "Nächste Schritte"}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{openItems.length === 0 ? "Arbeitgeber sehen alle wichtigen Angaben." : `Noch ${openItems.length} Angabe${openItems.length === 1 ? "" : "n"} bis zum vollständigen Profil.`}</p>
            <ul className="mt-4 space-y-1">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-[var(--surface-soft)]">
                    <span className="flex items-center gap-3">
                      {item.done ? <CheckCircle2 className="h-5 w-5 text-[var(--success)]" aria-hidden="true" /> : <Circle className="h-5 w-5 text-[var(--line-strong)]" aria-hidden="true" />}
                      <span className={item.done ? "text-[var(--muted)] line-through decoration-[var(--line-strong)]" : "font-medium text-[var(--navy)]"}>{item.label}</span>
                      <span className="sr-only">{item.done ? "(erledigt)" : "(offen)"}</span>
                    </span>
                    {!item.done && <ArrowRight className="h-4 w-4 text-[var(--muted-light)]" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-card dash-card-pad" aria-labelledby="pitch-heading">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">So sehen dich Arbeitgeber</p>
            <h2 id="pitch-heading" className="mt-2 font-semibold text-[var(--navy)]">{fullName || "Dein Name"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{employee?.headline || "Noch keine berufliche Überschrift hinterlegt."}</p>
            <p className="mt-4 border-t border-[var(--line)] pt-3 text-sm text-[var(--muted)]">Erfahrung: <span className="font-medium text-[var(--navy)]">{employee?.years_experience ?? 0} Jahre</span></p>
          </section>
        </aside>
      </div>

      <SubscriptionCard />
    </div>
  )
}
