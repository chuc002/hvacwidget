import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SaaSPlans } from '@/lib/saas-plans';
import { useQuery } from '@tanstack/react-query';

// Types for the CustomerDashboard
interface CustomerData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'trial' | 'active' | 'cancelled' | 'past_due';
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    trialEndsAt: Date;
    currentPeriodEnd: Date;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    customDomain?: string;
  };
}

interface Stats {
  totalSubscriptions: number;
  monthlyRevenue: number;
  activeCustomers: number;
}

export default function CustomerDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalSubscriptions: 0,
    monthlyRevenue: 0,
    activeCustomers: 0
  });

  // Fetch customer data
  const { data: customer, isLoading } = useQuery({
    queryKey: ['/api/customer'],
    queryFn: async () => {
      // This would be a real API call in production
      // Simulating for demo purposes
      return {
        id: '12345',
        companyName: 'Premium Home Services',
        email: 'admin@premiumhomeservices.com',
        phone: '(555) 123-4567',
        industry: 'HVAC',
        subscription: {
          plan: 'professional' as const,
          status: 'active' as const,
          stripeCustomerId: 'cus_123456',
          stripeSubscriptionId: 'sub_123456',
          trialEndsAt: new Date('2025-06-01'),
          currentPeriodEnd: new Date('2025-06-23')
        },
        branding: {
          primaryColor: '#0f766e',
          secondaryColor: '#f97316',
          logo: '/logo.png',
          customDomain: 'services.premiumhomeservices.com'
        }
      } as CustomerData;
    }
  });

  useEffect(() => {
    // Fetch stats (this would be a real API call in production)
    // Simulating for demo purposes
    setStats({
      totalSubscriptions: 34,
      monthlyRevenue: 2750,
      activeCustomers: 29
    });
  }, []);

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Upgrading your plan",
      description: "Redirecting to checkout for the " + planId + " plan."
    });
    // This would redirect to Stripe checkout in production
    // window.location.href = `/api/create-upgrade-session?plan=${planId}`;
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Are you sure?",
      description: "This action will cancel your subscription at the end of your billing period. Please contact support if you need help.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If data isn't loaded yet, don't render the full dashboard
  if (!customer) return null;

  // Find current plan details
  const currentPlan = SaaSPlans.find(plan => plan.id === customer.subscription.plan);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{customer.companyName} Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your ServicePlan Pro subscription and widget settings.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant={customer.subscription.status === 'active' ? 'default' : 'destructive'} className="text-sm px-3 py-1 mb-2">
            {customer.subscription.status.toUpperCase()}
          </Badge>
          <p className="text-sm text-gray-500">
            {customer.subscription.status === 'trial' 
              ? `Trial ends on ${new Date(customer.subscription.trialEndsAt).toLocaleDateString()}`
              : `Next billing date: ${new Date(customer.subscription.currentPeriodEnd).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="widget">Widget Settings</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Total Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalSubscriptions}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.activeCustomers}</p>
                <p className="text-sm text-green-600">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help manage your business</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Service Plan
              </Button>
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Widget
              </Button>
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Service Call
              </Button>
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Reports
              </Button>
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Marketing Email
              </Button>
              <Button variant="outline" className="justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Get Support
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your subscription details and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{currentPlan?.name} Plan</h3>
                  <p className="text-2xl font-bold">${currentPlan?.price}<span className="text-sm text-gray-500">/month</span></p>
                  <Badge className="mt-2">{customer.subscription.status.toUpperCase()}</Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next billing date</p>
                  <p className="font-medium">{new Date(customer.subscription.currentPeriodEnd).toLocaleDateString()}</p>
                  
                  <p className="text-sm text-gray-500 mt-3 mb-1">Payment method</p>
                  <p className="font-medium">Visa ending in 4242</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => handleUpgrade(
                    customer.subscription.plan === 'starter' ? 'professional' : 'enterprise'
                  )}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" onClick={handleCancelSubscription}>
                    Cancel Subscription
                  </Button>
                  <Button variant="link" className="text-sm justify-start p-0">
                    Update payment method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Compare plans and upgrade to access more features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {SaaSPlans.map(plan => (
                  <Card key={plan.id} className={`border ${plan.id === customer.subscription.plan ? 'border-primary' : 'border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <p className="text-2xl font-bold">${plan.price}<span className="text-sm text-gray-500">/month</span></p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button 
                        className="w-full"
                        variant={plan.id === customer.subscription.plan ? 'outline' : 'default'}
                        disabled={plan.id === customer.subscription.plan}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {plan.id === customer.subscription.plan ? 'Current Plan' : 'Select Plan'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle>Widget Customization</CardTitle>
              <CardDescription>Customize how your subscription widget looks and behaves on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Branding</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-10 w-10 rounded-full border" 
                          style={{ backgroundColor: customer.branding.primaryColor }}
                        />
                        <input 
                          type="text" 
                          value={customer.branding.primaryColor} 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secondary Color</label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-10 w-10 rounded-full border" 
                          style={{ backgroundColor: customer.branding.secondaryColor }}
                        />
                        <input 
                          type="text" 
                          value={customer.branding.secondaryColor} 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Widget Settings</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input 
                        type="text" 
                        value={customer.companyName} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <input 
                        type="text" 
                        value={customer.industry} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Embed Your Widget</CardTitle>
              <CardDescription>Copy the code below to add your subscription widget to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Embed Options</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Choose how you want to embed the ServicePlan Pro widget on your website
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-2 border-primary">
                      <CardHeader>
                        <CardTitle className="text-lg">JavaScript Snippet</CardTitle>
                        <CardDescription>Recommended for most websites</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          Add this code to your website where you want the widget to appear
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md text-sm font-mono">
                          {`<script 
  src="https://app.serviceplanpro.com/embed.js" 
  data-company="${customer.companyName}"
  data-width="100%"
  data-height="800px">
</script>`}
                        </div>
                      </CardContent>
                      <div className="px-6 pb-6">
                        <Button className="w-full" variant="outline">
                          Copy Script
                        </Button>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">iFrame Embed</CardTitle>
                        <CardDescription>Alternative method</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          Add this iframe code to your website
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md text-sm font-mono">
                          {`<iframe
  src="https://app.serviceplanpro.com/embed?company=${encodeURIComponent(customer.companyName)}"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>`}
                        </div>
                      </CardContent>
                      <div className="px-6 pb-6">
                        <Button className="w-full" variant="outline">
                          Copy iframe
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>
                Track the performance of your subscription plans and customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-80 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Subscription growth chart would appear here</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Plan Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Basic Plan</span>
                          <span className="font-medium">12 subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Premium Plan</span>
                          <span className="font-medium">18 subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Ultimate Plan</span>
                          <span className="font-medium">4 subscribers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Widget Views</span>
                          <span className="font-medium">452</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Subscription Rate</span>
                          <span className="font-medium">7.5%</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Avg. Subscription Value</span>
                          <span className="font-medium">$82/mo</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Retention Rate</span>
                          <span className="font-medium">94%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}