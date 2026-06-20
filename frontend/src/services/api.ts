import axios from 'axios';

// Configure standard API base URL
let rawApiUrl = import.meta.env.VITE_API_URL;

if (rawApiUrl) {
  rawApiUrl = rawApiUrl.trim().replace(/\/+$/, ''); // remove trailing slashes
  if (!rawApiUrl.endsWith('/api')) {
    rawApiUrl = `${rawApiUrl}/api`;
  }
}

const API_URL = rawApiUrl || `http://${window.location.hostname}:5000/api`;

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
