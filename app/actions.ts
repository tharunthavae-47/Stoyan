```ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

/**
 * =========================================================
 * STOYAN – AUTH ACTIONS
 * Login / Registrierung / Logout
 * =========================================================
 */

/**
 * Registrierung
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const firstName = String(formData.get("vorname") ?? "").trim()
  const lastName = String(formData.get("nachname") ?? "").trim()
  const role = String(formData.get("role") ?? "employee").trim()

  if (!email || !password) {
    return {
      success: false,
      error: "Bitte E-Mail-Adresse und Passwort eingeben.",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    }
  }

  if (!["employee", "employer"].includes(role)) {
    return {
      success: false,
      error: "Ungültige Benutzerrolle.",
    }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        vorname: firstName,
        nachname: lastName,
        role,
      },
    },
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  if (!user) {
    return {
      success: false,
      error: "Die Registrierung konnte nicht abgeschlossen werden.",
    }
  }

  return {
    success: true,
    userId: user.id,
    role,
    message:
      "Registrierung erfolgreich. Bitte prüfe deine E-Mail-Adresse, falls eine Bestätigung erforderlich ist.",
  }
}

/**
 * =========================================================
 * LOGIN
 * =========================================================
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return {
      success: false,
      error: "Bitte E-Mail-Adresse und Passwort eingeben.",
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: "E-Mail-Adresse oder Passwort ist falsch.",
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: "Login konnte nicht abgeschlossen werden.",
    }
  }

  const role =
    data.user.user_metadata?.role ??
    data.user.user_metadata?.user_role ??
    "employee"

  return {
    success: true,
    userId: data.user.id,
    role,
    message: "Login erfolgreich.",
  }
}

/**
 * =========================================================
 * LOGOUT
 * =========================================================
 */
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  redirect("/")
}

/**
 * =========================================================
 * AKTUELLEN BENUTZER ABRUFEN
 * =========================================================
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * =========================================================
 * LOGIN PRÜFEN
 * =========================================================
 */
export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * =========================================================
 * BENUTZERROLLE
 * =========================================================
 */
export async function getUserRole() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    user.user_metadata?.role ??
    user.user_metadata?.user_role ??
    null
  )
}

/**
 * =========================================================
 * ROLLE PRÜFEN
 * =========================================================
 */
export async function requireRole(
  allowedRoles: ("employee" | "employer")[]
) {
  const user = await requireUser()

  const role =
    user.user_metadata?.role ??
    user.user_metadata?.user_role ??
    null

  if (!allowedRoles.includes(role)) {
    redirect("/")
  }

  return user
}

/**
 * =========================================================
 * PASSWORT ZURÜCKSETZEN
 * =========================================================
 */
export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = String(formData.get("email") ?? "").trim()

  if (!email) {
    return {
      success: false,
      error: "Bitte E-Mail-Adresse eingeben.",
    }
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${origin}/passwort-reset`,
    }
  )

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message:
      "Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts versendet.",
  }
}

/**
 * =========================================================
 * PASSWORT ÄNDERN
 * =========================================================
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = String(formData.get("password") ?? "")
  const passwordConfirm = String(
    formData.get("passwordConfirm") ?? ""
  )

  if (!password || !passwordConfirm) {
    return {
      success: false,
      error: "Bitte beide Passwortfelder ausfüllen.",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    }
  }

  if (password !== passwordConfirm) {
    return {
      success: false,
      error: "Die Passwörter stimmen nicht überein.",
    }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Passwort erfolgreich geändert.",
  }
}
```

