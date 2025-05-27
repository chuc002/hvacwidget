import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Palette, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractColorsFromImage, getDefaultColorScheme, type ColorScheme } from "@/lib/colorExtraction";
import { SaaSPlans } from "@shared/pricing";

const customizationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  logoUrl: z.string().url("Please enter a valid logo URL").optional().or(z.literal("")),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  defaultSelectedPlan: z.string().optional(),
  showPricesOnWidget: z.boolean().default(true),
});

type CustomizationFormData = z.infer<typeof customizationSchema>;

interface EnhancedCustomizationFormProps {
  initialData?: Partial<CustomizationFormData>;
  onSubmit: (data: CustomizationFormData) => void;
  isLoading?: boolean;
}

export default function EnhancedCustomizationForm({ 
  initialData, 
  onSubmit, 
  isLoading = false 
}: EnhancedCustomizationFormProps) {
  const { toast } = useToast();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getDefaultColorScheme());
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      companyUrl: initialData?.companyUrl || "",
      logoUrl: initialData?.logoUrl || "",
      primaryColor: initialData?.primaryColor || colorScheme.primary,
      secondaryColor: initialData?.secondaryColor || colorScheme.secondary,
      accentColor: initialData?.accentColor || colorScheme.accent,
      textColor: initialData?.textColor || colorScheme.text,
      backgroundColor: initialData?.backgroundColor || colorScheme.background,
      defaultSelectedPlan: initialData?.defaultSelectedPlan || "professional",
      showPricesOnWidget: initialData?.showPricesOnWidget ?? true,
    }
  });

  // Auto-extract colors when logo URL changes
  const logoUrl = form.watch("logoUrl");

  useEffect(() => {
    if (logoUrl && logoUrl.startsWith("http")) {
      handleAutoColorExtraction(logoUrl);
    }
  }, [logoUrl]);

  const handleAutoColorExtraction = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    setIsExtractingColors(true);
    try {
      const extractedColors = await extractColorsFromImage(imageUrl);
      setColorScheme(extractedColors);
      
      // Update form with extracted colors
      form.setValue("primaryColor", extractedColors.primary);
      form.setValue("secondaryColor", extractedColors.secondary);
      form.setValue("accentColor", extractedColors.accent);
      form.setValue("textColor", extractedColors.text);
      form.setValue("backgroundColor", extractedColors.background);
      
      toast({
        title: "Colors extracted successfully!",
        description: "Your brand colors have been automatically generated from your logo.",
      });
    } catch (error) {
      console.warn("Could not extract colors from logo:", error);
      toast({
        title: "Color extraction failed",
        description: "Using default colors. You can customize them manually below.",
        variant: "destructive",
      });
    } finally {
      setIsExtractingColors(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    
    // Extract colors from uploaded file
    try {
      setIsExtractingColors(true);
      const extractedColors = await extractColorsFromImage(previewUrl);
      setColorScheme(extractedColors);
      
      form.setValue("primaryColor", extractedColors.primary);
      form.setValue("secondaryColor", extractedColors.secondary);
      form.setValue("accentColor", extractedColors.accent);
      form.setValue("textColor", extractedColors.text);
      form.setValue("backgroundColor", extractedColors.background);
      
      toast({
        title: "Colors extracted from your logo!",
        description: "Brand colors have been automatically generated.",
      });
    } catch (error) {
      console.warn("Could not extract colors from uploaded logo:", error);
      toast({
        title: "Could not extract colors",
        description: "You can still use the logo and customize colors manually.",
        variant: "destructive",
      });
    } finally {
      setIsExtractingColors(false);
    }
  };

  const handleFormSubmit = (data: CustomizationFormData) => {
    // If a file was uploaded, we'd normally upload it to a CDN here
    // For now, we'll use the preview URL or the provided logoUrl
    const finalData = {
      ...data,
      logoUrl: logoPreview || data.logoUrl,
    };
    
    onSubmit(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Customize Your Widget</h1>
        <p className="text-muted-foreground">
          Make the widget your own by customizing it to match your brand.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                {...form.register("companyName")}
                placeholder="ABC Pest Control"
              />
              {form.formState.errors.companyName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyUrl">Company Website (Optional)</Label>
              <Input
                id="companyUrl"
                {...form.register("companyUrl")}
                placeholder="https://yourcompany.com"
              />
              {form.formState.errors.companyUrl && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.companyUrl.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload & Color Extraction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Logo & Brand Colors
              {isExtractingColors && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload Options */}
            <div className="space-y-4">
              <Label>Company Logo</Label>
              <div className="grid md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logoUpload" className="text-sm text-muted-foreground">
                    Upload Logo File
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="logoUpload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm">Click to upload logo</p>
                    </Label>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-sm text-muted-foreground">
                    Or Enter Logo URL
                  </Label>
                  <Input
                    id="logoUrl"
                    {...form.register("logoUrl")}
                    placeholder="https://yourcompany.com/logo.png"
                  />
                  {form.formState.errors.logoUrl && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.logoUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Logo Preview */}
              {(logoPreview || logoUrl) && (
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Logo Preview</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                    <img
                      src={logoPreview || logoUrl}
                      alt="Logo preview"
                      className="h-16 w-auto mx-auto object-contain"
                      onError={() => {
                        toast({
                          title: "Logo could not be loaded",
                          description: "Please check the URL or try uploading a different file.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Brand Colors</Label>
                {isExtractingColors && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Extracting colors...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...form.register("primaryColor")}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      {...form.register("primaryColor")}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...form.register("secondaryColor")}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      {...form.register("secondaryColor")}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...form.register("accentColor")}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      {...form.register("accentColor")}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...form.register("textColor")}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      {...form.register("textColor")}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...form.register("backgroundColor")}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      {...form.register("backgroundColor")}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultSelectedPlan">Default Selected Plan</Label>
              <Select onValueChange={(value) => form.setValue("defaultSelectedPlan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default plan" />
                </SelectTrigger>
                <SelectContent>
                  {SaaSPlans.map((plan) => (
                    <SelectItem key={plan.tier} value={plan.tier}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showPricesOnWidget">Show prices on widget</Label>
                <p className="text-sm text-muted-foreground">
                  Display pricing information directly on the subscription widget
                </p>
              </div>
              <Switch
                id="showPricesOnWidget"
                checked={form.watch("showPricesOnWidget")}
                onCheckedChange={(checked) => form.setValue("showPricesOnWidget", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Customization"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}