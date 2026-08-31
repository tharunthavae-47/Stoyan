"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Company = {
  name: string | null
  industry: string | null
  city: string | null
}

type RequestData = {
  id: string
  status: string
  created_at: string
  employer_id: string
  employee_id: string
  company: Company | null
}

type Message = {
  id: string
  contact_request_id: string
  sender_id: string
  message: string
  created_at: string
  read_at: string | null
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function ContactRequestPage({ params }: Props) {
  const [requestId, setRequestId] = useState<string | null>(null)
  const [request, setRequest] = useState<RequestData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const [messageText, setMessageText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  /*
   * =========================================================
   * REQUEST-ID AUS URL
   * =========================================================
   */

  useEffect(() => {
    let active = true

    params.then((value) => {
      if (active && value?.id) {
        setRequestId(value.id)
      }
    })

    return () => {
      active = false
    }
  }, [params])

  /*
   * =========================================================
   * ANFRAGE LADEN
   * =========================================================
   */

  useEffect(() => {
    if (!requestId) return

    let active = true

    async function loadRequest() {
      setLoading(true)
      setError("")
      setSuccess("")

      try {
        const supabase = createClient()

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          throw new Error(
            `Authentifizierung fehlgeschlagen: ${authError.message}`
          )
        }

        if (!user) {
          window.location.href = "/login"
          return
        }

        if (!active) return

        setUserId(user.id)

        const {
          data: requestData,
          error: requestError,
        } = await supabase
          .from("contact_requests")
          .select(
            "id,status,created_at,employer_id,employee_id"
          )
          .eq("id", requestId)
          .eq("employee_id", user.id)
          .maybeSingle()

        if (requestError) {
          throw new Error(
            `Anfrage konnte nicht geladen werden: ${requestError.message}`
          )
        }

        if (!requestData) {
          throw new Error(
            "Diese Anfrage wurde nicht gefunden oder du hast keinen Zugriff darauf."
          )
        }

        /*
         * WICHTIG:
         * Foreign-Key-IDs müssen vorhanden sein.
         */
        if (!requestData.employer_id) {
          throw new Error(
            "Die Arbeitgeber-ID dieser Anfrage fehlt."
          )
        }

        if (!requestData.employee_id) {
          throw new Error(
            "Die Arbeitnehmer-ID dieser Anfrage fehlt."
          )
        }

        /*
         * Firma laden
         */
        const {
          data: company,
          error: companyError,
        } = await supabase
          .from("companies")
          .select("name,industry,city")
          .eq("owner_id", requestData.employer_id)
          .maybeSingle()

        if (companyError) {
          console.error(
            "Firma konnte nicht geladen werden:",
            companyError
          )
        }

        if (!active) return

        const formattedRequest: RequestData = {
          id: requestData.id,
          status: requestData.status,
          created_at: requestData.created_at,
          employer_id: requestData.employer_id,
          employee_id: requestData.employee_id,
          company: company || null,
        }

        setRequest(formattedRequest)

        /*
         * Chat nur laden, wenn Anfrage angenommen wurde.
         */
        if (formattedRequest.status === "accepted") {
          await loadMessages(
            supabase,
            formattedRequest.id
          )
        }
      } catch (err) {
        console.error(
          "Fehler beim Laden der Anfrage:",
          err
        )

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Die Anfrage konnte nicht geladen werden."
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRequest()

    return () => {
      active = false
    }
  }, [requestId])

  /*
   * =========================================================
   * NACHRICHTEN LADEN
   * =========================================================
   */

  async function loadMessages(
    supabase: ReturnType<typeof createClient>,
    contactRequestId: string
  ) {
    setLoadingMessages(true)

    try {
      const {
        data,
        error: messagesError,
      } = await supabase
        .from("contact_messages")
        .select(
          "id,contact_request_id,sender_id,message,created_at,read_at"
        )
        .eq(
          "contact_request_id",
          contactRequestId
        )
        .order("created_at", {
          ascending: true,
        })

      if (messagesError) {
        throw new Error(
          messagesError.message
        )
      }

      setMessages(
        (data || []) as Message[]
      )
    } catch (err) {
      console.error(
        "Nachrichten konnten nicht geladen werden:",
        err
      )

      setError(
        err instanceof Error
          ? `Nachrichten konnten nicht geladen werden: ${err.message}`
          : "Nachrichten konnten nicht geladen werden."
      )
    } finally {
      setLoadingMessages(false)
    }
  }

  /*
   * =========================================================
   * REALTIME CHAT
   * =========================================================
   */

  useEffect(() => {
    if (
      !requestId ||
      !userId ||
      !request ||
      request.status !== "accepted"
    ) {
      return
    }

    const supabase = createClient()

    const channel = supabase
      .channel(
        `contact-messages-${requestId}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contact_messages",
          filter: `contact_request_id=eq.${requestId}`,
        },
        (payload) => {
          const newMessage =
            payload.new as Message

          setMessages((current) => {
            if (
              current.some(
                (message) =>
                  message.id ===
                  newMessage.id
              )
            ) {
              return current
            }

            return [
              ...current,
              newMessage,
            ]
          })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [
    requestId,
    userId,
    request?.status,
  ])

  /*
   * =========================================================
   * ANFRAGE ANNEHMEN
   * =========================================================
   */

  async function acceptRequest() {
    if (!request || !userId) {
      return
    }

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()

      const {
        data: updatedRequest,
        error: updateError,
      } = await supabase
        .from("contact_requests")
        .update({
          status: "accepted",
        })
        .eq("id", request.id)
        .eq("employee_id", userId)
        .select(
          "id,status,created_at,employer_id,employee_id"
        )
        .maybeSingle()

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht angenommen werden: ${updateError.message}`
        )
      }

      if (!updatedRequest) {
        throw new Error(
          "Die Anfrage konnte nicht aktualisiert werden. Prüfe die RLS-Regeln für contact_requests."
        )
      }

      /*
       * IDs nach Update nochmals prüfen.
       */
      if (!updatedRequest.employer_id) {
        throw new Error(
          "Die Arbeitgeber-ID der Anfrage fehlt."
        )
      }

      if (!updatedRequest.employee_id) {
        throw new Error(
          "Die Arbeitnehmer-ID der Anfrage fehlt."
        )
      }

      setRequest((current) =>
        current
          ? {
              ...current,
              status: "accepted",
              employer_id:
                updatedRequest.employer_id,
              employee_id:
                updatedRequest.employee_id,
            }
          : null
      )

      await loadMessages(
        supabase,
        request.id
      )

      setSuccess(
        "Anfrage angenommen. Du kannst jetzt privat mit dem Arbeitgeber chatten."
      )
    } catch (err) {
      console.error(
        "Anfrage annehmen:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Die Anfrage konnte nicht angenommen werden."
      )
    } finally {
      setActionLoading(false)
    }
  }

  /*
   * =========================================================
   * ANFRAGE ABLEHNEN
   * =========================================================
   */

  async function rejectRequest() {
    if (!request || !userId) {
      return
    }

    const confirmed = window.confirm(
      "Möchtest du diese Anfrage wirklich ablehnen?"
    )

    if (!confirmed) {
      return
    }

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()

      const {
        data: updatedRequest,
        error: updateError,
      } = await supabase
        .from("contact_requests")
        .update({
          status: "rejected",
        })
        .eq("id", request.id)
        .eq("employee_id", userId)
        .select(
          "id,status,created_at,employer_id,employee_id"
        )
        .maybeSingle()

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht abgelehnt werden: ${updateError.message}`
        )
      }

      if (!updatedRequest) {
        throw new Error(
          "Die Anfrage konnte nicht aktualisiert werden. Prüfe die RLS-Regeln für contact_requests."
        )
      }

      setRequest((current) =>
        current
          ? {
              ...current,
              status: "rejected",
            }
          : null
      )

      setSuccess(
        "Die Anfrage wurde abgelehnt."
      )
    } catch (err) {
      console.error(
        "Anfrage ablehnen:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Die Anfrage konnte nicht abgelehnt werden."
      )
    } finally {
      setActionLoading(false)
    }
  }

  /*
   * =========================================================
   * NACHRICHT SENDEN
   * =========================================================
   */

  async function sendMessage(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !request ||
      !userId ||
      request.status !== "accepted"
    ) {
      return
    }

    const text = messageText.trim()

    if (!text) {
      return
    }

    setSending(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()

      const {
        data: insertedMessage,
        error: sendError,
      } = await supabase
        .from("contact_messages")
        .insert({
          contact_request_id: request.id,
          sender_id: userId,
          message: text,
        })
        .select(
          "id,contact_request_id,sender_id,message,created_at,read_at"
        )
        .maybeSingle()

      if (sendError) {
        throw new Error(
          `Nachricht konnte nicht gesendet werden: ${sendError.message}`
        )
      }

      /*
       * Falls Realtime verzögert ist,
       * Nachricht sofort lokal anzeigen.
       */
      if (insertedMessage) {
        const newMessage =
          insertedMessage as Message

        setMessages((current) => {
          if (
            current.some(
              (message) =>
                message.id ===
                newMessage.id
            )
          ) {
            return current
          }

          return [
            ...current,
            newMessage,
          ]
        })
      }

      setMessageText("")
    } catch (err) {
      console.error(
        "Nachricht senden:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Die Nachricht konnte nicht gesendet werden."
      )
    } finally {
      setSending(false)
    }
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="card card-pad text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" />
        <p className="mt-5 font-semibold text-[var(--muted)]">
          Anfrage wird geladen…
        </p>
      </div>
    )
  }

  /*
   * =========================================================
   * NICHT GEFUNDEN
   * =========================================================
   */

  if (!request) {
    return (
      <div className="card card-pad border-[var(--danger)]/30">
        <h1 className="text-2xl font-black text-[var(--navy)]">
          Anfrage nicht gefunden
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {error ||
            "Diese Anfrage existiert nicht oder du hast keinen Zugriff darauf."}
        </p>
        <Link href="/arbeitnehmer" className="btn-primary mt-6 inline-flex">
          Zurück zum Dashboard
        </Link>
      </div>
    )
  }

  const companyName =
    request.company?.name ||
    "Unternehmen"

  /*
   * =========================================================
   * HAUPTANSICHT
   * =========================================================
   */

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-5xl">

        {/* FEHLER */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ERFOLG */}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* FIRMA */}

        <section className="card card-pad">

          <p className="text-sm font-black uppercase tracking-widest text-[var(--brand)]">
            Kontaktanfrage
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] text-3xl font-black text-white">
              {companyName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h1 className="text-3xl font-black">
                {companyName}
              </h1>

              <p className="mt-2 text-[var(--muted)]">
                {request.company?.industry ||
                  "Branche nicht angegeben"}

                {request.company?.city
                  ? ` · ${request.company.city}`
                  : ""}
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Anfrage vom{" "}
                {new Date(
                  request.created_at
                ).toLocaleDateString(
                  "de-CH"
                )}
              </p>

            </div>

          </div>

          {/* STATUS */}

          <div className="mt-7 rounded-2xl bg-slate-50 p-5">

            <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              Status
            </p>

            <p className="mt-2 text-lg font-black">

              {request.status ===
                "pending" &&
                "Die Firma möchte dich kontaktieren."}

              {request.status ===
                "accepted" &&
                "Kontakt angenommen – ihr könnt jetzt privat chatten."}

              {request.status ===
                "rejected" &&
                "Diese Anfrage wurde abgelehnt."}

            </p>

          </div>

          {/* ACTIONS */}

          {request.status ===
            "pending" && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={acceptRequest}
                disabled={actionLoading}
                className="rounded-xl btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Wird gespeichert…"
                  : "Anfrage annehmen"}
              </button>

              <button
                type="button"
                onClick={rejectRequest}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anfrage ablehnen
              </button>

            </div>
          )}

        </section>

        {/* PRIVATER CHAT */}

        {request.status ===
          "accepted" && (
          <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-[var(--navy)] px-6 py-5 text-white">

              <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                Privater Chat
              </p>

              <h2 className="mt-1 text-xl font-black">
                {companyName}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Nur du und dieser Arbeitgeber
                können diesen Chat sehen.
              </p>

            </div>

            {/* MESSAGES */}

            <div className="min-h-[420px] max-h-[550px] space-y-4 overflow-y-auto bg-slate-50 p-6">

              {loadingMessages && (
                <p className="text-center text-sm text-[var(--muted)]">
                  Nachrichten werden geladen…
                </p>
              )}

              {!loadingMessages &&
                messages.length === 0 && (
                  <div className="flex min-h-[350px] items-center justify-center text-center">

                    <div>

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl">
                        💬
                      </div>

                      <h3 className="mt-4 font-black">
                        Noch keine Nachrichten
                      </h3>

                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Schreibe der Firma eine erste Nachricht.
                      </p>

                    </div>

                  </div>
                )}

              {messages.map(
                (message) => {
                  const own =
                    message.sender_id ===
                    userId

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        own
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          own
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md bg-white text-slate-900 shadow-sm"
                        }`}
                      >

                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {message.message}
                        </p>

                        <p
                          className={`mt-1 text-[10px] ${
                            own
                              ? "text-blue-100"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {new Date(
                            message.created_at
                          ).toLocaleString(
                            "de-CH",
                            {
                              dateStyle:
                                "short",
                              timeStyle:
                                "short",
                            }
                          )}
                        </p>

                      </div>

                    </div>
                  )
                }
              )}

            </div>

            {/* SENDEN */}

            <form
              onSubmit={sendMessage}
              className="border-t border-slate-200 bg-white p-4"
            >

              <div className="flex gap-3">

                <textarea
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key ===
                        "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault()

                      if (
                        messageText.trim() &&
                        !sending
                      ) {
                        e.currentTarget.form?.requestSubmit()
                      }
                    }

                  }}
                  rows={2}
                  maxLength={5000}
                  placeholder="Nachricht schreiben…"
                  className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !messageText.trim()
                  }
                  className="self-end rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending
                    ? "…"
                    : "Senden"}
                </button>

              </div>

              <p className="mt-2 text-xs text-[var(--muted)]">
                Enter = senden · Shift + Enter = neue Zeile
              </p>

            </form>

          </section>
        )}

      </div>

    </div>
  )
}
