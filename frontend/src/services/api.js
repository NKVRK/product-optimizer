import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with a base URL and a long timeout for potentially slow scraping requests.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3-minute timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to log every outgoing request for debugging purposes.
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle and log API errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productAPI = {
  getASIN: (asin) => api.get(`/asin/${asin}`),
  getHistory: () => api.get('/history'),
  getASINHistory: (asin) => api.get(`/asin/${asin}/history`),
};

export default api;