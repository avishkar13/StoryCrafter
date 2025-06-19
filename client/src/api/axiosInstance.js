import axios from 'axios';
import useAuthStore from '../store/authStore';

const isLocal = import.meta.env.MODE === 'development';

export const instance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL || '/api',
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
 