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
  score: number
  reasons: string[]
}

type EmployeeRow = {
  id: string
  profession: string | null
  education: string | null
  years_experience: number | null
  desired_employment_percent: number | null
  desired_salary_min: number | null
  skills: unknown
  profile_visible: boolean | null
  contact_visible: boolean | null
}

type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  city: string | null
  avatar_url: string | null
}

type RequestStatus =
  | "pending"
  | "accepted"
  | "rejected"

const weights = [
  25,
  20,
  20,
  15,
  10,
  5,
  5,
]

const labels = [
  "Beruf",
  "Erfahrung",
  "Skills",
  "Ausbildung",
  "Pensum",
  "Lohn",
  "Ort",
]

function calculateMatch(
  candidate: Candidate,
  filters: Filters
) {
  const values = [
    filters.profession,
    filters.experience,
    filters.skill,
    filters.education,
    filters.employment,
    filters.salary,
    filters.city,
  ]

  const checks = [
    !filters.profession ||
      candidate.profession
        .toLowerCase()
        .includes(
          filters.profession.toLowerCase()
        ),

    !filters.experience ||
      candidate.experience >=
        Number(filters.experience),

    !filters.skill ||
      candidate.skills.some((skill) =>
        skill
          .toLowerCase()
          .includes(
            filters.skill.toLowerCase()
          )
      ),

    !filters.education ||
      candidate.education
        .toLowerCase()
        .includes(
          filters.education.toLowerCase()
        ),

    !filters.employment ||
      candidate.employment >=
        Number(filters.employment),

    !filters.salary ||
      !candidate.salary ||
      candidate.salary <=
        Number(filters.salary),

    !filters.city ||
      candidate.city
        .toLowerCase()
        .includes(
          filters.city.toLowerCase()
        ),
  ]

  let possible = 0
  let score = 0

  const reasons: string[] = []

  checks.forEach((ok, index) => {
    if (!values[index]) {
      return
    }

    possible += weights[index]

    if (ok) {
      score += weights[index]
      reasons.push(
        `${labels[index]} passt`
      )
    }
  })

  return {
    score: possible
      ? Math.round(
          (score / possible) * 100
        )
      : 0,
    reasons,
  }
}

