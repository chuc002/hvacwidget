// Plan type matching database schema
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  interval: string; // 'month', 'year', 'one-time'
  stripePriceId?: string;
  features?: string[];
  isPopular: boolean;
  order: number;
}

// Customer type matching database schema
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  stripeCustomerId?: string;
}

// Subscription type matching database schema
export interface Subscription {
  id: number;
  customerId: number;
  planId: number;
  stripeSubscriptionId?: string;
  status: 'active' | 'cancelled' | 'pending';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  createdAt: string;
  canceledAt?: string;
  customer?: Customer;
  plan?: Plan;
}

// Subscription link type matching database schema
export interface SubscriptionLink {
  id: number;
  token: string;
  customerId?: number;
  planId?: number;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  createdBy?: number;
  customer?: Customer;
  plan?: Plan;
}

// Admin user type matching database schema
export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'csr';
}

// Type for customer info form
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

// Type for generated subscription link
export interface GeneratedLink {
  link: string;
  subscriptionLink: SubscriptionLink;
  customer: Customer;
  plan: Plan;
}
