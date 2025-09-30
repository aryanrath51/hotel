const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
  },
  type: {
    type: String,
    required: [true, 'Please add a room type'],
    enum: ['Single', 'Double', 'Suite'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price per night'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  // You can add more fields like amenities, photos, etc.
});

module.exports = mongoose.model('Room', RoomSchema);