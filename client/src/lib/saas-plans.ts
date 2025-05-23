// SaaS subscription plans for service companies
export const SaaSPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 399,
    interval: 'month',
    stripePriceId: 'price_1RRcnlGxl1XxufT4i2vJmX0m', // Monthly Stripe Price ID
    annualStripePriceId: 'price_1RRfoCGdBJ6HrZFiH1nNPJ2n', // Annual Stripe Price ID
    popular: false,
    features: [
      'Subscription widget',
      'Basic customization',
      'Up to 100 customers/month',
      'Email support',
      'Recurring billing for your customers',
      'Customer management portal'
    ],
    limits: {
      monthlyCustomers: 100, 
      customBranding: false, 
      products: false, 
      invoices: false,
      multiLocation: false,
      apiAccess: false,
      supportLevel: 'email'
    }
  },
  {
    id: 'professional',
    name: 'Professional', 
    price: 699,
    interval: 'month',
    stripePriceId: 'price_1RRcoYGxl1XxufT4KFZbeJsn', // Monthly Stripe Price ID
    annualStripePriceId: 'price_1RRfoZGdBJ6HrZFi1tlrrdUS', // Annual Stripe Price ID
    popular: true,
    features: [
      'Everything in Starter',
      'Product catalog & equipment sales',
      'Custom branding & colors',
      'Up to 500 customers/month',
      'Priority support',
      'Custom domain integration',
      'Advanced analytics dashboard'
    ],
    limits: {
      monthlyCustomers: 500,
      customBranding: true,
      products: true,
      invoices: false,
      multiLocation: false,
      apiAccess: false,
      supportLevel: 'priority'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    interval: 'month', 
    stripePriceId: 'price_1RRcp8Gxl1XxufT4oYuK4HG5', // Monthly Stripe Price ID
    annualStripePriceId: 'price_1RRfowGdBJ6HrZFiOeOXyO5P', // Annual Stripe Price ID
    popular: false,
    features: [
      'Everything in Professional',
      'Invoice payments',
      'Multi-location support',
      'Unlimited customers',
      'Phone & priority support',
      'API access for integrations',
      'White-labeling options',
      'Dedicated account manager'
    ],
    limits: {
      monthlyCustomers: -1, // unlimited
      customBranding: true,
      products: true,
      invoices: true,
      multiLocation: true,
      apiAccess: true,
      supportLevel: 'dedicated'
    }
  }
];

// Billing cycle options
export const billingCycles = [
  { id: 'monthly', name: 'Monthly', discount: 0 },
  { id: 'annual', name: 'Annual', discount: 15 } // 15% discount for annual billing
];

// Helper functions for plan management
export function getPlanById(planId: string) {
  return SaaSPlans.find(plan => plan.id === planId);
}

export function getPlanFeatureAccess(planId: string) {
  const plan = getPlanById(planId);
  if (!plan) return null;
  return plan.limits;
}

export function canAccessFeature(planId: string, feature: keyof typeof SaaSPlans[0]['limits']) {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  return !!plan.limits[feature];
}

export function getCustomerLimit(planId: string) {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  
  return plan.limits.monthlyCustomers;
}

export function isWithinCustomerLimit(planId: string, currentCustomerCount: number) {
  const customerLimit = getCustomerLimit(planId);
  // -1 represents unlimited
  if (customerLimit === -1) return true;
  
  return currentCustomerCount <= customerLimit;
}

export function getStripePriceId(planId: string, billingCycle: 'monthly' | 'annual' = 'monthly') {
  const plan = getPlanById(planId);
  if (!plan) return null;
  
  return billingCycle === 'annual' ? plan.annualStripePriceId : plan.stripePriceId;
}

export function calculateAnnualPrice(monthlyPrice: number) {
  const annualDiscount = billingCycles.find(cycle => cycle.id === 'annual')?.discount || 0;
  const annualPrice = monthlyPrice * 12 * (1 - annualDiscount / 100);
  return Math.round(annualPrice);
}

// Usage tracking interfaces
export interface UsageMetrics {
  currentCustomerCount: number;
  apiCallsCount: number;
  storageUsed: number; // in MB
  locations: number;
}

// Return whether the user is near or over their plan limits
export function checkPlanLimits(planId: string, usage: UsageMetrics) {
  const plan = getPlanById(planId);
  if (!plan) return { withinLimits: false, nearLimit: false };
  
  // For unlimited plans
  if (plan.limits.monthlyCustomers === -1) {
    return { withinLimits: true, nearLimit: false };
  }
  
  const customerLimit = plan.limits.monthlyCustomers;
  const withinLimits = usage.currentCustomerCount <= customerLimit;
  const nearLimit = usage.currentCustomerCount >= customerLimit * 0.9; // 90% of limit
  
  return {
    withinLimits,
    nearLimit
  };
}