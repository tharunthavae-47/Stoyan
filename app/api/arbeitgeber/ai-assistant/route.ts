import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna"

type ChatMessage = { role: "user" | "assistant"; content: string }

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: "Bitte zuerst einloggen." }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]).slice(-12) : []
    if (!messages.length) return NextResponse.json({ error: "Keine Nachricht erhalten." }, { status: 400 })

    // All context comes from JobMatch24 and is queried with the logged-in user's session.
    const [{ data: company }, { data: candidates }, { data: requests }] = await Promise.all([
      supabase.from("companies").select("name,industry,city").eq("owner_id", user.id).maybeSingle(),
      supabase.from("employer_candidate_profiles").select("id,profession,education,years_experience,desired_employment_percent,desired_salary_min,skills,contact_visible,first_name,last_name,city,avatar_url"),
      supabase.from("contact_requests").select("employee_id,status,job_id,created_at").eq("employer_id", user.id),
    ])

    const context = {
      company: company || null,
      candidates: (candidates || []).map((candidate) => ({
        ...candidate,
        // Do not expose contact details to the model through this endpoint.
        avatar_url: undefined,
      })),
      contact_requests: requests || [],
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Der KI-Assistent ist noch nicht vollständig eingerichtet. OPENAI_API_KEY fehlt in den Server-Umgebungsvariablen." }, { status: 503 })
    }

    const system = `Du bist der persönliche KI-Assistent von jobmatch24 für Arbeitgeber. Du arbeitest ausschließlich innerhalb der JobMatch24-Plattform.

WICHTIG:
- Nutze ausschließlich die unten gelieferten JobMatch24-Daten.
- Keine Websuche, keine Google-Suche, keine externen Quellen und keine erfundenen Kandidaten.
- Wenn Informationen fehlen, sage klar, dass sie im System nicht vorhanden sind.
- Hilf beim Suchen, Vergleichen, Zusammenfassen und Priorisieren von Kandidaten anhand berufsbezogener Kriterien wie Beruf, Erfahrung, Ausbildung, Skills, Pensum, Wunschlohn und Ort.
- Gib keine Empfehlung aufgrund geschützter oder persönlicher Merkmale wie Geschlecht, Herkunft, Religion, Alter oder Gesundheit.
- Die endgültige Einstellungsentscheidung trifft immer der Arbeitgeber.
- Antworte auf Deutsch, kurz und praktisch. Wenn du Kandidaten nennst, verwende Name, Beruf, Ort, Erfahrung, Pensum, Skills und eine kurze Begründung.

AKTUELLE JOBMATCH24-DATEN:
${JSON.stringify(context)}`

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: system,
        input: messages,
        max_output_tokens: 900,
      }),
    })

    const result = await openAiResponse.json()
    if (!openAiResponse.ok) {
      console.error("OpenAI error", result)
      return NextResponse.json({ error: result?.error?.message || "Die KI konnte nicht antworten." }, { status: 502 })
    }

    const message = typeof result.output_text === "string"
      ? result.output_text
      : result.output?.flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || []).find((content: { type?: string; text?: string }) => content.type === "output_text")?.text

    if (!message) return NextResponse.json({ error: "Die KI hat keine Antwort zurückgegeben." }, { status: 502 })
    return NextResponse.json({ message })
  } catch (error) {
    console.error("Employer AI assistant error", error)
    return NextResponse.json({ error: "Der KI-Assistent konnte die Anfrage nicht verarbeiten." }, { status: 500 })
  }
}
