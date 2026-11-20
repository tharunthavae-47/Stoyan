"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  CreditCard,
  Images,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Search,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { EmployerAIAssistant } from "@/components/employer-ai-assistant"

const ICONS = {
  dashboard: LayoutDashboard,
  search: Search,
  users: Users,
  building: Building2,
  card: CreditCard,
  user: UserRound,
  images: Images,
  messages: MessagesSquare,
} satisfies Record<string, LucideIcon>

export type NavIcon = keyof typeof ICONS
export type NavItem = { href: string; label: string; exact?: boolean; icon?: NavIcon }
export type NavSection = { label: string; items: NavItem[] }
export type DashboardRole = "arbeitgeber" | "arbeitnehmer"

export function DashboardShell({
  sections,
  eyebrow,
  role,
  children,
}: {
  sections: NavSection[]
  eyebrow?: string
  role?: DashboardRole
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(`${item.href}/`)

  const today = new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="app-shell" data-role={role}>
      <aside className="sidebar">
        <Link href="/" className="block">
          <div className="sidebar-brand">JOBMATCH24</div>
          <div className="sidebar-tag">Menschen verbinden</div>
        </Link>

        {eyebrow && <div className="sidebar-role">{eyebrow}</div>}

        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {sections.map((section) => (
            <div key={section.label} className="contents lg:block">
              <div className="sidebar-label">{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon ? ICONS[item.icon] : null
                const active = isActive(item)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`navbtn ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {Icon && <Icon aria-hidden="true" />}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <form action="/api/auth/signout" method="post" className="sidebar-footer">
          <button type="submit" className="navbtn">
            <LogOut aria-hidden="true" />
            Abmelden
          </button>
        </form>
      </aside>

      <div className="shell-content">
        <div className="shell-topbar">
          <p className="text-sm font-medium capitalize text-[var(--muted)]" suppressHydrationWarning>{today}</p>
          <form action="/api/auth/signout" method="post" className="lg:hidden">
            <button type="submit" className="dash-btn dash-btn-outline h-10 min-h-0 px-4">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Abmelden
            </button>
          </form>
        </div>
        {children}
      </div>

      {pathname?.startsWith("/arbeitgeber") && <EmployerAIAssistant />}
    </div>
  )
}
