import axios from 'axios';
import useAuthStore from '../store/authStore';

export const instance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : '/api',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
