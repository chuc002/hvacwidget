import React from 'react';
import { Link, useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Don't show navigation on the widget page since it will be embedded
  const isWidget = location === '/widget' || location.startsWith('/subscribe/');
  
  if (isWidget) {
    return <main>{children}</main>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="bg-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">HVAC Maintenance Plans</span>
            </a>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <a className={location === '/' ? 'font-bold' : ''}>Home</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className={location === '/admin' ? 'font-bold' : ''}>Admin</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HVAC Maintenance Plans</h3>
              <p className="text-gray-300">
                Subscribe to regular maintenance to keep your system running efficiently and prevent costly breakdowns.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                Phone: (555) 123-4567<br />
                Email: info@example.com<br />
                Address: 123 Main St, Austin, TX
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <p className="text-gray-300">
                Monday - Friday: 8am - 6pm<br />
                Saturday: 9am - 2pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} HVAC Maintenance Plans. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
