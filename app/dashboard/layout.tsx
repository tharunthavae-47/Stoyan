import { DashboardShell, type NavSection } from "@/components/dashboard-shell"

const sections: NavSection[] = [
  {
    label: "Übersicht",
    items: [{ href: "/dashboard", label: "Dashboard", exact: true }],
  },
  {
    label: "Bereiche",
    items: [
      { href: "/arbeitgeber", label: "Arbeitgeber" },
      { href: "/arbeitnehmer", label: "Arbeitnehmer" },
      { href: "/preise", label: "Preise & Abo" },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Konto">
      {children}
    </DashboardShell>
  )
}
