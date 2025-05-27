import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { ZodError } from "zod";
import { nanoid } from "nanoid";
import { 
  insertCustomerSchema, 
  insertSubscriptionSchema,
  insertSubscriptionLinkSchema
} from "@shared/schema";
import { SaaSPlans, formatPrice, getPlanByTier, isValidStripePriceId, getPlanDetailsFromPriceId } from "@shared/pricing";
import axios from "axios";

// Import API routes
import checkoutRoutes from "./api/create-checkout-session";
import sessionDetailsRoutes from "./api/get-session-details";
import webhookRoutes from "./api/webhook";
import enhancedCheckoutRoutes from "./api/create-enhanced-checkout-session";
import saasBillingRoutes from "./api/saas-billing";
import authRoutes from "./api/auth";
import healthRoutes from "./api/health";

// Initialize Stripe with the secret key from environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe integration will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Register the Stripe and API routes
  app.use('/api', checkoutRoutes);
  app.use('/api', webhookRoutes);
  app.use('/api', sessionDetailsRoutes);
  app.use('/api', enhancedCheckoutRoutes);
  
  // Register authentication routes
  app.use('/api/auth', authRoutes);
  
  // Register SaaS billing routes for B2B subscription management
  app.use('/api', saasBillingRoutes);
  // API endpoint to get all plans
  app.get("/api/plans", async (req, res) => {
    try {
      // Use centralized pricing system as the definitive source
      const formattedPlans = SaaSPlans.map((plan, index) => ({
        id: index + 1,
        name: plan.name,
        tier: plan.tier,
        description: `${plan.name} plan for ${plan.tier === 'starter' ? 'new' : plan.tier === 'professional' ? 'growing' : 'enterprise'} home service businesses`,
        monthlyCents: plan.monthlyCents,
        annualCents: plan.annualCents,
        monthlyPrice: formatPrice(plan.monthlyCents),
        annualPrice: formatPrice(plan.annualCents),
        features: plan.features,
        isPopular: plan.isPopular,
        order: plan.order,
        stripeMonthlyId: plan.stripeMonthlyId,
        stripeAnnualId: plan.stripeAnnualId
      }));

      res.json(formattedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ 
        error: 'Failed to fetch plans',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
