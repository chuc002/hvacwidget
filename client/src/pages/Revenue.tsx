import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, Calendar, Download, Eye } from 'lucide-react';

// Mock data for demonstration - this would come from real API calls
const revenueData = {
  currentMonth: {
    total: 12450,
    subscriptions: 34,
    growth: 23.5
  },
  lastMonth: {
    total: 10100,
    subscriptions: 28,
    growth: 18.2
  },
  yearToDate: {
    total: 98750,
    subscriptions: 285,
    averagePerCustomer: 346
  }
};

const recentTransactions = [
  { id: 1, customer: 'Johnson Family', plan: 'Premium HVAC Care', amount: 299, date: '2024-01-15', status: 'completed' },
  { id: 2, customer: 'Smith Residence', plan: 'Basic Maintenance', amount: 149, date: '2024-01-14', status: 'completed' },
  { id: 3, customer: 'Brown Property', plan: 'Premium HVAC Care', amount: 299, date: '2024-01-14', status: 'completed' },
  { id: 4, customer: 'Davis Home', plan: 'Standard Service', amount: 199, date: '2024-01-13', status: 'completed' },
  { id: 5, customer: 'Wilson Estate', plan: 'Premium HVAC Care', amount: 299, date: '2024-01-12', status: 'pending' },
];

const subscriptionPlans = [
  { name: 'Basic Maintenance', subscribers: 12, monthlyRevenue: 1788, price: 149 },
  { name: 'Standard Service', subscribers: 8, monthlyRevenue: 1592, price: 199 },
  { name: 'Premium HVAC Care', subscribers: 14, monthlyRevenue: 4186, price: 299 },
];

export default function Revenue() {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revenue Dashboard</h1>
        <p className="text-muted-foreground">
          Track your subscription revenue and monitor business performance.
        </p>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.currentMonth.total)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{revenueData.currentMonth.growth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.currentMonth.subscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +{revenueData.currentMonth.subscriptions - revenueData.lastMonth.subscriptions} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.yearToDate.total)}</div>
            <p className="text-xs text-muted-foreground">
              Avg {formatCurrency(revenueData.yearToDate.averagePerCustomer)} per customer
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="plans">Plan Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Track your recurring revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">January 2024</p>
                      <p className="text-sm text-muted-foreground">Current month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{formatCurrency(revenueData.currentMonth.total)}</p>
                      <Badge variant="secondary" className="text-green-600">
                        +{revenueData.currentMonth.growth}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">December 2023</p>
                      <p className="text-sm text-muted-foreground">Last month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{formatCurrency(revenueData.lastMonth.total)}</p>
                      <Badge variant="outline">
                        +{revenueData.lastMonth.growth}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your revenue streams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Revenue Report
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Payout
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
                
                <Button className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Optimize Pricing
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest subscription payments and renewals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-muted-foreground">{transaction.plan}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Performance</CardTitle>
              <CardDescription>See how each subscription plan is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionPlans.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.subscribers} active subscribers
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                        <p className="font-bold">{formatCurrency(plan.monthlyRevenue)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-bold">{formatCurrency(plan.price)}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}