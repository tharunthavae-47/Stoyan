import { DashboardShell, type NavSection } from "@/components/dashboard-shell"

const sections: NavSection[] = [
  {
    label: "Übersicht",
    items: [{ href: "/arbeitgeber", label: "Dashboard", exact: true }],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/arbeitgeber/suche", label: "Kandidaten suchen" },
      { href: "/arbeitgeber/kandidat", label: "Kandidatenprofile" },
    ],
  },
  {
    label: "Unternehmen",
    items: [
      { href: "/arbeitgeber/firma", label: "Firmenprofil" },
      { href: "/preise", label: "Preise & Abo" },
    ],
  },
]

export default function ArbeitgeberLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Arbeitgeber-Bereich">
      {children}
    </DashboardShell>
  )
}
