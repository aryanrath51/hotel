const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  hotelPhotoUpload,
} = require('../controllers/hotelController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id/photo').put(protect, authorize('admin'), hotelPhotoUpload);

router.route('/').get(getHotels).post(protect, authorize('admin'), createHotel);

router.route('/:id').get(getHotel).put(protect, authorize('admin'), updateHotel).delete(protect, authorize('admin'), deleteHotel);

module.exports = router;