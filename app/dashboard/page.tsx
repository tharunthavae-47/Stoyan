import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role

  if (!user) return <main className="p-10"><h1 className="text-2xl font-bold">Nicht angemeldet</h1><Link href="/login" className="text-blue-600">Zum Login</Link></main>

  return <main className="min-h-screen bg-slate-50 px-6 py-12"><div className="mx-auto max-w-5xl"><div className="rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-blue-600">STOYAN</p><h1 className="mt-2 text-4xl font-black">Willkommen zurück</h1><p className="mt-3 text-slate-600">{user.email}</p><div className="mt-8 rounded-2xl bg-slate-50 p-6"><h2 className="font-bold">Deine Rolle</h2><p className="mt-2 text-slate-600">{role === "employer" ? "Arbeitgeber" : role === "employee" ? "Arbeitnehmer" : "Noch nicht festgelegt"}</p></div><div className="mt-6 flex gap-3">{role === "employer" ? <Link href="/arbeitgeber" className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Arbeitgeberbereich</Link> : <Link href="/arbeitnehmer" className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Arbeitnehmerbereich</Link>}<Link href="/" className="rounded-xl border px-5 py-3 font-bold">Startseite</Link></div></div></div></main>
}
