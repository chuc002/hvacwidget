import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { SaaSPlans } from '@/lib/saas-plans';
import { Building2, User, Wrench, ArrowRight, CheckCircle } from 'lucide-react';

export default function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    companyName: '',
    industry: '',
    website: '',
    businessEmail: '',
    businessPhone: '',
    customerCount: '',
    revenueRange: '',
    
    // Contact Information
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    preferredCommunication: 'email',
    
    // ServicePlan Pro Setup
    selectedPlan: 'starter',
    revenueStreams: ['subscriptions'],
    implementationPreference: 'self-service',
    demoRequested: false
  });

  const industries = [
    'HVAC', 'Pest Control', 'Lawn Care', 'Pool Service', 
    'Cleaning Service', 'Security Systems', 'Plumbing', 'Electrical',
    'Handyman', 'Carpet Cleaning', 'Other'
  ];
  
  const revenueRanges = [
    'Under $50,000',
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1 million',
    'Over $1 million'
  ];
  
  const customerCounts = [
    'Less than 50',
    '50 - 100',
    '100 - 250',
    '250 - 500',
    '500 - 1,000',
    'Over 1,000'
  ];
  
  const revenueStreamOptions = [
    { id: 'subscriptions', label: 'Maintenance Plans & Subscriptions' },
    { id: 'products', label: 'Product Sales (Equipment, Parts)' },
    { id: 'services', label: 'One-time Services' },
    { id: 'invoices', label: 'Invoice Payments' }
  ];

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleRevenueStreamChange = (id: string) => {
    setFormData(prev => {
      if (prev.revenueStreams.includes(id)) {
        return {
          ...prev,
          revenueStreams: prev.revenueStreams.filter(item => item !== id)
        };
      } else {
        return {
          ...prev,
          revenueStreams: [...prev.revenueStreams, id]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create business account with 14-day trial
      const response = await apiRequest('POST', '/api/customers/register', formData);
      
      if (response.ok) {
        toast({
          title: "Registration successful!",
          description: "Your 14-day free trial has started. Welcome aboard!",
        });
        // Redirect to welcome/onboarding flow
        setLocation('/welcome-flow');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (step / 3) * 100;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <div className={`flex items-center ${step >= 1 ? 'text-primary font-medium' : ''}`}>
            <Building2 className="w-4 h-4 mr-1" /> Business Info
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary font-medium' : ''}`}>
            <User className="w-4 h-4 mr-1" /> Contact Info
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary font-medium' : ''}`}>
            <Wrench className="w-4 h-4 mr-1" /> Platform Setup
          </div>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Tell us about your business"}
            {step === 2 && "Your contact information"}
            {step === 3 && "Set up your ServicePlan Pro account"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Let's get to know your company better to customize your experience."}
            {step === 2 && "How can we best reach you during your trial?"}
            {step === 3 && "Choose your plan and customize your ServicePlan Pro setup."}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Business Information */}
          {step === 1 && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => setFormData({...formData, industry: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://your-company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    placeholder="info@company.com"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerCount">Approximate Number of Customers</Label>
                <Select 
                  value={formData.customerCount} 
                  onValueChange={(value) => setFormData({...formData, customerCount: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer count" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerCounts.map(count => (
                      <SelectItem key={count} value={count}>{count}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenueRange">Monthly Revenue Range</Label>
                <Select 
                  value={formData.revenueRange} 
                  onValueChange={(value) => setFormData({...formData, revenueRange: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueRanges.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
          
          {/* Step 2: Contact Information */}
          {step === 2 && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your Name</Label>
                <Input
                  id="contactName"
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Your Title/Role</Label>
                <Input
                  id="contactTitle"
                  placeholder="e.g. Owner, Manager, Director"
                  value={formData.contactTitle}
                  onChange={(e) => setFormData({...formData, contactTitle: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Your Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Your Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Communication Method</Label>
                <RadioGroup 
                  value={formData.preferredCommunication}
                  onValueChange={(value) => setFormData({...formData, preferredCommunication: value})}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="comm-email" />
                    <Label htmlFor="comm-email" className="cursor-pointer">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="comm-phone" />
                    <Label htmlFor="comm-phone" className="cursor-pointer">Phone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="comm-text" />
                    <Label htmlFor="comm-text" className="cursor-pointer">Text Message</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          )}
          
          {/* Step 3: ServicePlan Pro Setup */}
          {step === 3 && (
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Choose your ServicePlan Pro plan</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SaaSPlans.map(plan => (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.selectedPlan === plan.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setFormData({...formData, selectedPlan: plan.id})}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{plan.name}</h3>
                          <p className="text-sm text-gray-500">${plan.price}/mo</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.selectedPlan === plan.id ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {formData.selectedPlan === plan.id && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      <ul className="text-xs space-y-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Which revenue streams do you want to enable?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {revenueStreamOptions.map(option => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={option.id}
                        checked={formData.revenueStreams.includes(option.id)}
                        onCheckedChange={() => handleRevenueStreamChange(option.id)}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor={option.id}
                          className="font-medium leading-none cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Implementation Preference</Label>
                <RadioGroup 
                  value={formData.implementationPreference}
                  onValueChange={(value) => setFormData({...formData, implementationPreference: value})}
                  className="flex flex-col space-y-3 mt-2"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="self-service" id="self-service" className="mt-1" />
                    <div>
                      <Label htmlFor="self-service" className="cursor-pointer font-medium">Self-Service Setup</Label>
                      <p className="text-sm text-gray-500">I'll configure everything myself with help documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="guided-setup" id="guided-setup" className="mt-1" />
                    <div>
                      <Label htmlFor="guided-setup" className="cursor-pointer font-medium">Guided Setup</Label>
                      <p className="text-sm text-gray-500">I'd like help configuring my account from your team</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="demo-request"
                  checked={formData.demoRequested}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, demoRequested: checked as boolean})
                  }
                />
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="demo-request"
                    className="font-medium leading-none cursor-pointer"
                  >
                    Request a personalized demo
                  </Label>
                  <p className="text-sm text-gray-500">
                    I'd like a 30-minute call with a product specialist to explore the platform
                  </p>
                </div>
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Start 14-Day Free Trial"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">14-Day Free Trial Benefits:</h3>
        <ul className="space-y-2">
          <li className="flex items-start text-blue-700">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span>Full access to all features and functionality</span>
          </li>
          <li className="flex items-start text-blue-700">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span>No credit card required to start trial</span>
          </li>
          <li className="flex items-start text-blue-700">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span>Guided onboarding and personalized support</span>
          </li>
          <li className="flex items-start text-blue-700">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span>Easy upgrade process when trial ends</span>
          </li>
        </ul>
      </div>
    </div>
  );
}