import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/arbeitnehmer") ||
    pathname.startsWith("/arbeitgeber") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/profil")

  if (!isProtected) return response

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  const { data: factors } = await supabase.auth.mfa.listFactors()
  const hasVerifiedTotp = Boolean(factors?.totp?.some((factor) => factor.status === "verified"))

  if (!hasVerifiedTotp) {
    const url = request.nextUrl.clone()
    url.pathname = "/2fa/einrichten"
    return NextResponse.redirect(url)
  }

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (assurance?.currentLevel !== "aal2") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("mfa", "required")
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/arbeitnehmer/:path*",
    "/arbeitgeber/:path*",
    "/chat/:path*",
    "/profil/:path*",
  ],
}
