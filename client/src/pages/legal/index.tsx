import { Link } from "wouter";
import { FileText, Shield, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalHub() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Legal Information</h1>
      <p className="text-gray-500 mb-10">
        Important legal documents and policies for ServicePlan Pro users
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Terms of Service
            </CardTitle>
            <CardDescription>
              Rules and guidelines for using our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Our terms outline the rules, guidelines, and obligations when using ServicePlan Pro.
            </p>
            <Link href="/legal/terms-of-service" className="text-primary hover:underline text-sm font-medium">
              Read Terms of Service →
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Privacy Policy
            </CardTitle>
            <CardDescription>
              How we collect and use your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Our privacy policy explains what information we collect and how we use, share, and protect it.
            </p>
            <Link href="/legal/privacy-policy" className="text-primary hover:underline text-sm font-medium">
              Read Privacy Policy →
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-primary" />
              Refund Policy
            </CardTitle>
            <CardDescription>
              Our approach to refunds and cancellations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Our refund policy outlines when and how refunds are processed for our subscription services.
            </p>
            <Link href="/legal/refund-policy" className="text-primary hover:underline text-sm font-medium">
              Read Refund Policy →
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <p className="mb-4">
          If you have any questions about our legal policies or need further clarification, please don't 
          hesitate to contact our support team.
        </p>
        <p className="mb-6">
          <span className="font-medium">Email:</span> legal@serviceplanpro.com<br />
          <span className="font-medium">Support Hours:</span> Monday - Friday, 9am - 5pm PT
        </p>
        <Link href="/contact" className="text-primary hover:underline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}