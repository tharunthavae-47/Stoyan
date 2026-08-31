import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function EmployerPage() {
  const s = await createClient()
  const {
    data: { user },
  } = await s.auth.getUser()

  if (!user) {
    return (
      <div className="card card-pad">
        <Link href="/login" className="font-bold text-[var(--brand)]">
          Zum Login
        </Link>
      </div>
    )
  }

  const { data: company } = await s
    .from("companies")
    .select("name,industry,city,employee_count")
    .eq("owner_id", user.id)
    .maybeSingle()

  return (
    <div className="animate-fade-up">
      {/* Kopf */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[var(--brand)]">
            Arbeitgeber
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--navy)]">
            Mitarbeiter finden.
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Suchen Sie nach Ihren Kriterien und entdecken Sie passende Arbeitnehmerprofile.
          </p>
        </div>
        <Link href="/arbeitgeber/suche" className="btn-primary">
          Kandidaten suchen
        </Link>
      </div>

      {/* Karten */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="card card-pad md:col-span-2">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted-light)]">
            Unternehmen
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
            {company?.name || "Ihr Unternehmen"}
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {company?.industry || "Branche noch nicht angegeben"}
            {company?.city ? ` · ${company.city}` : ""}
          </p>
          <Link
            href="/arbeitgeber/firma"
            className="mt-5 inline-block font-bold text-[var(--brand)]"
          >
            Unternehmensprofil bearbeiten →
          </Link>
        </div>

        <div className="hero-navy !p-6">
          <p className="text-sm font-bold text-blue-200">NÄCHSTER SCHRITT</p>
          <h2 className="mt-2 text-2xl font-black">Kandidaten finden</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100/90">
            Beruf, Erfahrung, Skills, Ort, Pensum und weitere Kriterien eingeben.
          </p>
          <Link
            href="/arbeitgeber/suche"
            className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-[var(--navy)] transition hover:bg-slate-100"
          >
            Suche starten
          </Link>
        </div>
      </div>
    </div>
  )
}
