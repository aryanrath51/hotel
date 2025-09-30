import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
};

const inputStyles = {
  margin: '10px 0',
  padding: '10px',
  fontSize: '16px',
};

const buttonStyles = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      // In a real app, you'd save the token to context/localStorage
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); // Simple token storage
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyles} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyles} />
      <button type="submit" style={buttonStyles}>Login</button>
    </form>
  );
};

export default LoginPage;