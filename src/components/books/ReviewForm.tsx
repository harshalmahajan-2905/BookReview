import React, { useState } from 'react';
import { reviewService } from '../../services/reviewService';
import StarRating from '../ui/StarRating';
import Alert from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ReviewFormProps {
  bookId: string;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 5) {
      setError('Comment must be at least 5 characters long');
      return;
    }

    setLoading(true);
    try {
      await reviewService.addReview(bookId, rating, comment);
      setSuccess('Review added successfully!');
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Share your thoughts about this book..."
            required
            minLength={5}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {comment.length}/1000
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Review</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;