import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preise für Arbeitgeber und Arbeitnehmer",
  description:
    "Entdecke die jobmatch24 Abos für Arbeitgeber und Arbeitnehmer in der Schweiz. Transparent, fair und flexibel.",
  alternates: {
    canonical: "/preise",
  },
}

export default function PreiseLayout({ children }: { children: React.ReactNode }) {
  return children
}
