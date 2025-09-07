import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../services/bookService';
import StarRating from '../ui/StarRating';
import { Calendar, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      to={`/books/${book._id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-gray-400 mb-2">📚</div>
              <div className="text-sm font-medium text-gray-600 line-clamp-3">
                {book.title}
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>

        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <User className="h-4 w-4" />
          <span className="font-medium">{book.author}</span>
        </div>

        {book.publishedYear && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <Calendar className="h-4 w-4" />
            <span>{book.publishedYear}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {book.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StarRating rating={book.averageRating} size="sm" readOnly />
            <span className="text-sm text-gray-600">
              ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          {book.genre && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {book.genre}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;