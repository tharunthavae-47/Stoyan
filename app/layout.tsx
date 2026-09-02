import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "jobmatch24 – Menschen verbinden",
  description:
    "jobmatch24 verbindet qualifizierte Arbeitnehmer mit passenden Arbeitgebern.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
