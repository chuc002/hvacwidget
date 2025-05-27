import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, withAuth, useAuth } from "@/lib/authContext";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
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
import Register from "@/pages/Register";


import HowItWorks from "@/pages/HowItWorks";
import CustomerJourney from "@/pages/CustomerJourney";
import TrialRegistration from "@/pages/TrialRegistration";
import WelcomeFlow from "@/pages/WelcomeFlow";
import EnhancedWidgetDemo from "@/pages/EnhancedWidgetDemo";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Welcome from "@/pages/Welcome";
import { useState, useEffect } from 'react';
import Login from "@/pages/Login";
import LoginPage from "@/pages/LoginPage";
import ConversionOptimized from "@/pages/ConversionOptimized";
import { Loader2 } from 'lucide-react';

// Import legal pages
import LegalHub from "@/pages/legal";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import TermsOfService from "@/pages/legal/TermsOfService";
import RefundPolicy from "@/pages/legal/RefundPolicy";

// Import the new pages
import DashboardOverview from "@/pages/DashboardOverview";
import Features from "@/pages/Features";
import Industries from "@/pages/Industries";
import WidgetCustomizer from "@/pages/WidgetCustomizer";

// Protect dashboard and authenticated-only routes
const ProtectedDashboardOverview = withAuth(DashboardOverview);
const ProtectedCustomerDashboard = withAuth(CustomerDashboard);
const ProtectedAdmin = withAuth(Admin);



// Router with protected routes
function Router() {
  // Track page views when routes change
  useAnalytics();
  
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
      <Route path="/register" component={Register} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/features" component={Features} />
      <Route path="/industries" component={Industries} />
      <Route path="/customer-journey" component={CustomerJourney} />
      <Route path="/trial-registration" component={TrialRegistration} />
      <Route path="/welcome-flow" component={WelcomeFlow} />
      <Route path="/enhanced-widget-demo" component={EnhancedWidgetDemo} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/customer-login" component={LoginPage} />
      <Route path="/conversion-optimized" component={ConversionOptimized} />
      
      {/* Legal Routes */}
      <Route path="/legal" component={LegalHub} />
      <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
      <Route path="/legal/terms-of-service" component={TermsOfService} />
      <Route path="/legal/refund-policy" component={RefundPolicy} />
      
      {/* Protected Routes */}
      <Route path="/admin" component={ProtectedAdmin} />
      <Route path="/dashboard" component={ProtectedDashboardOverview} />
      <Route path="/customer-dashboard" component={ProtectedDashboardOverview} />
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
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
      console.log('Google Analytics initialized with ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }, []);

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
