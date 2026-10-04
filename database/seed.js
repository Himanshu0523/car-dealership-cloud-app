const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Dealership = require('./models/dealership');
const Review = require('./models/review');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dealership';

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('[seed] connected');

    const dealerships = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/dealerships.json'), 'utf8')
    ).dealerships;
    const reviews = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/reviews.json'), 'utf8')
    ).reviews;

    await Dealership.deleteMany({});
    await Review.deleteMany({});

    await Dealership.insertMany(dealerships);
    await Review.insertMany(reviews);

    console.log(`[seed] inserted ${dealerships.length} dealers, ${reviews.length} reviews`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[seed] failed', err);
    process.exit(1);
  }
})();
