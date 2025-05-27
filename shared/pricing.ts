/**
 * ServicePlan Pro - Central Pricing System
 * 
 * This is the definitive source of truth for all pricing in the application.
 * All components and server code should import pricing details from this file.
 * Never hardcode prices anywhere else in the application.
 */

/**
 * Core plan structure defining all available ServicePlan Pro subscription tiers
 */
/**
 * Get environment variable value (works in both client and server contexts)
 */
function getEnvVar(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

export const SaaSPlans = [
  {
    tier: 'starter',
    name: 'Starter',
    monthlyCents: 39900, // $399
    annualCents: 399000, // $3,990 (save $1,000)
    stripeMonthlyId: getEnvVar('STRIPE_STARTER_MONTHLY_ID'),
    stripeAnnualId: getEnvVar('STRIPE_STARTER_ANNUAL_ID'),
    features: ['Basic subscription widget', 'Up to 100 customers/month', 'Email support'],
    isPopular: false,
    order: 1
  },
  {
    tier: 'professional', 
    name: 'Professional',
    monthlyCents: 69900, // $699
    annualCents: 699000, // $6,990 (save $1,400)
    stripeMonthlyId: getEnvVar('STRIPE_PROFESSIONAL_MONTHLY_ID'),
    stripeAnnualId: getEnvVar('STRIPE_PROFESSIONAL_ANNUAL_ID'),
    features: [
      'Everything in Starter', 
      'Product catalog', 
      'Custom branding', 
      'Up to 500 customers/month',
      'Priority support'
    ],
    isPopular: true,
    order: 2
  },
  {
    tier: 'enterprise',
    name: 'Enterprise', 
    monthlyCents: 99900, // $999
    annualCents: 999000, // $9,990 (save $2,000)
    stripeMonthlyId: getEnvVar('STRIPE_ENTERPRISE_MONTHLY_ID'),
    stripeAnnualId: getEnvVar('STRIPE_ENTERPRISE_ANNUAL_ID'),
    features: [
      'Everything in Professional', 
      'Invoice payments', 
      'Multi-location support', 
      'API access',
      'Unlimited customers',
      'Dedicated account manager'
    ],
    isPopular: false,
    order: 3
  }
];

/**
 * Helper function to format cents to dollars with proper currency formatting
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cents / 100);
}

/**
 * Calculates the monthly equivalent price from annual plan cents
 */
export function calculateMonthlyFromAnnual(annualCents: number): number {
  return Math.round(annualCents / 12);
}

/**
 * Calculates savings amount when choosing annual plan over monthly
 */
export function calculateAnnualSavings(monthlyCents: number, annualCents: number): number {
  return (monthlyCents * 12) - annualCents;
}

/**
 * Returns plan by tier identifier
 */
export function getPlanByTier(tier: string) {
  return SaaSPlans.find(plan => plan.tier === tier.toLowerCase());
}

/**
 * Returns monthly Stripe price ID for given tier
 */
export function getMonthlyPriceId(tier: string): string | undefined {
  const plan = getPlanByTier(tier);
  return plan?.stripeMonthlyId;
}

/**
 * Returns annual Stripe price ID for given tier
 */
export function getAnnualPriceId(tier: string): string | undefined {
  const plan = getPlanByTier(tier);
  return plan?.stripeAnnualId;
}

/**
 * Determines if a price ID belongs to any plan in our system
 */
export function isValidStripePriceId(priceId: string): boolean {
  return SaaSPlans.some(plan => 
    plan.stripeMonthlyId === priceId || plan.stripeAnnualId === priceId
  );
}

/**
 * Maps from a Stripe price ID back to the plan tier and billing interval
 */
export function getPlanDetailsFromPriceId(priceId: string): { tier: string; isAnnual: boolean } | null {
  for (const plan of SaaSPlans) {
    if (plan.stripeMonthlyId === priceId) {
      return { tier: plan.tier, isAnnual: false };
    }
    if (plan.stripeAnnualId === priceId) {
      return { tier: plan.tier, isAnnual: true };
    }
  }
  return null;
}