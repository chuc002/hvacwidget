import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Phone, Calendar } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [location] = useLocation();

  // Don't show navigation on embed pages
  if (location === '/embed' || location === '/widget' || location.startsWith('/subscribe/')) {
    return null;
  }

  return (
    <>
      {/* Top Blue Header with Logo and Main Navigation */}
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
          
          <div className="hidden md:flex items-center space-x-6">
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

      {/* Main Navigation Bar */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Tagline */}
            <div className="text-sm text-gray-500">Turn Services Into Subscriptions</div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={`transition-colors font-medium ${location === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Home
              </Link>
              
              <Link href="/customer-journey" className={`transition-colors font-medium ${location === '/customer-journey' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Customer Journey
              </Link>

              <Link href="/analytics" className={`transition-colors font-medium ${location === '/analytics' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Analytics
              </Link>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Features
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/features" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">All Features</Link>
                    <Link href="/how-it-works" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">How It Works</Link>
                    <Link href="/demo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Live Demo</Link>
                    <Link href="/case-studies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Case Studies</Link>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Industries
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/industries/hvac" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🏠 HVAC Services</Link>
                    <Link href="/industries/pest-control" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🐛 Pest Control</Link>
                    <Link href="/industries/lawn-care" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🌱 Lawn Care</Link>
                    <Link href="/industries/pool-service" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🏊 Pool Service</Link>
                    <Link href="/industries/cleaning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">🧹 Cleaning Services</Link>
                  </div>
                </div>
              </div>
              
              <Link href="/simple-pricing" className={`transition-colors font-medium ${location === '/pricing' || location === '/simple-pricing' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Pricing
              </Link>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Get Started
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/trial-registration" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Start Free Trial</Link>
                    <Link href="/welcome-flow" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Onboarding Wizard</Link>
                    <Link href="/book-demo" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">Book a Demo</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 font-medium">Home</Link>
                <Link href="/customer-journey" className="text-gray-700 font-medium">Customer Journey</Link>
                <Link href="/analytics" className="text-gray-700 font-medium">Analytics</Link>
                <Link href="/simple-pricing" className="text-gray-700 font-medium">Pricing</Link>
                
                {/* Features Section */}
                <button 
                  onClick={() => setIsIndustriesOpen(!isIndustriesOpen)}
                  className="text-left flex items-center justify-between text-gray-700 font-medium"
                >
                  Features
                  <ChevronDown className={`h-4 w-4 transition-transform ${isIndustriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isIndustriesOpen && (
                  <div className="pl-4 space-y-2 mb-2">
                    <Link href="/features" className="block text-sm text-gray-600 py-1">All Features</Link>
                    <Link href="/how-it-works" className="block text-sm text-gray-600 py-1">How It Works</Link>
                    <Link href="/demo" className="block text-sm text-gray-600 py-1">Live Demo</Link>
                    <Link href="/case-studies" className="block text-sm text-gray-600 py-1">Case Studies</Link>
                  </div>
                )}
                
                {/* Get Started Section */}
                <div className="border-t pt-4 mt-2">
                  <div className="text-gray-500 font-medium text-sm mb-2">Get Started:</div>
                  <div className="space-y-2">
                    <Link href="/trial-registration">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
                    </Link>
                    <Link href="/welcome-flow">
                      <Button variant="outline" className="w-full">Onboarding Wizard</Button>
                    </Link>
                    <Link href="/book-demo">
                      <Button variant="outline" className="w-full">Book Demo</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}