"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const params = useSearchParams()
  const [role, setRole] = useState(params.get("role") === "employer" ? "employer" : "employee")
  const [message, setMessage] = useState("")

  function submit(e: React.FormEvent) { e.preventDefault(); setMessage("Die Supabase-Registrierung wird im nächsten Schritt verbunden.") }

  return <main className="flex min-h-screen items-center justify-center px-6 py-12"><div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><Link href="/" className="text-sm font-semibold text-blue-600">← Stoyan</Link><h1 className="mt-6 text-3xl font-black">Konto erstellen</h1><p className="mt-2 text-slate-500">Wähle zuerst aus, wie du Stoyan nutzen möchtest.</p><div className="mt-7 grid grid-cols-2 gap-3">{[["employee","Arbeitnehmer"],["employer","Arbeitgeber"]].map(([value,label])=><button key={value} type="button" onClick={()=>setRole(value)} className={`rounded-2xl border p-4 text-left font-bold ${role===value?"border-blue-600 bg-blue-50 text-blue-700":"border-slate-200"}`}>{value==="employee"?"👤":"🏢"} {label}</button>)}</div><form onSubmit={submit} className="mt-7 space-y-4"><input required type="email" placeholder="E-Mail-Adresse" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"/><input required type="password" minLength={8} placeholder="Passwort (mind. 8 Zeichen)" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"/><button className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700">Konto erstellen</button></form>{message&&<p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}<p className="mt-6 text-center text-sm text-slate-500">Bereits registriert? <Link href="/login" className="font-bold text-blue-600">Anmelden</Link></p></div></main>
}
