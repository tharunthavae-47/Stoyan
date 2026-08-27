import { createBrowserClient } from "@supabase/ssr"

// Stoyan's Supabase project. This publishable key is intended for client-side use.
const SUPABASE_URL = "https://xxtegnwqvbgxubxbkluc.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Hc5iMqSlLz6ndAi7Szw0z_A_KNI2YHAF"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
}
