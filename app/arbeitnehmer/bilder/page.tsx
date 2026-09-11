"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Category = "lebenslauf" | "diplome" | "zeugnisse" | "arbeitszeugnisse" | "zertifikate" | "sonstige"
type DocumentRow = { id: string; category: Category; file_name: string; file_path: string; mime_type: string; file_size: number; created_at: string }

const CATEGORIES: { id: Category; title: string; description: string; icon: string }[] = [
  { id: "lebenslauf", title: "Lebenslauf", description: "Deinen aktuellen Lebenslauf hochladen", icon: "📄" },
  { id: "diplome", title: "Diplome & Abschlüsse", description: "Diplome, Ausbildungs- und Studienabschlüsse", icon: "🎓" },
  { id: "zeugnisse", title: "Zeugnisse", description: "Schul-, Ausbildungs- und andere Zeugnisse", icon: "📜" },
  { id: "arbeitszeugnisse", title: "Arbeitszeugnisse", description: "Arbeitszeugnisse und Referenzen", icon: "💼" },
  { id: "zertifikate", title: "Zertifikate & Kurse", description: "Weiterbildungen, Kurse und Zertifikate", icon: "🏆" },
  { id: "sonstige", title: "Weitere wichtige Dokumente", description: "Andere Dokumente, die für Arbeitgeber wichtig sind", icon: "📁" },
]

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function BilderPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [busy, setBusy] = useState<Category | null>(null)
  const [message, setMessage] = useState("")

  async function loadDocuments() {
    const s = createClient()
    const { data: { user } } = await s.auth.getUser()
    if (!user) { window.location.href = "/login"; return }
    const { data, error } = await s.from("employee_documents").select("id,category,file_name,file_path,mime_type,file_size,created_at").eq("employee_id", user.id).order("created_at", { ascending: false })
    if (error) setMessage(error.message)
    else setDocuments((data || []) as DocumentRow[])
  }

  useEffect(() => { loadDocuments() }, [])

  async function upload(category: Category, file: File | undefined) {
    if (!file) return
    setMessage("")
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) { setMessage("Bitte PDF, JPG, PNG oder WEBP verwenden."); return }
    if (file.size > 15 * 1024 * 1024) { setMessage("Maximal 15 MB pro Dokument."); return }

    setBusy(category)
    const s = createClient()
    const { data: { user } } = await s.auth.getUser()
    if (!user) { window.location.href = "/login"; return }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
    const path = `${user.id}/${category}/${Date.now()}-${safeName}`
    const uploadResult = await s.storage.from("employee-documents").upload(path, file, { contentType: file.type, upsert: false })
    if (uploadResult.error) { setMessage(uploadResult.error.message); setBusy(null); return }

    const row = await s.from("employee_documents").insert({ employee_id: user.id, category, file_name: file.name, file_path: path, mime_type: file.type, file_size: file.size })
    if (row.error) {
      await s.storage.from("employee-documents").remove([path])
      setMessage(row.error.message)
      setBusy(null)
      return
    }

    await loadDocuments()
    setMessage("Dokument erfolgreich hochgeladen.")
    setBusy(null)
  }

  async function remove(doc: DocumentRow) {
    const s = createClient()
    const result = await s.from("employee_documents").delete().eq("id", doc.id)
    if (result.error) { setMessage(result.error.message); return }
    await s.storage.from("employee-documents").remove([doc.file_path])
    setDocuments(x => x.filter(d => d.id !== doc.id))
  }

  async function openDocument(doc: DocumentRow) {
    const s = createClient()
    const { data, error } = await s.storage.from("employee-documents").createSignedUrl(doc.file_path, 60 * 10)
    if (error || !data?.signedUrl) { setMessage(error?.message || "Dokument konnte nicht geöffnet werden."); return }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-[#e2e7ee] pb-8">
          <p className="ed-eyebrow">Meine Unterlagen</p>
          <h1 className="mt-4 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] text-balance">Dein Profil. Deine Geschichte.</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">Lade deinen Lebenslauf, Diplome, Zeugnisse und weitere wichtige Unterlagen getrennt hoch. So können Arbeitgeber deine Qualifikationen besser kennenlernen.</p>
        </div>

        {message && <p className="mt-6 border-l-2 border-l-[var(--brand)] bg-[var(--brand-soft)] p-3 text-sm font-medium text-[var(--navy)]">{message}</p>}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {CATEGORIES.map(category => {
            const docs = documents.filter(d => d.category === category.id)
            return (
              <section key={category.id} className="ed-card ed-card-pad">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border border-[#e2e7ee] text-xl">{category.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-normal tracking-tight text-[var(--navy)]">{category.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{category.description}</p>
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-center justify-center border border-dashed border-[var(--brand)]/40 bg-[var(--brand-soft)]/50 px-4 py-3 text-sm font-medium text-[var(--brand)] transition hover:bg-[var(--brand-soft)]">
                  {busy === category.id ? "Hochladen…" : "+ Dokument hochladen"}
                  <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" disabled={busy !== null} onChange={e => { const file = e.target.files?.[0]; e.currentTarget.value = ""; upload(category.id, file) }} />
                </label>

                <div className="mt-4 space-y-2">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 border border-[#e2e7ee] bg-white p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--navy)]">{doc.file_name}</p>
                        <p className="text-xs text-[var(--muted)]">{formatSize(doc.file_size)}</p>
                      </div>
                      <button onClick={() => openDocument(doc)} className="text-sm font-medium text-[var(--brand)]">Öffnen</button>
                      <button onClick={() => remove(doc)} className="text-sm font-medium text-red-600">Löschen</button>
                    </div>
                  ))}
                  {!docs.length && <p className="text-center text-xs text-[var(--muted-light)]">Noch kein Dokument hochgeladen.</p>}
                </div>
              </section>
            )
          })}
        </div>

        <p className="mt-6 text-sm text-[var(--muted)]">Erlaubte Formate: PDF, JPG, PNG oder WEBP · maximal 15 MB pro Dokument.</p>
      </div>
    </div>
  )
}
