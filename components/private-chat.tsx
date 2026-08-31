"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type RequestStatus = "pending" | "accepted" | "rejected"

type ContactRequest = {
  id: string
  status: RequestStatus
  created_at: string
  employer_id: string
  employee_id: string
  job_id: string | null
}

type Company = {
  name: string | null
  industry: string | null
  city: string | null
}

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  message: string
  created_at: string
}

type Conversation = {
  id: string
  contact_request_id: string
  employer_id: string
  employee_id: string
  created_at: string
}

type Props = {
  requestId: string
}

export default function PrivateChat({ requestId }: Props) {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [request, setRequest] = useState<ContactRequest | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [conversation, setConversation] =
    useState<Conversation | null>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // =========================================================
  // SCROLL NACH UNTEN
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  // =========================================================
  // INITIAL LADEN
  // =========================================================

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError("")

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(userError.message)
        }

        if (!user) {
          window.location.href = "/login"
          return
        }

        if (!mounted) return

        setUserId(user.id)

        // -----------------------------------------------------
        // KONTAKTANFRAGE
        // -----------------------------------------------------

        const {
          data: requestData,
          error: requestError,
        } = await supabase
          .from("contact_requests")
          .select(
            `
              id,
              status,
              created_at,
              employer_id,
              employee_id,
              job_id
            `
          )
          .eq("id", requestId)
          .maybeSingle()

        if (requestError) {
          throw new Error(
            `Anfrage konnte nicht geladen werden: ${requestError.message}`
          )
        }

        if (!requestData) {
          throw new Error("Diese Anfrage wurde nicht gefunden.")
        }

        const typedRequest =
          requestData as ContactRequest

        // -----------------------------------------------------
        // SICHERHEIT
        // -----------------------------------------------------
        //
        // Nur der Arbeitgeber oder Arbeitnehmer dieser
        // Anfrage darf die Seite sehen.
        //

        if (
          typedRequest.employer_id !== user.id &&
          typedRequest.employee_id !== user.id
        ) {
          throw new Error(
            "Du hast keinen Zugriff auf diese Anfrage."
          )
        }

        if (!mounted) return

        setRequest(typedRequest)

        // -----------------------------------------------------
        // FIRMA LADEN
        // -----------------------------------------------------

        const {
          data: companyData,
        } = await supabase
          .from("companies")
          .select("name,industry,city")
          .eq("owner_id", typedRequest.employer_id)
          .maybeSingle()

        if (!mounted) return

        setCompany(companyData as Company | null)

        // -----------------------------------------------------
        // WENN ANFRAGE ANGENOMMEN -> CHAT LADEN
        // -----------------------------------------------------

        if (typedRequest.status === "accepted") {
          await loadConversation(
            typedRequest.id,
            user.id,
            typedRequest
          )
        }
      } catch (err) {
        console.error(err)

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Ein Fehler ist aufgetreten."
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [requestId])

  // =========================================================
  // CONVERSATION LADEN
  // =========================================================

  async function loadConversation(
    contactRequestId: string,
    currentUserId: string,
    requestData?: ContactRequest
  ) {
    try {
      const currentRequest =
        requestData || request

      if (!currentRequest) return

      // -----------------------------------------------------
      // CONVERSATION SUCHEN
      // -----------------------------------------------------

      const {
        data: conversationData,
        error: conversationError,
      } = await supabase
        .from("chat_conversations")
        .select(
          `
            id,
            contact_request_id,
            employer_id,
            employee_id,
            created_at
          `
        )
        .eq(
          "contact_request_id",
          contactRequestId
        )
        .maybeSingle()

      if (conversationError) {
        throw new Error(
          `Chat konnte nicht geladen werden: ${conversationError.message}`
        )
      }

      let activeConversation =
        conversationData as Conversation | null

      // -----------------------------------------------------
      // WENN NOCH KEIN CHAT EXISTIERT
      // -----------------------------------------------------

      if (!activeConversation) {
        const {
          data: createdConversation,
          error: createError,
        } = await supabase
          .from("chat_conversations")
          .insert({
            contact_request_id: contactRequestId,
            employer_id:
              currentRequest.employer_id,
            employee_id:
              currentRequest.employee_id,
          })
          .select(
            `
              id,
              contact_request_id,
              employer_id,
              employee_id,
              created_at
            `
          )
          .single()

        if (createError) {
          // Mögliches Race Condition:
          // Die andere Seite hat gleichzeitig
          // die Conversation erstellt.
          if (createError.code === "23505") {
            const { data: retryConversation } =
              await supabase
                .from("chat_conversations")
                .select(
                  `
                    id,
                    contact_request_id,
                    employer_id,
                    employee_id,
                    created_at
                  `
                )
                .eq(
                  "contact_request_id",
                  contactRequestId
                )
                .maybeSingle()

            if (retryConversation) {
              activeConversation =
                retryConversation as Conversation
            } else {
              throw new Error(
                `Chat konnte nicht erstellt werden: ${createError.message}`
              )
            }
          } else {
            throw new Error(
              `Chat konnte nicht erstellt werden: ${createError.message}`
            )
          }
        } else {
          activeConversation =
            createdConversation as Conversation
        }
      }

      if (!activeConversation) {
        throw new Error(
          "Keine Chat-Unterhaltung verfügbar."
        )
      }

      // -----------------------------------------------------
      // SICHERHEIT
      // -----------------------------------------------------

      if (
        activeConversation.employer_id !==
          currentUserId &&
        activeConversation.employee_id !==
          currentUserId
      ) {
        throw new Error(
          "Du hast keinen Zugriff auf diesen Chat."
        )
      }

      setConversation(activeConversation)

      // -----------------------------------------------------
      // NACHRICHTEN LADEN
      // -----------------------------------------------------

      const {
        data: messageData,
        error: messageError,
      } = await supabase
        .from("chat_messages")
        .select(
          `
            id,
            conversation_id,
            sender_id,
            message,
            created_at
          `
        )
        .eq(
          "conversation_id",
          activeConversation.id
        )
        .order("created_at", {
          ascending: true,
        })

      if (messageError) {
        throw new Error(
          `Nachrichten konnten nicht geladen werden: ${messageError.message}`
        )
      }

      setMessages(
        (messageData || []) as Message[]
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Chat konnte nicht geladen werden."
      )
    }
  }

  // =========================================================
  // REALTIME
  // =========================================================

  useEffect(() => {
    if (!conversation?.id) {
      return
    }

    const channel = supabase
      .channel(
        `private-chat-${conversation.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage =
            payload.new as Message

          setMessages((current) => {
            // Doppeltes Hinzufügen verhindern
            if (
              current.some(
                (message) =>
                  message.id === newMessage.id
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
      .subscribe((status) => {
        console.log(
          "Chat Realtime:",
          status
        )
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversation?.id])

  // =========================================================
  // ANNEHMEN
  // =========================================================

  async function acceptRequest() {
    if (!request || !userId) return

    if (
      request.employee_id !== userId
    ) {
      setError(
        "Nur der Arbeitnehmer kann diese Anfrage annehmen."
      )
      return
    }

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      // -----------------------------------------------------
      // STATUS ÄNDERN
      // -----------------------------------------------------

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
        .eq("status", "pending")
        .select(
          `
            id,
            status,
            created_at,
            employer_id,
            employee_id,
            job_id
          `
        )
        .maybeSingle()

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht angenommen werden: ${updateError.message}`
        )
      }

      if (!updatedRequest) {
        // Prüfen, ob sie bereits angenommen wurde
        const { data: currentRequest } =
          await supabase
            .from("contact_requests")
            .select(
              `
                id,
                status,
                created_at,
                employer_id,
                employee_id,
                job_id
              `
            )
            .eq("id", request.id)
            .maybeSingle()

        if (
          currentRequest?.status ===
          "accepted"
        ) {
          setRequest(
            currentRequest as ContactRequest
          )
        } else {
          throw new Error(
            "Die Anfrage konnte nicht angenommen werden."
          )
        }
      } else {
        setRequest(
          updatedRequest as ContactRequest
        )
      }

      // -----------------------------------------------------
      // CHAT ERSTELLEN / LADEN
      // -----------------------------------------------------

      const acceptedRequest =
        (updatedRequest ||
          request) as ContactRequest

      await loadConversation(
        acceptedRequest.id,
        userId,
        acceptedRequest
      )

      setSuccess(
        "Anfrage angenommen. Der private Chat ist jetzt freigeschaltet."
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

  // =========================================================
  // ABLEHNEN
  // =========================================================

  async function rejectRequest() {
    if (!request || !userId) return

    if (
      request.employee_id !== userId
    ) {
      setError(
        "Nur der Arbeitnehmer kann diese Anfrage ablehnen."
      )
      return
    }

    const confirmed =
      window.confirm(
        "Möchtest du diese Anfrage wirklich ablehnen?"
      )

    if (!confirmed) return

    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
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
        .eq("status", "pending")
        .select(
          `
            id,
            status,
            created_at,
            employer_id,
            employee_id,
            job_id
          `
        )
        .maybeSingle()

      if (updateError) {
        throw new Error(
          `Anfrage konnte nicht abgelehnt werden: ${updateError.message}`
        )
      }

      if (!updatedRequest) {
        throw new Error(
          "Die Anfrage wurde möglicherweise bereits bearbeitet."
        )
      }

      setRequest(
        updatedRequest as ContactRequest
      )

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

  // =========================================================
  // NACHRICHT SENDEN
  // =========================================================

  async function sendMessage(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!conversation || !userId) {
      return
    }

    const text =
      messageText.trim()

    if (!text) {
      return
    }

    if (sending) {
      return
    }

    setSending(true)
    setError("")

    try {
      const {
        data: insertedMessage,
        error: insertError,
      } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id:
            conversation.id,
          sender_id: userId,
          message: text,
        })
        .select(
          `
            id,
            conversation_id,
            sender_id,
            message,
            created_at
          `
        )
        .single()

      if (insertError) {
        throw new Error(
          `Nachricht konnte nicht gesendet werden: ${insertError.message}`
        )
      }

      // Sofort lokal anzeigen.
      // Realtime verhindert anschließend
      // durch die ID-Prüfung ein Duplikat.
      setMessages((current) => {
        if (
          current.some(
            (message) =>
              message.id ===
              insertedMessage.id
          )
        ) {
          return current
        }

        return [
          ...current,
          insertedMessage as Message,
        ]
      })

      setMessageText("")
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : "Nachricht konnte nicht gesendet werden."
      )
    } finally {
      setSending(false)
    }
  }

  // =========================================================
  // ENTER = SENDEN
  // =========================================================

  function handleMessageKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault()

      const form =
        e.currentTarget.form

      if (form) {
        form.requestSubmit()
      }
    }
  }

  // =========================================================
  // DATUM
  // =========================================================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

        <p className="mt-4 font-semibold text-slate-600">
          Anfrage wird geladen…
        </p>
      </div>
    )
  }

  // =========================================================
  // FEHLER OHNE REQUEST
  // =========================================================

  if (!request) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
        <h2 className="text-xl font-black">
          Anfrage nicht gefunden
        </h2>

        <p className="mt-2 text-sm">
          {error ||
            "Diese Anfrage existiert nicht oder du hast keinen Zugriff darauf."}
        </p>
      </div>
    )
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          FIRMENKARTE
      ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
              {company?.name?.charAt(0).toUpperCase() ||
                "F"}
            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Unternehmen
              </p>

              <h1 className="mt-1 text-2xl font-black">
                {company?.name ||
                  "Unternehmen"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {company?.industry ||
                  "Branche nicht angegeben"}

                {company?.city
                  ? ` · ${company.city}`
                  : ""}
              </p>

            </div>

          </div>

          <div>

            {request.status ===
              "pending" && (
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                Anfrage offen
              </span>
            )}

            {request.status ===
              "accepted" && (
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                Anfrage angenommen ✓
              </span>
            )}

            {request.status ===
              "rejected" && (
              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                Anfrage abgelehnt
              </span>
            )}

          </div>

        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">

          <p className="text-sm text-slate-600">
            Anfrage erhalten am{" "}
            <span className="font-bold text-slate-900">
              {formatDate(
                request.created_at
              )}
            </span>
          </p>

        </div>

      </section>

      {/* =====================================================
          MELDUNGEN
      ===================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {/* =====================================================
          PENDING
      ===================================================== */}

      {request.status ===
        "pending" && (
        <section className="rounded-3xl border border-sky-200 bg-white p-8 shadow-sm">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl">
              💬
            </div>

            <h2 className="mt-5 text-2xl font-black">
              {company?.name ||
                "Dieses Unternehmen"}{" "}
              möchte dich kontaktieren
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Wenn du die Anfrage annimmst,
              wird ein privater Chat zwischen
              dir und diesem Unternehmen
              freigeschaltet.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                type="button"
                onClick={rejectRequest}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-7 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Bitte warten…"
                  : "Anfrage ablehnen"}
              </button>

              <button
                type="button"
                onClick={acceptRequest}
                disabled={actionLoading}
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Wird verarbeitet…"
                  : "Anfrage annehmen"}
              </button>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          REJECTED
      ===================================================== */}

      {request.status ===
        "rejected" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl">
            ✓
          </div>

          <h2 className="mt-4 text-xl font-black">
            Anfrage abgelehnt
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Du hast diese Kontaktanfrage
            abgelehnt. Es wurde kein Chat
            freigeschaltet.
          </p>

        </section>
      )}

      {/* =====================================================
          CHAT
      ===================================================== */}

      {request.status ===
        "accepted" && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* CHAT HEADER */}

          <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                  Privater Chat
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {company?.name ||
                    "Unternehmen"}
                </h2>

              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </div>

            </div>

          </div>

          {/* NACHRICHTEN */}

          <div className="h-[500px] overflow-y-auto bg-slate-50 p-5">

            {messages.length ===
              0 && (
              <div className="flex h-full items-center justify-center text-center">

                <div>

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    💬
                  </div>

                  <h3 className="mt-4 font-black">
                    Noch keine Nachrichten
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Schreibe eine Nachricht
                    und starte das Gespräch.
                  </p>

                </div>

              </div>
            )}

            <div className="space-y-3">

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
                        className={`max-w-[80%] ${
                          own
                            ? "items-end"
                            : "items-start"
                        }`}
                      >

                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                            own
                              ? "rounded-br-md bg-blue-600 text-white"
                              : "rounded-bl-md bg-white text-slate-900 shadow-sm"
                          }`}
                        >
                          {message.message}
                        </div>

                        <p
                          className={`mt-1 px-1 text-[10px] text-slate-400 ${
                            own
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {formatDate(
                            message.created_at
                          )}
                        </p>

                      </div>

                    </div>
                  )
                }
              )}

              <div ref={messagesEndRef} />

            </div>

          </div>

          {/* EINGABE */}

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
                onKeyDown={
                  handleMessageKeyDown
                }
                placeholder="Nachricht schreiben…"
                rows={2}
                maxLength={5000}
                disabled={sending}
                className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !messageText.trim()
                }
                className="self-end rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending
                  ? "..."
                  : "Senden"}
              </button>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Enter = Senden · Shift + Enter = neue Zeile
            </p>

          </form>

        </section>
      )}

    </div>
  )
}
