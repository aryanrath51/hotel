const express = require('express');
const {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

const { protect, authorize } = require('../middleware/authMiddleware');

// The { mergeParams: true } option is crucial for accessing :hotelId from the parent router
const router = express.Router({ mergeParams: true });

router.route('/').get(getRooms).post(protect, authorize('admin'), addRoom);

router.route('/:id').get(getRoom).put(protect, authorize('admin'), updateRoom).delete(protect, authorize('admin'), deleteRoom);

module.exports = router;