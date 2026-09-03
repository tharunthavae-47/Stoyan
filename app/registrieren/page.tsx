"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
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
        setError(
          "Das Konto konnte nicht erstellt werden."
        )
        setLoading(false)
        return
      }

      const userId = data.user.id

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            role,
          },
          {
            onConflict: "id",
          }
        )

      if (profileError) {
        console.error(
          "Fehler beim Erstellen des Profils:",
          profileError
        )

        setError(
          `Benutzer wurde erstellt, aber das Profil konnte nicht angelegt werden: ${profileError.message}`
        )

        setLoading(false)
        return
      }

      if (role === "employee") {
        const {
          error: employeeProfileError,
        } = await supabase
          .from("employee_profiles")
          .upsert(
            {
              id: userId,
              profile_visible: true,
              contact_visible: true,
            },
            {
              onConflict: "id",
            }
          )

        if (employeeProfileError) {
          console.error(
            "Fehler beim Erstellen des Arbeitnehmerprofils:",
            employeeProfileError
          )

          setError(
            `Konto wurde erstellt, aber das Arbeitnehmerprofil konnte nicht angelegt werden: ${employeeProfileError.message}`
          )

          setLoading(false)
          return
        }
      }

      if (data.session) {
        window.location.href =
          role === "employer"
            ? "/arbeitgeber"
            : "/arbeitnehmer"

        return
      }

      setMessage(
        "Konto erfolgreich erstellt. Bitte bestätige deine E-Mail-Adresse und melde dich danach an."
      )

      setLoading(false)
    } catch (err) {
      console.error(
        "Registrierungsfehler:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Bei der Registrierung ist ein unerwarteter Fehler aufgetreten."
      )

      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-8 text-white shadow-2xl">
      <Link
        href="/"
        className="text-sm font-semibold text-blue-400"
      >
        ← JobMatch24
      </Link>

      <h1 className="mt-6 text-3xl font-black">
        Konto erstellen
      </h1>

      <p className="mt-2 text-slate-400">
        Wähle zuerst aus, wie du JobMatch24 nutzen möchtest.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {[
          ["employee", "Arbeitnehmer"],
          ["employer", "Arbeitgeber"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`rounded-2xl border p-4 text-left font-bold transition ${
              role === value
                ? "border-blue-500 bg-blue-500/10 text-blue-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="mt-7 space-y-4"
      >
        <input
          required
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="E-Mail-Adresse"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        />

        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Passwort (mind. 8 Zeichen)"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Konto wird erstellt…"
            : role === "employer"
            ? "Firmenkonto erstellen"
            : "Arbeitnehmerkonto erstellen"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-4 rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Bereits registriert?{" "}
        <Link
          href="/login"
          className="font-bold text-blue-400"
        >
          Anmelden
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 py-12">
      <Suspense
        fallback={
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-white">
            Registrierung wird geladen…
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </main>
  )
}
