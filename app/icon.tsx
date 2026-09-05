import fs from "node:fs"
import path from "node:path"
import { ImageResponse } from "next/og"

export const contentType = "image/png"
export const size = { width: 32, height: 32 }

export default function Icon() {
  const logoPath = path.join(process.cwd(), "public", "jobmatch24-logo.png")
  const logo = fs.readFileSync(logoPath).toString("base64")

  return new ImageResponse(
    <img
      src={`data:image/png;base64,${logo}`}
      alt="JOBMATCH24"
      width="32"
      height="32"
      style={{ objectFit: "contain" }}
    />,
    { ...size },
  )
}
