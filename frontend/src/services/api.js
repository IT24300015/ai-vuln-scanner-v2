import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
