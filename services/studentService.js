import api from '../api';

export async function getStudents() {
  const response = await api.get('/Students');
  return response.data;
}

export async function getStudentById(id) {
  const response = await api.get(`/Students/${id}`);
  return response.data;
}
