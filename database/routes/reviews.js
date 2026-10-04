const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// All reviews
router.get('/fetchReviews', async (_req, res) => {
  try {
    const reviews = await Review.find({}).sort({ created_at: -1 }).lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews for a dealer
router.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ dealership: Number(req.params.id) })
      .sort({ created_at: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert a review
router.post('/insertReview', async (req, res) => {
  try {
    const {
      name,
      dealership,
      review,
      purchase,
      purchase_date,
      car_make,
      car_model,
      car_year,
      sentiment,
    } = req.body;

    if (!dealership || !review) {
      return res.status(400).json({ error: 'dealership and review are required' });
    }

    const doc = await Review.create({
      name: name || 'Anonymous',
      dealership: Number(dealership),
      review,
      purchase: Boolean(purchase),
      purchase_date: purchase_date || new Date().toISOString().slice(0, 10),
      car_make: car_make || '',
      car_model: car_model || '',
      car_year: Number(car_year) || 0,
      sentiment: sentiment || 'neutral',
    });

    res.status(201).json({ status: 'Success', review: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
