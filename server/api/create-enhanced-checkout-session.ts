import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

const router = Router();

// Ensure Stripe API key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

router.post('/create-enhanced-checkout-session', async (req: Request, res: Response) => {
  try {
    const {
      subscription,
      products,
      services,
      invoiceNumber,
      customerInfo,
      customerId,
    } = req.body;

    // Create or retrieve Stripe customer
    let stripeCustomer;
    
    // Check if we have a customer record in our database
    if (customerId) {
      const customer = await storage.getCustomerById(parseInt(customerId));
      
      // If customer exists and has Stripe ID, use it
      if (customer && customer.stripeCustomerId) {
        try {
          stripeCustomer = await stripe.customers.retrieve(customer.stripeCustomerId);
        } catch (e) {
          console.error('Error retrieving Stripe customer:', e);
          // If error occurs (e.g., customer deleted in Stripe), create new customer
          stripeCustomer = await stripe.customers.create({
            email: customerInfo.email,
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address ? {
              line1: customerInfo.address,
              city: '',
              state: '',
              postal_code: '',
              country: 'US',
            } : undefined,
            metadata: {
              customerId: customerId,
            },
          });
          
          // Update customer record with new Stripe ID
          await storage.updateCustomerStripeId(parseInt(customerId), stripeCustomer.id);
        }
      } else {
        // Create new Stripe customer
        stripeCustomer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address ? {
            line1: customerInfo.address,
            city: '',
            state: '',
            postal_code: '',
            country: 'US',
          } : undefined,
          metadata: {
            customerId: customerId,
          },
        });
        
        // If customer exists but doesn't have Stripe ID, update it
        if (customer) {
          await storage.updateCustomerStripeId(parseInt(customerId), stripeCustomer.id);
        }
      }
    } else {
      // No customer ID provided, create a new Stripe customer
      stripeCustomer = await stripe.customers.create({
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address ? {
          line1: customerInfo.address,
          city: '',
          state: '',
          postal_code: '',
          country: 'US',
        } : undefined,
      });
    }

    // Set up line items for Stripe checkout
    const lineItems = [];

    // Add subscription if selected
    if (subscription) {
      lineItems.push({
        price: subscription.stripePriceId,
        quantity: 1,
      });
    }

    // Add products to line items
    if (products && products.length > 0) {
      products.forEach(product => {
        lineItems.push({
          price: product.stripePriceId,
          quantity: product.quantity,
        });
      });
    }

    // Add services to line items
    if (services && services.length > 0) {
      services.forEach(service => {
        lineItems.push({
          price: service.stripePriceId,
          quantity: service.quantity,
        });
      });
    }

    // For invoice payment, create a custom line item
    if (invoiceNumber) {
      // Create a custom price for the invoice
      const price = await stripe.prices.create({
        unit_amount: Math.round(req.body.totalAmount * 100), // Convert to cents
        currency: 'usd',
        product_data: {
          name: `Invoice Payment #${invoiceNumber}`,
        },
      });

      lineItems.push({
        price: price.id,
        quantity: 1,
      });
    }

    // Handle empty cart
    if (lineItems.length === 0) {
      return res.status(400).json({ 
        error: 'Your cart is empty. Please select at least one item.' 
      });
    }

    // Create the checkout session
    const mode = subscription ? 'subscription' : 'payment';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      customer: stripeCustomer.id,
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment-cancelled`,
      metadata: {
        customerId: customerId?.toString() || '',
        invoiceNumber: invoiceNumber || '',
      },
    });

    // Return the session URL for redirect
    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message
    });
  }
});

export default router;