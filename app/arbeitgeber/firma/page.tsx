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

  useEffect(()=>{
    ;(async()=>{
      const s=createClient()
      const {data:{user}}=await s.auth.getUser()
      if(!user){location.href="/login";return}
      const {data:c}=await s.from("companies").select("name,industry,description,website,city,postal_code,employee_count").eq("owner_id",user.id).maybeSingle()
      if(c)setForm({name:c.name||"",industry:c.industry||"",description:c.description||"",website:c.website||"",city:c.city||"",postal_code:c.postal_code||"",employee_count:c.employee_count?.toString()||""})
      setLoading(false)
    })()
  },[])

  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setMessage("")
    const s=createClient()
    const {data:{user}}=await s.auth.getUser()
    if(!user){location.href="/login";return}
    const {error}=await s.from("companies").upsert({owner_id:user.id,name:form.name.trim(),industry:form.industry||null,description:form.description||null,website:form.website||null,city:form.city||null,postal_code:form.postal_code||null,employee_count:form.employee_count?Number(form.employee_count):null},{onConflict:"owner_id"})
    setMessage(error?error.message:"Unternehmensprofil gespeichert.");setSaving(false)
  }

  if(loading)return <div className="card card-pad text-[var(--muted)]">Unternehmen wird geladen…</div>
  return <div className="animate-fade-up"><div className="mx-auto max-w-3xl"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Unternehmen</p><h1 className="mt-2 text-4xl font-black">Ihr Unternehmensprofil</h1><p className="mt-3 text-slate-600">Diese Informationen helfen Arbeitnehmern, Ihr Unternehmen einzuordnen.</p><form onSubmit={save} className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><div className="grid gap-5 sm:grid-cols-2"><Field label="Firmenname"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder="Muster AG"/></Field><Field label="Branche"><input value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})} className="input" placeholder="Automobil, IT, Logistik…"/></Field><Field label="Ort"><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="input" placeholder="Luzern"/></Field><Field label="PLZ"><input value={form.postal_code} onChange={e=>setForm({...form,postal_code:e.target.value})} className="input" placeholder="6000"/></Field><Field label="Website"><input type="url" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} className="input" placeholder="https://…"/></Field><Field label="Mitarbeiterzahl"><input type="number" min="1" value={form.employee_count} onChange={e=>setForm({...form,employee_count:e.target.value})} className="input" placeholder="25"/></Field><Field label="Über das Unternehmen"><textarea rows={6} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input min-h-32 sm:col-span-2" placeholder="Wofür steht Ihr Unternehmen? Was zeichnet Sie als Arbeitgeber aus?"/></Field></div>{message&&<p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</p>}<div className="mt-6 flex justify-end"><button disabled={saving} className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white disabled:opacity-50">{saving?"Speichern…":"Unternehmensprofil speichern"}</button></div></form></div></div>
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="text-sm font-bold"><span>{label}</span><div className="mt-2">{children}</div></label>}
