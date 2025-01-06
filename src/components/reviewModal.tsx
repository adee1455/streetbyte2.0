import React, { useState, useEffect } from 'react';
import { Star, X, ImagePlus } from 'lucide-react';
import { storage } from '../lib/appwrite';
import { ID } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const id = Date.now().toString();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files).slice(0, 4 - images.length);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newFiles.map(file => file.preview)]);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    const urls: string[] = [];
    for (const file of files) {
      try {
        const response = await storage.createFile(
          '676ab6de002caef140d0',
          ID.unique(),
          file
        );
        const url = storage.getFilePreview('676ab6de002caef140d0', response.$id);
        urls.push(url);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    if (!review.trim()) {
      alert("Please write a review");
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await uploadImages(images.map(image => image.file));
      const reviewData = {
        id,
        vendor_id,
        user_id: session?.user.id || '101',
        name: session?.user.name,
        rating,
        review,
        created: new Date().toISOString(),
      };

      await insertReview(reviewData);
      await insertReviewImages(reviewData, imageUrls);

      onClose();
      setRating(0);
      setReview('');
      setImages([]);
      setImagePreviews([]);
      router.refresh();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const insertReview = async (reviewData: any) => {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create review: ${(await response.json()).message}`);
    }
  };

  const insertReviewImages = async (reviewData: any, imageUrls: string[]) => {
    for (const url of imageUrls) {
      const imageData = {
        id: ID.unique(),
        vendor_id,
        review_id: reviewData.id,
        image_url: url,
        created_at: new Date().toISOString(),
      };

      const response = await fetch('/api/review-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        console.error(`Failed to insert review image: ${(await response.json()).message}`);
      }
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  //       <div className="bg-white rounded-lg w-full max-w-md p-8">
  //         <div className="text-center space-y-4">
  //           <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
  //           <p className="text-sm text-gray-500">
  //             Please login to your account to add a review
  //           </p>
  //           <div className="mt-5">
  //             <button
  //               onClick={() => router.push('/auth/signin')}
  //               className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
  //             >
  //               Login to Continue
  //             </button>
  //             <button
  //               onClick={onClose}
  //               className="w-full mt-3 text-gray-600 hover:text-gray-800"
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Share your experience..."
            />
          </div>

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
              {images.length < 4 && (
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
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-500 text-white py-2 px-4 rounded-md transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
