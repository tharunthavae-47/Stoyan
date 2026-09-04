import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrieren",
  robots: { index: false, follow: false },
}

export default function RegistrierenLayout({ children }: { children: React.ReactNode }) {
  return children
}
