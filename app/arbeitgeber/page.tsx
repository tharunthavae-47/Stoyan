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
  const [employees, setEmployees] = useState<Record<string, EmployeeProfile>>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

        // Unternehmen laden
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("name,industry,city")
          .eq("owner_id", user.id)
          .maybeSingle()

        if (companyError) {
          console.error("Unternehmen konnte nicht geladen werden:", companyError)
        }

        if (active) {
          setCompany(companyData || null)
        }

        // Kontaktanfragen laden
        const { data: requestData, error: requestError } = await supabase
          .from("contact_requests")
          .select("id,employer_id,employee_id,job_id,status,created_at")
          .eq("employer_id", user.id)
          .order("created_at", { ascending: false })

        if (requestError) {
          throw new Error(`Anfragen konnten nicht geladen werden: ${requestError.message}`)
        }

        const loadedRequests = requestData || []

        if (!active) return

        setRequests(loadedRequests)

        // Mitarbeiter-Profile laden
        const employeeIds = Array.from(
          new Set(loadedRequests.map((request) => request.employee_id)),
        )

        if (employeeIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from("employee_profiles")
            .select("id,vorname,nachname,beruf,city,stadt")
            .in("id", employeeIds)

          if (!profileError && profileData) {
            const profileMap: Record<string, EmployeeProfile> = {}
            profileData.forEach((profile) => {
              profileMap[profile.id] = profile
            })
            if (active) {
              setEmployees(profileMap)
            }
          } else if (profileError) {
            console.warn(
              "Mitarbeiterprofile konnten nicht geladen werden:",
              profileError.message,
            )
          }
        }
      } catch (err) {
        console.error(err)
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Das Dashboard konnte nicht geladen werden.",
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

  function getEmployeeName(employeeId: string) {
    const employee = employees[employeeId]
    if (!employee) return "Arbeitnehmer"
    const fullName = [employee.vorname, employee.nachname].filter(Boolean).join(" ")
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
    if (name === "Arbeitnehmer") return "A"
    const parts = name.split(" ")
    return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`.toUpperCase() || "A"
  }

  const pendingRequests = requests.filter((request) => request.status === "pending")
  const acceptedRequests = requests.filter((request) => request.status === "accepted")
  const rejectedRequests = requests.filter((request) => request.status === "rejected")

  if (loading) {
    return (
      <div className="card card-pad text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" />
        <p className="mt-5 font-semibold text-[var(--muted)]">Dashboard wird geladen…</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      {/* Kopf */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand)]">
            <Building2 className="h-4 w-4" />
            Arbeitgeber
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-[var(--navy)] sm:text-5xl">
            Mitarbeiter finden.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Suchen Sie nach Ihren Kriterien und entdecken Sie passende Arbeitnehmerprofile.
          </p>
        </div>

        <Link href="/arbeitgeber/suche" className="btn-primary shrink-0">
          <Search className="h-4 w-4" />
          Kandidaten suchen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Fehler */}
      {error && (
        <div className="mt-6 rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/8 p-4 text-sm font-semibold text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Statistiken */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">Alle Anfragen</p>
              <p className="mt-2 text-3xl font-black text-[var(--navy)]">{requests.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Send className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">Ausstehend</p>
              <p className="mt-2 text-3xl font-black text-[var(--navy)]">{pendingRequests.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">Angenommen</p>
              <p className="mt-2 text-3xl font-black text-[var(--navy)]">{acceptedRequests.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Check className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">Abgelehnt</p>
              <p className="mt-2 text-3xl font-black text-[var(--navy)]">{rejectedRequests.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <X className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Unternehmen */}
      <section className="card card-pad mt-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)] text-xl font-black text-white">
              {(company?.name || "O").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted-light)]">
                Unternehmen
              </p>
              <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                {company?.name || "Ihr Unternehmen"}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {company?.industry || "Branche noch nicht angegeben"}
                {company?.city ? ` · ${company.city}` : ""}
              </p>
            </div>
          </div>

          <Link href="/arbeitgeber/firma" className="btn-ghost">
            Unternehmensprofil bearbeiten
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Nächster Schritt */}
      <section className="hero-navy mt-6 !p-8 sm:!p-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
              Nächster Schritt
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em]">Kandidaten finden</h2>
            <p className="mt-3 max-w-2xl leading-7 text-blue-100/90">
              Beruf, Erfahrung, Skills, Ort, Pensum und weitere Kriterien eingeben und passende
              Arbeitnehmer entdecken.
            </p>
          </div>

          <Link
            href="/arbeitgeber/suche"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-[var(--navy)] transition hover:bg-slate-100"
          >
            Suche starten
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Anfragen & Nachrichten */}
      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand)]">
              Kommunikation
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[var(--navy)]">
              Anfragen &amp; Nachrichten
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Verwalten Sie Ihre Kontaktanfragen und chatten Sie mit angenommenen Kandidaten.
            </p>
          </div>

          {requests.length > 0 && (
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--muted-light)]">
              <Users className="h-4 w-4" />
              {requests.length} Anfrage{requests.length !== 1 ? "n" : ""}
            </div>
          )}
        </div>

        {/* Keine Anfragen */}
        {requests.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-[var(--line-strong)] bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
              Noch keine Kontaktanfragen
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
              Wenn Sie einen passenden Arbeitnehmer gefunden haben, können Sie über dessen Profil
              eine Kontaktanfrage senden.
            </p>
            <Link href="/arbeitgeber/suche" className="btn-primary mt-6 inline-flex">
              Kandidaten suchen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Anfragen */}
        {requests.length > 0 && (
          <div className="mt-6 space-y-3">
            {requests.map((request) => {
              const name = getEmployeeName(request.employee_id)
              const profession = getEmployeeProfession(request.employee_id)
              const location = getEmployeeLocation(request.employee_id)
              const initials = getInitials(request.employee_id)
              const isAccepted = request.status === "accepted"
              const isPending = request.status === "pending"
              const isRejected = request.status === "rejected"

              return (
                <div
                  key={request.id}
                  className="group rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-sm transition-all hover:border-[var(--line-strong)] hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-lg font-black text-white">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-[var(--navy)]">{name}</h3>

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

                      <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                        {profession}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted-light)]">
                        {location && <span>{location}</span>}
                        <span>
                          Anfrage vom{" "}
                          {new Date(request.created_at).toLocaleDateString("de-CH")}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      {isAccepted && (
                        <Link
                          href={`/arbeitgeber/anfragen/${request.id}`}
                          className="btn-primary"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat öffnen
                        </Link>
                      )}

                      {isPending && (
                        <Link
                          href={`/arbeitgeber/anfragen/${request.id}`}
                          className="btn-ghost"
                        >
                          Anfrage ansehen
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}

                      {isRejected && (
                        <Link
                          href={`/arbeitgeber/anfragen/${request.id}`}
                          className="btn-ghost"
                        >
                          Anfrage ansehen
                          <ArrowRight className="ml-2 h-4 w-4" />
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
  )
}
