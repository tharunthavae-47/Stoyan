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
    id: "starter",
    name: "Starter",
    description: "Für kleine Betriebe, die gezielt Talente finden.",
    price: 0,
    period: "pro Monat",
    priceNote: "Kostenlos starten",
    ctaLabel: "Kostenlos starten",
    ctaHref: "/registrieren?role=employer",
    features: [
      { label: "Firmenprofil anlegen" },
      { label: "Bis zu 5 Kandidaten-Ansichten / Monat" },
      { label: "Basis-Suchfilter" },
      { label: "1 aktive Kontaktanfrage" },
      { label: "Erweiterte Filter (Lohn, Radius, Pensum)", included: false },
      { label: "Priorisierter Support", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Für wachsende Unternehmen mit regelmässigem Bedarf.",
    price: 149,
    period: "pro Monat",
    priceNote: "zzgl. MwSt.",
    ctaLabel: "Professional wählen",
    ctaHref: "/registrieren?role=employer&plan=professional",
    highlighted: true,
    badge: "Beliebt",
    features: [
      { label: "Alles aus Starter" },
      { label: "Unbegrenzte Kandidaten-Ansichten" },
      { label: "Erweiterte Filter (Lohn, Radius, Pensum)" },
      { label: "Bis zu 25 aktive Kontaktanfragen" },
      { label: "Direkt-Chat mit Kandidaten" },
      { label: "Priorisierter Support" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Für grosse Teams mit individuellen Anforderungen.",
    price: null,
    period: "",
    priceNote: "Individuelles Angebot",
    ctaLabel: "Kontakt aufnehmen",
    ctaHref: "/registrieren?role=employer&plan=enterprise",
    features: [
      { label: "Alles aus Professional" },
      { label: "Unbegrenzte Kontaktanfragen" },
      { label: "Mehrere Team-Mitglieder" },
      { label: "Individuelle Onboarding-Begleitung" },
      { label: "Persönlicher Ansprechpartner" },
      { label: "Massgeschneiderte SLA" },
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
