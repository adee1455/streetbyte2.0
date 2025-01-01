import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: { image_url: string }[];  // Adjusted the type to match your API structure
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative h-56 md:h-96">
        {/* Main Image */}
        <img
          src={images[0]?.image_url}
          alt="Main"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        
        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(index + 1);
                  setShowModal(true);
                }}
              >
                <img
                  src={image?.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {images.length > 4 && (
              <div
                className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer relative"
                onClick={() => {
                  setCurrentImageIndex(4);
                  setShowModal(true);
                }}
              >
                <img
                  src={images[4]?.image_url}
                  alt="More"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{images.length - 4}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="h-full flex items-center justify-center">
            <button
              onClick={handlePrevious}
              className="absolute left-4 text-white p-2"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={images[currentImageIndex]?.image_url}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <button
              onClick={handleNext}
              className="absolute right-4 text-white p-2"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-gray-500'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
