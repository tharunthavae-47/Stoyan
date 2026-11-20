import type { Metadata } from "next"
import { DashboardShell, type NavSection } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

const sections: NavSection[] = [
  {
    label: "Übersicht",
    items: [{ href: "/arbeitgeber", label: "Dashboard", exact: true, icon: "dashboard" }],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/arbeitgeber/suche", label: "Kandidaten suchen", icon: "search" },
      { href: "/arbeitgeber/kandidat", label: "Kandidatenprofile", icon: "users" },
    ],
  },
  {
    label: "Unternehmen",
    items: [
      { href: "/arbeitgeber/firma", label: "Firmenprofil", icon: "building" },
      { href: "/preise", label: "Preise & Abo", icon: "card" },
    ],
  },
]

export default function ArbeitgeberLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Arbeitgeber-Bereich" role="arbeitgeber">
      {children}
    </DashboardShell>
  )
}
