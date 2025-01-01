import React from 'react';

const categories = [
  { id: '1', name: 'Street Food', image: 'https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Fast Food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=200' },
];

export const CategoryScroll = () => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 p-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 text-center"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};