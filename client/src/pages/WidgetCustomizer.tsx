import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, Settings, Palette, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SubscriptionWidget from '@/components/SubscriptionWidget';

export default function WidgetCustomizer() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('Your Business Name');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#1d4ed8');
  const [borderRadius, setBorderRadius] = useState('8');
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [headerText, setHeaderText] = useState('Choose Your Service Plan');
  const [subheaderText, setSubheaderText] = useState('Select the perfect maintenance plan for your home');
  
  const embedCode = `<script src="https://serviceplan-pro.com/widget.js"></script>
<div id="serviceplan-widget" 
     data-company="${companyName}"
     data-theme-primary="${primaryColor}"
     data-theme-accent="${accentColor}"
     data-border-radius="${borderRadius}px"
     data-show-testimonials="${showTestimonials}">
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed Code Copied!",
      description: "Paste this code into your website where you want the widget to appear.",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Widget Customization Studio</h1>
        <p className="text-muted-foreground">
          Customize your subscription widget to match your brand and embed it on your website.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Embed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Settings</CardTitle>
                  <CardDescription>
                    Customize colors and styling to match your brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="border-radius">Border Radius (px)</Label>
                      <Input
                        id="border-radius"
                        type="number"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(e.target.value)}
                        min="0"
                        max="20"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          placeholder="#1d4ed8"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Content</CardTitle>
                  <CardDescription>
                    Customize the text and features displayed in your widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="header-text">Header Text</Label>
                    <Input
                      id="header-text"
                      value={headerText}
                      onChange={(e) => setHeaderText(e.target.value)}
                      placeholder="Choose Your Service Plan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subheader-text">Subheader Text</Label>
                    <Textarea
                      id="subheader-text"
                      value={subheaderText}
                      onChange={(e) => setSubheaderText(e.target.value)}
                      placeholder="Select the perfect maintenance plan for your home"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-testimonials">Show Customer Testimonials</Label>
                      <p className="text-sm text-muted-foreground">
                        Display social proof to increase conversions
                      </p>
                    </div>
                    <Switch
                      id="show-testimonials"
                      checked={showTestimonials}
                      onCheckedChange={setShowTestimonials}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>
                    Copy this code and paste it into your website where you want the widget to appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{embedCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={copyEmbedCode}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Installation Instructions:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Copy the embed code above</li>
                      <li>2. Paste it into your website's HTML where you want the widget</li>
                      <li>3. The widget will automatically load with your customizations</li>
                      <li>4. Test the widget to ensure it's working properly</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your widget will look on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[600px]">
                <div 
                  style={{
                    '--primary-color': primaryColor,
                    '--accent-color': accentColor,
                    '--border-radius': `${borderRadius}px`,
                  } as React.CSSProperties}
                >
                  <SubscriptionWidget 
                    companyName={companyName}
                    isDemo={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Widget Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Use your brand colors for trust and recognition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Keep header text clear and benefit-focused</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Enable testimonials to boost conversion rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Test the widget on mobile devices</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}