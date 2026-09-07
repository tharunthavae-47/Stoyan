import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"
const FALLBACK_MODELS = [
  PRIMARY_MODEL,
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
].filter((model, index, models) => models.indexOf(model) === index)

type ChatMessage = { role: "user" | "assistant"; content: string }
type Candidate = {
  id: string
  profession: string | null
  education: string | null
  years_experience: number | null
  desired_employment_percent: number | null
  desired_salary_min: number | null
  skills: string[] | null
  contact_visible: boolean | null
  first_name: string | null
  last_name: string | null
  city: string | null
}

function shouldTryFallback(status: number) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

function normalize(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function looksLikeCandidateSearch(text: string) {
  const q = normalize(text)
  return /(kandidat|kandidaten|bewerber|bewerberin|arbeitnehmer|mitarbeiter|profil|profiles|wer sind|welche|zeig|finde|suche|passend)/.test(q)
}

function findProfessionMatches(query: string, candidates: Candidate[]) {
  const q = normalize(query)
  if (!looksLikeCandidateSearch(q)) return []

  const professions = Array.from(
    new Set(
      candidates
        .map((candidate) => candidate.profession)
        .filter((profession): profession is string => Boolean(profession))
        .map((profession) => profession.trim()),
    ),
  )

  const matchingProfessions = professions.filter((profession) => {
    const p = normalize(profession)
    const words = p.split(/[^a-z0-9]+/).filter((word) => word.length >= 4)
    return p.length >= 4 && (q.includes(p) || words.some((word) => q.includes(word)))
  })

  if (!matchingProfessions.length) return []

  return candidates.filter((candidate) => {
    const profession = normalize(candidate.profession)
    return matchingProfessions.some((match) => profession === normalize(match) || profession.includes(normalize(match)))
  })
}

function candidateName(candidate: Candidate) {
  return `${candidate.first_name || "Kandidat"} ${candidate.last_name || ""}`.trim()
}

function candidateSummary(candidate: Candidate) {
  const skills = Array.isArray(candidate.skills) && candidate.skills.length ? candidate.skills.join(", ") : "keine Skills angegeben"
  return `${candidateName(candidate)} | ${candidate.profession || "Beruf nicht angegeben"} | ${candidate.city || "Ort offen"} | ${candidate.years_experience ?? 0} Jahre Erfahrung | ${candidate.desired_employment_percent ?? 100}% | Wunschlohn ${candidate.desired_salary_min == null ? "nicht angegeben" : `CHF ${candidate.desired_salary_min}`} | Skills: ${skills}`
}

function isBestSearch(query: string) {
  const q = normalize(query)
  return /(beste|besten|bester|besten|passendste|passendsten|geeignetste|geeignetsten|top)/.test(q)
}

function educationScore(education: string | null) {
  const value = normalize(education)
  if (value.includes("efz")) return 3
  if (value.includes("eba")) return 2
  return value ? 1 : 0
}

function sortCandidatesForBestSearch(candidates: Candidate[]) {
  return [...candidates].sort((a, b) => {
    const experience = (b.years_experience ?? -1) - (a.years_experience ?? -1)
    if (experience !== 0) return experience

    const education = educationScore(b.education) - educationScore(a.education)
    if (education !== 0) return education

    return (b.desired_employment_percent ?? -1) - (a.desired_employment_percent ?? -1)
  })
}

function formatCandidateSearch(query: string, candidates: Candidate[]) {
  const sortedCandidates = isBestSearch(query) ? sortCandidatesForBestSearch(candidates) : candidates
  const bestSearch = isBestSearch(query)
  const lines = [`${sortedCandidates.length} passende Kandidaten gefunden`, ""]

  sortedCandidates.forEach((candidate, index) => {
    const skills = Array.isArray(candidate.skills) && candidate.skills.length
      ? candidate.skills.join(", ")
      : "keine Angaben"

    lines.push(`${index + 1}. ${candidateName(candidate)}`)
    lines.push(`${candidate.profession || "Beruf nicht angegeben"}, ${candidate.city || "Ort nicht angegeben"}`)
    lines.push(`${candidate.education || "Ausbildung nicht angegeben"}, ${candidate.years_experience ?? 0} Jahre Erfahrung, ${candidate.desired_employment_percent ?? 100} Prozent`)
    lines.push(`Wunschlohn: ${candidate.desired_salary_min == null ? "nicht angegeben" : `CHF ${candidate.desired_salary_min}`}`)
    lines.push(`Skills: ${skills}`)

    if (bestSearch) {
      const reasons: string[] = []
      if ((candidate.years_experience ?? 0) > 0) reasons.push(`${candidate.years_experience} Jahre Berufserfahrung`)
      if (candidate.education) reasons.push(candidate.education)
      if ((candidate.desired_employment_percent ?? 0) > 0) reasons.push(`${candidate.desired_employment_percent} Prozent Pensum`)
      if (reasons.length) lines.push(`Grund: ${reasons.slice(0, 2).join(" und ")}`)
    }

    if (index < sortedCandidates.length - 1) lines.push("")
  })

  return lines.join("\n")
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: "Bitte zuerst einloggen." }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]).slice(-12) : []
    if (!messages.length) return NextResponse.json({ error: "Keine Nachricht erhalten." }, { status: 400 })

    const [{ data: company, error: companyError }, { data: candidates, error: candidatesError }, { data: requests, error: requestsError }] = await Promise.all([
      supabase.from("companies").select("name,industry,city").eq("owner_id", user.id).maybeSingle(),
      supabase.from("employer_candidate_profiles").select("id,profession,education,years_experience,desired_employment_percent,desired_salary_min,skills,contact_visible,first_name,last_name,city"),
      supabase.from("contact_requests").select("employee_id,status,job_id,created_at").eq("employer_id", user.id),
    ])

    if (companyError || candidatesError || requestsError) {
      console.error("JobMatch24 data error", { companyError, candidatesError, requestsError })
      return NextResponse.json({ error: "Die JobMatch24-Daten konnten nicht vollständig geladen werden." }, { status: 500 })
    }

    const candidateRows = (candidates || []) as Candidate[]
    const latestUserMessage = messages[messages.length - 1]?.content || ""
    const exactMatches = findProfessionMatches(latestUserMessage, candidateRows)

    // Kandidatensuchen werden serverseitig formatiert. So bleibt die Trefferliste
    // vollständig und das Layout bleibt unabhängig von Geminis Antwort sauber.
    if (exactMatches.length > 0) {
      return NextResponse.json({
        message: formatCandidateSearch(latestUserMessage, exactMatches),
        model: "JobMatch24 Kandidatensuche",
        candidateCount: exactMatches.length,
      })
    }

    const context = {
      company: company || null,
      candidate_count: candidateRows.length,
      candidates: candidateRows,
      contact_requests: requests || [],
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Der KI-Assistent ist noch nicht vollständig eingerichtet. Bitte hinterlege GEMINI_API_KEY oder GOOGLE_API_KEY in den Vercel Server-Umgebungsvariablen und deploye danach neu." }, { status: 503 })
    }

    const system = `Du bist der persönliche KI-Assistent von JobMatch24 für Arbeitgeber. Du arbeitest ausschließlich innerhalb der JobMatch24-Plattform.

WICHTIG:
- Nutze ausschließlich die unten gelieferten JobMatch24-Daten.
- Keine Websuche, keine Google-Suche, keine externen Quellen und keine erfundenen Kandidaten.
- Wenn Informationen fehlen, sage klar, dass sie im System nicht vorhanden sind.
- Hilf beim Suchen, Vergleichen, Zusammenfassen und Priorisieren von Kandidaten anhand berufsbezogener Kriterien wie Beruf, Erfahrung, Ausbildung, Skills, Pensum, Wunschlohn und Ort.
- Gib keine Empfehlung aufgrund geschützter oder persönlicher Merkmale wie Geschlecht, Herkunft, Religion, Alter oder Gesundheit.
- Die endgültige Einstellungsentscheidung trifft immer der Arbeitgeber.

FORMATIERUNG:
- Antworte ausschließlich als sauberer Klartext.
- Verwende KEINE Markdown-Formatierung.
- Keine Sternchen, keine Backticks, keine Emojis und keine dekorativen Sonderzeichen.
- Keine Tabellen und keine langen Trennlinien.
- Verwende einfache Überschriften und normale Zeilenumbrüche.
- Nummerierte Listen mit 1., 2., 3. sind erlaubt.
- Verwende "100 Prozent" statt "100%" und "CHF 5000" statt "CHF 5'000.-".
- Halte Antworten kurz, übersichtlich und vollständig.

AKTUELLE JOBMATCH24-DATEN:
${JSON.stringify(context)}`

    const contents = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }))

    let lastResult: any = null
    let lastStatus = 502

    for (const model of FALLBACK_MODELS) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: {
              maxOutputTokens: 1200,
            },
          }),
        },
      )

      const result = await geminiResponse.json()
      lastResult = result
      lastStatus = geminiResponse.status

      if (geminiResponse.ok) {
        const message = result?.candidates?.[0]?.content?.parts
          ?.filter((part: { text?: string }) => typeof part.text === "string")
          .map((part: { text: string }) => part.text)
          .join("\n")
          .trim()

        if (message) {
          return NextResponse.json({ message, model, candidateCount: candidateRows.length })
        }
      }

      console.warn(`Gemini model ${model} failed`, { status: geminiResponse.status, error: result?.error })

      if (!shouldTryFallback(geminiResponse.status)) break
    }

    console.error("All Gemini models failed", lastResult)
    return NextResponse.json({
      error: lastResult?.error?.message || "Die KI ist momentan stark ausgelastet. Bitte versuche es gleich nochmals.",
    }, { status: lastStatus })
  } catch (error) {
    console.error("Employer AI assistant error", error)
    return NextResponse.json({ error: "Der KI-Assistent konnte die Anfrage nicht verarbeiten." }, { status: 500 })
  }
}
