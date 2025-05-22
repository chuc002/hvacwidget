// Backup plan details in case API fails
export const PlanDetails = [
  {
    id: 1,
    name: "Basic",
    description: "Basic maintenance plan with per-visit pricing",
    price: "129.00",
    interval: "one-time",
    features: [
      "Comprehensive system check",
      "Filter replacement (standard)",
      "System cleaning"
    ],
    isPopular: false,
    order: 1,
    stripePriceId: "price_1RRcnlGxl1XxufT4i2vJmX0m"
  },
  {
    id: 2,
    name: "Standard",
    description: "Annual maintenance plan with two visits per year",
    price: "225.00",
    interval: "year",
    features: [
      "Two maintenance visits per year",
      "Priority scheduling",
      "15% discount on repairs",
      "Filter subscription (4 filters/year)"
    ],
    isPopular: true,
    order: 2,
    stripePriceId: "price_1RRcoYGxl1XxufT4KFZbeJsn"
  },
  {
    id: 3,
    name: "Premium",
    description: "Premium monthly maintenance plan with 24/7 support",
    price: "20.00",
    interval: "month",
    features: [
      "Two maintenance visits per year",
      "24/7 emergency service",
      "25% discount on repairs",
      "Premium filter subscription",
      "Extended parts warranty"
    ],
    isPopular: false,
    order: 3,
    stripePriceId: "price_1RRcp8Gxl1XxufT4oYuK4HG5"
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
