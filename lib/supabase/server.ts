import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

type SupabaseCookie = {
  name: string
  value: string
  options?: Record<string, unknown>
}

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxtegnwqvbgxubxbkluc.supabase.co"
const SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Hc5iMqSlLz6ndAi7Szw0z_A_KNI2YHAF"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: SupabaseCookie[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          })
        } catch {
          // Server Components cannot always write cookies. Middleware handles refreshes.
        }
      },
    },
  })
}
