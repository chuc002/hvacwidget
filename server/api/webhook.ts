import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';
import { storage } from '../storage';

const router = express.Router();

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe webhook handling will not work.');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('Missing STRIPE_WEBHOOK_SECRET environment variable. Webhook signature verification will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    }) 
  : null;

// Create middleware to get raw body for Stripe webhook signature verification
const getRawBody = (req: Request, res: Response, next: NextFunction) => {
  let data = '';
  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    req.body = data;
    next();
  });
};

// Webhook endpoint to handle Stripe events
router.post('/webhook', getRawBody, async (req: Request, res: Response) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ 
      error: 'Stripe is not configured. Check environment variables.' 
    });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe using the webhook secret
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event based on its type
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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook event ${event.type}:`, err.message);
    res.status(500).json({ error: 'Error processing webhook event' });
  }
});

// Helper functions to handle different Stripe events

// Handle checkout.session.completed event
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed webhook');

  if (!session.metadata) {
    console.warn('No metadata in checkout session');
    return;
  }

  const customerEmail = session.customer_email;
  const customerName = session.metadata.customer_name;
  const phone = session.metadata.phone;
  const planId = Number(session.metadata.plan_id);
  const businessId = session.metadata.business_id;

  console.log(`Checkout completed for ${customerName} (${customerEmail}), Plan ID: ${planId}`);

  try {
    // First, check if we have this customer in our database
    let customer = await storage.getCustomerByEmail(customerEmail || '');
    
    // If customer doesn't exist, create them
    if (!customer) {
      customer = await storage.createCustomer({
        name: customerName || 'Unknown Customer',
        email: customerEmail || '',
        phone: phone || null,
      });
    }

    // Create a subscription record linked to this customer
    const stripeSubscriptionId = session.subscription as string;
    
    const subscription = await storage.createSubscription({
      customerId: customer.id,
      planId: planId,
      status: 'active',
      stripeSubscriptionId: stripeSubscriptionId || null,
    });

    console.log(`Created subscription: ${subscription.id}`);

    // If we also have Supabase configured, store there as well
    if (supabase) {
      const { error } = await supabase
        .from('subscriptions')
        .insert([
          {
            email: customerEmail,
            name: customerName,
            phone: phone,
            plan_id: planId,
            stripe_session_id: session.id,
            stripe_customer_id: session.customer,
            stripe_subscription_id: stripeSubscriptionId,
            business_id: businessId,
            status: 'active',
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Subscription saved to Supabase successfully');
      }
    }

    // Send data to webhook (Zapier integration) if configured
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        const fetch = (await import('node-fetch')).default;
        await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'subscription_created',
            customer: {
              name: customerName,
              email: customerEmail,
              phone: phone,
            },
            plan: {
              id: planId,
            },
            subscription: {
              id: subscription.id,
              stripeId: stripeSubscriptionId,
              createdAt: new Date().toISOString(),
            },
            source: 'hvac-widget',
          }),
        });
        console.log('Data sent to Zapier webhook successfully');
      } catch (error) {
        console.error('Error sending data to Zapier webhook:', error);
      }
    }
  } catch (err) {
    console.error('Error processing checkout session:', err);
    throw err;
  }
}

// Handle invoice.paid event
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Processing invoice.paid webhook');

  if (!invoice.subscription) {
    console.log('Invoice is not related to a subscription');
    return;
  }

  try {
    // Find the subscription in our database
    const subscription = await storage.getSubscriptionByStripeId(invoice.subscription as string);

    if (subscription) {
      // Update the subscription period based on the invoice
      if (invoice.period_start && invoice.period_end) {
        await storage.updateSubscriptionPeriod(
          subscription.id,
          new Date(invoice.period_start * 1000),
          new Date(invoice.period_end * 1000)
        );
        console.log(`Updated subscription period for ID: ${subscription.id}`);
      }
    } else {
      console.log(`Subscription not found for Stripe ID: ${invoice.subscription}`);
    }

    // Update Supabase if configured
    if (supabase) {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
          current_period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', invoice.subscription)
        .select();

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log(`Updated ${data?.length} subscription records in Supabase`);
      }
    }
  } catch (err) {
    console.error('Error processing invoice paid:', err);
    throw err;
  }
}

// Handle customer.subscription.updated event
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated webhook');

  try {
    // Find the subscription in our database
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
      
      console.log(`Updated subscription status to ${status} for ID: ${dbSubscription.id}`);
    } else {
      console.log(`Subscription not found for Stripe ID: ${subscription.id}`);
    }

    // Update Supabase if configured
    if (supabase) {
      const status = subscription.status === 'active' ? 'active' 
        : subscription.status === 'canceled' ? 'cancelled' 
        : 'pending';
        
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: status,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Subscription updated in Supabase successfully');
      }
    }
  } catch (err) {
    console.error('Error processing subscription updated:', err);
    throw err;
  }
}

// Handle customer.subscription.deleted event
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted webhook');

  try {
    // Find the subscription in our database
    const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);

    if (dbSubscription) {
      // Update the subscription status to cancelled
      await storage.updateSubscriptionStatus(dbSubscription.id, 'cancelled');
      console.log(`Marked subscription as cancelled for ID: ${dbSubscription.id}`);
    } else {
      console.log(`Subscription not found for Stripe ID: ${subscription.id}`);
    }

    // Update Supabase if configured
    if (supabase) {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Subscription marked as cancelled in Supabase successfully');
      }
    }
  } catch (err) {
    console.error('Error processing subscription deleted:', err);
    throw err;
  }
}

export default router;