import { SaaSPlans, formatPrice, calculateAnnualSavings } from '@shared/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

export default function Pricing() {
  const [, setLocation] = useLocation();

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business size and needs. Start with a 14-day free trial to see the results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SaaSPlans.map((plan) => (
            <Card key={plan.tier} className={`relative ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <Badge className="bg-primary px-3 py-1 text-sm">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>
                  Perfect for {plan.tier === 'starter' ? 'small' : plan.tier === 'professional' ? 'growing' : 'large'} home service businesses
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold">{formatPrice(plan.monthlyCents)}</p>
                  <p className="text-gray-500">/month</p>
                  <p className="text-sm text-green-600 mt-1">
                    Annual: {formatPrice(plan.annualCents)} (Save {formatPrice(calculateAnnualSavings(plan.monthlyCents, plan.annualCents))})
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.isPopular ? 'default' : 'outline'}
                  onClick={() => setLocation('/register')}
                >
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Common Questions</h3>
          
          <div className="space-y-6 text-left mt-8">
            <div>
              <h4 className="font-semibold text-lg">Do I need a credit card to start the trial?</h4>
              <p className="text-gray-600">No, you can start your 14-day trial without providing payment information. We'll notify you before your trial ends.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">Can I change plans later?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">What happens after my trial ends?</h4>
              <p className="text-gray-600">At the end of your trial, you'll need to select a plan and provide payment details to continue using ServicePlan Pro.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">Is there a setup fee?</h4>
              <p className="text-gray-600">No, there are no setup fees or hidden costs. You only pay the advertised monthly subscription price.</p>
            </div>
          </div>
          
          <Button 
            className="mt-8" 
            size="lg" 
            onClick={() => setLocation('/register')}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}