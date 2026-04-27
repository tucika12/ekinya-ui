import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend'in çalıştığı adres
// Geliştirme sırasında: bilgisayarının yerel IP'si (localhost değil!)
// Expo fiziksel telefonda çalışırken localhost'u göremez
const BASE_URL = 'http://192.168.1.X:5000/api'; // ← kendi IP'ni yaz

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekte token varsa otomatik ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hata yönetimi — 401 gelirse token sil
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
