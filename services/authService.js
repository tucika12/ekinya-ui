import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

// Giriş yap
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const data = response.data;

  // Token ve kullanıcı bilgisini telefona kaydet
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify({
    id: data.userId,
    name: data.name,
    email: data.email,
    userType: data.userType,
    isVerified: data.isVerified,
  }));

  return data;
}

// Çıkış yap
export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}

// Kayıtlı kullanıcıyı getir
export async function getStoredUser() {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Farmer kaydı
export async function registerFarmer({ name, email, phoneNumber, password, farmerName, farmerLocation, farmerDoc }) {
  const response = await api.post('/auth/register', {
    name,
    email,
    phoneNumber,
    password,
    userType: 'Farmer',
    farmerName,
    farmerLocation,
    farmerDoc,
  });
  return response.data;
}

// Student kaydı
export async function registerStudent({ name, email, phoneNumber, password, universityName, universityDoc, enrollmentYear }) {
  const response = await api.post('/auth/register', {
    name,
    email,
    phoneNumber,
    password,
    userType: 'Student',
    universityName,
    universityDoc,
    enrollmentYear,
  });
  return response.data;
}
