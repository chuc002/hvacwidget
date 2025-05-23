/**
 * ServicePlan Pro - Stripe Integration
 * 
 * This file handles mapping between our pricing tiers and Stripe price IDs.
 * It provides a single point of configuration for all Stripe-related constants.
 */

// Mapping of price IDs for different billing intervals and plans
export interface StripePriceMapping {
  monthly: string;
  annual: string;
}

export interface StripePriceConfig {
  [planKey: string]: StripePriceMapping;
}

// Get environment variables for price IDs
export const STRIPE_PRICE_IDS: StripePriceConfig = {
  STARTER: {
    monthly: process.env.STARTER_MONTHLY_PRICE_ID || 'price_1RS13JGdBJ6HrZFiK5NRUrCs',
    annual: process.env.STARTER_ANNUAL_PRICE_ID || '',
  },
  PROFESSIONAL: {
    monthly: process.env.PROFESSIONAL_MONTHLY_PRICE_ID || 'price_1RS13iGdBJ6HrZFifmYmquFe',
    annual: process.env.PROFESSIONAL_ANNUAL_PRICE_ID || '',
  },
  ENTERPRISE: {
    monthly: process.env.ENTERPRISE_MONTHLY_PRICE_ID || 'price_1RS142GdBJ6HrZFiszeryhra',
    annual: process.env.ENTERPRISE_ANNUAL_PRICE_ID || '',
  }
};

// Get the Stripe price ID based on plan name and billing interval
export function getStripePriceId(planName: string, isAnnual: boolean = false): string {
  const normalizedPlanName = planName.toUpperCase() as keyof typeof STRIPE_PRICE_IDS;
  
  if (!STRIPE_PRICE_IDS[normalizedPlanName]) {
    throw new Error(`Invalid plan name: ${planName}`);
  }
  
  const interval = isAnnual ? 'annual' : 'monthly';
  const priceId = STRIPE_PRICE_IDS[normalizedPlanName][interval];
  
  if (!priceId) {
    throw new Error(`No price ID configured for ${planName} with ${interval} billing`);
  }
  
  return priceId;
}

// Validate a Stripe price ID is in our configuration
export function isValidStripePriceId(priceId: string): boolean {
  // Check if the price ID exists in our configuration
  for (const plan of Object.values(STRIPE_PRICE_IDS)) {
    if (Object.values(plan).includes(priceId)) {
      return true;
    }
  }
  return false;
}

// Get plan key from price ID
export function getPlanKeyFromPriceId(priceId: string): string | null {
  for (const [planKey, plan] of Object.entries(STRIPE_PRICE_IDS)) {
    if (Object.values(plan).includes(priceId)) {
      return planKey;
    }
  }
  return null;
}

// Get billing interval from price ID
export function getBillingIntervalFromPriceId(priceId: string): 'monthly' | 'annual' | null {
  for (const plan of Object.values(STRIPE_PRICE_IDS)) {
    if (plan.monthly === priceId) {
      return 'monthly';
    }
    if (plan.annual === priceId) {
      return 'annual';
    }
  }
  return null;
}