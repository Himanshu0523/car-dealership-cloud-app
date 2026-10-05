const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    dealership: { type: Number, index: true },
    review: { type: String, maxlength: 2000, required: true },
    purchase: Boolean,
    purchase_date: String,
    car_make: String,
    car_model: String,
    car_year: Number,
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral',
    },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'reviews', versionKey: false }
);

module.exports = mongoose.model('Review', reviewSchema);
