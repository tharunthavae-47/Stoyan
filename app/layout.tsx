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
const SITE_DESCRIPTION =
  "jobmatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Finde passende Jobs oder qualifizierte Mitarbeiter mit intelligentem Matching."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    template: "%s | jobmatch24",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Jobs Schweiz",
    "Jobbörse Schweiz",
    "Stellenangebote Schweiz",
    "Arbeitnehmer Schweiz",
    "Arbeitgeber Schweiz",
    "Mitarbeiter finden",
    "Jobs finden",
    "Job Matching Schweiz",
    "Bewerbung Schweiz",
    "jobmatch24",
  ],
  applicationName: "jobmatch24",
  category: "jobs",
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
  icons: {
    icon: "/jobmatch24-logo.png",
    apple: "/jobmatch24-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: BASE_URL,
    siteName: "jobmatch24",
    title: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/jobmatch24-logo.png",
        alt: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "jobmatch24 – Jobs & Mitarbeiter in der Schweiz",
    description: SITE_DESCRIPTION,
    images: ["/jobmatch24-logo.png"],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "jobmatch24",
      description: SITE_DESCRIPTION,
      inLanguage: "de-CH",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "jobmatch24",
      url: BASE_URL,
      logo: `${BASE_URL}/jobmatch24-logo.png`,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de-CH" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
