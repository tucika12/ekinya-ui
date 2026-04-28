import api from '../api';

export async function createReview(data) {
  const response = await api.post('/reviews', data);
  return response.data;
}

export async function getReviewsByUser(userId) {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data;
}
