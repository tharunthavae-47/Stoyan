"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Briefcase, Check, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function RegisterForm() {
  const params = useSearchParams()

  const [role, setRole] = useState(
    params.get("role") === "employer"
      ? "employer"
      : "employee"
  )

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    setError("")
    setMessage("")
    setLoading(true)

    try {
      const supabase = createClient()

      const {
        data,
        error: signUpError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Das Konto konnte nicht erstellt werden.")
        setLoading(false)
        return
      }

      // Nach erfolgreicher Kontoerstellung wird die Willkommens-E-Mail
      // serverseitig über Resend versendet. Ein Fehler beim Mailversand darf
      // die erfolgreiche Registrierung nicht rückgängig machen.
      try {
        const emailResponse = await fetch("/api/auth/welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            email: email.trim(),
          }),
        })

        if (!emailResponse.ok) {
          console.error("Willkommens-E-Mail konnte nicht versendet werden.")
        }
      } catch (emailError) {
        console.error("Fehler beim Versand der Willkommens-E-Mail:", emailError)
      }

      // Profile und Arbeitnehmerprofil werden automatisch durch die
      // Supabase-Trigger auf auth.users angelegt. Die Registrierung darf hier
      // NICHT noch einmal in profiles/employee_profiles schreiben, da sonst
      // bei einem bereits vorhandenen Profil ein profiles_pkey-Fehler entsteht.
      // Das funktioniert außerdem auch dann, wenn E-Mail-Bestätigung aktiviert
      // ist und nach signUp noch keine Session vorhanden ist.

      if (data.session) {
        window.location.href =
          role === "employer"
            ? "/arbeitgeber"
            : "/arbeitnehmer"

        return
      }

      setMessage(
        "Konto erfolgreich erstellt. Eine Bestätigungs-E-Mail wurde an deine Adresse gesendet. Bitte bestätige deine E-Mail-Adresse und melde dich danach an."
      )

      setLoading(false)
    } catch (err) {
      console.error("Registrierungsfehler:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Bei der Registrierung ist ein unerwarteter Fehler aufgetreten."
      )

      setLoading(false)
    }
  }

  const roles = [
    { value: "employee", label: "Arbeitnehmer", detail: "Ich suche eine Stelle", icon: UserRound },
    { value: "employer", label: "Arbeitgeber", detail: "Ich suche Mitarbeitende", icon: Briefcase },
  ] as const

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <Link href="/" className="mb-10 inline-block text-[1.05rem] font-medium tracking-[-0.02em] lg:hidden">
        jobmatch<span className="text-[#2356d8]">24</span>
      </Link>

      <p className="ed-eyebrow mb-4">KONTO ERSTELLEN</p>
      <h2 className="mb-3 text-[clamp(2rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.05em]">
        In wenigen Schritten startklar.
      </h2>
      <p className="mb-8 text-[1rem] leading-[1.8] text-[#576373]">
        Wähle zuerst, wie du jobmatch24 nutzen möchtest.
      </p>

      <div className="mb-7 grid grid-cols-2 gap-3">
        {roles.map(({ value, label, detail, icon: Icon }) => {
          const active = role === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={
                "flex flex-col items-start gap-3 rounded-[4px] border p-4 text-left transition " +
                (active
                  ? "border-[#2356d8] bg-[#f4f7fe]"
                  : "border-[#dfe4ea] bg-white hover:border-[#c4cfda]")
              }
            >
              <Icon className={active ? "h-[22px] w-[22px] text-[#2356d8]" : "h-[22px] w-[22px] text-[#56728f]"} strokeWidth={1.5} />
              <span>
                <span className={"block text-[0.9375rem] font-semibold tracking-[-0.02em] " + (active ? "text-[#14243a]" : "text-[#14243a]")}>{label}</span>
                <span className="mt-0.5 block text-[0.75rem] text-[#687384]">{detail}</span>
              </span>
            </button>
          )
        })}
      </div>

      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="email" className="ed-label">E-Mail-Adresse</label>
          <input
            id="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.ch"
            className="ed-input"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="ed-label">Passwort</label>
          <input
            id="password"
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="ed-input"
          />
        </div>

        <button type="submit" disabled={loading} className="ed-btn-primary mt-1 w-full">
          {loading
            ? "Konto wird erstellt…"
            : role === "employer"
              ? "Firmenkonto erstellen"
              : "Arbeitnehmerkonto erstellen"}
          {!loading && <ArrowRight className="h-[18px] w-[18px]" />}
        </button>
      </form>

      {error && (
        <p className="mt-5 border-l-2 border-[#da3839] bg-[#fef2f2] px-4 py-3 text-[0.875rem] text-[#b91c1c]">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-5 flex items-start gap-2.5 border-l-2 border-[#1f9464] bg-[#e8f7f0] px-4 py-3 text-[0.875rem] text-[#0f6b48]">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      )}

      <p className="mt-8 border-t border-[#e4e9ef] pt-6 text-[0.9375rem] text-[#576373]">
        Bereits registriert?{" "}
        <Link href="/login" className="font-medium text-[#2356d8] hover:text-[#1844b6]">Anmelden</Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-white text-[#14243a] lg:grid-cols-[1fr_1.05fr]">
      {/* Form */}
      <section className="order-2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:order-1 lg:px-16">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[440px] text-[#576373]">Registrierung wird geladen…</div>
          }
        >
          <RegisterForm />
        </Suspense>
      </section>

      {/* Editorial intro panel */}
      <aside className="order-1 relative hidden flex-col justify-between overflow-hidden bg-[#162940] px-12 py-14 text-white lg:order-2 lg:flex">
        <Link href="/" className="self-end text-[1.05rem] font-medium tracking-[-0.02em]">
          jobmatch<span className="text-[#7ea6ff]">24</span>
        </Link>
        <div className="max-w-[440px]">
          <p className="ed-eyebrow no-marker mb-6 text-[#9bbcfb]">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#7ea6ff]" />
            JOBS UND MITARBEITENDE IN DER SCHWEIZ
          </p>
          <h1 className="text-[clamp(2.4rem,3.4vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.055em] text-balance">
            Arbeit, die
            <br />
            zu dir passt.
          </h1>
          <ul className="mt-8 grid gap-4">
            {[
              "Ein Profil für Beruf, Erfahrung und Wünsche",
              "Übereinstimmungen nach klaren Kriterien",
              "Selbst entscheiden, mit wem du sprichst",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.6] text-[#c3d1e2]">
                <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#7ea6ff]" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[0.8125rem] text-[#9fb2c8]">
          Kostenlos starten · Beruf · Erfahrung · Pensum · Arbeitsort
        </p>
      </aside>
    </main>
  )
}
