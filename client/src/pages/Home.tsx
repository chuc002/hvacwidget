import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">HVAC Maintenance Plans</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Subscribe to regular maintenance to keep your system running efficiently and prevent costly breakdowns.
        </p>
        <div className="mt-8">
          <Link href="/widget">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              View Subscription Options
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Choose a Plan</h3>
              <p className="text-gray-600 text-center">
                Select from our Basic, Standard, or Premium maintenance plans based on your needs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Subscribe Online</h3>
              <p className="text-gray-600 text-center">
                Complete your subscription with our secure online payment process.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-light bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Enjoy Benefits</h3>
              <p className="text-gray-600 text-center">
                Get priority service, discounts on repairs, and peace of mind with regular maintenance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Our Maintenance Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Extended Equipment Life</h3>
            <p className="text-gray-600 mb-4">
              Regular maintenance helps your HVAC system last longer by keeping components clean and identifying potential issues before they cause damage.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Prevent unexpected breakdowns</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Reduce major repair costs</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Maximize your investment</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Energy Efficiency</h3>
            <p className="text-gray-600 mb-4">
              A well-maintained HVAC system runs more efficiently, using less energy and saving you money on your utility bills.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Lower monthly utility bills</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Reduce carbon footprint</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Consistent performance year-round</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Widget Integration</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4 text-center">
              Our maintenance plan subscription widget can be easily embedded into any HVAC company website.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">iFrame Embedding</h3>
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {`<iframe src="https://${window.location.host}/widget" width="100%" height="800px" frameborder="0"></iframe>`}
              </pre>
            </div>
            <div className="mt-6">
              <Link href="/widget">
                <Button className="w-full">View Widget Demo</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
