import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Building, Home, Droplet, Trash2, Palmtree, Waves, Wrench, Zap, Fan } from "lucide-react";

export default function Industries() {
  const industries = [
    {
      id: "hvac",
      name: "HVAC",
      icon: Fan,
      description: "Help HVAC businesses convert one-time service calls into ongoing maintenance agreements.",
      color: "bg-blue-100 text-blue-700",
      features: [
        "Annual, semi-annual, and quarterly tune-up plans",
        "Filter replacement subscriptions",
        "Priority service for plan members",
        "Discount pricing on repairs and parts"
      ],
      results: {
        customers: "165%",
        revenue: "$18,750",
        retention: "86%"
      }
    },
    {
      id: "plumbing",
      name: "Plumbing",
      icon: Droplet,
      description: "Enable plumbers to create recurring revenue through preventative maintenance plans.",
      color: "bg-sky-100 text-sky-700",
      features: [
        "Plumbing protection plans",
        "Annual water heater maintenance",
        "Pipe inspection and maintenance",
        "Water quality testing subscriptions"
      ],
      results: {
        customers: "120%",
        revenue: "$15,200",
        retention: "79%"
      }
    },
    {
      id: "pest",
      name: "Pest Control",
      icon: Trash2,
      description: "Transform one-time treatments into recurring pest prevention programs.",
      color: "bg-green-100 text-green-700",
      features: [
        "Quarterly and monthly treatment plans",
        "Termite protection subscriptions",
        "Rodent prevention programs",
        "Mosquito control seasonal plans"
      ],
      results: {
        customers: "208%",
        revenue: "$22,450",
        retention: "91%"
      }
    },
    {
      id: "lawn",
      name: "Lawn Care",
      icon: Palmtree,
      description: "Help lawn care companies smooth seasonal revenue with year-round plans.",
      color: "bg-lime-100 text-lime-700",
      features: [
        "Seasonal lawn treatment packages",
        "Weekly/bi-weekly mowing subscriptions",
        "Fertilization and weed control programs",
        "Snow removal winter add-ons"
      ],
      results: {
        customers: "145%",
        revenue: "$19,850",
        retention: "82%"
      }
    },
    {
      id: "pool",
      name: "Pool Service",
      icon: Waves,
      description: "Enable pool companies to offer comprehensive maintenance packages.",
      color: "bg-cyan-100 text-cyan-700",
      features: [
        "Weekly and monthly pool cleaning plans",
        "Chemical balancing subscriptions",
        "Equipment check-up packages",
        "Opening/closing seasonal services"
      ],
      results: {
        customers: "175%",
        revenue: "$24,600",
        retention: "88%"
      }
    },
    {
      id: "handyman",
      name: "Handyman",
      icon: Wrench,
      description: "Transform project-based work into regular home maintenance programs.",
      color: "bg-amber-100 text-amber-700",
      features: [
        "Quarterly home inspection plans",
        "Preventative maintenance packages",
        "Priority scheduling for members",
        "Discounted hourly rates for subscribers"
      ],
      results: {
        customers: "110%",
        revenue: "$12,800",
        retention: "75%"
      }
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: Zap,
      description: "Help electricians build recurring revenue with safety and maintenance plans.",
      color: "bg-yellow-100 text-yellow-700",
      features: [
        "Annual electrical safety inspections",
        "Surge protection monitoring",
        "Generator maintenance plans",
        "Smart home system check-ups"
      ],
      results: {
        customers: "125%",
        revenue: "$16,300",
        retention: "81%"
      }
    },
    {
      id: "cleaning",
      name: "Cleaning Services",
      icon: Home,
      description: "Streamline scheduling and billing for recurring cleaning services.",
      color: "bg-purple-100 text-purple-700",
      features: [
        "Weekly/bi-weekly cleaning subscriptions",
        "Deep cleaning quarterly add-ons",
        "Window cleaning packages",
        "Carpet cleaning annual plans"
      ],
      results: {
        customers: "195%",
        revenue: "$21,750",
        retention: "87%"
      }
    },
    {
      id: "commercial",
      name: "Commercial Maintenance",
      icon: Building,
      description: "Manage facility maintenance contracts for commercial properties.",
      color: "bg-slate-100 text-slate-700",
      features: [
        "Preventative maintenance programs",
        "Multi-location service plans",
        "Compliance inspection packages",
        "Equipment monitoring subscriptions"
      ],
      results: {
        customers: "135%",
        revenue: "$36,500",
        retention: "94%"
      }
    }
  ];

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Service Plan Solutions for Every Industry
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ServicePlan Pro powers subscription growth for home service businesses across all verticals.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <Card key={industry.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${industry.color}`}>
                    <industry.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold">{industry.name}</h2>
                </div>
                <p className="text-muted-foreground">{industry.description}</p>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Popular Plan Features:</h3>
                  <ul className="space-y-1">
                    {industry.features.map((feature, index) => (
                      <li key={index} className="text-sm flex gap-2 items-start">
                        <span className="text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t bg-muted/50 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Growth</p>
                    <p className="font-bold text-primary">{industry.results.customers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Monthly Revenue</p>
                    <p className="font-bold">{industry.results.revenue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="font-bold text-green-600">{industry.results.retention}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Specialized Solutions Section */}
      <div className="bg-primary/5 rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Customized for Your Business</h2>
          <p className="text-center mb-8 text-lg text-muted-foreground">
            ServicePlan Pro adapts to the unique needs of your industry with specialized features.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">1</span>
                  Industry-Specific Templates
                </h3>
                <p className="text-muted-foreground">
                  Pre-built plan templates designed specifically for your industry's common service offerings and pricing models.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">2</span>
                  Seasonal Flexibility
                </h3>
                <p className="text-muted-foreground">
                  Easily create and manage seasonal service plans with automatic scheduling and billing adjustments.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">3</span>
                  Service-Specific Features
                </h3>
                <p className="text-muted-foreground">
                  Collect and manage the exact customer information and property details needed for your service type.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">4</span>
                  Industry Benchmarks
                </h3>
                <p className="text-muted-foreground">
                  Compare your performance against industry-specific metrics to identify opportunities for growth.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">5</span>
                  Specialized Integrations
                </h3>
                <p className="text-muted-foreground">
                  Connect with the leading CRM and field service software used in your specific industry.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">6</span>
                  Customized Marketing
                </h3>
                <p className="text-muted-foreground">
                  Access industry-specific marketing materials and customer communication templates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Service Section */}
      <div className="border rounded-lg p-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h2 className="text-3xl font-bold">Offer Multiple Service Types?</h2>
          <p className="text-muted-foreground">
            ServicePlan Pro lets you manage subscriptions across all your service lines from a single platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-5 bg-muted/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
              Multi-Service Companies
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Perfect for businesses that offer HVAC, plumbing, electrical, and other services under one roof.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Unified customer database</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Bundle multiple services</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Cross-selling opportunities</span>
              </li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-5 bg-muted/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Building className="h-4 w-4" />
              </div>
              Residential & Commercial
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage different subscription models for residential customers and commercial clients.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Segment customer types</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Custom billing cycles</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Multi-location support</span>
              </li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-5 bg-muted/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              Franchise Operations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Specialized tools for franchise businesses with multiple locations and standardized offerings.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Territory management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Consistent branding</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Performance comparison</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Grow Your Service Business?</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Join hundreds of service companies using ServicePlan Pro to build recurring revenue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/trial-registration">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/demo">See Live Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}