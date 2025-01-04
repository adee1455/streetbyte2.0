"use client";
import React, { useEffect, useState } from 'react';
import { Vendor } from '../../../types';
import { Star, Phone, Navigation2, PenSquareIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AddressSection } from '../../../components/vendor/AddressSection';
import { ImageGallery } from '../../../components/vendor/ImageGallery';
import { Modal } from '../../../components/ui/Modal';
import ReviewModal from '@/components/reviewModal';
import { formatDistanceToNow } from 'date-fns';


interface VendorPageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: VendorPageProps) {
  // Unwrap `params` with React's `use` directive
  const { id } = React.use(params);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isreviewModalOpen, setIsreviewModalOpen] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);




  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/vendorPage?id=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && typeof data === 'object' && data.id) {
          setVendor(data as Vendor);
        } else {
          throw new Error('Invalid data format received.');
        }
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError('Unable to load vendor information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when the `id` parameter is available
    if (id) {
      fetchVendor();
    }
  }, [id]);

  if (loading) {
    return <div>Loading vendor information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const safeAddress = encodeURIComponent(vendor?.address || '');
  const safePhone = encodeURIComponent(vendor?.contact_number || '');
  console.log(vendor?.reviews);

  // If the vendor data is loaded, render it here
  return (
    <div className="min-h-screen bg-white text-gray-950">
      {vendor ? (
        <>
          <div>
            {/* Image Gallery Section */}
            <ImageGallery images={vendor.images} />

            {/* Vendor Details */}
            <div className="bg-white">
              <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
                <div className="pb-4 border-b">
                  <h1 className="text-[26px] font-bold font-Proxima text-black">
                    {vendor.name}
                  </h1>
                  <p className="text-gray-600 text-sm font-Proxima">
                    {vendor.foodType}
                  </p>
                  <p className="text-gray-600 font-Proxima text-sm">
                    {vendor.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-5xl mx-auto pt-4 pb-2">
              <div className="px-2">
                <h2 className="font-semibold mb-3 text-lg pl-2">Description</h2>
                <p className="px-2 text-sm text-gray-700 text-justify">
                  {vendor.description}
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white mt-2">
              <div className="max-w-5xl mx-auto px-4 py-4">
                <h2 className="font-semibold mb-3 text-lg">More Info</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Star className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm">Home Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div className="p-2 px-4">
              <h2 className="text-xl font-Proxima font-semibold">Menu</h2>
              <div className="pt-3 pb-2 bg-white flex">
                {Array.isArray(vendor.menu) && vendor.menu.length > 0 ? (
                  vendor.menu.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      className="h-32 cursor-pointer pl-4"
                      alt={`Menu item ${index + 1}`}
                      onClick={() => openModal(item)}
                    />
                  ))
                ) : (
                  <p>No menu items available.</p>
                )}
              </div>
            </div>

            {/* Image Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div className="flex justify-center items-center h-full">
                <img
                  src={selectedImage}
                  alt="Menu"
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              </div>
            </Modal>

            {/* Address Section */}
            <div className="pb-10">
              <AddressSection address={vendor.address} />
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Direction Button */}
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    if (vendor?.address) {
                      const googleMapsUrl = `https://maps.google.com/?q=${safeAddress}`;
                      console.log("Navigating to:", googleMapsUrl);
                      document.location.href = googleMapsUrl;
                    } else {
                      alert("Address is not available.");
                    }
                  }}
                >
                  <Navigation2 className="w-4 h-4" />
                  Direction
                </Button>

                {/* Call Button */}
                <Button
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    if (vendor?.contact_number) {
                      const phoneNumber = `tel:+91${safePhone}`;
                      console.log("Calling:", phoneNumber);
                      document.location.href = phoneNumber;
                    } else {
                      alert("Contact number is not available.");
                    }
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewModal
              isOpen={isreviewModalOpen}
              onClose={() => setIsreviewModalOpen(false)}
              vendor_id={vendor.id}
            />
            <div className="mt-2 px-4 py-4 pb-24">
              <div className="flex gap-2 justify-between">
                <h2 className="text-xl font-Proxima font-semibold mb-4">
                  Reviews
                </h2>
                <div className="pt-1">
                  <button onClick={() => setIsreviewModalOpen(true)}>
                    <PenSquareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {vendor.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.name}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {getReviewAge(review.created)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                    {/* Review Image Section */}

                    {Array.isArray(review.reviewImages) && review.reviewImages.length > 0 ? (
                      <div className="flex gap-2 mt-2">
                        {review.reviewImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="h-16 cursor-pointer"
                            onClick={() => setSelectedReviewImage(image)}
                          />
                        ))}
                      </div>
                    ) : null}
                    {/* Image Modal for Reviews */}
                    <Modal isOpen={!!selectedReviewImage} onClose={() => setSelectedReviewImage(null)}>
                      <div className="flex justify-center items-center h-full">
                        {selectedReviewImage && (
                          <img
                            src={selectedReviewImage}
                            alt="Review"
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                          />
                        )}
                      </div>
                    </Modal>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>No vendor data found.</p>
      )}
    </div>
  );
}

// Function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options); // Adjust locale as needed
};

// Function to calculate how old the review is
const getReviewAge = (dateString: string) => {
  const reviewDate = new Date(dateString);
  const now = new Date();

  // Convert both dates to IST
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata', // Set timezone to IST
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  // Calculate the difference in milliseconds
  const diffInSeconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInWeek = secondsInDay * 7;
  const secondsInMonth = secondsInDay * 30; // Approximation

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} old`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} old`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? 's' : ''} old`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? 's' : ''} old`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} week${weeks !== 1 ? 's' : ''} old`;
  } else {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? 's' : ''} old`;
  }
};


