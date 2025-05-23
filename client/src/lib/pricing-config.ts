/**
 * ServicePlan Pro - Pricing Configuration
 * 
 * This file serves as the single source of truth for all pricing information
 * in the ServicePlan Pro application. Any changes to pricing should be made here.
 */

// B2B SaaS Pricing Plans
export const SaaSPlans = {
  starter: { 
    id: 'starter',
    name: "Starter", 
    price: 399,
    monthlyPrice: 399,
    annualPrice: 399 * 12 * 0.85, // 15% discount for annual billing
    interval: "month",
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
  professional: { 
    id: 'professional',
    name: "Professional", 
    price: 699,
    monthlyPrice: 699,
    annualPrice: 699 * 12 * 0.85, // 15% discount for annual billing
    interval: "month",
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
  enterprise: { 
    id: 'enterprise',
    name: "Enterprise", 
    price: 999,
    monthlyPrice: 999,
    annualPrice: 999 * 12 * 0.85, // 15% discount for annual billing
    interval: "month",
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
};

// Convert to array format for components that need it
export const SaaSPlansArray = [
  SaaSPlans.starter,
  SaaSPlans.professional,
  SaaSPlans.enterprise
];

// Billing cycle options
export const billingCycles = [
  { id: 'monthly', name: 'Monthly', discount: 0 },
  { id: 'annual', name: 'Annual', discount: 15 } // 15% discount for annual billing
];

// Helper functions
export function getPlanById(planId: string) {
  return SaaSPlansArray.find(plan => plan.id === planId);
}

export function getPlanStripePriceId(planId: string, billingCycle: 'monthly' | 'annual' = 'monthly') {
  const plan = Object.values(SaaSPlans).find(p => p.id === planId);
  if (!plan) return null;
  
  return billingCycle === 'annual' ? plan.annualStripePriceId : plan.stripePriceId;
}

// End-customer maintenance plan pricing (for the widget)
export const maintenancePlans = {
  basic: {
    id: 1,
    name: "Basic",
    description: "Essential maintenance for residential systems",
    price: "149.99",
    interval: "year",
    features: [
      "Annual tune-up",
      "Filter replacement",
      "Priority scheduling",
      "10% discount on repairs"
    ],
    isPopular: false,
    stripePriceId: "price_1RRcnlGxl1XxufT4i2vJmX0m"
  },
  premium: {
    id: 2,
    name: "Premium",
    description: "Comprehensive coverage for your HVAC system",
    price: "249.99",
    interval: "year",
    features: [
      "Semi-annual tune-ups",
      "Filter replacements",
      "Priority scheduling",
      "15% discount on repairs",
      "No overtime charges"
    ],
    isPopular: true,
    stripePriceId: "price_1RRcoYGxl1XxufT4KFZbeJsn"
  },
  ultimate: {
    id: 3,
    name: "Ultimate",
    description: "Complete protection and maximum savings",
    price: "349.99",
    interval: "year",
    features: [
      "Quarterly tune-ups",
      "Filter replacements",
      "Same-day service",
      "20% discount on repairs",
      "No overtime charges",
      "Free diagnostic visits"
    ],
    isPopular: false,
    stripePriceId: "price_1RRcp8Gxl1XxufT4oYuK4HG5"
  }
};

// Convert to array format for components that need it
export const maintenancePlansArray = Object.values(maintenancePlans);