import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SaaSPlans } from '@/lib/saas-plans';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Users,
  DollarSign,
  UserRound,
  ArrowUpRight,
  Settings,
  LayoutPanelLeft,
  Clock,
  CreditCard,
  CirclePlus,
  FileText,
  UploadCloud,
  Edit,
  Save,
  HelpCircle,
  MessageSquare,
  ShoppingCart,
  FileBarChart,
  Calculator,
  History,
  Inbox,
  CalendarIcon
} from 'lucide-react';

// Types for the CustomerDashboard
interface CustomerData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'trial' | 'active' | 'cancelled' | 'past_due';
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    trialEndsAt: Date;
    currentPeriodEnd: Date;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    customDomain?: string;
  };
  widgetConfig: {
    enabledRevenues: {
      subscriptions: boolean;
      products: boolean;
      invoices: boolean;
      services: boolean;
    };
    companyTagline: string;
    defaultTab: 'subscriptions' | 'products' | 'invoices' | 'services';
    customTermsUrl?: string;
  };
}

interface Stats {
  totalSubscriptions: number;
  monthlyRevenue: number;
  activeCustomers: number;
  conversionRate: number;
  totalProducts: number;
  invoicesPaid: number;
}

interface AnalyticsData {
  monthlySales: Array<{name: string; revenue: number}>;
  conversionData: Array<{name: string; rate: number}>;
  revenueByType: Array<{name: string; value: number}>;
  customerGrowth: Array<{name: string; customers: number}>;
}

