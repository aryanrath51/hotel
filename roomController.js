const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Get all rooms for a specific hotel
// @route   GET /api/v1/hotels/:hotelId/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId });
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Could not fetch rooms' });
  }
};

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name description');
    if (!room) {
      return res.status(404).json({ success: false, msg: `Room not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Add a room to a hotel
// @route   POST /api/v1/hotels/:hotelId/rooms
// @access  Private (Admin)
exports.addRoom = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;

    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, msg: `Hotel not found with id of ${req.params.hotelId}` });
    }

    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Update a room
// @route   PUT /api/v1/rooms/:id
// @access  Private (Admin)
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, msg: `Room not found with id of ${req.params.id}` });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/v1/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, msg: `Room not found with id of ${req.params.id}` });
    }

    await room.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};