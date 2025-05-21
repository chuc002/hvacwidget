import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SubscriptionWidget from "@/components/SubscriptionWidget";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderPinwheel } from "lucide-react";

export default function Widget() {
  const { token } = useParams();
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const [planId, setPlanId] = useState<number | undefined>(undefined);

  // If token is provided, fetch the subscription link data
  const { data: linkData, isLoading, error } = useQuery({
    queryKey: token ? [`/api/subscription-link/${token}`] : null,
    enabled: !!token
  });

  useEffect(() => {
    // If there's link data, set the customer and plan IDs
    if (linkData && !error) {
      setCustomerId(linkData.customer?.id);
      setPlanId(linkData.plan?.id);
    } else if (error) {
      toast({
        title: "Error Loading Subscription Link",
        description: "The link may be expired or invalid.",
        variant: "destructive",
      });
    }
  }, [linkData, error, toast]);

  // If the widget is being accessed via a subscription link
  if (token) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <LoaderPinwheel className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Loading your subscription information...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Subscription Link Error</h2>
              <p className="text-red-600 mb-4">The subscription link you're trying to access is invalid or has expired.</p>
              <p className="text-gray-600">Please contact your HVAC service provider for a new link or visit their website to subscribe directly.</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // The actual subscription widget
  // We'll set company name and pass the preselected plan if coming from a link
  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionWidget 
        companyName={linkData?.customer ? "Comfort Air Solutions" : undefined}
        customerId={customerId}
        preselectedPlanId={planId}
      />
    </div>
  );
}
