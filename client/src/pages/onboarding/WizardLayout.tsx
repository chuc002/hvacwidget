import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export default function WizardLayout({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  isLoading = false
}: WizardLayoutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Set Password", description: "Secure your account" },
    { number: 2, title: "Business Info", description: "Tell us about your company" },
    { number: 3, title: "Choose Plan", description: "Select your pricing tier" },
    { number: 4, title: "Payment", description: "Complete your setup" },
    { number: 5, title: "Get Started", description: "You're ready to go!" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="font-bold text-lg">ServicePlan Pro</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-xs ${
                    step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                      step.number <= currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="mt-1 hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{stepTitle}</h1>
            {stepDescription && (
              <p className="text-lg text-gray-600">{stepDescription}</p>
            )}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={onNext}
              disabled={nextDisabled || isLoading}
              className="flex items-center gap-2 min-w-32"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}