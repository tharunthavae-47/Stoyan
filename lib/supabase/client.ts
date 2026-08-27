import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxtegnwqvbgxubxbkluc.supabase.co"
const SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Hc5iMqSlLz6ndAi7Szw0z_A_KNI2YHAF"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
