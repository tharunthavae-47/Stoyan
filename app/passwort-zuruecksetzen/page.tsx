"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [tokenHash, setTokenHash] = useState("")

  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const hash = params.get("token_hash") || ""
    const type = params.get("type") || "recovery"
    setTokenHash(hash)

    // The email link now lands on this page first. We only consume the
    // single-use recovery token after the user explicitly clicks the button.
    // This prevents email security scanners/prefetchers from consuming it.
    if (hash) {
      return
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setVerified(true)
    })
  }, [])

  async function verifyRecoveryLink() {
    if (!tokenHash) {
      setError("Der Passwort-Link ist ungültig oder unvollständig.")
      return
    }

    setVerifying(true)
    setError("")
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type") || "recovery"
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "recovery",
    })

    if (error) {
      setError("Der Passwort-Link ist ungültig oder bereits abgelaufen. Bitte fordere einen neuen Link an.")
    } else {
      setVerified(true)
      window.history.replaceState({}, document.title, "/passwort-zuruecksetzen")
    }
    setVerifying(false)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.")
      return
    }
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.")
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setMessage("Dein Passwort wurde erfolgreich geändert.")
      setPassword("")
      setConfirm("")
    }
    setSaving(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <Link href="/login" className="text-sm font-semibold text-blue-300">← Zum Login</Link>
        <h1 className="mt-6 text-3xl font-black">Neues Passwort</h1>
        <p className="mt-2 text-slate-300">Bestätige zuerst den Passwort-Link. Danach kannst du dein neues Passwort festlegen.</p>

        {!verified && !message ? (
          <div className="mt-7 space-y-4">
            {tokenHash ? (
              <button
                type="button"
                onClick={verifyRecoveryLink}
                disabled={verifying}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {verifying ? "Link wird geprüft…" : "Passwort-Link bestätigen"}
              </button>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Der Passwort-Link ist ungültig oder abgelaufen. Fordere bitte einen neuen Link an.
              </div>
            )}
          </div>
        ) : !message ? (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Neues Passwort" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400" />
            <input required minLength={6} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Passwort wiederholen" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-400" />
            <button disabled={saving} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">{saving ? "Wird gespeichert…" : "Passwort ändern"}</button>
          </form>
        ) : null}

        {message && <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}<div className="mt-3"><Link href="/login" className="font-bold text-emerald-100">Zum Login →</Link></div></div>}
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      </div>
    </main>
  )
}
