import type { MetadataRoute } from "next"

const BASE_URL = "https://jobmatch24.ch"

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "/preise",
    "/registrieren",
    "/login",
    "/datenschutz",
    "/impressum",
  ]

  return publicRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }))
}
