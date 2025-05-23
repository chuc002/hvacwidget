/**
 * ServicePlan Pro - Stripe Routes
 * 
 * This file contains all Stripe-related API endpoints in a single location.
 * It improves code organization and makes maintenance easier.
 */

import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';
import { requireAuth, requireActiveSubscription } from '../api/auth';
import { getStripePriceId, isValidStripePriceId, getPlanKeyFromPriceId } from '../../shared/stripe';
import { PLANS } from '../../shared/pricing';

// Validate Stripe API key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Update this to the latest stable version
});

// Create router
const router = Router();

/**
 * Create a checkout session for subscription purchase
 * POST /api/stripe/checkout
 */
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { planName, customerInfo, billingInterval = 'monthly' } = req.body;
    
    if (!planName || !customerInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate the plan
    const planKey = planName.toUpperCase();
    if (!PLANS[planKey as keyof typeof PLANS]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
    
    // Get the correct price ID based on plan and billing interval
    const isAnnual = billingInterval === 'annual';
    let stripePriceId;
    
    try {
      stripePriceId = getStripePriceId(planName, isAnnual);
    } catch (error) {
      console.error(`Invalid price configuration for plan ${planName} with ${billingInterval} billing:`, error);
      return res.status(400).json({ error: 'Invalid pricing configuration' });
    }
    
    // Create or get existing customer
    let customer;
    try {
      const existingCustomer = await storage.getCustomerByEmail(customerInfo.email);
      
      if (existingCustomer) {
        // Update existing customer
        customer = existingCustomer;
      } else {
        // Create new customer in our database
        customer = await storage.createCustomer({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || null,
          password: customerInfo.password || null,
        });
      }
      
      // Create or retrieve Stripe customer
      let stripeCustomer;
      
      if (customer.stripeCustomerId) {
        stripeCustomer = await stripe.customers.retrieve(customer.stripeCustomerId);
      } else {
        stripeCustomer = await stripe.customers.create({
          email: customer.email,
          name: customer.name,
          phone: customer.phone || undefined,
          metadata: {
            customerId: customer.id.toString(),
          },
        });
        
        // Update our customer record with Stripe ID
        await storage.updateCustomerStripeId(customer.id, stripeCustomer.id);
      }
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer: stripeCustomer.id,
        client_reference_id: customer.id.toString(),
        success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout/cancel`,
        subscription_data: {
          metadata: {
            customerId: customer.id.toString(),
            planName: planName,
          },
        },
        metadata: {
          customerId: customer.id.toString(),
          planName: planName,
        },
      });
      
      // Return the session ID to the client
      res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  } catch (error: any) {
    console.error('Unexpected error in checkout route:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * Get subscription details
 * GET /api/stripe/subscription/:subscriptionId
 */
router.get('/subscription/:subscriptionId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    
    // Verify subscription ID format
    if (!subscriptionId || !subscriptionId.startsWith('sub_')) {
      return res.status(400).json({ error: 'Invalid subscription ID format' });
    }
    
    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Get our local subscription record
    const localSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
    
    if (!localSubscription) {
      return res.status(404).json({ error: 'Subscription not found in our records' });
    }
    
    // Ensure the customer is authorized to access this subscription
    const customerId = (req as any).session?.customerId;
    if (localSubscription.customerId !== customerId) {
      return res.status(403).json({ error: 'Not authorized to view this subscription' });
    }
    
    // Return a simplified subscription response
    const priceId = subscription.items.data[0]?.price.id;
    const planKey = getPlanKeyFromPriceId(priceId);
    const plan = planKey ? PLANS[planKey as keyof typeof PLANS] : null;
    
    res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000), 
      plan: plan ? {
        name: plan.name,
        description: plan.description,
        price: plan.monthlyPrice,
      } : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error: any) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel a subscription
 * POST /api/stripe/subscription/:subscriptionId/cancel
 */
router.post('/subscription/:subscriptionId/cancel', requireAuth, async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const { cancelImmediately = false } = req.body;
    
    // Verify subscription ID format
    if (!subscriptionId || !subscriptionId.startsWith('sub_')) {
      return res.status(400).json({ error: 'Invalid subscription ID format' });
    }
    
    // Get our local subscription record
    const localSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
    
    if (!localSubscription) {
      return res.status(404).json({ error: 'Subscription not found in our records' });
    }
    
    // Ensure the customer is authorized to access this subscription
    const customerId = (req as any).session?.customerId;
    if (localSubscription.customerId !== customerId) {
      return res.status(403).json({ error: 'Not authorized to cancel this subscription' });
    }
    
    if (cancelImmediately) {
      // Cancel immediately
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      await storage.updateSubscriptionStatus(localSubscription.id, 'canceled');
      res.status(200).json({ status: canceledSubscription.status });
    } else {
      // Cancel at period end
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      await storage.updateSubscriptionStatus(localSubscription.id, 'canceling');
      res.status(200).json({ status: 'canceling', cancelAtPeriodEnd: true });
    }
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a customer portal session
 * POST /api/stripe/create-portal-session
 */
router.post('/create-portal-session', requireAuth, async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).session?.customerId;
    const customer = await storage.getCustomerById(customerId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    if (!customer.stripeCustomerId) {
      return res.status(400).json({ error: 'Customer has no Stripe account' });
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${req.headers.origin}/account`,
    });
    
    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Webhook handler for Stripe events
 * POST /api/stripe/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return res.status(500).send('Webhook Error: Missing webhook secret');
  }
  
  let event: Stripe.Event;
  
  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
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
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Handle completed checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  if (session.mode !== 'subscription') {
    return; // Only process subscription checkouts
  }
  
  // Extract customer ID from metadata or client_reference_id
  const customerId = session.metadata?.customerId || session.client_reference_id;
  if (!customerId) {
    console.error('No customer ID found in session metadata or client reference ID');
    return;
  }
  
  // Extract subscription ID
  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    console.error('No subscription ID found in session');
    return;
  }
  
  // Get customer record
  const customer = await storage.getCustomerById(parseInt(customerId));
  if (!customer) {
    console.error(`Customer not found with ID: ${customerId}`);
    return;
  }
  
  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Get price ID and determine plan
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId || !isValidStripePriceId(priceId)) {
    console.error(`Invalid price ID in subscription: ${priceId}`);
    return;
  }
  
  const planKey = getPlanKeyFromPriceId(priceId);
  if (!planKey) {
    console.error(`Could not determine plan for price ID: ${priceId}`);
    return;
  }
  
  const plan = PLANS[planKey as keyof typeof PLANS];
  
  // Find plan ID in our system
  const planRecord = await storage.getPlanByName(plan.name);
  if (!planRecord) {
    console.error(`Plan not found with name: ${plan.name}`);
    return;
  }
  
  // Check if subscription already exists in our system
  const existingSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
  if (existingSubscription) {
    // Just update status if it already exists
    await storage.updateSubscriptionStatus(existingSubscription.id, subscription.status);
    return;
  }
  
  // Create subscription record in our database
  await storage.createSubscription({
    customerId: parseInt(customerId),
    planId: planRecord.id,
    stripeSubscriptionId: subscriptionId,
    status: subscription.status,
  });
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  // This is mostly handled by checkout.session.completed
  // But we can add additional logic here if needed
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const existingSubscription = await storage.getSubscriptionByStripeId(subscription.id);
  if (!existingSubscription) {
    console.error(`Subscription not found in our database: ${subscription.id}`);
    return;
  }
  
  // Update subscription status
  await storage.updateSubscriptionStatus(existingSubscription.id, subscription.status);
  
  // Update billing period
  await storage.updateSubscriptionPeriod(
    existingSubscription.id,
    new Date(subscription.current_period_start * 1000),
    new Date(subscription.current_period_end * 1000)
  );
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const existingSubscription = await storage.getSubscriptionByStripeId(subscription.id);
  if (!existingSubscription) {
    console.error(`Subscription not found in our database: ${subscription.id}`);
    return;
  }
  
  // Update subscription status to canceled
  await storage.updateSubscriptionStatus(existingSubscription.id, 'canceled');
}

/**
 * Handle invoice payment succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  // Only process subscription invoices
  if (!invoice.subscription) {
    return;
  }
  
  const subscriptionId = invoice.subscription as string;
  const existingSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
  if (!existingSubscription) {
    console.error(`Subscription not found in our database: ${subscriptionId}`);
    return;
  }
  
  // Update subscription status to active
  await storage.updateSubscriptionStatus(existingSubscription.id, 'active');
}

/**
 * Handle invoice payment failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // Only process subscription invoices
  if (!invoice.subscription) {
    return;
  }
  
  const subscriptionId = invoice.subscription as string;
  const existingSubscription = await storage.getSubscriptionByStripeId(subscriptionId);
  if (!existingSubscription) {
    console.error(`Subscription not found in our database: ${subscriptionId}`);
    return;
  }
  
  // Update subscription status to past_due
  await storage.updateSubscriptionStatus(existingSubscription.id, 'past_due');
}

export default router;