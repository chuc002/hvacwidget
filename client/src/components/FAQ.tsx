import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
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

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 text-left font-medium text-gray-800 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-gray-600">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
