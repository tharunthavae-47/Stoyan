import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "STOYAN – Menschen verbinden",
  description:
    "STOYAN verbindet qualifizierte Arbeitnehmer mit passenden Arbeitgebern.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>
        <div className="min-h-screen">
          <SiteHeader />

          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
