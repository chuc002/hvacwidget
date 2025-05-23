import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, FileText, CreditCard, Plus, Minus } from 'lucide-react';

// Type definitions
interface WidgetConfig {
  customerId: string;
  companyName: string;
  
  // Widget Display Options
  displayMode: 'subscriptions-only' | 'products-only' | 'invoices-only' | 'all-in-one' | 'custom';
  
  // Subscription Plans
  subscriptionPlans: SubscriptionPlan[];
  
  // Product Catalog
  products: Product[];
  
  // Invoice Payment
  invoicePayment: {
    enabled: boolean;
    customMessage?: string;
  };
  
  // UI Configuration
  layout: 'tabs' | 'sections' | 'dropdown';
  defaultTab: 'subscriptions' | 'products' | 'invoices' | 'services';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'quarter' | 'year';
  features: string[];
  stripePriceId: string;
  category: 'maintenance' | 'protection' | 'premium';
  isPopular?: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'equipment' | 'supplies' | 'add-ons' | 'emergency';
  image?: string;
  stripePriceId: string;
  inStock: boolean;
  
  // Product Options
  variants?: ProductVariant[];
  requiresScheduling?: boolean;
  estimatedDelivery?: string;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stripePriceId: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'product' | 'service';
  quantity: number;
  stripePriceId: string;
  variant?: string;
}

interface OneTimeService {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  stripePriceId?: string;
}

export default function EnhancedSubscriptionWidget({ config }: { config: WidgetConfig }) {
  const [activeTab, setActiveTab] = useState(config.defaultTab || 'subscriptions');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // One-time services (hardcoded for now, could come from config)
  const oneTimeServices: OneTimeService[] = [
    {
      id: 'emergency-service',
      name: 'Emergency Service Call',
      description: 'Same-day emergency service for urgent issues',
      price: 149,
      features: ['Same-day service', 'After-hours available', 'Expert diagnosis'],
      stripePriceId: 'price_emergency_service'
    },
    {
      id: 'deep-inspection',
      name: 'Comprehensive Inspection',
      description: 'Detailed system inspection with full report',
      price: 99,
      features: ['Full system check', 'Written report', 'Recommendations'],
      stripePriceId: 'price_inspection'
    },
    {
      id: 'system-upgrade',
      name: 'System Upgrade Consultation',
      description: 'Expert advice on system improvements',
      price: 199,
      features: ['Expert consultation', 'Upgrade recommendations', 'Cost estimates'],
      stripePriceId: 'price_consultation'
    }
  ];

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string, type: 'product' | 'service') => {
    setCart(prevCart => prevCart.filter(item => !(item.id === itemId && item.type === type)));
  };

  const updateQuantity = (itemId: string, type: 'product' | 'service', quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId, type);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalAmount = () => {
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const planTotal = selectedPlan ? selectedPlan.price : 0;
    return cartTotal + planTotal;
  };

  const handleCheckout = async () => {
    // Validate customer info if cart is not empty
    if (cart.length > 0 || selectedPlan) {
      if (!customerInfo.name || !customerInfo.email) {
        alert("Please provide your name and email to continue.");
        return;
      }
    }

    // Validate invoice number if paying an invoice
    if (activeTab === 'invoices' && !invoiceNumber) {
      alert("Please enter an invoice number.");
      return;
    }

    const checkoutData = {
      subscription: selectedPlan,
      products: cart.filter(item => item.type === 'product'),
      services: cart.filter(item => item.type === 'service'),
      invoiceNumber: invoiceNumber,
      customerInfo,
      totalAmount: getTotalAmount(),
      customerId: config.customerId
    };

    try {
      const response = await fetch('/api/create-enhanced-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('There was an error processing your checkout. Please try again.');
    }
  };

  // Calculate if cart has items
  const hasCartItems = cart.length > 0;
  const hasSelectedItems = hasCartItems || selectedPlan !== null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{config.companyName}</h1>
        <p className="text-gray-600">Choose from our services, products, and payment options</p>
      </div>

      {/* Main Widget Content */}
      {config.displayMode === 'all-in-one' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscriptions" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Service Plans
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              One-Time Services
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Pay Invoice
            </TabsTrigger>
          </TabsList>

          {/* SUBSCRIPTION PLANS TAB */}
          <TabsContent value="subscriptions" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Recurring Service Plans</h2>
              <p className="text-gray-600">Save money with our regular maintenance and protection plans</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {config.subscriptionPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  } ${plan.isPopular ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.isPopular && (
                        <Badge className="bg-green-500">Most Popular</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">
                        ${plan.price}
                        <span className="text-sm text-gray-500">/{plan.interval}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        selectedPlan?.id === plan.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Products & Equipment</h2>
              <p className="text-gray-600">Professional-grade products delivered to your door</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </div>
                      <Badge variant={product.inStock ? 'default' : 'secondary'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    {product.estimatedDelivery && (
                      <p className="text-sm text-gray-500 mb-3">
                        🚚 Delivery: {product.estimatedDelivery}
                      </p>
                    )}
                    
                    <Button 
                      className="w-full"
                      disabled={!product.inStock}
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        type: 'product',
                        quantity: 1,
                        stripePriceId: product.stripePriceId
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ONE-TIME SERVICES TAB */}
          <TabsContent value="services" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">One-Time Services</h2>
              <p className="text-gray-600">Emergency repairs, inspections, and specialty services</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {oneTimeServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      ${service.price}
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      onClick={() => addToCart({
                        id: service.id,
                        name: service.name,
                        price: service.price,
                        type: 'service',
                        quantity: 1,
                        stripePriceId: service.stripePriceId || ''
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PAY INVOICE TAB */}
          <TabsContent value="invoices" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Pay Your Invoice</h2>
              <p className="text-gray-600">
                {config.invoicePayment.customMessage || 'Make a secure payment for your recent service or product purchase'}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Invoice Number*</label>
                    <Input 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)} 
                      placeholder="Enter your invoice number (e.g., INV-12345)"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 rounded-l-md border border-r-0 border-gray-300">
                        $
                      </span>
                      <Input 
                        type="number" 
                        placeholder="Amount due on your invoice" 
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  disabled={!invoiceNumber}
                  onClick={handleCheckout}
                >
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Handle other display modes as needed
        <div className="text-center text-gray-600">
          This display mode is not yet implemented
        </div>
      )}

      {/* Cart & Customer Info Section */}
      {(hasCartItems || selectedPlan) && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Your Selection</h2>
          
          {/* Selected Plan */}
          {selectedPlan && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedPlan.name} Subscription</h3>
                  <p className="text-sm text-gray-600">${selectedPlan.price}/{selectedPlan.interval}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-gray-700"
                  onClick={() => setSelectedPlan(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
          
          {/* Cart Items */}
          {hasCartItems && (
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.type}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center py-3 border-t border-b mb-6">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold">${getTotalAmount()}</span>
          </div>
          
          {/* Customer Information Form */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Your Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name*</label>
                <Input 
                  value={customerInfo.name} 
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} 
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <Input 
                  type="email" 
                  value={customerInfo.email} 
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} 
                  placeholder="Your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  value={customerInfo.phone} 
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input 
                  value={customerInfo.address} 
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} 
                  placeholder="Your address"
                />
              </div>
            </div>
          </div>
          
          {/* Checkout Button */}
          <Button 
            className="w-full py-6 text-lg" 
            onClick={handleCheckout}
            disabled={!hasSelectedItems}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}