/**
 * =========================================================================
 * ABO-VARIANTEN – zentrale Konfiguration
 * =========================================================================
 *
 * Hier kannst du ALLE Preise, Pläne und Features bequem anpassen,
 * ohne die Seiten-Komponenten anzufassen.
 *
 * - Preise ändern:        `price` anpassen (Zahl in CHF, oder null für "auf Anfrage")
 * - Plan hinzufügen:      neues Objekt zum passenden Array hinzufügen
 * - Plan entfernen:       Objekt löschen
 * - Feature ändern:       Eintrag in `features` bearbeiten
 * - Feature ausgrauen:    `{ label: "...", included: false }`
 * - Beliebtesten Plan:    `highlighted: true` setzen (nur bei einem Plan)
 * - Button-Ziel ändern:   `ctaHref` anpassen
 *
 * Änderungen wirken sich sofort auf die Seite /preise aus.
 * =========================================================================
 */

export type PlanFeature = {
  label: string
  /** false = Feature ist im Plan nicht enthalten (wird ausgegraut dargestellt) */
  included?: boolean
}

export type Plan = {
  /** Eindeutiger technischer Schlüssel (z. B. für spätere Zahlungsanbindung) */
  id: string
  /** Angezeigter Name */
  name: string
  /** Kurzbeschreibung unter dem Namen */
  description: string
  /** Preis als Zahl in CHF. null = "Auf Anfrage" */
  price: number | null
  /** Abrechnungszeitraum, z. B. "pro Monat" oder "pro Jahr" */
  period: string
  /** Optionaler Zusatz, z. B. "zzgl. MwSt." oder "pro Stelle" */
  priceNote?: string
  /** Text auf dem Button */
  ctaLabel: string
  /** Ziel-Link des Buttons */
  ctaHref: string
  /** Hebt diesen Plan als empfohlen hervor (nur bei einem Plan setzen) */
  highlighted?: boolean
  /** Optionales Badge oben auf der Karte, z. B. "Beliebt" */
  badge?: string
  /** Feature-Liste */
  features: PlanFeature[]
}

/**
 * -------------------------------------------------------------------------
 * PLÄNE FÜR ARBEITGEBER
 * -------------------------------------------------------------------------
 */
export const employerPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Für kleine Unternehmen mit gelegentlichem Personalbedarf.",
    price: 149,
    period: "/ Monat",
    priceNote: "30 Tage kostenlos testen",
    ctaLabel: "30 Tage kostenlos testen",
    ctaHref: "/registrieren?role=employer&plan=basic",
    features: [
      { label: "Bis zu 3 aktive Stellen" },
      { label: "Kandidaten-Matching" },
      { label: "Kandidatenprofile ansehen" },
      { label: "Direkter Chat" },
      { label: "Kandidaten speichern" },
      { label: "Basis-Verifizierung" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Für Unternehmen, die regelmässig neue Mitarbeitende suchen.",
    price: 299,
    period: "/ Monat",
    priceNote: "30 Tage kostenlos testen",
    ctaLabel: "30 Tage kostenlos testen",
    ctaHref: "/registrieren?role=employer&plan=professional",
    highlighted: true,
    badge: "Beliebtester Plan",
    features: [
      { label: "Bis zu 10 aktive Stellen" },
      { label: "Intelligentes Matching" },
      { label: "Match DNA" },
      { label: "Verified Candidates" },
      { label: "Verification Center" },
      { label: "Talent Radar" },
      { label: "Live-Verfügbarkeit" },
      { label: "Recruiting Analytics" },
      { label: "Interviewplanung" },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Für grössere Unternehmen und HR-Teams mit mehreren Stellen.",
    price: 499,
    period: "/ Monat",
    priceNote: "Demo verfügbar",
    ctaLabel: "Demo anfragen",
    ctaHref: "/registrieren?role=employer&plan=business",
    features: [
      { label: "Unbegrenzte Stellen" },
      { label: "Alle Professional-Funktionen" },
      { label: "Mehrere HR-Benutzer" },
      { label: "HR Copilot" },
      { label: "Advanced Verification" },
      { label: "Erweiterte Analytics & Reports" },
      { label: "Talent Pool Management" },
      { label: "Exporte & Integrationen" },
      { label: "Prioritäts-Support" },
    ],
  },
]

/**
 * -------------------------------------------------------------------------
 * PLÄNE FÜR ARBEITNEHMER
 * -------------------------------------------------------------------------
 */
export const employeePlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Für alle, die gefunden werden möchten.",
    price: 0,
    period: "pro Monat",
    priceNote: "Für immer kostenlos",
    ctaLabel: "Profil erstellen",
    ctaHref: "/registrieren?role=employee",
    features: [
      { label: "Vollständiges Profil" },
      { label: "In Suchergebnissen sichtbar" },
      { label: "Kontaktanfragen empfangen" },
      { label: "Bildergalerie" },
      { label: "Profil-Statistiken", included: false },
      { label: "Premium-Platzierung", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Für alle, die schneller die richtige Stelle finden.",
    price: 19,
    period: "pro Monat",
    priceNote: "jederzeit kündbar",
    ctaLabel: "Premium testen",
    ctaHref: "/registrieren?role=employee&plan=premium",
    highlighted: true,
    badge: "Empfohlen",
    features: [
      { label: "Alles aus Free" },
      { label: "Premium-Platzierung in der Suche" },
      { label: "Profil-Statistiken & Einblicke" },
      { label: "Prioritäts-Support" },
      { label: "Verifiziertes Profil-Badge" },
      { label: "Frühzeitiger Zugang zu neuen Funktionen" },
    ],
  },
]

/** Formatiert einen Preis für die Anzeige (CHF, ohne Nachkommastellen). */
export function formatPrice(price: number | null): string {
  if (price === null) return "Auf Anfrage"
  if (price === 0) return "Gratis"
  return `CHF ${price.toLocaleString("de-CH")}`
}
