import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Shield, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const registerSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: ''
    }
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your ServicePlan Pro account."
        });
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/register', data);
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Account created!",
          description: "Welcome to ServicePlan Pro. Your account has been created successfully."
        });
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Unable to create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Hero Content */}
        <div className="space-y-8 text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ServicePlan Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Professional maintenance plan management for home service businesses
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Enterprise-Grade Platform</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Designed for HVAC, pest control, lawn care, and pool maintenance companies
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Bank-Level Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced encryption and secure payment processing with Stripe
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Multi-Revenue Widget</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Subscriptions, products, and invoice payments in one unified system
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Trusted by home service professionals
            </p>
            <div className="flex items-center space-x-4 text-sm font-medium text-gray-900 dark:text-white">
              <span>✓ 99.9% Uptime</span>
              <span>✓ 24/7 Support</span>
              <span>✓ SOC 2 Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Sign in to your ServicePlan Pro account' 
                  : 'Start your 30-day free trial today'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@hvaccompany.com" 
                              type="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your password" 
                              type="password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ABC HVAC Services" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@hvaccompany.com" 
                              type="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              type="tel"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Create a secure password" 
                              type="password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Start free trial'
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              <div className="text-center">
                <Link href="/">
                  <a className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                    ← Back to homepage
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}