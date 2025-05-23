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
import Login from "@/pages/Login";
import { Loader2 } from 'lucide-react';

// Import the new pages
import DashboardOverview from "@/pages/DashboardOverview";
import Features from "@/pages/Features";
import CaseStudies from "@/pages/CaseStudies";
import Industries from "@/pages/Industries";

// Protect dashboard and authenticated-only routes
const ProtectedDashboardOverview = withAuth(DashboardOverview);
const ProtectedCustomerDashboard = withAuth(CustomerDashboard);
const ProtectedAnalytics = withAuth(Analytics);
const ProtectedAdmin = withAuth(Admin);



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
      <Route path="/features" component={Features} />
      <Route path="/industries" component={Industries} />
      <Route path="/case-studies" component={CaseStudies} />
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
