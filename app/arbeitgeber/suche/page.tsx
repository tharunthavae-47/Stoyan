"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Filters = {
  profession: string
  city: string
  education: string
  experience: string
  employment: string
  salary: string
  skill: string
}

type Candidate = {
  id: string
  name: string
  profession: string
  city: string
  education: string
  experience: number
  employment: number
  salary: number | null
  skills: string[]
  avatar: string | null
  contactVisible: boolean
}

type SupabaseProfile = {
  id: string
  first_name: string | null
  last_name: string | null
  city: string | null
  avatar_url: string | null
}

type RequestStatus = "pending" | "accepted" | "rejected"

const weights = [25, 20, 20, 15, 10, 5, 5]

const labels = [
  "Beruf",
  "Erfahrung",
  "Skills",
  "Ausbildung",
  "Pensum",
  "Lohn",
  "Ort",
]

function calculateMatch(c: Candidate, f: Filters) {
  const values = [
    f.profession,
    f.experience,
    f.skill,
    f.education,
    f.employment,
    f.salary,
    f.city,
  ]

  const checks = [
    !f.profession ||
      c.profession.toLowerCase().includes(f.profession.toLowerCase()),

    !f.experience || c.experience >= Number(f.experience),

    !f.skill ||
      c.skills.some((s) =>
        s.toLowerCase().includes(f.skill.toLowerCase())
      ),

    !f.education ||
      c.education.toLowerCase().includes(f.education.toLowerCase()),

    !f.employment ||
      c.employment >= Number(f.employment),

    !f.salary ||
      !c.salary ||
      c.salary <= Number(f.salary),

    !f.city ||
      c.city.toLowerCase().includes(f.city.toLowerCase()),
  ]

  let possible = 0
  let score = 0

  const reasons: string[] = []

  checks.forEach((ok, i) => {
    if (!values[i]) return

    possible += weights[i]

    if (ok) {
      score += weights[i]
      reasons.push(`${labels[i]} passt`)
    }
  })

  return {
    score: possible ? Math.round((score / possible) * 100) : 0,
    reasons,
  }
}

