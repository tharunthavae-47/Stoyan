"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/passwort-zuruecksetzen`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen des Passworts versendet.")
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <Link href="/login" className="text-sm font-semibold text-blue-300">← Zurück zum Login</Link>
        <h1 className="mt-6 text-3xl font-black">Passwort vergessen?</h1>
        <p className="mt-2 text-slate-300">Gib deine E-Mail-Adresse ein. Wir schicken dir einen sicheren Link zum Festlegen eines neuen Passworts.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail-Adresse" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400" />
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">{loading ? "Wird gesendet…" : "Reset-Link senden"}</button>
        </form>
        {message && <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p>}
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      </div>
    </main>
  )
}
