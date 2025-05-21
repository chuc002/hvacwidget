import React from 'react';

export default function Testimonials() {
  const testimonials = [
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

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">What Our Customers Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600 text-sm">{testimonial.timeAgo}</span>
            </div>
            <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
            <div className="text-sm font-medium text-gray-800">- {testimonial.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
