import React from 'react';
import { MapPin, Star, Edit, Trash2 } from 'lucide-react';

const mockVendors = [
  {
    id: '1',
    name: 'Street Taco Express',
    location: 'Food Street, Downtown',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=300',
    status: 'approved',
  },
  {
    id: '2',
    name: 'Dim Sum Paradise',
    location: 'China Town, City Center',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1455279032140-49a4bf46f343?auto=format&fit=crop&q=80&w=300',
    status: 'pending',
  },
];

export const VendorsTab = () => {
  return (
    <div className="space-y-4">
      {mockVendors.map((vendor) => (
        <div key={vendor.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-4">
            <img
              src={vendor.image}
              alt={vendor.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {vendor.location}
              </div>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
              </div>
              <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                vendor.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};