import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CheckCircle, AlertTriangle } from "lucide-react";
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
          const response = await apiRequest('GET', `/api/get-session-details?session_id=${sessionId}`);
          const data = await response.json();
          setSubscriptionDetails(data);
          console.log('Subscription details:', data);
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
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 text-left shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Subscription Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-1/3 text-gray-500 text-sm">Plan</div>
                  <div className="w-2/3 font-medium text-gray-800">{subscriptionDetails.planName}</div>
                </div>
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-1/3 text-gray-500 text-sm">Amount</div>
                  <div className="w-2/3 font-medium text-gray-800">
                    ${subscriptionDetails.amount}/{subscriptionDetails.interval}
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-1/3 text-gray-500 text-sm">Email</div>
                  <div className="w-2/3 font-medium text-gray-800">{subscriptionDetails.customerEmail}</div>
                </div>
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-1/3 text-gray-500 text-sm">Start Date</div>
                  <div className="w-2/3 font-medium text-gray-800">
                    {new Date(subscriptionDetails.startDate).toLocaleDateString()}
                  </div>
                </div>
                {subscriptionDetails.customerName && (
                  <div className="flex items-center border-b border-gray-100 pb-3">
                    <div className="w-1/3 text-gray-500 text-sm">Name</div>
                    <div className="w-2/3 font-medium text-gray-800">{subscriptionDetails.customerName}</div>
                  </div>
                )}
                <div className="flex items-center pt-2">
                  <div className="w-1/3 text-gray-500 text-sm">Status</div>
                  <div className="w-2/3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {subscriptionDetails.paymentStatus === 'paid' ? 'Active' : 'Processing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Subscription details could not be loaded. Please check your email for confirmation details.
                  </p>
                </div>
              </div>
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
                <span>Our team will contact you within 24 hours to schedule your first maintenance visit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You can manage your subscription through your customer portal</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-2">If you have any questions about your subscription:</p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <span className="font-medium w-16">Email:</span>
                <a href="mailto:support@comfortairsolutions.com" className="text-primary hover:underline">support@comfortairsolutions.com</a>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-16">Phone:</span>
                <a href="tel:+18005551234" className="text-primary hover:underline">(800) 555-1234</a>
              </div>
            </div>
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