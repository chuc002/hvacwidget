import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, withAuth, useAuth } from "@/lib/authContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Widget from "@/pages/Widget";
import Success from "@/pages/Success";
import Cancel from "@/pages/Cancel";
import Landing from "@/pages/Landing";
import Embed from "@/pages/Embed";
import Layout from "@/components/Layout";
import Pricing from "@/pages/Pricing";
import SimplePricing from "@/pages/SimplePricing";
import Register from "@/pages/Register";
import Demo from "@/pages/Demo";
import Analytics from "@/pages/Analytics";
import HowItWorks from "@/pages/HowItWorks";
import CustomerJourney from "@/pages/CustomerJourney";
import TrialRegistration from "@/pages/TrialRegistration";
import WelcomeFlow from "@/pages/WelcomeFlow";
import EnhancedWidgetDemo from "@/pages/EnhancedWidgetDemo";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Welcome from "@/pages/Welcome";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Import the new dashboard pages
import DashboardOverview from "@/pages/DashboardOverview";

// Protect dashboard and authenticated-only routes
const ProtectedDashboardOverview = withAuth(DashboardOverview);
const ProtectedCustomerDashboard = withAuth(CustomerDashboard);
const ProtectedAnalytics = withAuth(Analytics);
const ProtectedAdmin = withAuth(Admin);

// Login page component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        setLocation('/dashboard');
      } else {
        setError('Invalid email or password. Hint: Use demo@example.com / password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-md space-y-6 p-8 border rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to ServicePlan Pro</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <a href="/trial-registration" className="text-primary hover:underline">
              Start a free trial
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Router with protected routes
function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/widget" component={Widget} />
      <Route path="/subscribe/:token" component={Widget} />
      <Route path="/success" component={Success} />
      <Route path="/cancel" component={Cancel} />
      <Route path="/landing" component={Landing} />
      <Route path="/embed" component={Embed} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/simple-pricing" component={SimplePricing} />
      <Route path="/register" component={Register} />
      <Route path="/demo" component={Demo} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/customer-journey" component={CustomerJourney} />
      <Route path="/trial-registration" component={TrialRegistration} />
      <Route path="/welcome-flow" component={WelcomeFlow} />
      <Route path="/enhanced-widget-demo" component={EnhancedWidgetDemo} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      
      {/* Protected Routes */}
      <Route path="/admin" component={ProtectedAdmin} />
      <Route path="/dashboard" component={ProtectedDashboardOverview} />
      <Route path="/customer-dashboard" component={ProtectedDashboardOverview} />
      <Route path="/analytics" component={ProtectedAnalytics} />
      <Route path="/customize" component={withAuth(() => <div className="container py-8"><h1 className="text-2xl font-bold">Widget Customization</h1></div>)} />
      <Route path="/revenue" component={withAuth(() => <div className="container py-8"><h1 className="text-2xl font-bold">Revenue Streams</h1></div>)} />
      <Route path="/customers" component={withAuth(() => <div className="container py-8"><h1 className="text-2xl font-bold">Customer Management</h1></div>)} />
      <Route path="/billing" component={withAuth(() => <div className="container py-8"><h1 className="text-2xl font-bold">Billing & Plan</h1></div>)} />
      <Route path="/support" component={withAuth(() => <div className="container py-8"><h1 className="text-2xl font-bold">Support Center</h1></div>)} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
