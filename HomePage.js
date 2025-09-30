import React, { useState, useEffect } from 'react';
import { getHotels } from '../services/api';
import HotelCard from '../components/HotelCard';

const searchBarStyles = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
};

const containerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '20px',
};

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const hotelsData = await getHotels(searchTerm);
        setHotels(hotelsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchTerm]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading hotels...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Welcome to Hotel Booking</h1>
      <div style={searchBarStyles}>
        <input
          type="text"
          placeholder="Search by hotel name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '50%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      <div style={containerStyles}>
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;