export default function EmployerSearch() {
  const [filters, setFilters] = useState<Filters>({
    profession: "",
    city: "",
    education: "",
    experience: "",
    employment: "",
    salary: "",
    skill: "",
  })

  const [candidates, setCandidates] = useState<Candidate[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const [searched, setSearched] = useState(false)

  /*
   * Gesendete Anfragen.
   *
   * Beispiel:
   *
   * {
   *   "abc-user-id": "pending"
   * }
   */
  const [requestStatuses, setRequestStatuses] = useState<
    Record<string, RequestStatus>
  >({})

  /*
   * ID des Kandidaten, bei dem gerade
   * die Anfrage gesendet wird.
   */
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(
    null
  )

  /*
   * Erfolgsmeldung
   */
  const [successMessage, setSuccessMessage] = useState("")

  /*
   * =========================================================
   * KANDIDATEN + BESTEHENDE ANFRAGEN LADEN
   * =========================================================
   */

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError("")

        const supabase = createClient()

        /*
         * Eingeloggten Arbeitgeber holen
         */
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          window.location.href = "/login"
          return
        }

        /*
         * Arbeitnehmerprofile laden
         */
        const {
          data: employeeData,
          error: employeeError,
        } = await supabase
          .from("employee_profiles")
          .select(
            `
              id,
              profession,
              education,
              years_experience,
              desired_employment_percent,
              desired_salary_min,
              skills,
              profile_visible,
              contact_visible
            `
          )
          .eq("profile_visible", true)

        if (employeeError) {
          setError(
            `Kandidaten konnten nicht geladen werden: ${employeeError.message}`
          )
          setLoading(false)
          return
        }

        const employeeRows = employeeData || []

        const ids = employeeRows.map((employee) => employee.id)

        /*
         * Profile der Arbeitnehmer laden
         */
        const profiles: SupabaseProfile[] =
          ids.length > 0
            ? (
                (
                  await supabase
                    .from("profiles")
                    .select(
                      "id,first_name,last_name,city,avatar_url"
                    )
                    .in("id", ids)
                ).data || []
              ) as SupabaseProfile[]
            : []

        const byId = new Map<string, SupabaseProfile>(
          profiles.map((profile) => [profile.id, profile])
        )

        /*
         * Kandidaten zusammenbauen
         */
        const formattedCandidates: Candidate[] = employeeRows.map(
          (employee) => {
            const profile = byId.get(employee.id)

            return {
              id: employee.id,

              name:
                `${profile?.first_name || "Kandidat"} ${
                  profile?.last_name || ""
                }`.trim(),

              profession:
                employee.profession || "Beruf nicht angegeben",

              city: profile?.city || "",

              education: employee.education || "",

              experience: Number(
                employee.years_experience || 0
              ),

              employment: Number(
                employee.desired_employment_percent || 100
              ),

              salary: employee.desired_salary_min
                ? Number(employee.desired_salary_min)
                : null,

              skills: Array.isArray(employee.skills)
                ? employee.skills
                : [],

              avatar: profile?.avatar_url || null,

              contactVisible: Boolean(
                employee.contact_visible
              ),
            }
          }
        )

        setCandidates(formattedCandidates)

        /*
         * =====================================================
         * BEREITS GESENDETE ANFRAGEN DES ARBEITGEBERS LADEN
         * =====================================================
         *
         * Wichtig:
         * Durch die RLS-Regel
         *
         * employer_id = auth.uid()
         *
         * sieht der Arbeitgeber nur seine eigenen Anfragen.
         */

        const {
          data: existingRequests,
          error: requestsError,
        } = await supabase
          .from("contact_requests")
          .select(
            "id,employee_id,status,created_at"
          )
          .eq("employer_id", user.id)
          .order("created_at", {
            ascending: false,
          })

        if (requestsError) {
          /*
           * Die Kandidaten können trotzdem angezeigt werden.
           * Nur die Anfrage-Status können dann nicht geladen werden.
           */
          console.error(
            "Fehler beim Laden der Kontaktanfragen:",
            requestsError
          )
        } else {
          const statuses: Record<
            string,
            RequestStatus
          > = {}

          /*
           * Die neueste Anfrage pro Arbeitnehmer verwenden.
           */
          for (const request of existingRequests || []) {
            if (
              request.employee_id &&
              !statuses[request.employee_id]
            ) {
              statuses[request.employee_id] =
                request.status as RequestStatus
            }
          }

          setRequestStatuses(statuses)
        }

        setLoading(false)
      } catch (err) {
        console.error(err)

        setError(
          "Beim Laden der Kandidaten ist ein unerwarteter Fehler aufgetreten."
        )

        setLoading(false)
      }
    })()
  }, [])

  /*
   * =========================================================
   * ANFRAGE SENDEN
   * =========================================================
   */

  const sendContactRequest = async (
    employeeId: string
  ) => {
    /*
     * Verhindern, dass während des Sendens
     * mehrfach geklickt wird.
     */
    if (sendingRequestId) {
      return
    }

    setSendingRequestId(employeeId)

    setError("")

    setSuccessMessage("")

    try {
      const supabase = createClient()

      /*
       * Eingeloggten Arbeitgeber holen
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        window.location.href = "/login"
        return
      }

      /*
       * =====================================================
       * PRÜFEN, OB BEREITS EINE ANFRAGE EXISTIERT
       * =====================================================
       */

      const {
        data: existingRequest,
        error: existingRequestError,
      } = await supabase
        .from("contact_requests")
        .select("id,status")
        .eq("employer_id", user.id)
        .eq("employee_id", employeeId)
        .maybeSingle()

      /*
       * Wenn die Abfrage selbst einen Fehler liefert,
       * nicht einfach blind einen neuen Datensatz erzeugen.
       */
      if (existingRequestError) {
        console.error(
          "Fehler beim Prüfen der bestehenden Anfrage:",
          existingRequestError
        )

        /*
         * Falls mehrere Datensätze existieren, kann maybeSingle()
         * einen Fehler verursachen. Deshalb versuchen wir in
         * diesem Fall noch einmal mit limit(1).
         */
        const {
          data: fallbackRequest,
          error: fallbackError,
        } = await supabase
          .from("contact_requests")
          .select("id,status")
          .eq("employer_id", user.id)
          .eq("employee_id", employeeId)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)

        if (fallbackError) {
          throw new Error(
            `Bestehende Anfrage konnte nicht geprüft werden: ${fallbackError.message}`
          )
        }

        if (fallbackRequest && fallbackRequest.length > 0) {
          const existing =
            fallbackRequest[0]

          setRequestStatuses((current) => ({
            ...current,
            [employeeId]:
              existing.status as RequestStatus,
          }))

          setSuccessMessage(
            "Für diesen Kandidaten existiert bereits eine Anfrage."
          )

          return
        }
      }

      /*
       * Anfrage existiert bereits
       */
      if (existingRequest) {
        setRequestStatuses((current) => ({
          ...current,
          [employeeId]:
            existingRequest.status as RequestStatus,
        }))

        setSuccessMessage(
          "Für diesen Kandidaten wurde bereits eine Anfrage gesendet."
        )

        return
      }

      /*
       * =====================================================
       * NEUE ANFRAGE ERSTELLEN
       * =====================================================
       *
       * job_id bleibt NULL, weil aktuell keine konkrete
       * Stellenanzeige ausgewählt wird.
       */

      const {
        data: insertedRequest,
        error: insertError,
      } = await supabase
        .from("contact_requests")
        .insert({
          employer_id: user.id,
          employee_id: employeeId,
          job_id: null,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select(
          "id,employer_id,employee_id,job_id,status,created_at"
        )
        .single()

      if (insertError) {
        console.error(
          "Fehler beim Erstellen der Kontaktanfrage:",
          insertError
        )

        /*
         * Wenn zwischen Prüfung und INSERT bereits eine
         * Anfrage erstellt wurde, zeigen wir trotzdem
         * "bereits gesendet".
         */
        if (
          insertError.code === "23505"
        ) {
          setRequestStatuses((current) => ({
            ...current,
            [employeeId]: "pending",
          }))

          setSuccessMessage(
            "Die Anfrage wurde bereits gesendet."
          )

          return
        }

        throw new Error(
          `Anfrage konnte nicht gesendet werden: ${insertError.message}`
        )
      }

      /*
       * Status lokal aktualisieren
       */
      setRequestStatuses((current) => ({
        ...current,
        [employeeId]: "pending",
      }))

      console.log(
        "Kontaktanfrage erfolgreich erstellt:",
        insertedRequest
      )

      setSuccessMessage(
        "Anfrage erfolgreich gesendet."
      )
    } catch (err) {
      console.error(
        "Kontaktanfrage Fehler:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Die Anfrage konnte nicht gesendet werden."
      )
    } finally {
      setSendingRequestId(null)
    }
  }

  /*
   * =========================================================
   * MATCHING
   * =========================================================
   */

  const results = useMemo(() => {
    const active = Object.values(filters).some(
      Boolean
    )

    return candidates
      .map((candidate) => ({
        ...candidate,
        ...calculateMatch(
          candidate,
          filters
        ),
      }))
      .filter(
        (candidate) =>
          !active ||
          candidate.score >= 40
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
  }, [candidates, filters])

  /*
   * =========================================================
   * FILTER ZURÜCKSETZEN
   * =========================================================
   */

  const reset = () => {
    setFilters({
      profession: "",
      city: "",
      education: "",
      experience: "",
      employment: "",
      salary: "",
      skill: "",
    })

    setSearched(false)

    setError("")

    setSuccessMessage("")
  }

  /*
   * =========================================================
   * BUTTON-TEXT
   * =========================================================
   */

  const getRequestButton = (
    candidate: Candidate
  ) => {
    const status =
      requestStatuses[candidate.id]

    if (status === "pending") {
      return "Anfrage gesendet ✓"
    }

    if (status === "accepted") {
      return "Anfrage angenommen ✓"
    }

    if (status === "rejected") {
      return "Erneut anfragen"
    }

    if (
      sendingRequestId === candidate.id
    ) {
      return "Wird gesendet..."
    }

    return "Anfrage senden"
  }

  /*
   * =========================================================
   * BUTTON DEAKTIVIERT?
   * =========================================================
   */

  const isRequestDisabled = (
    candidate: Candidate
  ) => {
    if (
      sendingRequestId === candidate.id
    ) {
      return true
    }

    if (
      requestStatuses[candidate.id] ===
      "pending"
    ) {
      return true
    }

    if (
      requestStatuses[candidate.id] ===
      "accepted"
    ) {
      return true
    }

    /*
     * Arbeitnehmer möchte nicht kontaktiert werden.
     */
    if (!candidate.contactVisible) {
      return true
    }

    return false
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/arbeitgeber"
            className="text-2xl font-black"
          >
            Stoyan
            <span className="text-blue-600">
              .
            </span>
          </Link>

          <div className="flex gap-6 text-sm font-semibold">

            <Link
              href="/arbeitgeber/suche"
              className="text-blue-600"
            >
              Kandidaten
            </Link>

            <Link
              href="/arbeitgeber/firma"
              className="transition hover:text-blue-600"
            >
              Unternehmen
            </Link>

          </div>

          <Link
            href="/arbeitgeber"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold transition hover:bg-slate-50"
          >
            Dashboard
          </Link>

        </div>

      </header>

      {/* =====================================================
          HAUPTINHALT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Kandidatensuche
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Finden Sie die passenden Menschen.
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Definieren Sie Ihre Anforderungen.
          Stoyan bewertet sichtbare Profile und
          zeigt nachvollziehbar, warum ein Kandidat
          passt.
        </p>

        {/* ===================================================
            SUCHFILTER
        =================================================== */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <input
              value={filters.profession}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  profession:
                    e.target.value,
                }))
              }
              placeholder="Beruf / Position"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              value={filters.city}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  city: e.target.value,
                }))
              }
              placeholder="Ort / PLZ"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={filters.education}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  education:
                    e.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">
                Ausbildung
              </option>

              <option>
                EFZ
              </option>

              <option>
                EBA
              </option>

              <option>
                Fachschule
              </option>

              <option>
                FH
              </option>

              <option>
                Universität
              </option>

            </select>

            <select
              value={filters.experience}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  experience:
                    e.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">
                Erfahrung
              </option>

              <option value="1">
                1+ Jahre
              </option>

              <option value="3">
                3+ Jahre
              </option>

              <option value="5">
                5+ Jahre
              </option>

              <option value="10">
                10+ Jahre
              </option>

            </select>

            <select
              value={filters.employment}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  employment:
                    e.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">
                Pensum
              </option>

              <option value="50">
                50 %+
              </option>

              <option value="80">
                80 %+
              </option>

              <option value="100">
                100 %
              </option>

            </select>

            <input
              type="number"
              value={filters.salary}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  salary:
                    e.target.value,
                }))
              }
              placeholder="Max. Wunschlohn CHF"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              value={filters.skill}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  skill: e.target.value,
                }))
              }
              placeholder="Skill, z. B. Diagnose"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:col-span-2"
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                setSearched(true)
              }
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700"
            >
              Kandidaten finden
            </button>

            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 px-6 py-3.5 font-bold transition hover:bg-slate-50"
            >
              Zurücksetzen
            </button>

            <span className="ml-auto self-center text-sm font-semibold text-slate-500">

              {loading
                ? "Kandidaten werden geladen…"
                : searched
                ? `${results.length} passende Profile`
                : `${results.length} sichtbare Profile`}

            </span>

          </div>

        </section>

        {/* ===================================================
            ERFOLG
        =================================================== */}

        {successMessage && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        {/* ===================================================
            FEHLER
        =================================================== */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            KANDIDATEN
        =================================================== */}

        <section className="mt-10 space-y-4">

          {results.map((candidate) => {

            const requestStatus =
              requestStatuses[
                candidate.id
              ]

            const requestDisabled =
              isRequestDisabled(
                candidate
              )

            return (
              <article
                key={candidate.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="grid gap-6 lg:grid-cols-[300px_1fr_auto] lg:items-center">

                  {/* =================================================
                      KANDIDAT
                  ================================================= */}

                  <div className="flex items-center gap-4">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

                      {candidate.avatar ? (
                        <img
                          src={candidate.avatar}
                          alt="Profilbild"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl font-black text-slate-300">
                          {candidate.name[0]}
                        </div>
                      )}

                    </div>

                    <div>

                      <h2 className="text-xl font-black">
                        {candidate.name}
                      </h2>

                      <p className="font-semibold">
                        {candidate.profession}
                      </p>

                      <p className="text-sm text-slate-500">
                        {candidate.city ||
                          "Ort offen"}{" "}
                        ·{" "}
                        {candidate.experience}{" "}
                        Jahre ·{" "}
                        {candidate.employment}%
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      SKILLS
                  ================================================= */}

                  <div>

                    <div className="flex flex-wrap gap-2">

                      {candidate.skills
                        .slice(0, 7)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}

                    </div>

                    <p className="mt-4 text-sm text-slate-500">

                      {candidate.reasons
                        .length
                        ? candidate.reasons.join(
                            " · "
                          )
                        : "Noch keine Suchkriterien ausgewählt."}

                    </p>

                    {!candidate.contactVisible && (
                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        Dieser Kandidat möchte aktuell nicht kontaktiert werden.
                      </p>
                    )}

                  </div>

                  {/* =================================================
                      MATCH + BUTTONS
                  ================================================= */}

                  <div className="min-w-[190px] text-right">

                    <div className="text-4xl font-black text-blue-600">
                      {searched
                        ? `${candidate.score}%`
                        : "—"}
                    </div>

                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {searched
                        ? "Match"
                        : "Profil"}
                    </p>

                    <div className="mt-4 flex flex-col gap-2">

                      <Link
                        href={`/arbeitgeber/kandidat/${candidate.id}`}
                        className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        Profil ansehen
                      </Link>

                      {/* =============================================
                          ANFRAGE SENDEN
                      ============================================= */}

                      {requestStatus ===
                      "rejected" ? (
                        <button
                          type="button"
                          onClick={() =>
                            sendContactRequest(
                              candidate.id
                            )
                          }
                          disabled={
                            sendingRequestId ===
                            candidate.id
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {sendingRequestId ===
                          candidate.id
                            ? "Wird gesendet..."
                            : "Erneut anfragen"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            sendContactRequest(
                              candidate.id
                            )
                          }
                          disabled={
                            requestDisabled
                          }
                          className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                            requestStatus ===
                            "pending"
                              ? "cursor-default bg-green-100 text-green-700"
                              : requestStatus ===
                                "accepted"
                              ? "cursor-default bg-green-100 text-green-700"
                              : !candidate.contactVisible
                              ? "cursor-not-allowed bg-slate-100 text-slate-400"
                              : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          }`}
                        >
                          {getRequestButton(
                            candidate
                          )}
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            )
          })}

          {/* =================================================
              KEINE ERGEBNISSE
          ================================================= */}

          {!loading &&
            !results.length && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

                <h3 className="text-xl font-black">
                  Keine passenden Profile gefunden
                </h3>

                <p className="mt-2 text-slate-500">
                  Reduzieren Sie einige Kriterien
                  und versuchen Sie es erneut.
                </p>

              </div>
            )}

        </section>

      </div>

    </main>
  )
}
