import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trackEvent } from '@/lib/analytics';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  // Check if user already consented
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Only show after a short delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    trackEvent('cookie_consent', 'privacy', 'accepted');
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
    trackEvent('cookie_consent', 'privacy', 'declined');
    
    // Optional: Disable analytics if declined
    if (window.gtag) {
      // Disable GA tracking by setting doNotTrack flag
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-opacity-95">
      <Card className="max-w-4xl mx-auto p-4 shadow-lg border border-gray-200 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Cookie Consent</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use cookies to improve your experience and analyze website traffic. 
              By accepting, you agree to our use of cookies as described in our{' '}
              <a href="/legal/privacy-policy" className="text-blue-600 dark:text-blue-400 underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="flex gap-2 shrink-0 mt-2 md:mt-0">
            <Button variant="outline" onClick={declineCookies}>
              Decline
            </Button>
            <Button onClick={acceptCookies}>
              Accept
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}