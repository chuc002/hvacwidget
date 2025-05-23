import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

export default function TrialRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    industry: '',
    website: '',
    
    // Contact Info  
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Business Details
    currentCustomers: '',
    currentRevenue: '',
    hasExistingSubscriptions: false,
    
    // Trial Preferences
    wantsDemo: false,
    implementationHelp: false
  });

  const industries = [
    'Pest Control', 'Lawn Care', 'HVAC Services', 'Pool Service', 
    'Cleaning Services', 'Security Systems', 'Handyman Services', 'Other'
  ];

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      toast({
        title: "Registration Complete!",
        description: "Welcome to ServicePlan Pro. We're setting up your trial account...",
      });
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/customers/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulating success response for demo
      setTimeout(() => {
        // Redirect to welcome flow
        setLocation('/welcome-flow');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Start Your Free Trial</h1>
          <p className="text-gray-600">Get your subscription widget live in under 24 hours</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Step {step} of 3</CardTitle>
              <Progress value={(step / 3) * 100} className="w-32" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Tell us about your business</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Company Name *</label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="ABC Pest Control"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Industry *</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://abcpest.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Approximate Monthly Revenue</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={formData.currentRevenue}
                      onChange={(e) => setFormData({...formData, currentRevenue: e.target.value})}
                    >
                      <option value="">Select Range</option>
                      <option value="0-10k">$0 - $10,000</option>
                      <option value="10k-50k">$10,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Current Customers</label>
                    <Input
                      value={formData.currentCustomers}
                      onChange={(e) => setFormData({...formData, currentCustomers: e.target.value})}
                      placeholder="Approximately how many?"
                    />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full" disabled={!formData.companyName || !formData.industry}>
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">Business Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@abcpest.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Do you currently sell subscription services?</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSubscriptions"
                        checked={formData.hasExistingSubscriptions === false}
                        onChange={() => setFormData({...formData, hasExistingSubscriptions: false})}
                        className="mr-2"
                      />
                      No, this would be new for us
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasSubscriptions"
                        checked={formData.hasExistingSubscriptions === true}
                        onChange={() => setFormData({...formData, hasExistingSubscriptions: true})}
                        className="mr-2"
                      />
                      Yes, we have manual subscription processes
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handlePrev} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1" disabled={!formData.firstName || !formData.email || !formData.phone}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">How can we help you succeed?</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.wantsDemo}
                        onChange={(e) => setFormData({...formData, wantsDemo: e.target.checked})}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <div className="font-semibold">Schedule a personal demo</div>
                        <div className="text-sm text-gray-600">15-minute walkthrough of your customized widget</div>
                      </div>
                    </label>
                  </div>

                  <div className="border rounded-lg p-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.implementationHelp}
                        onChange={(e) => setFormData({...formData, implementationHelp: e.target.checked})}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <div className="font-semibold">Implementation assistance</div>
                        <div className="text-sm text-gray-600">Help adding the widget to your website</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Instant access to your customization dashboard</li>
                    <li>• 14-day free trial starts immediately</li>
                    <li>• Setup wizard guides you through configuration</li>
                    <li>• Widget can be live on your site in under 1 hour</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handlePrev} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                    Start My Free Trial
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          14-day free trial • No credit card required • Cancel anytime
        </div>
      </div>
    </div>
  );
}