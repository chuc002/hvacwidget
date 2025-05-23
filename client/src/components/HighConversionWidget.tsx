import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { Check, Star, Shield, Zap, Clock, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

interface HighConversionWidgetProps {
  companyName?: string;
  customerId?: number;
  preselectedPlanId?: number;
  isDemo?: boolean;
}

export default function HighConversionWidget({ 
  companyName = "Premium Home Services", 
  customerId,
  preselectedPlanId,
  isDemo = false
}: HighConversionWidgetProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('monthly');
  
  // High-conversion form states
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  // Fetch plans with optimized pricing
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: async () => {
      const response = await fetch('/api/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();
      
      // Fallback to optimized B2B plans if API fails
      if (!data || data.length === 0) {
        return [
          {
            id: 1,
            name: "Starter",
            description: "Perfect for new home service businesses",
            price: "399",
            interval: "month",
            features: [
              "Up to 100 customers/month",
              "Basic subscription widget",
              "Email support",
              "Mobile-optimized checkout",
              "Stripe payment processing"
            ],
            isPopular: false,
            stripePriceId: "price_starter_399"
          },
          {
            id: 2,
            name: "Professional",
            description: "Most popular choice for growing HVAC companies",
            price: "699",
            interval: "month",
            features: [
              "Up to 500 customers/month",
              "Advanced subscription widget",
              "Product catalog & sales",
              "Custom branding",
              "Priority support",
              "Analytics dashboard"
            ],
            isPopular: true,
            stripePriceId: "price_professional_699"
          },
          {
            id: 3,
            name: "Enterprise",
            description: "For established home service companies",
            price: "999",
            interval: "month",
            features: [
              "Unlimited customers",
              "Full multi-revenue widget",
              "Invoice payment processing",
              "Multi-location support",
              "Dedicated account manager",
              "White-label solution"
            ],
            isPopular: false,
            stripePriceId: "price_enterprise_999"
          }
        ];
      }
      return data;
    }
  });

  // Real-time form validation
  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (field) {
      case 'name':
        if (!value.trim()) errors.name = 'Company name is required';
        else if (value.length < 2) errors.name = 'Company name must be at least 2 characters';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errors.email = 'Email is required';
        else if (!emailRegex.test(value)) errors.email = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) errors.phone = 'Phone number is required';
        else if (value.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a valid phone number';
        break;
      case 'zipCode':
        if (!value.trim()) errors.zipCode = 'ZIP code is required';
        else if (!/^\d{5}(-\d{4})?$/.test(value)) errors.zipCode = 'Please enter a valid ZIP code';
        break;
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handle form input changes with validation
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Auto-format phone number
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setCustomerInfo(prev => ({ ...prev, [field]: formattedValue }));
    setFormTouched(prev => ({ ...prev, [field]: true }));
    
    // Real-time validation
    if (formTouched[field]) {
      validateField(field, formattedValue);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phone', 'zipCode'];
    return requiredFields.every(field => 
      customerInfo[field as keyof typeof customerInfo].trim() !== '' && 
      !formErrors[field]
    );
  };

  // Handle plan selection
  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
    setCheckoutStep(1);
  };

  // Handle checkout progression
  const handleNextStep = () => {
    if (checkoutStep === 1) {
      // Validate form before proceeding
      const requiredFields = ['name', 'email', 'phone', 'zipCode'];
      let hasErrors = false;
      
      requiredFields.forEach(field => {
        const value = customerInfo[field as keyof typeof customerInfo];
        if (!validateField(field, value)) {
          hasErrors = true;
        }
        setFormTouched(prev => ({ ...prev, [field]: true }));
      });
      
      if (!hasErrors) {
        setCheckoutStep(2);
      }
    }
  };

  // Handle checkout completion
  const handleCheckout = async () => {
    if (!selectedPlan || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        planId: selectedPlan.id,
        billingType,
        customerInfo,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`
      });
      
      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to process checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Choose Your ServicePlan Pro Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform your home service business with our professional subscription management platform
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>5-minute setup</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span>30-day free trial</span>
          </div>
        </div>
      </div>

      {/* Pricing Plans - Mobile Optimized */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans?.map((plan: any) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              plan.isPopular ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-md'
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  ${plan.price}
                  <span className="text-sm text-gray-500 font-normal">/{plan.interval}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full h-12 text-base font-semibold ${
                  plan.isPopular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect(plan);
                }}
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <Star className="h-8 w-8 text-yellow-500 mx-auto" />
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>
          <div className="space-y-2">
            <Shield className="h-8 w-8 text-green-500 mx-auto" />
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="space-y-2">
            <Zap className="h-8 w-8 text-blue-500 mx-auto" />
            <div className="text-2xl font-bold">5x</div>
            <div className="text-sm text-gray-600">Revenue Increase</div>
          </div>
          <div className="space-y-2">
            <Clock className="h-8 w-8 text-purple-500 mx-auto" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* High-Conversion Checkout Modal */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Complete Your Setup
            </DialogTitle>
            
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Step {checkoutStep} of 2</span>
                <span>{checkoutStep === 1 ? 'Your Information' : 'Confirm & Start Trial'}</span>
              </div>
              <Progress value={checkoutStep * 50} className="w-full" />
            </div>
          </DialogHeader>

          {checkoutStep === 1 ? (
            // Step 1: Customer Information
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="ABC HVAC Services"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@abchvac.com"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  value={customerInfo.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={formErrors.zipCode ? 'border-red-500' : ''}
                />
                {formErrors.zipCode && (
                  <p className="text-sm text-red-600">{formErrors.zipCode}</p>
                )}
              </div>

              <Button
                onClick={handleNextStep}
                disabled={!isFormValid()}
                className="w-full h-12 text-base font-semibold"
              >
                Continue to Payment
              </Button>
            </div>
          ) : (
            // Step 2: Confirmation & Payment
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{selectedPlan?.name} Plan</h3>
                <div className="text-2xl font-bold text-blue-600">
                  ${selectedPlan?.price}/{selectedPlan?.interval}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  30-day free trial • Cancel anytime
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span className="font-medium">{customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{customerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium">{customerInfo.phone}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Your Trial...
                  </>
                ) : (
                  'Start 30-Day Free Trial'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No charge for 30 days. Cancel anytime during trial.
              </p>
            </div>
          )}

          <DialogFooter className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Secured by 256-bit SSL encryption
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}