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

  // DEBUG: Log the entire request body
  console.log('=== CHECKOUT REQUEST DEBUG ===');
  console.log('Full request body:', req.body);
  console.log('planId:', planId);
  console.log('customerEmail:', customerEmail);
  console.log('customerName:', customerName);
  console.log('phone:', phone);
  console.log('=== END DEBUG ===');

  if (!planId || !customerEmail || !customerName) {
    console.log('Validation failed - missing fields');
    return res.status(400).json({ 
      error: `Missing required fields. Received: planId=${planId}, customerEmail=${customerEmail}, customerName=${customerName}` 
    });
  }

  try {
    // Get the plan details from our database
    // In a real app, validate the plan exists in your database
    
    // Map both old numeric IDs and fake price IDs to real Stripe price IDs
    const planToStripePriceMap: { [key: string]: string } = {
      // Numeric IDs (fallback)
      '1': 'price_1RRcnlGxl1XxufT4i2vJmX0m', // Basic
      '2': 'price_1RRcoYGxl1XxufT4KFZbeJsn', // Premium  
      '3': 'price_1RRcp8Gxl1XxufT4oYuK4HG5', // Ultimate
      
      // Fake price IDs (current format)
      'price_1': 'price_1RRcnlGxl1XxufT4i2vJmX0m', // Basic
      'price_2': 'price_1RRcoYGxl1XxufT4KFZbeJsn', // Premium
      'price_3': 'price_1RRcp8Gxl1XxufT4oYuK4HG5'  // Ultimate
    };

    // Check if we need to map the planId
    let stripePriceId = planId;
    if (planToStripePriceMap[planId]) {
      stripePriceId = planToStripePriceMap[planId];
    }

    // Validate it's a proper Stripe price ID
    if (!stripePriceId || !stripePriceId.startsWith('price_')) {
      return res.status(400).json({ error: `Invalid Stripe price ID format: ${planId}` });
    }

    // All HVAC maintenance plans are recurring subscriptions
    // Always use subscription mode for all plans
    
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
      mode: 'subscription', // Always use subscription mode for recurring plans
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