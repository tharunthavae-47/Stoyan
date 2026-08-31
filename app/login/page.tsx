"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"login" | "mfa">("login")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const supabase = createClient()

    if (step === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (!data.user) { setError("Anmeldung konnte nicht abgeschlossen werden."); setLoading(false); return }

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) { setError(factorsError.message); setLoading(false); return }
      const verifiedTotp = factors.totp?.find((factor) => factor.status === "verified")

      if (!verifiedTotp) {
        window.location.href = "/2fa/einrichten"
        return
      }

      setStep("mfa")
      setLoading(false)
      return
    }

    if (!/^[0-9]{6}$/.test(code)) {
      setError("Bitte gib den 6-stelligen Code aus Microsoft Authenticator ein.")
      setLoading(false)
      return
    }

    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
    if (factorsError) { setError(factorsError.message); setLoading(false); return }
    const factor = factors.totp?.find((item) => item.status === "verified")
    if (!factor) { window.location.href = "/2fa/einrichten"; return }

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id })
    if (challengeError || !challenge) {
      setError(challengeError?.message ?? "2FA-Challenge konnte nicht erstellt werden.")
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code })
    if (verifyError) {
      setError("Der Authenticator-Code ist falsch oder abgelaufen.")
      setLoading(false)
      return
    }

    window.location.href = "/dashboard"
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <Link href="/" className="text-sm font-semibold text-blue-300">← Stoyan</Link>
        {step === "login" ? (
          <>
            <h1 className="mt-6 text-3xl font-black">Willkommen zurück</h1>
            <p className="mt-2 text-slate-300">Melde dich bei deinem Konto an.</p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail-Adresse" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400" />
              <input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400" />
              <div className="flex justify-end"><Link href="/passwort-vergessen" className="text-sm font-semibold text-blue-300 hover:text-blue-200">Passwort vergessen?</Link></div>
              <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">{loading ? "Anmeldung…" : "Anmelden"}</button>
            </form>
          </>
        ) : (
          <>
            <div className="mt-6 text-3xl">🔐</div>
            <h1 className="mt-3 text-3xl font-black">2FA bestätigen</h1>
            <p className="mt-2 text-slate-300">Öffne Microsoft Authenticator und gib den 6-stelligen Code ein.</p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <input required autoFocus inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-stelliger Code" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none placeholder:text-slate-500 focus:border-blue-400" />
              <button disabled={loading || code.length !== 6} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">{loading ? "Prüfe Code…" : "Code bestätigen"}</button>
            </form>
          </>
        )}
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
        {step === "login" && <p className="mt-6 text-center text-sm text-slate-400">Noch kein Konto? <Link href="/registrieren" className="font-bold text-blue-300">Registrieren</Link></p>}
      </div>
    </main>
  )
}
