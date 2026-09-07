import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"
const FALLBACK_MODELS = [PRIMARY_MODEL, "gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"].filter((model, index, models) => models.indexOf(model) === index)

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
type SearchCriteria = { name?: string; profession?: string; city?: string; education?: string; minExperience?: number; minEmployment?: number; maxSalary?: number; minSalary?: number; skill?: string }

function shouldTryFallback(status: number) { return status === 429 || status === 500 || status === 502 || status === 503 || status === 504 }
function normalize(value: unknown) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() }
function candidateName(candidate: Candidate) { return `${candidate.first_name || "Kandidat"} ${candidate.last_name || ""}`.trim() }
function profileIntent(text: string) { return /(profil|profile|details|detail|mehr uber|mehr ueber|infos|informationen|zeige|zeig)/.test(normalize(text)) }
function pronounProfileRequest(text: string) { return /(ihr|ihre|ihn|ihm|dieser|diese|den kandidat|die kandidat)/.test(normalize(text)) && profileIntent(text) }

function extractNumber(text: string, pattern: RegExp) {
  const match = text.match(pattern)
  return match ? Number(match[1].replace(/[.'\s]/g, "").replace(/,/g, ".")) : undefined
}

function parseSearchCriteria(query: string, candidates: Candidate[]): SearchCriteria {
  const q = normalize(query)
  const criteria: SearchCriteria = {}

  const name = candidates.find((candidate) => {
    const full = normalize(candidateName(candidate)); const first = normalize(candidate.first_name); const last = normalize(candidate.last_name)
    return full !== "kandidat" && (q.includes(full) || (first && last && q.includes(first) && q.includes(last)))
  })
  if (name) criteria.name = normalize(candidateName(name))

  const professions = Array.from(new Set(candidates.map((c) => c.profession).filter((p): p is string => Boolean(p)))).sort((a, b) => b.length - a.length)
  const profession = professions.find((p) => q.includes(normalize(p)))
  if (profession) criteria.profession = profession

  const cities = Array.from(new Set(candidates.map((c) => c.city).filter((c): c is string => Boolean(c)))).sort((a, b) => b.length - a.length)
  const city = cities.find((c) => q.includes(normalize(c)))
  if (city) criteria.city = city

  const education = ["universität", "universitaet", "fachhochschule", "fachschule", "hf", "fh", "efz", "eba"].find((value) => q.includes(value))
  if (education) criteria.education = education

  const experience = extractNumber(q, /(?:mindestens|min\.?|mehr als|über|ueber|ab)\s*(\d+)\s*(?:jahre?|jahren)?/) || extractNumber(q, /(\d+)\s*\+\s*(?:jahre?|jahren)/)
  if (experience !== undefined) criteria.minExperience = experience

  const employment = extractNumber(q, /(?:mindestens|min\.?|ab|mit)\s*(\d{2,3})\s*(?:%|prozent)/) || extractNumber(q, /(\d{2,3})\s*(?:%|prozent)/)
  if (employment !== undefined && employment >= 20 && employment <= 100) criteria.minEmployment = employment

  const salary = extractNumber(q, /(?:bis|max(?:imal)?|unter|höchstens|hoechstens)\s*(?:chf\s*)?([\d'\s.,]+)/) || extractNumber(q, /(?:wunschlohn|lohn|gehalt)\s*(?:von\s*)?(?:chf\s*)?([\d'\s.,]+)/)
  if (salary !== undefined && salary > 500) {
    if (/(?:mindestens|ab|mehr als)/.test(q) && /(?:lohn|gehalt|chf)/.test(q)) criteria.minSalary = salary
    else criteria.maxSalary = salary
  }

  const skills = Array.from(new Set(candidates.flatMap((c) => Array.isArray(c.skills) ? c.skills : []).filter((s): s is string => typeof s === "string" && s.trim().length > 0))).sort((a, b) => b.length - a.length)
  const skill = skills.find((s) => q.includes(normalize(s)))
  if (skill) criteria.skill = skill

  return criteria
}

function filterCandidates(candidates: Candidate[], criteria: SearchCriteria) {
  return candidates.filter((candidate) => {
    if (criteria.name && normalize(candidateName(candidate)) !== criteria.name) return false
    if (criteria.profession && !normalize(candidate.profession).includes(normalize(criteria.profession))) return false
    if (criteria.city && !normalize(candidate.city).includes(normalize(criteria.city))) return false
    if (criteria.education && !normalize(candidate.education).includes(normalize(criteria.education))) return false
    if (criteria.minExperience !== undefined && (candidate.years_experience ?? 0) < criteria.minExperience) return false
    if (criteria.minEmployment !== undefined && (candidate.desired_employment_percent ?? 0) < criteria.minEmployment) return false
    if (criteria.maxSalary !== undefined && (candidate.desired_salary_min == null || candidate.desired_salary_min > criteria.maxSalary)) return false
    if (criteria.minSalary !== undefined && (candidate.desired_salary_min == null || candidate.desired_salary_min < criteria.minSalary)) return false
    if (criteria.skill && !(Array.isArray(candidate.skills) && candidate.skills.some((s) => normalize(s).includes(normalize(criteria.skill!))))) return false
    return true
  })
}

function findReferencedProfiles(messages: ChatMessage[], candidates: Candidate[]) {
  const latest = messages[messages.length - 1]?.content || ""
  if (!profileIntent(latest)) return []
  const explicit = filterCandidates(candidates, parseSearchCriteria(latest, candidates))
  if (explicit.length && parseSearchCriteria(latest, candidates).name) return explicit
  if (pronounProfileRequest(latest)) {
    for (let i = messages.length - 2; i >= 0; i--) {
      const previous = messages[i]?.content || ""
      const criteria = parseSearchCriteria(previous, candidates)
      if (criteria.name) return filterCandidates(candidates, criteria)
    }
  }
  return []
}

function isBestSearch(query: string) { return /(beste|besten|bester|passendste|passendsten|geeignetste|geeignetsten|top)/.test(normalize(query)) }
function educationScore(education: string | null) { const value = normalize(education); if (value.includes("efz")) return 3; if (value.includes("eba")) return 2; return value ? 1 : 0 }
function sortCandidatesForBestSearch(candidates: Candidate[]) { return [...candidates].sort((a, b) => { const experience = (b.years_experience ?? -1) - (a.years_experience ?? -1); if (experience !== 0) return experience; const education = educationScore(b.education) - educationScore(a.education); if (education !== 0) return education; return (b.desired_employment_percent ?? -1) - (a.desired_employment_percent ?? -1) }) }
function formatCandidateSearch(query: string, candidates: Candidate[]) {
  const sorted = isBestSearch(query) ? sortCandidatesForBestSearch(candidates) : candidates
  const lines = [`${sorted.length} passende Kandidaten gefunden`, ""]
  sorted.forEach((candidate, index) => {
    const skills = Array.isArray(candidate.skills) && candidate.skills.length ? candidate.skills.join(", ") : "keine Angaben"
    lines.push(`${index + 1}. ${candidateName(candidate)}`)
    lines.push(`${candidate.profession || "Beruf nicht angegeben"}, ${candidate.city || "Ort nicht angegeben"}`)
    lines.push(`${candidate.education || "Ausbildung nicht angegeben"}, ${candidate.years_experience ?? 0} Jahre Erfahrung, ${candidate.desired_employment_percent ?? 100} Prozent`)
    lines.push(`Wunschlohn: ${candidate.desired_salary_min == null ? "nicht angegeben" : `CHF ${candidate.desired_salary_min}`}`)
    lines.push(`Skills: ${skills}`)
  })
  return { message: lines.join("\n"), candidates: sorted }
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
    if (companyError || candidatesError || requestsError) return NextResponse.json({ error: "Die JobMatch24-Daten konnten nicht vollständig geladen werden." }, { status: 500 })

    const candidateRows = (candidates || []) as Candidate[]
    const latest = messages[messages.length - 1]?.content || ""
    const referencedProfiles = findReferencedProfiles(messages, candidateRows)
    if (referencedProfiles.length > 0) return NextResponse.json({ message: referencedProfiles.length === 1 ? `Profil von ${candidateName(referencedProfiles[0])}` : `${referencedProfiles.length} Profile gefunden`, candidates: referencedProfiles, model: "JobMatch24 Profilansicht", candidateCount: referencedProfiles.length })

    // The AI assistant understands the same seven filters as the employer search page.
    const criteria = parseSearchCriteria(latest, candidateRows)
    if (Object.keys(criteria).length > 0) {
      const matches = filterCandidates(candidateRows, criteria)
      const formatted = formatCandidateSearch(latest, matches)
      return NextResponse.json({ message: formatted.message, candidates: formatted.candidates, model: "JobMatch24 Kandidatensuche", candidateCount: matches.length, filters: criteria })
    }

    const context = { company: company || null, candidate_count: candidateRows.length, candidates: candidateRows, contact_requests: requests || [] }
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) return NextResponse.json({ error: "Der KI-Assistent ist noch nicht vollständig eingerichtet. Bitte hinterlege GEMINI_API_KEY oder GOOGLE_API_KEY in den Vercel Server-Umgebungsvariablen und deploye danach neu." }, { status: 503 })
    const system = `Du bist der persönliche KI-Assistent von JobMatch24 für Arbeitgeber. Nutze ausschließlich die gelieferten JobMatch24-Daten. Keine Websuche und keine erfundenen Kandidaten. Hilf beim Suchen, Vergleichen und Zusammenfassen nach Beruf, Ort, Ausbildung, Erfahrung, Skills, Pensum und Wunschlohn. Keine Empfehlungen anhand geschützter Merkmale. Antworte in sauberem Klartext ohne Markdown.\n\nDATEN:\n${JSON.stringify(context)}`
    const contents = messages.map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }))
    let lastResult: any = null; let lastStatus = 502
    for (const model of FALLBACK_MODELS) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: "POST", headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 1200 } }) })
      const result = await response.json(); lastResult = result; lastStatus = response.status
      if (response.ok) {
        const message = result?.candidates?.[0]?.content?.parts?.filter((part: { text?: string }) => typeof part.text === "string").map((part: { text: string }) => part.text).join("\n").trim()
        if (message) return NextResponse.json({ message, model, candidateCount: candidateRows.length })
      }
      if (!shouldTryFallback(response.status)) break
    }
    return NextResponse.json({ error: lastResult?.error?.message || "Die KI ist momentan stark ausgelastet. Bitte versuche es gleich nochmals." }, { status: lastStatus })
  } catch (error) {
    console.error("Employer AI assistant error", error)
    return NextResponse.json({ error: "Der KI-Assistent konnte die Anfrage nicht verarbeiten." }, { status: 500 })
  }
}