export default function EmployerSearch() {
  const [filters, setFilters] =
    useState<Filters>({
      profession: "",
      city: "",
      education: "",
      experience: "",
      employment: "",
      salary: "",
      skill: "",
    })

  const [candidates, setCandidates] =
    useState<Candidate[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [searched, setSearched] =
    useState(false)

  const [
    requestStatuses,
    setRequestStatuses,
  ] = useState<
    Record<string, RequestStatus>
  >({})

  const [
    sendingRequestId,
    setSendingRequestId,
  ] = useState<string | null>(null)

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("")

  /*
   * =========================================================
   * KANDIDATEN LADEN
   * =========================================================
   */

  useEffect(() => {
    let active = true

    async function loadCandidates() {
      try {
        setLoading(true)
        setError("")

        const supabase =
          createClient()

        /*
         * Benutzer prüfen
         */

        const {
          data: {
            user,
          },
          error: userError,
        } =
          await supabase.auth.getUser()

        if (
          userError ||
          !user
        ) {
          window.location.href =
            "/login"
          return
        }

        /*
         * =====================================================
         * EMPLOYEE PROFILES
         * =====================================================
         *
         * Nur sichtbare Arbeitnehmer laden.
         */

        const {
          data: employeeData,
          error: employeeError,
        } =
          await supabase
            .from(
              "employee_profiles"
            )
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
            .eq(
              "profile_visible",
              true
            )

        if (employeeError) {
          throw new Error(
            `Kandidaten konnten nicht geladen werden: ${employeeError.message}`
          )
        }

        const employeeRows =
          (employeeData ||
            []) as EmployeeRow[]

        /*
         * =====================================================
         * PROFILE
         * =====================================================
         */

        const ids =
          employeeRows.map(
            (employee) =>
              employee.id
          )

        let profiles: Profile[] =
          []

        if (ids.length > 0) {
          const {
            data: profileData,
            error: profileError,
          } =
            await supabase
              .from("profiles")
              .select(
                `
                  id,
                  first_name,
                  last_name,
                  city,
                  avatar_url
                `
              )
              .in("id", ids)

          if (profileError) {
            console.error(
              "Profile Fehler:",
              profileError
            )
          } else {
            profiles =
              (profileData ||
                []) as Profile[]
          }
        }

        const profileMap =
          new Map<
            string,
            Profile
          >()

        profiles.forEach(
          (profile) => {
            profileMap.set(
              profile.id,
              profile
            )
          }
        )

        /*
         * =====================================================
         * KANDIDATEN ERSTELLEN
         * =====================================================
         */

        const formatted: Candidate[] =
          employeeRows.map(
            (employee) => {
              const profile =
                profileMap.get(
                  employee.id
                )

              let skills: string[] =
                []

              if (
                Array.isArray(
                  employee.skills
                )
              ) {
                skills =
                  employee.skills.filter(
                    (
                      skill
                    ): skill is string =>
                      typeof skill ===
                      "string"
                  )
              }

              return {
                id: employee.id,

                name:
                  `${profile?.first_name || "Kandidat"} ${
                    profile?.last_name || ""
                  }`.trim(),

                profession:
                  employee.profession ||
                  "Beruf nicht angegeben",

                city:
                  profile?.city ||
                  "",

                education:
                  employee.education ||
                  "",

                experience:
                  Number(
                    employee.years_experience ||
                      0
                  ),

                employment:
                  Number(
                    employee.desired_employment_percent ||
                      100
                  ),

                salary:
                  employee.desired_salary_min !==
                    null &&
                  employee.desired_salary_min !==
                    undefined
                    ? Number(
                        employee.desired_salary_min
                      )
                    : null,

                skills,

                avatar:
                  profile?.avatar_url ||
                  null,

                contactVisible:
                  Boolean(
                    employee.contact_visible
                  ),

                score: 0,
                reasons: [],
              }
            }
          )

        if (!active) {
          return
        }

        setCandidates(
          formatted
        )

        /*
         * =====================================================
         * BESTEHENDE ANFRAGEN
         * =====================================================
         */

        const {
          data: requests,
          error: requestsError,
        } =
          await supabase
            .from(
              "contact_requests"
            )
            .select(
              `
                id,
                employee_id,
                status,
                created_at
              `
            )
            .eq(
              "employer_id",
              user.id
            )
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            )

        if (
          requestsError
        ) {
          console.warn(
            "Anfragen konnten nicht geladen werden:",
            requestsError
          )
        } else {
          const statuses: Record<
            string,
            RequestStatus
          > = {}

          for (
            const request of
              requests || []
          ) {
            if (
              request.employee_id &&
              !statuses[
                request.employee_id
              ]
            ) {
              statuses[
                request.employee_id
              ] =
                request.status as RequestStatus
            }
          }

          setRequestStatuses(
            statuses
          )
        }

        setLoading(false)
      } catch (err) {
        console.error(
          "Kandidatensuche:",
          err
        )

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Kandidaten konnten nicht geladen werden."
          )

          setLoading(false)
        }
      }
    }

    loadCandidates()

    return () => {
      active = false
    }
  }, [])

  /*
   * =========================================================
   * ANFRAGE SENDEN
   * =========================================================
   */

  const sendContactRequest =
    async (
      employeeId: string
    ) => {
      if (
        sendingRequestId
      ) {
        return
      }

      setSendingRequestId(
        employeeId
      )

      setError("")
      setSuccessMessage("")

      try {
        const supabase =
          createClient()

        /*
         * Benutzer
         */

        const {
          data: {
            user,
          },
          error: userError,
        } =
          await supabase.auth.getUser()

        if (
          userError ||
          !user
        ) {
          window.location.href =
            "/login"
          return
        }

        /*
         * Arbeitgeber muss ein
         * profiles-Profil besitzen.
         */

        const {
          data: employerProfile,
          error:
            employerProfileError,
        } =
          await supabase
            .from("profiles")
            .select("id")
            .eq(
              "id",
              user.id
            )
            .maybeSingle()

        if (
          employerProfileError
        ) {
          throw new Error(
            `Arbeitgeberprofil konnte nicht geprüft werden: ${employerProfileError.message}`
          )
        }

        if (
          !employerProfile
        ) {
          throw new Error(
            "Ihr Arbeitgeberprofil wurde nicht gefunden. Bitte gehen Sie zuerst zu „Unternehmen“ und speichern Sie Ihr Unternehmensprofil."
          )
        }

        /*
         * Kandidat prüfen
         */

        const {
          data: employee,
          error:
            employeeError,
        } =
          await supabase
            .from(
              "employee_profiles"
            )
            .select(
              "id,contact_visible"
            )
            .eq(
              "id",
              employeeId
            )
            .maybeSingle()

        if (
          employeeError
        ) {
          throw new Error(
            `Kandidat konnte nicht geprüft werden: ${employeeError.message}`
          )
        }

        if (!employee) {
          throw new Error(
            "Der Kandidat wurde nicht gefunden."
          )
        }

        if (
          !employee.contact_visible
        ) {
          throw new Error(
            "Dieser Kandidat möchte aktuell nicht kontaktiert werden."
          )
        }

        /*
         * Bestehende Anfrage
         */

        const {
          data: existing,
          error:
            existingError,
        } =
          await supabase
            .from(
              "contact_requests"
            )
            .select(
              "id,status,created_at"
            )
            .eq(
              "employer_id",
              user.id
            )
            .eq(
              "employee_id",
              employeeId
            )
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            )
            .limit(1)

        if (
          existingError
        ) {
          throw new Error(
            `Bestehende Anfrage konnte nicht geprüft werden: ${existingError.message}`
          )
        }

        const existingRequest =
          existing &&
          existing.length > 0
            ? existing[0]
            : null

        if (
          existingRequest &&
          existingRequest.status !==
            "rejected"
        ) {
          setRequestStatuses(
            (current) => ({
              ...current,
              [employeeId]:
                existingRequest.status as RequestStatus,
            })
          )

          setSuccessMessage(
            existingRequest.status ===
              "accepted"
              ? "Die Anfrage wurde bereits angenommen."
              : "Für diesen Kandidaten wurde bereits eine Anfrage gesendet."
          )

          return
        }

        /*
         * =====================================================
         * INSERT
         * =====================================================
         */

        const {
          data: inserted,
          error:
            insertError,
        } =
          await supabase
            .from(
              "contact_requests"
            )
            .insert({
              employer_id:
                user.id,
              employee_id:
                employeeId,
              job_id: null,
              status:
                "pending",
            })
            .select(
              "id,employer_id,employee_id,job_id,status,created_at"
            )
            .single()

        if (
          insertError
        ) {
          console.error(
            "contact_requests INSERT:",
            insertError
          )

          if (
            insertError.code ===
            "23503"
          ) {
            throw new Error(
              "Die Kontaktanfrage konnte nicht gespeichert werden. Ihr Arbeitgeberkonto ist noch nicht korrekt mit einem Profil verknüpft. Bitte öffnen Sie „Unternehmen“, speichern Sie Ihr Profil und versuchen Sie es erneut."
            )
          }

          if (
            insertError.code ===
            "23505"
          ) {
            setRequestStatuses(
              (current) => ({
                ...current,
                [employeeId]:
                  "pending",
              })
            )

            setSuccessMessage(
              "Die Anfrage wurde bereits gesendet."
            )

            return
          }

          throw new Error(
            `Anfrage konnte nicht gesendet werden: ${insertError.message}`
          )
        }

        console.log(
          "Anfrage erstellt:",
          inserted
        )

        setRequestStatuses(
          (current) => ({
            ...current,
            [employeeId]:
              "pending",
          })
        )

        setSuccessMessage(
          "Anfrage erfolgreich gesendet."
        )
      } catch (err) {
        console.error(
          "Anfrage Fehler:",
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : "Die Anfrage konnte nicht gesendet werden."
        )
      } finally {
        setSendingRequestId(
          null
        )
      }
    }

  /*
   * =========================================================
   * MATCHING
   * =========================================================
   */

  const results =
    useMemo(() => {
      const active =
        Object.values(
          filters
        ).some(Boolean)

      return candidates
        .map(
          (candidate) => {
            const match =
              calculateMatch(
                candidate,
                filters
              )

            return {
              ...candidate,
              ...match,
            }
          }
        )
        .filter(
          (candidate) =>
            !active ||
            candidate.score >= 40
        )
        .sort(
          (a, b) =>
            b.score - a.score
        )
    }, [
      candidates,
      filters,
    ])

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const reset =
    () => {
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
   * BUTTON TEXT
   * =========================================================
   */

  const getRequestButton =
    (
      candidate: Candidate
    ) => {
      const status =
        requestStatuses[
          candidate.id
        ]

      if (
        sendingRequestId ===
        candidate.id
      ) {
        return "Wird gesendet..."
      }

      if (
        status === "pending"
      ) {
        return "Anfrage gesendet ✓"
      }

      if (
        status === "accepted"
      ) {
        return "Anfrage angenommen ✓"
      }

      if (
        status === "rejected"
      ) {
        return "Erneut anfragen"
      }

      return "Anfrage senden"
    }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="animate-fade-up">

      <div className="mx-auto max-w-7xl px-6 py-10">

        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Kandidatensuche
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Finden Sie die passenden Menschen.
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Definieren Sie Ihre Anforderungen
          und entdecken Sie passende
          Arbeitnehmerprofile.
        </p>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <input
              value={
                filters.profession
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    profession:
                      e.target.value,
                  })
                )
              }
              placeholder="Beruf / Position"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              value={
                filters.city
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    city:
                      e.target.value,
                  })
                )
              }
              placeholder="Ort / PLZ"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={
                filters.education
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    education:
                      e.target.value,
                  })
                )
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">
                Ausbildung
              </option>
              <option value="EFZ">
                EFZ
              </option>
              <option value="EBA">
                EBA
              </option>
              <option value="Fachschule">
                Fachschule
              </option>
              <option value="FH">
                FH
              </option>
              <option value="Universität">
                Universität
              </option>
            </select>

            <select
              value={
                filters.experience
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    experience:
                      e.target.value,
                  })
                )
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
              value={
                filters.employment
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    employment:
                      e.target.value,
                  })
                )
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
              value={
                filters.salary
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    salary:
                      e.target.value,
                  })
                )
              }
              placeholder="Max. Wunschlohn CHF"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              value={
                filters.skill
              }
              onChange={(e) =>
                setFilters(
                  (f) => ({
                    ...f,
                    skill:
                      e.target.value,
                  })
                )
              }
              placeholder="Skill, z. B. Diagnose"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:col-span-2"
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
              className="rounded-xl border border-slate-200 px-6 py-3.5 font-bold hover:bg-slate-50"
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

        {successMessage && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="mt-10 space-y-4">

          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <p className="font-semibold text-slate-500">
                Kandidaten werden geladen…
              </p>
            </div>
          )}

          {!loading &&
            results.map(
              (candidate) => {
                const status =
                  requestStatuses[
                    candidate.id
                  ]

                const disabled =
                  sendingRequestId ===
                    candidate.id ||
                  status ===
                    "pending" ||
                  status ===
                    "accepted" ||
                  !candidate.contactVisible

                return (
                  <article
                    key={
                      candidate.id
                    }
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >

                    <div className="grid gap-6 lg:grid-cols-[300px_1fr_auto] lg:items-center">

                      <div className="flex items-center gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

                          {candidate.avatar ? (
                            <img
                              src={
                                candidate.avatar
                              }
                              alt="Profilbild"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl font-black text-slate-300">
                              {candidate.name
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>
                          )}

                        </div>

                        <div>

                          <h2 className="text-xl font-black">
                            {
                              candidate.name
                            }
                          </h2>

                          <p className="font-semibold">
                            {
                              candidate.profession
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              candidate.city ||
                              "Ort offen"
                            }{" "}
                            ·{" "}
                            {
                              candidate.experience
                            }{" "}
                            Jahre ·{" "}
                            {
                              candidate.employment
                            }
                            %
                          </p>

                        </div>

                      </div>

                      <div>

                        <div className="flex flex-wrap gap-2">

                          {candidate.skills
                            .slice(
                              0,
                              7
                            )
                            .map(
                              (
                                skill
                              ) => (
                                <span
                                  key={
                                    skill
                                  }
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}

                        </div>

                        <p className="mt-4 text-sm text-slate-500">
                          {candidate.reasons
                            .length >
                          0
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
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-slate-800"
                          >
                            Profil ansehen
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              sendContactRequest(
                                candidate.id
                              )
                            }
                            disabled={
                              disabled
                            }
                            className={`rounded-lg px-4 py-2.5 text-sm font-bold ${
                              status ===
                                "pending" ||
                              status ===
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

                        </div>

                      </div>

                    </div>

                  </article>
                )
              }
            )}

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
    </div>
  )
}
