import Link from "next/link"

export default function AboErfolgPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface-2)] px-6 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--line)] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
          Zahlung erfolgreich
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--navy)]">
          Dein Abo wurde erfolgreich abgeschlossen.
        </h1>

        <p className="mt-4 text-[var(--muted)]">
          Dein Stoyan-Konto wird nach der Stripe-Bestätigung automatisch erstellt bzw. mit deinem bestehenden Konto verknüpft.
          Falls ein neues Konto angelegt wurde, erhältst du die Einladung zur Einrichtung per E-Mail.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            className="rounded-xl bg-[var(--brand)] px-6 py-3 font-bold text-white hover:brightness-110"
          >
            Zum Login
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[var(--line)] px-6 py-3 font-bold text-[var(--navy)] hover:bg-[var(--surface-2)]"
          >
            Zur Startseite
          </Link>
        </div>
      </section>
    </main>
  )
}
