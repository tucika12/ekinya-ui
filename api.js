import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { navigationRef } from './navigationService';

function normalizeApiBase(url) {
  const u = String(url || '').trim().replace(/\/$/, '');
  if (!u) return null;
  return u.endsWith('/api') ? u : `${u}/api`;
}

// Fiziksel cihaz / ortak API: app kökünde .env → EXPO_PUBLIC_API_URL=http://192.168.x.x:5290
// ÖNEMLİ: Fiziksel cihazlardan erişim için .env dosyasında bilgisayarın yerel ağ IP'si
// tanımlanmalıdır. "ipconfig" (Windows) veya "ifconfig" (Mac/Linux) ile öğrenebilirsin.
const fromEnv = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL;
const resolved = normalizeApiBase(fromEnv);

if (!resolved && __DEV__) {
  console.warn(
    '[api.js] EXPO_PUBLIC_API_URL tanımlı değil! ' +
    'Fiziksel cihazlardan erişim için .env dosyasına ' +
    'EXPO_PUBLIC_API_URL=http://<bilgisayar-ip>:5290 ekleyin.'
  );
}

// Android Emulator: 10.0.2.2 = bilgisayarın localhost'u. iOS Simulator: localhost.
// Fiziksel cihazlar için .env'de EXPO_PUBLIC_API_URL tanımlanmalı!
const BASE_URL =
  resolved ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:5290/api' : 'http://localhost:5290/api');

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
      // NavigationContainer hazırsa Welcome'a yönlendir
      if (navigationRef.current?.isReady()) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
