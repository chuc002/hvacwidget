import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';
import { SaaSPlans, getPlanById, getStripePriceId } from '../../client/src/lib/saas-plans';
import { z } from 'zod';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const router = express.Router();

// Schema for validating usage data
const UsageDataSchema = z.object({
  customerId: z.string().min(1),
  customerCount: z.number().nonnegative().default(0),
  apiCalls: z.number().nonnegative().default(0),
  storageUsed: z.number().nonnegative().default(0),
  locations: z.number().nonnegative().default(0)
});

// Schema for validating plan change
const ChangePlanSchema = z.object({
  customerId: z.string().min(1),
  newPlanId: z.string().min(1),
  billingCycle: z.enum(['monthly', 'annual']).default('monthly')
});

/**
 * Middleware to protect routes
 * Ensures the request is authenticated and customer exists
 */
const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.customerId) {
    return res.status(401).json({
      error: 'Unauthorized. You must be logged in to access this resource.'
    });
  }
  
  try {
    const customer = await storage.getCustomerById(Number(req.session.customerId));
    if (!customer) {
      return res.status(404).json({ 
        error: 'Customer not found'
      });
    }
    
    // Attaching customer to the request for use in route handlers
    req.customer = customer;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'An error occurred while authenticating your request.'
    });
  }
};

/**
 * Create checkout session for subscribing to a B2B SaaS plan
 */
