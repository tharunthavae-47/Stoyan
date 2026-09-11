"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Employee = Record<string, any>
type Profile = { first_name?: string; last_name?: string; city?: string; avatar_url?: string }

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [contactMessage, setContactMessage] = useState("Hallo, wir sind auf dein Profil aufmerksam geworden und würden dich gerne kennenlernen.")

  useEffect(() => { (async () => { const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){window.location.href="/login";return} const e=await s.from("employee_profiles").select("id,profession,education,years_experience,skills,headline,bio,desired_employment_percent,profile_visible,contact_visible").eq("id",id).eq("profile_visible",true).maybeSingle(); if(!e.data){setLoading(false);return} const p=await s.from("profiles").select("first_name,last_name,city,avatar_url").eq("id",id).maybeSingle(); setEmployee(e.data); setProfile(p.data); setLoading(false) })() }, [id])

  async function sendContact() {
    if (!employee || !employee.contact_visible) return
    setSending(true); setMessage("")
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){window.location.href="/login";return}
    const {data: own}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle()
    if(own?.role!=="employer"){setMessage("Nur Arbeitgeber können Kontaktanfragen senden.");setSending(false);return}
    const {data:existing}=await s.from("contact_requests").select("id,status").eq("employer_id",user.id).eq("employee_id",id).in("status",["pending","accepted"]).maybeSingle()
    if(existing){setMessage("Für diesen Kandidaten besteht bereits eine Kontaktanfrage.");setSending(false);return}
    const {data:req,error}=await s.from("contact_requests").insert({employer_id:user.id,employee_id:id,status:"pending"}).select("id").single()
    if(error||!req){setMessage(error?.message||"Kontaktanfrage konnte nicht gesendet werden.");setSending(false);return}
    const {error:msgError}=await s.from("messages").insert({sender_id:user.id,recipient_id:id,contact_request_id:req.id,body:contactMessage.trim()||"Hallo, wir möchten gerne Kontakt mit dir aufnehmen."})
    setMessage(msgError?`Kontaktanfrage wurde erstellt. Nachricht konnte nicht gesendet werden: ${msgError.message}`:"Kontaktanfrage erfolgreich gesendet."); setSending(false)
  }

  if (loading) return <div className="ed-card ed-card-pad text-[var(--muted)]">Profil wird geladen…</div>
  if (!employee) return <div className="ed-card ed-card-pad"><h1 className="text-2xl font-light tracking-tight text-[var(--navy)]">Profil nicht verfügbar</h1><Link href="/arbeitgeber/suche" className="mt-4 inline-block font-medium text-[var(--brand)]">← Zurück zur Suche</Link></div>

  const skills: string[] = Array.isArray(employee.skills) ? employee.skills.filter((s: unknown): s is string => typeof s === "string") : []

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-6xl">
        <Link href="/arbeitgeber/suche" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--navy)]">← Zurück zur Suche</Link>

        <section className="mt-4 overflow-hidden rounded-[6px] bg-[var(--navy)] p-8 text-white sm:p-10">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[6px] bg-white/10">
              {profile?.avatar_url ? <img src={profile.avatar_url || "/placeholder.svg"} alt="Profilbild" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-5xl font-light">{(profile?.first_name || "K").charAt(0)}</div>}
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-blue-300">Arbeitnehmerprofil</p>
              <h1 className="mt-2 text-4xl font-light tracking-[-0.02em]">{profile?.first_name || "Kandidat"} {profile?.last_name || ""}</h1>
              <p className="mt-2 text-xl font-normal text-slate-300">{employee.profession || "Beruf nicht angegeben"}</p>
              <p className="mt-1 text-slate-400">{profile?.city || "Ort offen"} · {employee.years_experience || 0} Jahre Erfahrung</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="ed-card ed-card-pad">
              <p className="ed-eyebrow">Profil</p>
              <h2 className="mt-3 text-2xl font-light tracking-tight text-[var(--navy)]">{employee.headline || "Berufliches Profil"}</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--muted)]">{employee.bio || "Keine Beschreibung hinterlegt."}</p>
            </section>

            <section className="ed-card ed-card-pad">
              <h2 className="text-2xl font-light tracking-tight text-[var(--navy)]">Ausbildung &amp; Erfahrung</h2>
              <div className="mt-5 grid gap-px overflow-hidden rounded-[4px] border border-[#e2e7ee] bg-[#e2e7ee] sm:grid-cols-2">
                <div className="bg-white p-4"><p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Ausbildung</p><p className="mt-1 font-medium text-[var(--navy)]">{employee.education || "–"}</p></div>
                <div className="bg-white p-4"><p className="text-[0.66rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Berufserfahrung</p><p className="mt-1 font-medium text-[var(--navy)]">{employee.years_experience || 0} Jahre</p></div>
              </div>
            </section>

            {skills.length > 0 && (
              <section className="ed-card ed-card-pad">
                <h2 className="text-2xl font-light tracking-tight text-[var(--navy)]">Fähigkeiten</h2>
                <div className="mt-5 flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="ed-chip">{s}</span>)}</div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="ed-card ed-card-pad">
              <p className="ed-eyebrow">Arbeitswunsch</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--muted-light)]">Pensum</span><span className="font-medium text-[var(--navy)]">{employee.desired_employment_percent ?? 100} %</span></div>
                <div className="flex items-center justify-between border-t border-[#e2e7ee] pt-3"><span className="text-[var(--muted-light)]">Erfahrung</span><span className="font-medium text-[var(--navy)]">{employee.years_experience || 0} Jahre</span></div>
              </div>
            </section>

            <section className="ed-card ed-card-pad">
              <p className="ed-eyebrow">Kontakt aufnehmen</p>
              <h2 className="mt-3 text-lg font-normal tracking-tight text-[var(--navy)]">Kontaktanfrage senden</h2>
              {employee.contact_visible ? (
                <>
                  <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={4} maxLength={2000} className="ed-input mt-4 resize-none text-sm" />
                  <button type="button" onClick={() => void sendContact()} disabled={sending} className="ed-btn-primary mt-4 w-full justify-center">{sending ? "Wird gesendet…" : "Kontaktanfrage senden"}</button>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--muted-light)]">Die Kontaktdaten des Kandidaten werden erst nach dessen Zustimmung freigegeben.</p>
                </>
              ) : (
                <p className="mt-4 border-l-2 border-l-[var(--line-strong)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">Dieser Kandidat möchte aktuell nicht kontaktiert werden.</p>
              )}
              {message && <p className="mt-4 border-l-2 border-l-[var(--brand)] bg-[var(--brand-soft)] p-3 text-sm font-medium text-[var(--navy)]">{message}</p>}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
