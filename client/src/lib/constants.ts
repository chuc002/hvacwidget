// Backup plan details in case API fails
export const PlanDetails = [
  // Annual Plans
  {
    id: 1,
    name: "Basic",
    description: "Essential service plan with annual billing",
    price: "149.99",
    interval: "year",
    features: [
      "Annual service visit", 
      "Equipment check-up", 
      "Priority scheduling", 
      "10% discount on services"
    ],
    isPopular: false,
    order: 1,
    stripePriceId: "price_1RRcnlGxl1XxufT4i2vJmX0m",
    billingType: "annual"
  },
  {
    id: 2,
    name: "Premium",
    description: "Comprehensive service plan with annual billing",
    price: "249.99",
    interval: "year",
    features: [
      "Semi-annual service visits", 
      "Preventative maintenance", 
      "Priority scheduling", 
      "15% discount on services", 
      "No overtime charges"
    ],
    isPopular: true,
    order: 2,
    stripePriceId: "price_1RRcoYGxl1XxufT4KFZbeJsn",
    billingType: "annual"
  },
  {
    id: 3,
    name: "Ultimate",
    description: "Complete protection and maximum savings",
    price: "349.99",
    interval: "year",
    features: [
      "Quarterly service visits", 
      "Comprehensive inspections", 
      "Same-day service", 
      "20% discount on services", 
      "No overtime charges", 
      "Free diagnostic visits"
    ],
    isPopular: false,
    order: 3,
    stripePriceId: "price_1RRcp8Gxl1XxufT4oYuK4HG5",
    billingType: "annual"
  },
  
  // Monthly Plans
  {
    id: 4,
    name: "Basic Monthly",
    description: "Essential service plan with monthly billing",
    price: "17.99",
    interval: "month",
    features: [
      "Annual service visit", 
      "Equipment check-up", 
      "Priority scheduling", 
      "10% discount on services"
    ],
    isPopular: false,
    order: 4,
    stripePriceId: "price_monthly_basic",
    billingType: "monthly"
  },
  {
    id: 5, 
    name: "Premium Monthly",
    description: "Comprehensive service plan with monthly billing",
    price: "24.99", 
    interval: "month",
    features: [
      "Semi-annual service visits", 
      "Preventative maintenance", 
      "Priority scheduling", 
      "15% discount on services", 
      "No overtime charges"
    ],
    isPopular: true,
    order: 5,
    stripePriceId: "price_monthly_premium",
    billingType: "monthly"
  },
  {
    id: 6,
    name: "Ultimate Monthly", 
    description: "Complete protection with monthly billing",
    price: "34.99",
    interval: "month", 
    features: [
      "Quarterly service visits", 
      "Comprehensive inspections", 
      "Same-day service", 
      "20% discount on services", 
      "No overtime charges", 
      "Free diagnostic visits"
    ],
    isPopular: false,
    order: 6,
    stripePriceId: "price_monthly_ultimate",
    billingType: "monthly"
  }
];

// Testimonials for the widget
export const Testimonials = [
  {
    text: "The Basic Plan has been a great investment. Their service professionals are always on time and very thorough with their work.",
    author: "Michael R., Austin",
    rating: 5,
    timeAgo: "1 month ago"
  },
  {
    text: "Premium Plan saved us during an emergency! The 24/7 priority service is worth every penny. Highly recommend!",
    author: "Sarah T., Austin",
    rating: 5,
    timeAgo: "2 weeks ago"
  }
];

// FAQs for the widget
export const FAQs = [
  {
    question: "What's included in a service visit?",
    answer: "Our service visits include a comprehensive inspection, preventative maintenance, necessary adjustments, and a safety check to ensure your home systems are working efficiently and reliably."
  },
  {
    question: "How often should I schedule service?",
    answer: "We recommend scheduling service based on your specific plan. Basic plans include annual visits, while Premium and Ultimate plans include more frequent service to ensure optimal performance year-round."
  },
  {
    question: "Can I cancel or change my plan?",
    answer: "Yes, you can cancel or change your plan at any time. Monthly plans can be canceled with 30 days notice. Annual plans are non-refundable but can be transferred to a new homeowner if you move."
  },
  {
    question: "What are the service discounts?",
    answer: "Basic Plan members receive 10% off all services and parts. Premium Plan members receive 15% off, and Ultimate Plan members receive 20% off. These discounts apply to both emergency services and scheduled work."
  }
];

// Benefits for the widget
export const Benefits = [
  {
    title: "Cost Savings",
    description: "Reduce unexpected expenses & repairs",
    icon: "bolt"
  },
  {
    title: "Extended Equipment Life",
    description: "Regular service prolongs system lifespan",
    icon: "shield"
  },
  {
    title: "Service Discounts",
    description: "Save on additional services & parts",
    icon: "dollar"
  },
  {
    title: "Peace of Mind",
    description: "Priority service when you need it most",
    icon: "heart"
  }
];
