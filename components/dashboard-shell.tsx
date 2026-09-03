"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export type NavItem = { href: string; label: string; exact?: boolean }
export type NavSection = { label: string; items: NavItem[] }

export function DashboardShell({
  sections,
  eyebrow,
  children,
}: {
  sections: NavSection[]
  eyebrow?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(`${item.href}/`)

  return (
    <div className="app-shell">
      {/* ============================================================
          DARK NAVY SIDEBAR
      ============================================================ */}
      <aside className="sidebar">
        <Link href="/" className="block">
          <div className="sidebar-brand">JOBMATCH24</div>
          <div className="sidebar-tag">Menschen verbinden</div>
        </Link>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="sidebar-label">{section.label}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbtn ${isActive(item) ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <form action="/api/auth/signout" method="post" className="mt-6 hidden lg:block">
          <button type="submit" className="navbtn w-full">
            Abmelden
          </button>
        </form>
      </aside>

      {/* ============================================================
          CONTENT
      ============================================================ */}
      <div className="shell-content">
        <div className="shell-topbar">
          <div className="text-[13px] font-semibold text-[var(--muted)]">
            {eyebrow ?? "JobMatch24 Plattform"}
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="btn-secondary h-10 px-4 text-sm">
              Abmelden
            </button>
          </form>
        </div>

        {children}
      </div>
    </div>
  )
}
