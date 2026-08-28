import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function EmployeeDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] p-10">
        <Link
          href="/login"
          className="font-bold text-blue-600"
        >
          Zum Login
        </Link>
      </main>
    )
  }

  // =========================================================
  // PROFIL
  // =========================================================

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name,last_name,city,avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  // =========================================================
  // ARBEITNEHMER-PROFIL
  // =========================================================

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select(
      "profession,headline,years_experience,profile_visible,desired_employment_percent,preferred_radius_km"
    )
    .eq("id", user.id)
    .maybeSingle()

  // =========================================================
  // KONTAKTANFRAGEN
  // =========================================================

  const { data: contactRequests, error: contactRequestsError } =
    await supabase
      .from("contact_requests")
      .select(`
        id,
        status,
        created_at,
        employer_id,
        job_id
      `)
      .eq("employee_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

  const pendingRequests = contactRequests?.length ?? 0

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/arbeitnehmer"
            className="text-2xl font-black"
          >
            Stoyan<span className="text-blue-600">.</span>
          </Link>

          <nav className="hidden gap-7 text-sm font-semibold md:flex">

            <Link
              href="/arbeitnehmer"
              className="text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/arbeitnehmer/profil"
              className="transition hover:text-blue-600"
            >
              Mein Profil
            </Link>

            <Link
              href="#"
              className="transition hover:text-blue-600"
            >
              Meine Matches
            </Link>

            <Link
              href="#"
              className="transition hover:text-blue-600"
            >
              Einstellungen
            </Link>

          </nav>

          <form
            action="/api/auth/signout"
            method="post"
          >
            <button
              type="submit"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold transition hover:bg-slate-50"
            >
              Abmelden
            </button>
          </form>

        </div>
      </header>

      {/* ===================================================== */}
      {/* HAUPTINHALT */}
      {/* ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* =================================================== */}
        {/* DASHBOARD KOPF */}
        {/* =================================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Arbeitnehmer
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Dein Profil. Deine Möglichkeiten.
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Präsentiere dich professionell und zeige Arbeitgebern,
              was du kannst.
            </p>

          </div>

          <Link
            href="/arbeitnehmer/profil"
            className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Profil bearbeiten
          </Link>

        </div>

        {/* =================================================== */}
        {/* PROFIL + DASHBOARD */}
        {/* =================================================== */}

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">

          {/* ================================================= */}
          {/* LINKES PROFIL */}
          {/* ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">

                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profilbild"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-slate-400">
                    +
                  </div>
                )}

              </div>

              <div>

                <p className="text-xl font-black">
                  {profile?.first_name || "Vorname"}{" "}
                  {profile?.last_name || "Nachname"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {employee?.profession ||
                    "Beruf noch nicht angegeben"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {profile?.city ||
                    "Ort noch nicht angegeben"}
                </p>

              </div>

            </div>

            {/* PROFILSTATUS */}

            <div className="mt-7 rounded-2xl bg-slate-50 p-4">

              <div className="flex justify-between text-sm font-bold">

                <span>
                  Profilstatus
                </span>

                <span className="text-blue-600">
                  {employee?.profile_visible
                    ? "Sichtbar"
                    : "Privat"}
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Je vollständiger dein Profil, desto besser können
                passende Arbeitgeber dich einschätzen.
              </p>

            </div>

          </section>

          {/* ================================================= */}
          {/* RECHTE SEITE */}
          {/* ================================================= */}

          <section className="grid gap-6 sm:grid-cols-2">

            {/* =============================================== */}
            {/* PROFIL */}
            {/* =============================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-bold text-slate-400">
                PROFIL
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Berufliche Präsentation
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {employee?.headline ||
                  "Noch keine berufliche Überschrift hinterlegt."}
              </p>

              <div className="mt-5 text-sm text-slate-500">
                Erfahrung:{" "}
                <b className="text-slate-900">
                  {employee?.years_experience ?? 0} Jahre
                </b>
              </div>

            </div>

            {/* =============================================== */}
            {/* ARBEITSWUNSCH */}
            {/* =============================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-bold text-slate-400">
                ARBEITSWUNSCH
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Was du suchst
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-600">

                <p>
                  Pensum:{" "}
                  <b className="text-slate-900">
                    {employee?.desired_employment_percent ?? 100} %
                  </b>
                </p>

                <p>
                  Umkreis:{" "}
                  <b className="text-slate-900">
                    {employee?.preferred_radius_km ?? 30} km
                  </b>
                </p>

              </div>

            </div>

            {/* =============================================== */}
            {/* KONTAKTANFRAGEN ZAHL */}
            {/* =============================================== */}

            <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">

              <p className="text-sm font-bold text-sky-600">
                KONTAKTANFRAGEN
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {pendingRequests}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Neue Anfrage
                {pendingRequests === 1 ? "" : "n"}
              </p>

            </div>

            {/* =============================================== */}
            {/* PROFIL VERVOLLSTÄNDIGEN */}
            {/* =============================================== */}

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">

              <p className="text-sm font-bold text-blue-300">
                NÄCHSTER SCHRITT
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Vervollständige dein Profil
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Füge Foto, Ausbildung, Erfahrung, Skills und deine
                Wünsche hinzu. So entsteht dein vollständiges
                Stoyan-Profil.
              </p>

              <Link
                href="/arbeitnehmer/profil"
                className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Profil aufbauen →
              </Link>

            </div>

          </section>

        </div>

        {/* =================================================== */}
        {/* NEUE KONTAKTANFRAGEN */}
        {/* =================================================== */}

        {pendingRequests > 0 && (
          <section className="mt-8 rounded-3xl border border-sky-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
                  Neue Anfrage
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Ein Unternehmen möchte dich kontaktieren
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ein Arbeitgeber hat dein Profil gefunden und
                  möchte mit dir Kontakt aufnehmen.
                </p>

              </div>

              <span className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 px-3 text-sm font-black text-sky-700">
                {pendingRequests}
              </span>

            </div>

            {/* ANFRAGEN */}

            <div className="mt-6 space-y-4">

              {contactRequests?.map((request) => (

                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-sm font-bold text-sky-600">
                        Neue Kontaktanfrage
                      </p>

                      <p className="mt-2 font-black text-slate-950">
                        Ein Arbeitgeber möchte dein Profil
                        kontaktieren.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Anfrage vom{" "}
                        {new Date(
                          request.created_at
                        ).toLocaleDateString("de-CH")}
                      </p>

                      {request.job_id && (
                        <p className="mt-1 text-xs text-slate-400">
                          Stellen-ID: {request.job_id}
                        </p>
                      )}

                    </div>

                    <Link
                      href={`/arbeitnehmer/anfragen/${request.id}`}
                      className="rounded-xl bg-sky-500 px-5 py-3 text-center font-bold text-white transition hover:bg-sky-600"
                    >
                      Anfrage ansehen
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* =================================================== */}
        {/* KEINE ANFRAGEN */}
        {/* =================================================== */}

        {pendingRequests === 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center justify-center py-8 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-400">
                ✓
              </div>

              <h2 className="mt-4 text-xl font-black">
                Keine neuen Kontaktanfragen
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Sobald ein Unternehmen dein Profil interessant
                findet und dich kontaktieren möchte, erscheint die
                Anfrage hier.
              </p>

            </div>

          </section>
        )}

        {/* =================================================== */}
        {/* FEHLER */}
        {/* =================================================== */}

        {contactRequestsError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            Die Kontaktanfragen konnten nicht geladen werden.
          </div>
        )}

      </div>

    </main>
  )
}
