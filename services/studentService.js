import api from '../api';

/**
 * Farmer: aktif öğrencilerin public listesi.
 * GET /api/Students/browse → StudentPublicDto[]
 * Dönen alanlar: id, name, universityName, enrollmentYear, reliabilityScore
 */
export async function getStudents() {
  const response = await api.get('/Students/browse');
  return response.data;
}

export async function getStudentById(id) {
  const response = await api.get(`/Students/${id}`);
  return response.data;
}