router.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const { planId, billingCycle = 'monthly', customerId } = req.body;
    
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }
    
    // Validate plan ID
    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // Get price ID based on billing cycle
    const stripePriceId = getStripePriceId(planId, billingCycle as 'monthly' | 'annual');
    if (!stripePriceId) {
      return res.status(400).json({ error: 'Invalid price configuration' });
    }
    
    let customer = null;
    
    // If customerId is provided, it's an existing customer
    if (customerId) {
      customer = await storage.getCustomerById(Number(customerId));
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/billing/cancel`,
      metadata: {
        planId,
        billingCycle,
        customerId: customer?.id.toString() || 'new'
      },
      subscription_data: {
        metadata: {
          planId,
          billingCycle
        }
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating subscription session:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription session'
    });
  }
});

/**
 * Get current subscription details
 */
router.get('/subscription', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const customer = req.customer;
    
    if (!customer.stripeCustomerId || !customer.stripeSubscriptionId) {
      return res.json({
        status: 'inactive',
        plan: null,
        currentPeriodEnd: null,
        cancel_at_period_end: false
      });
    }
    
    // Retrieve subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(customer.stripeSubscriptionId);
    
    // Get plan details
    const planId = subscription.metadata.planId || 'starter';
    const plan = getPlanById(planId);
    
    res.json({
      status: subscription.status,
      plan: planId,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      billingCycle: subscription.metadata.billingCycle || 'monthly',
      planDetails: plan
    });
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve subscription details'
    });
  }
});

/**
 * Update usage metrics for a customer
 */
router.post('/update-usage', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const validationResult = UsageDataSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid usage data', 
        details: validationResult.error.flatten() 
      });
    }
    
    const usageData = validationResult.data;
    const customer = req.customer;
    
    // Store usage data in database
    const updated = await storage.updateCustomerUsage(customer.id, {
      customerCount: usageData.customerCount,
      apiCalls: usageData.apiCalls,
      storageUsed: usageData.storageUsed,
      locations: usageData.locations,
      lastUpdated: new Date()
    });
    
    // Check if customer is approaching plan limits
    const planId = customer.planId || 'starter';
    const customerLimit = SaaSPlans.find(p => p.id === planId)?.limits.monthlyCustomers || 100;
    
    // Calculate percentage of limit used
    let usagePercentage = 0;
    if (customerLimit > 0) { // Not unlimited
      usagePercentage = (usageData.customerCount / customerLimit) * 100;
    }
    
    res.json({
      success: true,
      updated,
      usagePercentage,
      approaching90Percent: usagePercentage >= 90,
      exceededLimit: customerLimit > 0 && usageData.customerCount > customerLimit
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    res.status(500).json({ 
      error: 'Failed to update usage data'
    });
  }
});

/**
 * Change subscription plan
 */
router.post('/change-plan', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const validationResult = ChangePlanSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid plan change data', 
        details: validationResult.error.flatten() 
      });
    }
    
    const { newPlanId, billingCycle } = validationResult.data;
    const customer = req.customer;
    
    // Validate that the new plan exists
    const newPlan = getPlanById(newPlanId);
    if (!newPlan) {
      return res.status(404).json({ error: 'New plan not found' });
    }
    
    if (!customer.stripeCustomerId || !customer.stripeSubscriptionId) {
      return res.status(400).json({ 
        error: 'No active subscription found. Please subscribe first.'
      });
    }
    
    // Get price ID based on billing cycle
    const newPriceId = getStripePriceId(newPlanId, billingCycle as 'monthly' | 'annual');
    if (!newPriceId) {
      return res.status(400).json({ error: 'Invalid price configuration for the new plan' });
    }
    
    // Update the subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      customer.stripeSubscriptionId,
      {
        proration_behavior: 'create_prorations',
        metadata: {
          planId: newPlanId,
          billingCycle
        },
        items: [
          {
            id: (await stripe.subscriptions.retrieve(customer.stripeSubscriptionId)).items.data[0].id,
            price: newPriceId,
          },
        ],
      }
    );
    
    // Update the customer's plan in the database
    await storage.updateCustomerPlan(customer.id, newPlanId);
    
    res.json({
      success: true,
      planId: newPlanId,
      billingCycle,
      newSubscription: {
        id: updatedSubscription.id,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        status: updatedSubscription.status
      }
    });
  } catch (error) {
    console.error('Error changing plan:', error);
    res.status(500).json({ 
      error: 'Failed to change subscription plan'
    });
  }
});

/**
 * Cancel subscription
 */
router.post('/cancel-subscription', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const customer = req.customer;
    const { cancelImmediately = false } = req.body;
    
    if (!customer.stripeCustomerId || !customer.stripeSubscriptionId) {
      return res.status(400).json({ 
        error: 'No active subscription found'
      });
    }
    
    if (cancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(customer.stripeSubscriptionId);
      
      // Update customer status in database
      await storage.updateCustomerStatus(customer.id, 'cancelled');
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(customer.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update customer status in database
      await storage.updateCustomerStatus(customer.id, 'cancelling');
    }
    
    res.json({
      success: true,
      message: cancelImmediately 
        ? 'Subscription cancelled immediately' 
        : 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription'
    });
  }
});

/**
 * Reactivate cancelled subscription (if cancelled at period end)
 */
router.post('/reactivate-subscription', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const customer = req.customer;
    
    if (!customer.stripeCustomerId || !customer.stripeSubscriptionId) {
      return res.status(400).json({ 
        error: 'No subscription found to reactivate'
      });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(customer.stripeSubscriptionId);
    
    if (!subscription.cancel_at_period_end) {
      return res.status(400).json({ 
        error: 'Subscription is not set to cancel at period end'
      });
    }
    
    // Reactivate subscription
    await stripe.subscriptions.update(customer.stripeSubscriptionId, {
      cancel_at_period_end: false
    });
    
    // Update customer status in database
    await storage.updateCustomerStatus(customer.id, 'active');
    
    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ 
      error: 'Failed to reactivate subscription'
    });
  }
});

/**
 * Get billing history
 */
router.get('/billing-history', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const customer = req.customer;
    
    if (!customer.stripeCustomerId) {
      return res.json({ invoices: [] });
    }
    
    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customer.stripeCustomerId,
      limit: 10,
    });
    
    // Format invoices for client
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      total: invoice.total / 100, // Convert from cents to dollars
      currency: invoice.currency,
      status: invoice.status,
      created: new Date(invoice.created * 1000),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      pdfUrl: invoice.invoice_pdf
    }));
    
    res.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error('Error retrieving billing history:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve billing history'
    });
  }
});

/**
 * Create customer portal session (for updating payment methods, viewing invoices, etc.)
 */
router.post('/create-portal-session', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const customer = req.customer;
    
    if (!customer.stripeCustomerId) {
      return res.status(400).json({ 
        error: 'No Stripe customer found'
      });
    }
    
    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${req.protocol}://${req.get('host')}/customer-dashboard?tab=billing`,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ 
      error: 'Failed to create customer portal session'
    });
  }
});

