import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { ZodError } from "zod";
import { nanoid } from "nanoid";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { 
  insertCustomerSchema, 
  insertSubscriptionSchema,
  insertSubscriptionLinkSchema
} from "@shared/schema";
import { SaaSPlans, formatPrice, getPlanByTier, isValidStripePriceId, getPlanDetailsFromPriceId } from "@shared/pricing";
import { requireAuth, requireTenant } from "./middleware/auth";
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

// Password hashing utilities
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

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

  // Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { companyName, email, password, phone, website, industry, plan = 'starter' } = req.body;
      
      if (!companyName || !email || !password) {
        return res.status(400).json({ error: 'Company name, email, and password are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }

      // Check if email already exists
      const existingCustomer = await storage.getCustomerByEmail(email);
      if (existingCustomer) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create customer
      const newCustomer = await storage.createCustomer({
        companyName,
        email,
        phone: phone || '',
        website: website || '',
        industry: industry || '',
        customization: {},
        passwordHash
      });

      // Set session
      req.session!.userId = newCustomer.id;
      req.session!.userEmail = newCustomer.email;
      req.session!.tenantId = newCustomer.id;
      req.session!.userRole = 'customer';

      res.json({
        success: true,
        user: {
          id: newCustomer.id,
          email: newCustomer.email,
          companyName: newCustomer.companyName
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find customer by email
      const customer = await storage.getCustomerByEmail(email);
      if (!customer || !customer.passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const passwordMatch = await comparePasswords(password, customer.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set session
      req.session!.userId = customer.id;
      req.session!.userEmail = customer.email;
      req.session!.tenantId = customer.id;
      req.session!.userRole = 'customer';

      res.json({
        success: true,
        user: {
          id: customer.id,
          email: customer.email,
          companyName: customer.companyName
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get('/api/auth/session', (req, res) => {
    if (req.session?.userId) {
      res.json({
        authenticated: true,
        user: {
          id: req.session.userId,
          email: req.session.userEmail
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true });
    });
  });
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

  // Enhanced Stripe Connect Routes for HVAC companies to collect payments
  app.post('/api/stripe/connect/create-account', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe not configured. Please add your STRIPE_SECRET_KEY to get started.' });
      }
      
      const customerId = req.session!.userId;
      
      // Get authenticated customer from database
      const customer = await storage.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      // Check if already has Connect account
      if (customer.stripeConnectAccountId) {
        // Return existing account link for re-onboarding
        const accountLink = await stripe.accountLinks.create({
          account: customer.stripeConnectAccountId,
          refresh_url: `${req.get('origin')}/payment-setup?refresh=true`,
          return_url: `${req.get('origin')}/payment-setup?success=true`,
          type: 'account_onboarding',
        });
        
        return res.json({ 
          account_id: customer.stripeConnectAccountId,
          onboarding_url: accountLink.url 
        });
      }

      // Create new Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: customer.email,
        business_type: 'company',
        company: {
          name: customer.companyName || customer.name,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      // Update customer record with Connect account ID
      await storage.updateCustomerStripeConnect(customerId, account.id);

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

  // Onboarding API endpoints for the Duolingo-style wizard
  app.post('/api/onboarding/password', async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password || password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      
      // Hash the password and store it in session for completion
      const hashedPassword = await hashPassword(password);
      req.session.onboardingData = { 
        ...req.session.onboardingData,
        passwordHash: hashedPassword,
        onboardingStep: 'business-info'
      };
      
      res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
      console.error('Error setting password:', error);
      res.status(500).json({ message: 'Failed to set password' });
    }
  });

  app.post('/api/onboarding/business-info', async (req, res) => {
    try {
      const { companyName, industry, phone, website, address, city, state, zipCode, description } = req.body;
      
      if (!companyName || !industry || !phone || !address || !city || !state || !zipCode) {
        return res.status(400).json({ message: 'Missing required business information' });
      }
      
      // Store business info in session
      req.session.onboardingData = {
        ...req.session.onboardingData,
        companyName,
        industry,
        phone,
        website,
        address,
        city,
        state,
        zipCode,
        description,
        onboardingStep: 'plan-selection'
      };
      
      res.status(200).json({ message: 'Business information saved' });
    } catch (error) {
      console.error('Error saving business info:', error);
      res.status(500).json({ message: 'Failed to save business information' });
    }
  });

  app.post('/api/onboarding/complete-payment', async (req, res) => {
    try {
      const { planTier, billingInterval, paymentMethodId } = req.body;
      const onboardingData = req.session.onboardingData || {};
      
      if (!planTier || !billingInterval) {
        return res.status(400).json({ message: 'Missing plan information' });
      }
      
      // Create the customer account with all onboarding data
      const customer = await storage.createCustomer({
        name: onboardingData.companyName || 'New Customer',
        email: req.session.email || 'temp@example.com', // Would come from registration
        phone: onboardingData.phone,
        companyName: onboardingData.companyName,
        companyUrl: onboardingData.website,
        passwordHash: onboardingData.passwordHash,
        onboardingCompleted: false // Will be set to true in complete step
      });
      
      // Store customer ID in session for completion
      req.session.onboardingData = {
        ...onboardingData,
        customerId: customer.id,
        planTier,
        billingInterval,
        paymentMethodId,
        onboardingStep: 'completion'
      };
      
      res.status(200).json({ 
        message: 'Payment processed successfully',
        customerId: customer.id 
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Failed to process payment' });
    }
  });

  app.post('/api/onboarding/complete', async (req, res) => {
    try {
      const onboardingData = req.session.onboardingData;
      
      if (!onboardingData || !onboardingData.customerId) {
        return res.status(400).json({ message: 'Invalid onboarding state' });
      }
      
      // Mark onboarding as complete
      await storage.updateCustomerOnboardingStatus(onboardingData.customerId, true);
      
      // Set up user session for immediate login
      req.session.userId = onboardingData.customerId;
      req.session.userEmail = req.session.email;
      req.session.userRole = 'customer';
      
      // Clear onboarding data
      delete req.session.onboardingData;
      
      res.status(200).json({ 
        message: 'Onboarding completed successfully',
        customerId: onboardingData.customerId
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      res.status(500).json({ message: 'Failed to complete onboarding' });
    }
  });

  // Register health check routes for monitoring
  app.use('/api', healthRoutes);
  
  const httpServer = createServer(app);
  return httpServer;
}
