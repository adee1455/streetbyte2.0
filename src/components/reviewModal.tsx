import React, { useState, useEffect } from 'react';
import { Star, X, ImagePlus } from 'lucide-react';
import { storage } from '../lib/appwrite';
import { ID } from 'appwrite';
import { useRouter } from 'next/router';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor_id: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

export default function ReviewModal({ isOpen, onClose, vendor_id }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const id = Date.now().toString();

  useEffect(() => {
    // Clean up object URLs to prevent memory leaks
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...files]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...files.map(file => file.preview)]);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    const urls: string[] = [];
    for (const file of files) {
      try {
        const response = await storage.createFile(
          '676ab6de002caef140d0', // Replace with your actual bucket ID
          ID.unique(),
          file
        );
        const url = response.$id;
        const imgUrl = storage.getFilePreview('676ab6de002caef140d0', url);
        urls.push(imgUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const imageUrls = await uploadImages(images.map(image => image.file)); // Upload images and get URLs

    // Prepare the review data
    const reviewData = {
      id,
      vendor_id,
      user_id: '101', // Replace with actual user ID
      name: 'Adee Shaikh', // Replace with actual user name
      rating,
      review,
      created: new Date().toISOString(), // Current date in ISO format
    };

    // Insert review into the database
    await insertReview(reviewData);

    // Insert review images into the database
    await insertReviewImages(reviewData,imageUrls);

    onClose(); // Close the modal after submission
  };

  const insertReview = async (reviewData: any) => {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create review: ${errorData.message}`);
    }
  };

  const insertReviewImages = async (reviewData: any, imageUrls: string[]) => {
    for (const url of imageUrls) {
      const imageData = {
        id,
        vendor_id,
        review_id: reviewData.id, // Replace with the actual review ID after insertion
        image_url: url,
        created_at: new Date().toISOString(),
      };

      const response = await fetch('/api/review-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to insert review image: ${errorData.message}`);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Revoke the URL of the removed image
    URL.revokeObjectURL(images[index].preview);
    setImages(newImages);
    setImagePreviews(newImages.map(image => image.preview));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Share your experience..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Add Photos</label>
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed rounded flex items-center justify-center h-20 cursor-pointer hover:border-red-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <ImagePlus className="text-gray-400" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