/**
 * Webhook handler for Stripe events
 */
router.post('/webhook', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret is not configured' });
  }
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    res.status(500).json({ error: 'Error handling webhook event' });
  }
});

/**
 * Handle checkout.session.completed webhook event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Only handle subscription checkouts
  if (session.mode !== 'subscription') return;
  
  const customerId = session.metadata?.customerId;
  const planId = session.metadata?.planId || 'starter';
  
  // If it's a new customer
  if (customerId === 'new') {
    // Retrieve customer details from Stripe
    if (!session.customer) return;
    
    const stripeCustomer = await stripe.customers.retrieve(session.customer as string);
    
    if (stripeCustomer.deleted) return;
    
    // Create a new customer in our database
    const newCustomer = await storage.createCustomer({
      email: stripeCustomer.email || 'unknown@example.com',
      name: stripeCustomer.name || 'Unknown',
      planId,
      stripeCustomerId: stripeCustomer.id,
      stripeSubscriptionId: session.subscription as string,
      status: 'active',
      createdAt: new Date()
    });
    
    console.log('New customer created:', newCustomer);
  } else {
    // Existing customer, update their subscription
    const existingCustomer = await storage.getCustomerById(Number(customerId));
    
    if (!existingCustomer) {
      console.error('Customer not found:', customerId);
      return;
    }
    
    // Update customer in our database
    await storage.updateCustomer(existingCustomer.id, {
      planId,
      stripeSubscriptionId: session.subscription as string,
      status: 'active',
    });
    
    console.log('Customer subscription updated:', existingCustomer.id);
  }
}

/**
 * Handle invoice.paid webhook event
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.customer) return;
  
  // Find customer by Stripe ID
  const customer = await storage.getCustomerByStripeId(invoice.customer as string);
  
  if (!customer) {
    console.error('Customer not found for invoice:', invoice.id);
    return;
  }
  
  // Record the payment in our database
  await storage.recordPayment({
    customerId: customer.id,
    invoiceId: invoice.id,
    amount: invoice.total / 100, // Convert from cents to dollars
    currency: invoice.currency,
    date: new Date(invoice.created * 1000),
    description: invoice.description || 'Subscription payment'
  });
  
  console.log('Payment recorded for customer:', customer.id);
}

/**
 * Handle customer.subscription.updated webhook event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  if (!subscription.customer) return;
  
  // Find customer by Stripe ID
  const customer = await storage.getCustomerByStripeId(subscription.customer as string);
  
  if (!customer) {
    console.error('Customer not found for subscription:', subscription.id);
    return;
  }
  
  // Extract plan ID from metadata or default to starter
  const planId = subscription.metadata?.planId || 'starter';
  
  // Update customer in our database
  await storage.updateCustomer(customer.id, {
    planId,
    status: subscription.status === 'active' ? 'active' : 
            subscription.status === 'trialing' ? 'trial' : 
            subscription.cancel_at_period_end ? 'cancelling' : subscription.status
  });
  
  console.log('Customer subscription updated:', customer.id);
}

/**
 * Handle customer.subscription.deleted webhook event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!subscription.customer) return;
  
  // Find customer by Stripe ID
  const customer = await storage.getCustomerByStripeId(subscription.customer as string);
  
  if (!customer) {
    console.error('Customer not found for deleted subscription:', subscription.id);
    return;
  }
  
  // Update customer in our database
  await storage.updateCustomer(customer.id, {
    status: 'cancelled',
    planId: null,
    stripeSubscriptionId: null
  });
  
  console.log('Customer subscription cancelled:', customer.id);
}

export default router;