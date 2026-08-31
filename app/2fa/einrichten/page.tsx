"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function TwoFactorSetupPage() {
  const router = useRouter()
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [factorId, setFactorId] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    let active = true

    async function setup() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()

      if (listError) {
        if (active) {
          setError(listError.message)
          setLoading(false)
        }
        return
      }

      const existing = factors.totp?.find((factor) => factor.status === "verified")
      if (existing) {
        router.replace("/login")
        return
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Stoyan",
        issuer: "Stoyan",
      })

      if (enrollError || !data) {
        if (active) {
          setError(enrollError?.message ?? "2FA konnte nicht eingerichtet werden.")
          setLoading(false)
        }
        return
      }

      if (active) {
        setFactorId(data.id)
        setQrCode(data.totp.qr_code)
        setSecret(data.totp.secret)
        setLoading(false)
      }
    }

    setup()
    return () => {
      active = false
    }
  }, [router])

  async function verify() {
    if (code.length !== 6 || !factorId) return

    setError("")
    setVerifying(true)

    const supabase = createClient()
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (challengeError || !challenge) {
      setError(challengeError?.message ?? "Challenge fehlgeschlagen.")
      setVerifying(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyError) {
      setError("Der Code ist falsch oder abgelaufen.")
      setVerifying(false)
      return
    }

    router.replace("/dashboard")
    router.refresh()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <p>2FA wird vorbereitet…</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="text-3xl">🔐</div>
        <h1 className="mt-4 text-3xl font-black">Stoyan – Microsoft Authenticator</h1>
        <p className="mt-2 text-slate-300">
          Die Zwei-Faktor-Authentifizierung ist für jedes Stoyan-Konto verpflichtend.
          Scanne den QR-Code mit Microsoft Authenticator.
        </p>

        <div className="mt-7 flex justify-center rounded-2xl bg-white p-5">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR-Code für Stoyan in Microsoft Authenticator"
              className="h-56 w-56"
            />
          ) : (
            <p className="text-slate-900">QR-Code konnte nicht geladen werden.</p>
          )}
        </div>

        <p className="mt-5 text-sm text-slate-300">
          Falls der QR-Code nicht gescannt werden kann, kannst du den geheimen Schlüssel manuell in Microsoft Authenticator eingeben.
        </p>

        <div className="mt-3 break-all rounded-xl bg-black/30 p-3 text-center font-mono text-sm text-blue-200">
          {secret}
        </div>

        <div className="mt-7 space-y-4">
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-stelliger Code"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
          />

          <button
            type="button"
            disabled={verifying || code.length !== 6 || !factorId}
            onClick={verify}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {verifying ? "Wird bestätigt…" : "2FA aktivieren"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
