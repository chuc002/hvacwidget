import { sql } from 'drizzle-orm';
import { pgTable, text, integer, serial, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// SaaS Customers table (companies that pay for our platform)
export const saasCustomers = pgTable("saas_customers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  industry: text("industry"),
  website: text("website"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planId: text("plan_id").default("starter"),
  status: text("status").default("trial").notNull(), // trial, active, cancelled, past_due
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodEnd: timestamp("current_period_end"),
  branding: json("branding").$type<{
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    customDomain?: string;
  }>().default({}),
  apiKey: text("api_key").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SaaS Plans table
export const saasPlans = pgTable("saas_plans", {
  id: text("id").primaryKey(), // starter, professional, enterprise
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents (USD)
  interval: text("interval").default("month").notNull(), // month, year
  stripePriceId: text("stripe_price_id"),
  isPopular: boolean("is_popular").default(false),
  features: json("features").$type<string[]>().default([]),
  limits: json("limits").$type<{
    monthlySubscriptions: number;
    customBranding: boolean;
    customDomain: boolean;
    apiAccess: boolean;
  }>().default({
    monthlySubscriptions: 100,
    customBranding: false,
    customDomain: false,
    apiAccess: false
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertSaasCustomerSchema = createInsertSchema(saasCustomers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSaasPlansSchema = createInsertSchema(saasPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type SaasCustomer = typeof saasCustomers.$inferSelect;
export type InsertSaasCustomer = z.infer<typeof insertSaasCustomerSchema>;

export type SaasPlan = typeof saasPlans.$inferSelect;
export type InsertSaasPlan = z.infer<typeof insertSaasPlansSchema>;