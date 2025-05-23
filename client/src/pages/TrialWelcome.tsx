import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TrialWelcome() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('welcome');

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to ServicePlan Pro!</h1>
        <p className="text-gray-600">Your 14-day free trial has started. Let's get you set up for success.</p>
      </div>

      <Tabs defaultValue="welcome" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="setup">Initial Setup</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="launch">Launch</TabsTrigger>
        </TabsList>

        <TabsContent value="welcome">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Your Trial</CardTitle>
              <CardDescription>
                We're excited to have you try ServicePlan Pro. Here's what you can expect during your 14-day trial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Full Access</h3>
                  <p className="text-sm text-gray-600">
                    You have complete access to all features during your trial period, including customization options.
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">14-Day Trial</h3>
                  <p className="text-sm text-gray-600">
                    Your trial lasts for 14 days with no obligation to continue after that period.
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">No Credit Card</h3>
                  <p className="text-sm text-gray-600">
                    We don't require payment information until you're ready to subscribe.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-3">What's Included in Your Trial:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Full featured subscription widget for your website</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Custom branding and service plan configuration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Analytics dashboard to track performance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Email notifications for new subscriptions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Customer subscription management tools</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold mb-2">Meet Your Success Manager</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="h-16 w-16 bg-gray-300 rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Your dedicated success manager</p>
                    <p className="text-sm mt-1">
                      <a href="mailto:support@serviceplanpro.com" className="text-blue-600 hover:underline">
                        support@serviceplanpro.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('setup')} className="ml-auto">
                Next: Initial Setup <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Initial Setup</CardTitle>
              <CardDescription>
                Let's get your account configured so you can start offering service plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Configure Your Service Plans</h3>
                    <p className="text-sm text-gray-600">Set up the maintenance plans you want to offer your customers</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Configure Plans
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Connect Your Stripe Account</h3>
                    <p className="text-sm text-gray-600">Connect to Stripe to process subscription payments</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Connect Stripe
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Customize Your Branding</h3>
                    <p className="text-sm text-gray-600">Add your logo and company colors to the widget</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Set Branding
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Add Team Members</h3>
                    <p className="text-sm text-gray-600">Invite your team to collaborate</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Invite Team
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-3">Configuration Tips:</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</span>
                    <span>Offer a basic, premium, and ultimate plan for best conversion rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</span>
                    <span>Consider offering both monthly and annual billing options with a discount for annual plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">?</span>
                    <span>Use your company's existing branding colors for a consistent customer experience</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('welcome')}>
                Back
              </Button>
              <Button onClick={() => setActiveTab('customize')}>
                Next: Customize <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="customize">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Customize Your Widget</CardTitle>
              <CardDescription>
                Make the widget match your brand and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Widget Preview</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Widget preview will appear here</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    This is how your subscription widget will look when embedded on your website.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Customization Options</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Brand Colors</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Plan Features</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Testimonials</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">FAQ Section</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Form Fields</span>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-6">
                    <h4 className="font-medium text-amber-800 mb-1">Pro Tip</h4>
                    <p className="text-sm text-amber-800">
                      Professional and Enterprise plans allow for more customization options, including custom domain and white-labeling.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('setup')}>
                Back
              </Button>
              <Button onClick={() => setActiveTab('launch')}>
                Next: Launch <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="launch">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Launch Your Widget</CardTitle>
              <CardDescription>
                You're ready to start accepting subscription sign-ups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
                <p className="text-gray-600 mb-4">
                  Your ServicePlan Pro widget is ready to be embedded on your website.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-semibold">Embed Your Widget</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {`<script 
  src="https://app.serviceplanpro.com/embed.js" 
  data-company="Your Company Name"
  data-width="100%"
  data-height="800px">
</script>`}
                </div>
                <p className="text-sm text-gray-600">
                  Copy this code and paste it into your website where you want the subscription widget to appear.
                </p>
                <Button className="w-full sm:w-auto">
                  Copy Embed Code
                </Button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">View Your Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p>Access your analytics, manage subscriptions, and update settings</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full" onClick={() => setLocation('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Preview Your Widget</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p>See exactly how your widget will look to customers</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">
                      View Preview
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Get Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    <p>Have questions? Our support team is here to help you</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('customize')}>
                Back
              </Button>
              <Button onClick={() => setLocation('/dashboard')}>
                Go to Dashboard <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}