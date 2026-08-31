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

export default function ContactRequestPage({
  params,
}: Props) {
  const [requestId, setRequestId] = useState<string | null>(
    null
  )

  const [request, setRequest] =
    useState<RequestData | null>(null)

  const [messages, setMessages] =
    useState<Message[]>([])

  const [userId, setUserId] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [loadingMessages, setLoadingMessages] =
    useState(false)

  const [actionLoading, setActionLoading] =
    useState(false)

  const [messageText, setMessageText] =
    useState("")

  const [sending, setSending] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  /*
   * =====================================================
   * REQUEST-ID AUS URL
   * =====================================================
   */

  useEffect(() => {
    params.then((value) => {
      setRequestId(value.id)
    })
  }, [params])

  /*
   * =====================================================
   * ANFRAGE LADEN
   * =====================================================
   */

  useEffect(() => {
    if (!requestId) return

    let active = true

    async function loadRequest() {
      setLoading(true)
      setError("")

      try {
        const supabase = createClient()

        const {
          data: {
            user,
          },
        } = await supabase.auth.getUser()

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

        setRequest({
          ...requestData,
          company: company || null,
        })

        /*
         * Nur bei angenommener Anfrage
         * Nachrichten laden.
         */

        if (requestData.status === "accepted") {
          await loadMessages(
            supabase,
            requestId
          )
        }
      } catch (err) {
        console.error(err)

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
   * =====================================================
   * NACHRICHTEN LADEN
   * =====================================================
   */

  async function loadMessages(
    supabase: ReturnType<typeof createClient>,
    contactRequestId: string
  ) {
    setLoadingMessages(true)

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
      console.error(
        "Nachrichten konnten nicht geladen werden:",
        messagesError
      )

      setError(
        `Nachrichten konnten nicht geladen werden: ${messagesError.message}`
      )
    } else {
      setMessages(data || [])
    }

    setLoadingMessages(false)
  }

  /*
   * =====================================================
   * REALTIME CHAT
   * =====================================================
   */

  useEffect(() => {
    if (
      !requestId ||
      !userId ||
      request?.status !== "accepted"
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
      supabase.removeChannel(channel)
    }
  }, [
    requestId,
    userId,
    request?.status,
  ])

  /*
   * =====================================================
   * ANFRAGE ANNEHMEN
   * =====================================================
   */

  async function acceptRequest() {
    if (!request || !userId) return

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()

      const {
        error: updateError,
      } = await supabase
        .from("contact_requests")
        .update({
          status: "accepted",
        })
        .eq("id", request.id)
        .eq("employee_id", userId)

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht angenommen werden: ${updateError.message}`
        )
      }

      setRequest({
        ...request,
        status: "accepted",
      })

      await loadMessages(
        supabase,
        request.id
      )

      setSuccess(
        "Anfrage angenommen. Du kannst jetzt privat mit dem Arbeitgeber chatten."
      )
    } catch (err) {
      console.error(err)

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
   * =====================================================
   * ANFRAGE ABLEHNEN
   * =====================================================
   */

  async function rejectRequest() {
    if (!request || !userId) return

    const confirmed = window.confirm(
      "Möchtest du diese Anfrage wirklich ablehnen?"
    )

    if (!confirmed) return

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()

      const {
        error: updateError,
      } = await supabase
        .from("contact_requests")
        .update({
          status: "rejected",
        })
        .eq("id", request.id)
        .eq("employee_id", userId)

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht abgelehnt werden: ${updateError.message}`
        )
      }

      setRequest({
        ...request,
        status: "rejected",
      })

      setSuccess(
        "Die Anfrage wurde abgelehnt."
      )
    } catch (err) {
      console.error(err)

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
   * =====================================================
   * NACHRICHT SENDEN
   * =====================================================
   */

  async function sendMessage(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !request ||
      !userId ||
      !messageText.trim() ||
      request.status !== "accepted"
    ) {
      return
    }

    setSending(true)
    setError("")

    const text = messageText.trim()

    try {
      const supabase = createClient()

      const {
        error: sendError,
      } = await supabase
        .from("contact_messages")
        .insert({
          contact_request_id: request.id,
          sender_id: userId,
          message: text,
        })

      if (sendError) {
        throw new Error(
          `Nachricht konnte nicht gesendet werden: ${sendError.message}`
        )
      }

      setMessageText("")
    } catch (err) {
      console.error(err)

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
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] p-10">

        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-5 font-semibold text-slate-500">
            Anfrage wird geladen…
          </p>

        </div>

      </main>
    )
  }

  /*
   * =====================================================
   * FEHLER / NICHT GEFUNDEN
   * =====================================================
   */

  if (!request) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] p-10">

        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-10 shadow-sm">

          <h1 className="text-2xl font-black">
            Anfrage nicht gefunden
          </h1>

          <p className="mt-3 text-slate-600">
            {error ||
              "Diese Anfrage existiert nicht oder du hast keinen Zugriff darauf."}
          </p>

          <Link
            href="/arbeitnehmer"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Zurück zum Dashboard
          </Link>

        </div>

      </main>
    )
  }

  const companyName =
    request.company?.name ||
    "Unternehmen"

  /*
   * =====================================================
   * HAUPTANSICHT
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">

          <Link
            href="/arbeitnehmer"
            className="text-2xl font-black"
          >
            Stoyan
            <span className="text-blue-600">
              .
            </span>
          </Link>

          <Link
            href="/arbeitnehmer"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50"
          >
            ← Dashboard
          </Link>

        </div>

      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">

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

        {/* =================================================
            FIRMA
        ================================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

          <p className="text-sm font-black uppercase tracking-widest text-blue-600">
            Kontaktanfrage
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-3xl font-black text-white">
              {companyName.charAt(0).toUpperCase()}
            </div>

            <div>

              <h1 className="text-3xl font-black">
                {companyName}
              </h1>

              <p className="mt-2 text-slate-500">
                {request.company?.industry ||
                  "Branche nicht angegeben"}

                {request.company?.city
                  ? ` · ${request.company.city}`
                  : ""}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Anfrage vom{" "}
                {new Date(
                  request.created_at
                ).toLocaleDateString("de-CH")}
              </p>

            </div>

          </div>

          {/* STATUS */}

          <div className="mt-7 rounded-2xl bg-slate-50 p-5">

            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
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
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading
                  ? "Wird gespeichert…"
                  : "Anfrage annehmen"}
              </button>

              <button
                type="button"
                onClick={rejectRequest}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Anfrage ablehnen
              </button>

            </div>
          )}

        </section>

        {/* =================================================
            PRIVATER CHAT
        ================================================= */}

        {request.status ===
          "accepted" && (
          <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">

              <p className="text-xs font-black uppercase tracking-widest text-blue-300">
                Privater Chat
              </p>

              <h2 className="mt-1 text-xl font-black">
                {companyName}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Nur du und dieser Arbeitgeber können
                diesen Chat sehen.
              </p>

            </div>

            {/* MESSAGES */}

            <div className="min-h-[420px] max-h-[550px] space-y-4 overflow-y-auto bg-slate-50 p-6">

              {loadingMessages && (
                <p className="text-center text-sm text-slate-400">
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

                      <p className="mt-2 text-sm text-slate-500">
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
                              : "text-slate-400"
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
                  className="self-end rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending
                    ? "…"
                    : "Senden"}
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter = senden · Shift + Enter = neue Zeile
              </p>

            </form>

          </section>
        )}

      </div>

    </main>
  )
}
