import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookService, Book } from '../services/bookService';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/ui/StarRating';
import ReviewForm from '../components/books/ReviewForm';
import ReviewList from '../components/books/ReviewList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { Calendar, User, Hash, Tag } from 'lucide-react';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const bookData = await bookService.getBookById(id);
      setBook(bookData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchBookDetails();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert type="error" message={error || 'Book not found'} />
      </div>
    );
  }

  const userHasReviewed = book.reviews?.some(review => review.userId._id === user?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Book Details */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {/* Cover Image */}
          <div className="md:w-1/3">
            <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">📚</div>
                    <div className="text-lg font-medium text-gray-600">
                      {book.title}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {book.title}
            </h1>

            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-xl text-gray-700 font-medium">{book.author}</span>
            </div>

            <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
              {book.publishedYear && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{book.publishedYear}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center space-x-1">
                  <Hash className="h-4 w-4" />
                  <span>{book.isbn}</span>
                </div>
              )}
              {book.genre && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{book.genre}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <StarRating rating={book.averageRating} size="lg" showValue readOnly />
                <span className="text-gray-600">
                  ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Book</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Form */}
        <div className="lg:col-span-1">
          {user && !userHasReviewed ? (
            <ReviewForm bookId={book._id} onReviewAdded={handleReviewAdded} />
          ) : !user ? (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              <p className="text-gray-600 mb-4">
                Sign in to share your thoughts about this book
              </p>
              <a
                href="/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Submitted</h3>
              <p className="text-gray-600">
                Thank you for reviewing this book! You can see your review below.
              </p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Reviews ({book.reviewCount})
            </h3>
            <ReviewList reviews={book.reviews || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;