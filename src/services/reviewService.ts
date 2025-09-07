import axios from 'axios';
import { Review } from './bookService';

const API_URL = 'http://localhost:5000/api';

class ReviewService {
  async addReview(bookId: string, rating: number, comment: string): Promise<Review> {
    try {
      const response = await axios.post(`${API_URL}/reviews`, {
        bookId,
        rating,
        comment
      });
      return response.data.review;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add review');
    }
  }

  async getReviewsForBook(bookId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/reviews/${bookId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }

  async getUserReviews(): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/reviews/user/my-reviews`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch your reviews');
    }
  }

  async updateReview(id: string, rating: number, comment: string): Promise<Review> {
    try {
      const response = await axios.put(`${API_URL}/reviews/${id}`, {
        rating,
        comment
      });
      return response.data.review;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update review');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
  }
}

export const reviewService = new ReviewService();