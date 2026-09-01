import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xxtegnwqvbgxubxbkluc.supabase.co"

const SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Hc5iMqSlLz6ndAi7Szw0z_A_KNI2YHAF"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (browserClient) {
    return browserClient
  }

  browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      // Angemeldet bleiben, bis der Benutzer sich ausdrücklich abmeldet.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  })

  return browserClient
}
