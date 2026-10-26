import axios from 'axios';

// Create Axios instance with fallback base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'Network error: Please check if the backend server is running.';
    if (error.response && error.response.data && error.response.data.message) {
      customMessage = error.response.data.message;
    } else if (error.message) {
      customMessage = error.message;
    }
    return Promise.reject(new Error(customMessage));
  }
);

// API methods
export const getFeedbackList = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);
  return response.data;
};

export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const updateFeedback = async (id, feedbackData) => {
  const response = await api.put(`/feedback/${id}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
