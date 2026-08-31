import { DashboardShell, type NavSection } from "@/components/dashboard-shell"

const sections: NavSection[] = [
  {
    label: "Übersicht",
    items: [{ href: "/arbeitnehmer", label: "Dashboard", exact: true }],
  },
  {
    label: "Mein Profil",
    items: [
      { href: "/arbeitnehmer/profil", label: "Profil & Angaben" },
      { href: "/arbeitnehmer/bilder", label: "Bilder" },
      { href: "/arbeitnehmer/anfragen", label: "Kontaktanfragen" },
    ],
  },
  {
    label: "Info",
    items: [{ href: "/preise", label: "Preise & Abo" }],
  },
]

export default function ArbeitnehmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell sections={sections} eyebrow="Arbeitnehmer-Bereich">
      {children}
    </DashboardShell>
  )
}
