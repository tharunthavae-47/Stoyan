import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const BASE_URL = "https://jobmatch24.ch"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    template: "%s | jobmatch24",
  },
  description:
    "jobmatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Finde passende Jobs oder qualifizierte Mitarbeiter.",
  applicationName: "jobmatch24",
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: BASE_URL,
    siteName: "jobmatch24",
    title: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    description:
      "jobmatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Finde passende Jobs oder qualifizierte Mitarbeiter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    description:
      "jobmatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Finde passende Jobs oder qualifizierte Mitarbeiter.",
  },
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
