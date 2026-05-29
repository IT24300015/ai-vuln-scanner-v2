import axios from 'axios';

// Prefer an explicit env override, otherwise use the backend default exposed by docker-compose.
const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/api/auth/register', { username, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const createScan = async (targetUrl) => {
  const response = await api.post('/api/scans/', { target_url: targetUrl });
  return response.data;
};

export const getScans = async () => {
  const response = await api.get('/api/scans/');
  return response.data;
};

export const getScan = async (id) => {
  const response = await api.get(`/api/scans/${id}`);
  return response.data;
};

export default api;