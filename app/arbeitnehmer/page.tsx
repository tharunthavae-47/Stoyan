import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { MessageCircle, Check, Clock3, ArrowRight } from "lucide-react"

export default async function EmployeeDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="card card-pad">
        <Link href="/login" className="font-bold text-[var(--brand)]">Zum Login</Link>
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

  // Alle Kontaktanfragen laden – nicht nur pending.
  // So bleibt ein angenommener Chat im Arbeitnehmer-Dashboard sichtbar.
  const { data: contactRequests, error: contactRequestsError } = await supabase
    .from("contact_requests")
    .select("id,status,created_at,employer_id,job_id")
    .eq("employee_id", user.id)
    .order("created_at", { ascending: false })

  const employerIds = Array.from(new Set((contactRequests ?? []).map((request) => request.employer_id)))

  const { data: companies } = employerIds.length > 0
    ? await supabase
        .from("companies")
        .select("owner_id,name,industry,city")
        .in("owner_id", employerIds)
    : { data: [] }

  const requestsWithCompanies = (contactRequests ?? []).map((request) => ({
    ...request,
    company: companies?.find((company) => company.owner_id === request.employer_id) ?? null,
  }))

  const pendingRequests = requestsWithCompanies.filter((request) => request.status === "pending")
  const acceptedRequests = requestsWithCompanies.filter((request) => request.status === "accepted")
  const rejectedRequests = requestsWithCompanies.filter((request) => request.status === "rejected")

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Arbeitnehmer</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Dein Profil. Deine Möglichkeiten.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Präsentiere dich professionell und zeige Arbeitgebern, was du kannst.</p>
          </div>
          <Link href="/arbeitnehmer/profil" className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">Profil bearbeiten</Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl text-slate-400">+</div>}
              </div>
              <div>
                <p className="text-xl font-black">{profile?.first_name || "Vorname"} {profile?.last_name || "Nachname"}</p>
                <p className="mt-1 text-sm text-slate-500">{employee?.profession || "Beruf noch nicht angegeben"}</p>
                <p className="mt-1 text-sm text-slate-500">{profile?.city || "Ort noch nicht angegeben"}</p>
              </div>
            </div>
            <div className="mt-7 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm font-bold"><span>Profilstatus</span><span className="text-blue-600">{employee?.profile_visible ? "Sichtbar" : "Privat"}</span></div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Je vollständiger dein Profil, desto besser können passende Arbeitgeber dich einschätzen.</p>
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-400">PROFIL</p>
              <h2 className="mt-2 text-2xl font-black">Berufliche Präsentation</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{employee?.headline || "Noch keine berufliche Überschrift hinterlegt."}</p>
              <div className="mt-5 text-sm text-slate-500">Erfahrung: <b className="text-slate-900">{employee?.years_experience ?? 0} Jahre</b></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-400">ARBEITSWUNSCH</p>
              <h2 className="mt-2 text-2xl font-black">Was du suchst</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Pensum: <b className="text-slate-900">{employee?.desired_employment_percent ?? 100} %</b></p>
                <p>Umkreis: <b className="text-slate-900">{employee?.preferred_radius_km ?? 30} km</b></p>
              </div>
            </div>
            <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
              <p className="text-sm font-bold text-sky-600">KONTAKTANFRAGEN</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{pendingRequests.length}</h2>
              <p className="mt-2 text-sm text-slate-500">Neue Anfrage{pendingRequests.length === 1 ? "" : "n"}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-bold text-blue-300">NÄCHSTER SCHRITT</p>
              <h2 className="mt-2 text-2xl font-black">Vervollständige dein Profil</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Füge Foto, Ausbildung, Erfahrung, Skills und deine Wünsche hinzu.</p>
              <Link href="/arbeitnehmer/profil" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100">Profil aufbauen →</Link>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-sky-600">Kommunikation</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Anfragen &amp; Nachrichten</h2>
              <p className="mt-2 text-sm text-slate-500">Hier findest du deine Kontaktanfragen und deine privaten Chats.</p>
            </div>
            <div className="flex gap-3 text-xs font-bold text-slate-500">
              <span>{pendingRequests.length} offen</span>
              <span>{acceptedRequests.length} Chat{acceptedRequests.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          {requestsWithCompanies.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-4 font-black">Noch keine Kontaktanfragen</h3>
              <p className="mt-2 text-sm text-slate-500">Sobald ein Arbeitgeber dich kontaktieren möchte, erscheint die Anfrage hier.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {requestsWithCompanies.map((request) => {
                const company = request.company
                const accepted = request.status === "accepted"
                const pending = request.status === "pending"
                return (
                  <div key={request.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-black text-slate-950">{company?.name || "Unternehmen"}</p>
                        {accepted && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"><Check className="h-3 w-3" /> Chat freigeschaltet</span>}
                        {pending && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700"><Clock3 className="h-3 w-3" /> Anfrage offen</span>}
                        {request.status === "rejected" && <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-black text-slate-600">Abgelehnt</span>}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{company?.industry || "Branche nicht angegeben"}{company?.city ? ` · ${company.city}` : ""}</p>
                      <p className="mt-1 text-xs text-slate-400">Anfrage vom {new Date(request.created_at).toLocaleDateString("de-CH")}</p>
                    </div>
                    <Link href={`/arbeitnehmer/anfragen/${request.id}`} className={accepted ? "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700" : "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-100"}>
                      {accepted ? <><MessageCircle className="h-4 w-4" /> Chat öffnen</> : <>Anfrage ansehen <ArrowRight className="h-4 w-4" /></>}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {contactRequestsError && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">Die Kontaktanfragen konnten nicht geladen werden.</div>}
        </section>
      </div>
    </div>
  )
}
