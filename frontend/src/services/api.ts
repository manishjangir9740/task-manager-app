import axios from 'axios';

// Automatically ensure VITE_API_URL ends with /api even if it's configured without it on Vercel
let rawApiUrl = import.meta.env.VITE_API_URL || '';
if (rawApiUrl) {
  const cleanUrl = rawApiUrl.replace(/\/$/, ''); // Remove trailing slash if any
  rawApiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
} else {
  rawApiUrl = 'http://localhost:5000/api';
}

const API_URL = rawApiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into all request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response interceptor to handle session expiration (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear credentials if token expired or invalid
      localStorage.removeItem('token');
      // Redirect to login if on protected pages (handled gracefully in UI reactively)
    }
    return Promise.reject(error);
  }
);

export default api;
