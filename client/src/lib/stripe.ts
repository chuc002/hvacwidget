import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the public key from environment variables
// It's safe to expose this key in the frontend as it's only used for creating checkout sessions
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

// Function to redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error("Stripe failed to initialize");
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw new Error(error.message);
  }
};

export default stripePromise;
