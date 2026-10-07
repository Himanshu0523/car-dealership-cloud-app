const express = require('express');
const router = express.Router();
const Dealership = require('../models/dealership');

// GET all dealers
router.get('/fetchDealers', async (_req, res) => {
  try {
    const dealers = await Dealership.find({}).sort({ id: 1 }).lean();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dealers by state (matches full state name or abbreviation, case-insensitive)
router.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateParam = req.params.state;
    const dealers = await Dealership.find({
      $or: [
        { state: new RegExp('^' + stateParam + '$', 'i') },
        { st: new RegExp('^' + stateParam + '$', 'i') }
      ]
    }).sort({ id: 1 }).lean();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single dealer
router.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealership.findOne({ id: Number(req.params.id) }).lean();
    if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
