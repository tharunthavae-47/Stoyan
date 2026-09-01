export const STRIPE_PRICE_IDS = {
  premium: "price_1UAr8GR6nscSb26oLbvq6bop",
  professional: "price_1UAr7kR6nscSb26o6zMxmsEM",
} as const

export type PaidPlan = keyof typeof STRIPE_PRICE_IDS
