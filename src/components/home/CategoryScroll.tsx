'use client';

import React from 'react';

const categories = [
  { id: '1', name: 'StreetFood', displayName: 'Street Food', image: 'https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'FastFood', displayName: 'Fast Food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Beverages', displayName: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Desserts', displayName: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'FineDine', displayName: 'Fine Dine', image: '/finedine.jpg' },
];

interface CategoryScrollProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({ onCategorySelect, selectedCategory }) => {
  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      onCategorySelect(null); // Deselect if clicking the same category
    } else {
      onCategorySelect(categoryName);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 p-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 text-center cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className={`w-[66px] h-[66px] rounded-full overflow-hidden mb-2 ${
              selectedCategory === category.name ? 'ring-2 ring-primary' : ''
            }`}>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-xs font-medium ${
              selectedCategory === category.name ? 'text-gray-700' : 'text-gray-700'
            }`}>
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};