import express from 'express';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(query)
      .select('title author description averageRating reviewCount coverImage genre publishedYear')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching books' });
  }
});

// Get book by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const reviews = await Review.find({ bookId: book._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      ...book.toObject(),
      reviews
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Server error fetching book' });
  }
});

// Add new book (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { title, author, description, isbn, publishedYear, genre, coverImage } = req.body;

    const book = new Book({
      title,
      author,
      description,
      isbn,
      publishedYear,
      genre,
      coverImage,
      createdBy: req.user._id
    });

    await book.save();

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'ISBN already exists' });
    }
    res.status(500).json({ error: 'Server error adding book' });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Server error updating book' });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Delete associated reviews
    await Review.deleteMany({ bookId: req.params.id });

    res.json({ message: 'Book and associated reviews deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Server error deleting book' });
  }
});

export default router;