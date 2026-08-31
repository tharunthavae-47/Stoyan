import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Stoyan – Menschen. Unternehmen. Matching.",
  description:
    "Stoyan bringt Arbeitnehmer und Unternehmen mit professionellen Profilen und intelligentem Matching zusammen.",
  themeColor: "#07090d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className="bg-[#07090d]"
    >
      <body className="min-h-screen bg-[#07090d] text-white">
        {children}
      </body>
    </html>
  )
}
