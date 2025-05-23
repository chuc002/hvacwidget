import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, HelpCircle } from 'lucide-react';

// Sample data for the analytics dashboard - in a real app, this would come from the API
const monthlySubscriptionsData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 24 },
  { month: 'Apr', count: 31 },
  { month: 'May', count: 42 },
  { month: 'Jun', count: 37 },
  { month: 'Jul', count: 45 },
  { month: 'Aug', count: 52 },
  { month: 'Sep', count: 61 },
  { month: 'Oct', count: 67 },
  { month: 'Nov', count: 72 },
  { month: 'Dec', count: 78 },
];

const revenueData = [
  { month: 'Jan', revenue: 2400 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Apr', revenue: 6200 },
  { month: 'May', revenue: 8400 },
  { month: 'Jun', revenue: 7400 },
  { month: 'Jul', revenue: 9000 },
  { month: 'Aug', revenue: 10400 },
  { month: 'Sep', revenue: 12200 },
  { month: 'Oct', revenue: 13400 },
  { month: 'Nov', revenue: 14400 },
  { month: 'Dec', revenue: 15600 },
];

const planDistributionData = [
  { name: 'Basic Plan', value: 35, color: '#0088FE' },
  { name: 'Premium Plan', value: 45, color: '#00C49F' },
  { name: 'Ultimate Plan', value: 20, color: '#FFBB28' },
];

const churnRateData = [
  { month: 'Jan', rate: 3.2 },
  { month: 'Feb', rate: 2.8 },
  { month: 'Mar', rate: 2.9 },
  { month: 'Apr', rate: 2.6 },
  { month: 'May', rate: 2.4 },
  { month: 'Jun', rate: 2.2 },
  { month: 'Jul', rate: 2.0 },
  { month: 'Aug', rate: 1.9 },
  { month: 'Sep', rate: 1.8 },
  { month: 'Oct', rate: 1.7 },
  { month: 'Nov', rate: 1.6 },
  { month: 'Dec', rate: 1.5 },
];

const conversionRateData = [
  { day: 'Mon', rate: 5.2 },
  { day: 'Tue', rate: 4.8 },
  { day: 'Wed', rate: 5.5 },
  { day: 'Thu', rate: 5.9 },
  { day: 'Fri', rate: 6.2 },
  { day: 'Sat', rate: 7.1 },
  { day: 'Sun', rate: 6.8 },
];

const subscriptionsByPlan = [
  { name: 'Basic Plan', current: 35, previous: 27 },
  { name: 'Premium Plan', current: 45, previous: 37 },
  { name: 'Ultimate Plan', current: 20, previous: 18 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const KPICard = ({ title, value, change, description }: { 
  title: string; 
  value: string;
  change: { value: number; trend: 'up' | 'down' | 'neutral' };
  description: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs flex items-center mt-1 ${
        change.trend === 'up' 
          ? 'text-green-500' 
          : change.trend === 'down' 
          ? 'text-red-500' 
          : 'text-gray-500'
      }`}>
        {change.trend === 'up' && (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {change.trend === 'down' && (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        <span>{Math.abs(change.value)}% {change.trend === 'up' ? 'increase' : change.trend === 'down' ? 'decrease' : ''} from last month</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </CardContent>
  </Card>
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-gray-600">Track and analyze your subscription performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="year" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Subscriptions" 
          value="78" 
          change={{ value: 8.3, trend: 'up' }}
          description="Active subscriptions across all plans"
        />
        <KPICard 
          title="Monthly Recurring Revenue" 
          value="$15,600" 
          change={{ value: 12.4, trend: 'up' }}
          description="Total monthly subscription value"
        />
        <KPICard 
          title="Churn Rate" 
          value="1.5%" 
          change={{ value: 0.3, trend: 'down' }}
          description="Subscription cancellation rate"
        />
        <KPICard 
          title="Conversion Rate" 
          value="6.2%" 
          change={{ value: 0.4, trend: 'up' }}
          description="Visitors who subscribe"
        />
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="plans">Plan Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth</CardTitle>
                <CardDescription>Total active subscriptions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySubscriptionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#0088FE" fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
                <CardDescription>Total revenue from subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#00C49F" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Breakdown of subscriptions by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>Percentage of subscriptions cancelled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={churnRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                      <Line type="monotone" dataKey="rate" stroke="#FF8042" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth</CardTitle>
                <CardDescription>Total active subscriptions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySubscriptionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#0088FE" fillOpacity={1} fill="url(#colorCount2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>Percentage of subscriptions cancelled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={churnRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                      <Line type="monotone" dataKey="rate" stroke="#FF8042" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions by Plan</CardTitle>
                <CardDescription>Current vs. previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subscriptionsByPlan}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="previous" fill="#8884d8" name="Previous Period" />
                      <Bar dataKey="current" fill="#82ca9d" name="Current Period" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors who subscribe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={conversionRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                      <Line type="monotone" dataKey="rate" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Details of all active subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Customer</th>
                      <th scope="col" className="px-6 py-3">Plan</th>
                      <th scope="col" className="px-6 py-3">Start Date</th>
                      <th scope="col" className="px-6 py-3">Next Billing</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">John Smith</td>
                      <td className="px-6 py-4">Premium Plan</td>
                      <td className="px-6 py-4">Jan 15, 2025</td>
                      <td className="px-6 py-4">Jun 15, 2025</td>
                      <td className="px-6 py-4">$39.99</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">Sarah Johnson</td>
                      <td className="px-6 py-4">Basic Plan</td>
                      <td className="px-6 py-4">Feb 3, 2025</td>
                      <td className="px-6 py-4">Jun 3, 2025</td>
                      <td className="px-6 py-4">$19.99</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">Michael Brown</td>
                      <td className="px-6 py-4">Ultimate Plan</td>
                      <td className="px-6 py-4">Mar 22, 2025</td>
                      <td className="px-6 py-4">Jun 22, 2025</td>
                      <td className="px-6 py-4">$59.99</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">Emily Davis</td>
                      <td className="px-6 py-4">Premium Plan</td>
                      <td className="px-6 py-4">Apr 10, 2025</td>
                      <td className="px-6 py-4">Jun 10, 2025</td>
                      <td className="px-6 py-4">$39.99</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Past due</span></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium text-gray-900">Robert Wilson</td>
                      <td className="px-6 py-4">Basic Plan</td>
                      <td className="px-6 py-4">May 5, 2025</td>
                      <td className="px-6 py-4">Jun 5, 2025</td>
                      <td className="px-6 py-4">$19.99</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View All Subscriptions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
                <CardDescription>Total revenue from subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#00C49F" fillOpacity={1} fill="url(#colorRevenue2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>Breakdown of revenue by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Basic Plan', value: 700, color: '#0088FE' },
                          { name: 'Premium Plan', value: 1800, color: '#00C49F' },
                          { name: 'Ultimate Plan', value: 1200, color: '#FFBB28' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Annual Projected Revenue</CardTitle>
                <CardDescription>Projected revenue based on current subscriptions and growth rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', projected: 16000, actual: 15600 },
                        { month: 'Feb', projected: 17200, actual: 0 },
                        { month: 'Mar', projected: 18400, actual: 0 },
                        { month: 'Apr', projected: 19800, actual: 0 },
                        { month: 'May', projected: 21200, actual: 0 },
                        { month: 'Jun', projected: 22800, actual: 0 },
                        { month: 'Jul', projected: 24500, actual: 0 },
                        { month: 'Aug', projected: 26300, actual: 0 },
                        { month: 'Sep', projected: 28200, actual: 0 },
                        { month: 'Oct', projected: 30300, actual: 0 },
                        { month: 'Nov', projected: 32500, actual: 0 },
                        { month: 'Dec', projected: 34900, actual: 0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, value === 0 ? 'Projected' : 'Revenue']} />
                      <Legend />
                      <Bar dataKey="projected" fill="#8884d8" name="Projected Revenue" />
                      <Bar dataKey="actual" fill="#82ca9d" name="Actual Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
              <CardDescription>Summary of current revenue metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                  <p className="text-2xl font-bold">$15,600</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    8.3% from last month
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Annual Revenue</h3>
                  <p className="text-2xl font-bold">$187,200</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    15.2% from last year
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Average Revenue Per User</h3>
                  <p className="text-2xl font-bold">$42.55</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    2.1% from last month
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Projected Annual Growth</h3>
                  <p className="text-2xl font-bold">123.7%</p>
                  <div className="flex items-center mt-1">
                    <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      View Projections
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Breakdown of subscriptions by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Plan Growth</CardTitle>
                <CardDescription>Subscription growth by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', basic: 10, premium: 15, ultimate: 5 },
                        { month: 'Feb', basic: 12, premium: 18, ultimate: 7 },
                        { month: 'Mar', basic: 15, premium: 22, ultimate: 8 },
                        { month: 'Apr', basic: 17, premium: 25, ultimate: 10 },
                        { month: 'May', basic: 20, premium: 29, ultimate: 12 },
                        { month: 'Jun', basic: 22, premium: 27, ultimate: 14 },
                        { month: 'Jul', basic: 25, premium: 30, ultimate: 15 },
                        { month: 'Aug', basic: 28, premium: 33, ultimate: 17 },
                        { month: 'Sep', basic: 30, premium: 36, ultimate: 19 },
                        { month: 'Oct', basic: 32, premium: 38, ultimate: 20 },
                        { month: 'Nov', basic: 33, premium: 40, ultimate: 22 },
                        { month: 'Dec', basic: 35, premium: 45, ultimate: 20 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="basic" stroke="#0088FE" strokeWidth={2} name="Basic Plan" />
                      <Line type="monotone" dataKey="premium" stroke="#00C49F" strokeWidth={2} name="Premium Plan" />
                      <Line type="monotone" dataKey="ultimate" stroke="#FFBB28" strokeWidth={2} name="Ultimate Plan" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Plan Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors who subscribe to each plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: 'Monday', basic: 2.1, premium: 2.8, ultimate: 1.2 },
                        { day: 'Tuesday', basic: 1.9, premium: 2.2, ultimate: 0.9 },
                        { day: 'Wednesday', basic: 2.3, premium: 2.9, ultimate: 1.1 },
                        { day: 'Thursday', basic: 2.5, premium: 3.1, ultimate: 1.3 },
                        { day: 'Friday', basic: 2.7, premium: 3.3, ultimate: 1.5 },
                        { day: 'Saturday', basic: 3.2, premium: 4.1, ultimate: 1.7 },
                        { day: 'Sunday', basic: 3.0, premium: 3.8, ultimate: 1.6 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                      <Legend />
                      <Bar dataKey="basic" fill="#0088FE" name="Basic Plan" />
                      <Bar dataKey="premium" fill="#00C49F" name="Premium Plan" />
                      <Bar dataKey="ultimate" fill="#FFBB28" name="Ultimate Plan" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Plan Performance</CardTitle>
              <CardDescription>Detailed metrics for each subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Plan</th>
                      <th scope="col" className="px-6 py-3">Subscribers</th>
                      <th scope="col" className="px-6 py-3">Monthly Revenue</th>
                      <th scope="col" className="px-6 py-3">Conversion Rate</th>
                      <th scope="col" className="px-6 py-3">Churn Rate</th>
                      <th scope="col" className="px-6 py-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">Basic Plan</td>
                      <td className="px-6 py-4">35</td>
                      <td className="px-6 py-4">$699.65</td>
                      <td className="px-6 py-4">2.4%</td>
                      <td className="px-6 py-4">1.8%</td>
                      <td className="px-6 py-4 text-green-600">+6.1%</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">Premium Plan</td>
                      <td className="px-6 py-4">45</td>
                      <td className="px-6 py-4">$1,799.55</td>
                      <td className="px-6 py-4">3.1%</td>
                      <td className="px-6 py-4">1.2%</td>
                      <td className="px-6 py-4 text-green-600">+12.5%</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium text-gray-900">Ultimate Plan</td>
                      <td className="px-6 py-4">20</td>
                      <td className="px-6 py-4">$1,199.80</td>
                      <td className="px-6 py-4">1.3%</td>
                      <td className="px-6 py-4">0.9%</td>
                      <td className="px-6 py-4 text-green-600">+5.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlySubscriptionsData.map(item => ({ ...item, newCustomers: Math.floor(item.count * 0.8) }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="newCustomers" fill="#8884d8" name="New Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Percentage of customers retained over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', rate: 95 },
                        { month: 'Feb', rate: 96 },
                        { month: 'Mar', rate: 94 },
                        { month: 'Apr', rate: 95 },
                        { month: 'May', rate: 97 },
                        { month: 'Jun', rate: 98 },
                        { month: 'Jul', rate: 97 },
                        { month: 'Aug', rate: 98 },
                        { month: 'Sep', rate: 98 },
                        { month: 'Oct', rate: 99 },
                        { month: 'Nov', rate: 98 },
                        { month: 'Dec', rate: 97 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[90, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                      <Line type="monotone" dataKey="rate" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Average revenue per customer over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 1, value: 40 },
                        { month: 2, value: 80 },
                        { month: 3, value: 120 },
                        { month: 6, value: 230 },
                        { month: 12, value: 450 },
                        { month: 24, value: 840 },
                        { month: 36, value: 1200 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorLTV" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => [`$${value}`, 'LTV']} />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorLTV)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Average satisfaction score (0-10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', score: 8.2 },
                        { month: 'Feb', score: 8.4 },
                        { month: 'Mar', score: 8.3 },
                        { month: 'Apr', score: 8.5 },
                        { month: 'May', score: 8.7 },
                        { month: 'Jun', score: 8.8 },
                        { month: 'Jul', score: 8.9 },
                        { month: 'Aug', score: 9.0 },
                        { month: 'Sep', score: 9.1 },
                        { month: 'Oct', score: 9.1 },
                        { month: 'Nov', score: 9.2 },
                        { month: 'Dec', score: 9.3 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[8, 10]} />
                      <Tooltip formatter={(value) => [`${value}`, 'Satisfaction Score']} />
                      <Line type="monotone" dataKey="score" stroke="#FF8042" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}