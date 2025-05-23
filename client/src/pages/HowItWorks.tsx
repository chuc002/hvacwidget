import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Pencil, Code, Rocket, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Sign Up",
      time: "5 minutes",
      description: "Choose your plan, customize your widget to match your branding and service offerings.",
      icon: Pencil,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Embed Code",
      time: "2 minutes",
      description: "Copy and paste a single line of code onto your website. No developer skills required.",
      icon: Code,
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Go Live",
      time: "Instant",
      description: "Customers can begin subscribing to your maintenance plans immediately. No delays.",
      icon: Rocket,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Grow Revenue",
      time: "Ongoing",
      description: "Track analytics, optimize your offerings, and watch your recurring revenue grow.",
      icon: TrendingUp,
      color: "bg-amber-100 text-amber-700"
    },
  ];

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          From Setup to Success in 4 Simple Steps
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ServicePlan Pro makes selling maintenance plans seamless for your business.
          Here's how to get started in just minutes.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block" />
        
        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="md:grid md:grid-cols-2 md:gap-8 items-center">
              {/* Content */}
              <div className={index % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2 justify-start md:justify-end">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {/* Icon */}
              <div className={`relative flex ${index % 2 === 0 ? "md:order-2 justify-start" : "justify-end"}`}>
                <div className="z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-md border border-gray-100 bg-white">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                {/* Connector Line (horizontal) */}
                <div className={`absolute top-1/2 transform -translate-y-1/2 w-1/2 h-0.5 bg-gray-200 hidden md:block ${index % 2 === 0 ? "right-8" : "left-8"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Easy to Implement</h3>
                <p className="text-sm text-muted-foreground">
                  No technical skills required. Simply copy and paste a single line of code.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Start collecting subscriptions immediately after embedding. No waiting periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in Stripe integration provides safe, reliable payment processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial */}
      <div className="bg-primary/5 rounded-lg p-8 relative">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
          <div>
            <p className="italic text-lg mb-4">
              "We implemented ServicePlan Pro in less than 10 minutes. Our first subscription came in that same day. 
              Six months later, we've added over $30,000 in monthly recurring revenue."
            </p>
            <div>
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-muted-foreground">Premium Home Services</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -left-4 text-6xl text-primary/20">"</div>
      </div>

      {/* FAQ Mini Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Common Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Do I need to know how to code?</h3>
            <p className="text-sm text-muted-foreground">
              No technical skills are required. We provide a simple embed code that works on any website platform.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How long until I see results?</h3>
            <p className="text-sm text-muted-foreground">
              Most businesses get their first subscription within days of implementing ServicePlan Pro.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Can I customize the appearance?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can match your branding with custom colors, logos, and messaging.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What if I need help?</h3>
            <p className="text-sm text-muted-foreground">
              Our support team is available to help you get set up and optimize your results.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Ready to transform your business?</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Start your free 14-day trial today. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/trial-registration">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/demo">See Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}