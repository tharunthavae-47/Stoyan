import type { MetadataRoute } from "next"

const BASE_URL = "https://jobmatch24.ch"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/preise`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
