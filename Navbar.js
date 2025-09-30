import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navStyles = {
  backgroundColor: '#333',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyles = {
  color: 'white',
  margin: '0 15px',
  textDecoration: 'none',
  fontSize: '1.1rem',
};

const buttonStyles = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#f44336',
  color: 'white',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyles}>
      <div>
        <Link to="/" style={linkStyles}>HotelBooking</Link>
      </div>
      <div>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin" style={linkStyles}>Admin</Link>}
            {user.role === 'user' && <Link to="/my-bookings" style={linkStyles}>My Bookings</Link>}
            <button onClick={handleLogout} style={buttonStyles}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyles}>Login</Link>
            <Link to="/register" style={linkStyles}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;