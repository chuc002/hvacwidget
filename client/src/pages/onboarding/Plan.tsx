import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Rocket, Star } from 'lucide-react';
import { SaaSPlans, formatPrice, calculateMonthlyFromAnnual, calculateAnnualSavings } from '@shared/pricing';
import WizardLayout from './WizardLayout';

interface PlanStepProps {
  onNext: (data: { planTier: string; billingInterval: 'monthly' | 'annual' }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function PlanStep({ onNext, onBack, isLoading = false }: PlanStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');

  const planIcons = {
    starter: Zap,
    professional: Crown,
    enterprise: Rocket
  };

  const planFeatures = {
    starter: [
      'Basic subscription widget',
      'Up to 100 customers/month',
      'Email support',
      'Basic analytics',
      'Mobile-responsive widgets'
    ],
    professional: [
      'Advanced customization',
      'Up to 500 customers/month',
      'Priority email support',
      'Advanced analytics & reports',
      'Multiple widget designs',
      'Custom branding',
      'A/B testing tools'
    ],
    enterprise: [
      'White-label solution',
      'Unlimited customers',
      'Dedicated account manager',
      'Advanced integrations',
      'Custom development',
      'Priority phone support',
      'Multi-location management',
      'API access'
    ]
  };

  const handlePlanSelect = (planTier: string) => {
    setSelectedPlan(planTier);
  };

  const handleContinue = () => {
    onNext({ planTier: selectedPlan, billingInterval });
  };

  const selectedPlanData = SaaSPlans.find(plan => plan.tier === selectedPlan);
  const annualSavings = selectedPlanData ? calculateAnnualSavings(selectedPlanData.monthlyCents, selectedPlanData.annualCents) : 0;

  return (
    <WizardLayout
      currentStep={3}
      totalSteps={5}
      stepTitle="Choose Your Plan"
      stepDescription="Select the perfect ServicePlan Pro tier for your business growth"
      onNext={handleContinue}
      onBack={onBack}
      nextLabel="Continue to Payment"
      nextDisabled={!selectedPlan}
      isLoading={isLoading}
    >
      <div className="space-y-8">
        {/* Plan Benefits Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Star className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Start selling maintenance plans today
          </h2>
          <p className="text-gray-600">
            Choose the plan that fits your business size and growth goals
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <Button
              variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingInterval('monthly')}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingInterval('annual')}
              className="rounded-md"
            >
              Annual
              <Badge className="ml-2 bg-green-500">Save up to $2,000</Badge>
            </Button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SaaSPlans.map((plan) => {
            const Icon = planIcons[plan.tier as keyof typeof planIcons];
            const features = planFeatures[plan.tier as keyof typeof planFeatures];
            const isSelected = selectedPlan === plan.tier;
            const isProfessional = plan.tier === 'professional';
            
            const price = billingInterval === 'annual' 
              ? formatPrice(calculateMonthlyFromAnnual(plan.annualCents))
              : formatPrice(plan.monthlyCents);

            const annualSavings = calculateAnnualSavings(plan.monthlyCents, plan.annualCents);

            return (
              <Card
                key={plan.tier}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md border-gray-200'
                } ${isProfessional ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => handlePlanSelect(plan.tier)}
              >
                {isProfessional && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      isProfessional ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        isProfessional ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl capitalize">{plan.name}</CardTitle>
                  
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {price}
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    {billingInterval === 'annual' && annualSavings > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {formatPrice(annualSavings)} annually
                      </p>
                    )}
                    {billingInterval === 'annual' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Billed annually ({formatPrice(plan.annualCents)})
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : isProfessional 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                    onClick={() => handlePlanSelect(plan.tier)}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Plan Comparison Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Perfect for growing businesses:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Start with any plan and upgrade as you grow</li>
            <li>• All plans include core subscription widget functionality</li>
            <li>• 30-day money-back guarantee on all plans</li>
            <li>• Cancel or change plans anytime</li>
          </ul>
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900 capitalize">
                  {selectedPlanData?.name} Plan Selected
                </h4>
                <p className="text-blue-700 text-sm">
                  {billingInterval === 'annual' ? 'Billed annually' : 'Billed monthly'} • 
                  Cancel anytime
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  {selectedPlanData && formatPrice(
                    billingInterval === 'annual' 
                      ? calculateMonthlyFromAnnual(selectedPlanData.annualCents)
                      : selectedPlanData.monthlyCents
                  )}
                  <span className="text-sm font-normal">/month</span>
                </div>
                {billingInterval === 'annual' && annualSavings > 0 && (
                  <p className="text-sm text-green-600">
                    You save {formatPrice(annualSavings)}/year
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}