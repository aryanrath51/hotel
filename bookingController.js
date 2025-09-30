const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('hotel', 'name').populate('user', 'name email');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Could not fetch bookings' });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private (User who booked or Admin)
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel', 'name city').populate('user', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, msg: `Booking not found with id of ${req.params.id}` });
    }

    // Make sure user is the booking owner or an admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, msg: 'Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new booking for a room
// @route   POST /api/v1/rooms/:roomId/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
  try {
    req.body.user = req.user.id; // Add logged in user to the body

    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ success: false, msg: `Room not found with id of ${req.params.roomId}` });
    }

    const { checkInDate, checkOutDate } = req.body;

    // Check for booking conflicts.
    // An overlap exists if (newCheckIn < existingCheckOut) AND (newCheckOut > existingCheckIn)
    const conflictingBooking = await Booking.findOne({
      room: req.params.roomId,
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        msg: `This room is already booked from ${new Date(conflictingBooking.checkInDate).toLocaleDateString()} to ${new Date(conflictingBooking.checkOutDate).toLocaleDateString()}.`,
      });
    }

    req.body.hotel = room.hotel; // Add hotel from room
    req.body.room = req.params.roomId; // Add room to body

    // Calculate total price
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    req.body.totalPrice = days * room.price;

    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User who booked or Admin)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, msg: `Booking not found with id of ${req.params.id}` });
    }
    // Make sure user is the booking owner or an admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, msg: 'Not authorized to delete this booking' });
    }
    await booking.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};