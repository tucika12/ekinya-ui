import api from '../api';

export async function getFarmerById(id) {
  const response = await api.get(`/Farmers/${id}`);
  return response.data;
}

export async function updateFarmer(id, data) {
  const response = await api.put(`/Farmers/${id}`, data);
  return response.data;
}
