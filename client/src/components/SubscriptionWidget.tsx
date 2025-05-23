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
import { Switch } from "@/components/ui/switch";
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
  companyName = "Premium Home Services", 
  customerId,
  preselectedPlanId
}: SubscriptionWidgetProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('monthly'); // Default to monthly for higher conversion
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
    queryFn: async () => {
      const response = await fetch('/api/plans');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      return response.json();
    }
  });

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
        planId: planToCheckout.stripePriceId || `price_${planToCheckout.id}`,
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
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode,
          propertyType: customerInfo.propertyType,
          preferredContactTime: customerInfo.preferredContactTime
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
        
        // Show toast with payment link button
        toast({
          title: "Checkout Ready",
          description: "Click the button below to complete your payment",
          action: (
            <button 
              className="bg-primary text-white px-4 py-2 rounded mt-2"
              onClick={() => window.open(data.url, '_blank')}
            >
              Go to Payment
            </button>
          ),
          duration: 10000,
        });
        
        // Try to open the payment page automatically
        window.open(data.url, '_blank');
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        {companyName} Service Subscription Plans
      </h1>
      <h2 className="text-xl text-center mb-6 text-muted-foreground">
        Choose the perfect service plan for your home
      </h2>
      
      {/* Billing toggle */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="flex items-center justify-center space-x-4 bg-gray-100 p-2 rounded-full">
          <span className={`px-4 py-2 rounded-full cursor-pointer ${billingType === 'monthly' ? 'bg-primary text-white font-medium' : 'text-gray-600'}`}
                onClick={() => setBillingType('monthly')}>
            Pay Monthly
          </span>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={billingType === 'annual'} 
              onCheckedChange={(checked) => setBillingType(checked ? 'annual' : 'monthly')} 
              className="data-[state=checked]:bg-green-600"
            />
          </div>
          <span className={`px-4 py-2 rounded-full cursor-pointer ${billingType === 'annual' ? 'bg-primary text-white font-medium' : 'text-gray-600'}`}
                onClick={() => setBillingType('annual')}>
            Pay Annually
          </span>
        </div>
        {billingType === 'annual' && (
          <div className="mt-2 text-sm font-medium text-green-600">
            Save up to 20% with annual plans
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plansLoading ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-1/2" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Display plans based on current billing type 
          PlanDetails
            .filter(plan => {
              if (billingType === 'monthly') {
                return plan.id >= 4; // Monthly plans have IDs 4, 5, 6
              } else {
                return plan.id <= 3; // Annual plans have IDs 1, 2, 3
              }
            })
            .map((plan) => (
              <SubscriptionPlan
                key={plan.id}
                plan={plan}
                onSelect={() => handlePlanSelect(plan)}
                isHighlighted={plan.isPopular}
                isSelected={selectedPlan?.id === plan.id}
                preselected={plan.id === preselectedPlanId}
              />
            ))
        )}
      </div>

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
                {loading ? "Processing..." : "Continue to Checkout"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}