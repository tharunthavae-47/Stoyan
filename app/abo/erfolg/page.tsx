import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"

export default function AboErfolgPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-[#14243a]">
      <section className="w-full max-w-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f7f0] text-[#1f9464]">
          <Check className="h-7 w-7" strokeWidth={2} />
        </div>

        <p className="ed-eyebrow no-marker mt-8 text-[#1f9464]">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-[#1f9464]" />
          ZAHLUNG ERFOLGREICH
        </p>

        <h1 className="mt-4 text-[clamp(2rem,3.4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.05em] text-balance">
          Dein Abo wurde erfolgreich abgeschlossen.
        </h1>

        <p className="mt-5 text-[1.0625rem] leading-[1.8] text-[#576373]">
          Dein Stoyan-Konto wird nach der Stripe-Bestätigung automatisch erstellt bzw. mit deinem bestehenden Konto
          verknüpft. Falls ein neues Konto angelegt wurde, erhältst du die Einladung zur Einrichtung per E-Mail.
        </p>

        <div className="mt-9 flex flex-col items-start gap-4 border-t border-[#dfe4ea] pt-8 sm:flex-row sm:items-center">
          <Link href="/login" className="ed-btn-primary w-full sm:w-auto">
            Zum Login
            <ArrowUpRight className="h-[19px] w-[19px]" />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[0.9375rem] font-medium text-[#2356d8]"
          >
            Zur Startseite
            <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  )
}
