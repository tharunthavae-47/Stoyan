"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Building2, LogOut, Mail, MapPin, Pencil, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  vorname?: string | null
  nachname?: string | null
  beruf?: string | null
  city?: string | null
  stadt?: string | null
}

type Company = {
  name?: string | null
  industry?: string | null
  city?: string | null
}

export default function KontoPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [role, setRole] = useState<"employee" | "employer" | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
        return
      }

      const currentRole = user.user_metadata?.role === "employer" ? "employer" : "employee"
      if (!active) return
      setUserEmail(user.email ?? "")
      setRole(currentRole)

      if (currentRole === "employer") {
        const { data } = await supabase
          .from("companies")
          .select("name,industry,city")
          .eq("owner_id", user.id)
          .maybeSingle()
        if (active) setCompany(data as Company | null)
      } else {
        const { data } = await supabase
          .from("employee_profiles")
          .select("vorname,nachname,beruf,city,stadt")
          .eq("id", user.id)
          .maybeSingle()
        if (active) setProfile(data as Profile | null)
      }

      if (active) setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  async function logout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return <main className="min-h-screen bg-slate-50 px-6 py-16"><div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">Konto wird geladen…</div></main>
  }

  const employeeName = [profile?.vorname, profile?.nachname].filter(Boolean).join(" ") || "Mein Profil"
  const companyName = company?.name || "Mein Unternehmen"

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" /> Zur Startseite
        </Link>

        <section className="mt-6 overflow-hidden rounded-[30px] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                {role === "employer" ? <Building2 className="h-8 w-8" /> : <UserRound className="h-8 w-8" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Mein Konto</p>
                <h1 className="mt-1 text-3xl font-black">{role === "employer" ? companyName : employeeName}</h1>
                <p className="mt-1 text-sm text-slate-300">{role === "employer" ? "Arbeitgeber" : "Arbeitnehmer"}</p>
              </div>
            </div>
            <button onClick={logout} disabled={loggingOut} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-bold text-white hover:bg-red-500/20 disabled:opacity-50">
              <LogOut className="h-4 w-4" /> {loggingOut ? "Abmelden…" : "Abmelden"}
            </button>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              {role === "employer" ? <Building2 className="h-5 w-5 text-blue-600" /> : <UserRound className="h-5 w-5 text-blue-600" />}
              <h2 className="font-black text-slate-950">Profildaten</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              {role === "employer" ? <>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unternehmen</p><p className="mt-1 font-bold">{companyName}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Branche</p><p className="mt-1">{company?.industry || "Nicht angegeben"}</p></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{company?.city || "Ort nicht angegeben"}</div>
              </> : <>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Name</p><p className="mt-1 font-bold">{employeeName}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Beruf</p><p className="mt-1">{profile?.beruf || "Nicht angegeben"}</p></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{profile?.city || profile?.stadt || "Ort nicht angegeben"}</div>
              </>}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-600" /><h2 className="font-black text-slate-950">Anmeldung</h2></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">E-Mail</p>
            <p className="mt-1 break-all font-semibold text-slate-900">{userEmail || "Keine E-Mail"}</p>
            <Link href={role === "employer" ? "/arbeitgeber/firma" : "/arbeitnehmer/profil"} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-600">
              <Pencil className="h-4 w-4" /> Profil bearbeiten
            </Link>
          </section>
        </div>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-black text-slate-950">Schnellzugriff</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={role === "employer" ? "/arbeitgeber" : "/arbeitnehmer"} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50">Dashboard</Link>
            <Link href={role === "employer" ? "/arbeitgeber/anfragen" : "/arbeitnehmer/anfragen"} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50">Kontaktanfragen & Chats</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
