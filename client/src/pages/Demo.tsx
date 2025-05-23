import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import SubscriptionWidget from '@/components/SubscriptionWidget';

export default function Demo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-medium">
            🎭 DEMO MODE - See ServicePlan Pro in Action
          </span>
          <div className="space-x-4">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setLocation('/register')}>
              Start Free Trial
            </Button>
            <Button variant="outline" className="bg-blue-700 text-white border-white hover:bg-blue-800" onClick={() => setLocation('/pricing')}>
              View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Widget */}
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 relative">
          {/* Watermark */}
          <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
            ServicePlan Pro Demo
          </div>
          
          <SubscriptionWidget 
            companyName="Premium Home Services" 
            customerId={0}
            isDemo={true}
          />
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Ready to boost your service business revenue?</h3>
          <p className="text-gray-600 mb-6">
            Add this subscription widget to your website and start converting visitors into recurring service customers immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => setLocation('/register')}>
              Start Free 14-Day Trial
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setLocation('/pricing')}>
              View Pricing Plans
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required to start your trial.</p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ServicePlan Pro Helps Your Business</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Increase Revenue</h3>
              <p className="text-gray-600">
                Convert one-time service calls into predictable monthly revenue with service plans that customers love.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Build Customer Loyalty</h3>
              <p className="text-gray-600">
                Ongoing service plans create lasting relationships and reduce customer churn through consistent engagement.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze Performance</h3>
              <p className="text-gray-600">
                Track plan performance, customer engagement, and optimize your offerings with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}