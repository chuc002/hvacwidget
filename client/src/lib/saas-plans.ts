// SaaS subscription plans for service companies
export const SaaSPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 399,
    interval: 'month',
    stripePriceId: 'price_starter_monthly', // Will create in Stripe
    features: [
      'Embedded widget for your website',
      'Basic service plans (3 tiers)',
      'Customer data collection',
      'Email notifications',
      'Basic analytics',
      'Up to 100 customer subscriptions/month'
    ],
    limits: {
      monthlySubscriptions: 100,
      customBranding: false,
      customDomain: false,
      apiAccess: false
    }
  },
  {
    id: 'professional',
    name: 'Professional', 
    price: 699,
    interval: 'month',
    stripePriceId: 'price_professional_monthly',
    popular: true,
    features: [
      'Everything in Starter',
      'Custom branding and colors',
      'Advanced analytics dashboard',
      'Multiple service categories',
      'Priority support',
      'Custom domain integration',
      'Up to 500 customer subscriptions/month'
    ],
    limits: {
      monthlySubscriptions: 500,
      customBranding: true,
      customDomain: true,
      apiAccess: false
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    interval: 'month', 
    stripePriceId: 'price_enterprise_monthly',
    features: [
      'Everything in Professional',
      'Multi-location support',
      'API access',
      'Custom integrations',
      'White-label solution',
      'Dedicated account manager',
      'Unlimited customer subscriptions'
    ],
    limits: {
      monthlySubscriptions: -1, // unlimited
      customBranding: true,
      customDomain: true,
      apiAccess: true
    }
  }
];