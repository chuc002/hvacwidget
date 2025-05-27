import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Download, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export default function Billing() {
  const currentPlan = {
    name: 'Professional',
    price: 699,
    interval: 'monthly',
    nextBilling: '2024-02-15',
    status: 'active'
  };

  const billingHistory = [
    { id: 1, date: '2024-01-15', amount: 699, status: 'paid', invoice: 'INV-2024-001' },
    { id: 2, date: '2023-12-15', amount: 699, status: 'paid', invoice: 'INV-2023-012' },
    { id: 3, date: '2023-11-15', amount: 699, status: 'paid', invoice: 'INV-2023-011' },
    { id: 4, date: '2023-10-15', amount: 699, status: 'paid', invoice: 'INV-2023-010' },
  ];

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Plan Management</h1>
        <p className="text-muted-foreground">
          Manage your ServicePlan Pro subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{currentPlan.name}</h3>
              <p className="text-2xl font-bold">{formatCurrency(currentPlan.price)}</p>
              <p className="text-sm text-muted-foreground">per {currentPlan.interval}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Next Billing Date</h4>
              <p className="text-lg">{formatDate(currentPlan.nextBilling)}</p>
              <p className="text-sm text-muted-foreground">Auto-renewal enabled</p>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline" className="w-full">
                Change Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="billing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{bill.invoice}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(bill.date)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(bill.amount)}</p>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Usage</CardTitle>
                <CardDescription>Your usage this billing period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Widget Embeds</span>
                    <span className="font-medium">2,450 / Unlimited</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer Records</span>
                    <span className="font-medium">342 / Unlimited</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Email Notifications</span>
                    <span className="font-medium">1,823 / Unlimited</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>What's included in your Professional plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Unlimited widget customizations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Advanced revenue analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Custom branding removal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    API access for integrations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Manage your billing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-renewal</p>
                    <p className="text-sm text-muted-foreground">Automatically renew subscription</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Receipts</p>
                    <p className="text-sm text-muted-foreground">Send receipts to your email</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Usage Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify when approaching limits</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Actions that cannot be undone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="font-medium text-red-900">Cancel Subscription</p>
                  </div>
                  <p className="text-sm text-red-800 mb-3">
                    This will cancel your subscription at the end of the current billing period.
                  </p>
                  <Button variant="destructive" size="sm">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}