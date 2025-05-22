import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SubscriptionWidget from '@/components/SubscriptionWidget';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Phone, Mail, ArrowRight } from "lucide-react";

export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Sell HVAC Maintenance Plans Online - Get 300% More Customers
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Professional subscription widget that embeds on your website. Customers sign up instantly, you get paid automatically.
              </p>
              <Button 
                onClick={() => setDemoOpen(true)}
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg py-6 px-8"
              >
                See 2-Minute Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20">
                <img 
                  src="https://placehold.co/600x400/2563eb/FFFFFF/png?text=HVAC+Widget+Pro" 
                  alt="HVAC Widget Demo" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            The Problem With Traditional HVAC Plan Sales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Lost Opportunities</h3>
                <p className="text-gray-600 text-center">
                  Most HVAC companies lose 70% of potential maintenance customers because they can't sign up online
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Time & Money Waste</h3>
                <p className="text-gray-600 text-center">
                  Manual sign-ups cost you time and money with paperwork, follow-ups, and administrative overhead
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Customer Friction</h3>
                <p className="text-gray-600 text-center">
                  Customers want to subscribe instantly, not wait for business hours or deal with paperwork
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            The Modern Solution For HVAC Companies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Quick Setup</h3>
                <p className="text-gray-600 text-center">
                  Our widget embeds on your website in 5 minutes with a simple code snippet
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Easy Subscription</h3>
                <p className="text-gray-600 text-center">
                  Customers subscribe with just 3 clicks - select plan, enter info, and checkout
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Complete Data</h3>
                <p className="text-gray-600 text-center">
                  Get complete customer data instantly including address and service preferences
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Automatic Payments</h3>
                <p className="text-gray-600 text-center">
                  Stripe handles all payments automatically with secure subscription management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-800">
            Simple, Transparent Pricing
          </h2>
          
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full mb-4 font-medium">
                HVAC Widget Pro
              </div>
              <h3 className="text-4xl font-bold mb-2">$200<span className="text-xl text-gray-600 font-normal">/month</span></h3>
              <p className="text-gray-600 mb-8">Everything you need to sell maintenance plans online</p>
              
              <Separator className="my-6" />
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Professional widget setup and customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Secure cloud hosting and maintenance</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Stripe payment integration included</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Zapier integration for your CRM</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority technical support</span>
                </li>
              </ul>
              
              <div className="flex flex-col gap-4">
                <Button className="w-full py-6 text-lg">
                  Start 30-Day Free Trial
                </Button>
                <p className="text-sm text-gray-500">No credit card required. Cancel anytime.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This is the exact same widget your customers will see. Explore the features
              and try the subscription process with our test mode.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 border border-gray-200">
            <SubscriptionWidget companyName="Your HVAC Company" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Modernize Your HVAC Business?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Get started today and start seeing more maintenance plan subscriptions immediately.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-lg">(555) 123-4567</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-lg">sales@hvacwidgetpro.com</p>
            </div>
          </div>
          
          <div className="mt-16">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg py-6 px-8"
            >
              Schedule a Demo Call
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>See How It Works</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="bg-gray-800 rounded-md p-6 text-center text-white mb-6">
              <p className="text-lg mb-4">Demo Video</p>
              <div className="aspect-video bg-gray-700 flex items-center justify-center rounded">
                <p>Your HVAC Widget Demo Video</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2 text-center">1. Embed</h3>
                <p className="text-sm text-gray-600">Add a simple code snippet to your website</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2 text-center">2. Customize</h3>
                <p className="text-sm text-gray-600">Set your plans and pricing</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2 text-center">3. Profit</h3>
                <p className="text-sm text-gray-600">Start receiving subscriptions</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}