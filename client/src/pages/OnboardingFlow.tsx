import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Settings, Code, Rocket } from "lucide-react";
import EnhancedCustomizationForm from "@/components/EnhancedCustomizationForm";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface CustomerData {
  id: number;
  name: string;
  email: string;
  companyName?: string;
  companyUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  isTrialUser: boolean;
  trialEndsAt?: string;
  onboardingCompleted: boolean;
}

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch current customer data
  const { data: customer, isLoading: customerLoading } = useQuery<CustomerData>({
    queryKey: ["/api/customer/me"],
    enabled: true,
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/customer/customization", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      toast({
        title: "Customization saved!",
        description: "Your widget has been customized successfully.",
      });
      handleNextStep();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save customization",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/customer/complete-onboarding");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      toast({
        title: "Welcome to ServicePlan Pro!",
        description: "Your setup is complete. You can now embed your widget!",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to complete onboarding",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome",
      description: "Get started with ServicePlan Pro",
      icon: <CheckCircle className="h-5 w-5" />,
      completed: true,
    },
    {
      id: "customize",
      title: "Customize",
      description: "Brand your widget to match your company",
      icon: <Settings className="h-5 w-5" />,
      completed: currentStep > 1,
    },
    {
      id: "embed",
      title: "Embed",
      description: "Add the widget to your website",
      icon: <Code className="h-5 w-5" />,
      completed: currentStep > 2,
    },
    {
      id: "launch",
      title: "Launch",
      description: "Start accepting subscriptions",
      icon: <Rocket className="h-5 w-5" />,
      completed: currentStep > 3,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      completeOnboardingMutation.mutate();
    }
  };

  const handleCustomizationSubmit = (data: any) => {
    updateCustomerMutation.mutate(data);
  };

  if (customerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If onboarding is already completed, redirect to dashboard
  if (customer?.onboardingCompleted) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to ServicePlan Pro</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Let's set up your subscription widget in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Setup Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mt-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary bg-background"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <Card>
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    Welcome{customer?.name ? `, ${customer.name}` : ""}!
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    You're just a few steps away from having a fully customized subscription widget 
                    for your {customer?.companyName || "home service business"}.
                  </p>
                  
                  {customer?.isTrialUser && customer?.trialEndsAt && (
                    <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-blue-800 dark:text-blue-200">
                        <strong>Free Trial Active</strong> - Your trial expires on{" "}
                        {new Date(customer.trialEndsAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get Started
                  <Rocket className="ml-2 h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <EnhancedCustomizationForm
              initialData={{
                companyName: customer?.companyName || "",
                companyUrl: customer?.companyUrl || "",
                logoUrl: customer?.logoUrl || "",
                primaryColor: customer?.primaryColor || "#2563eb",
                secondaryColor: customer?.secondaryColor,
                accentColor: customer?.accentColor,
                textColor: customer?.textColor,
                backgroundColor: customer?.backgroundColor,
                defaultSelectedPlan: "professional",
                showPricesOnWidget: true,
              }}
              onSubmit={handleCustomizationSubmit}
              isLoading={updateCustomerMutation.isPending}
            />
          )}

          {currentStep === 2 && (
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Embed Your Widget</h2>
                  <p className="text-muted-foreground">
                    Copy and paste this code into your website where you want the subscription widget to appear.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<script src="${window.location.origin}/embed.js"></script>
<div data-serviceplan-widget data-customer-id="${customer?.id}"></div>`}</code>
                  </pre>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    I've Added the Code
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">You're All Set!</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your ServicePlan Pro widget is ready to start accepting subscriptions. 
                    You can now view your dashboard to monitor performance.
                  </p>
                </div>

                <button
                  onClick={() => completeOnboardingMutation.mutate()}
                  disabled={completeOnboardingMutation.isPending}
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {completeOnboardingMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Completing Setup...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <Rocket className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}