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
    preferredContactTime,
    billingCycle = 'monthly' // Default to monthly if not specified
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
    
    // Complete price ID mapping for all subscription options
    const planToStripePriceMap: { [key: string]: string } = {
      // Annual plans
      '1': 'price_1RRcnlGxl1XxufT4i2vJmX0m', // Basic annual
      '2': 'price_1RRcoYGxl1XxufT4KFZbeJsn', // Premium annual  
      '3': 'price_1RRcp8Gxl1XxufT4oYuK4HG5', // Ultimate annual
      'price_1': 'price_1RRcnlGxl1XxufT4i2vJmX0m', // Basic annual
      'price_2': 'price_1RRcoYGxl1XxufT4KFZbeJsn', // Premium annual
      'price_3': 'price_1RRcp8Gxl1XxufT4oYuK4HG5', // Ultimate annual
      
      // Monthly plans
      '4': 'price_1RRfoCGdBJ6HrZFiH1nNPJ2n', // Basic monthly ($17.99/month)
      '5': 'price_1RRfoZGdBJ6HrZFi1tlrrdUS', // Premium monthly ($24.99/month)
      '6': 'price_1RRfowGdBJ6HrZFiOeOXyO5P', // Ultimate monthly ($34.99/month)
      'price_4': 'price_1RRfoCGdBJ6HrZFiH1nNPJ2n', // Basic monthly
      'price_5': 'price_1RRfoZGdBJ6HrZFi1tlrrdUS', // Premium monthly
      'price_6': 'price_1RRfowGdBJ6HrZFiOeOXyO5P', // Ultimate monthly
      
      // Direct price ID mapping
      'price_monthly_basic': 'price_1RRfoCGdBJ6HrZFiH1nNPJ2n',     // Basic monthly ($17.99/month)
      'price_monthly_premium': 'price_1RRfoZGdBJ6HrZFi1tlrrdUS',   // Premium monthly ($24.99/month) 
      'price_monthly_ultimate': 'price_1RRfowGdBJ6HrZFiOeOXyO5P',  // Ultimate monthly ($34.99/month)
      
      // Test mode fallbacks
      'price_test_basic': 'price_test_basic',
      'price_test_premium': 'price_test_premium',
      'price_test_ultimate': 'price_test_ultimate'
    };

    // For test mode, create a simple checkout session without real price validation
    const stripePriceId = planToStripePriceMap[planId] || 'price_test_demo';

    // Create the checkout session
    let session;

    // Skip price validation in test mode - just use a dummy price for demo
    if (process.env.NODE_ENV === 'development') {
      // Determine billing type and interval
      const isMonthlyPlan = billingCycle === 'monthly' || planId.includes('monthly');
      
      // Set appropriate mode and pricing based on billing cycle
      const mode = 'subscription'; // Always use subscription mode for proper recurring billing
      
      // Get the price in cents based on the plan and billing cycle
      let unit_amount;
      let interval = isMonthlyPlan ? 'month' : 'year';
      
      if (planId.includes('premium') || planId === '2' || planId === 'price_2' || planId === 'price_5') {
        unit_amount = isMonthlyPlan ? 2499 : 24999; // $24.99/month or $249.99/year
      } else if (planId.includes('ultimate') || planId === '3' || planId === 'price_3' || planId === 'price_6') {
        unit_amount = isMonthlyPlan ? 3499 : 34999; // $34.99/month or $349.99/year
      } else {
        // Default to Basic plan pricing
        unit_amount = isMonthlyPlan ? 1799 : 14999; // $17.99/month or $149.99/year
      }
      
      // Use recurring pricing with proper interval
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: customerEmail,
        mode: mode,
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
          billing_cycle: billingCycle,
          business_id: 'demo-hvac-company', // Will be dynamic in a real app
        },
        // Create appropriate line items with subscription interval
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `HVAC Maintenance Plan - ${planId}`,
                description: `${isMonthlyPlan ? 'Monthly' : 'Annual'} service plan`
              },
              unit_amount: unit_amount,
              recurring: { 
                interval: interval
              }
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