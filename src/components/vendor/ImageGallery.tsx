import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[]; // Array of strings instead of objects
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

  if (!images || images.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <>
      <div className="relative h-56 md:h-96">
        {/* Main Image */}
        <Image
          src={images[0]} // Access the URL directly
          alt="Main"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
          width={800} // Add dimensions for Next.js optimization
          height={600}
        />

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.slice(1, 4).map((image, index) => (
              <button
                key={index}
                className="w-20 h-20 rounded-lg overflow-hidden"
                onClick={() => {
                  setCurrentImageIndex(index + 1);
                  setShowModal(true);
                }}
              >
                <Image
                  src={image} // Directly use the string URL
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
              </button>
            ))}
            {images.length > 4 && (
              <button
                className="w-20 h-20 rounded-lg overflow-hidden relative"
                onClick={() => {
                  setCurrentImageIndex(4);
                  setShowModal(true);
                }}
              >
                <Image
                  src={images[4]}
                  alt="More"
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{images.length - 4}
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full-Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="h-full flex items-center justify-center">
            <button
              onClick={handlePrevious}
              className="absolute left-4 text-white p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <Image
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              width={800}
              height={600}
            />

            <button
              onClick={handleNext}
              className="absolute right-4 text-white p-2"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
