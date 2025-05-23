import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SimplePricing() {
  const [, setLocation] = useLocation();
  
  const handleStartTrial = () => {
    setLocation('/register');
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="text-center pt-8">
            <div className="bg-blue-100 text-blue-700 py-2 px-4 rounded-full text-sm font-medium inline-block">
              ServicePlan Pro
            </div>
            <div className="mt-6 mb-3">
              <span className="text-5xl font-bold">$200</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              Everything you need to sell service plans online
            </p>
            <hr className="border-gray-200 mx-8 mb-8" />
          </div>

          <div className="px-8 pb-4">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span>Professional widget setup and customization</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span>Secure cloud hosting and maintenance</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span>Stripe payment integration included</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span>Zapier integration for your CRM</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span>Priority technical support</span>
              </li>
            </ul>

            <Button 
              className="w-full py-6 text-lg mb-6" 
              onClick={handleStartTrial}
            >
              Start 30-Day Free Trial
            </Button>

            <p className="text-center text-gray-500 mb-8">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left mt-8">
          <div>
            <h3 className="font-semibold mb-2">Do I need a credit card to start?</h3>
            <p className="text-gray-600">No, you can start your 30-day trial without providing payment information.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What happens after my trial?</h3>
            <p className="text-gray-600">After 30 days, you'll need to enter payment details to continue using ServicePlan Pro.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I customize my widget?</h3>
            <p className="text-gray-600">Yes, you can fully customize the branding, colors, text, and plans offered.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How do payments work?</h3>
            <p className="text-gray-600">You connect your Stripe account, and payments from your customers go directly to you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}