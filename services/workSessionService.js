import api from '../api';

// Çiftçi: check-in başlat → QR kodu döner
export async function checkIn(applicationId) {
  const response = await api.post('/work-sessions/check-in', { applicationId });
  return response.data;
}

// Öğrenci: QR tarayıp check-out yap
export async function checkOut(sessionId, qrCode) {
  const response = await api.post('/work-sessions/check-out', { sessionId, qrCode });
  return response.data;
}

// Bir başvuruya ait tüm oturumları getir
export async function getSessionsByApplication(applicationId) {
  const response = await api.get(`/work-sessions/by-application/${applicationId}`);
  return response.data;
}
