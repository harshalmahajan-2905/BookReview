import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Invalid book ID' });
    }
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

// Add a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this book' });
    }

    // Create review
    const review = new Review({
      bookId,
      userId: req.user._id,
      rating: parseInt(rating),
      comment
    });

    await review.save();

    // Update book's average rating and review count
    const reviews = await Review.find({ bookId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });

    // Populate user info for response
    await review.populate('userId', 'name');

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Invalid book ID' });
    }
    res.status(500).json({ error: 'Server error adding review' });
  }
});

// Get user's reviews
router.get('/user/my-reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching your reviews' });
  }
});

// Update a review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    review.rating = parseInt(rating) || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // Recalculate book's average rating
    const allReviews = await Review.find({ bookId: review.bookId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await Book.findByIdAndUpdate(review.bookId, {
      averageRating: Math.round(averageRating * 10) / 10
    });

    await review.populate('userId', 'name');

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(500).json({ error: 'Server error updating review' });
  }
});

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    const bookId = review.bookId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate book's average rating and review count
    const remainingReviews = await Review.find({ bookId });
    let averageRating = 0;

    if (remainingReviews.length > 0) {
      const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
      averageRating = Math.round((totalRating / remainingReviews.length) * 10) / 10;
    }

    await Book.findByIdAndUpdate(bookId, {
      averageRating,
      reviewCount: remainingReviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(500).json({ error: 'Server error deleting review' });
  }
});

export default router;