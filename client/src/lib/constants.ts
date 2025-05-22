// Backup plan details in case API fails
export const PlanDetails = [
  // Annual Plans
  {
    id: 1,
    name: "Basic",
    description: "Essential maintenance with annual billing",
    price: "149.99",
    interval: "year",
    features: [
      "Annual tune-up", 
      "Filter replacement", 
      "Priority scheduling", 
      "10% discount on repairs"
    ],
    isPopular: false,
    order: 1,
    stripePriceId: "price_1RRcnlGxl1XxufT4i2vJmX0m",
    billingType: "annual"
  },
  {
    id: 2,
    name: "Premium",
    description: "Comprehensive maintenance with annual billing",
    price: "249.99",
    interval: "year",
    features: [
      "Semi-annual tune-ups", 
      "Filter replacements", 
      "Priority scheduling", 
      "15% discount on repairs", 
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
      "Quarterly tune-ups", 
      "Filter replacements", 
      "Same-day service", 
      "20% discount on repairs", 
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
    description: "Essential maintenance with monthly billing",
    price: "17.99",
    interval: "month",
    features: [
      "Annual tune-up", 
      "Filter replacement", 
      "Priority scheduling", 
      "10% discount on repairs"
    ],
    isPopular: false,
    order: 4,
    stripePriceId: "price_monthly_basic",
    billingType: "monthly"
  },
  {
    id: 5, 
    name: "Premium Monthly",
    description: "Comprehensive maintenance with monthly billing",
    price: "24.99", 
    interval: "month",
    features: [
      "Semi-annual tune-ups", 
      "Filter replacements", 
      "Priority scheduling", 
      "15% discount on repairs", 
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
    description: "Complete care with monthly billing",
    price: "34.99",
    interval: "month", 
    features: [
      "Quarterly tune-ups", 
      "Filter replacements", 
      "Same-day service", 
      "20% discount on repairs", 
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
    text: "The Standard Plan has been a great investment. Their technicians are always on time and very thorough with maintenance checks.",
    author: "Michael R., Austin",
    rating: 5,
    timeAgo: "1 month ago"
  },
  {
    text: "Premium Plan saved us during a summer heatwave! The 24/7 emergency service is worth every penny. Highly recommend!",
    author: "Sarah T., Austin",
    rating: 5,
    timeAgo: "2 weeks ago"
  }
];

// FAQs for the widget
export const FAQs = [
  {
    question: "What's included in a maintenance visit?",
    answer: "Our maintenance visits include a comprehensive system check, cleaning of key components, filter replacement, lubrication of moving parts, calibration of thermostat, and a safety inspection to ensure everything is working efficiently."
  },
  {
    question: "How often should I schedule maintenance?",
    answer: "We recommend scheduling maintenance twice a year - once in spring for your AC system and once in fall for your heating system. This ensures your HVAC system is ready before extreme weather seasons."
  },
  {
    question: "Can I cancel or change my plan?",
    answer: "Yes, you can cancel or change your plan at any time. Monthly plans can be canceled with 30 days notice. Annual plans are non-refundable but can be transferred to a new homeowner if you move."
  },
  {
    question: "What are the repair discounts?",
    answer: "Standard Plan members receive 15% off all repairs and parts. Premium Plan members receive 25% off all repairs and parts. These discounts apply to both emergency services and scheduled repairs."
  }
];

// Benefits for the widget
export const Benefits = [
  {
    title: "Energy Savings",
    description: "Reduce utility bills by up to 15%",
    icon: "bolt"
  },
  {
    title: "Extended Equipment Life",
    description: "Regular maintenance prolongs system life",
    icon: "shield"
  },
  {
    title: "Repair Discounts",
    description: "Save on services and parts",
    icon: "dollar"
  },
  {
    title: "Peace of Mind",
    description: "Priority service during peak seasons",
    icon: "heart"
  }
];
