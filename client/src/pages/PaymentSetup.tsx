import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, CreditCard, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ConnectStatus {
  connected: boolean;
  account_id?: string;
  details_submitted?: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  business_profile?: {
    name?: string;
    url?: string;
  };
}

export default function PaymentSetup() {
  const { toast } = useToast();
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const fetchConnectStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/stripe/connect/status');
      const data = await response.json();
      setConnectStatus(data);
    } catch (error) {
      console.error('Error fetching Connect status:', error);
      toast({
        title: "Error",
        description: "Failed to load payment setup status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async () => {
    setConnecting(true);
    try {
      const response = await apiRequest('POST', '/api/stripe/connect/create-account');
      const data = await response.json();
      
      if (data.onboarding_url) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboarding_url;
      }
    } catch (error) {
      console.error('Error creating Connect account:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to start payment setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const getConnectionStatus = () => {
    if (!connectStatus?.connected) {
      return {
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        text: 'Not Connected'
      };
    }
    
    if (connectStatus.charges_enabled && connectStatus.payouts_enabled) {
      return {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Fully Connected'
      };
    }
    
    if (connectStatus.details_submitted) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertCircle,
        text: 'Under Review'
      };
    }
    
    return {
      color: 'bg-orange-100 text-orange-800',
      icon: AlertCircle,
      text: 'Setup Incomplete'
    };
  };

  useEffect(() => {
    fetchConnectStatus();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading payment setup...</span>
        </div>
      </div>
    );
  }

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Setup</h1>
        <p className="text-muted-foreground">
          Connect your bank account to collect payments from your customers through your widget.
        </p>
      </div>

      {/* Connection Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stripe Connect Status</span>
            <Badge className={status.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.text}
            </Badge>
          </CardTitle>
          <CardDescription>
            Stripe Connect allows you to securely collect payments from your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connectStatus?.connected ? (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to connect a Stripe account to start collecting payments from your widget customers.
                  This is required for your subscription widgets to process payments.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h3 className="font-semibold">What happens when you connect:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Your customers can pay directly through your widget</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic recurring billing for subscription plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Funds deposited directly to your bank account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Comprehensive payment analytics and reporting</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={handleConnectAccount} 
                disabled={connecting}
                className="w-full md:w-auto"
              >
                {connecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Connect Stripe Account
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Account ID:</span>
                      <span className="font-mono text-xs">{connectStatus.account_id}</span>
                    </div>
                    {connectStatus.business_profile?.name && (
                      <div className="flex justify-between">
                        <span>Business Name:</span>
                        <span>{connectStatus.business_profile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Capabilities</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accept Payments</span>
                      {connectStatus.charges_enabled ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Receive Payouts</span>
                      {connectStatus.payouts_enabled ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {(!connectStatus.charges_enabled || !connectStatus.payouts_enabled) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account setup is incomplete. Some payment features may not work until 
                    Stripe has verified your account information.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={fetchConnectStatus}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/connect/accounts/overview', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage in Stripe
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Common Questions:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Account verification typically takes 1-2 business days</li>
                <li>• You'll need your business information and bank account details</li>
                <li>• Payments are processed securely through Stripe</li>
                <li>• Funds are deposited according to your payout schedule</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Having trouble?</h4>
              <p>Contact our support team if you need assistance with your payment setup.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}