"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, CheckCircle2, FileSpreadsheet, Upload, XCircle } from "lucide-react"

 type ImportResult = {
  row: number
  email: string
  status: "created" | "skipped" | "error"
  message: string
}

export default function ArbeitnehmerImportPage() {
  const [csv, setCsv] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<ImportResult[]>([])
  const [summary, setSummary] = useState<{ total: number; created: number; skipped: number; errors: number } | null>(null)

  function readFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => setCsv(String(reader.result || ""))
    reader.readAsText(file, "UTF-8")
  }

  async function importEmployees() {
    setError("")
    setSummary(null)
    setResults([])

    if (!csv.trim()) {
      setError("Bitte zuerst eine CSV-Datei aus Excel auswählen oder die Daten einfügen.")
      return
    }
    if (password.length < 8) {
      setError("Das Startpasswort muss mindestens 8 Zeichen haben.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/employee-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, defaultPassword: password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Import fehlgeschlagen.")
      setSummary(data.summary)
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import fehlgeschlagen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <Link href="/arbeitgeber" className="ed-btn-ghost inline-flex">
        <ArrowLeft className="h-4 w-4" />Zurück zum Dashboard
      </Link>

      <div className="mt-8 max-w-5xl">
        <div className="flex items-start gap-4 border-b border-[#e2e7ee] pb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] border border-[#e2e7ee] text-[var(--brand)]">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <p className="ed-eyebrow">Arbeitnehmer verwalten</p>
            <h1 className="mt-3 text-4xl font-light tracking-[-0.03em] text-[var(--navy)] text-balance">Arbeitnehmer importieren</h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-[var(--muted)]">Importiere mehrere Arbeitnehmer auf einmal. Für jeden Datensatz wird automatisch ein echtes Supabase-Anmeldekonto mit eigener UUID erstellt.</p>
          </div>
        </div>

        <div className="ed-card ed-card-pad mt-8">
          <h2 className="text-xl font-normal tracking-tight text-[var(--navy)]">1. Excel-Datei vorbereiten</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Speichere deine Excel-Datei als <strong className="font-medium text-[var(--navy)]">CSV UTF-8</strong>. Eine ID-Spalte brauchst du nicht. Die E-Mail ist die einzige Pflichtangabe.</p>
          <div className="mt-5 border border-[#e2e7ee] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
            <strong className="font-medium text-[var(--navy)]">Unterstützte Spalten:</strong> Vorname, Nachname, E-Mail, Telefon, Ort, PLZ, Beruf, Ausbildung, Headline, Bio, Erfahrung, Wunschlohn min, Wunschlohn max, Pensum, Remote, Schicht, Führerschein B, Skills, Sprachen.
          </div>

          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--line-strong)] bg-white p-10 text-center transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/50">
            <Upload className="h-8 w-8 text-[var(--brand)]" />
            <span className="mt-3 font-medium text-[var(--navy)]">CSV aus Excel auswählen</span>
            <span className="mt-1 text-sm text-[var(--muted)]">Alternativ kannst du die CSV unten direkt einfügen.</span>
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) readFile(file) }} />
          </label>

          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={12} placeholder={'Vorname;Nachname;E-Mail;Telefon;Ort;PLZ;Beruf;Ausbildung\nMax;Muster;max@example.com;+41791234567;Luzern;6000;Mechaniker;EFZ'} className="ed-input mt-5 w-full font-mono text-sm" />

          <h2 className="mt-8 text-xl font-normal tracking-tight text-[var(--navy)]">2. Startpasswort festlegen</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Dieses Passwort wird für alle neu importierten Arbeitnehmer gesetzt. Sie können es später über „Passwort vergessen“ ändern.</p>
          <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Startpasswort (mind. 8 Zeichen)" className="ed-input mt-4 w-full max-w-xl" />

          <button type="button" onClick={() => void importEmployees()} disabled={loading} className="ed-btn-primary mt-6">
            <Upload className="h-4 w-4" />{loading ? "Arbeitnehmer werden erstellt…" : "Arbeitnehmer importieren"}
          </button>

          {error && <div className="alert-error mt-5 text-sm font-medium">{error}</div>}
        </div>

        {summary && <div className="mt-6 grid gap-px overflow-hidden rounded-[6px] border border-[#e2e7ee] bg-[#e2e7ee] sm:grid-cols-4">
          <div className="bg-white p-5"><p className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Gesamt</p><p className="ed-metric mt-3">{summary.total}</p></div>
          <div className="bg-white p-5"><p className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Erstellt</p><p className="ed-metric mt-3 text-emerald-600">{summary.created}</p></div>
          <div className="bg-white p-5"><p className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Übersprungen</p><p className="ed-metric mt-3 text-amber-600">{summary.skipped}</p></div>
          <div className="bg-white p-5"><p className="text-[0.72rem] font-semibold uppercase tracking-wider text-[var(--muted-light)]">Fehler</p><p className="ed-metric mt-3 text-red-600">{summary.errors}</p></div>
        </div>}

        {results.length > 0 && <div className="ed-card ed-card-pad mt-6">
          <h2 className="text-xl font-normal tracking-tight text-[var(--navy)]">Import-Ergebnis</h2>
          <div className="mt-4 divide-y divide-[#e2e7ee] border-y border-[#e2e7ee]">
            {results.map((result) => <div key={`${result.row}-${result.email}`} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-medium text-[var(--navy)]">Zeile {result.row} · {result.email}</p><p className="mt-1 text-sm text-[var(--muted)]">{result.message}</p></div>
              {result.status === "created" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : result.status === "skipped" ? <span className="ed-chip ed-chip-amber">Übersprungen</span> : <XCircle className="h-5 w-5 shrink-0 text-red-600" />}
            </div>)}
          </div>
        </div>}
      </div>
    </div>
  )
}
