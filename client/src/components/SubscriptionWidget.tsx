import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SubscriptionPlan from "@/components/SubscriptionPlan";
import BenefitsList from "@/components/BenefitsList";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { Plan } from "@/lib/types";
import { PlanDetails } from "@/lib/constants";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

interface SubscriptionWidgetProps {
  companyName?: string;
  customerId?: number;
  preselectedPlanId?: number;
}

export default function SubscriptionWidget({ 
  companyName = "Comfort Air Solutions", 
  customerId,
  preselectedPlanId
}: SubscriptionWidgetProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "single-family",
    preferredContactTime: "morning"
  });
  const [loading, setLoading] = useState(false);

  // Fetch plans from the API
  const { data: plans, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['/api/plans'],
    retry: 3,
  });

  // Handle errors in plans fetching - moved to useEffect to prevent render loop
  useEffect(() => {
    if (plansError) {
      toast({
        title: "Error loading plans",
        description: "Could not load the subscription plans. Please try again later.",
        variant: "destructive",
      });
    }
  }, [plansError, toast]);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    
    // If we already have customer info (e.g., from a subscription link), open checkout directly
    if (customerId) {
      handleCheckout(plan);
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (planToCheckout = selectedPlan) => {
    if (!planToCheckout) return;
    
    // DEBUG: Log the plan object
    console.log('=== PLAN DEBUG ===');
    console.log('Full plan object:', planToCheckout);
    console.log('planToCheckout.stripePriceId:', planToCheckout.stripePriceId);
    console.log('planToCheckout.id:', planToCheckout.id);
    console.log('Available plan properties:', Object.keys(planToCheckout));
    console.log('=== END PLAN DEBUG ===');
    
    setLoading(true);
    console.log('Starting checkout process...', planToCheckout);
    
    try {
      // Create a checkout session on the server using our new endpoint
      console.log('Sending checkout request with data:', {
        planId: planToCheckout.stripePriceId || planToCheckout.id?.toString(), // Fallback to ID
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        propertyType: customerInfo.propertyType,
        preferredContactTime: customerInfo.preferredContactTime
      });
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planToCheckout.stripePriceId || `price_${planToCheckout.id}`,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          phone: customerInfo.phone
        }),
      });
      
      console.log('API Response status:', response.status);
      
      // Check if the response is valid before parsing JSON
      if (!response.ok) {
        console.error('API response not OK:', response.status);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        
        // Try direct location assignment first
        try {
          // Force redirect with location.assign instead of location.href
          window.location.assign(data.url);
          
          // Fallback in case the above doesn't trigger a redirect
          setTimeout(() => {
            console.log('Fallback redirect attempt');
            // Open in the same tab with replace to avoid browser history issues
            window.location.replace(data.url);
            
            // Last resort - open in a new tab if nothing else works
            setTimeout(() => {
              console.log('Final redirect attempt - opening in new tab');
              window.open(data.url, '_blank');
            }, 500);
          }, 300);
        } catch (redirectError) {
          console.error('Redirect error:', redirectError);
          // Show a manual redirect button
          toast({
            title: "Checkout Ready",
            description: <div>
              <p>Click the button below to continue to payment:</p>
              <button 
                className="bg-primary text-white px-4 py-2 rounded mt-2"
                onClick={() => window.open(data.url, '_blank')}
              >
                Continue to Stripe
              </button>
            </div>,
            duration: 10000,
          });
        }
      } else {
        console.error('No checkout URL returned in response:', data);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        title: "Checkout Failed",
        description: "There was a problem setting up the checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCheckoutOpen(false);
    }
  };

  const submitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckout();
  };

  return (
    <div id="hvac-subscription-widget" className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:p-8">
      {/* Widget Header with Company Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">{companyName}</span>
        </div>
        <div className="text-sm text-gray-500">Trusted HVAC Service Since 1995</div>
      </div>

      {/* Plan Selection Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plansLoading ? (
          // Loading skeleton for plans
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="relative h-96 border border-gray-200 rounded-lg">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2 mb-6 flex-grow">
                  {Array(3).fill(0).map((_, j) => (
                    <div key={j} className="flex items-start">
                      <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 mt-0.5"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : plans ? (
          // Render actual plans once loaded
          plans.map((plan: Plan) => (
            <SubscriptionPlan
              key={plan.id}
              plan={plan}
              onSelect={() => handlePlanSelect(plan)}
              isHighlighted={plan.isPopular}
              isSelected={selectedPlan?.id === plan.id}
              preselected={plan.id === preselectedPlanId}
            />
          ))
        ) : (
          // Fallback to hardcoded plans if API fails
          PlanDetails.map((plan, index) => (
            <SubscriptionPlan
              key={index}
              plan={{
                id: index + 1,
                name: plan.name,
                description: plan.description,
                price: plan.price.toString(),
                interval: plan.interval,
                features: plan.features,
                isPopular: plan.isPopular,
                order: index + 1,
                stripePriceId: plan.stripePriceId
              }}
              onSelect={() => handlePlanSelect({
                id: index + 1,
                name: plan.name,
                description: plan.description,
                price: plan.price.toString(),
                interval: plan.interval,
                features: plan.features,
                isPopular: plan.isPopular,
                order: index + 1,
                stripePriceId: plan.stripePriceId
              })}
              isHighlighted={plan.isPopular}
              isSelected={selectedPlan?.id === index + 1}
              preselected={index + 1 === preselectedPlanId}
            />
          ))
        )}
      </div>

      {/* Benefits, Testimonials, and FAQs sections */}
      <BenefitsList />
      <Separator className="my-8" />
      <Testimonials />
      <Separator className="my-8" />
      <FAQ />

      {/* Customer Info Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCheckout}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInfoChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInfoChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={handleInfoChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Service Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={customerInfo.address}
                  onChange={handleInfoChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleInfoChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={customerInfo.propertyType}
                  onChange={handleInfoChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="single-family">Single Family Home</option>
                  <option value="condo">Condo/Townhouse</option>
                  <option value="apartment">Apartment</option>
                  <option value="business">Commercial/Business</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Continue to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
