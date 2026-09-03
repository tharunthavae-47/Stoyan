/**
 * Zentrale Abo-Konfiguration für JobMatch24.
 * Preise und technische Berechtigungen werden hier definiert.
 */

export type EmployerPlanId = "basic" | "professional" | "business"

export type EmployerEntitlements = {
  plan: EmployerPlanId
  activeJobsLimit: number | null
  savedCandidatesLimit: number | null
  contactRequestsPerMonth: number | null
  hrUsersLimit: number | null
  filters: {
    profession: boolean
    city: boolean
    education: boolean
    experience: boolean
    employment: boolean
    salary: boolean
    skills: boolean
  }
  matchPercentage: boolean
  candidateProfiles: boolean
  contactRequests: boolean
  chat: boolean
  liveAvailability: boolean
  interviewPlanning: boolean
  hrCopilot: boolean
  prioritySupport: boolean
}

export const employerEntitlements: Record<EmployerPlanId, EmployerEntitlements> = {
  basic: {
    plan: "basic", activeJobsLimit: 5, savedCandidatesLimit: 5, contactRequestsPerMonth: 5, hrUsersLimit: 1,
    filters: { profession: true, city: false, education: false, experience: false, employment: false, salary: false, skills: false },
    matchPercentage: true, candidateProfiles: true, contactRequests: true, chat: false, liveAvailability: true,
    interviewPlanning: false, hrCopilot: false, prioritySupport: false,
  },
  professional: {
    plan: "professional", activeJobsLimit: 10, savedCandidatesLimit: 10, contactRequestsPerMonth: 10, hrUsersLimit: 3,
    filters: { profession: true, city: true, education: true, experience: true, employment: true, salary: true, skills: true },
    matchPercentage: true, candidateProfiles: true, contactRequests: true, chat: true, liveAvailability: true,
    interviewPlanning: false, hrCopilot: false, prioritySupport: true,
  },
  business: {
    plan: "business", activeJobsLimit: null, savedCandidatesLimit: null, contactRequestsPerMonth: null, hrUsersLimit: null,
    filters: { profession: true, city: true, education: true, experience: true, employment: true, salary: true, skills: true },
    matchPercentage: true, candidateProfiles: true, contactRequests: true, chat: true, liveAvailability: true,
    interviewPlanning: true, hrCopilot: true, prioritySupport: true,
  },
}

export type PlanFeature = { label: string; included?: boolean }
export type Plan = {
  id: string
  name: string
  description: string
  price: number | null
  period: string
  priceNote?: string
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: string
  features: PlanFeature[]
}

export const employerPlans: Plan[] = [
  {
    id: "basic", name: "Basic", description: "Für kleine Unternehmen mit gelegentlichem Personalbedarf.", price: 149, period: "/ Monat", priceNote: "30 Tage kostenlos testen", ctaLabel: "30 Tage kostenlos testen", ctaHref: "/registrieren?role=employer&plan=basic",
    features: [
      { label: "Bis zu 5 aktive Stellen" }, { label: "Kandidaten-Matching" }, { label: "Kandidatenprofile ansehen" }, { label: "Kontaktanfragen senden" },
      { label: "Kandidaten speichern (bis 5)" }, { label: "Suche nach Beruf" }, { label: "Matching-% anzeigen" }, { label: "Live-Verfügbarkeit" }, { label: "Basis-Verifizierung" },
      { label: "Chat nach akzeptierter Anfrage", included: false }, { label: "Erweiterte Suchfilter", included: false },
    ],
  },
  {
    id: "professional", name: "Professional", description: "Für Unternehmen, die regelmässig neue Mitarbeitende suchen.", price: 299, period: "/ Monat", priceNote: "30 Tage kostenlos testen", ctaLabel: "30 Tage kostenlos testen", ctaHref: "/registrieren?role=employer&plan=professional", highlighted: true, badge: "Beliebtester Plan",
    features: [
      { label: "Bis zu 10 aktive Stellen" }, { label: "Alle Suchfilter" }, { label: "Live-Verfügbarkeit" }, { label: "Direkter Chat" },
      { label: "Interviewplanung", included: false }, { label: "HR Copilot (KI)", included: false }, { label: "Prioritäts-Support" },
    ],
  },
  {
    id: "business", name: "Business", description: "Für grössere Unternehmen und HR-Teams mit mehreren Stellen.", price: 499, period: "/ Monat", priceNote: "30 Tage kostenlos testen", ctaLabel: "30 Tage kostenlos testen", ctaHref: "/registrieren?role=employer&plan=business",
    features: [
      { label: "Unbegrenzte Stellen" }, { label: "Alle Professional-Funktionen" }, { label: "Mehrere HR-Benutzer" }, { label: "HR Copilot (KI)" },
      { label: "Advanced Verification" }, { label: "Erweiterte Analytics & Reports" }, { label: "Talent Pool Management" }, { label: "Interviewplanung" }, { label: "Exporte & Integrationen" }, { label: "Prioritäts-Support" },
    ],
  },
]

export const employeePlans: Plan[] = [
  { id: "free", name: "Free", description: "Für alle, die gefunden werden möchten.", price: 0, period: "pro Monat", priceNote: "Für immer kostenlos", ctaLabel: "Profil erstellen", ctaHref: "/registrieren?role=employee", features: [{ label: "Vollständiges Profil" }, { label: "In Suchergebnissen sichtbar" }, { label: "Kontaktanfragen empfangen" }, { label: "Bildergalerie" }, { label: "Profil-Statistiken", included: false }, { label: "Premium-Platzierung", included: false }] },
  { id: "premium", name: "Premium", description: "Für alle, die schneller die richtige Stelle finden.", price: 19, period: "pro Monat", priceNote: "jederzeit kündbar", ctaLabel: "Premium testen", ctaHref: "/registrieren?role=employee&plan=premium", highlighted: true, badge: "Empfohlen", features: [{ label: "Alles aus Free" }, { label: "Premium-Platzierung in der Suche" }, { label: "Profil-Statistiken & Einblicke" }, { label: "Prioritäts-Support" }, { label: "Verifiziertes Profil-Badge" }, { label: "Frühzeitiger Zugang zu neuen Funktionen" }] },
]

export function formatPrice(price: number | null): string {
  if (price === null) return "Auf Anfrage"
  if (price === 0) return "Gratis"
  return `CHF ${price.toLocaleString("de-CH")}`
}
