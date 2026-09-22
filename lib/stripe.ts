export const STRIPE_PRICE_IDS = {
  basic: "price_1UBUe7R6nscSb26ogiAK7PoI",
  professional: "price_1UBUegR6nscSb26odgrCvfAC",
  business: "price_1UBUeuR6nscSb26ouYPo6Y8Z",
} as const

// Arbeitnehmer Premium: monatlicher Stripe Price.
// Den Price aus dem Stripe-Dashboard in Vercel als STRIPE_EMPLOYEE_PREMIUM_PRICE_ID hinterlegen.
export function getEmployeePremiumPriceId() {
  return process.env.STRIPE_EMPLOYEE_PREMIUM_PRICE_ID || "price_1UITb1R6nscSb26oaVgF6IhM"
}

export type PaidPlan = keyof typeof STRIPE_PRICE_IDS
export type EmployeePaidPlan = "premium"
