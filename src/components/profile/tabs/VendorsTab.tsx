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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
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
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-lg font-medium text-gray-600">Loading reviews...</div>
      </div>
    );
  }


  const handleCardClick = (vendorId: string) => {
    // Navigate to vendor's reviews section
    window.location.href = `/vendorPage/${vendorId}#reviews`;
  };

  const handleDeleteClick = (vendorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVendorToDelete(vendorId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vendorToDelete) return;

    try {
      const response = await fetch(`/api/deleteVendor?vendorId=${vendorToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete vednor');
      }

      setVendors(vendors.filter((vendor) => vendor.id !== vendorToDelete));
      console.log('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting Vendor:', error);
    } finally {
      setShowDeleteModal(false);
      setVendorToDelete(null);
    }
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Delete Vendor</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this Vendor? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <DeleteConfirmationModal />
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
                    <button 
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors duration-200"
                          onClick={(e) => handleDeleteClick(vendor.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-1 text-sm text-left text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vendor.address.length > 30 
                    ? `${vendor.address.slice(0, 30)}...` 
                    : vendor.address}
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
