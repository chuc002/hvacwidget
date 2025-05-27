import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/authContext";
import { Link } from "wouter";
import { 
  BarChart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  Activity,
  Crown,
  Zap,
  TrendingUp
} from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();
  
  // Sample data - in a real app, this would come from API calls
  const stats = {
    monthlyCustomers: 87,
    activeWidgets: 3,
    revenue: 4290,
    growth: 12.5,
    subscriptionRate: 68,
    trialConversions: 42,
    upcomingRenewals: 14,
    activeTrials: 8
  };

  // Trial status - would come from user data in real app
  const isTrialUser = true;
  const trialDaysRemaining = 12;
  const currentPlan = "Trial";

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.companyName || user?.name || "User"}!
            </h1>
            <p className="text-blue-100 mt-2">
              Your ServicePlan Pro dashboard is ready to help you grow maintenance plan sales.
            </p>
            {isTrialUser && (
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                  <Zap className="w-3 h-3 mr-1" />
                  Trial: {trialDaysRemaining} days remaining
                </Badge>
              </div>
            )}
          </div>
          {isTrialUser && (
            <div className="text-right">
              <Link href="/billing">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
              <p className="text-blue-100 text-sm mt-2">
                Unlock unlimited widgets & customers
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trial Upgrade Banner */}
      {isTrialUser && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">
                    Ready to start selling maintenance plans?
                  </h3>
                  <p className="text-orange-700 mt-1">
                    Upgrade to unlock unlimited widgets, advanced analytics, and priority support.
                  </p>
                </div>
              </div>
              <Link href="/billing">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Choose Your Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Setup Guide for New Users */}
      <Card>
        <CardHeader>
          <CardTitle>Get Started in 3 Steps</CardTitle>
          <CardDescription>
            Complete these steps to start collecting maintenance plan subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold mb-2">Customize Your Widget</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Design maintenance plans that match your services
              </p>
              <Link href="/customize">
                <Button variant="outline" size="sm">
                  Start Customizing
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold mb-2">Connect Payments</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Link your bank account to receive payments
              </p>
              <Link href="/payment-setup">
                <Button variant="outline" size="sm">
                  Setup Payments
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold mb-2">Embed on Website</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add the widget to your website in minutes
              </p>
              <Link href="/customize">
                <Button variant="outline" size="sm">
                  Get Embed Code
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.growth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.revenue}</div>
                <div className="flex items-center pt-1">
                  <ArrowUpRight className="mr-1 h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs text-green-500">+8.2%</span>
                  <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subscriptionRate}%</div>
                <Progress value={stats.subscriptionRate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Widgets
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeWidgets}</div>
                <p className="text-xs text-muted-foreground">
                  Across {stats.activeWidgets} service locations
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue from your maintenance plans
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center border-b">
                  <div className="text-muted-foreground">Revenue chart goes here</div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="ml-1 text-xs text-muted-foreground">Subscriptions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="ml-1 text-xs text-muted-foreground">Products</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="ml-1 text-xs text-muted-foreground">Invoices</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest customer interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New customer signup</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-100">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Subscription payment received</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-amber-100">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Plan renewal scheduled</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of your customer acquisition and retention
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Select "Analytics" from the sidebar for detailed analytics</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Performance</CardTitle>
              <CardDescription>
                Metrics on customer engagement with your widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Select "Customize Widget" from the sidebar to manage your widgets</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}