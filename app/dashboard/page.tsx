import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role

  if (!user) {
    return (
      <div className="card card-pad">
        <h1 className="text-2xl font-black text-[var(--navy)]">Nicht angemeldet</h1>
        <Link href="/login" className="mt-2 inline-block font-bold text-[var(--brand)]">
          Zum Login
        </Link>
      </div>
    )
  }

  const isEmployer = role === "employer"

  return (
    <div className="animate-fade-up">
      {/* Kopfbereich */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">STOYAN</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--navy)]">
          Willkommen zurück
        </h1>
        <p className="mt-3 text-[var(--muted)]">{user.email}</p>
      </div>

      {/* Konto-Status */}
      <div className="card card-pad mt-8">
        <p className="text-xs font-black uppercase tracking-wider text-[var(--muted-light)]">Konto</p>
        <h2 className="mt-2 text-xl font-black text-[var(--navy)]">
          {isEmployer
            ? "Arbeitgeber"
            : role === "employee"
              ? "Arbeitnehmer"
              : "Rolle noch nicht festgelegt"}
        </h2>
      </div>

      {/* Aktionen */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href={isEmployer ? "/arbeitgeber" : "/arbeitnehmer"}
          className="hero-navy block !p-6 transition hover:brightness-105"
        >
          <p className="text-sm font-bold opacity-80">
            {isEmployer ? "ARBEITGEBER" : "ARBEITNEHMER"}
          </p>
          <h2 className="mt-2 text-2xl font-black">
            {isEmployer ? "Kandidaten suchen" : "Mein Profil öffnen"}
          </h2>
          <p className="mt-2 text-sm opacity-80">
            {isEmployer
              ? "Kriterien festlegen und passende Arbeitnehmer finden."
              : "Profil, Erfahrung, Skills und Arbeitswünsche verwalten."}
          </p>
        </Link>

        <Link
          href={isEmployer ? "/arbeitgeber/firma" : "/arbeitnehmer/profil"}
          className="card card-pad block"
        >
          <p className="text-sm font-bold text-[var(--muted-light)]">VERWALTUNG</p>
          <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
            {isEmployer ? "Unternehmen" : "Profil bearbeiten"}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {isEmployer
              ? "Firmeninformationen und Recruiting vorbereiten."
              : "Persönliche und berufliche Angaben vervollständigen."}
          </p>
        </Link>
      </div>
    </div>
  )
}
