import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Success() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Extract session_id from URL parameters
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    setSessionId(sid);

    // You could optionally fetch session details from your server here
    // to display personalized information about the subscription
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="shadow-lg border-green-100">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Subscription Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to our HVAC maintenance plan. Your system will now receive the regular care it needs.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">What happens next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Our team will contact you to schedule your first maintenance visit</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You can manage your subscription through your account dashboard</span>
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