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
import customerRoutes from "./api/customer";

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
  
  // Register customer management routes for onboarding and customization
  app.use('/api/customer', customerRoutes);
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

  // API endpoint to create a subscription via Stripe
  app.post("/api/create-subscription", async (req, res) => {
    try {
      // Validate the submitted data
      const { planId, customerInfo } = req.body;

      if (!planId || !customerInfo) {
        return res.status(400).json({ 
          message: "Missing required data: planId or customerInfo" 
        });
      }

      if (!stripe) {
        return res.status(500).json({ 
          message: "Stripe is not configured" 
        });
      }

      // Validate customer info using the schema
      const validatedCustomerInfo = insertCustomerSchema.parse(customerInfo);
      
      // Get the plan details
      const plan = await storage.getPlanById(planId);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      // Check if the customer already exists
      let customer = await storage.getCustomerByEmail(validatedCustomerInfo.email);
      
      // If customer doesn't exist, create them
      if (!customer) {
        customer = await storage.createCustomer(validatedCustomerInfo);
      }

      // Create or get a Stripe customer
      let stripeCustomer;
      if (customer.stripeCustomerId) {
        stripeCustomer = await stripe.customers.retrieve(customer.stripeCustomerId);
      } else {
        stripeCustomer = await stripe.customers.create({
          email: customer.email,
          name: customer.name,
          phone: customer.phone || undefined,
        });
        
        // Update the customer with the Stripe customer ID
        customer = await storage.updateCustomerStripeId(customer.id, stripeCustomer.id);
      }

      // Define mode and line items based on plan interval
      let mode: 'payment' | 'subscription';
      let lineItems;

      if (plan.interval === 'one-time') {
        mode = 'payment';
        lineItems = [
          {
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(parseFloat(plan.price.toString()) * 100), // Convert to cents
              product_data: {
                name: plan.name,
                description: plan.description,
              },
            },
            quantity: 1,
          }
        ];
      } else {
        mode = 'subscription';
        // For subscriptions, use the pre-configured price object
        if (!plan.stripePriceId) {
          return res.status(500).json({ message: "Plan does not have a configured Stripe price ID" });
        }

        lineItems = [
          {
            price: plan.stripePriceId,
            quantity: 1,
          }
        ];
      }

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: mode,
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          customerId: customer.id.toString(),
          planId: plan.id.toString(),
          planName: plan.name,
        },
      });

      // Create a pending subscription in our database
      const subscription = await storage.createSubscription({
        customerId: customer.id,
        planId: plan.id,
        status: 'pending',
        stripeSubscriptionId: null, // Will be updated after successful payment
      });

      // Return the session ID to the client
      res.status(200).json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid customer data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Stripe Connect Routes for HVAC companies to collect payments
  app.post('/api/stripe/connect/create-account', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe not configured. Please add your STRIPE_SECRET_KEY to get started.' });
      }
      
      // For demo purposes - will connect to real authentication later
      const customer = {
        id: 1,
        email: "demo@example.com",
        name: "Demo User",
        companyName: "Demo HVAC Company"
      };

      // Create Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: customer.email,
        business_type: 'company',
        company: {
          name: customer.companyName || customer.name,
        },
      });

      // Create onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${req.get('origin')}/payment-setup?refresh=true`,
        return_url: `${req.get('origin')}/payment-setup?success=true`,
        type: 'account_onboarding',
      });

      res.json({ 
        account_id: account.id,
        onboarding_url: accountLink.url 
      });
    } catch (error: any) {
      console.error('Error creating Stripe Connect account:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stripe/connect/callback', async (req, res) => {
    try {
      const { account_id } = req.query;
      
      if (!account_id || typeof account_id !== 'string') {
        return res.status(400).json({ error: 'Missing account_id' });
      }

      if (!stripe) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      // Retrieve account to check status
      const account = await stripe.accounts.retrieve(account_id);

      res.json({ 
        success: true,
        account: {
          id: account.id,
          details_submitted: account.details_submitted,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled
        }
      });
    } catch (error: any) {
      console.error('Error processing Connect callback:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stripe/connect/status', async (req, res) => {
    try {
      // Return not connected status for demo
      res.json({ connected: false });
    } catch (error: any) {
      console.error('Error getting Connect status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Webhook handler for Stripe events
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripe || !endpointSecret) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err}`);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata?.customerId || !session.metadata?.planId) {
          console.error("Missing metadata in session:", session);
          break;
        }

        const customerId = parseInt(session.metadata.customerId);
        const planId = parseInt(session.metadata.planId);
        
        try {
          // Get the customer and plan
          const customer = await storage.getCustomerById(customerId);
          const plan = await storage.getPlanById(planId);
          
          if (!customer || !plan) {
            console.error("Customer or plan not found", { customerId, planId });
            break;
          }

          // For subscription mode, get the subscription ID
          let stripeSubscriptionId = null;
          let currentPeriodStart = null;
          let currentPeriodEnd = null;

          if (session.mode === 'subscription' && session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            stripeSubscriptionId = subscription.id;

            if (subscription.current_period_start && subscription.current_period_end) {
              currentPeriodStart = new Date(subscription.current_period_start * 1000);
              currentPeriodEnd = new Date(subscription.current_period_end * 1000);
            }
          }

          // Find the pending subscription
          const pendingSubscriptions = await storage.getSubscriptionsByCustomerId(customerId);
          const pendingSubscription = pendingSubscriptions.find(s => 
            s.planId === planId && s.status === 'pending' && !s.stripeSubscriptionId
          );

          if (pendingSubscription) {
            // Update the subscription
            await storage.updateSubscriptionStatus(pendingSubscription.id, 'active');
            
            if (stripeSubscriptionId) {
              await storage.updateSubscriptionStripeId(pendingSubscription.id, stripeSubscriptionId);
            }
            
            if (currentPeriodStart && currentPeriodEnd) {
              await storage.updateSubscriptionPeriod(
                pendingSubscription.id, 
                currentPeriodStart, 
                currentPeriodEnd
              );
            }
          } else {
            // Create a new active subscription
            await storage.createSubscription({
              customerId: customerId,
              planId: planId,
              status: 'active',
              stripeSubscriptionId,
              currentPeriodStart,
              currentPeriodEnd,
            });
          }

          // Send data to webhook (Zapier integration)
          if (process.env.ZAPIER_WEBHOOK_URL) {
            try {
              await axios.post(process.env.ZAPIER_WEBHOOK_URL, {
                customer: {
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone,
                  stripeCustomerId: customer.stripeCustomerId,
                },
                plan: {
                  name: plan.name,
                  price: plan.price.toString(),
                  interval: plan.interval,
                },
                subscription: {
                  stripeSubscriptionId,
                  date: new Date().toISOString(),
                },
              });
              console.log("Successfully sent data to Zapier webhook");
            } catch (error) {
              console.error("Error sending data to Zapier webhook:", error);
            }
          }
        } catch (error) {
          console.error("Error processing checkout.session.completed event:", error);
        }
        break;
      }
      
      case 'subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        try {
          const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
          
          if (dbSubscription) {
            // Update the subscription status
            const status = subscription.status === 'active' ? 'active' 
              : subscription.status === 'canceled' ? 'cancelled' 
              : 'pending';
              
            await storage.updateSubscriptionStatus(dbSubscription.id, status);
            
            // Update the current period
            if (subscription.current_period_start && subscription.current_period_end) {
              await storage.updateSubscriptionPeriod(
                dbSubscription.id,
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000)
              );
            }
          }
        } catch (error) {
          console.error("Error processing subscription.updated event:", error);
        }
        break;
      }
      
      case 'subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        try {
          const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
          
          if (dbSubscription) {
            await storage.updateSubscriptionStatus(dbSubscription.id, 'cancelled');
          }
        } catch (error) {
          console.error("Error processing subscription.deleted event:", error);
        }
        break;
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  });

  // API endpoint to get subscriptions (requires authentication in a real app)
  app.get("/api/subscriptions", async (req, res) => {
    // In a real app, this would check for admin authentication
    try {
      const subscriptions = await storage.getSubscriptions();
      
      // For each subscription, get the customer and plan details
      const result = await Promise.all(subscriptions.map(async (subscription) => {
        const customer = await storage.getCustomerById(subscription.customerId);
        const plan = await storage.getPlanById(subscription.planId);
        
        return {
          ...subscription,
          customer,
          plan,
        };
      }));
      
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // API endpoint to get customers (requires authentication in a real app)
  app.get("/api/customers", async (req, res) => {
    // In a real app, this would check for admin authentication
    try {
      const customers = await storage.getCustomers();
      
      // For each customer, get their subscriptions
      const result = await Promise.all(customers.map(async (customer) => {
        const subscriptions = await storage.getSubscriptionsByCustomerId(customer.id);
        
        // Get the active subscription
        const activeSubscription = subscriptions.find(s => s.status === 'active');
        
        return {
          ...customer,
          activeSubscription,
        };
      }));
      
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // API endpoint to generate a subscription link
  app.post("/api/generate-link", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, planId } = req.body;

      // Validate required fields
      if (!customerName || !customerEmail || !planId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if the plan exists
      const plan = await storage.getPlanById(planId);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      // Check if the customer already exists or create a new one
      let customer = await storage.getCustomerByEmail(customerEmail);
      
      if (!customer) {
        customer = await storage.createCustomer({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        });
      }

      // Generate a unique token
      const token = nanoid(16);
      
      // Set expiration date to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Create the subscription link
      const subscriptionLink = await storage.createSubscriptionLink({
        token,
        customerId: customer.id,
        planId,
        expiresAt,
        createdBy: 1, // In a real app, this would be the authenticated admin's ID
      });

      // Generate the full URL
      const origin = req.headers.origin || 'http://localhost:5000';
      const url = `${origin}/subscribe/${token}`;
      
      res.status(200).json({
        link: url,
        subscriptionLink,
        customer,
        plan,
      });
    } catch (error) {
      console.error("Error generating subscription link:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to generate subscription link" });
    }
  });

  // API endpoint to get active subscription links
  app.get("/api/subscription-links", async (req, res) => {
    try {
      const links = await storage.getActiveSubscriptionLinks();
      
      // Get customer and plan details for each link
      const result = await Promise.all(links.map(async (link) => {
        const customer = link.customerId ? await storage.getCustomerById(link.customerId) : null;
        const plan = link.planId ? await storage.getPlanById(link.planId) : null;
        
        return {
          ...link,
          customer,
          plan,
        };
      }));
      
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching subscription links:", error);
      res.status(500).json({ message: "Failed to fetch subscription links" });
    }
  });

  // API endpoint to get subscription link by token
  app.get("/api/subscription-link/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      const link = await storage.getSubscriptionLinkByToken(token);
      
      if (!link) {
        return res.status(404).json({ message: "Subscription link not found" });
      }
      
      // Check if the link is expired
      if (link.expiresAt < new Date()) {
        return res.status(400).json({ message: "Subscription link has expired" });
      }
      
      // Check if the link has already been used
      if (link.isUsed) {
        return res.status(400).json({ message: "Subscription link has already been used" });
      }
      
      // Get customer and plan details
      const customer = link.customerId ? await storage.getCustomerById(link.customerId) : null;
      const plan = link.planId ? await storage.getPlanById(link.planId) : null;
      
      res.status(200).json({
        ...link,
        customer,
        plan,
      });
    } catch (error) {
      console.error("Error fetching subscription link:", error);
      res.status(500).json({ message: "Failed to fetch subscription link" });
    }
  });

  // Register health check routes for monitoring
  app.use('/api', healthRoutes);
  
  const httpServer = createServer(app);
  return httpServer;
}
