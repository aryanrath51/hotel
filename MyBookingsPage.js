import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';

const pageStyles = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const bookingListStyles = {
  listStyle: 'none',
  padding: 0,
};

const bookingItemStyles = {
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '15px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError('You must be logged in to view your bookings.');
        setLoading(false);
        return;
      }

      try {
        const bookingsData = await getMyBookings(token);
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading your bookings...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={pageStyles}>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul style={bookingListStyles}>
          {bookings.map((booking) => (
            <li key={booking._id} style={bookingItemStyles}>
              <h3>{booking.hotel.name}</h3>
              <p><strong>City:</strong> {booking.hotel.city}</p>
              <p><strong>Room:</strong> {booking.room.type} (Room {booking.room.roomNumber})</p>
              <p>
                <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
              <p><strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookingsPage;