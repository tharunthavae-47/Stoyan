import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Stoyan – Menschen. Unternehmen. Matching.",
  description:
    "Stoyan bringt Arbeitnehmer und Unternehmen mit professionellen Profilen und transparentem Matching zusammen.",
  themeColor: "#f8fbfd",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="bg-[#f8fbfd]">
      <body className="bg-[#f8fbfd] text-slate-900">
        {children}
      </body>
    </html>
  )
}
