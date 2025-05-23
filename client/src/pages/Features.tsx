import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Palette, 
  Smartphone, 
  ShieldCheck, 
  BarChart3, 
  DollarSign,
  Repeat, 
  LayoutDashboard, 
  Clock,
  CheckCircle2 as CheckCircle,
  XCircle 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Custom Branding",
      description: "Match your widget to your website with custom colors, logos, and messaging.",
      icon: Palette,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Mobile Responsive",
      description: "Works perfectly on all devices - phones, tablets, and desktops.",
      icon: Smartphone,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Secure Payments",
      description: "Built-in Stripe integration ensures safe, reliable payment processing.",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Customer Analytics",
      description: "Track conversion rates, acquisition sources, and plan popularity.",
      icon: BarChart3,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Multi-Revenue Streams",
      description: "Sell subscriptions, one-time products, and handle invoice payments.",
      icon: DollarSign,
      color: "bg-rose-100 text-rose-700",
    },
    {
      title: "CRM Integration",
      description: "Connect with your existing systems via Zapier webhooks.",
      icon: Repeat,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Real-time Dashboard",
      description: "Monitor performance and manage all aspects of your business.",
      icon: LayoutDashboard,
      color: "bg-teal-100 text-teal-700",
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Everything You Need to Sell Subscriptions Online
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ServicePlan Pro provides all the tools you need to create, sell, and manage 
          maintenance plans for your home service business.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Multi-Revenue Section */}
      <div className="bg-primary/5 rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Multiple Revenue Streams in One Widget</h2>
            <p className="text-muted-foreground mb-6">
              Unlike competitors who only handle subscriptions, ServicePlan Pro lets you sell:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-medium">Recurring Maintenance Plans</span>
                  <p className="text-sm text-muted-foreground">Monthly or annual service plans with automatic renewal</p>
                </div>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-medium">One-Time Product Sales</span>
                  <p className="text-sm text-muted-foreground">Equipment, parts, and accessories with upfront payment</p>
                </div>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-medium">Invoice Payments</span>
                  <p className="text-sm text-muted-foreground">Let customers pay outstanding invoices through the same interface</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="font-medium mb-4 text-xl">Average Revenue Increase</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Subscription Plans</span>
                  <span className="text-sm font-medium">+$2,180/mo</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Products</span>
                  <span className="text-sm font-medium">+$1,450/mo</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Invoices</span>
                  <span className="text-sm font-medium">+$950/mo</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Total New Revenue</span>
                  <span className="font-bold">+$4,580/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-gray-50 text-left"></th>
                <th className="py-4 px-6 bg-primary/10 text-center font-bold">
                  ServicePlan Pro
                </th>
                <th className="py-4 px-6 bg-gray-50 text-center font-bold">
                  Competitor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={3} className="py-3 px-6 bg-gray-100 font-medium">
                  Core Features
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Custom Branding</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Multiple Service Plans</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">One-Time Products</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Invoice Payments</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              
              <tr className="border-t-2 border-gray-200">
                <td colSpan={3} className="py-3 px-6 bg-gray-100 font-medium">
                  Advanced Features
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Mobile Responsive</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Customer Portal</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Analytics Dashboard</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">CRM Integration</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Multi-Location Support</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Zapier Integration</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              
              <tr className="border-t-2 border-gray-200">
                <td colSpan={3} className="py-3 px-6 bg-gray-100 font-medium">
                  Support
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Email Support</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Phone Support</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">Implementation Support</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-b border-gray-200">ROI Consultation</td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-6 text-center border-b border-gray-200">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
          <p className="text-muted-foreground mb-6">
            Connect ServicePlan Pro with your existing business tools to streamline your operations.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Website Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Add our widget to any website with a single line of code. Works with WordPress, Wix, Squarespace, and custom sites.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">CRM Connections</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with ServiceTitan, HousecallPro, or any CRM through our Zapier integration to sync customer data.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in Stripe integration handles all payments securely. Funds are deposited directly to your bank account.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 border">
          <h3 className="font-medium mb-4">Zapier Integrations Include:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded p-3 text-center shadow-sm">ServiceTitan</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">HousecallPro</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">Salesforce</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">QuickBooks</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">Hubspot</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">MailChimp</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">Google Sheets</div>
            <div className="bg-white rounded p-3 text-center shadow-sm">And 2000+ more</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">See All Features in Action</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Experience the power of ServicePlan Pro with a live demo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">
              Try Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}