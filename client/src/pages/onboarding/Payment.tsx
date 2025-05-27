import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { SaaSPlans, formatPrice, calculateMonthlyFromAnnual } from '@shared/pricing';
import WizardLayout from './WizardLayout';

interface PaymentStepProps {
  onNext: (data: { paymentMethodId?: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
  selectedPlan: {
    planTier: string;
    billingInterval: 'monthly' | 'annual';
  };
}

export default function PaymentStep({ 
  onNext, 
  onBack, 
  isLoading = false,
  selectedPlan 
}: PaymentStepProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const planData = SaaSPlans.find(plan => plan.tier === selectedPlan.planTier);
  
  if (!planData) {
    return <div>Plan not found</div>;
  }

  const price = selectedPlan.billingInterval === 'annual' 
    ? formatPrice(calculateMonthlyFromAnnual(planData.annualCents))
    : formatPrice(planData.monthlyCents);

  const totalPrice = selectedPlan.billingInterval === 'annual' 
    ? formatPrice(planData.annualCents)
    : formatPrice(planData.monthlyCents);

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    try {
      // In a real implementation, this would:
      // 1. Create Stripe customer
      // 2. Set up payment method
      // 3. Create subscription
      // 4. Handle success/error
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('success');
      
      // Continue to next step after brief delay
      setTimeout(() => {
        onNext({ paymentMethodId: 'pm_mock_payment_method' });
      }, 1000);
      
    } catch (error) {
      setPaymentStatus('error');
    }
  };

  return (
    <WizardLayout
      currentStep={4}
      totalSteps={5}
      stepTitle="Complete Your Setup"
      stepDescription="Secure payment processing to start collecting maintenance plan subscriptions"
      onNext={paymentStatus === 'success' ? () => onNext({}) : handlePayment}
      onBack={onBack}
      nextLabel={
        paymentStatus === 'processing' ? 'Processing...' :
        paymentStatus === 'success' ? 'Complete Setup' :
        'Start Subscription'
      }
      nextDisabled={paymentStatus === 'processing'}
      isLoading={isLoading || paymentStatus === 'processing'}
    >
      <div className="space-y-8">
        {/* Payment Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Secure Payment Setup
          </h2>
          <p className="text-gray-600">
            Complete your ServicePlan Pro subscription to start selling maintenance plans
          </p>
        </div>

        {/* Order Summary */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold capitalize">{planData.name} Plan</h4>
                <p className="text-sm text-gray-600">
                  Billed {selectedPlan.billingInterval}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {price}/month
                </div>
                {selectedPlan.billingInterval === 'annual' && (
                  <div className="text-sm text-gray-600">
                    ({totalPrice} annually)
                  </div>
                )}
              </div>
            </div>

            {selectedPlan.billingInterval === 'annual' && (
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm">Annual Savings</span>
                <span className="text-sm font-semibold">
                  Save {formatPrice((planData.monthlyCents * 12) - planData.annualCents)}
                </span>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Today</span>
                <span>{totalPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedPlan.billingInterval === 'annual' 
                  ? 'Next billing: 1 year from today'
                  : 'Next billing: 1 month from today'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Your ServicePlan Pro subscription is active.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Payment failed. Please try again or contact support.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'processing' && (
          <Alert className="border-blue-200 bg-blue-50">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <AlertDescription className="text-blue-800">
              Processing your payment securely...
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Method (Mock UI) */}
        {paymentStatus === 'idle' && (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Stripe Payment Integration
              </h3>
              <p className="text-gray-600 mb-4">
                Secure payment processing will be handled by Stripe when you click "Start Subscription"
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>💳 All major cards accepted</span>
                <span>🔒 256-bit SSL encryption</span>
                <span>✅ PCI compliant</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Features Reminder */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-900 mb-3">
              What you get with {planData.name}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
              {planData.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-1">Secure & Protected</p>
            <p className="text-gray-600">
              Your payment information is encrypted and processed securely by Stripe. 
              We never store your card details on our servers.
            </p>
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>30-day money-back guarantee.</strong> Not satisfied? Get a full refund within 30 days.
          </p>
        </div>
      </div>
    </WizardLayout>
  );
}