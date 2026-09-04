import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  robots: { index: false, follow: false },
}

export default function PasswortZuruecksetzenLayout({ children }: { children: React.ReactNode }) {
  return children
}
