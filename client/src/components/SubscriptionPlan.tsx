import { Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SubscriptionPlanProps {
  plan: Plan;
  onSelect: () => void;
  isHighlighted?: boolean;
  isSelected?: boolean;
  preselected?: boolean;
}

export default function SubscriptionPlan({ 
  plan, 
  onSelect, 
  isHighlighted = false, 
  isSelected = false,
  preselected = false
}: SubscriptionPlanProps) {
  // Format price display based on interval
  const formatPrice = () => {
    const price = parseFloat(plan.price);
    if (plan.interval === 'month') {
      return `$${price}`;
    } else if (plan.interval === 'year') {
      return `$${price}`;
    } else {
      return `$${price}`;
    }
  };

  // Format interval for display
  const formatInterval = () => {
    if (plan.interval === 'month') {
      return 'Billed monthly';
    } else if (plan.interval === 'year') {
      return 'Billed annually';
    } else {
      return 'Per service visit';
    }
  };

  // If this plan is preselected, trigger selection automatically
  useEffect(() => {
    if (preselected) {
      onSelect();
    }
  }, [preselected, onSelect]);

  return (
    <div 
      onClick={onSelect}
      className={`plan-card relative h-full flex flex-col bg-white rounded-lg p-6 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? "border-2 border-blue-600 shadow-lg" 
          : isHighlighted
            ? "border-2 border-gray-300"
            : "border border-gray-200"
      } hover:shadow-lg hover:-translate-y-1`}
    >
      {/* Plan label */}
      <div className="absolute -top-3 right-3">
        {isHighlighted ? (
          <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Popular
          </span>
        ) : plan.interval === 'one-time' ? (
          <span className="inline-block bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Per Visit
          </span>
        ) : plan.interval === 'month' ? (
          <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Best Value
          </span>
        ) : plan.name === "Basic" ? (
          <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Best Starter
          </span>
        ) : plan.name === "Ultimate" ? (
          <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Complete Care
          </span>
        ) : null}
      </div>

      {/* Plan name and pricing */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name} Plan</h3>
      <div className="text-primary text-2xl font-bold mb-1">{formatPrice()}</div>
      <p className="text-gray-500 text-sm mb-4">{formatInterval()}</p>

      {/* Plan features */}
      <ul className="space-y-2 mb-6 flex-grow">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <Button
        className="w-full text-white font-medium shadow-md bg-blue-600 hover:bg-blue-700 mt-2"
        variant="default"
      >
        {plan.interval === 'one-time' ? 'Select Plan' : 'Subscribe Now'}
      </Button>
    </div>
  );
}
