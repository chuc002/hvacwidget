import SubscriptionWidget from "@/components/SubscriptionWidget";
import { useSearch } from "wouter";

export default function Embed() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const companyName = params.get('company') || 'Premium Home Services';
  const customerId = params.get('customer_id');
  const preselectedPlanId = params.get('plan_id');
  
  return (
    <div className="min-h-screen bg-white">
      <SubscriptionWidget 
        companyName={companyName}
        customerId={customerId ? parseInt(customerId) : undefined}
        preselectedPlanId={preselectedPlanId ? parseInt(preselectedPlanId) : undefined}
      />
    </div>
  );
}