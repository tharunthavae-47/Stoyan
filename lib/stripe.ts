export const STRIPE_PRICE_IDS = {
  basic: "price_1UBUe7R6nscSb26ogiAK7PoI",
  professional: "price_1UBUegR6nscSb26odgrCvfAC",
  business: "price_1UBUeuR6nscSb26ouYPo6Y8Z",
} as const

export type PaidPlan = keyof typeof STRIPE_PRICE_IDS
