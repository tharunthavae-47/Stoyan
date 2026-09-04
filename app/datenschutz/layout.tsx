import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutz",
  description:
    "Datenschutzerklärung von jobmatch24 – Informationen zur Verarbeitung personenbezogener Daten.",
  alternates: {
    canonical: "/datenschutz",
  },
}

export default function DatenschutzLayout({ children }: { children: React.ReactNode }) {
  return children
}
