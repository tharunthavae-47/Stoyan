"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  MessageCircle,
  Search,
  Send,
  Users,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Company = {
  name: string | null
  industry: string | null
  city: string | null
}

type ContactRequest = {
  id: string
  employer_id: string
  employee_id: string
  job_id: string | null
  status: string
  created_at: string
}

type EmployeeProfile = {
  id: string
  vorname?: string | null
  nachname?: string | null
  beruf?: string | null
  city?: string | null
  stadt?: string | null
}

export default function ArbeitgeberPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [employees, setEmployees] = useState<
    Record<string, EmployeeProfile>
  >({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError("")

      try {
        const supabase = createClient()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(userError.message)
        }

        if (!user) {
          window.location.href = "/login"
          return
        }

        if (!active) return

        setUserId(user.id)

        /*
         * =====================================================
         * UNTERNEHMEN LADEN
         * =====================================================
         */

        const { data: companyData, error: companyError } =
          await supabase
            .from("companies")
            .select("name,industry,city")
            .eq("owner_id", user.id)
            .maybeSingle()

        if (companyError) {
          console.error(
            "Unternehmen konnte nicht geladen werden:",
            companyError
          )
        }

        if (active) {
          setCompany(companyData || null)
        }

        /*
         * =====================================================
         * KONTAKTANFRAGEN LADEN
         * =====================================================
         */

        const { data: requestData, error: requestError } =
          await supabase
            .from("contact_requests")
            .select(
              "id,employer_id,employee_id,job_id,status,created_at"
            )
            .eq("employer_id", user.id)
            .order("created_at", {
              ascending: false,
            })

        if (requestError) {
          throw new Error(
            `Anfragen konnten nicht geladen werden: ${requestError.message}`
          )
        }

        const loadedRequests = requestData || []

        if (!active) return

        setRequests(loadedRequests)

        /*
         * =====================================================
         * MITARBEITER-PROFILE LADEN
         *
         * Die Abfrage versucht zuerst die Tabelle
         * employee_profiles.
         * Falls deine Profile anders aufgebaut sind,
         * bleibt die Seite trotzdem funktionsfähig.
         * =====================================================
         */

        const employeeIds = Array.from(
          new Set(
            loadedRequests.map(
              (request) => request.employee_id
            )
          )
        )

        if (employeeIds.length > 0) {
          const { data: profileData, error: profileError } =
            await supabase
              .from("employee_profiles")
              .select(
                "id,vorname,nachname,beruf,city,stadt"
              )
              .in("id", employeeIds)

          if (!profileError && profileData) {
            const profileMap: Record<
              string,
              EmployeeProfile
            > = {}

            profileData.forEach((profile) => {
              profileMap[profile.id] = profile
            })

            if (active) {
              setEmployees(profileMap)
            }
          } else if (profileError) {
            console.warn(
              "Mitarbeiterprofile konnten nicht geladen werden:",
              profileError.message
            )
          }
        }
      } catch (err) {
        console.error(err)

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Das Dashboard konnte nicht geladen werden."
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  /*
   * =====================================================
   * HILFSFUNKTIONEN
   * =====================================================
   */

  function getEmployeeName(employeeId: string) {
    const employee = employees[employeeId]

    if (!employee) {
      return "Arbeitnehmer"
    }

    const fullName = [
      employee.vorname,
      employee.nachname,
    ]
      .filter(Boolean)
      .join(" ")

    return fullName || "Arbeitnehmer"
  }

  function getEmployeeProfession(employeeId: string) {
    const employee = employees[employeeId]

    return employee?.beruf || "Beruf nicht angegeben"
  }

  function getEmployeeLocation(employeeId: string) {
    const employee = employees[employeeId]

    return employee?.city || employee?.stadt || null
  }

  function getInitials(employeeId: string) {
    const name = getEmployeeName(employeeId)

    if (name === "Arbeitnehmer") {
      return "A"
    }

    const parts = name.split(" ")

    return (
      `${parts[0]?.charAt(0) || ""}${
        parts[1]?.charAt(0) || ""
      }`.toUpperCase() || "A"
    )
  }

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  )

  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted"
  )

  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected"
  )

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fc]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-5 font-semibold text-slate-500">
              Dashboard wird geladen…
            </p>
          </div>
        </div>
      </main>
    )
  }

  /*
   * =====================================================
   * DASHBOARD
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">

      {/* =================================================
          TOP
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <Building2 className="h-4 w-4" />
                Arbeitgeber
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                Mitarbeiter finden.
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                Suchen Sie nach Ihren Kriterien und entdecken
                Sie passende Arbeitnehmerprofile.
              </p>

            </div>

            <Link
              href="/arbeitgeber/suche"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-lg shadow-slate-950/10 transition-all hover:-translate-y-0.5 hover:bg-blue-600"
            >
              <Search className="h-4 w-4" />
              Kandidaten suchen
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            STATISTIKEN
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Alle Anfragen
                </p>

                <p className="mt-2 text-3xl font-black">
                  {requests.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Send className="h-5 w-5" />
              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Ausstehend
                </p>

                <p className="mt-2 text-3xl font-black">
                  {pendingRequests.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Angenommen
                </p>

                <p className="mt-2 text-3xl font-black">
                  {acceptedRequests.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Check className="h-5 w-5" />
              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Abgelehnt
                </p>

                <p className="mt-2 text-3xl font-black">
                  {rejectedRequests.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <X className="h-5 w-5" />
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            UNTERNEHMEN
        ================================================= */}

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
                {(company?.name || "O")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Unternehmen
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {company?.name || "Ihr Unternehmen"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {company?.industry ||
                    "Branche noch nicht angegeben"}

                  {company?.city
                    ? ` · ${company.city}`
                    : ""}
                </p>

              </div>

            </div>

            <Link
              href="/arbeitgeber/firma"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Unternehmensprofil bearbeiten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

          </div>

        </section>

        {/* =================================================
            NÄCHSTER SCHRITT
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-[30px] bg-slate-950 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                Nächster Schritt
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.035em]">
                Kandidaten finden
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Beruf, Erfahrung, Skills, Ort, Pensum und
                weitere Kriterien eingeben und passende
                Arbeitnehmer entdecken.
              </p>

            </div>

            <Link
              href="/arbeitgeber/suche"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-500"
            >
              Suche starten
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </section>

        {/* =================================================
            ANFRAGEN & NACHRICHTEN
        ================================================= */}

        <section className="mt-10">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Kommunikation
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">
                Anfragen & Nachrichten
              </h2>

              <p className="mt-2 text-slate-500">
                Verwalten Sie Ihre Kontaktanfragen und
                chatten Sie mit angenommenen Kandidaten.
              </p>

            </div>

            {requests.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                <Users className="h-4 w-4" />
                {requests.length} Anfrage
                {requests.length !== 1 ? "n" : ""}
              </div>
            )}

          </div>

          {/* KEINE ANFRAGEN */}

          {requests.length === 0 && (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MessageCircle className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Noch keine Kontaktanfragen
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Wenn Sie einen passenden Arbeitnehmer
                gefunden haben, können Sie über dessen Profil
                eine Kontaktanfrage senden.
              </p>

              <Link
                href="/arbeitgeber/suche"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Kandidaten suchen
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          )}

          {/* ANFRAGEN */}

          {requests.length > 0 && (
            <div className="mt-6 space-y-3">

              {requests.map((request) => {

                const name = getEmployeeName(
                  request.employee_id
                )

                const profession =
                  getEmployeeProfession(
                    request.employee_id
                  )

                const location =
                  getEmployeeLocation(
                    request.employee_id
                  )

                const initials =
                  getInitials(request.employee_id)

                const isAccepted =
                  request.status === "accepted"

                const isPending =
                  request.status === "pending"

                const isRejected =
                  request.status === "rejected"

                return (
                  <div
                    key={request.id}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                  >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                      {/* AVATAR */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                        {initials}
                      </div>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-black">
                            {name}
                          </h3>

                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                              <Check className="h-3 w-3" />
                              Angenommen
                            </span>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700">
                              <Clock3 className="h-3 w-3" />
                              Ausstehend
                            </span>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-red-600">
                              <X className="h-3 w-3" />
                              Abgelehnt
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {profession}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">

                          {location && (
                            <span>{location}</span>
                          )}

                          <span>
                            Anfrage vom{" "}
                            {new Date(
                              request.created_at
                            ).toLocaleDateString(
                              "de-CH"
                            )}
                          </span>

                        </div>

                      </div>

                      {/* ACTION */}

                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">

                        {isAccepted && (
                          <Link
                            href={`/arbeitgeber/anfragen/${request.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Chat öffnen
                          </Link>
                        )}

                        {isPending && (
                          <Link
                            href={`/arbeitgeber/anfragen/${request.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Anfrage ansehen
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}

                        {isRejected && (
                          <Link
                            href={`/arbeitgeber/anfragen/${request.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                          >
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

        </section>

      </div>

    </main>
  )
}
