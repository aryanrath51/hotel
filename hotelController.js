const Hotel = require('../models/Hotel');
const path = require('path');

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    let query = {};

    // Search by hotel name or city
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const hotels = await Hotel.find(query);

    if (!hotels) {
      return res.status(404).json({ success: false, msg: 'No hotels found' });
    }

    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Could not fetch hotels' });
  }
};

// @desc    Get single hotel
// @route   GET /api/v1/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, msg: `Hotel not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Upload photo for hotel
// @route   PUT /api/v1/hotels/:id/photo
// @access  Private (Admin)
exports.hotelPhotoUpload = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ success: false, msg: `Hotel not found with id of ${req.params.id}` });
    }

    if (!req.files) {
      return res.status(400).json({ success: false, msg: 'Please upload a file' });
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({ success: false, msg: 'Please upload an image file' });
    }

    // Check filesize (e.g., 1MB)
    if (file.size > 1000000) {
      return res.status(400).json({ success: false, msg: 'Please upload an image less than 1MB' });
    }

    // Create custom filename
    file.name = `photo_${hotel._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: 'Problem with file upload' });
      }

      await Hotel.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({ success: true, data: file.name });
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}
// @desc    Create new hotel
// @route   POST /api/v1/hotels
// @access  Private (Admin)
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Update hotel
// @route   PUT /api/v1/hotels/:id
// @access  Private (Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(404).json({ success: false, msg: `Hotel not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/v1/hotels/:id
// @access  Private (Admin)
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, msg: `Hotel not found with id of ${req.params.id}` });
    }
    await hotel.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};