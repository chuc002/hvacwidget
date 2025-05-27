import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, UserPlus, Mail, Phone, Calendar, Filter, Download } from 'lucide-react';

// Mock customer data - would come from real API calls
const customers = [
  {
    id: 1,
    name: 'Johnson Family',
    email: 'johnson@email.com',
    phone: '(555) 123-4567',
    plan: 'Premium HVAC Care',
    status: 'active',
    joinDate: '2023-06-15',
    lastPayment: '2024-01-15',
    totalSpent: 1196,
    address: '123 Main St, Dallas, TX'
  },
  {
    id: 2,
    name: 'Smith Residence',
    email: 'smith@email.com',
    phone: '(555) 234-5678',
    plan: 'Basic Maintenance',
    status: 'active',
    joinDate: '2023-08-22',
    lastPayment: '2024-01-14',
    totalSpent: 447,
    address: '456 Oak Ave, Dallas, TX'
  },
  {
    id: 3,
    name: 'Brown Property',
    email: 'brown@email.com',
    phone: '(555) 345-6789',
    plan: 'Standard Service',
    status: 'past_due',
    joinDate: '2023-05-10',
    lastPayment: '2023-12-10',
    totalSpent: 796,
    address: '789 Pine St, Dallas, TX'
  },
  {
    id: 4,
    name: 'Davis Home',
    email: 'davis@email.com',
    phone: '(555) 456-7890',
    plan: 'Premium HVAC Care',
    status: 'active',
    joinDate: '2023-09-30',
    lastPayment: '2024-01-13',
    totalSpent: 897,
    address: '321 Elm Dr, Dallas, TX'
  },
  {
    id: 5,
    name: 'Wilson Estate',
    email: 'wilson@email.com',
    phone: '(555) 567-8901',
    plan: 'Standard Service',
    status: 'canceled',
    joinDate: '2023-03-18',
    lastPayment: '2023-11-18',
    totalSpent: 596,
    address: '654 Maple Ln, Dallas, TX'
  }
];

const customerStats = {
  total: customers.length,
  active: customers.filter(c => c.status === 'active').length,
  pastDue: customers.filter(c => c.status === 'past_due').length,
  canceled: customers.filter(c => c.status === 'canceled').length,
  averageValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
};

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesPlan = planFilter === 'all' || customer.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription customers and track their service plans.
        </p>
      </div>

      {/* Customer Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Due</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.pastDue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Math.round(customerStats.averageValue))}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">All Customers</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="Basic Maintenance">Basic Maintenance</SelectItem>
                    <SelectItem value="Standard Service">Standard Service</SelectItem>
                    <SelectItem value="Premium HVAC Care">Premium HVAC Care</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
              <CardDescription>Manage your customer accounts and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{customer.plan}</p>
                        <p className="text-sm text-muted-foreground">Since {formatDate(customer.joinDate)}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                        <p className="text-sm text-muted-foreground">Total spent</p>
                        <p className="text-sm text-muted-foreground">Last: {formatDate(customer.lastPayment)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Communications</CardTitle>
              <CardDescription>Send emails and manage customer outreach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full md:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Send Newsletter
              </Button>
              
              <Button variant="outline" className="w-full md:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Bulk Import Customers
              </Button>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Welcome new customer</li>
                      <li>• Payment reminder</li>
                      <li>• Service appointment reminder</li>
                      <li>• Renewal notification</li>
                      <li>• Thank you message</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Communications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Newsletter sent to 34 customers</li>
                      <li>• Payment reminders sent to 3 customers</li>
                      <li>• Welcome email sent to 2 new customers</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reports</CardTitle>
              <CardDescription>Generate detailed customer analytics and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Customer Acquisition Report</div>
                    <div className="text-sm text-muted-foreground">Track new customer growth</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Churn Analysis</div>
                    <div className="text-sm text-muted-foreground">Identify at-risk customers</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Revenue by Customer</div>
                    <div className="text-sm text-muted-foreground">Top performing customers</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Plan Performance</div>
                    <div className="text-sm text-muted-foreground">Most popular service plans</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}