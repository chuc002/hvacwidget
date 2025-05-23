import { useState } from 'react';
import EnhancedSubscriptionWidget from '@/components/EnhancedSubscriptionWidget';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EnhancedWidgetDemo() {
  // Sample configuration for the enhanced widget
  const sampleConfig = {
    customerId: "12345",
    companyName: "Smith's HVAC Services",
    displayMode: "all-in-one" as const,
    
    subscriptionPlans: [
      {
        id: "basic-plan",
        name: "Basic Maintenance",
        description: "Essential maintenance for your home comfort systems",
        price: 29.99,
        interval: "month" as const,
        features: [
          "Seasonal tune-ups (2x per year)",
          "Filter replacements",
          "Priority scheduling",
          "25% discount on repairs"
        ],
        stripePriceId: "price_1RRfoCGdBJ6HrZFiH1nNPJ2n",
        category: "maintenance" as const,
        isPopular: false
      },
      {
        id: "premium-plan",
        name: "Premium Protection",
        description: "Comprehensive coverage for peace of mind",
        price: 59.99,
        interval: "month" as const,
        features: [
          "All Basic Maintenance features",
          "Priority emergency service",
          "Free diagnostic fees",
          "Parts & labor discounts (50%)",
          "Annual equipment inspection"
        ],
        stripePriceId: "price_1RRfoZGdBJ6HrZFi1tlrrdUS",
        category: "protection" as const,
        isPopular: true
      },
      {
        id: "ultimate-plan",
        name: "Ultimate Care",
        description: "Total protection with premium benefits",
        price: 99.99,
        interval: "month" as const,
        features: [
          "All Premium Protection features",
          "24/7 VIP emergency service",
          "Complete parts & labor coverage",
          "Annual equipment deep cleaning",
          "Smart thermostat monitoring",
          "Quarterly indoor air quality check"
        ],
        stripePriceId: "price_1RRfowGdBJ6HrZFiOeOXyO5P",
        category: "premium" as const,
        isPopular: false
      }
    ],
    
    products: [
      {
        id: "air-purifier",
        name: "Whole-Home Air Purifier",
        description: "Hospital-grade air purification system for your entire home",
        price: 899.99,
        category: "equipment" as const,
        image: "https://images.unsplash.com/photo-1605885971539-740e6a50c2b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        stripePriceId: "price_air_purifier_123",
        inStock: true,
        estimatedDelivery: "1-2 weeks"
      },
      {
        id: "premium-filter",
        name: "Premium HEPA Filter Pack",
        description: "Set of 4 premium HEPA filters with 6-month lifespan",
        price: 129.99,
        category: "supplies" as const,
        image: "https://images.unsplash.com/photo-1582820598533-0b290de4f7cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        stripePriceId: "price_filter_pack_456",
        inStock: true,
        estimatedDelivery: "3-5 days"
      },
      {
        id: "smart-thermostat",
        name: "Smart Wi-Fi Thermostat",
        description: "Programmable smart thermostat with mobile app control",
        price: 249.99,
        category: "equipment" as const,
        image: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        stripePriceId: "price_thermostat_789",
        inStock: true,
        requiresScheduling: true,
        estimatedDelivery: "1 week + professional installation"
      },
      {
        id: "uv-light",
        name: "UV Air Treatment System",
        description: "UV light system that kills airborne bacteria and viruses",
        price: 399.99,
        category: "add-ons" as const,
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        stripePriceId: "price_uv_system_101",
        inStock: false,
        estimatedDelivery: "Out of stock - backorder available"
      },
    ],
    
    invoicePayment: {
      enabled: true,
      customMessage: "Pay your invoice securely online for Smith's HVAC Services"
    },
    
    layout: "tabs" as const,
    defaultTab: "subscriptions" as const
  };

  // Sample JSX code for embedding the widget
  const embedJSXCode = `<EnhancedSubscriptionWidget 
  config={{
    customerId: "YOUR_CUSTOMER_ID",
    companyName: "Your Company Name",
    displayMode: "all-in-one",
    subscriptionPlans: [...],
    products: [...],
    invoicePayment: { enabled: true },
    layout: "tabs",
    defaultTab: "subscriptions"
  }} 
/>`;

  // Sample JavaScript embed code
  const embedJSCode = `<script src="https://service-plan-pro.replit.app/embed.js" 
  data-customer-id="YOUR_CUSTOMER_ID"
  data-company="Your Company Name" 
  data-display-mode="all-in-one"
  data-widget-type="enhanced">
</script>`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Multi-Revenue Widget System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your service business with our all-in-one revenue platform. Sell subscriptions, products, and accept invoice payments in one seamless widget.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Subscription Plans</h3>
              <p className="text-gray-600">Sell recurring service plans with different pricing tiers and features</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Product Sales</h3>
              <p className="text-gray-600">Offer equipment, supplies, and add-ons with seamless checkout</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Invoice Payments</h3>
              <p className="text-gray-600">Allow customers to pay their invoices directly online</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center">Live Widget Demo</h2>
          
          <EnhancedSubscriptionWidget config={sampleConfig} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">How to Add This Widget to Your Website</h2>
          
          <Tabs defaultValue="js">
            <TabsList className="mb-4">
              <TabsTrigger value="js">JavaScript Embed</TabsTrigger>
              <TabsTrigger value="jsx">React Component</TabsTrigger>
            </TabsList>
            
            <TabsContent value="js">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md mb-4">
                <pre className="whitespace-pre-wrap"><code>{embedJSCode}</code></pre>
              </div>
              <p className="text-gray-600">
                Copy this code and add it to your website where you want the widget to appear. Customize the data attributes to match your business needs.
              </p>
            </TabsContent>
            
            <TabsContent value="jsx">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md mb-4">
                <pre className="whitespace-pre-wrap"><code>{embedJSXCode}</code></pre>
              </div>
              <p className="text-gray-600">
                If you're using React, you can integrate the widget as a component. Import it and pass your custom configuration.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Ready to Boost Your Revenue?</h2>
          
          <p className="text-center text-lg text-gray-600 mb-8">
            Start selling subscriptions, products, and accepting invoice payments with one powerful widget.
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="py-6 px-10 text-lg mr-4"
              onClick={() => window.location.href = '/trial-registration'}
            >
              Start Your Free Trial
            </Button>
            
            <Button 
              variant="outline"
              className="py-6 px-10 text-lg"
              onClick={() => window.location.href = '/book-demo'}
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}