interface WidgetBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string | null;
  companyName: string;
  companyTagline: string;
}

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  joinedDate: string;
  lastPayment: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export default function CustomerDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalSubscriptions: 0,
    monthlyRevenue: 0,
    activeCustomers: 0,
    conversionRate: 0,
    totalProducts: 0,
    invoicesPaid: 0
  });
  
  const [widgetBranding, setWidgetBranding] = useState<WidgetBranding>({
    primaryColor: '#0f766e',
    secondaryColor: '#f97316',
    logo: null,
    companyName: '',
    companyTagline: ''
  });
  
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    monthlySales: [],
    conversionData: [],
    revenueByType: [],
    customerGrowth: []
  });
  
  // Revenue streams toggles
  const [enabledRevenues, setEnabledRevenues] = useState({
    subscriptions: true,
    products: true, 
    invoices: true,
    services: true
  });

  // Fetch customer data
  const { data: customer, isLoading } = useQuery({
    queryKey: ['/api/customer'],
    queryFn: async () => {
      // This would be a real API call in production
      // Simulating for demo purposes
      return {
        id: '12345',
        companyName: 'Premium Home Services',
        email: 'admin@premiumhomeservices.com',
        phone: '(555) 123-4567',
        industry: 'HVAC',
        subscription: {
          plan: 'professional' as const,
          status: 'active' as const,
          stripeCustomerId: 'cus_123456',
          stripeSubscriptionId: 'sub_123456',
          trialEndsAt: new Date('2025-06-01'),
          currentPeriodEnd: new Date('2025-06-23')
        },
        branding: {
          primaryColor: '#0f766e',
          secondaryColor: '#f97316',
          logo: '/logo.png',
          customDomain: 'services.premiumhomeservices.com'
        },
        widgetConfig: {
          enabledRevenues: {
            subscriptions: true,
            products: true,
            invoices: true,
            services: true
          },
          companyTagline: "Professional Home Comfort Solutions",
          defaultTab: "subscriptions" as const,
          customTermsUrl: "https://premiumhomeservices.com/terms"
        }
      } as CustomerData;
    }
  });

  useEffect(() => {
    // Initialize widget branding from customer data
    if (customer) {
      setWidgetBranding({
        primaryColor: customer.branding.primaryColor,
        secondaryColor: customer.branding.secondaryColor,
        logo: customer.branding.logo,
        companyName: customer.companyName,
        companyTagline: customer.widgetConfig.companyTagline
      });
      
      setEnabledRevenues(customer.widgetConfig.enabledRevenues);
    }
    
    // Fetch stats (this would be a real API call in production)
    // Simulating for demo purposes
    setStats({
      totalSubscriptions: 34,
      monthlyRevenue: 2750,
      activeCustomers: 29,
      conversionRate: 4.2,
      totalProducts: 18,
      invoicesPaid: 23
    });
    
    // Simulate customer data
    setCustomers([
      { id: '1', name: 'John Smith', email: 'john@example.com', plan: 'Premium', status: 'active', joinedDate: '2025-01-15', lastPayment: 59.99 },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Ultimate', status: 'active', joinedDate: '2025-02-03', lastPayment: 99.99 },
      { id: '3', name: 'Robert Davis', email: 'robert@example.com', plan: 'Basic', status: 'active', joinedDate: '2025-03-12', lastPayment: 29.99 },
      { id: '4', name: 'Emily Wilson', email: 'emily@example.com', plan: 'Premium', status: 'past_due', joinedDate: '2025-01-20', lastPayment: 59.99 },
      { id: '5', name: 'Michael Brown', email: 'michael@example.com', plan: 'Basic', status: 'active', joinedDate: '2025-03-05', lastPayment: 29.99 },
      { id: '6', name: 'Jessica Taylor', email: 'jessica@example.com', plan: 'Premium', status: 'active', joinedDate: '2025-02-17', lastPayment: 59.99 },
    ]);
    
    // Simulate invoices data
    setInvoices([
      { id: '1', number: 'INV-001', date: '2025-04-01', amount: 149.99, status: 'paid' },
      { id: '2', number: 'INV-002', date: '2025-04-05', amount: 89.99, status: 'paid' },
      { id: '3', number: 'INV-003', date: '2025-04-10', amount: 199.99, status: 'paid' },
      { id: '4', number: 'INV-004', date: '2025-04-15', amount: 74.99, status: 'pending' },
      { id: '5', number: 'INV-005', date: '2025-04-20', amount: 129.99, status: 'overdue' },
    ]);
    
    // Simulate analytics data
    setAnalyticsData({
      monthlySales: [
        { name: 'Jan', revenue: 1200 },
        { name: 'Feb', revenue: 1800 },
        { name: 'Mar', revenue: 2400 },
        { name: 'Apr', revenue: 2750 },
        { name: 'May', revenue: 3100 },
      ],
      conversionData: [
        { name: 'Jan', rate: 2.8 },
        { name: 'Feb', rate: 3.2 },
        { name: 'Mar', rate: 3.8 },
        { name: 'Apr', rate: 4.2 },
        { name: 'May', rate: 4.5 },
      ],
      revenueByType: [
        { name: 'Subscriptions', value: 65 },
        { name: 'Products', value: 20 },
        { name: 'Services', value: 10 },
        { name: 'Invoices', value: 5 },
      ],
      customerGrowth: [
        { name: 'Jan', customers: 12 },
        { name: 'Feb', customers: 19 },
        { name: 'Mar', customers: 24 },
        { name: 'Apr', customers: 29 },
        { name: 'May', customers: 35 },
      ]
    });
  }, [customer]);

  const handleSaveBranding = () => {
    toast({
      title: "Branding updated",
      description: "Your widget branding has been updated successfully."
    });
  };

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Upgrading your plan",
      description: "Redirecting to checkout for the " + planId + " plan."
    });
    // This would redirect to Stripe checkout in production
    // window.location.href = `/api/create-upgrade-session?plan=${planId}`;
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Are you sure?",
      description: "This action will cancel your subscription at the end of your billing period. Please contact support if you need help.",
    });
  };
  
  const handleUpdatePaymentMethod = () => {
    toast({
      title: "Update payment method",
      description: "Redirecting to the payment method update screen."
    });
  };
  
  const handleRevenueToggle = (type: keyof typeof enabledRevenues) => {
    setEnabledRevenues(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    toast({
      title: `${enabledRevenues[type] ? 'Disabled' : 'Enabled'} ${type}`,
      description: `${type} revenue stream has been ${enabledRevenues[type] ? 'disabled' : 'enabled'}.`
    });
  };
  
  const handleCreateSupportTicket = () => {
    toast({
      title: "Support ticket created",
      description: "Your support ticket has been created. We'll respond within 24 hours."
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If data isn't loaded yet, don't render the full dashboard
  if (!customer) return null;

  // Find current plan details
  const currentPlan = SaaSPlans.find(plan => plan.id === customer.subscription.plan);
  
  // Color schemes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{customer.companyName} Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your ServicePlan Pro subscription and widget settings.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant={customer.subscription.status === 'active' ? 'default' : 'destructive'} className="text-sm px-3 py-1 mb-2">
            {customer.subscription.status.toUpperCase()}
          </Badge>
          <p className="text-sm text-gray-500">
            {customer.subscription.status === 'trial' 
              ? `Trial ends on ${new Date(customer.subscription.trialEndsAt).toLocaleDateString()}`
              : `Next billing date: ${new Date(customer.subscription.currentPeriodEnd).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 flex justify-start overflow-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="widget" className="flex items-center gap-1"><Settings className="w-4 h-4" /> Widget Customization</TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Revenue Streams</TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-1"><UserRound className="w-4 h-4" /> Customer Management</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1"><FileBarChart className="w-4 h-4" /> Analytics</TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Billing</TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> Support</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Total Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalSubscriptions}</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <UserRound className="w-4 h-4" /> Active Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.activeCustomers}</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +5% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* More Stats in Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +0.3% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Products Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +3 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Invoices Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.invoicesPaid}</p>
                <p className="text-sm text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +7 from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help manage your business</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <CirclePlus className="h-5 w-5 mr-2" />
                Create New Service Plan
              </Button>
              <Button variant="outline" className="justify-start">
                <LayoutPanelLeft className="h-5 w-5 mr-2" />
                Preview Widget
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="h-5 w-5 mr-2" />
                Schedule Service Call
              </Button>
              <Button variant="outline" className="justify-start">
                <FileBarChart className="h-5 w-5 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="h-5 w-5 mr-2" />
                Send Marketing Email
              </Button>
              <Button variant="outline" className="justify-start">
                <HelpCircle className="h-5 w-5 mr-2" />
                Get Support
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Activity</CardTitle>
              <CardDescription>Latest subscriptions and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <UserRound className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson subscribed to the Ultimate Plan</p>
                    <p className="text-sm text-gray-500">Today at 10:32 AM • $99.99/month</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Invoice #INV-003 paid by Robert Davis</p>
                    <p className="text-sm text-gray-500">Yesterday at 3:15 PM • $199.99</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Michael Brown purchased Smart Thermostat</p>
                    <p className="text-sm text-gray-500">Yesterday at 11:42 AM • $249.99</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Jessica Taylor upgraded from Basic to Premium Plan</p>
                    <p className="text-sm text-gray-500">May 21, 2025 • From $29.99 to $59.99/month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WIDGET CUSTOMIZATION TAB */}
        <TabsContent value="widget">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Widget Branding</CardTitle>
              <CardDescription>Customize the appearance of your subscription widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input 
                      value={widgetBranding.companyName}
                      onChange={(e) => setWidgetBranding({...widgetBranding, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Company Tagline</Label>
                    <Input 
                      value={widgetBranding.companyTagline}
                      onChange={(e) => setWidgetBranding({...widgetBranding, companyTagline: e.target.value})}
                      placeholder="Professional Home Comfort Solutions"
                    />
                    <p className="text-xs text-gray-500">This will appear below your company name in the widget</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex space-x-2">
                      <div 
                        className="h-10 w-10 rounded border cursor-pointer"
                        style={{ backgroundColor: widgetBranding.primaryColor }}
                      />
                      <Input 
                        value={widgetBranding.primaryColor}
                        onChange={(e) => setWidgetBranding({...widgetBranding, primaryColor: e.target.value})}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Used for buttons and primary interface elements</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex space-x-2">
                      <div 
                        className="h-10 w-10 rounded border cursor-pointer"
                        style={{ backgroundColor: widgetBranding.secondaryColor }}
                      />
                      <Input 
                        value={widgetBranding.secondaryColor}
                        onChange={(e) => setWidgetBranding({...widgetBranding, secondaryColor: e.target.value})}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Used for accents and highlights</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border rounded-md p-4">
                      {widgetBranding.logo ? (
                        <div className="flex items-center justify-between">
                          <img src={widgetBranding.logo} alt="Logo" className="h-16 object-contain" />
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
                          <div className="text-center">
                            <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Drag and drop your logo here or click to browse</p>
                            <Button variant="outline" size="sm">Upload Logo</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Recommended size: 300x100px, PNG or SVG format</p>
                  </div>
                  
                  <Button onClick={handleSaveBranding} className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
                    <div 
                      className="border rounded-md p-6 shadow-sm"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="text-center mb-6">
                        {widgetBranding.logo && (
                          <img 
                            src={widgetBranding.logo} 
                            alt={widgetBranding.companyName} 
                            className="h-16 object-contain mx-auto mb-2"
                          />
                        )}
                        <h2 
                          className="text-xl font-bold" 
                          style={{ color: widgetBranding.primaryColor }}
                        >
                          {widgetBranding.companyName || 'Your Company Name'}
                        </h2>
                        <p className="text-gray-600">{widgetBranding.companyTagline || 'Professional Home Services'}</p>
                      </div>
                      
                      <div className="bg-gray-100 rounded p-2 flex space-x-2 mb-4">
                        <div 
                          className="rounded py-1 px-3 text-sm font-medium text-white"
                          style={{ backgroundColor: widgetBranding.primaryColor }}
                        >
                          Service Plans
                        </div>
                        <div className="rounded py-1 px-3 text-sm font-medium text-gray-600">
                          Products
                        </div>
                        <div className="rounded py-1 px-3 text-sm font-medium text-gray-600">
                          Services
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-bold mb-1">Basic Plan</h3>
                          <p className="text-sm text-gray-600 mb-2">Essential maintenance</p>
                          <p className="text-xl font-bold" style={{ color: widgetBranding.primaryColor }}>$29.99<span className="text-sm text-gray-500">/month</span></p>
                        </div>
                        
                        <div 
                          className="border rounded-md p-4 hover:shadow-md transition-shadow"
                          style={{ borderColor: widgetBranding.secondaryColor }}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-bold mb-1">Premium Plan</h3>
                            <span 
                              className="text-xs font-medium rounded-full px-2 py-1 text-white"
                              style={{ backgroundColor: widgetBranding.secondaryColor }}
                            >
                              Popular
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Complete coverage</p>
                          <p className="text-xl font-bold" style={{ color: widgetBranding.primaryColor }}>$59.99<span className="text-sm text-gray-500">/month</span></p>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full py-2 rounded text-white font-medium"
                        style={{ backgroundColor: widgetBranding.primaryColor }}
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">Default Tab</Label>
                      <Select defaultValue="subscriptions">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select tab" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscriptions">Service Plans</SelectItem>
                          <SelectItem value="products">Products</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="invoices">Invoices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="font-medium">Terms & Conditions URL</Label>
                        <p className="text-xs text-gray-500">Customers will be required to accept your terms</p>
                      </div>
                      <Input 
                        value={customer.widgetConfig.customTermsUrl || ''} 
                        placeholder="https://yourwebsite.com/terms"
                        className="w-[250px]"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="font-medium">Custom Domain</Label>
                        <p className="text-xs text-gray-500">Available on Professional+ plans</p>
                      </div>
                      <Input 
                        value={customer.branding.customDomain || ''} 
                        placeholder="widget.yourcompany.com"
                        className="w-[250px]"
                        disabled={customer.subscription.plan === 'starter'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Plan Configuration</CardTitle>
              <CardDescription>Customize the subscription plans shown to your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button>
                    <CirclePlus className="h-4 w-4 mr-2" />
                    Add New Plan
                  </Button>
                  
                  <Select defaultValue="active">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="active">Active Plans</SelectItem>
                      <SelectItem value="inactive">Inactive Plans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Basic Maintenance</TableCell>
                      <TableCell>$29.99</TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Premium Protection</TableCell>
                      <TableCell>$59.99</TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ultimate Care</TableCell>
                      <TableCell>$99.99</TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Basic Annual</TableCell>
                      <TableCell>$299.99</TableCell>
                      <TableCell>Annual</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Inactive</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* REVENUE STREAMS TAB */}
        <TabsContent value="revenue">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Revenue Streams</CardTitle>
              <CardDescription>Configure which revenue streams are available in your widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                          Subscription Plans
                        </CardTitle>
                        <Switch 
                          checked={enabledRevenues.subscriptions}
                          onCheckedChange={() => handleRevenueToggle('subscriptions')}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Allow customers to subscribe to your maintenance plans with recurring payments.</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Plans Available</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Revenue</span>
                          <span className="font-medium">$1,975</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Plan Value</span>
                          <span className="font-medium">$58.09</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-green-600" />
                          Products
                        </CardTitle>
                        <Switch 
                          checked={enabledRevenues.products}
                          onCheckedChange={() => handleRevenueToggle('products')}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Sell equipment, parts and supplies directly through your widget.</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Products Available</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Revenue</span>
                          <span className="font-medium">$580</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Order Value</span>
                          <span className="font-medium">$145</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                          One-Time Services
                        </CardTitle>
                        <Switch 
                          checked={enabledRevenues.services}
                          onCheckedChange={() => handleRevenueToggle('services')}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Offer and schedule emergency services and special maintenance tasks.</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Services Available</span>
                          <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Revenue</span>
                          <span className="font-medium">$425</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Service Value</span>
                          <span className="font-medium">$142</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                          Invoice Payments
                        </CardTitle>
                        <Switch 
                          checked={enabledRevenues.invoices}
                          onCheckedChange={() => handleRevenueToggle('invoices')}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Allow customers to pay their invoices online with credit card.</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Invoices Paid Online</span>
                          <span className="font-medium">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Revenue</span>
                          <span className="font-medium">$1,250</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg. Time to Payment</span>
                          <span className="font-medium">1.3 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Revenue Stream Insights</h3>
                  <p className="text-blue-700 mb-4">Based on your customer data, here are our recommendations for maximizing revenue:</p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                        <DollarSign className="h-4 w-4 text-blue-700" />
                      </div>
                      <p className="text-sm text-blue-800">Add a quarterly payment option to your Premium Plan to increase upfront revenue</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                        <ShoppingCart className="h-4 w-4 text-blue-700" />
                      </div>
                      <p className="text-sm text-blue-800">Add smart thermostats to your product catalog - 65% of your competitors offer them</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                        <CreditCard className="h-4 w-4 text-blue-700" />
                      </div>
                      <p className="text-sm text-blue-800">Create an emergency service option with 24/7 availability at a premium price point</p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog Management</CardTitle>
              <CardDescription>Manage the products shown in your widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button>
                    <CirclePlus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="add-ons">Add-ons</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="instock">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="instock">In Stock</SelectItem>
                        <SelectItem value="outofstock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Smart Thermostat</TableCell>
                      <TableCell>Equipment</TableCell>
                      <TableCell>$249.99</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Premium HEPA Filters (4-pack)</TableCell>
                      <TableCell>Supplies</TableCell>
                      <TableCell>$79.99</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Whole-Home Air Purifier</TableCell>
                      <TableCell>Equipment</TableCell>
                      <TableCell>$699.99</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Out of Stock</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">UV Air Treatment System</TableCell>
                      <TableCell>Add-ons</TableCell>
                      <TableCell>$299.99</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* CUSTOMER MANAGEMENT TAB */}
        <TabsContent value="customers">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage your service subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Input placeholder="Search customers..." className="max-w-sm" />
                  
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="ultimate">Ultimate</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="active">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.plan}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>{customer.status}</Badge>
                        </TableCell>
                        <TableCell>{customer.joinedDate}</TableCell>
                        <TableCell>${customer.lastPayment}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Activity</CardTitle>
              <CardDescription>Recent subscription changes and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 23, 2025</TableCell>
                      <TableCell>Sarah Johnson</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">New Subscription</Badge>
                      </TableCell>
                      <TableCell>Ultimate Plan</TableCell>
                      <TableCell>$99.99/mo</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 22, 2025</TableCell>
                      <TableCell>Robert Davis</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500">Invoice Payment</Badge>
                      </TableCell>
                      <TableCell>INV-003</TableCell>
                      <TableCell>$199.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 22, 2025</TableCell>
                      <TableCell>Michael Brown</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500">Product Purchase</Badge>
                      </TableCell>
                      <TableCell>Smart Thermostat</TableCell>
                      <TableCell>$249.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 21, 2025</TableCell>
                      <TableCell>Jessica Taylor</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-500">Plan Upgrade</Badge>
                      </TableCell>
                      <TableCell>Basic → Premium</TableCell>
                      <TableCell>$59.99/mo</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 20, 2025</TableCell>
                      <TableCell>Emily Wilson</TableCell>
                      <TableCell>
                        <Badge className="bg-red-500">Payment Failed</Badge>
                      </TableCell>
                      <TableCell>Premium Plan</TableCell>
                      <TableCell>$59.99</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm">View All Activity</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ANALYTICS TAB */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue from all streams over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`$${value}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors who subscribe</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Conversion Rate']}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#00C49F" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Split by revenue source</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.revenueByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.revenueByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Active customers over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="customers" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key metrics to track your growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-500">Subscription Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Revenue Per User</span>
                      <span className="font-bold">$64.30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Churn Rate</span>
                      <span className="font-bold">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Lifetime Value</span>
                      <span className="font-bold">$1,540</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Renewal Rate</span>
                      <span className="font-bold">87%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-500">Sales Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Order Value</span>
                      <span className="font-bold">$145.75</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cart Abandonment Rate</span>
                      <span className="font-bold">24.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Repeat Purchase Rate</span>
                      <span className="font-bold">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Items Per Order</span>
                      <span className="font-bold">1.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-500">Widget Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Widget Impression Count</span>
                      <span className="font-bold">3,452</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-bold">4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Session Duration</span>
                      <span className="font-bold">2:35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mobile Conversion Rate</span>
                      <span className="font-bold">3.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* BILLING TAB */}
        <TabsContent value="billing">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your ServicePlan Pro subscription details and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{currentPlan?.name} Plan</h3>
                  <p className="text-2xl font-bold">${currentPlan?.price}<span className="text-sm text-gray-500">/month</span></p>
                  <Badge className="mt-2">{customer.subscription.status.toUpperCase()}</Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next billing date</p>
                  <p className="font-medium">{new Date(customer.subscription.currentPeriodEnd).toLocaleDateString()}</p>
                  
                  <p className="text-sm text-gray-500 mt-3 mb-1">Payment method</p>
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-1 rounded mr-2">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <p className="font-medium">Visa ending in 4242</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => handleUpgrade(
                    customer.subscription.plan === 'starter' ? 'professional' : 'enterprise'
                  )}>
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" onClick={handleCancelSubscription}>
                    Cancel Subscription
                  </Button>
                  <Button variant="link" className="text-sm justify-start p-0" onClick={handleUpdatePaymentMethod}>
                    Update payment method
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Plan Usage</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Customers</span>
                      <span className="text-sm text-gray-500">
                        {stats.activeCustomers} / {currentPlan?.limits.monthlySubscriptions === -1 ? '∞' : currentPlan?.limits.monthlySubscriptions}
                      </span>
                    </div>
                    {currentPlan?.limits.monthlySubscriptions !== -1 && (
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${Math.min(100, (stats.activeCustomers / (currentPlan?.limits.monthlySubscriptions || 50)) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Calls</span>
                      <span className="text-sm text-gray-500">
                        3,241 / 10,000
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: '32.4%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Transactions</span>
                      <span className="text-sm text-gray-500">
                        182 / 500
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: '36.4%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV-12345</TableCell>
                    <TableCell>May 23, 2025</TableCell>
                    <TableCell>${currentPlan?.price}.00</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-12344</TableCell>
                    <TableCell>Apr 23, 2025</TableCell>
                    <TableCell>${currentPlan?.price}.00</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-12343</TableCell>
                    <TableCell>Mar 23, 2025</TableCell>
                    <TableCell>${currentPlan?.price}.00</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Compare plans and upgrade to access more features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {SaaSPlans.map(plan => (
                  <Card key={plan.id} className={`border ${plan.id === customer.subscription.plan ? 'border-primary' : 'border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <p className="text-2xl font-bold">${plan.price}<span className="text-sm text-gray-500">/month</span></p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button 
                        className="w-full"
                        variant={plan.id === customer.subscription.plan ? 'outline' : 'default'}
                        disabled={plan.id === customer.subscription.plan}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {plan.id === customer.subscription.plan ? 'Current Plan' : 'Select Plan'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SUPPORT TAB */}
        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-2xl font-bold mb-1">0</p>
                  <p className="text-gray-500">Active tickets</p>
                  <Button className="mt-4">Create New Ticket</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-2xl font-bold mb-1">4 hours</p>
                  <p className="text-gray-500">Average response time</p>
                  <Badge className="mt-4" variant="outline">Priority Support</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-purple-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-md font-medium mb-3">support@serviceplanpro.com</p>
                  <p className="text-gray-500 text-sm text-center">Our support team is available 24/7</p>
                  <Button variant="outline" className="mt-4">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Enter ticket subject" />
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue="technical">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Please describe your issue in detail" 
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="border border-dashed rounded-md p-6">
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                      <Button variant="ghost" size="sm" className="mt-2">Select Files</Button>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-2" onClick={handleCreateSupportTicket}>
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Help & Resources</CardTitle>
              <CardDescription>Get answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Knowledge Base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Getting Started Guide
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Widget Installation Instructions
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Subscription Plan Setup
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Integrating with Your CRM
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Troubleshooting Common Issues
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Widget Configuration Walkthrough
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Setting Up Multiple Revenue Streams
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Customizing Your Widget Branding
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Understanding Analytics Reports
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Optimizing Conversion Rates
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}