import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Types for customization
interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logo?: string;
  favicon?: string;
  backgroundImage?: string;
  fontFamily: string;
  headerFont: string;
  customCSS?: string;
}

interface ContentConfig {
  companyName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  serviceType: 'pest-control' | 'lawn-care' | 'hvac' | 'pool-service' | 'cleaning' | 'custom';
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  thankYouMessage: string;
  termsOfService?: string;
  privacyPolicy?: string;
}

interface PricingConfig {
  currency: 'USD' | 'CAD' | 'EUR';
  plans: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    interval: 'month' | 'quarter' | 'year';
    features: string[];
    isPopular?: boolean;
    stripePriceId: string;
  }>;
  allowMonthly: boolean;
  allowAnnual: boolean;
  annualDiscount?: number;
  stripeAccountId: string;
  acceptsCreditCards: boolean;
  acceptsACH: boolean;
}

interface LeadConfig {
  collectName: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  collectAddress: boolean;
  collectPropertyType: boolean;
  collectPropertySize: boolean;
  collectCurrentProvider: boolean;
  collectPreferredTime: boolean;
  collectSpecialInstructions: boolean;
  customFields: Array<{
    id: string;
    label: string;
    type: 'text' | 'select' | 'checkbox' | 'textarea';
    required: boolean;
    options?: string[];
  }>;
  emailNotifications: string[];
  webhookUrl?: string;
  zapierWebhook?: string;
}

interface IntegrationConfig {
  crmType?: 'hubspot' | 'salesforce' | 'zoho' | 'custom';
  crmApiKey?: string;
  crmWebhook?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  zapierEnabled: boolean;
  zapierWebhooks: {
    onNewLead?: string;
    onNewSubscription?: string;
    onCancelledSubscription?: string;
  };
  slackWebhook?: string;
  emailProvider?: 'mailchimp' | 'constant-contact' | 'sendgrid' | 'custom';
  emailApiKey?: string;
  emailListId?: string;
}

interface Config {
  branding: BrandingConfig;
  content: ContentConfig;
  pricing: PricingConfig;
  leads: LeadConfig;
  integrations: IntegrationConfig;
}

