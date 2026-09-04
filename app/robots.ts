import type { MetadataRoute } from "next"

const BASE_URL = "https://jobmatch24.ch"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/arbeitgeber/",
        "/arbeitnehmer/",
        "/konto/",
        "/2fa/",
        "/api/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
