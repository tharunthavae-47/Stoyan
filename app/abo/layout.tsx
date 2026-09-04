import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Abo",
  robots: { index: false, follow: false },
}

export default function AboLayout({ children }: { children: React.ReactNode }) {
  return children
}
