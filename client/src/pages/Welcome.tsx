import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  ChevronRight, 
  PaintBucket, 
  Brush, 
  Upload, 
  ListChecks, 
  Code, 
  CreditCard, 
  Clock,
  CircleHelp,
  Users,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string;
  features: string[];
}

interface WelcomeData {
  companyName: string;
  trialEndsAt: Date;
  customerId: string;
  plan: string;
}

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<WelcomeData>({
    companyName: 'Your Company',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    customerId: '12345',
    plan: 'professional'
  });
  
  const [branding, setBranding] = useState({
    primaryColor: '#0f766e',
    secondaryColor: '#f97316',
    logo: null as string | null,
    companyTagline: 'Professional Home Services',
    fontStyle: 'modern'
  });
  
  const [servicePlans, setServicePlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Basic Maintenance',
      price: '29.99',
      interval: 'monthly',
      features: [
        'Seasonal tune-ups',
        'Filter replacements',
        'Priority scheduling',
        '10% discount on repairs'
      ]
    }
  ]);

  // Load user data when component mounts
  useEffect(() => {
    // In a real app, fetch this data from the API
    // For now, just simulate a data fetch
    setTimeout(() => {
      setIsLoading(false);
      setUserData({
        companyName: 'Premium Home Services',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        customerId: '12345',
        plan: 'professional'
      });
    }, 1000);
  }, []);

  const addServicePlan = () => {
    const newPlan: Plan = {
      id: String(servicePlans.length + 1),
      name: 'New Service Plan',
      price: '49.99',
      interval: 'monthly',
      features: ['Feature 1', 'Feature 2', 'Feature 3']
    };
    
    setServicePlans([...servicePlans, newPlan]);
  };
  
  const updateServicePlan = (id: string, field: keyof Plan, value: string) => {
    setServicePlans(servicePlans.map(plan => 
      plan.id === id ? { ...plan, [field]: value } : plan
    ));
  };
  
  const updatePlanFeature = (planId: string, index: number, value: string) => {
    setServicePlans(servicePlans.map(plan => {
      if (plan.id === planId) {
        const updatedFeatures = [...plan.features];
        updatedFeatures[index] = value;
        return { ...plan, features: updatedFeatures };
      }
      return plan;
    }));
  };
  
  const addFeatureToPlan = (planId: string) => {
    setServicePlans(servicePlans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, features: [...plan.features, 'New feature'] };
      }
      return plan;
    }));
  };
  
  const removeServicePlan = (id: string) => {
    if (servicePlans.length > 1) {
      setServicePlans(servicePlans.filter(plan => plan.id !== id));
    } else {
      toast({
        title: "Cannot remove plan",
        description: "You need at least one service plan.",
        variant: "destructive"
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setBranding({...branding, logo: loadEvent.target.result as string});
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const saveChanges = async () => {
    try {
      setIsLoading(true);
      // In a real app, would send data to the server
      // const response = await apiRequest('POST', '/api/onboarding/complete', {
      //   branding,
      //   servicePlans
      // });
      
      // Simulate API call success
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Setup completed!",
          description: "Your ServicePlan Pro account is ready to use.",
        });
        setLocation('/customer-dashboard');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error saving changes",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };
  
  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const skipToEnd = () => {
    setStep(5);
    window.scrollTo(0, 0);
  };
  
  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return <Users className="h-6 w-6 text-primary" />;
      case 2: return <PaintBucket className="h-6 w-6 text-primary" />;
      case 3: return <ListChecks className="h-6 w-6 text-primary" />;
      case 4: return <Code className="h-6 w-6 text-primary" />;
      case 5: return <CreditCard className="h-6 w-6 text-primary" />;
      default: return <CircleHelp className="h-6 w-6 text-primary" />;
    }
  };
  
  // Calculate days remaining in trial
  const daysRemaining = Math.ceil((userData.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Trial Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="text-blue-700 font-medium">
                Your trial ends in {daysRemaining} days
              </p>
              <p className="text-blue-600 text-sm">
                Full access to all features during your trial. No credit card required.
              </p>
            </div>
          </div>
          <Button>
            Upgrade Now
          </Button>
        </div>
      
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to ServicePlan Pro!</h1>
          <p className="text-gray-600">
            Let's set up your account to start generating revenue from service plans. 
            Follow these 5 simple steps to complete your onboarding.
          </p>
        </div>
        
        {/* Step Navigation */}
        <div className="flex overflow-auto mb-8 pb-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <div 
              key={num} 
              className={`flex-shrink-0 flex flex-col items-center mr-4 md:mr-8 cursor-pointer`}
              onClick={() => setStep(num)}
            >
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 
                ${step === num ? 'bg-primary text-white' : 
                  step > num ? 'bg-green-100 text-green-600 border-2 border-green-500' : 
                  'bg-gray-100 text-gray-500'}`}
              >
                {step > num ? <CheckCircle className="h-6 w-6" /> : getStepIcon(num)}
              </div>
              <div className={`text-xs text-center whitespace-nowrap ${step === num ? 'font-semibold text-primary' : 'text-gray-500'}`}>
                {num === 1 && "Welcome"}
                {num === 2 && "Branding"}
                {num === 3 && "Service Plans"}
                {num === 4 && "Website Integration"}
                {num === 5 && "Go Live"}
              </div>
            </div>
          ))}
        </div>
        
        <Card className="mb-8 border-2">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to Your ServicePlan Pro Trial</CardTitle>
                <CardDescription>
                  Your 14-day free trial gives you full access to all features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Here's what you can do with ServicePlan Pro:</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Create subscription plans</h4>
                        <p className="text-sm text-gray-600">Offer maintenance plans with recurring revenue</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Sell products online</h4>
                        <p className="text-sm text-gray-600">Equipment, parts and supplies with secure checkout</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Process online payments</h4>
                        <p className="text-sm text-gray-600">Invoices and one-time service payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Customer management</h4>
                        <p className="text-sm text-gray-600">Track all customers and their subscriptions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Detailed analytics</h4>
                        <p className="text-sm text-gray-600">Revenue tracking, conversion metrics and more</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Zapier integration</h4>
                        <p className="text-sm text-gray-600">Connect with your CRM, accounting software and more</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">Your 14-day free trial includes:</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700">Full access to all ServicePlan Pro features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700">Unlimited test transactions (no real charges)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700">Personalized onboarding support from our team</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700">No credit card required until trial ends</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-lg border bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">Onboarding Steps:</h3>
                  
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Customize your branding</h4>
                        <p className="text-sm text-gray-600">Set your colors, logo, and company information</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Configure your service plans</h4>
                        <p className="text-sm text-gray-600">Create maintenance plans with pricing and features</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Add the widget to your website</h4>
                        <p className="text-sm text-gray-600">Simple copy-paste code to embed on your site</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Process test transactions</h4>
                        <p className="text-sm text-gray-600">Make sure everything works correctly before going live</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="link" onClick={skipToEnd}>
                  Skip for now
                </Button>
                <Button onClick={nextStep}>
                  Start Setup <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          
          {/* Step 2: Widget Customization - Branding */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Widget Customization</CardTitle>
                <CardDescription>
                  Customize how your subscription widget looks to match your brand.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input 
                        value={userData.companyName}
                        onChange={(e) => setUserData({...userData, companyName: e.target.value})}
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Company Tagline</Label>
                      <Input 
                        value={branding.companyTagline}
                        onChange={(e) => setBranding({...branding, companyTagline: e.target.value})}
                        placeholder="Professional Home Services"
                      />
                      <p className="text-xs text-gray-500">Short phrase that appears below your company name</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex space-x-2">
                        <input 
                          type="color"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                          className="h-10 w-10 rounded border cursor-pointer"
                        />
                        <Input 
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Used for buttons and primary elements</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex space-x-2">
                        <input 
                          type="color"
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                          className="h-10 w-10 rounded border cursor-pointer"
                        />
                        <Input 
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Used for accents and highlights</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Font Style</Label>
                      <Select 
                        value={branding.fontStyle} 
                        onValueChange={(value) => setBranding({...branding, fontStyle: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Company Logo</Label>
                      <div className="border-2 border-dashed rounded-md p-4 text-center">
                        {branding.logo ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src={branding.logo} 
                              alt="Company Logo" 
                              className="max-h-24 mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => setBranding({...branding, logo: null})}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500 mb-2">
                              Drag and drop your logo here or click to browse
                            </p>
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              Upload Logo
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Recommended size: 300x100px, PNG or SVG format</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="sticky top-4">
                      <h3 className="font-medium mb-3">Widget Preview</h3>
                      <div 
                        className="border-2 rounded-lg p-6"
                        style={{ backgroundColor: 'white' }}
                      >
                        <div className="text-center mb-6">
                          {branding.logo && (
                            <img 
                              src={branding.logo} 
                              alt={userData.companyName} 
                              className="h-16 object-contain mx-auto mb-3"
                            />
                          )}
                          <h2 
                            className="text-xl font-bold" 
                            style={{ color: branding.primaryColor }}
                          >
                            {userData.companyName}
                          </h2>
                          <p className="text-gray-600">{branding.companyTagline}</p>
                        </div>
                        
                        <div className="bg-gray-100 rounded p-2 flex space-x-2 mb-4">
                          <div 
                            className="rounded py-1 px-3 text-sm font-medium text-white"
                            style={{ backgroundColor: branding.primaryColor }}
                          >
                            Service Plans
                          </div>
                          <div className="rounded py-1 px-3 text-sm font-medium text-gray-600">
                            Products
                          </div>
                          <div className="rounded py-1 px-3 text-sm font-medium text-gray-600">
                            Services
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-bold mb-1">Basic Plan</h3>
                            <p className="text-sm text-gray-600 mb-2">Essential maintenance</p>
                            <p className="text-xl font-bold" style={{ color: branding.primaryColor }}>$29.99<span className="text-sm text-gray-500">/month</span></p>
                          </div>
                          
                          <div 
                            className="border rounded-md p-4 hover:shadow-md transition-shadow"
                            style={{ borderColor: branding.secondaryColor }}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-bold mb-1">Premium Plan</h3>
                              <span 
                                className="text-xs font-medium rounded-full px-2 py-1 text-white"
                                style={{ backgroundColor: branding.secondaryColor }}
                              >
                                Popular
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Complete coverage</p>
                            <p className="text-xl font-bold" style={{ color: branding.primaryColor }}>$59.99<span className="text-sm text-gray-500">/month</span></p>
                          </div>
                        </div>
                        
                        <button 
                          className="w-full py-2 rounded text-white font-medium"
                          style={{ backgroundColor: branding.primaryColor }}
                        >
                          Select Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          
          {/* Step 3: Service Plans Configuration */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Service Plans Configuration</CardTitle>
                <CardDescription>
                  Create the subscription plans you'll offer to your customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Service Plans</h3>
                  <Button onClick={addServicePlan}>
                    Add New Plan
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {servicePlans.map((plan, index) => (
                    <Card key={plan.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex">
                              <Input
                                value={plan.name}
                                onChange={(e) => updateServicePlan(plan.id, 'name', e.target.value)}
                                className="font-bold text-lg border-0 p-0 h-auto max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Plan Name"
                              />
                            </div>
                            <CardDescription>
                              Configure details for this maintenance plan
                            </CardDescription>
                          </div>
                          
                          {servicePlans.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeServicePlan(plan.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Price</Label>
                            <div className="flex items-center">
                              <span className="mr-2">$</span>
                              <Input
                                value={plan.price}
                                onChange={(e) => updateServicePlan(plan.id, 'price', e.target.value)}
                                type="text"
                                placeholder="29.99"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Billing Interval</Label>
                            <Select 
                              value={plan.interval} 
                              onValueChange={(value) => updateServicePlan(plan.id, 'interval', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="annual">Annual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Plan Features</Label>
                          <p className="text-sm text-gray-500">
                            List the benefits customers get with this plan
                          </p>
                          
                          <div className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <div key={`${plan.id}-feature-${idx}`} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <Input
                                  value={feature}
                                  onChange={(e) => updatePlanFeature(plan.id, idx, e.target.value)}
                                  placeholder="Enter feature"
                                />
                              </div>
                            ))}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => addFeatureToPlan(plan.id)}
                              className="mt-2"
                            >
                              Add Feature
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id={`popular-${plan.id}`} />
                            <Label htmlFor={`popular-${plan.id}`}>Mark as Popular/Recommended</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Tips for Effective Service Plans:</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Offer 2-3 tiers to provide options (Basic, Premium, Ultimate)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Highlight one plan as "Most Popular" to guide customer choice</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Include specific frequencies for maintenance visits</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Add repair discounts as an incentive for subscription</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Offer annual plans with a small discount over monthly payments</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          
          {/* Step 4: Website Implementation */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Website Implementation</CardTitle>
                <CardDescription>
                  Add the subscription widget to your website with a simple embed code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Embed Method</h3>
                      <Tabs defaultValue="javascript">
                        <TabsList className="w-full mb-4">
                          <TabsTrigger value="javascript" className="flex-1">JavaScript</TabsTrigger>
                          <TabsTrigger value="iframe" className="flex-1">iFrame</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="javascript">
                          <div className="space-y-2">
                            <Label>JavaScript Embed Code</Label>
                            <p className="text-sm text-gray-500 mb-2">
                              Copy this code and paste it before the closing &lt;/body&gt; tag on your website.
                            </p>
                            <div className="bg-gray-800 p-4 rounded-md text-white font-mono text-sm whitespace-pre overflow-x-auto">
                              {`<script>
  (function(w,d,s,o,f,js,fjs){
    w['ServicePlanWidget']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','spw',
    'https://app.serviceplanpro.com/widget.js'));
  spw('init', { 
    customerID: '${userData.customerId}',
    companyName: '${userData.companyName}'
  });
</script>`}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">
                              Copy Code
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="iframe">
                          <div className="space-y-2">
                            <Label>iFrame Embed Code</Label>
                            <p className="text-sm text-gray-500 mb-2">
                              Copy this code and paste it where you want the widget to appear on your website.
                            </p>
                            <div className="bg-gray-800 p-4 rounded-md text-white font-mono text-sm whitespace-pre overflow-x-auto">
                              {`<iframe
  src="https://app.serviceplanpro.com/embed?customerID=${userData.customerId}&companyName=${encodeURIComponent(userData.companyName)}"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>`}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">
                              Copy Code
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Widget Display Options</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="embed-floating">Floating Button</Label>
                          <Switch id="embed-floating" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Shows a floating button in the corner of your website that opens the widget when clicked.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="embed-inline">Inline Embed</Label>
                          <Switch id="embed-inline" defaultChecked />
                        </div>
                        <p className="text-sm text-gray-500">
                          Displays the widget directly on the page where you put the embed code.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Widget Display Mode</Label>
                        <Select defaultValue="all-in-one">
                          <SelectTrigger>
                            <SelectValue placeholder="Select display mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-in-one">All-in-One (All Revenue Streams)</SelectItem>
                            <SelectItem value="subscriptions-only">Subscriptions Only</SelectItem>
                            <SelectItem value="products-only">Products Only</SelectItem>
                            <SelectItem value="invoices-only">Invoices Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                          Control which revenue streams are visible in the widget.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="sticky top-4 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Implementation Steps</h3>
                        <ol className="space-y-3">
                          <li className="flex items-start">
                            <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                              1
                            </div>
                            <div>
                              <h4 className="font-medium">Copy the embed code</h4>
                              <p className="text-sm text-gray-600">Choose JavaScript or iFrame method</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                              2
                            </div>
                            <div>
                              <h4 className="font-medium">Paste into your website</h4>
                              <p className="text-sm text-gray-600">Add to your service plans/pricing page</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                              3
                            </div>
                            <div>
                              <h4 className="font-medium">Test the widget</h4>
                              <p className="text-sm text-gray-600">Make sure it loads and displays correctly</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h3 className="font-medium text-yellow-800 mb-2">Need help with implementation?</h3>
                        <p className="text-sm text-yellow-700 mb-3">
                          Our team can help you integrate the widget with your website.
                        </p>
                        <Button variant="outline" size="sm">
                          Schedule Implementation Call
                        </Button>
                      </div>
                      
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Don't have a website?</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          We can provide a hosted landing page with your branding and subscription widget.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Switch id="hosted-landing-page" />
                          <Label htmlFor="hosted-landing-page">Use Hosted Landing Page</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
          
          {/* Step 5: Test Transaction and Go Live */}
          {step === 5 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Launch</CardTitle>
                <CardDescription>
                  Your ServicePlan Pro account is now set up and ready to use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-medium text-green-800">Setup Complete!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    You've successfully completed the onboarding process. Your ServicePlan Pro account is ready to start generating recurring revenue.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-md border border-green-100">
                      <h4 className="font-medium text-green-800 mb-1">Branding</h4>
                      <p className="text-sm text-green-700">Customized to match your brand identity</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-green-100">
                      <h4 className="font-medium text-green-800 mb-1">Service Plans</h4>
                      <p className="text-sm text-green-700">{servicePlans.length} plans configured and ready</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-green-100">
                      <h4 className="font-medium text-green-800 mb-1">Website Integration</h4>
                      <p className="text-sm text-green-700">Embed code ready to implement</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Next Steps:</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-5">
                      <div className="flex items-start mb-3">
                        <Code className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium mb-1">Add to Your Website</h4>
                          <p className="text-sm text-gray-600">
                            Implement the widget code on your website to start accepting subscriptions.
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View Embed Code</Button>
                    </div>
                    
                    <div className="border rounded-lg p-5">
                      <div className="flex items-start mb-3">
                        <CreditCard className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium mb-1">Process Test Transaction</h4>
                          <p className="text-sm text-gray-600">
                            Make a test purchase to verify everything works properly.
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Run Test Transaction</Button>
                    </div>
                    
                    <div className="border rounded-lg p-5">
                      <div className="flex items-start mb-3">
                        <FileText className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium mb-1">Explore Documentation</h4>
                          <p className="text-sm text-gray-600">
                            Learn more about advanced features and customization options.
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View Documentation</Button>
                    </div>
                    
                    <div className="border rounded-lg p-5">
                      <div className="flex items-start mb-3">
                        <Users className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium mb-1">Schedule Onboarding Call</h4>
                          <p className="text-sm text-gray-600">
                            Get personalized guidance from our customer success team.
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Book 30-Min Call</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Trial Status</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Current Plan:</p>
                      <p className="font-medium">{userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)} (Trial)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days Remaining:</p>
                      <p className="font-medium">{daysRemaining} days</p>
                    </div>
                    <div>
                      <Button>
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={saveChanges} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Go to Dashboard'}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
        
        <div className="flex justify-center">
          <Button variant="link" onClick={() => setLocation('/customer-dashboard')}>
            Skip to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}