import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutz-Einstellungen",
  robots: { index: false, follow: false },
}

export default function DatenschutzEinstellungenLayout({ children }: { children: React.ReactNode }) {
  return children
}
