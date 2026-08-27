import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Stoyan – Job Matching",
  description: "Die Plattform, die Arbeitnehmer und Arbeitgeber zusammenbringt.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>
}
