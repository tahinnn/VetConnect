const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

console.log('Review routes loaded');

// Get all reviews
// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('userId', 'name userType');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Create a new review (requires authentication)
// POST /api/reviews
router.post('/', auth, async (req, res) => {
  console.log('Received review request with user:', req.user);
  try {
    const { rating, reviewText } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userType = req.user.userType;

    console.log('Creating review with data:', {
      userId,
      userName,
      userType,
      rating,
      reviewText
    });

    // Check if user has already submitted a review
    const existingReview = await Review.findOne({ userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review' });
    }

    const newReview = new Review({
      userId,
      rating,
      reviewText,
      userName,
      userType
    });
    
    console.log('New review data:', newReview);

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid review data',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// Get reviews by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
});

// Update a review (owner only)
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

// Delete a review (owner only)
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;
