import React, { useState, useEffect } from 'react';
import { bookService, Book, BooksResponse } from '../services/bookService';
import BookForm from '../components/admin/BookForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import StarRating from '../components/ui/StarRating';
import { Plus, Edit, Trash2, BookOpen, Users, Star, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [booksData, setBooksData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks('', 1, 100); // Get more books for admin
      setBooksData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(undefined);
    setShowBookForm(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleBookSaved = () => {
    setShowBookForm(false);
    setEditingBook(undefined);
    fetchBooks();
  };

  const handleDeleteBook = async (book: Book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"? This will also delete all associated reviews.`)) {
      return;
    }

    try {
      await bookService.deleteBook(book._id);
      setSuccess('Book deleted successfully');
      fetchBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const stats = booksData ? {
    totalBooks: booksData.pagination.totalBooks,
    totalReviews: booksData.books.reduce((sum, book) => sum + book.reviewCount, 0),
    averageRating: booksData.books.length > 0 
      ? booksData.books.reduce((sum, book) => sum + book.averageRating, 0) / booksData.books.length
      : 0,
    topRatedBooks: booksData.books.filter(book => book.averageRating >= 4 && book.reviewCount > 0).length
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage books and monitor platform activity</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Rated Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.topRatedBooks}</p>
                <p className="text-xs text-gray-500">(4+ stars)</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Management */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Book Management</h2>
            <button
              onClick={handleAddBook}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {showBookForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <BookForm
              book={editingBook}
              onBookSaved={handleBookSaved}
              onCancel={() => setShowBookForm(false)}
            />
          </div>
        )}

        <div className="p-6">
          {booksData && booksData.books.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Book</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Reviews</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Genre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {booksData.books.map((book) => (
                    <tr key={book._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <BookOpen className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{book.author}</td>
                      <td className="py-4 px-4">
                        <StarRating rating={book.averageRating} size="sm" readOnly />
                      </td>
                      <td className="py-4 px-4 text-gray-900">{book.reviewCount}</td>
                      <td className="py-4 px-4">
                        {book.genre && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {book.genre}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit book"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No books found. Start by adding your first book.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;