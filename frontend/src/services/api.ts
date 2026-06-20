import axios from 'axios';

// API base URL resolution — works in ALL environments:
//   - Dev:        Vite proxy forwards /api/* → localhost:5000/api/* (see vite.config.ts)
//   - Production (same domain): /api/* resolves to the same origin (no CORS needed)
//   - Production (separate domains): Set VITE_API_URL to your backend root URL
//
// IMPORTANT: baseURL MUST end with a trailing slash so that relative paths
// like 'auth/register' resolve to /api/auth/register, not /auth/register.
// A leading slash in axios URL would bypass the /api base path entirely!
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawApiUrl
  ? rawApiUrl.trim().replace(/\/+$/, '').replace(/\/api\/?$/, '') + '/api/'
  : '/api/';

const api = axios.create({
  baseURL: API_BASE,
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
