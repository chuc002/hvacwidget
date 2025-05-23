import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { SaaSPlansArray } from '@/lib/pricing-config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckIcon, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Embed() {
  const [searchParams] = useState<URLSearchParams>(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );
  const customerId = searchParams.get('customerId');
  const companyName = searchParams.get('company') || 'Our Company';
  const primaryColor = searchParams.get('primaryColor') || '#0070f3';
  const mode = searchParams.get('mode') || 'inline';
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'products' | 'invoices'>('subscriptions');

  // Apply custom styling based on query parameters
  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      
      // Create a style element to override the primary color
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        :root {
          --primary: ${primaryColor};
          --primary-foreground: white;
        }
        .bg-primary {
          background-color: ${primaryColor} !important;
        }
        .text-primary {
          color: ${primaryColor} !important;
        }
        .border-primary {
          border-color: ${primaryColor} !important;
        }
        .ring-primary {
          --tw-ring-color: ${primaryColor} !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [primaryColor]);

  // Fetch customer information if customerId is provided
  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['/api/customers', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const response = await apiRequest('GET', `/api/customers/${customerId}`);
      return response.json();
    },
    enabled: !!customerId
  });

  // Function to handle plan selection
  const handleSelectPlan = async (planId: string) => {
    try {
      // Create checkout session
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        planId,
        customerId,
        billingCycle
      });
      
      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="embed-container min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{companyName} Service Plans</h1>
        <p className="text-muted-foreground">
          Choose the perfect maintenance plan for your home
        </p>
      </div>

      <Tabs defaultValue="subscriptions" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="subscriptions">Maintenance Plans</TabsTrigger>
          {SaaSPlansArray.some(plan => plan.id === 'professional' || plan.id === 'enterprise') && (
            <>
              <TabsTrigger value="products">Products</TabsTrigger>
              {SaaSPlansArray.some(plan => plan.id === 'enterprise') && (
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              )}
            </>
          )}
        </TabsList>

        <TabsContent value="subscriptions">
          <div className="space-y-6">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>Monthly</span>
              <Switch 
                checked={billingCycle === 'annual'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              />
              <span className={billingCycle === 'annual' ? 'font-semibold' : 'text-muted-foreground'}>
                Annual <span className="text-sm text-green-600 font-medium">(Save 15%)</span>
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {SaaSPlansArray.map((plan) => (
                <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary ring-1 ring-primary' : ''} relative`}>
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.id === 'starter' 
                        ? 'Basic coverage for essential maintenance'
                        : plan.id === 'professional'
                        ? 'Comprehensive coverage with priority service'
                        : 'Complete coverage with premium benefits'}
                    </CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        {formatPrice(billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12)}
                      </span>
                      <span className="text-muted-foreground ml-1">/month</span>
                      {billingCycle === 'annual' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed annually at {formatPrice(plan.annualPrice)}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      Select Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-4 mt-8">
              <h3 className="font-medium mb-2">Why choose a maintenance plan?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Regular maintenance extends equipment life and prevents costly breakdowns</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Priority service for plan members – skip the regular service queue</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Special discounts on repairs and new equipment purchases</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* This section would be populated with actual products from your catalog */}
              {/* These are placeholders for the embed preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Air Purifier</CardTitle>
                  <CardDescription>Advanced HEPA filtration system</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">$299</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Removes 99.97% of airborne particles</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Quiet operation for bedrooms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Energy efficient design</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Smart Thermostat</CardTitle>
                  <CardDescription>Wi-Fi enabled temperature control</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">$189</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Control from anywhere via smartphone</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Learning algorithm adapts to your schedule</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Energy usage reports and recommendations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>HVAC Filter Set</CardTitle>
                  <CardDescription>Annual supply of premium filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">$99</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>12-month supply (4 filters)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>High-performance MERV 11 rating</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Captures dust, allergens, and pet dander</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Pay Your Invoice</h2>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="text-center mb-6">
                <p className="text-lg mb-2">Enter your invoice number to make a payment</p>
                <p className="text-muted-foreground text-sm">
                  Pay securely online using your credit card or bank account
                </p>
              </div>
              
              <div className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Invoice Number"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button>
                    Look Up
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 bg-muted/50">
                  <p className="text-center text-muted-foreground">
                    Enter your invoice number above to retrieve your balance
                  </p>
                </div>
                
                <Button className="w-full" disabled>
                  Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our billing department at (555) 123-4567
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        <p className="mt-1">Powered by <span className="font-medium">ServicePlan Pro</span></p>
      </div>
    </div>
  );
}