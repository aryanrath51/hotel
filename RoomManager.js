import React, { useState, useEffect } from 'react';
import { getRoomsForHotel, addRoom, deleteRoom } from '../services/api';

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

const roomListStyles = {
  listStyle: 'none',
  padding: 0,
};

const roomItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid #eee',
  marginBottom: '10px',
};

const RoomManager = ({ hotel, token, onBack }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Single', price: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await getRoomsForHotel(hotel._id);
      setRooms(roomsData);
    } catch (err) {
      setError('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await addRoom(hotel._id, newRoom, token);
      setNewRoom({ roomNumber: '', type: 'Single', price: '' }); // Reset form
      fetchRooms(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId, token);
        fetchRooms(); // Refresh list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <button onClick={onBack} style={{ ...buttonStyles, marginBottom: '20px' }}>&larr; Back to Hotels</button>
      <h2>Manage Rooms for {hotel.name}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddRoom} style={formStyles}>
        <h3>Add New Room</h3>
        <input type="text" name="roomNumber" placeholder="Room Number" value={newRoom.roomNumber} onChange={handleInputChange} required style={inputStyles} />
        <select name="type" value={newRoom.type} onChange={handleInputChange} style={inputStyles}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
        <input type="number" name="price" placeholder="Price per night" value={newRoom.price} onChange={handleInputChange} required style={inputStyles} />
        <button type="submit" style={{ ...buttonStyles, backgroundColor: '#28a745', color: 'white' }}>Add Room</button>
      </form>

      <h3>Existing Rooms</h3>
      {loading ? <p>Loading rooms...</p> : (
        <ul style={roomListStyles}>
          {rooms.map((room) => (
            <li key={room._id} style={roomItemStyles}>
              <span>Room {room.roomNumber} ({room.type}) - ${room.price}/night</span>
              <button onClick={() => handleDeleteRoom(room._id)} style={{ ...buttonStyles, backgroundColor: '#dc3545', color: 'white' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomManager;