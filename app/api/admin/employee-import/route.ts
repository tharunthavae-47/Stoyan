import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function adminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let value = ""
  let quoted = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && quoted && next === '"') {
      value += '"'
      i += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if ((char === "," || char === ";" || char === "\t") && !quoted) {
      values.push(value.trim())
      value = ""
    } else {
      value += char
    }
  }

  values.push(value.trim())
  return values
}

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
}

function getField(row: Record<string, string>, names: string[]) {
  for (const name of names) {
    const value = row[normalizeHeader(name)]
    if (value) return value.trim()
  }
  return ""
}

function parseBoolean(value: string, fallback = false) {
  if (!value) return fallback
  return ["true", "1", "ja", "yes", "x"].includes(value.toLowerCase())
}

function parseNumber(value: string) {
  if (!value) return null
  const normalized = value.replace(/'/g, "").replace(/\s/g, "").replace(/,/g, ".")
  const number = Number(normalized)
  return Number.isFinite(number) ? number : null
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY fehlt in den Umgebungsvariablen." }, { status: 500 })
    }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "employer") {
      return NextResponse.json({ error: "Nur ein angemeldeter Arbeitgeber darf Arbeitnehmer importieren." }, { status: 403 })
    }

    const body = await request.json()
    const csv = typeof body?.csv === "string" ? body.csv : ""
    const defaultPassword = typeof body?.defaultPassword === "string" ? body.defaultPassword : ""

    if (!csv.trim()) {
      return NextResponse.json({ error: "Keine Importdaten erhalten." }, { status: 400 })
    }
    if (defaultPassword.length < 8) {
      return NextResponse.json({ error: "Das Startpasswort muss mindestens 8 Zeichen haben." }, { status: 400 })
    }

    const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line: string) => line.trim())
    if (lines.length < 2) {
      return NextResponse.json({ error: "Die Datei braucht eine Kopfzeile und mindestens eine Arbeitnehmer-Zeile." }, { status: 400 })
    }

    const headers = parseCsvLine(lines[0]).map(normalizeHeader)
    const rows = lines.slice(1).map((line: string) => {
      const values = parseCsvLine(line)
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
    })

    const admin = adminClient()
    const results: Array<{ row: number; email: string; status: "created" | "skipped" | "error"; message: string }> = []

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const rowNumber = index + 2
      const email = getField(row, ["email", "e-mail", "emailadresse", "mail"])
      const firstName = getField(row, ["vorname", "first name", "firstname"])
      const lastName = getField(row, ["nachname", "last name", "lastname"])
      const phone = getField(row, ["telefon", "phone", "tel"])
      const city = getField(row, ["ort", "stadt", "city"])
      const postalCode = getField(row, ["plz", "postleitzahl", "postal code", "postalcode"])
      const profession = getField(row, ["beruf", "profession"])
      const education = getField(row, ["ausbildung", "education"])
      const headline = getField(row, ["headline", "titel"])
      const bio = getField(row, ["bio", "beschreibung"])
      const yearsExperience = parseNumber(getField(row, ["erfahrung", "berufserfahrung", "years experience"]))
      const salaryMin = parseNumber(getField(row, ["wunschlohn min", "gehaltsminimum", "desired salary min"]))
      const salaryMax = parseNumber(getField(row, ["wunschlohn max", "gehaltsmaximum", "desired salary max"]))
      const employmentPercent = parseNumber(getField(row, ["pensum", "beschaeftigungsgrad", "employment percent"]))
      const remoteOk = parseBoolean(getField(row, ["remote", "remote ok"]))
      const shiftWorkOk = parseBoolean(getField(row, ["schicht", "schichtarbeit", "shift work"]))
      const drivingLicenseB = parseBoolean(getField(row, ["fuehrerschein b", "führerschein b", "fuehrerschein", "driving license b"]))
      const skills = getField(row, ["skills", "faehigkeiten", "fähigkeiten"]).split(/[;,|]/).map((v) => v.trim()).filter(Boolean)
      const languages = getField(row, ["sprachen", "languages"]).split(/[;,|]/).map((v) => v.trim()).filter(Boolean)

      if (!email || !email.includes("@")) {
        results.push({ row: rowNumber, email, status: "error", message: "Ungültige oder fehlende E-Mail." })
        continue
      }

      try {
        const { data: created, error: createError } = await admin.auth.admin.createUser({
          email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            role: "employee",
            first_name: firstName,
            last_name: lastName,
          },
        })

        if (createError) {
          if (createError.message.toLowerCase().includes("already") || createError.message.toLowerCase().includes("registered")) {
            results.push({ row: rowNumber, email, status: "skipped", message: "E-Mail ist bereits registriert." })
          } else {
            results.push({ row: rowNumber, email, status: "error", message: createError.message })
          }
          continue
        }

        const userId = created.user.id

        const { error: profileInsertError } = await admin.from("profiles").upsert({
          id: userId,
          role: "employee",
          first_name: firstName || null,
          last_name: lastName || null,
          email,
          phone: phone || null,
          city: city || null,
          postal_code: postalCode || null,
        }, { onConflict: "id" })

        if (profileInsertError) {
          await admin.auth.admin.deleteUser(userId)
          throw new Error(`Profil konnte nicht erstellt werden: ${profileInsertError.message}`)
        }

        const { error: employeeProfileError } = await admin.from("employee_profiles").upsert({
          id: userId,
          headline: headline || null,
          profession: profession || null,
          bio: bio || null,
          education: education || null,
          years_experience: yearsExperience ?? 0,
          desired_salary_min: salaryMin,
          desired_salary_max: salaryMax,
          desired_employment_percent: employmentPercent ?? 100,
          remote_ok: remoteOk,
          shift_work_ok: shiftWorkOk,
          driving_license_b: drivingLicenseB,
          skills,
          languages,
          profile_visible: true,
          contact_visible: true,
        }, { onConflict: "id" })

        if (employeeProfileError) {
          await admin.auth.admin.deleteUser(userId)
          throw new Error(`Arbeitnehmerprofil konnte nicht erstellt werden: ${employeeProfileError.message}`)
        }

        results.push({ row: rowNumber, email, status: "created", message: "Konto und Arbeitnehmerprofil erstellt." })
      } catch (error) {
        results.push({ row: rowNumber, email, status: "error", message: error instanceof Error ? error.message : "Unbekannter Fehler" })
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        created: results.filter((r) => r.status === "created").length,
        skipped: results.filter((r) => r.status === "skipped").length,
        errors: results.filter((r) => r.status === "error").length,
      },
      results,
    })
  } catch (error) {
    console.error("Employee import error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import fehlgeschlagen." }, { status: 500 })
  }
}