export default function Customize() {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  
  // Default configuration - this would be loaded from the database in reality
  const [config, setConfig] = useState<Config>({
    branding: {
      primaryColor: '#0f766e',
      secondaryColor: '#f97316',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      fontFamily: 'inter',
      headerFont: 'inter'
    },
    content: {
      companyName: 'Premium Home Services',
      tagline: 'Professional home maintenance plans',
      description: 'Keep your home systems running smoothly with our professional maintenance plans.',
      phone: '(555) 123-4567',
      email: 'info@premiumhomeservices.com',
      address: '123 Main St, Chicago, IL 60601',
      website: 'www.premiumhomeservices.com',
      serviceType: 'hvac',
      heroTitle: 'Professional Service Plans',
      heroSubtitle: 'Keep your home systems running at peak efficiency',
      ctaText: 'Subscribe Now',
      thankYouMessage: 'Thank you for subscribing to our service plan!'
    },
    pricing: {
      currency: 'USD',
      plans: [
        {
          id: 'basic',
          name: 'Basic Plan',
          description: 'Essential maintenance for your home',
          price: 19.99,
          interval: 'month',
          features: [
            'Seasonal maintenance check',
            'Priority scheduling',
            'Discount on repairs',
            'Email support'
          ],
          stripePriceId: 'price_basic_monthly'
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          description: 'Complete protection for your home',
          price: 39.99,
          interval: 'month',
          features: [
            'Quarterly maintenance check',
            'Priority scheduling',
            'Discount on repairs',
            'Phone and email support',
            'Extended warranty on repairs'
          ],
          isPopular: true,
          stripePriceId: 'price_premium_monthly'
        },
        {
          id: 'ultimate',
          name: 'Ultimate Plan',
          description: 'Complete protection with no worries',
          price: 59.99,
          interval: 'month',
          features: [
            'Monthly maintenance check',
            'Same-day emergency service',
            'High discount on repairs',
            '24/7 phone and email support',
            'Full parts and labor warranty',
            'Annual equipment inspection'
          ],
          stripePriceId: 'price_ultimate_monthly'
        }
      ],
      allowMonthly: true,
      allowAnnual: true,
      annualDiscount: 15,
      stripeAccountId: 'acct_123456',
      acceptsCreditCards: true,
      acceptsACH: true
    },
    leads: {
      collectName: true,
      collectEmail: true,
      collectPhone: true,
      collectAddress: true,
      collectPropertyType: true,
      collectPropertySize: false,
      collectCurrentProvider: false,
      collectPreferredTime: true,
      collectSpecialInstructions: false,
      customFields: [],
      emailNotifications: ['admin@premiumhomeservices.com']
    },
    integrations: {
      zapierEnabled: false,
      zapierWebhooks: {}
    }
  });

  const handleColorChange = (colorType: keyof BrandingConfig, color: string) => {
    setConfig({
      ...config,
      branding: { ...config.branding, [colorType]: color }
    });
  };

  const handleSave = async () => {
    try {
      // In a real app, this would save to the database
      const response = await apiRequest('POST', '/api/customers/config', config);
      
      if (response.ok) {
        toast({
          title: 'Settings saved successfully!',
          description: 'Your widget customizations have been updated.',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addCustomField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text' as const,
      required: false
    };
    
    setConfig({
      ...config,
      leads: {
        ...config.leads,
        customFields: [...config.leads.customFields, newField]
      }
    });
  };

  const removeCustomField = (id: string) => {
    setConfig({
      ...config,
      leads: {
        ...config.leads,
        customFields: config.leads.customFields.filter(field => field.id !== id)
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customize Your Widget</h1>
          <p className="text-gray-600">Make your subscription widget match your brand and business needs</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {previewMode ? (
        <div className="mt-8 bg-gray-100 p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Widget Preview</h2>
          <div className="aspect-video bg-white rounded-lg shadow-md flex items-center justify-center">
            <p className="text-gray-500">Preview of your widget with current customizations</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Plans</TabsTrigger>
            <TabsTrigger value="leads">Lead Collection</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* BRANDING TAB */}
          <TabsContent value="branding">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Customize the colors to match your brand identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-8 w-8 rounded-md border cursor-pointer" 
                        style={{ backgroundColor: config.branding.primaryColor }}
                        onClick={() => {
                          // In a real app, this would open a color picker
                          const color = prompt('Enter primary color (hex)', config.branding.primaryColor);
                          if (color) handleColorChange('primaryColor', color);
                        }}
                      />
                      <Input 
                        id="primaryColor"
                        value={config.branding.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-8 w-8 rounded-md border cursor-pointer" 
                        style={{ backgroundColor: config.branding.secondaryColor }}
                        onClick={() => {
                          const color = prompt('Enter secondary color (hex)', config.branding.secondaryColor);
                          if (color) handleColorChange('secondaryColor', color);
                        }}
                      />
                      <Input 
                        id="secondaryColor"
                        value={config.branding.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-8 w-8 rounded-md border cursor-pointer" 
                        style={{ backgroundColor: config.branding.accentColor }}
                        onClick={() => {
                          const color = prompt('Enter accent color (hex)', config.branding.accentColor);
                          if (color) handleColorChange('accentColor', color);
                        }}
                      />
                      <Input 
                        id="accentColor"
                        value={config.branding.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo & Images</CardTitle>
                  <CardDescription>Upload your company logo and background images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <Input 
                      id="logo" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        // In a real app, this would upload the file to a storage service
                        toast({
                          title: "Upload feature",
                          description: "In the real app, this would upload your logo to our servers."
                        });
                      }}
                    />
                    <p className="text-sm text-gray-500">Recommended: 200x60px PNG with transparent background</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backgroundImage">Background Image (Optional)</Label>
                    <Input id="backgroundImage" type="file" accept="image/*" />
                    <p className="text-sm text-gray-500">This will be shown in the hero section of your widget</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Customize fonts and text styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Base Font</Label>
                    <Select 
                      value={config.branding.fontFamily}
                      onValueChange={(value) => setConfig({
                        ...config,
                        branding: { ...config.branding, fontFamily: value }
                      })}
                    >
                      <SelectTrigger id="fontFamily">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter (Default)</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="open-sans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customCSS">Custom CSS (Advanced)</Label>
                    <Textarea 
                      id="customCSS"
                      placeholder="/* Add custom CSS here */"
                      className="font-mono text-sm h-32"
                      value={config.branding.customCSS || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        branding: { ...config.branding, customCSS: e.target.value }
                      })}
                    />
                    <p className="text-sm text-gray-500">For advanced users who want complete control over styling</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CONTENT TAB */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Basic details about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName"
                      value={config.content.companyName}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, companyName: e.target.value }
                      })}
                      placeholder="Premium Home Services"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input 
                      id="tagline"
                      value={config.content.tagline}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, tagline: e.target.value }
                      })}
                      placeholder="Professional home maintenance plans"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={config.content.description}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, description: e.target.value }
                      })}
                      placeholder="Brief description of your service"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select 
                      value={config.content.serviceType}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        content: { ...config.content, serviceType: value }
                      })}
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hvac">HVAC Services</SelectItem>
                        <SelectItem value="pest-control">Pest Control</SelectItem>
                        <SelectItem value="lawn-care">Lawn Care</SelectItem>
                        <SelectItem value="pool-service">Pool Service</SelectItem>
                        <SelectItem value="cleaning">Cleaning Service</SelectItem>
                        <SelectItem value="custom">Other/Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How customers can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={config.content.phone}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, phone: e.target.value }
                      })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={config.content.email}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, email: e.target.value }
                      })}
                      placeholder="info@yourcompany.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input 
                      id="address"
                      value={config.content.address}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, address: e.target.value }
                      })}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      value={config.content.website}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, website: e.target.value }
                      })}
                      placeholder="www.yourcompany.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Widget Text</CardTitle>
                  <CardDescription>Customize key text elements in your widget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Hero Title</Label>
                    <Input 
                      id="heroTitle"
                      value={config.content.heroTitle}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, heroTitle: e.target.value }
                      })}
                      placeholder="Professional Service Plans"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                    <Input 
                      id="heroSubtitle"
                      value={config.content.heroSubtitle}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, heroSubtitle: e.target.value }
                      })}
                      placeholder="Keep your home systems running at peak efficiency"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">Call to Action Text</Label>
                    <Input 
                      id="ctaText"
                      value={config.content.ctaText}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, ctaText: e.target.value }
                      })}
                      placeholder="Subscribe Now"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thankYouMessage">Thank You Message</Label>
                    <Textarea 
                      id="thankYouMessage"
                      value={config.content.thankYouMessage}
                      onChange={(e) => setConfig({
                        ...config,
                        content: { ...config.content, thankYouMessage: e.target.value }
                      })}
                      placeholder="Thank you for subscribing to our service plan!"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PRICING TAB */}
          <TabsContent value="pricing">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Options</CardTitle>
                  <CardDescription>Configure your subscription billing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={config.pricing.currency}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, currency: value }
                      })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowMonthly">Allow Monthly Billing</Label>
                    <Switch 
                      id="allowMonthly"
                      checked={config.pricing.allowMonthly}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, allowMonthly: checked }
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowAnnual">Allow Annual Billing</Label>
                    <Switch 
                      id="allowAnnual"
                      checked={config.pricing.allowAnnual}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, allowAnnual: checked }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="annualDiscount">Annual Discount (%)</Label>
                    <Input 
                      id="annualDiscount"
                      type="number"
                      min="0"
                      max="100"
                      value={config.pricing.annualDiscount || 0}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, annualDiscount: parseInt(e.target.value) || 0 }
                      })}
                    />
                    <p className="text-sm text-gray-500">Discount applied to annual plans (e.g., 15 = 15% off)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure your payment processing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripeAccountId">Stripe Account ID</Label>
                    <Input 
                      id="stripeAccountId"
                      value={config.pricing.stripeAccountId}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, stripeAccountId: e.target.value }
                      })}
                      placeholder="acct_123456"
                    />
                    <p className="text-sm text-gray-500">Your Stripe Connect account ID</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="acceptsCreditCards">Accept Credit Cards</Label>
                    <Switch 
                      id="acceptsCreditCards"
                      checked={config.pricing.acceptsCreditCards}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, acceptsCreditCards: checked }
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="acceptsACH">Accept ACH (Bank Transfers)</Label>
                    <Switch 
                      id="acceptsACH"
                      checked={config.pricing.acceptsACH}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, acceptsACH: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Subscription Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {config.pricing.plans.map((plan, index) => (
                <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <span className="bg-primary px-3 py-1 text-white text-xs rounded-full">Most Popular</span>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => {
                        // In a real app, this would have proper plan editing
                        toast({
                          title: "Plan Editor",
                          description: "In the full app, this would open a plan editor"
                        });
                      }}>
                        Edit
                      </Button>
                    </div>
                    <CardDescription>
                      <div>
                        <span className="text-2xl font-bold">${plan.price}</span>
                        <span className="text-gray-500">/{plan.interval}</span>
                      </div>
                      <p className="mt-1">{plan.description}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={() => {
                // In a real app, this would open a modal to add a new plan
                toast({
                  title: "Add Plan Feature",
                  description: "In the full app, this would open a plan creation modal"
                });
              }}>
                Add New Plan
              </Button>
            </div>
          </TabsContent>

          {/* LEAD COLLECTION TAB */}
          <TabsContent value="leads">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Fields</CardTitle>
                  <CardDescription>Configure what information to collect from customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Standard Fields</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectName">Full Name</Label>
                        <Switch 
                          id="collectName"
                          checked={config.leads.collectName}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectName: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectEmail">Email Address</Label>
                        <Switch 
                          id="collectEmail"
                          checked={config.leads.collectEmail}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectEmail: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectPhone">Phone Number</Label>
                        <Switch 
                          id="collectPhone"
                          checked={config.leads.collectPhone}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectPhone: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectAddress">Address</Label>
                        <Switch 
                          id="collectAddress"
                          checked={config.leads.collectAddress}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectAddress: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Additional Fields</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectPropertyType">Property Type</Label>
                        <Switch 
                          id="collectPropertyType"
                          checked={config.leads.collectPropertyType}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectPropertyType: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectPropertySize">Property Size</Label>
                        <Switch 
                          id="collectPropertySize"
                          checked={config.leads.collectPropertySize}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectPropertySize: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectCurrentProvider">Current Provider</Label>
                        <Switch 
                          id="collectCurrentProvider"
                          checked={config.leads.collectCurrentProvider}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectCurrentProvider: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectPreferredTime">Preferred Contact Time</Label>
                        <Switch 
                          id="collectPreferredTime"
                          checked={config.leads.collectPreferredTime}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectPreferredTime: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="collectSpecialInstructions">Special Instructions</Label>
                        <Switch 
                          id="collectSpecialInstructions"
                          checked={config.leads.collectSpecialInstructions}
                          onCheckedChange={(checked) => setConfig({
                            ...config,
                            leads: { ...config.leads, collectSpecialInstructions: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Fields</CardTitle>
                  <CardDescription>Add additional fields specific to your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {config.leads.customFields.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p>No custom fields added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {config.leads.customFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{field.label}</p>
                            <p className="text-sm text-gray-500">Type: {field.type}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCustomField(field.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button onClick={addCustomField}>Add Custom Field</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Notifications</CardTitle>
                  <CardDescription>Configure how you receive lead notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Input 
                      id="emailNotifications"
                      value={config.leads.emailNotifications.join(', ')}
                      onChange={(e) => setConfig({
                        ...config,
                        leads: { ...config.leads, emailNotifications: e.target.value.split(',').map(email => email.trim()) }
                      })}
                      placeholder="email1@example.com, email2@example.com"
                    />
                    <p className="text-sm text-gray-500">Comma-separated list of emails to notify</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                    <Input 
                      id="webhookUrl"
                      value={config.leads.webhookUrl || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        leads: { ...config.leads, webhookUrl: e.target.value }
                      })}
                      placeholder="https://your-webhook-url.com/api/endpoint"
                    />
                    <p className="text-sm text-gray-500">POST lead data to your custom endpoint</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zapierWebhook">Zapier Webhook (Optional)</Label>
                    <Input 
                      id="zapierWebhook"
                      value={config.leads.zapierWebhook || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        leads: { ...config.leads, zapierWebhook: e.target.value }
                      })}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                    />
                    <p className="text-sm text-gray-500">Connect to your Zapier workflow</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CRM Integration</CardTitle>
                  <CardDescription>Connect your widget to your CRM system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crmType">CRM Provider</Label>
                    <Select 
                      value={config.integrations.crmType || ''}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        integrations: { ...config.integrations, crmType: value }
                      })}
                    >
                      <SelectTrigger id="crmType">
                        <SelectValue placeholder="Select CRM provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Integration</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="zoho">Zoho CRM</SelectItem>
                        <SelectItem value="custom">Custom/Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {config.integrations.crmType && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="crmApiKey">API Key</Label>
                        <Input 
                          id="crmApiKey"
                          type="password"
                          value={config.integrations.crmApiKey || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { ...config.integrations, crmApiKey: e.target.value }
                          })}
                          placeholder="Enter your CRM API key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="crmWebhook">Webhook URL (Optional)</Label>
                        <Input 
                          id="crmWebhook"
                          value={config.integrations.crmWebhook || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { ...config.integrations, crmWebhook: e.target.value }
                          })}
                          placeholder="https://your-crm-webhook.com/api/endpoint"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Integration</CardTitle>
                  <CardDescription>Connect analytics tools to track conversions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input 
                      id="googleAnalyticsId"
                      value={config.integrations.googleAnalyticsId || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        integrations: { ...config.integrations, googleAnalyticsId: e.target.value }
                      })}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input 
                      id="facebookPixelId"
                      value={config.integrations.facebookPixelId || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        integrations: { ...config.integrations, facebookPixelId: e.target.value }
                      })}
                      placeholder="XXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zapier Integration</CardTitle>
                  <CardDescription>Connect your widget to hundreds of apps with Zapier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zapierEnabled">Enable Zapier Integration</Label>
                    <Switch 
                      id="zapierEnabled"
                      checked={config.integrations.zapierEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        integrations: { ...config.integrations, zapierEnabled: checked }
                      })}
                    />
                  </div>
                  
                  {config.integrations.zapierEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="onNewLead">On New Lead Webhook</Label>
                        <Input 
                          id="onNewLead"
                          value={config.integrations.zapierWebhooks.onNewLead || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { 
                              ...config.integrations, 
                              zapierWebhooks: {
                                ...config.integrations.zapierWebhooks,
                                onNewLead: e.target.value
                              }
                            }
                          })}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="onNewSubscription">On New Subscription Webhook</Label>
                        <Input 
                          id="onNewSubscription"
                          value={config.integrations.zapierWebhooks.onNewSubscription || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { 
                              ...config.integrations, 
                              zapierWebhooks: {
                                ...config.integrations.zapierWebhooks,
                                onNewSubscription: e.target.value
                              }
                            }
                          })}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Marketing Integration</CardTitle>
                  <CardDescription>Connect your email marketing platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailProvider">Email Provider</Label>
                    <Select 
                      value={config.integrations.emailProvider || ''}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        integrations: { ...config.integrations, emailProvider: value }
                      })}
                    >
                      <SelectTrigger id="emailProvider">
                        <SelectValue placeholder="Select email provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Integration</SelectItem>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="constant-contact">Constant Contact</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="custom">Custom/Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {config.integrations.emailProvider && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="emailApiKey">API Key</Label>
                        <Input 
                          id="emailApiKey"
                          type="password"
                          value={config.integrations.emailApiKey || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { ...config.integrations, emailApiKey: e.target.value }
                          })}
                          placeholder="Enter your email provider API key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emailListId">List/Audience ID</Label>
                        <Input 
                          id="emailListId"
                          value={config.integrations.emailListId || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: { ...config.integrations, emailListId: e.target.value }
                          })}
                          placeholder="ID of the list to add subscribers to"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}