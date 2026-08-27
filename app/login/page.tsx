"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) window.location.href = "/dashboard"
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-blue-600">← Stoyan</Link>
        <h1 className="mt-6 text-3xl font-black">Willkommen zurück</h1>
        <p className="mt-2 text-slate-500">Melde dich bei deinem Konto an.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail-Adresse" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
          <input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
          <button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white disabled:opacity-50">{loading ? "Anmeldung…" : "Anmelden"}</button>
        </form>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">Noch kein Konto? <Link href="/registrieren" className="font-bold text-blue-600">Registrieren</Link></p>
      </div>
    </main>
  )
}
