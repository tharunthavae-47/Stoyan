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

  if(loading)return <div className="card card-pad text-[var(--muted)]">Profil wird geladen…</div>
  if(!employee)return <div className="card card-pad"><h1 className="text-2xl font-black text-[var(--navy)]">Profil nicht verfügbar</h1><Link href="/arbeitgeber/suche" className="mt-4 inline-block font-bold text-[var(--brand)]">← Zurück zur Suche</Link></div>

  return <div className="animate-fade-up"><div className="mx-auto max-w-6xl"><section className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl"><div className="flex flex-col gap-7 sm:flex-row sm:items-center"><div className="h-32 w-32 overflow-hidden rounded-3xl bg-white/10">{profile?.avatar_url?<img src={profile.avatar_url} alt="Profilbild" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-5xl font-black">{(profile?.first_name||"K").charAt(0)}</div>}</div><div><p className="text-xs font-bold uppercase tracking-widest text-blue-300">Arbeitnehmerprofil</p><h1 className="mt-2 text-4xl font-black">{profile?.first_name||"Kandidat"} {profile?.last_name||""}</h1><p className="mt-2 text-xl font-semibold text-slate-300">{employee.profession||"Beruf nicht angegeben"}</p><p className="mt-1 text-slate-400">{profile?.city||"Ort offen"} · {employee.years_experience||0} Jahre Erfahrung</p></div></div></section><div className="mt-6 grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><section className="rounded-3xl border bg-white p-7 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Profil</p><h2 className="mt-2 text-2xl font-black">{employee.headline||"Berufliches Profil"}</h2><p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{employee.bio||"Keine Beschreibung hinterlegt."}</p></section><section className="rounded-3xl border bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">Ausbildung & Erfahrung</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Ausbildung</p><p className="mt-1 font-bold">{employee.education||"–"}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Berufserfahrung</p><p className="mt-1 font-bold">{employee.years_experience||0} Jahre</p></div></div></section><section className="rounded-3xl border bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">Skills & Sprachen</h2><div className="mt-5 flex flex-wrap gap-2">{(employee.skills||[]).map((s:string)=><span key={s} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">{s}</span>)}</div></section></div><aside className="h-fit rounded-3xl border bg-white p-7 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Arbeitswünsche</p><div className="mt-5"><p className="text-slate-400">Pensum</p><p className="font-bold">{employee.desired_employment_percent||100} %</p></div><div className="mt-7 border-t pt-6"><p className="font-black">Kontaktanfrage</p><p className="mt-1 text-sm text-slate-500">{employee.contact_visible?"Dieser Arbeitnehmer erlaubt Kontaktanfragen.":"Dieser Arbeitnehmer hat Kontaktanfragen deaktiviert."}</p>{employee.contact_visible&&<><textarea value={contactMessage} onChange={e=>setContactMessage(e.target.value)} rows={4} className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"/><button disabled={sending} onClick={sendContact} className="mt-3 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50">{sending?"Wird gesendet…":"Kontaktanfrage senden"}</button></>}{message&&<p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</p>}</div></aside></div></div></div>
}
