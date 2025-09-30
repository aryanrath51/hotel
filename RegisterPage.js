import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await register({ name, email, password });
      console.log('Registration successful');
      login(token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyles} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyles} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" style={inputStyles} />
      <button type="submit" style={buttonStyles}>Register</button>
    </form>
  );
};

export default RegisterPage;