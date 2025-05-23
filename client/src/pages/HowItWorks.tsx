import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How ServicePlan Pro Works
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              A step-by-step guide to implementing subscription revenue for your home service business
            </p>
          </div>
        </div>
      </section>

      {/* Overview Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple 3-Step Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running with recurring revenue in under an hour
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="relative">
                <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-blue-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
              <p className="text-gray-600">
                Sign up for a free trial and configure your service plans and pricing
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-blue-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Embed the Widget</h3>
              <p className="text-gray-600">
                Add our code snippet to your website in less than 5 minutes
              </p>
            </div>
            
            <div className="text-center">
              <div>
                <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Earning</h3>
              <p className="text-gray-600">
                Watch as customers subscribe and your recurring revenue grows
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 1 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
                <img 
                  src="https://placehold.co/600x400/e3f2fd/1e88e5/png?text=Create+Account+&+Configure" 
                  alt="Account Setup" 
                  className="rounded-lg mb-4 w-full"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="max-w-lg">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                    1
                  </div>
                  <h2 className="text-3xl font-bold">Create Your Account</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Sign up and configure your subscription service plans in minutes. Our guided setup helps you create the perfect pricing structure for your business.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Create your free account with a 14-day trial period</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Configure your service plans (Basic, Premium, Ultimate)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Set up monthly or annual billing options with discount incentives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Connect your Stripe account for payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Customize the widget to match your brand colors and style</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button size="lg">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 2 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-gray-50 p-6 rounded-xl shadow-lg max-w-md mx-auto">
                <img 
                  src="https://placehold.co/600x400/e8f5e9/2e7d32/png?text=Embed+Widget+Code" 
                  alt="Embed Widget" 
                  className="rounded-lg mb-4 w-full"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="max-w-lg">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                    2
                  </div>
                  <h2 className="text-3xl font-bold">Embed the Widget</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Add the ServicePlan Pro widget to your website with a simple code snippet. No technical expertise required - if you can copy and paste, you can do it.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Copy your unique widget code from your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Paste the code on your service plans or pricing page</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>No coding skills needed - works with any website platform</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Mobile-responsive design works on all devices</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>We provide personalized assistance if you need help</span>
                  </li>
                </ul>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
                  <p className="text-sm text-blue-700">
                    <strong>Pro tip:</strong> Our most successful customers place the widget prominently on their home page and service pages to maximize conversions.
                  </p>
                </div>
                <Link href="/demo">
                  <Button size="lg">
                    See Live Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 3 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
                <img 
                  src="https://placehold.co/600x400/fff3e0/f57c00/png?text=Track+Revenue+Growth" 
                  alt="Revenue Dashboard" 
                  className="rounded-lg mb-4 w-full"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="max-w-lg">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                    3
                  </div>
                  <h2 className="text-3xl font-bold">Start Earning</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Watch your recurring revenue grow as customers sign up for your service plans. Track performance and optimize with our analytics dashboard.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Customers can subscribe 24/7 without your intervention</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Automated billing handles recurring payments via Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Track subscriptions, revenue, and churn in real-time</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Get notified instantly when new customers subscribe</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>Export customer data to your CRM with one click</span>
                  </li>
                </ul>
                <Link href="/analytics">
                  <Button size="lg">
                    See Analytics Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about implementing ServicePlan Pro
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">How long does implementation take?</h3>
                <p className="text-gray-600">
                  Most customers complete the setup process in under an hour. The basic account setup takes about 10 minutes, 
                  and embedding the widget on your website takes less than 5 minutes. The rest of the time is spent customizing 
                  your service plans and branding to perfectly match your business needs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Do I need technical skills to use ServicePlan Pro?</h3>
                <p className="text-gray-600">
                  No technical skills are required. If you can copy and paste, you can implement our widget. 
                  We provide a simple code snippet that works with any website platform including WordPress, 
                  Wix, Squarespace, and custom-built sites. Our customer success team is also available to 
                  help if you need assistance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">How does the payment processing work?</h3>
                <p className="text-gray-600">
                  ServicePlan Pro integrates with Stripe for secure payment processing. Customer payments go 
                  directly to your Stripe account. We handle all the subscription logic, recurring billing, 
                  and customer management, while you maintain full control of your payment flow. You'll need 
                  to connect your Stripe account during setup, which takes just a few minutes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Can I customize the widget to match my brand?</h3>
                <p className="text-gray-600">
                  Absolutely! You can customize colors, fonts, text, and imagery to match your brand perfectly. 
                  Our Professional and Enterprise plans also offer advanced customization options including 
                  custom CSS, white-labeling, and domain mapping for a truly seamless experience.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Will it work with my existing CRM or software?</h3>
                <p className="text-gray-600">
                  Yes, ServicePlan Pro integrates with most popular CRM systems through our Zapier integration. 
                  This allows you to automatically sync new subscribers with systems like HubSpot, Salesforce, 
                  ServiceTitan, and more. Our Enterprise plan also offers custom API access for direct integrations 
                  with your proprietary systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Implement Subscription Revenue?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book-demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}