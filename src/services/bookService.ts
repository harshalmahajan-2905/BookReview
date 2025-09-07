import api from './api';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
  coverImage?: string;
  averageRating: number;
  reviewCount: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  bookId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
  };
}

class BookService {
  async getAllBooks(search?: string, page = 1, limit = 10): Promise<BooksResponse> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/books?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch books');
    }
  }

  async getBookById(id: string): Promise<Book> {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch book details');
    }
  }

  async addBook(bookData: Partial<Book>): Promise<Book> {
    try {
      const response = await api.post('/books', bookData);
      return response.data.book;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add book');
    }
  }

  async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data.book;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update book');
    }
  }

  async deleteBook(id: string): Promise<void> {
    try {
      await api.delete(`/books/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete book');
    }
  }
}

export const bookService = new BookService();
