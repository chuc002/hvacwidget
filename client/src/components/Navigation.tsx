import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Phone, Calendar } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Don't show navigation on embed pages
  if (location === '/embed' || location === '/widget' || location.startsWith('/subscribe/')) {
    return null;
  }

  // This contains all our available pages for the menu
  const allPages = [
    { name: 'Home', path: '/' },
    { name: 'Customer Journey', path: '/customer-journey' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Live Demo', path: '/demo' },
    { name: 'Enhanced Widget Demo', path: '/enhanced-widget-demo' },
    { name: 'Pricing', path: '/simple-pricing' },
    { name: 'Start Free Trial', path: '/trial-registration' },
    { name: 'Onboarding Wizard', path: '/welcome-flow' },
  ];

  return (
    <>
      {/* Top Blue Header with Logo and Main Navigation - Matching the screenshot exactly */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-white">ServicePlan Pro</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-medium hover:text-blue-100">Home</Link>
            <Link href="/admin" className="text-white font-medium hover:text-blue-100">Admin</Link>
          </div>
        </div>
      </div>

      {/* Secondary Bar with Phone and Free Trial */}
      <div className="bg-blue-500 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              (555) 123-4567
            </div>
            <div>Free 14-day trial • No credit card required</div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/book-demo" className="flex items-center hover:underline">
              <Calendar className="h-4 w-4 mr-1" />
              Book Demo
            </Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Button - Always visible and fixed in corner */}
      <div className="fixed bottom-6 right-6 z-50 shadow-xl rounded-full">
        <Button 
          variant="outline" 
          className="bg-blue-600 border-white text-white hover:bg-blue-700 h-14 w-14 rounded-full shadow-lg" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Full Page Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-blue-600/95 text-white z-40 overflow-y-auto pt-14">
          <div className="max-w-md mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1">Navigation Menu</h2>
              <p className="text-blue-200 text-sm">Select a page to navigate</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {allPages.map(page => (
                <Link 
                  key={page.path} 
                  href={page.path}
                  className="bg-white/10 hover:bg-white/20 p-4 rounded-lg text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">{page.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-white/20 pt-8 mt-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/trial-registration" 
                  className="bg-white text-blue-600 hover:bg-blue-50 p-4 rounded-lg text-center font-bold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Your Free Trial
                </Link>
                <Link 
                  href="/book-demo" 
                  className="bg-transparent border border-white hover:bg-white/10 p-4 rounded-lg text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Landing Page Hero or Content will go here */}
    </>
  );
}