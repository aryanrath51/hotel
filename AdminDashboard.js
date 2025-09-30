import React, { useState, useEffect } from 'react';
import { getHotels, createHotel, deleteHotel, updateHotel , uploadHotelPhoto } from '../services/api';
import { useAuth } from '../context/AuthContext';

const dashboardStyles = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const formStyles = {
  marginBottom: '40px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
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
};

const hotelListStyles = {
  listStyle: 'none',
  padding: 0,
};

const hotelItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid #eee',
  marginBottom: '10px',
};

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({ name: '', city: '', address: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingHotel, setEditingHotel] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { token } = useAuth();

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotelsData = await getHotels();
      setHotels(hotelsData);
    } catch (err) {
      setError('Failed to fetch hotels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHotels();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingHotel((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in as an admin.');
      return;
    }
    try {
      await createHotel(newHotel, token);
      setNewHotel({ name: '', city: '', address: '', description: '' }); // Reset form
      fetchHotels(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    if (!token || !editingHotel) return;

    try {
      await updateHotel(editingHotel._id, { name: editingHotel.name, city: editingHotel.city, address: editingHotel.address, description: editingHotel.description }, token);
      setEditingHotel(null); // Exit editing mode
      fetchHotels(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!token) {
      setError('You must be logged in as an admin.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotel(id, token);
        fetchHotels(); // Refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePhotoUpload = async (hotelId) => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await uploadHotelPhoto(hotelId, formData, token);
      setSelectedFile(null);
      fetchHotels(); // Refresh to show new photo
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={dashboardStyles}>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreateHotel} style={formStyles}>
        <h2>Create New Hotel</h2>
        <input type="text" name="name" placeholder="Hotel Name" value={newHotel.name} onChange={handleInputChange} required style={inputStyles} />
        <input type="text" name="city" placeholder="City" value={newHotel.city} onChange={handleInputChange} required style={inputStyles} />
        <input type="text" name="address" placeholder="Address" value={newHotel.address} onChange={handleInputChange} required style={inputStyles} />
        <textarea name="description" placeholder="Description" value={newHotel.description} onChange={handleInputChange} required style={inputStyles} />
        <button type="submit" style={{ ...buttonStyles, backgroundColor: '#28a745', color: 'white' }}>Create Hotel</button>
      </form>

      <h2>Manage Hotels</h2>
      {loading ? <p>Loading hotels...</p> : (
        <ul style={hotelListStyles}>
          {hotels.map((hotel) => (
            <li key={hotel._id} style={hotelItemStyles}>
              <span>{hotel.name} - <strong>{hotel.city}</strong></span>
              <div>
                <button onClick={() => setEditingHotel(hotel)} style={{ ...buttonStyles, backgroundColor: '#ffc107', color: 'black' }}>Edit</button>
                <button onClick={() => handleDeleteHotel(hotel._id)} style={{ ...buttonStyles, backgroundColor: '#dc3545', color: 'white', marginLeft: '10px' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingHotel && (
        <form onSubmit={handleUpdateHotel} style={formStyles}>
          <h2>Edit {editingHotel.name}</h2>
          <input type="text" name="name" placeholder="Hotel Name" value={editingHotel.name} onChange={handleEditInputChange} required style={inputStyles} />
          <input type="text" name="city" placeholder="City" value={editingHotel.city} onChange={handleEditInputChange} required style={inputStyles} />
          <input type="text" name="address" placeholder="Address" value={editingHotel.address} onChange={handleEditInputChange} required style={inputStyles} />
          <textarea name="description" placeholder="Description" value={editingHotel.description} onChange={handleEditInputChange} required style={inputStyles} />
           <hr style={{ margin: '20px 0' }} />
          <h4>Upload Photo</h4>
          <input type="file" onChange={handleFileSelect} style={inputStyles} />
          <button type="button" onClick={() => handlePhotoUpload(editingHotel._id)} style={{ ...buttonStyles, backgroundColor: '#17a2b8', color: 'white' }}>Upload</button>
          <hr style={{ margin: '20px 0' }} />
          <div>
            <button type="submit" style={{ ...buttonStyles, backgroundColor: '#007bff', color: 'white' }}>Save Changes</button>
            <button type="button" onClick={() => setEditingHotel(null)} style={{ ...buttonStyles, backgroundColor: '#6c757d', color: 'white', marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;