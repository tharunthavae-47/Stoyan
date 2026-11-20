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
    items: [{ href: "/arbeitnehmer", label: "Dashboard", exact: true, icon: "dashboard" }],
  },
  {
    label: "Mein Profil",
    items: [
      { href: "/arbeitnehmer/profil", label: "Profil & Angaben", icon: "user" },
      { href: "/arbeitnehmer/bilder", label: "Bilder", icon: "images" },
      { href: "/arbeitnehmer/anfragen", label: "Kontaktanfragen", icon: "messages" },
    ],
  },
  {
    label: "Info",
    items: [{ href: "/preise", label: "Preise & Abo", icon: "card" }],
  },
]

export default function ArbeitnehmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Arbeitnehmer-Bereich" role="arbeitnehmer">
      {children}
    </DashboardShell>
  )
}
