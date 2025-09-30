import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelById, getRoomsForHotel } from '../services/api';
import BookingForm from '../components/BookingForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


const pageStyles = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const hotelDetailsStyles = {
  marginBottom: '40px',
};

const mainImageStyles = {
  width: '100%',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '20px',
};

const roomListStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
};

const roomCardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const HotelDetailPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError('');
        const [hotelData, roomsData] = await Promise.all([
          getHotelById(id),
          getRoomsForHotel(id),
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        setError('Failed to load hotel details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading hotel details...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!hotel) return <p style={{ textAlign: 'center' }}>Hotel not found.</p>;

  return (
    <div style={pageStyles}>
      <div style={hotelDetailsStyles}>
        <img src={`${API_URL}/uploads/${hotel.photo}`} alt={hotel.name} style={mainImageStyles} />
        <h1>{hotel.name}</h1>
        <p><strong>{hotel.city}</strong> - {hotel.address}</p>
        <p>{hotel.description}</p>
        {hotel.rating && <p><strong>Rating: {hotel.rating} / 5</strong></p>}
      </div>

      <h2>Available Rooms</h2>
      {rooms.length > 0 ? (
        <div style={roomListStyles}>
          {rooms.map((room) => (
            <div key={room._id} style={roomCardStyles}>
              <h3>{room.type} Room</h3>
              <p>Room Number: {room.roomNumber}</p>
              <p><strong>Price: ${room.price} / night</strong></p>
              <BookingForm room={room} />
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms are currently available for this hotel.</p>
      )}
    </div>
  );
};

export default HotelDetailPage;