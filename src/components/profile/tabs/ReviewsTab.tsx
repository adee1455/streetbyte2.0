import React from 'react';
import { Star } from 'lucide-react';

const mockReviews = [
  {
    id: '1',
    vendorName: 'Street Taco Express',
    rating: 4.5,
    date: '2024-02-15',
    comment: 'Amazing tacos! The flavors are authentic and the service is great.',
    images: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=300'],
  },
  {
    id: '2',
    vendorName: 'Dim Sum Paradise',
    rating: 5,
    date: '2024-02-10',
    comment: 'Best dim sum in the city! Everything was fresh and delicious.',
    images: ['https://images.unsplash.com/photo-1455279032140-49a4bf46f343?auto=format&fit=crop&q=80&w=300'],
  },
];

export const ReviewsTab = () => {
  return (
    <div className="space-y-6">
      {mockReviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{review.vendorName}</h3>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-600">{review.date}</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-gray-600">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="mt-3 flex gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};