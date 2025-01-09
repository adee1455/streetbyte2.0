import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Star, Edit, Trash2 } from 'lucide-react';
import { Vendor } from '@/types';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export const VendorsTab: React.FC = () => {
  const { data: session } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserVendors = async () => {
      try {
        const response = await fetch(`/api/profileVendors?username=${session?.user?.name}`);
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.name) {
      fetchUserVendors();
    }
  }, [session?.user?.name]);

  if (loading) {
    return <div>Loading vendors...</div>;
  }

  const handleCardClick = (vendorId: string) => {
    // Navigate to vendor's reviews section
    window.location.href = `/vendorPage/${vendorId}#reviews`;
  };
  return (
    <div className="space-y-4">
      {vendors.length === 0 ? (
        <p className="text-gray-500">You haven't added any vendors yet.</p>
      ) : (
        vendors.map((vendor) => (
          <button 
          key={vendor.id} 
          className="w-full cursor-pointer"
          onClick={() => handleCardClick(vendor.id)}
          style={{ display: 'block', border: 'none', padding: 0, margin: 0 }}
        >

          <div key={vendor.id} className="bg-white rounded-lg p-4 m-2 shadow-md">
            <div className="flex gap-4">
              <img
                src={vendor.images[0]}
                alt={vendor.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                  <div className="flex gap-2">
                    {/* <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-5 h-5" />
                    </button> */}
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-1 text-sm text-left text-gray-600 ">
                  <MapPin className="w-4 h-4 mr-1" />
                  {vendor.address}
                </div>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
                </div>
      
              </div>
            </div>
          </div>
          </button>
        ))
      )}
    </div>
  );
};
