import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Customer table to store basic customer information and widget customization
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password"), // For customer authentication
  companyName: text("company_name"),
  companyUrl: text("company_url"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#2563eb"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  textColor: text("text_color"),
  backgroundColor: text("background_color"),
  isTrialUser: boolean("is_trial_user").default(true),
  trialEndsAt: timestamp("trial_ends_at"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
});

// Subscription plans table with pricing information
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  interval: text("interval").notNull(), // 'month', 'year', 'one-time'
  stripePriceId: text("stripe_price_id"),
  features: text("features").array(),
  isPopular: boolean("is_popular").default(false),
  order: integer("order").default(0),
});

// Subscriptions table to track customer subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  planId: integer("plan_id").references(() => plans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text("status").notNull().default("pending"), // 'active', 'cancelled', 'pending'
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  canceledAt: timestamp("canceled_at"),
});

// Subscription links for CSR to generate
export const subscriptionLinks = pgTable("subscription_links", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  planId: integer("plan_id").references(() => plans.id),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by"), // Reference to admin/CSR user who created it
});

// Admin users for the dashboard
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("csr"), // 'admin', 'csr' (customer service rep)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas using drizzle-zod
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  stripeCustomerId: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  canceledAt: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
});

export const insertSubscriptionLinkSchema = createInsertSchema(subscriptionLinks).omit({
  id: true,
  createdAt: true,
  isUsed: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

// Export types for use throughout the application
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type SubscriptionLink = typeof subscriptionLinks.$inferSelect;
export type InsertSubscriptionLink = z.infer<typeof insertSubscriptionLinkSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
