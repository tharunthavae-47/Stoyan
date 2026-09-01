"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Building2, CheckCircle2, LogOut, Mail, MapPin, Pencil, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  city?: string | null
  postal_code?: string | null
}

type EmployeeProfile = {
  profession?: string | null
  headline?: string | null
  bio?: string | null
  education?: string | null
  years_experience?: number | null
  desired_salary_min?: number | null
  desired_salary_max?: number | null
  desired_employment_percent?: number | null
  preferred_radius_km?: number | null
  available_from?: string | null
  remote_ok?: boolean | null
  shift_work_ok?: boolean | null
  driving_license_b?: boolean | null
  skills?: string[] | null
  languages?: string[] | null
  profile_visible?: boolean | null
  contact_visible?: boolean | null
}

type Company = { name?: string | null; industry?: string | null; city?: string | null }

function value(v: unknown, fallback = "Nicht angegeben") {
  if (v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return fallback
  if (Array.isArray(v)) return v.join(", ")
  return String(v)
}

export default function KontoPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [role, setRole] = useState<"employee" | "employer" | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = "/login"; return }
      const currentRole = user.user_metadata?.role === "employer" ? "employer" : "employee"
      if (!active) return
      setUserEmail(user.email ?? "")
      setRole(currentRole)

      if (currentRole === "employer") {
        const { data } = await supabase.from("companies").select("name,industry,city").eq("owner_id", user.id).maybeSingle()
        if (active) setCompany(data as Company | null)
      } else {
        const [{ data: p }, { data: ep }] = await Promise.all([
          supabase.from("profiles").select("first_name,last_name,phone,city,postal_code").eq("id", user.id).maybeSingle(),
          supabase.from("employee_profiles").select("profession,headline,bio,education,years_experience,desired_salary_min,desired_salary_max,desired_employment_percent,preferred_radius_km,available_from,remote_ok,shift_work_ok,driving_license_b,skills,languages,profile_visible,contact_visible").eq("id", user.id).maybeSingle(),
        ])
        if (active) { setProfile(p as Profile | null); setEmployeeProfile(ep as EmployeeProfile | null) }
      }
      if (active) setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [])

  async function logout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) return <main className="min-h-screen bg-slate-50 px-6 py-16"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-sm">Konto wird geladen…</div></main>

  const employeeName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Mein Profil"
  const companyName = company?.name || "Mein Unternehmen"
  const chatHref = role === "employer" ? "/arbeitgeber/anfragen" : "/arbeitnehmer/anfragen"
  const dashboardHref = role === "employer" ? "/arbeitgeber" : "/arbeitnehmer"
  const editHref = role === "employer" ? "/arbeitgeber/firma" : "/arbeitnehmer/profil"

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Zur Startseite</Link>

        <section className="mt-6 overflow-hidden rounded-[30px] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">{role === "employer" ? <Building2 className="h-8 w-8" /> : <UserRound className="h-8 w-8" />}</div>
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Mein Konto</p><h1 className="mt-1 text-3xl font-black">{role === "employer" ? companyName : employeeName}</h1><p className="mt-1 text-sm text-slate-300">{role === "employer" ? "Arbeitgeber" : "Arbeitnehmer"}</p></div>
            </div>
            <button onClick={logout} disabled={loggingOut} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-bold text-white hover:bg-red-500/20 disabled:opacity-50"><LogOut className="h-4 w-4" /> {loggingOut ? "Abmelden…" : "Abmelden"}</button>
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-blue-600" /><h2 className="font-black text-slate-950">Profildaten</h2></div><Link href={editHref} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600"><Pencil className="h-4 w-4" /> Bearbeiten</Link></div>

            {role === "employer" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="label-account">Unternehmen</p><p className="account-value">{companyName}</p></div>
                <div><p className="label-account">Branche</p><p className="account-value">{value(company?.industry)}</p></div>
                <div><p className="label-account">Ort</p><p className="account-value">{value(company?.city)}</p></div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="label-account">Vorname</p><p className="account-value">{value(profile?.first_name)}</p></div>
                <div><p className="label-account">Nachname</p><p className="account-value">{value(profile?.last_name)}</p></div>
                <div><p className="label-account">Telefon</p><p className="account-value">{value(profile?.phone)}</p></div>
                <div><p className="label-account">Ort / PLZ</p><p className="account-value">{value([profile?.postal_code, profile?.city].filter(Boolean).join(" "))}</p></div>
                <div><p className="label-account">Beruf</p><p className="account-value">{value(employeeProfile?.profession)}</p></div>
                <div><p className="label-account">Ausbildung</p><p className="account-value">{value(employeeProfile?.education)}</p></div>
                <div className="sm:col-span-2"><p className="label-account">Profil-Überschrift</p><p className="account-value">{value(employeeProfile?.headline)}</p></div>
                <div><p className="label-account">Berufserfahrung</p><p className="account-value">{employeeProfile?.years_experience != null ? `${employeeProfile.years_experience} Jahre` : "Nicht angegeben"}</p></div>
                <div><p className="label-account">Verfügbar ab</p><p className="account-value">{value(employeeProfile?.available_from)}</p></div>
                <div><p className="label-account">Wunschlohn</p><p className="account-value">{employeeProfile?.desired_salary_min || employeeProfile?.desired_salary_max ? `${employeeProfile.desired_salary_min || "–"} – ${employeeProfile.desired_salary_max || "–"} CHF` : "Nicht angegeben"}</p></div>
                <div><p className="label-account">Gewünschtes Pensum</p><p className="account-value">{employeeProfile?.desired_employment_percent != null ? `${employeeProfile.desired_employment_percent} %` : "Nicht angegeben"}</p></div>
                <div><p className="label-account">Suchradius</p><p className="account-value">{employeeProfile?.preferred_radius_km != null ? `${employeeProfile.preferred_radius_km} km` : "Nicht angegeben"}</p></div>
                <div><p className="label-account">Skills</p><p className="account-value">{value(employeeProfile?.skills)}</p></div>
                <div><p className="label-account">Sprachen</p><p className="account-value">{value(employeeProfile?.languages)}</p></div>
                <div className="sm:col-span-2"><p className="label-account">Über mich</p><p className="account-value whitespace-pre-line">{value(employeeProfile?.bio)}</p></div>
                <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">{[[employeeProfile?.remote_ok, "Homeoffice"],[employeeProfile?.shift_work_ok, "Schichtarbeit"],[employeeProfile?.driving_license_b, "Führerschein B"],[employeeProfile?.profile_visible, "Profil sichtbar"],[employeeProfile?.contact_visible, "Kontaktaufnahme erlaubt"]].map(([enabled, label]) => <span key={String(label)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}><CheckCircle2 className="h-3.5 w-3.5" />{label}: {enabled ? "Ja" : "Nein"}</span>)}</div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-600" /><h2 className="font-black text-slate-950">Anmeldung</h2></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">E-Mail</p><p className="mt-1 break-all font-semibold text-slate-900">{userEmail || "Keine E-Mail"}</p>
            <div className="mt-8 space-y-3"><Link href={editHref} className="btn-primary w-full justify-center"><Pencil className="h-4 w-4" /> Profildaten bearbeiten</Link><Link href={chatHref} className="btn-ghost w-full justify-center"><Mail className="h-4 w-4" /> Kontaktanfragen & Chats</Link><Link href={dashboardHref} className="btn-ghost w-full justify-center">Dashboard</Link></div>
          </section>
        </div>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3 text-sm font-semibold text-slate-600"><MapPin className="h-4 w-4" /> {role === "employer" ? value(company?.city, "Kein Unternehmensstandort hinterlegt") : value(profile?.city, "Kein Wohnort hinterlegt")}</div></section>
      </div>
      <style jsx global>{`.label-account{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8}.account-value{margin-top:.25rem;font-weight:700;color:#0f172a;line-height:1.5}`}</style>
    </main>
  )
}
