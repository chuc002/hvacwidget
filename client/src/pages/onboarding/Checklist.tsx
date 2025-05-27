import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Sparkles, Target, Zap, Users } from 'lucide-react';
import { Link } from 'wouter';
import WizardLayout from './WizardLayout';

interface ChecklistStepProps {
  onComplete: () => void;
  businessData: {
    companyName: string;
    industry: string;
  };
  selectedPlan: {
    planTier: string;
    billingInterval: 'monthly' | 'annual';
  };
}

export default function ChecklistStep({ 
  onComplete, 
  businessData,
  selectedPlan 
}: ChecklistStepProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const checklistItems = [
    { 
      id: 1, 
      title: 'Account Created', 
      description: 'Your ServicePlan Pro account is ready',
      icon: CheckCircle,
      completed: true
    },
    { 
      id: 2, 
      title: 'Business Profile Setup', 
      description: `${businessData.companyName} profile configured`,
      icon: Target,
      completed: true
    },
    { 
      id: 3, 
      title: 'Subscription Active', 
      description: `${selectedPlan.planTier} plan activated`,
      icon: Zap,
      completed: true
    },
    { 
      id: 4, 
      title: 'Dashboard Access', 
      description: 'Full platform access enabled',
      icon: Users,
      completed: false,
      delay: 1000
    }
  ];

  // Simulate completion of remaining steps
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedSteps([4]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      title: 'Customize Your Widget',
      description: 'Design maintenance plans that match your services',
      action: 'Start Customizing',
      href: '/customize',
      priority: 'high'
    },
    {
      title: 'Connect Payment Processing',
      description: 'Link your bank account to receive payments directly',
      action: 'Setup Payments',
      href: '/payment-setup',
      priority: 'high'
    },
    {
      title: 'Add Widget to Website',
      description: 'Get the embed code and start collecting subscriptions',
      action: 'Get Embed Code',
      href: '/customize',
      priority: 'medium'
    }
  ];

  const isItemCompleted = (itemId: number) => {
    return checklistItems.find(item => item.id === itemId)?.completed || 
           completedSteps.includes(itemId);
  };

  return (
    <WizardLayout
      currentStep={5}
      totalSteps={5}
      stepTitle="Welcome to ServicePlan Pro!"
      stepDescription={`${businessData.companyName} is ready to start selling maintenance plans`}
      onNext={onComplete}
      nextLabel="Enter Dashboard"
      nextDisabled={false}
    >
      <div className="space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🎉 Setup Complete!
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your ServicePlan Pro account is ready. You can now start selling maintenance plans 
            and growing your recurring revenue.
          </p>
        </div>

        {/* Setup Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Setup Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklistItems.map((item) => {
              const Icon = item.icon;
              const completed = isItemCompleted(item.id);
              
              return (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-sm ${
                      completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  {completed && (
                    <Badge className="bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Your Account Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Company:</span>
                <span className="ml-2 font-medium text-blue-900">{businessData.companyName}</span>
              </div>
              <div>
                <span className="text-blue-700">Industry:</span>
                <span className="ml-2 font-medium text-blue-900 capitalize">{businessData.industry}</span>
              </div>
              <div>
                <span className="text-blue-700">Plan:</span>
                <span className="ml-2 font-medium text-blue-900 capitalize">{selectedPlan.planTier}</span>
              </div>
              <div>
                <span className="text-blue-700">Billing:</span>
                <span className="ml-2 font-medium text-blue-900 capitalize">{selectedPlan.billingInterval}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    {step.priority === 'high' && (
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <Link href={step.href}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    {step.action}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help Getting Started?</h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you succeed with ServicePlan Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/support">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              Schedule Demo Call
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">
            🚀 Ready to Grow Your Business
          </h3>
          <p className="text-green-800">
            You're all set to start selling maintenance plans and building recurring revenue. 
            Welcome to the ServicePlan Pro community!
          </p>
        </div>
      </div>
    </WizardLayout>
  );
}