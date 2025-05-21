import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const generateLinkSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  planId: z.string().min(1, "Plan selection is required"),
});

type GenerateLinkFormValues = z.infer<typeof generateLinkSchema>;

export default function GenerateLinks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  // Fetch active subscription links
  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['/api/subscription-links'],
  });
  
  // Fetch plans for dropdown
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/plans'],
  });
  
  const form = useForm<GenerateLinkFormValues>({
    resolver: zodResolver(generateLinkSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      planId: "",
    },
  });
  
  const generateLinkMutation = useMutation({
    mutationFn: (values: GenerateLinkFormValues) => {
      return apiRequest('POST', '/api/generate-link', {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        planId: parseInt(values.planId),
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setGeneratedLink(data.link);
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-links'] });
      toast({
        title: "Link Generated",
        description: "Subscription link was successfully created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate link: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: GenerateLinkFormValues) => {
    generateLinkMutation.mutate(values);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    });
  };
  
  const sendEmail = (email: string, link: string) => {
    // In a real app, this would send an email via API
    toast({
      title: "Email Sent",
      description: `Link sent to ${email}`,
    });
  };
  
  const renewLink = (linkId: number) => {
    // In a real app, this would regenerate an expired link
    toast({
      title: "Link Renewed",
      description: "The subscription link has been renewed for 7 more days",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Generate Subscription Link</h3>
        <p className="text-gray-600 mb-4">Create a custom subscription link to send directly to customers during phone calls or via email.</p>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="john@example.com" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" placeholder="(123) 456-7890" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Plan</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {plansLoading ? (
                              <SelectItem value="loading" disabled>Loading plans...</SelectItem>
                            ) : plans ? (
                              plans.map((plan: any) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                  {plan.name} Plan (${plan.price}/{plan.interval === 'month' ? 'month' : plan.interval === 'year' ? 'year' : 'visit'})
                                </SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="1">Basic Plan ($129/visit)</SelectItem>
                                <SelectItem value="2">Standard Plan ($225/year)</SelectItem>
                                <SelectItem value="3">Premium Plan ($20/month)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                    disabled={generateLinkMutation.isPending}
                  >
                    {generateLinkMutation.isPending ? "Generating..." : "Generate Link"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Generated Link Section */}
        {generatedLink && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h4 className="text-md font-medium text-gray-800 mb-2">Generated Link</h4>
              <div className="flex mb-4">
                <Input 
                  value={generatedLink} 
                  className="flex-grow rounded-r-none" 
                  readOnly 
                />
                <Button
                  className="rounded-l-none"
                  onClick={() => copyToClipboard(generatedLink)}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-600">This link will expire in 7 days.</div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-secondary hover:bg-secondary-dark"
                    onClick={() => sendEmail(form.getValues("customerEmail"), generatedLink)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Generated Links</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linksLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : links && links.length > 0 ? (
                links.map((link: any) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="font-medium">{link.customer?.name || '-'}</div>
                      <div className="text-sm text-gray-500">{link.customer?.email || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        link.plan?.name === 'Premium' ? 'default' :
                        link.plan?.name === 'Standard' ? 'secondary' :
                        'outline'
                      }>
                        {link.plan?.name || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {link.createdAt ? 
                        formatDistanceToNow(new Date(link.createdAt), { addSuffix: true }) : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(link.expiresAt) > new Date() ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(link.expiresAt) > new Date() ? (
                        <>
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-primary-dark mr-3"
                            onClick={() => copyToClipboard(`${window.location.origin}/subscribe/${link.token}`)}
                          >
                            Copy
                          </Button>
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-primary-dark"
                            onClick={() => sendEmail(link.customer?.email, `${window.location.origin}/subscribe/${link.token}`)}
                          >
                            Resend
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="link" 
                          className="text-primary hover:text-primary-dark"
                          onClick={() => renewLink(link.id)}
                        >
                          Regenerate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No subscription links found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
