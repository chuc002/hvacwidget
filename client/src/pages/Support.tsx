import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Book, Video, Mail, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Support() {
  const supportTickets = [
    { id: 1, subject: 'Widget not displaying correctly', status: 'open', priority: 'high', created: '2024-01-14', updated: '2024-01-15' },
    { id: 2, subject: 'Payment integration question', status: 'resolved', priority: 'medium', created: '2024-01-10', updated: '2024-01-12' },
    { id: 3, subject: 'Custom branding request', status: 'in_progress', priority: 'low', created: '2024-01-08', updated: '2024-01-14' },
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', description: 'Set up your first widget in 5 minutes', icon: Book },
    { title: 'Widget Customization', description: 'Learn to match your brand perfectly', icon: Video },
    { title: 'Payment Setup', description: 'Configure Stripe integration', icon: Book },
    { title: 'Customer Management', description: 'Organize and track your subscribers', icon: Book },
    { title: 'Revenue Analytics', description: 'Understand your subscription metrics', icon: Video },
    { title: 'Troubleshooting', description: 'Common issues and solutions', icon: Book },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">
          Get help with ServicePlan Pro and manage your support requests.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Live Chat</h3>
                <p className="text-sm text-blue-700">Average response: 2 minutes</p>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Email Support</h3>
                <p className="text-sm text-green-700">Response within 4 hours</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-100">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Phone Support</h3>
                <p className="text-sm text-purple-700">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-purple-600 text-purple-700 hover:bg-purple-100">
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="help" className="space-y-6">
        <TabsList>
          <TabsTrigger value="help">Help Center</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guides</CardTitle>
              <CardDescription>Everything you need to get up and running fast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left"
                  >
                    <link.icon className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground">{link.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>Widget Setup Walkthrough (5 min)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>Customization Best Practices (8 min)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>Revenue Analytics Overview (6 min)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span>Customer Management Tour (4 min)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Widget API</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Processing</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dashboard</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600">Degraded</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Track your support requests and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">#{ticket.id} - {ticket.subject}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Created {ticket.created}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Updated {ticket.updated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
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

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Describe your issue and we'll get back to you quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Feature request</option>
                    <option value="high">High - Bug or service issue</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea 
                  placeholder="Please provide as much detail as possible about your issue, including steps to reproduce if applicable."
                  rows={6}
                />
              </div>
              
              <Button className="w-full md:w-auto">
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before You Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Check our Help Center for common solutions</li>
                <li>• Review your widget embed code for syntax errors</li>
                <li>• Verify your Stripe webhook URLs are configured correctly</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try testing in an incognito/private browsing window</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}