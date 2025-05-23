import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { ArrowRight, CheckCircle, Code, Copy, ExternalLink, Settings, Home } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function WelcomeFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('welcome');
  const [widgetSettings, setWidgetSettings] = useState({
    companyName: '',
    primaryColor: '#2563eb',
    companyLogo: '',
    defaultPlan: 'premium',
    showPrices: true,
    collectAddress: true,
    allowAnnual: true
  });
  
  const embedOptions = {
    iframe: `<iframe src="https://service-plan-pro.replit.app/widget?company=${encodeURIComponent(widgetSettings.companyName)}" width="100%" height="600" frameborder="0"></iframe>`,
    javascript: `<script src="https://service-plan-pro.replit.app/embed.js" data-company="${widgetSettings.companyName}" data-color="${widgetSettings.primaryColor.replace('#', '')}"></script>`,
  };

  const handleNextTab = () => {
    if (activeTab === 'welcome') setActiveTab('customize');
    else if (activeTab === 'customize') setActiveTab('embed');
    else if (activeTab === 'embed') setActiveTab('launch');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ 
      title: "Code copied!",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  const handleComplete = () => {
    toast({
      title: "Congratulations!",
      description: "Your widget is now live and ready to accept subscriptions!",
    });
    setTimeout(() => setLocation('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to ServicePlan Pro</h1>
          <p className="text-gray-600">Let's set up your subscription widget in just a few steps</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Setup Progress</h2>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${activeTab === 'welcome' || activeTab === 'customize' || activeTab === 'embed' || activeTab === 'launch' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${activeTab === 'customize' || activeTab === 'embed' || activeTab === 'launch' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${activeTab === 'embed' || activeTab === 'launch' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${activeTab === 'launch' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-2">
            <TabsTrigger value="welcome" className="py-3">
              <CheckCircle className={`h-5 w-5 mr-2 ${activeTab === 'welcome' || activeTab === 'customize' || activeTab === 'embed' || activeTab === 'launch' ? 'text-green-500' : 'text-gray-400'}`} />
              Welcome
            </TabsTrigger>
            <TabsTrigger value="customize" className="py-3">
              <Settings className={`h-5 w-5 mr-2 ${activeTab === 'customize' || activeTab === 'embed' || activeTab === 'launch' ? 'text-green-500' : 'text-gray-400'}`} />
              Customize
            </TabsTrigger>
            <TabsTrigger value="embed" className="py-3">
              <Code className={`h-5 w-5 mr-2 ${activeTab === 'embed' || activeTab === 'launch' ? 'text-green-500' : 'text-gray-400'}`} />
              Embed
            </TabsTrigger>
            <TabsTrigger value="launch" className="py-3">
              <ExternalLink className={`h-5 w-5 mr-2 ${activeTab === 'launch' ? 'text-green-500' : 'text-gray-400'}`} />
              Launch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="p-6 bg-white rounded-lg shadow">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to ServicePlan Pro!</h2>
                <p className="text-gray-600">We're excited to help you add subscription revenue to your service business.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
                        <Settings className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">Customize</h3>
                      <p className="text-sm text-gray-500">Configure your widget to match your brand</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
                        <Code className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">Embed</h3>
                      <p className="text-sm text-gray-500">Add the widget to your website</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
                        <Home className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">Launch</h3>
                      <p className="text-sm text-gray-500">Start accepting subscription payments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-2">Your trial includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Full access to the subscription widget
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Unlimited customer signups (during trial)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Email support
                  </li>
                </ul>
              </div>

              <div className="text-center mt-8">
                <Button onClick={handleNextTab} className="px-8 py-6 text-lg">
                  Let's Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="p-6 bg-white rounded-lg shadow">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Customize Your Widget</h2>
                <p className="text-gray-600">Make the widget your own by customizing it to match your brand.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={widgetSettings.companyName} 
                      onChange={(e) => setWidgetSettings({...widgetSettings, companyName: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="ABC Pest Control"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <div className="flex space-x-2">
                      <input 
                        type="color" 
                        value={widgetSettings.primaryColor} 
                        onChange={(e) => setWidgetSettings({...widgetSettings, primaryColor: e.target.value})}
                        className="h-10 w-10"
                      />
                      <input 
                        type="text" 
                        value={widgetSettings.primaryColor} 
                        onChange={(e) => setWidgetSettings({...widgetSettings, primaryColor: e.target.value})}
                        className="flex-1 p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Logo URL</label>
                    <input 
                      type="text" 
                      value={widgetSettings.companyLogo} 
                      onChange={(e) => setWidgetSettings({...widgetSettings, companyLogo: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="https://yourcompany.com/logo.png"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Selected Plan</label>
                      <select 
                        value={widgetSettings.defaultPlan} 
                        onChange={(e) => setWidgetSettings({...widgetSettings, defaultPlan: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="basic">Basic Plan</option>
                        <option value="premium">Premium Plan</option>
                        <option value="ultimate">Ultimate Plan</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={widgetSettings.showPrices} 
                          onChange={(e) => setWidgetSettings({...widgetSettings, showPrices: e.target.checked})}
                          className="mr-2"
                        />
                        Show prices on widget
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={widgetSettings.collectAddress} 
                          onChange={(e) => setWidgetSettings({...widgetSettings, collectAddress: e.target.checked})}
                          className="mr-2"
                        />
                        Collect customer address
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={widgetSettings.allowAnnual} 
                          onChange={(e) => setWidgetSettings({...widgetSettings, allowAnnual: e.target.checked})}
                          className="mr-2"
                        />
                        Allow annual subscriptions
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-4">Widget Preview</h3>
                <div className="border rounded-lg bg-white p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Preview will reflect your customizations</p>
                    <div 
                      className="py-2 px-4 rounded-md" 
                      style={{backgroundColor: widgetSettings.primaryColor, color: '#fff'}}
                    >
                      {widgetSettings.companyName || 'Your Company'} Maintenance Plans
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button onClick={handleNextTab} className="px-8 py-6 text-lg">
                  Continue to Embed
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="p-6 bg-white rounded-lg shadow">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Add Widget to Your Website</h2>
                <p className="text-gray-600">Choose how you want to embed the widget on your website.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Option 1: Embed with iframe</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopyCode(embedOptions.iframe)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm"><code>{embedOptions.iframe}</code></pre>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Simple to use. Just copy and paste this code where you want the widget to appear.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Option 2: JavaScript Embed (Recommended)</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopyCode(embedOptions.javascript)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm"><code>{embedOptions.javascript}</code></pre>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Our recommended option. Add this code before the closing &lt;/body&gt; tag.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Need help embedding?</h3>
                  <p className="text-blue-700 mb-4">
                    We can help you embed the widget on your website. Schedule a call with our team for assistance.
                  </p>
                  <Button variant="outline" className="bg-white border-blue-500 text-blue-600 hover:bg-blue-50">
                    Schedule Implementation Call
                  </Button>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button onClick={handleNextTab} className="px-8 py-6 text-lg">
                  Continue to Launch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="launch" className="p-6 bg-white rounded-lg shadow">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Launch!</h2>
                <p className="text-gray-600">Your widget is ready to go. Here's your final launch checklist.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Launch Checklist</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Widget Customization</p>
                      <p className="text-sm text-green-700">Your widget is customized with your branding.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Embed Code Generated</p>
                      <p className="text-sm text-green-700">Your embed code is ready to be added to your website.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Stripe Integration</p>
                      <p className="text-sm text-green-700">Your account is connected to Stripe for payment processing.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Free Trial Active</p>
                      <p className="text-sm text-green-700">Your 14-day trial is active. No credit card required during trial.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Technical Setup</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Add the widget to your website
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Test a subscription purchase
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Verify webhook notifications
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Marketing</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Announce maintenance plans to customers
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Highlight benefits on service pages
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                        Add a dedicated maintenance plan page
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button onClick={handleComplete} className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700">
                  Complete Setup
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}