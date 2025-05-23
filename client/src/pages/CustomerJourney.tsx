import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Star, ArrowRight, Play, Users, TrendingUp, Zap, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function CustomerJourney() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Trusted by 500+ Home Service Businesses
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Turn Your Home Services Into
              <span className="text-yellow-300 block">Recurring Revenue</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Professional subscription widgets for pest control, lawn care, HVAC, pool services, and more. 
              Get customers to subscribe online in minutes - <strong>65% cheaper than Contractor Commerce</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link href="/trial-registration">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </Link>
              <Link href="/book-demo">
                <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                  Book Personal Demo
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-blue-100 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                5-minute setup
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">300%</div>
              <div className="text-gray-600">Avg. Subscription Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-gray-600">Average Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Losing Customers to Manual Processes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most home service companies lose 70% of potential recurring customers because they can't sign up online. 
              Don't let outdated processes cost you revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center border-2 border-red-200">
              <CardContent>
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-semibold mb-3 text-red-600">Manual Sign-ups Only</h3>
                <p className="text-gray-600">
                  Customers have to call during business hours or wait for callbacks to start service plans
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border-2 border-red-200">
              <CardContent>
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-xl font-semibold mb-3 text-red-600">Lost Revenue</h3>
                <p className="text-gray-600">
                  70% of customers who want recurring services never actually sign up due to friction
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border-2 border-red-200">
              <CardContent>
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-3 text-red-600">Admin Overhead</h3>
                <p className="text-gray-600">
                  Paper forms, manual billing, and payment tracking waste hours of valuable time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Modern Solution for Service Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ServicePlan Pro gives your customers a simple way to subscribe to your service plans online,
              24/7, without calling or waiting.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 text-center border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quick Setup</h3>
                <p className="text-gray-600">
                  Embed on your website in 5 minutes with a simple code snippet
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Self-Service</h3>
                <p className="text-gray-600">
                  Let customers subscribe in just a few clicks, 24/7, from any device
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automated Billing</h3>
                <p className="text-gray-600">
                  Secure recurring payments with Stripe - no more chasing invoices
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Security</h3>
                <p className="text-gray-600">
                  PCI-compliant payments and GDPR-ready customer data protection
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button size="lg">
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for Home Service Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our subscription widget is tailored for the unique needs of different home service industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">HVAC Services</h3>
                <p className="text-gray-600 mb-4">
                  Sell maintenance plans and tune-ups on a recurring schedule
                </p>
                <Link href="/industries/hvac" className="text-blue-600 font-medium hover:underline flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🐛</div>
                <h3 className="text-xl font-semibold mb-2">Pest Control</h3>
                <p className="text-gray-600 mb-4">
                  Offer quarterly or monthly pest prevention services
                </p>
                <Link href="/industries/pest-control" className="text-blue-600 font-medium hover:underline flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">Lawn Care</h3>
                <p className="text-gray-600 mb-4">
                  Manage seasonal lawn treatment and maintenance subscriptions
                </p>
                <Link href="/industries/lawn-care" className="text-blue-600 font-medium hover:underline flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/industries">
              <Button variant="outline" size="lg">
                View All Industries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of service businesses already growing with ServicePlan Pro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "We increased our monthly maintenance plans by 215% in the first 90 days. The widget paid for itself in the first week!"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Comfort Air HVAC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Implementation was fast and easy. We now have 40% of our customers on subscription plans versus 15% before."
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-medium">Michael Rodriguez</p>
                    <p className="text-sm text-gray-600">Green Lawn Experts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The analytics dashboard gives us incredible insights. We've optimized our plans and increased average revenue per customer by 22%."
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-medium">Jennifer Williams</p>
                    <p className="text-sm text-gray-600">Shield Pest Control</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/case-studies">
              <Button variant="outline" size="lg">
                Read Customer Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Service Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join 500+ companies already growing their subscription revenue with ServicePlan Pro.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/trial-registration">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book-demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="text-gray-400 hover:text-white">Live Demo</Link></li>
                <li><Link href="/book-demo" className="text-gray-400 hover:text-white">Book a Demo</Link></li>
                <li><Link href="/analytics" className="text-gray-400 hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Industries</h3>
              <ul className="space-y-2">
                <li><Link href="/industries/hvac" className="text-gray-400 hover:text-white">HVAC</Link></li>
                <li><Link href="/industries/pest-control" className="text-gray-400 hover:text-white">Pest Control</Link></li>
                <li><Link href="/industries/lawn-care" className="text-gray-400 hover:text-white">Lawn Care</Link></li>
                <li><Link href="/industries/pool-service" className="text-gray-400 hover:text-white">Pool Service</Link></li>
                <li><Link href="/industries/cleaning" className="text-gray-400 hover:text-white">Cleaning</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/case-studies" className="text-gray-400 hover:text-white">Case Studies</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support Center</Link></li>
                <li><Link href="/documentation" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/training" className="text-gray-400 hover:text-white">Training Videos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm text-center">
            <p>© {new Date().getFullYear()} ServicePlan Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}