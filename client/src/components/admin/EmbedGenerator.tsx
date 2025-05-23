import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function EmbedGenerator() {
  const [companyName, setCompanyName] = useState('Premium Home Services');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('800px');
  
  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embed?company=${encodeURIComponent(companyName)}`;
  
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`;

  const scriptCode = `<div id="serviceplan-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}';
    iframe.width = '${width}';
    iframe.height = '${height}';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('serviceplan-widget').appendChild(iframe);
  })();
</script>`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Widget Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="100%"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="800px"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code (Recommended)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={iframeCode}
            readOnly
            rows={6}
            className="font-mono text-sm"
          />
          <Button 
            onClick={() => navigator.clipboard.writeText(iframeCode)}
            className="mt-2"
          >
            Copy Iframe Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JavaScript Embed (Alternative)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={scriptCode}
            readOnly
            rows={8}
            className="font-mono text-sm"
          />
          <Button 
            onClick={() => navigator.clipboard.writeText(scriptCode)}
            className="mt-2"
          >
            Copy JavaScript Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4">
            <iframe
              src={embedUrl}
              width={width}
              height="400px"
              frameBorder="0"
              style={{ border: 'none', borderRadius: '8px' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}