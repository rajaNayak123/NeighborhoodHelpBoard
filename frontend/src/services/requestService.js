// frontend/src/services/requestService.js
import api from './api';

// Fetch requests near a specific location
const getNearbyRequests = (latitude, longitude, radius = 10) => { // radius in km
  return api.get(`/requests/nearby`, {
    params: { latitude, longitude, radius }
  });
};

// Create a new help request
const createRequest = (formData) => {
  // When sending files, the header needs to be 'multipart/form-data'
  // Axios handles this automatically when you pass a FormData object.
  return api.post('/requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getRequestById = (id) => {
  return api.get(`/requests/${id}`);
};


const requestService = {
  getNearbyRequests,
  createRequest,
  getRequestById
};

export default requestService;