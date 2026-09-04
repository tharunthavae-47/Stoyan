import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Zwei-Faktor-Authentifizierung",
  robots: { index: false, follow: false },
}

export default function TwoFALayout({ children }: { children: React.ReactNode }) {
  return children
}
