import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "STOYAN – Menschen. Unternehmen. Matching.",
  description:
    "Stoyan verbindet Arbeitnehmer und Unternehmen mit professionellen Profilen, gezielter Suche und intelligentem Matching.",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
