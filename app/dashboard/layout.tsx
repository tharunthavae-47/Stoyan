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
    items: [{ href: "/dashboard", label: "Dashboard", exact: true }],
  },
  {
    label: "Konto",
    items: [{ href: "/preise", label: "Preise & Abo" }],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Konto">
      {children}
    </DashboardShell>
  )
}
