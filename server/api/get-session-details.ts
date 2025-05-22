import { Request, Response, Router } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe with the API key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil', // Using the latest stable version
    }) 
  : null;

// Endpoint to get session details from Stripe
router.get('/get-session-details', async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(500).json({ 
      error: 'Stripe is not configured. Check STRIPE_SECRET_KEY environment variable.' 
    });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ 
      error: 'Missing required parameter: session_id' 
    });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ['line_items', 'line_items.data.price.product', 'customer']
      }
    );

    // Format and return the session data
    const lineItems = session.line_items?.data || [];
    const product = lineItems.length > 0 ? lineItems[0].price?.product : null;
    
    // Extract plan name from product
    let planName = 'HVAC Maintenance Plan';
    if (product && typeof product !== 'string') {
      planName = product.name || planName;
    }

    // Format the response
    const subscriptionData = {
      planName,
      amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
      currency: session.currency?.toUpperCase() || 'USD',
      interval: session.mode === 'subscription' ? 'year' : 'one-time',
      customerEmail: session.customer_details?.email || session.customer_email,
      customerName: session.customer_details?.name || session.metadata?.customer_name,
      startDate: new Date().toISOString(),
      status: session.status,
      paymentStatus: session.payment_status,
    };

    res.status(200).json(subscriptionData);
  } catch (err: any) {
    console.error('Error retrieving Stripe session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;