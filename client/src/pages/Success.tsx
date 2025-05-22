import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { apiRequest } from '@/lib/queryClient';

export default function Success() {
  const [, setLocation] = useLocation();
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get the session ID from the URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Fetch subscription details based on the Stripe session ID
      const fetchSubscriptionDetails = async () => {
        try {
          const response = await apiRequest('GET', `/api/subscription-details?session_id=${sessionId}`);
          const data = await response.json();
          setSubscriptionDetails(data);
        } catch (error) {
          console.error('Error fetching subscription details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscriptionDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-700">Subscription Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to our HVAC maintenance plan. Your subscription has been successfully processed.
          </p>
          
          {loading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : subscriptionDetails ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Subscription Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Plan:</span> {subscriptionDetails.plan?.name || 'Standard Plan'}</p>
                <p><span className="font-medium">Subscription Status:</span> {subscriptionDetails.status || 'Active'}</p>
                <p><span className="font-medium">Next Billing Date:</span> {
                  subscriptionDetails.currentPeriodEnd 
                    ? new Date(subscriptionDetails.currentPeriodEnd * 1000).toLocaleDateString() 
                    : 'Not available'
                }</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <p className="text-yellow-700">Subscription details could not be loaded. Please check your email for confirmation details.</p>
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
            <ul className="text-left text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You'll receive a confirmation email with your subscription details</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Our team will contact you to schedule your first maintenance visit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You can manage your subscription through your customer portal</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={() => setLocation('/')}
            className="w-full bg-primary hover:bg-primary-dark"
          >
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}