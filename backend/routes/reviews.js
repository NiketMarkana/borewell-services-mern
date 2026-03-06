const express = require('express');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews?targetType=&targetId=
// @desc    Get reviews for a target
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { targetType, targetId } = req.query;
        if (!targetType || !targetId) {
            return res.status(400).json({ message: 'targetType and targetId are required' });
        }

        const reviews = await Review.find({ targetType, targetId })
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/reviews/all
// @desc    Get all reviews (admin)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/reviews
// @desc    Submit a review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { targetType, targetId, rating, comment } = req.body;

        if (!targetType || !targetId || !rating) {
            return res.status(400).json({ message: 'targetType, targetId, and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check for existing review by this user for this target
        const existing = await Review.findOne({
            user: req.user._id,
            targetType,
            targetId
        });

        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this item' });
        }

        const review = new Review({
            user: req.user._id,
            userName: req.user.name,
            targetType,
            targetId,
            rating: Number(rating),
            comment: comment || ''
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this item' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Edit own review
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the owner can edit
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this review' });
        }

        const { rating, comment } = req.body;

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
            review.rating = Number(rating);
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        const updated = await review.save();
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await review.deleteOne();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
