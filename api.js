const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

/**
 * Fetches all hotels from the API.
 */
export const getHotels = async (searchTerm = '') => {
  let url = `${API_URL}/hotels`;
  if (searchTerm) {
    // URL-encode the search term to handle special characters
    url += `?search=${encodeURIComponent(searchTerm)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  const data = await response.json();
  return data.data; // Our API nests the data in a 'data' property
};

/**
 * Uploads a photo for a hotel.
 * @param {string} hotelId - The ID of the hotel.
 * @param {FormData} formData - The form data containing the file.
 * @param {string} token - The admin user's JWT.
 */
export const uploadHotelPhoto = async (hotelId, formData, token) => {
  const response = await fetch(`${API_URL}/hotels/${hotelId}/photo`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to upload photo');
  }
  return data.data;
};