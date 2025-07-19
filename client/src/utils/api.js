import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    console.error('API error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
      response: error.response?.data,
    });
    return Promise.reject(new Error(errorMessage));
  }
);

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  const { token } = response.data;
  if (token) {
    Cookies.set('accessToken', token, { sameSite: 'lax' });
    window.dispatchEvent(new Event('authChange'));
  }
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/auth/logout');
  Cookies.remove('accessToken');
  window.dispatchEvent(new Event('authChange'));
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/user/profile');
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.put('/api/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getNearbyParking = async (params) => {
  const response = await api.get('/api/parking/nearby', { params });
  return response.data;
};

export const createBooking = async (data) => {
  const response = await api.post('/api/booking', data);
  return response.data;
};

export const createChat = async (recipientId) => {
  const response = await api.post('/api/chat', { recipientId });
  return response.data;
};

export const sendMessage = async (chatId, content) => {
  const response = await api.post('/api/chat/message', { chatId, content });
  return response.data;
};

export const getChats = async () => {
  const response = await api.get('/api/chat');
  return response.data;
};