import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Check } from "lucide-react";

interface EmbedCodeGeneratorProps {
  customerId: string;
  companyName: string;
  planId: string;
}

export default function EmbedCodeGenerator({ customerId, companyName, planId }: EmbedCodeGeneratorProps) {
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('600px');
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe');
  const [displayMode, setDisplayMode] = useState<'inline' | 'popup' | 'floating'>('inline');
  const [primaryColor, setPrimaryColor] = useState('#0070f3');
  const [showHeader, setShowHeader] = useState(true);
  const [customDomain, setCustomDomain] = useState('');
  const [copied, setCopied] = useState<boolean>(false);
  
  const baseUrl = window.location.origin;
  
  // Base embed URL with customer ID and company name
  const embedUrl = `${baseUrl}/embed?customerId=${customerId}&company=${encodeURIComponent(companyName)}&primaryColor=${encodeURIComponent(primaryColor)}&mode=${displayMode}`;
  
  // Generate iframe code
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
</iframe>`;

  // Generate JavaScript embed code
  const scriptCode = `<div id="serviceplan-widget"></div>
<script src="${baseUrl}/embed.js" 
  data-customer-id="${customerId}"
  data-company="${companyName}"
  data-mode="${displayMode}"
  data-color="${primaryColor}"
  data-width="${width}"
  data-height="${height}"
  data-show-header="${showHeader}">
</script>`;

  // Handle copy button click
  const handleCopy = () => {
    const codeToCopy = embedType === 'iframe' ? iframeCode : scriptCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Widget Embed Code</CardTitle>
          <CardDescription>
            Use this code to embed the ServicePlan Pro widget on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configuration" className="space-y-4">
            <TabsList>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Get Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configuration" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="embed-type">Embed Type</Label>
                  <Select 
                    value={embedType} 
                    onValueChange={(value) => setEmbedType(value as 'iframe' | 'script')}
                  >
                    <SelectTrigger id="embed-type">
                      <SelectValue placeholder="Select embed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iframe">iFrame (Simple)</SelectItem>
                      <SelectItem value="script">JavaScript (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {embedType === 'iframe' 
                      ? 'Simple to implement but with limited flexibility.' 
                      : 'More flexible and allows dynamic configuration.'}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="display-mode">Display Mode</Label>
                  <Select 
                    value={displayMode} 
                    onValueChange={(value) => setDisplayMode(value as 'inline' | 'popup' | 'floating')}
                  >
                    <SelectTrigger id="display-mode">
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inline">Inline (Embedded on page)</SelectItem>
                      <SelectItem value="popup">Popup (Opens in modal)</SelectItem>
                      <SelectItem value="floating">Floating Button</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input 
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-header" className="cursor-pointer">Show Widget Header</Label>
                  <Switch 
                    id="show-header" 
                    checked={showHeader}
                    onCheckedChange={setShowHeader}
                  />
                </div>
                
                {/* Additional fields for Professional/Enterprise plans */}
                {(planId === 'professional' || planId === 'enterprise') && (
                  <div>
                    <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                    <Input 
                      id="custom-domain"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="widget.yourcompany.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Pro/Enterprise feature: Host the widget on your own domain.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-4">Widget Preview:</p>
                <div className="border rounded-lg overflow-hidden" style={{maxWidth: '100%', height: '400px'}}>
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code">
              <div className="space-y-4">
                <Textarea
                  value={embedType === 'iframe' ? iframeCode : scriptCode}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
                
                <Button 
                  onClick={handleCopy}
                  className="w-full"
                  variant={copied ? "outline" : "default"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy {embedType === 'iframe' ? 'iframe' : 'JavaScript'} Code
                    </>
                  )}
                </Button>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Implementation Tips</h4>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li>• Place the embed code in the section of your website where you want the widget to appear.</li>
                    <li>• For the JavaScript version, make sure to add it before the closing &lt;/body&gt; tag.</li>
                    <li>• Need help? Contact our support team for assistance with implementation.</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}