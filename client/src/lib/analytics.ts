// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Pre-defined events for common actions in ServicePlan Pro
export const trackSignup = () => {
  trackEvent('signup', 'user', 'new_account');
};

export const trackLogin = () => {
  trackEvent('login', 'user', 'user_authentication');
};

export const trackPlanSelected = (planName: string, isAnnual: boolean = false) => {
  trackEvent('plan_selected', 'subscription', `${planName}_${isAnnual ? 'annual' : 'monthly'}`);
};

export const trackCheckoutStarted = (planName: string, price: number) => {
  trackEvent('checkout_started', 'payment', planName, price);
};

export const trackCheckoutCompleted = (planName: string, price: number) => {
  trackEvent('checkout_completed', 'payment', planName, price);
};

export const trackWidgetCustomized = (customizationType: string) => {
  trackEvent('widget_customized', 'customization', customizationType);
};

export const trackFeatureUsed = (featureName: string) => {
  trackEvent('feature_used', 'engagement', featureName);
};

export const trackError = (errorCode: string, errorMessage: string) => {
  trackEvent('error', 'system', `${errorCode}: ${errorMessage}`);
};