const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking, // This will be used by the nested route
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, authorize('admin'), getBookings);
router.route('/:id').get(protect, getBooking).delete(protect, deleteBooking);

module.exports = router;