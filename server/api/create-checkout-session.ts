import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../lib/supabase';

const router = express.Router();

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe checkout will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15', // Using a stable version
    }) 
  : null;

// Endpoint to create a checkout session
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(500).json({ 
      error: 'Stripe is not configured. Check STRIPE_SECRET_KEY environment variable.' 
    });
  }

  const { planId, customerEmail, customerName, phone } = req.body;

  if (!planId || !customerEmail || !customerName) {
    return res.status(400).json({ 
      error: 'Missing required fields: planId, customerEmail, and customerName are required' 
    });
  }

  try {
    // Get the plan details from our database
    // In a real app, validate the plan exists in your database
    
    // For now, we'll use a simple mapping of plan IDs to Stripe price IDs
    // In a production app, you'd fetch this from your database
    const planToStripePriceMap: { [key: string]: string } = {
      '1': process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
      '2': process.env.STRIPE_STANDARD_PRICE_ID || 'price_standard',
      '3': process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium'
    };

    const stripePriceId = planToStripePriceMap[planId];
    
    if (!stripePriceId) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Determine if this is a subscription or a one-time payment
    // This should be based on the actual plan data from your database
    const isSubscription = planId === '2' || planId === '3'; // Standard and Premium are subscriptions
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      metadata: {
        customer_name: customerName,
        phone: phone || '',
        plan_id: planId,
        business_id: 'demo-hvac-company', // Will be dynamic in a real app
      },
    });

    // Return the session URL to redirect the customer
    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;