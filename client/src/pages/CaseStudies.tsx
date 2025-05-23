import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowRight, Quote, TrendingUp, Users, DollarSign, CalendarDays } from "lucide-react";
import { useState } from "react";

export default function CaseStudies() {
  const [activeTab, setActiveTab] = useState("pest");

  const caseStudies = [
    {
      id: "pest",
      company: "ABC Pest Control",
      location: "Denver, CO",
      industry: "Pest Control",
      tagline: "From 50 to 300 monthly customers in 6 months",
      logo: "https://placehold.co/200x80?text=ABC+Pest",
      heroMetric: "500%",
      heroMetricLabel: "Customer Growth",
      result: "Grew recurring monthly revenue from $2,450 to $14,700 in just 6 months.",
      quote: "ServicePlan Pro transformed our business model. What used to be one-time services is now a consistent monthly revenue stream with much higher customer retention.",
      quoteAuthor: "Michael Johnson",
      quoteRole: "Operations Director, ABC Pest Control",
      challenges: [
        "Low customer retention with mostly one-time services",
        "Seasonal revenue fluctuations causing cash flow issues",
        "Manual booking process requiring phone calls",
        "No online presence or digital payment options"
      ],
      solution: [
        "Implemented ServicePlan Pro subscription widget on their website",
        "Created three tiered monthly maintenance plans",
        "Added quarterly and annual payment options",
        "Integrated with their CRM system for automated customer management"
      ],
      results: [
        { label: "Monthly Customers", before: "50", after: "300", icon: Users },
        { label: "Monthly Revenue", before: "$2,450", after: "$14,700", icon: DollarSign },
        { label: "Customer Retention", before: "23%", after: "87%", icon: TrendingUp },
        { label: "Admin Hours/Week", before: "15 hours", after: "3 hours", icon: CalendarDays }
      ],
      timeline: [
        { month: "Month 1", milestone: "Widget implementation & plan creation" },
        { month: "Month 2", milestone: "First 75 subscription sign-ups" },
        { month: "Month 4", milestone: "Reached 150 monthly customers" },
        { month: "Month 6", milestone: "Surpassed 300 monthly customers" }
      ]
    },
    {
      id: "lawn",
      company: "Green Horizons Lawn Care",
      location: "Austin, TX",
      industry: "Lawn Care",
      tagline: "Added $25,000 in new monthly revenue",
      logo: "https://placehold.co/200x80?text=Green+Horizons",
      heroMetric: "$25K+",
      heroMetricLabel: "Monthly Revenue",
      result: "Transitioned from one-time services to recurring plans, adding $25,000 in stable monthly revenue.",
      quote: "Our cash flow issues are gone. With ServicePlan Pro, we've built a stable business with predictable revenue even during winter months when lawn care demand drops.",
      quoteAuthor: "Sarah Williams",
      quoteRole: "Owner, Green Horizons Lawn Care",
      challenges: [
        "Highly seasonal business with 70% of revenue in summer months",
        "Low customer loyalty - less than 35% rebooking rate",
        "Manual scheduling and paper invoicing causing delays",
        "No online booking or payment capabilities"
      ],
      solution: [
        "Implemented ServicePlan Pro with seasonal maintenance packages",
        "Created monthly, quarterly and annual subscription options",
        "Added equipment sales for winter revenue boost",
        "Integrated with existing scheduling software"
      ],
      results: [
        { label: "Monthly Customers", before: "95", after: "210", icon: Users },
        { label: "Monthly Revenue", before: "$8,500", after: "$25,200", icon: DollarSign },
        { label: "Winter Revenue", before: "-65%", after: "-10%", icon: TrendingUp },
        { label: "Customer Lifetime", before: "4 months", after: "18+ months", icon: CalendarDays }
      ],
      timeline: [
        { month: "Month 1", milestone: "Implementation & staff training" },
        { month: "Month 3", milestone: "100 subscription customers" },
        { month: "Month 5", milestone: "Added product sales to widget" },
        { month: "Month 7", milestone: "Surpassed $25K monthly recurring revenue" }
      ]
    },
    {
      id: "pool",
      company: "Crystal Pool Service",
      location: "Phoenix, AZ",
      industry: "Pool Maintenance",
      tagline: "200+ new customers in 5 months",
      logo: "https://placehold.co/200x80?text=Crystal+Pool",
      heroMetric: "94%",
      heroMetricLabel: "Retention Rate",
      result: "Added 200+ new subscription customers with a 94% retention rate, stabilizing previously volatile cash flow.",
      quote: "Before ServicePlan Pro, we had to chase payments and manually schedule each service. Now our customers are on autopay, and our scheduling is fully automated.",
      quoteAuthor: "David Chen",
      quoteRole: "CEO, Crystal Pool Service",
      challenges: [
        "Inefficient payment collection with 15% late payments",
        "Manual scheduling requiring multiple phone calls",
        "No system for tracking chemical usage per customer",
        "Limited ability to scale due to administrative bottlenecks"
      ],
      solution: [
        "Implemented ServicePlan Pro subscription widget with automatic payments",
        "Created tiered monthly maintenance plans with chemical inclusion",
        "Added one-time services like pool opening/closing as add-ons",
        "Integrated with existing business management software"
      ],
      results: [
        { label: "Monthly Customers", before: "85", after: "287", icon: Users },
        { label: "Monthly Revenue", before: "$12,750", after: "$43,050", icon: DollarSign },
        { label: "Late Payments", before: "15%", after: "0%", icon: TrendingUp },
        { label: "Admin Time", before: "25 hrs/week", after: "5 hrs/week", icon: CalendarDays }
      ],
      timeline: [
        { month: "Month 1", milestone: "Implementation & plan creation" },
        { month: "Month 2", milestone: "First 50 subscription sign-ups" },
        { month: "Month 3", milestone: "Added one-time service options" },
        { month: "Month 5", milestone: "Reached 200+ monthly customers" }
      ]
    }
  ];

  const findCaseStudy = (id: string) => {
    return caseStudies.find(study => study.id === id) || caseStudies[0];
  };
  
  const activeCase = findCaseStudy(activeTab);

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Real Results from Real Businesses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See how service businesses like yours are growing recurring revenue with ServicePlan Pro.
        </p>
      </div>

      {/* Case Study Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 gap-4">
          {caseStudies.map(study => (
            <TabsTrigger 
              key={study.id} 
              value={study.id}
              className="flex flex-col items-center gap-1 py-4 px-4"
            >
              <div className="w-full text-center">
                <div className="text-sm font-medium mb-1">{study.company}</div>
                <div className="text-xs text-muted-foreground">{study.industry}</div>
                <div className="mt-2 text-xs">{study.tagline}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {caseStudies.map(study => (
          <TabsContent key={study.id} value={study.id} className="space-y-8">
            {/* Case Study Header */}
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className="bg-gray-100 p-4 rounded w-[200px] h-[80px] flex items-center justify-center">
                    {/* Placeholder for company logo */}
                    <div className="text-lg font-bold">{study.company}</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{study.company}</h2>
                    <p className="text-muted-foreground">{study.location} &bull; {study.industry}</p>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4">{study.tagline}</h3>
                <p className="text-lg text-muted-foreground mb-6">{study.result}</p>
                
                <div className="relative bg-primary/5 p-6 rounded-lg my-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-4 -left-4" />
                  <p className="italic mb-4">"{study.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">{study.quoteAuthor}</p>
                      <p className="text-sm text-muted-foreground">{study.quoteRole}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
                <div className="text-4xl font-bold text-primary mb-2">{study.heroMetric}</div>
                <div className="text-sm text-muted-foreground mb-6">{study.heroMetricLabel}</div>
                <img 
                  src="https://placehold.co/300x200?text=Results+Graph" 
                  alt="Results visualization" 
                  className="mx-auto rounded mb-4"
                />
                <p className="text-sm text-muted-foreground">Results after 6 months</p>
              </div>
            </div>
            
            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">The Challenge</h3>
                <ul className="space-y-3">
                  {study.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="rounded-full bg-red-100 p-1 mt-0.5">
                        <div className="w-4 h-4 text-red-600 flex items-center justify-center">✕</div>
                      </div>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">The Solution</h3>
                <ul className="space-y-3">
                  {study.solution.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5">
                        <div className="w-4 h-4 text-green-600 flex items-center justify-center">✓</div>
                      </div>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Results Grid */}
            <div>
              <h3 className="text-xl font-bold mb-6">The Results</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {study.results.map((result, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <result.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-center font-medium mb-2">{result.label}</h4>
                      <div className="flex justify-between items-center">
                        <div className="text-center flex-1">
                          <div className="text-sm text-muted-foreground">Before</div>
                          <div className="font-bold">{result.before}</div>
                        </div>
                        <div className="text-center text-primary">→</div>
                        <div className="text-center flex-1">
                          <div className="text-sm text-muted-foreground">After</div>
                          <div className="font-bold text-green-600">{result.after}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Timeline */}
            <div>
              <h3 className="text-xl font-bold mb-6">Implementation Timeline</h3>
              <div className="relative">
                <div className="absolute left-[9px] top-0 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {study.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">{idx + 1}</div>
                      </div>
                      <div>
                        <h4 className="font-medium">{item.month}</h4>
                        <p className="text-muted-foreground">{item.milestone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* More Success Stories */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">More Customer Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[60px] flex items-center mb-4">
                <div className="text-lg font-bold">Comfort Air HVAC</div>
              </div>
              <h3 className="font-medium mb-2">145% increase in service agreements</h3>
              <p className="text-sm text-muted-foreground mb-4">
                "We converted 40% of our one-time customers to maintenance plans, resulting in much more predictable revenue."
              </p>
              <p className="text-sm font-medium">Robert Garcia, Service Manager</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="h-[60px] flex items-center mb-4">
                <div className="text-lg font-bold">PureWater Plumbing</div>
              </div>
              <h3 className="font-medium mb-2">$18,500 in new monthly revenue</h3>
              <p className="text-sm text-muted-foreground mb-4">
                "Our plumbing protection plans now generate more revenue than our emergency service calls."
              </p>
              <p className="text-sm font-medium">Jennifer Kim, Operations Director</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="h-[60px] flex items-center mb-4">
                <div className="text-lg font-bold">EcoClean Services</div>
              </div>
              <h3 className="font-medium mb-2">Reduced admin time by 85%</h3>
              <p className="text-sm text-muted-foreground mb-4">
                "Automated scheduling and payments have eliminated most of our administrative overhead."
              </p>
              <p className="text-sm font-medium">Thomas Wilson, Owner</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROI Calculator CTA */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Could you be our next success story?</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Calculate how much recurring revenue ServicePlan Pro could add to your business.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="font-medium text-lg">$325</div>
              <div className="text-sm text-muted-foreground">Average Plan Value</div>
            </div>
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="font-medium text-lg">85%</div>
              <div className="text-sm text-muted-foreground">Renewal Rate</div>
            </div>
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="font-medium text-lg">$27,500</div>
              <div className="text-sm text-muted-foreground">Monthly with 100 Plans</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/trial-registration">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/roi-calculator">Try ROI Calculator</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}