import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Android Emulator kullanıyorsanız genelde 10.0.2.2'dir. iOS Simulator ise localhost.
// Kendi fiziksel cihazınızda deniyorsanız bilgisayarınızın ağdaki IP adresini yazmanız gerekir (Örn: 192.168.1.X).
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5290/api' 
  : 'http://localhost:5290/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    // Ensure headers object exists before assigning
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
