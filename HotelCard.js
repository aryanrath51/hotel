import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

const cardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '1rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  width: '300px',
  transition: 'transform 0.2s',
};

const imgStyles = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const HotelCard = ({ hotel }) => {
  return (
    <Link to={`/hotels/${hotel._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={cardStyles} className="hotel-card">
        <img src={`${API_URL}/uploads/${hotel.photo}`} alt={hotel.name} style={imgStyles} />
        <div style={{ padding: '0 16px 16px' }}>
          <h3>{hotel.name}</h3>
          <p><strong>City:</strong> {hotel.city}</p>
          <p style={{
            height: '40px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}>{hotel.description}</p>
          {hotel.rating && <p><strong>Rating:</strong> {hotel.rating} / 5</p>}
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;