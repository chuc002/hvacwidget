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
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Benefits You'll Miss Out On</h3>
            <ul className="text-left text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Extended equipment life with professional maintenance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Up to 30% savings on utility bills with optimized systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Priority service and discounted repairs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Peace of mind with preventative maintenance</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">Need More Information?</h3>
            <p className="text-yellow-700 mb-2">
              If you have questions about our plans or pricing, our team is happy to help.
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <span className="font-medium w-16">Email:</span>
                <a href="mailto:info@comfortairsolutions.com" className="text-primary hover:underline">info@comfortairsolutions.com</a>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-16">Phone:</span>
                <a href="tel:+18005551234" className="text-primary hover:underline">(800) 555-1234</a>
              </div>
            </div>
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