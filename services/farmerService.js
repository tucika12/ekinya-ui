import api from '../api';

export async function getFarmerById(id) {
  const response = await api.get(`/Farmers/${id}`);
  return response.data;
}

/**
 * Çiftçi kendi profilini günceller.
 * Backend sadece: name, phoneNumber, farmerLocation, farmerDoc kabul eder.
 * id === token'daki userId olmalı, aksi hâlde 403 döner.
 */
export async function updateFarmer(id, { name, phoneNumber, farmerLocation, farmerDoc }) {
  const response = await api.put(`/Farmers/${id}`, {
    name,
    phoneNumber,
    farmerLocation,
    farmerDoc,
  });
  return response.data;
}
