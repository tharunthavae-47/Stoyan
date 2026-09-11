"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Form = { first_name:string; last_name:string; phone:string; city:string; postal_code:string; profession:string; headline:string; bio:string; education:string; years_experience:string; desired_salary_min:string; desired_salary_max:string; desired_employment_percent:string; preferred_radius_km:string; available_from:string; remote_ok:boolean; shift_work_ok:boolean; driving_license_b:boolean; skills:string; languages:string; profile_visible:boolean; contact_visible:boolean }

const EDUCATION_LEVELS = ["Keine Ausbildung","EBA","EFZ","Berufsmaturität","Matura","HF","FH / Bachelor","Universität / Master","Doktorat","Andere"] as const

const initial:Form = {first_name:"",last_name:"",phone:"",city:"",postal_code:"",profession:"",headline:"",bio:"",education:"",years_experience:"",desired_salary_min:"",desired_salary_max:"",desired_employment_percent:"100",preferred_radius_km:"30",available_from:"",remote_ok:false,shift_work_ok:false,driving_license_b:false,skills:"",languages:"",profile_visible:true,contact_visible:false}

export default function EmployeeProfilePage(){
  const [form,setForm]=useState(initial); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [notice,setNotice]=useState(""); const [avatar,setAvatar]=useState<File|null>(null)
  useEffect(()=>{(async()=>{const supabase=createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user){window.location.href="/login";return}; const [{data:p},{data:e}]=await Promise.all([supabase.from("profiles").select("first_name,last_name,phone,city,postal_code").eq("id",user.id).maybeSingle(),supabase.from("employee_profiles").select("profession,headline,bio,education,years_experience,desired_salary_min,desired_salary_max,desired_employment_percent,preferred_radius_km,available_from,remote_ok,shift_work_ok,driving_license_b,skills,languages,profile_visible,contact_visible").eq("id",user.id).maybeSingle()]); setForm({...initial,...p,...e,years_experience:e?.years_experience?.toString()??"",desired_salary_min:e?.desired_salary_min?.toString()??"",desired_salary_max:e?.desired_salary_max?.toString()??"",desired_employment_percent:e?.desired_employment_percent?.toString()??"100",preferred_radius_km:e?.preferred_radius_km?.toString()??"30",skills:e?.skills?.join(", ")??"",languages:e?.languages?.join(", ")??"",available_from:e?.available_from??""}); setLoading(false)})()},[])
  const set=(k:keyof Form,v:string|boolean)=>setForm(x=>({...x,[k]:v}))
  async function save(e:React.FormEvent){e.preventDefault();setSaving(true);setNotice("");const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/login";return}
    let avatar_url: string|undefined
    if(avatar){const ext=avatar.name.split(".").pop()?.toLowerCase()||"jpg";const path=`${user.id}/avatar.${ext}`;const up=await supabase.storage.from("employee-media").upload(path,avatar,{upsert:true,contentType:avatar.type});if(up.error){setNotice(up.error.message);setSaving(false);return}const {data}=supabase.storage.from("employee-media").getPublicUrl(path);avatar_url=data.publicUrl}
    const profile={id:user.id,first_name:form.first_name||null,last_name:form.last_name||null,email:user.email??null,phone:form.phone||null,city:form.city||null,postal_code:form.postal_code||null,...(avatar_url?{avatar_url}:{})}; const employee={id:user.id,profession:form.profession||null,headline:form.headline||null,bio:form.bio||null,education:form.education||null,years_experience:form.years_experience?Number(form.years_experience):0,desired_salary_min:form.desired_salary_min?Number(form.desired_salary_min):null,desired_salary_max:form.desired_salary_max?Number(form.desired_salary_max):null,desired_employment_percent:Number(form.desired_employment_percent)||100,preferred_radius_km:Number(form.preferred_radius_km)||30,available_from:form.available_from||null,remote_ok:form.remote_ok,shift_work_ok:form.shift_work_ok,driving_license_b:form.driving_license_b,skills:form.skills.split(",").map(x=>x.trim()).filter(Boolean),languages:form.languages.split(",").map(x=>x.trim()).filter(Boolean),profile_visible:form.profile_visible,contact_visible:form.contact_visible}; const a=await supabase.from("profiles").upsert(profile); const b=await supabase.from("employee_profiles").upsert(employee); if(a.error||b.error)setNotice(a.error?.message||b.error?.message||"Speichern fehlgeschlagen"); else setNotice("Profil erfolgreich gespeichert."); setSaving(false)
  }
  if(loading)return <div className="text-[#576373]">Profil wird geladen…</div>
  return <div className="mx-auto max-w-4xl text-[#14243a]">
    <div>
      <p className="ed-eyebrow mb-4">MEIN PROFIL</p>
      <h1 className="text-[clamp(2rem,3.2vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.05em]">Präsentiere dich professionell.</h1>
      <p className="mt-4 max-w-[560px] text-[1rem] leading-[1.8] text-[#576373]">Je vollständiger dein Profil ist, desto besser können passende Arbeitgeber dich einschätzen.</p>
    </div>
    <form onSubmit={save} className="mt-12 grid gap-12">
      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Persönliche Daten</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {[["first_name","Vorname"],["last_name","Nachname"],["phone","Telefon"],["city","Ort"],["postal_code","PLZ"]].map(([k,l])=>
            <label key={k} className="grid gap-2"><span className="ed-label">{l}</span><input value={form[k as keyof Form] as string} onChange={e=>set(k as keyof Form,e.target.value)} className="ed-input"/></label>
          )}
          <label className="grid gap-2"><span className="ed-label">Profilbild</span><input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0]??null)} className="ed-input file:mr-3 file:rounded-[3px] file:border-0 file:bg-[#eef2f8] file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-medium file:text-[#2356d8]"/></label>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Berufliche Präsentation</h2>
        <div className="grid gap-5">
          <label className="grid gap-2"><span className="ed-label">Beruf</span><div className="flex flex-col gap-4 sm:flex-row"><input value={form.profession} onChange={e=>set("profession",e.target.value)} placeholder="z. B. Automobil-Mechatroniker" className="ed-input"/><select value={form.education} onChange={e=>set("education",e.target.value)} className="ed-input bg-white sm:max-w-xs"><option value="">Ausbildungsabschluss</option>{EDUCATION_LEVELS.map(level=><option key={level} value={level}>{level}</option>)}</select></div></label>
          <label className="grid gap-2"><span className="ed-label">Profil-Überschrift</span><input value={form.headline} onChange={e=>set("headline",e.target.value)} placeholder="z. B. Erfahrener Mechatroniker mit Schwerpunkt Diagnose" className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Über mich</span><textarea value={form.bio} onChange={e=>set("bio",e.target.value)} rows={5} placeholder="Beschreibe dich, deine Stärken und deine beruflichen Ziele…" className="ed-input"/></label>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Ausbildung &amp; Erfahrung</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 sm:col-span-2"><span className="ed-label">Ausbildungsabschluss</span><select value={form.education} onChange={e=>set("education",e.target.value)} className="ed-input bg-white"><option value="">Bitte auswählen</option>{EDUCATION_LEVELS.map(level=><option key={level} value={level}>{level}</option>)}</select></label>
          <label className="grid gap-2"><span className="ed-label">Berufserfahrung (Jahre)</span><input type="number" min="0" step="0.5" value={form.years_experience} onChange={e=>set("years_experience",e.target.value)} className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Verfügbar ab</span><input type="date" value={form.available_from} onChange={e=>set("available_from",e.target.value)} className="ed-input"/></label>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Skills &amp; Sprachen</h2>
        <div className="grid gap-5">
          <label className="grid gap-2"><span className="ed-label">Skills <span className="font-normal text-[#98a4b3]">(mit Komma trennen)</span></span><input value={form.skills} onChange={e=>set("skills",e.target.value)} placeholder="Diagnose, BMW, MFK, Reparatur" className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Sprachen <span className="font-normal text-[#98a4b3]">(mit Komma trennen)</span></span><input value={form.languages} onChange={e=>set("languages",e.target.value)} placeholder="Deutsch B2, Englisch B1" className="ed-input"/></label>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Deine Arbeitswünsche</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2"><span className="ed-label">Wunschlohn ab</span><input type="number" value={form.desired_salary_min} onChange={e=>set("desired_salary_min",e.target.value)} placeholder="CHF" className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Wunschlohn bis</span><input type="number" value={form.desired_salary_max} onChange={e=>set("desired_salary_max",e.target.value)} placeholder="CHF" className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Gewünschtes Pensum</span><input type="number" min="10" max="100" value={form.desired_employment_percent} onChange={e=>set("desired_employment_percent",e.target.value)} className="ed-input"/></label>
          <label className="grid gap-2"><span className="ed-label">Max. Entfernung (km)</span><input type="number" min="1" value={form.preferred_radius_km} onChange={e=>set("preferred_radius_km",e.target.value)} className="ed-input"/></label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[["remote_ok","Homeoffice möglich"],["shift_work_ok","Schichtarbeit möglich"],["driving_license_b","Führerschein B"]].map(([k,l])=>
            <label key={k} className="flex items-center gap-3 border border-[#dfe4ea] p-4 text-[0.875rem] font-medium"><input type="checkbox" checked={Boolean(form[k as keyof Form])} onChange={e=>set(k as keyof Form,e.target.checked)} className="h-4 w-4 accent-[#2356d8]"/>{l}</label>
          )}
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Sichtbarkeit</h2>
        <div className="grid gap-3">
          <label className="flex items-start gap-3 border border-[#dfe4ea] bg-[#f7f9fc] p-4"><input type="checkbox" checked={form.profile_visible} onChange={e=>set("profile_visible",e.target.checked)} className="mt-1 h-4 w-4 accent-[#2356d8]"/><span><b className="font-semibold">Mein Profil für passende Arbeitgeber sichtbar machen</b><small className="mt-1 block text-[0.8125rem] leading-[1.6] text-[#687384]">Dein Profil kann in passenden Suchergebnissen erscheinen.</small></span></label>
          <label className="flex items-start gap-3 border border-[#dfe4ea] bg-[#f7f9fc] p-4"><input type="checkbox" checked={form.contact_visible} onChange={e=>set("contact_visible",e.target.checked)} className="mt-1 h-4 w-4 accent-[#2356d8]"/><span><b className="font-semibold">Kontaktaufnahme erlauben</b><small className="mt-1 block text-[0.8125rem] leading-[1.6] text-[#687384]">Arbeitgeber können dir über Stoyan eine Kontaktanfrage senden.</small></span></label>
        </div>
      </section>

      {notice&&<div className="border-l-2 border-[#2356d8] bg-[#eef3fd] px-4 py-3 text-[0.875rem] font-medium text-[#1844b6]">{notice}</div>}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#dbe1e9] pt-6">
        <Link href="/arbeitnehmer" className="ed-btn-ghost">Abbrechen</Link>
        <button disabled={saving} className="ed-btn-primary">{saving?"Speichern…":"Profil speichern"}</button>
      </div>
    </form>
  </div>
}
