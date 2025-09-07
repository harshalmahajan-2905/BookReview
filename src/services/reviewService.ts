import api from './api';
import { Review } from './bookService';

class ReviewService {
  async addReview(bookId: string, rating: number, comment: string): Promise<Review> {
    try {
      const response = await api.post('/reviews', {
        bookId,
        rating,
        comment,
      });
      return response.data.review;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add review');
    }
  }

  async getReviewsForBook(bookId: string): Promise<Review[]> {
    try {
      const response = await api.get(`/reviews/${bookId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }

  async getUserReviews(): Promise<Review[]> {
    try {
      const response = await api.get('/reviews/user/my-reviews');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch your reviews');
    }
  }

  async updateReview(id: string, rating: number, comment: string): Promise<Review> {
    try {
      const response = await api.put(`/reviews/${id}`, {
        rating,
        comment,
      });
      return response.data.review;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update review');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await api.delete(`/reviews/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
  }
}

export const reviewService = new ReviewService();
