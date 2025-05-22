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

  const { 
    planId, 
    customerEmail, 
    customerName, 
    phone,
    address,
    city,
    state,
    zipCode,
    propertyType,
    preferredContactTime
  } = req.body;

  // DEBUG: Log the entire request body
  console.log('=== CHECKOUT REQUEST DEBUG ===');
  console.log('Full request body:', req.body);
  console.log('planId:', planId);
  console.log('customerEmail:', customerEmail);
  console.log('customerName:', customerName);
  console.log('phone:', phone);
  console.log('address:', address);
  console.log('city:', city);
  console.log('zipCode:', zipCode);
  console.log('propertyType:', propertyType);
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
    
    // Temporary test mode mapping - skip actual price validation
    const planToStripePriceMap: { [key: string]: string } = {
      // Numeric IDs (fallback)
      '1': 'price_test_basic', // Basic
      '2': 'price_test_premium', // Premium  
      '3': 'price_test_ultimate', // Ultimate
      
      // Fake price IDs (current format) - map to test format
      'price_1': 'price_test_basic', // Basic
      'price_2': 'price_test_premium', // Premium
      'price_3': 'price_test_ultimate'  // Ultimate
    };

    // For test mode, create a simple checkout session without real price validation
    const stripePriceId = planToStripePriceMap[planId] || 'price_test_demo';

    // Create the checkout session
    let session;

    // Skip price validation in test mode - just use a dummy price for demo
    if (process.env.NODE_ENV === 'development') {
      // Use any valid test price ID or create session without line_items for demo
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: customerEmail,
        mode: 'payment', // Use payment mode for test demos
        success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        metadata: {
          customer_name: customerName,
          phone: phone || '',
          address: address || '',
          city: city || '',
          state: state || '',
          zip_code: zipCode || '',
          property_type: propertyType || '',
          preferred_contact_time: preferredContactTime || '',
          plan_id: planId,
          business_id: 'demo-hvac-company', // Will be dynamic in a real app
        },
        // Create a custom amount for demo
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `HVAC Maintenance Plan - ${planId}`,
              },
              unit_amount: planId === 'price_3' ? 34999 : (planId === 'price_2' ? 24999 : 14999), // Amount in cents
            },
            quantity: 1,
          },
        ],
      });
    } else {
      // Normal production logic here
      session = await stripe.checkout.sessions.create({
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
          address: address || '',
          city: city || '',
          state: state || '',
          zip_code: zipCode || '',
          property_type: propertyType || '',
          preferred_contact_time: preferredContactTime || '',
          plan_id: planId,
          business_id: 'demo-hvac-company', // Will be dynamic in a real app
        },
      });
    }

    // Return the session URL to redirect the customer
    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;