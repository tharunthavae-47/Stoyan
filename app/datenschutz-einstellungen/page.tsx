"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Download, Eye, FileText, Lock, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function DatenschutzEinstellungenPage() {
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState("")
  const [notice, setNotice] = useState("")
  const [role, setRole] = useState<"employee" | "employer" | null>(null)
  const [profileVisible, setProfileVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const s = createClient()
      const { data: { user } } = await s.auth.getUser()
      if (!user) { location.href = "/login"; return }
      const r = user.user_metadata?.role === "employer" ? "employer" : "employee"
      setRole(r)
      if (r === "employee") {
        const { data } = await s.from("employee_profiles").select("profile_visible,contact_visible").eq("id", user.id).maybeSingle()
        setProfileVisible(Boolean(data?.profile_visible))
        setContactVisible(Boolean(data?.contact_visible))
      }
      setLoading(false)
    })()
  }, [])

  async function updateVisibility(field: "profile_visible" | "contact_visible", value: boolean) {
    setBusy(field); setNotice("")
    const s = createClient()
    const { data: { user } } = await s.auth.getUser()
    if (!user) { location.href = "/login"; return }
    const { error } = await s.from("employee_profiles").update({ [field]: value }).eq("id", user.id)
    if (error) {
      setNotice("Die Einstellung konnte nicht gespeichert werden: " + error.message)
    } else {
      if (field === "profile_visible") setProfileVisible(value)
      else setContactVisible(value)
      setNotice("Datenschutzeinstellung gespeichert.")
    }
    setBusy("")
  }

  async function exportData() {
    setBusy("export"); setNotice("")
    try {
      const response = await fetch("/api/privacy/export", { cache: "no-store" })
      if (!response.ok) throw new Error("Die Datenauskunft konnte nicht erstellt werden.")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = `jobmatch24-datenauskunft-${new Date().toISOString().slice(0,10)}.json`
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      setNotice("Deine Datenauskunft wurde erstellt.")
    } catch (e) { setNotice(e instanceof Error ? e.message : "Export fehlgeschlagen.") }
    setBusy("")
  }

  async function submitRequest(type: "access" | "rectification" | "deletion" | "objection") {
    setBusy(type); setNotice("")
    try {
      const response = await fetch("/api/privacy/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || "Anfrage konnte nicht gesendet werden.")
      setNotice("Anfrage erfolgreich eingereicht. Referenz: " + data.request.id)
    } catch (e) { setNotice(e instanceof Error ? e.message : "Anfrage fehlgeschlagen.") }
    setBusy("")
  }

  async function deleteAccount() {
    const first = window.confirm("Möchtest du dein JobMatch24-Konto wirklich löschen? Deine Profildaten, Anfragen und kontobezogenen Daten werden gelöscht. Dieser Vorgang kann nicht rückgängig gemacht werden.")
    if (!first) return
    const second = window.prompt('Zur Bestätigung bitte LÖSCHEN eingeben.')
    if (second !== "LÖSCHEN") { setNotice("Löschung abgebrochen."); return }
    setBusy("delete"); setNotice("")
    try {
      const response = await fetch("/api/privacy/delete", { method: "POST" })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || "Konto konnte nicht gelöscht werden.")
      location.href = "/?accountDeleted=1"
    } catch (e) { setNotice(e instanceof Error ? e.message : "Konto konnte nicht gelöscht werden."); setBusy("") }
  }

  if (loading) return <main className="min-h-screen bg-slate-50 px-6 py-16"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-sm">Datenschutzeinstellungen werden geladen…</div></main>

  const editHref = role === "employee" ? "/arbeitnehmer/profil" : "/arbeitgeber/firma"

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-4xl"><Link href="/konto" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4"/> Zurück zum Konto</Link><header className="mt-6"><p className="text-sm font-black uppercase tracking-widest text-blue-600">Datenschutz</p><h1 className="mt-2 text-4xl font-black text-slate-950">Datenschutz-Einstellungen</h1><p className="mt-3 max-w-2xl text-slate-600">Du kannst hier deine Sichtbarkeit steuern, eine Datenauskunft erhalten und deine Datenschutzrechte ausüben.</p></header>

  <section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/datenschutz" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200"><FileText className="h-6 w-6 text-blue-600"/><h2 className="mt-4 text-xl font-black">Datenschutzerklärung</h2><p className="mt-2 text-sm text-slate-500">Welche Daten JobMatch24 verarbeitet, warum und mit welchen Dienstleistern.</p></Link><Link href={editHref} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200"><Eye className="h-6 w-6 text-blue-600"/><h2 className="mt-4 text-xl font-black">Daten berichtigen</h2><p className="mt-2 text-sm text-slate-500">Falsche oder veraltete Profilangaben kannst du direkt bearbeiten.</p></Link></section>

  {role === "employee" && <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Lock className="h-5 w-5 text-blue-600"/><h2 className="text-xl font-black">Sichtbarkeit</h2></div><div className="mt-5 space-y-3"><label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><input type="checkbox" checked={profileVisible} disabled={busy==="profile_visible"} onChange={e=>updateVisibility("profile_visible",e.target.checked)} className="mt-1 h-4 w-4"/><span><b>Profil für Arbeitgeber sichtbar</b><small className="mt-1 block text-sm text-slate-500">Wenn deaktiviert, erscheint dein Profil nicht in der Kandidatensuche.</small></span></label><label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><input type="checkbox" checked={contactVisible} disabled={busy==="contact_visible"} onChange={e=>updateVisibility("contact_visible",e.target.checked)} className="mt-1 h-4 w-4"/><span><b>Kontaktaufnahme erlauben</b><small className="mt-1 block text-sm text-slate-500">Arbeitgeber dürfen dir Kontaktanfragen über JobMatch24 senden.</small></span></label></div></section>}

  <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Download className="h-5 w-5 text-blue-600"/><h2 className="text-xl font-black">Auskunft & Datenexport</h2></div><p className="mt-2 text-sm text-slate-500">Lade die aktuell über dein Konto verfügbaren personenbezogenen Daten als JSON-Datei herunter.</p><button onClick={exportData} disabled={busy==="export"} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">{busy==="export"?"Export wird erstellt…":"Meine Daten herunterladen"}</button></section>

  <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Datenschutzrechte</h2><p className="mt-2 text-sm leading-6 text-slate-500">Du kannst jederzeit Auskunft, Berichtigung, Löschung oder Widerspruch verlangen. Auskunfts- und Berichtigungsanfragen werden als Anfrage gespeichert und können vom Betreiber bearbeitet werden.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={()=>submitRequest("access")} disabled={Boolean(busy)} className="rounded-xl border border-slate-200 px-4 py-3 text-left font-bold hover:bg-slate-50">Auskunft anfordern</button><button onClick={()=>submitRequest("rectification")} disabled={Boolean(busy)} className="rounded-xl border border-slate-200 px-4 py-3 text-left font-bold hover:bg-slate-50">Berichtigung anfordern</button><button onClick={()=>submitRequest("objection")} disabled={Boolean(busy)} className="rounded-xl border border-slate-200 px-4 py-3 text-left font-bold hover:bg-slate-50">Widerspruch einreichen</button><button onClick={deleteAccount} disabled={Boolean(busy)} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left font-bold text-red-700 hover:bg-red-100"><Trash2 className="mr-2 inline h-4 w-4"/>{busy==="delete"?"Konto wird gelöscht…":"Konto endgültig löschen"}</button></div></section>

  {notice&&<div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{notice}</div>}
  <p className="mt-6 text-xs leading-5 text-slate-500">Hinweis: Gesetzliche Aufbewahrungspflichten oder berechtigte Gründe können in Einzelfällen dazu führen, dass einzelne Daten nicht sofort oder nicht vollständig gelöscht werden. Der EDÖB weist darauf hin, dass Auskunftsgesuche grundsätzlich ohne Begründung möglich sind und die betroffene Person ihre Daten berichtigen oder löschen lassen kann.</p>
  </div></main>
}
