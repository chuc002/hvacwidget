import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import PasswordStep from './Password';
import BusinessInfoStep from './BusinessInfo';
import PlanStep from './Plan';
import PaymentStep from './Payment';
import ChecklistStep from './Checklist';

interface OnboardingData {
  password?: string;
  companyName?: string;
  industry?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  planTier?: string;
  billingInterval?: 'monthly' | 'annual';
  paymentMethodId?: string;
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handlePasswordNext = async (data: { password: string }) => {
    setIsLoading(true);
    try {
      // Save password and move to next step
      setOnboardingData(prev => ({ ...prev, ...data }));
      
      // In real implementation, this would create the user account
      await apiRequest('POST', '/api/onboarding/password', { password: data.password });
      
      setCurrentStep(2);
      toast({
        title: "Password Set",
        description: "Your account password has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessInfoNext = async (data: any) => {
    setIsLoading(true);
    try {
      setOnboardingData(prev => ({ ...prev, ...data }));
      
      // Save business information
      await apiRequest('POST', '/api/onboarding/business-info', data);
      
      setCurrentStep(3);
      toast({
        title: "Business Profile Created",
        description: "Your company information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save business information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanNext = (data: { planTier: string; billingInterval: 'monthly' | 'annual' }) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handlePaymentNext = async (data: { paymentMethodId?: string }) => {
    setIsLoading(true);
    try {
      setOnboardingData(prev => ({ ...prev, ...data }));
      
      // Create subscription and complete onboarding
      await apiRequest('POST', '/api/onboarding/complete-payment', {
        ...onboardingData,
        ...data
      });
      
      setCurrentStep(5);
      toast({
        title: "Payment Successful",
        description: "Your ServicePlan Pro subscription is now active!",
      });
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setIsLoading(true);
    try {
      // Mark onboarding as complete
      await apiRequest('POST', '/api/onboarding/complete');
      
      toast({
        title: "Welcome to ServicePlan Pro!",
        description: "Your account setup is complete. Redirecting to dashboard...",
      });
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render current step
  switch (currentStep) {
    case 1:
      return (
        <PasswordStep
          onNext={handlePasswordNext}
          onBack={handleBack}
          isLoading={isLoading}
        />
      );
    
    case 2:
      return (
        <BusinessInfoStep
          onNext={handleBusinessInfoNext}
          onBack={handleBack}
          isLoading={isLoading}
          initialData={onboardingData}
        />
      );
    
    case 3:
      return (
        <PlanStep
          onNext={handlePlanNext}
          onBack={handleBack}
          isLoading={isLoading}
        />
      );
    
    case 4:
      return (
        <PaymentStep
          onNext={handlePaymentNext}
          onBack={handleBack}
          isLoading={isLoading}
          selectedPlan={{
            planTier: onboardingData.planTier || 'professional',
            billingInterval: onboardingData.billingInterval || 'annual'
          }}
        />
      );
    
    case 5:
      return (
        <ChecklistStep
          onComplete={handleOnboardingComplete}
          businessData={{
            companyName: onboardingData.companyName || 'Your Company',
            industry: onboardingData.industry || 'home services'
          }}
          selectedPlan={{
            planTier: onboardingData.planTier || 'professional',
            billingInterval: onboardingData.billingInterval || 'annual'
          }}
        />
      );
    
    default:
      return <div>Invalid step</div>;
  }
}