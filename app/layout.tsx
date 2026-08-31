import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Stoyan – Menschen. Unternehmen. Matching.",
  description:
    "Stoyan bringt Arbeitnehmer und Unternehmen mit professionellen Profilen und intelligentem Matching zusammen.",
  themeColor: "#F7F9FC",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="bg-[#F7F9FC]">
      <body className="min-h-screen bg-[#F7F9FC] text-[#0F172A]">
        {children}
      </body>
    </html>
  )
}
