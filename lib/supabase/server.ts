import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Stoyan's Supabase project. The publishable key is safe for Supabase SSR clients.
const SUPABASE_URL = "https://xxtegnwqvbgxubxbkluc.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Hc5iMqSlLz6ndAi7Szw0z_A_KNI2YHAF"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot always write cookies. Middleware handles refreshes.
        }
      },
    },
  })
}
