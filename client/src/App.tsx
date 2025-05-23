import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
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
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
