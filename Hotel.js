const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
});

module.exports = mongoose.model('Hotel', HotelSchema);