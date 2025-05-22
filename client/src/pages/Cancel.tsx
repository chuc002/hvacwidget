import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function Cancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
            <XCircle className="h-10 w-10 text-gray-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-700">Subscription Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Your HVAC maintenance plan subscription process was cancelled. No charges have been made to your account.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Why subscribe to a maintenance plan?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Extend the life of your HVAC system</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Save on energy costs with optimized performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Avoid unexpected breakdowns with preventive maintenance</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => setLocation('/widget')}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              Try Again
            </Button>
            
            <Button 
              onClick={() => setLocation('/')}
              variant="outline"
              className="w-full"
            >
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}