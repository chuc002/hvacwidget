import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Shield, Check } from 'lucide-react';
import WizardLayout from './WizardLayout';

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface PasswordStepProps {
  onNext: (data: { password: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function PasswordStep({ onNext, onBack, isLoading = false }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange'
  });

  const password = watch('password', '');

  // Password strength indicators
  const requirements = [
    { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
    { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
    { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
    { test: (p: string) => /[0-9]/.test(p), label: "One number" },
    { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "One special character" },
  ];

  const onSubmit = (data: PasswordForm) => {
    onNext({ password: data.password });
  };

  return (
    <WizardLayout
      currentStep={1}
      totalSteps={5}
      stepTitle="Secure Your Account"
      stepDescription="Create a strong password to protect your ServicePlan Pro account"
      onNext={handleSubmit(onSubmit)}
      onBack={onBack}
      nextLabel="Set Password"
      nextDisabled={!isValid}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to ServicePlan Pro!
          </h2>
          <p className="text-gray-600">
            Let's start by securing your account with a strong password
          </p>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register('password')}
              className={errors.password ? "border-red-500" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Password Requirements */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Password Requirements
            </h4>
            <div className="space-y-2">
              {requirements.map((req, index) => {
                const isValid = req.test(password);
                return (
                  <div key={index} className="flex items-center text-sm">
                    <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                      isValid ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {isValid && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={isValid ? 'text-green-700' : 'text-gray-600'}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Your security matters.</strong> We use industry-standard encryption 
                to protect your password and business data.
              </p>
            </div>
          </div>
        </div>
      </form>
    </WizardLayout>
  );
}