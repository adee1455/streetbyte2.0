import React, { useEffect, useState } from 'react';
import { Edit, Star, Trash2, Calendar, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface Review {
  id: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  addedBy: string;
  images?: string[];
}

export const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`/api/profileReviews?username=${session?.user?.name}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.name) {
      fetchUserReviews();
    }
  }, [session?.user?.name]);

  const handleCardClick = (vendorId: string) => {
    window.location.href = `/vendorPage/${vendorId}#reviews`;
  };

  const handleDeleteClick = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await fetch(`/api/deleteReview?reviewId=${reviewToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete review');
      }

      setReviews(reviews.filter((review) => review.id !== reviewToDelete));
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Delete Review</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this review? This action cannot be undone.
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-lg font-medium text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DeleteConfirmationModal />
      
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-xl font-medium text-gray-600">No reviews yet</p>
          <p className="text-gray-500 mt-2">Share your experiences by writing your first review</p>
        </div>
      ) : (
        reviews.map((review) => (
          <button 
            key={review.id} 
            className="w-full cursor-pointer"
            onClick={() => handleCardClick(review.vendorId)}
            style={{ display: 'block', border: 'none', padding: 0, margin: 0 }}
          >
            <Card className="w-full m-2">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 mt-4 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {review.images && review.images.length > 0 ? (
                      <div className=" w-full h-full">
                        <img
                          src={review.images[0]}
                          alt={`Review for ${review.vendorName}`}
                          className="object-cover w-full h-full"
                        />
                        {review.images.length > 1 && (
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                            +{review.images.length - 1}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-left text-gray-900 text-lg hover:text-gray-700">
                          {review.vendorName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors duration-200"
                          onClick={(e) => handleDeleteClick(review.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-2 text-left line-clamp-2">{review.comment}</p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))
      )}
    </div>
  );
};

export default ReviewsTab;