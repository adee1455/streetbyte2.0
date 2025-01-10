import React from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Vendor {
  id: string;
  name: string;
  description: string;
  address: string;
  contact_number: string;
  rating: string; 
  foodType: string;
  images: string[]; 
  menu: string[]; 
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const router = useRouter()
  return (
    <Link
      href={`/vendorPage/${vendor.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
            src={vendor.images.length > 0 ? vendor.images[0] : '/jade.png'}
            alt={vendor.name}
           className="w-full h-48 object-cover"
        />

        <div className="absolute top-3 right-3 bg-white text-gray-600 px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          {vendor.rating}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            20-30 min
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{vendor.foodType}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
              {vendor.address.length > 30 
              ? `${vendor.address.slice(0, 30)}...` 
              : vendor.address}
          </span>
          <span className="font-medium text-green-600">Open Now</span>
        </div>
      </div>
    </Link>
  );
}