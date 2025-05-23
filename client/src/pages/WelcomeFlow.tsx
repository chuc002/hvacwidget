import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Play, CheckSquare, Coffee, Code, Settings, PenTool } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Navigation from '@/components/Navigation';

const WelcomeStep = ({ customer, onNext }: { customer: any; onNext: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to ServicePlan Pro!</h2>
        <p className="text-gray-600 mt-2">
          Your account has been created and your 14-day free trial has started.
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Here's what happens next:</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Customize your subscription widget</p>
              <p className="text-sm text-gray-600">Brand it to match your company and set your pricing</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Add the widget to your website</p>
              <p className="text-sm text-gray-600">Simple copy-paste for any website platform</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Start receiving subscriptions</p>
              <p className="text-sm text-gray-600">Customers can subscribe 24/7 - even while you sleep</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-100 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Your 14-day free trial includes:</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
            <span>Full access to all features and customization options</span>
          </li>
          <li className="flex items-center">
            <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
            <span>Unlimited subscriber sign-ups during trial period</span>
          </li>
          <li className="flex items-center">
            <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
            <span>Access to analytics and reporting dashboard</span>
          </li>
          <li className="flex items-center">
            <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
            <span>Priority implementation support</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={onNext}>
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const CustomizeStep = ({ customer, onNext, onBack }: { customer: any; onNext: () => void; onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenTool className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Customize Your Widget</h2>
        <p className="text-gray-600 mt-2">
          Let's set up your subscription widget to match your brand and service plans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Your Widget</CardTitle>
            <CardDescription>Match your company colors and style</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Set your company name and logo</span>
              </li>
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Choose primary and accent colors</span>
              </li>
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Customize text and descriptions</span>
              </li>
            </ul>
            <Link href="/customize">
              <Button className="w-full mt-4">Customize Branding</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Configure Service Plans</CardTitle>
            <CardDescription>Set up your subscription options</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Define your service plans and tiers</span>
              </li>
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Set pricing for monthly/annual options</span>
              </li>
              <li className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span>Add features and benefits for each plan</span>
              </li>
            </ul>
            <Link href="/configure-plans">
              <Button className="w-full mt-4">Configure Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-3">Get inspiration from these examples:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
            <p className="text-sm font-medium">HVAC Example</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
            <p className="text-sm font-medium">Pest Control Example</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
            <p className="text-sm font-medium">Lawn Care Example</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="aspect-video bg-gray-100 rounded mb-2"></div>
            <p className="text-sm font-medium">Pool Service Example</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const EmbedStep = ({ customer, onNext, onBack }: { customer: any; onNext: () => void; onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Add Widget to Your Website</h2>
        <p className="text-gray-600 mt-2">
          Now let's add the widget to your website so customers can start subscribing.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Choose your installation method:</h3>
        
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Option 1: JavaScript Snippet (Recommended)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Add this code to your website where you want the widget to appear.
            </p>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
              {`<script 
  src="https://app.serviceplanpro.com/embed.js" 
  data-company="${customer?.companyName || 'Your Company Name'}"
  data-width="100%"
  data-height="800px">
</script>`}
            </div>
            <Button className="mt-4" variant="outline">
              Copy Code
            </Button>
          </div>
          
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Option 2: iFrame Embed</h4>
            <p className="text-sm text-gray-600 mb-3">
              Alternative method if you prefer to use an iframe.
            </p>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
              {`<iframe
  src="https://app.serviceplanpro.com/embed?company=${encodeURIComponent(customer?.companyName || 'Your Company Name')}"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>`}
            </div>
            <Button className="mt-4" variant="outline">
              Copy Code
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-1 flex items-center">
          <Coffee className="h-4 w-4 mr-2" />
          Need help with installation?
        </h4>
        <p className="text-sm text-gray-700">
          Our implementation team can help you add the widget to your website. 
          <Link href="/implementation-help">
            <span className="text-blue-600 ml-1 hover:underline">Schedule assistance</span>
          </Link>
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const LaunchStep = ({ customer, onComplete, onBack }: { customer: any; onComplete: () => void; onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">You're Ready to Launch!</h2>
        <p className="text-gray-600 mt-2">
          Your ServicePlan Pro widget is configured and ready to start accepting subscriptions.
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Your Launch Checklist:</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <CheckSquare className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Widget is customized with your branding</p>
              <p className="text-sm text-gray-600">Colors, logos, and text match your brand identity</p>
            </div>
          </li>
          <li className="flex items-start">
            <CheckSquare className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Service plans configured with pricing</p>
              <p className="text-sm text-gray-600">Plans and pricing set to match your service offerings</p>
            </div>
          </li>
          <li className="flex items-start">
            <CheckSquare className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Widget added to your website</p>
              <p className="text-sm text-gray-600">Embed code installed where customers can see it</p>
            </div>
          </li>
          <li className="flex items-start">
            <CheckSquare className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Payment processing connected</p>
              <p className="text-sm text-gray-600">Stripe integration ready to handle customer payments</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monitor Your Dashboard</CardTitle>
            <CardDescription>Track subscriptions and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Your dashboard gives you real-time insights into subscriptions, revenue, and customer data.
            </p>
            <Link href="/analytics">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Get Customer Support</CardTitle>
            <CardDescription>We're here to help you succeed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Have questions or need help? Our customer success team is ready to assist.
            </p>
            <Link href="/support">
              <Button variant="outline" className="w-full">Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default function WelcomeFlow() {
  const [, setLocation] = useLocation();
  const [customer, setCustomer] = useState({
    companyName: 'Premium Home Services',
    email: 'admin@premiumhomeservices.com',
    industry: 'HVAC'
  });
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { title: "Welcome", progress: 25 },
    { title: "Customize Widget", progress: 50 },
    { title: "Embed Widget", progress: 75 },
    { title: "Launch", progress: 100 }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleComplete = () => {
    // Redirect to dashboard after completion
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`text-sm font-medium ${
                  currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <Progress value={steps[currentStep - 1].progress} className="h-2" />
        </div>
        
        <Card>
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && (
              <WelcomeStep customer={customer} onNext={handleNext} />
            )}
            
            {currentStep === 2 && (
              <CustomizeStep customer={customer} onNext={handleNext} onBack={handleBack} />
            )}
            
            {currentStep === 3 && (
              <EmbedStep customer={customer} onNext={handleNext} onBack={handleBack} />
            )}
            
            {currentStep === 4 && (
              <LaunchStep customer={customer} onComplete={handleComplete} onBack={handleBack} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}