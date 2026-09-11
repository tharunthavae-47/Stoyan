"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type CompanyForm = { name:string; industry:string; description:string; website:string; city:string; postal_code:string; employee_count:string }
const initial:CompanyForm = { name:"", industry:"", description:"", website:"", city:"", postal_code:"", employee_count:"" }

export default function CompanyPage(){
  const [form,setForm]=useState<CompanyForm>(initial)
  const [message,setMessage]=useState("")
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [avatar,setAvatar]=useState<File|null>(null)
  const [avatarUrl,setAvatarUrl]=useState("")

  useEffect(()=>{
    ;(async()=>{
      const s=createClient()
      const {data:{user}}=await s.auth.getUser()
      if(!user){location.href="/login";return}
      const {data:c}=await s.from("companies").select("name,industry,description,website,city,postal_code,employee_count,avatar_url").eq("owner_id",user.id).maybeSingle()
      if(c){
        setForm({name:c.name||"",industry:c.industry||"",description:c.description||"",website:c.website||"",city:c.city||"",postal_code:c.postal_code||"",employee_count:c.employee_count?.toString()||""})
        setAvatarUrl(c.avatar_url||"")
      }
      setLoading(false)
    })()
  },[])

  function selectAvatar(file:File|null){
    setAvatar(file)
    if(file)setAvatarUrl(URL.createObjectURL(file))
  }

  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setMessage("")
    const s=createClient()
    const {data:{user}}=await s.auth.getUser()
    if(!user){location.href="/login";return}

    let newAvatarUrl: string|undefined
    if(avatar){
      if(!avatar.type.startsWith("image/")){setMessage("Bitte nur ein Bild auswählen.");setSaving(false);return}
      if(avatar.size>5*1024*1024){setMessage("Das Profilbild darf maximal 5 MB gross sein.");setSaving(false);return}
      const ext=avatar.name.split(".").pop()?.toLowerCase()||"jpg"
      const path=`${user.id}/employer-avatar.${ext}`
      const up=await s.storage.from("employee-media").upload(path,avatar,{upsert:true,contentType:avatar.type,cacheControl:"3600"})
      if(up.error){setMessage(up.error.message);setSaving(false);return}
      const {data}=s.storage.from("employee-media").getPublicUrl(path)
      newAvatarUrl=`${data.publicUrl}?v=${Date.now()}`
      setAvatarUrl(newAvatarUrl)
    }

    const company={owner_id:user.id,name:form.name.trim(),industry:form.industry||null,description:form.description||null,website:form.website||null,city:form.city||null,postal_code:form.postal_code||null,employee_count:form.employee_count?Number(form.employee_count):null,...(newAvatarUrl?{avatar_url:newAvatarUrl}:avatarUrl?{avatar_url:avatarUrl}: {})}
    const {error}=await s.from("companies").upsert(company,{onConflict:"owner_id"})
    setMessage(error?error.message:"Unternehmensprofil gespeichert.");setSaving(false)
  }

  if(loading)return <div className="text-[#576373]">Unternehmen wird geladen…</div>
  return <div className="mx-auto max-w-3xl text-[#14243a]">
    <div>
      <p className="ed-eyebrow mb-4">UNTERNEHMEN</p>
      <h1 className="text-[clamp(2rem,3.2vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.05em]">Ihr Unternehmensprofil.</h1>
      <p className="mt-4 max-w-[560px] text-[1rem] leading-[1.8] text-[#576373]">Diese Informationen helfen Arbeitnehmern, Ihr Unternehmen einzuordnen.</p>
    </div>

    <form onSubmit={save} className="mt-12 grid gap-12">
      <section>
        <div className="flex flex-col items-center border border-[#dfe4ea] bg-[#f7f9fc] p-8 sm:flex-row sm:items-center sm:gap-7">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e5edf9] text-4xl font-medium text-[#2356d8] shadow-sm">
            {avatarUrl?<img src={avatarUrl} alt="Unternehmensprofilbild" className="h-full w-full object-cover"/>:<span>{form.name.trim().charAt(0).toUpperCase()||"U"}</span>}
          </div>
          <div className="mt-5 text-center sm:mt-0 sm:text-left">
            <label className="ed-btn-primary cursor-pointer !min-h-[46px] !px-5 text-[0.875rem]">
              {avatarUrl?"Profilbild ändern":"Profilbild hinzufügen"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>selectAvatar(e.target.files?.[0]??null)} className="hidden"/>
            </label>
            <p className="mt-3 text-[0.75rem] text-[#687384]">JPG, PNG, WEBP oder GIF · maximal 5 MB</p>
          </div>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Unternehmensdaten</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Firmenname"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ed-input" placeholder="Muster AG"/></Field>
          <Field label="Branche"><input value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})} className="ed-input" placeholder="Automobil, IT, Logistik…"/></Field>
          <Field label="Ort"><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="ed-input" placeholder="Luzern"/></Field>
          <Field label="PLZ"><input value={form.postal_code} onChange={e=>setForm({...form,postal_code:e.target.value})} className="ed-input" placeholder="6003"/></Field>
          <Field label="Website"><input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} className="ed-input" placeholder="https://…"/></Field>
          <Field label="Anzahl Mitarbeitende"><input type="number" min="1" value={form.employee_count} onChange={e=>setForm({...form,employee_count:e.target.value})} className="ed-input" placeholder="25"/></Field>
        </div>
      </section>

      <section className="ed-section">
        <h2 className="mb-6 text-[1.25rem] font-medium tracking-[-0.03em]">Über das Unternehmen</h2>
        <Field label="Beschreibung">
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={5} className="ed-input" placeholder="Was macht Ihr Unternehmen aus? Welche Werte und Perspektiven bieten Sie?"/>
        </Field>
      </section>

      {message&&<div className="border-l-2 border-[#2356d8] bg-[#eef3fd] px-4 py-3 text-[0.875rem] font-medium text-[#1844b6]">{message}</div>}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#dbe1e9] pt-6">
        <Link href="/arbeitgeber" className="ed-btn-ghost">Abbrechen</Link>
        <button disabled={saving} className="ed-btn-primary">{saving?"Speichern…":"Unternehmen speichern"}</button>
      </div>
    </form>
  </div>
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="grid gap-2"><span className="ed-label">{label}</span>{children}</label>}
