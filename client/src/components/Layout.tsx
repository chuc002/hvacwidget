import { useAuth } from '@/lib/authContext';
import PublicNavigation from './PublicNavigation';
import { CustomerNavigation } from './CustomerNavigation';
import { useLocation } from 'wouter';
import CookieConsent from './CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();

  // Check if the current route is a customer dashboard route
  const isCustomerRoute = location.startsWith('/dashboard') || 
                         location.startsWith('/customize') ||
                         location.startsWith('/revenue') ||
                         location.startsWith('/customers') ||
                         location.startsWith('/analytics') ||
                         location.startsWith('/billing') ||
                         location.startsWith('/support') ||
                         location.startsWith('/payment-setup');

  // If user is in the dashboard area, render CustomerNavigation
  if (isAuthenticated && isCustomerRoute) {
    return (
      <CustomerNavigation 
        companyName={user?.companyName}
        userName={user?.name}
        userEmail={user?.email}
        onLogout={logout}
      >
        {children}
      </CustomerNavigation>
    );
  }

  // Otherwise render PublicNavigation
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavigation isLoggedIn={isAuthenticated} />
      <main className="flex-1">{children}</main>
      <CookieConsent />
    </div>
  );
}