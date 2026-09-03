import Link from "next/link"
import { PlanGrid } from "@/components/plan-grid"
import { employerPlans } from "@/lib/plans"

export default function PreisePage() {
  return (
    <main className="min-h-screen bg-[var(--surface-2)]">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
          Einfach. Transparent. Skalierbar.
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-black leading-tight tracking-tight text-[var(--navy)] sm:text-5xl">
          Der passende Plan für jedes Recruiting-Team.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-[var(--muted)]">
          30 Tage kostenlos testen. Keine langfristige Verpflichtung.
          Arbeitnehmer nutzen STOYAN kostenlos.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <PlanGrid plans={employerPlans} />
      </section>

      {/* Enterprise banner */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="grid items-center gap-6 rounded-3xl bg-gradient-to-br from-[var(--navy)] to-[#173b70] p-8 sm:p-10 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#83b6ff]">
              Enterprise
            </p>
            <h2 className="mt-2 text-balance text-3xl font-black leading-tight tracking-tight text-white">
              Individuelle Lösung für grössere Unternehmen.
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-[#d5dfeb]">
              Mehrere Standorte, individuelle Benutzerrechte, Integrationen,
              erweiterte Verification-Prozesse und persönlicher Support.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              href="/registrieren?role=employer&plan=enterprise"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
            >
              Angebot anfragen
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Optional: Advanced Verification CHF 49–99 pro Prüfung · Erfolgreiche
          Vermittlung z.&nbsp;B. CHF 1&apos;500
        </p>
      </section>

      {/* Reassurance strip */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="grid gap-6 rounded-3xl border border-[var(--line)] bg-white p-8 sm:grid-cols-3">
          {[
            ["Jederzeit kündbar", "Keine Mindestlaufzeit, keine versteckten Kosten."],
            ["Schweizer Datenschutz", "Alle Daten werden DSG-konform verarbeitet."],
            ["Persönlicher Support", "Unser Team hilft dir schnell und direkt weiter."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="font-black text-[var(--navy)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[var(--muted)]">Noch unsicher, welcher Plan passt?</p>
          <Link
            href="/registrieren"
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-white px-6 py-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>
    </main>
  )
}
