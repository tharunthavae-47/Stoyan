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
const SITE_NAME = "JobMatch24"
const SITE_DESCRIPTION =
  "JobMatch24 verbindet Arbeitnehmer und Arbeitgeber in der Schweiz. Finde passende Jobs, qualifizierte Mitarbeiter und neue berufliche Chancen mit intelligentem Job Matching."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JobMatch24 – Job Matching für Jobs & Mitarbeiter in der Schweiz",
    template: "%s | JobMatch24",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "JobMatch24",
    "Job Match 24",
    "Job Matching Schweiz",
    "Jobs Schweiz",
    "Jobs finden Schweiz",
    "Jobbörse Schweiz",
    "Stellenangebote Schweiz",
    "Arbeitnehmer Schweiz",
    "Arbeitgeber Schweiz",
    "Mitarbeiter finden Schweiz",
    "qualifizierte Mitarbeiter finden",
    "Jobsuche Schweiz",
  ],
  applicationName: SITE_NAME,
  category: "jobs",
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: BASE_URL },
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
    siteName: SITE_NAME,
    title: "JobMatch24 – Job Matching für Jobs & Mitarbeiter in der Schweiz",
    description: SITE_DESCRIPTION,
    images: [{
      url: "/jobmatch24-logo.png",
      alt: "JobMatch24 – Jobs und Mitarbeiter in der Schweiz",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobMatch24 – Job Matching für Jobs & Mitarbeiter in der Schweiz",
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
      name: SITE_NAME,
      alternateName: ["jobmatch24", "Job Match 24"],
      description: SITE_DESCRIPTION,
      inLanguage: "de-CH",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "jobmatch24",
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
