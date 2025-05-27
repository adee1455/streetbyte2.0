import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Navigation } from '../layout/Navigation';
import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  email: string;
  photoURL: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, photoURL }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset states when photoURL changes or component mounts
    setImgSrc(null);
    setImageError(false);
    setLoading(true);

    if (photoURL && photoURL.trim() !== '') {
      // Attempt to load the image after component mounts
      setImgSrc(photoURL);
    } else {
      // No photoURL provided, show error state immediately
      setImageError(true);
      setLoading(false);
    }
  }, [photoURL]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError(true);
    setImgSrc(null); // Clear imgSrc to prevent further load attempts on error
  };

  return (
    <div className="relative">
      <div className="h-12 bg-white border-t " />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          <div className="flex items-end">
            <div className="relative pt-5">
              <div className="relative h-32 w-32">
                {loading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                )}
                {imgSrc && !imageError && (
                  <img
                    src={imgSrc}
                    alt="Profile"
                    className="rounded-full border-4 border-white object-cover w-full h-full"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    // Consider adding crossOrigin="anonymous" if hosted on a different domain and encountering CORS issues
                  />
                )}
                {!loading && imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 pb-4 pt-4">
              <h1 className="text-2xl font-bold text-gray-900">{name || 'User Name'}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};