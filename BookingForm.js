import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';
import { Link } from 'react-router-dom';

const formContainerStyles = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid #eee',
};

const inputStyles = {
  display: 'block',
  width: 'calc(100% - 20px)',
  padding: '8px',
  margin: '10px 0',
};

const buttonStyles = {
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#28a745',
  color: 'white',
  width: '100%',
};

const BookingForm = ({ room }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    try {
      await createBooking(room._id, { checkInDate, checkOutDate }, token);
      setSuccess(`Successfully booked! View in "My Bookings".`);
      setCheckInDate('');
      setCheckOutDate('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div style={formContainerStyles}>
        <p>Please <Link to="/login">login</Link> to book a room.</p>
      </div>
    );
  }

  return (
    <div style={formContainerStyles}>
      <form onSubmit={handleSubmit}>
        <label>Check-in Date:</label>
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required style={inputStyles} />
        <label>Check-out Date:</label>
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required style={inputStyles} />
        <button type="submit" style={buttonStyles}>Book Now</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default BookingForm;