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
  isDemo?: boolean;
}

export default function SubscriptionWidget({ 
  companyName = "Premium Home Services", 
  customerId,
  preselectedPlanId,
  isDemo = false
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
  
  // Conversion optimization states
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (xxx) xxx-xxxx
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const validateField = (name: string, value: string) => {
    const errors = { ...formErrors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = "Full name is required";
        } else if (value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else {
          delete errors.name;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
        
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!phoneDigits) {
          errors.phone = "Phone number is required";
        } else if (phoneDigits.length < 10) {
          errors.phone = "Phone number must be 10 digits";
        } else {
          delete errors.phone;
        }
        break;
        
      case 'zipCode':
        if (value && (value.length < 5 || !/^\d{5}(-\d{4})?$/.test(value))) {
          errors.zipCode = "Please enter a valid ZIP code";
        } else {
          delete errors.zipCode;
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Apply phone number formatting
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setCustomerInfo(prev => ({ ...prev, [name]: formattedValue }));
    
    // Real-time validation
    validateField(name, formattedValue);
    
    // Auto-suggest city/state from ZIP code
    if (name === 'zipCode' && value.length === 5) {
      lookupCityState(value);
    }
  };

  const lookupCityState = async (zipCode: string) => {
    try {
      // Using a free ZIP code API for city/state lookup
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        const place = data.places[0];
        if (place) {
          setCustomerInfo(prev => ({
            ...prev,
            city: place['place name'],
            state: place['state abbreviation']
          }));
        }
      }
    } catch (error) {
      // Silently handle API errors - user can still enter manually
      console.log('ZIP lookup failed, user can enter manually');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) errors.name = "Name is required";
    if (!customerInfo.email.trim()) errors.email = "Email is required";
    if (!customerInfo.email.includes('@')) errors.email = "Valid email is required";
    if (!customerInfo.phone.trim()) errors.phone = "Phone number is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (planToCheckout = selectedPlan) => {
    if (!planToCheckout) return;
    
    // Validate form before proceeding
    if (!validateForm()) {
      toast({
        title: "Please complete all required fields",
        description: "Check the form for missing information",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingPayment(true);
    setCheckoutStep(2);
    setLoading(true);
    
    // Show progress message
    toast({
      title: "Step 2 of 2: Setting up secure payment...",
      description: "Please wait while we prepare your checkout",
    });
    
    try {
      // Create a checkout session on the server using our new endpoint
      // Determine if this is a monthly plan
      const isMonthlyPlan = planToCheckout.id >= 4 || (planToCheckout.stripePriceId && planToCheckout.stripePriceId.includes('monthly'));
      const billingCycle = isMonthlyPlan ? 'monthly' : 'annual';
      
      // Include appropriate billing cycle information
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
        preferredContactTime: customerInfo.preferredContactTime,
        billingCycle: billingCycle
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
          preferredContactTime: customerInfo.preferredContactTime,
          billingCycle: billingCycle
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
        
        // Show success message before redirect
        toast({
          title: "✓ Payment page ready!",
          description: "Redirecting you to secure checkout...",
        });
        
        // Redirect to Stripe Checkout
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      } else {
        console.error('No checkout URL returned in response:', data);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      setCheckoutStep(1);
      toast({
        title: "Payment Setup Failed",
        description: "Unable to create secure checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProcessingPayment(false);
      setCheckoutOpen(false);
    }
  };

  const submitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckout();
  };

  return (
    <div className="w-full max-w-[420px] sm:max-w-6xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        {companyName} Service Subscription Plans
      </h1>
      <h2 className="text-lg sm:text-xl text-center mb-4 sm:mb-6 text-muted-foreground">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
        {plansLoading ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-6 w-1/2" />
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
            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className={checkoutStep === 1 ? "font-semibold text-blue-600" : "text-gray-400"}>
                  Step 1: Your Information
                </span>
                <span className={checkoutStep === 2 ? "font-semibold text-blue-600" : "text-gray-400"}>
                  Step 2: Secure Payment
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: checkoutStep === 1 ? '50%' : '100%' }}
                />
              </div>
              {isProcessing && (
                <div className="flex items-center justify-center mt-3 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Setting up secure payment...</span>
                </div>
              )}
            </div>
            
            <DialogTitle>
              {checkoutStep === 1 ? 'Complete Your Information' : 'Payment Processing...'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCheckout}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInfoChange}
                  placeholder="Enter your full name"
                  className={formErrors.name ? "border-red-500 focus:border-red-500" : customerInfo.name && !formErrors.name ? "border-green-500" : ""}
                  required
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {formErrors.name}
                  </p>
                )}
                {customerInfo.name && !formErrors.name && (
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">✓</span> Looks good!
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInfoChange}
                  placeholder="your.email@example.com"
                  className={formErrors.email ? "border-red-500 focus:border-red-500" : customerInfo.email && !formErrors.email ? "border-green-500" : ""}
                  required
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {formErrors.email}
                  </p>
                )}
                {customerInfo.email && !formErrors.email && (
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">✓</span> Valid email format
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={handleInfoChange}
                  placeholder="(555) 123-4567"
                  className={formErrors.phone ? "border-red-500 focus:border-red-500" : customerInfo.phone && !formErrors.phone ? "border-green-500" : ""}
                  required
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {formErrors.phone}
                  </p>
                )}
                {customerInfo.phone && !formErrors.phone && (
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">✓</span> Valid phone number
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={customerInfo.address}
                  onChange={handleInfoChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={customerInfo.zipCode}
                  onChange={handleInfoChange}
                  placeholder="12345"
                  maxLength={5}
                  className={formErrors.zipCode ? "border-red-500 focus:border-red-500" : customerInfo.zipCode && !formErrors.zipCode ? "border-green-500" : ""}
                />
                {formErrors.zipCode && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {formErrors.zipCode}
                  </p>
                )}
                {customerInfo.zipCode && !formErrors.zipCode && customerInfo.zipCode.length === 5 && (
                  <p className="text-sm text-blue-600 flex items-center">
                    <span className="mr-1">🔍</span> Auto-filling city and state...
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInfoChange}
                    placeholder="City name"
                    className={customerInfo.city ? "border-green-500 bg-green-50" : ""}
                    required
                  />
                  {customerInfo.city && (
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="mr-1">✓</span> City confirmed
                    </p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInfoChange}
                    placeholder="State"
                    maxLength={2}
                    className={customerInfo.state ? "border-green-500 bg-green-50" : ""}
                    required
                  />
                  {customerInfo.state && (
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="mr-1">✓</span> State confirmed
                    </p>
                  )}
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
                disabled={processingPayment}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || processingPayment}
                className="min-w-[160px]"
              >
                {processingPayment ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}