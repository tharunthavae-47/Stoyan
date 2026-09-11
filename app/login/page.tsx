"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"
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
    <main className="grid min-h-screen bg-white text-[#14243a] lg:grid-cols-[1.05fr_1fr]">
      {/* Editorial intro panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#162940] px-12 py-14 text-white lg:flex">
        <Link href="/" className="text-[1.05rem] font-medium tracking-[-0.02em]">
          jobmatch<span className="text-[#7ea6ff]">24</span>
        </Link>
        <div className="max-w-[420px]">
          <p className="ed-eyebrow no-marker mb-6 text-[#9bbcfb]">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#7ea6ff]" />
            WILLKOMMEN ZURÜCK
          </p>
          <h1 className="text-[clamp(2.4rem,3.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.055em] text-balance">
            Deine nächste
            <br />
            Chance wartet.
          </h1>
          <p className="mt-6 max-w-[380px] text-[1rem] leading-[1.8] text-[#b9c7d8]">
            Melde dich an, um dein Profil zu bearbeiten, passende Übereinstimmungen zu sehen und Kontaktanfragen zu
            verwalten.
          </p>
        </div>
        <p className="flex items-center gap-2.5 text-[0.8125rem] text-[#9fb2c8]">
          <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.6} />
          Geschützt durch Zwei-Faktor-Authentifizierung
        </p>
      </aside>

      {/* Form */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <Link href="/" className="mb-10 inline-block text-[1.05rem] font-medium tracking-[-0.02em] lg:hidden">
            jobmatch<span className="text-[#2356d8]">24</span>
          </Link>

          {step === "login" ? (
            <>
              <p className="ed-eyebrow mb-4">ANMELDEN</p>
              <h2 className="mb-3 text-[clamp(2rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.05em]">
                Bei deinem Konto anmelden.
              </h2>
              <p className="mb-9 text-[1rem] leading-[1.8] text-[#576373]">
                Gib deine E-Mail-Adresse und dein Passwort ein.
              </p>
              <form onSubmit={submit} className="grid gap-5">
                <div className="grid gap-2">
                  <label htmlFor="email" className="ed-label">E-Mail-Adresse</label>
                  <input id="email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@beispiel.ch" className="ed-input" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="ed-label">Passwort</label>
                    <Link href="/passwort-vergessen" className="text-[0.75rem] font-medium text-[#2356d8] hover:text-[#1844b6]">Passwort vergessen?</Link>
                  </div>
                  <input id="password" required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" className="ed-input" />
                </div>
                <button disabled={loading} className="ed-btn-primary mt-1 w-full">
                  {loading ? "Anmeldung…" : "Anmelden"}
                  {!loading && <ArrowRight className="h-[18px] w-[18px]" />}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="ed-eyebrow mb-4">ZWEITER FAKTOR</p>
              <h2 className="mb-3 text-[clamp(2rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.05em]">
                Anmeldung bestätigen.
              </h2>
              <p className="mb-9 text-[1rem] leading-[1.8] text-[#576373]">
                Öffne Microsoft Authenticator und gib den 6-stelligen Code ein.
              </p>
              <form onSubmit={submit} className="grid gap-5">
                <input required autoFocus inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="––––––" className="ed-input text-center text-[1.75rem] font-medium tracking-[0.6em]" />
                <button disabled={loading || code.length !== 6} className="ed-btn-primary w-full">
                  {loading ? "Prüfe Code…" : "Code bestätigen"}
                  {!loading && <ArrowRight className="h-[18px] w-[18px]" />}
                </button>
              </form>
            </>
          )}

          {error && (
            <p className="mt-5 border-l-2 border-[#da3839] bg-[#fef2f2] px-4 py-3 text-[0.875rem] text-[#b91c1c]">
              {error}
            </p>
          )}

          {step === "login" && (
            <p className="mt-8 border-t border-[#e4e9ef] pt-6 text-[0.9375rem] text-[#576373]">
              Noch kein Konto?{" "}
              <Link href="/registrieren" className="font-medium text-[#2356d8] hover:text-[#1844b6]">Jetzt registrieren</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
