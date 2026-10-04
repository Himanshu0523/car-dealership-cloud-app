const mongoose = require('mongoose');

const dealershipSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    city: String,
    state: { type: String, index: true },
    st: String,
    address: String,
    zip: String,
    lat: Number,
    long: Number,
    phone: String,
    short_name: String,
    full_name: String,
  },
  { collection: 'dealerships', versionKey: false }
);

module.exports = mongoose.model('Dealership', dealershipSchema);
