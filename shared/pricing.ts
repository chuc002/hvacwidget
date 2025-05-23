/**
 * ServicePlan Pro - Pricing Constants
 * 
 * This is the single source of truth for all pricing in the application.
 * All components and server code should import pricing from this file.
 * Never hardcode prices anywhere else in the application.
 */

export interface PlanPricing {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;  // Total annual price
  monthlySavings: number; // How much saved per month with annual plan
  annualSavings: number;  // Total annual savings
  features: string[];
  isPopular: boolean;
  order: number;
  customerLimit: number | "unlimited";
  supportLevel: string;
}

export const PLANS: Record<string, PlanPricing> = {
  STARTER: {
    name: "Starter",
    description: "Perfect for new home service businesses",
    monthlyPrice: 399,
    annualPrice: 3990,  // Save $1,000/year
    monthlySavings: 83.33,
    annualSavings: 1000,
    features: [
      "Up to 100 customers/month",
      "Basic subscription widget",
      "Email support",
      "Mobile-optimized checkout",
      "Stripe payment processing",
      "Basic analytics"
    ],
    isPopular: false,
    order: 1,
    customerLimit: 100,
    supportLevel: "Email"
  },
  PROFESSIONAL: {
    name: "Professional",
    description: "Most popular for growing home service companies",
    monthlyPrice: 699,
    annualPrice: 6990,  // Save $1,400/year
    monthlySavings: 116.67,
    annualSavings: 1400,
    features: [
      "Up to 500 customers/month",
      "Advanced subscription widget",
      "Product catalog & sales",
      "Custom branding",
      "Priority support",
      "Advanced analytics dashboard",
      "API access"
    ],
    isPopular: true,
    order: 2,
    customerLimit: 500,
    supportLevel: "Priority"
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "For established home service companies",
    monthlyPrice: 999,
    annualPrice: 9990,  // Save $2,000/year
    monthlySavings: 166.67,
    annualSavings: 2000,
    features: [
      "Unlimited customers",
      "Full multi-revenue widget",
      "Invoice payment processing",
      "Multi-location support",
      "Dedicated account manager",
      "White-label solution",
      "Custom integrations"
    ],
    isPopular: false,
    order: 3,
    customerLimit: "unlimited",
    supportLevel: "Dedicated"
  }
};

// Helper function to format prices
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Helper to format monthly equivalent of annual price
export function formatMonthlyEquivalent(annualPrice: number): string {
  const monthlyEquivalent = annualPrice / 12;
  return monthlyEquivalent.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Get plans as an array (sorted by order)
export function getPlansArray(): PlanPricing[] {
  return Object.values(PLANS).sort((a, b) => a.order - b.order);
}

// Get plan by name
export function getPlanByName(name: string): PlanPricing | undefined {
  return Object.values(PLANS).find(plan => 
    plan.name.toLowerCase() === name.toLowerCase()
  );
}

// Get plan by price (useful when matching Stripe prices)
export function getPlanByMonthlyPrice(price: number): PlanPricing | undefined {
  return Object.values(PLANS).find(plan => plan.monthlyPrice === price);
}