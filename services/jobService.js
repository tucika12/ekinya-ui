import api from '../api';

// Yeni ilan oluştur (Farmer)
export async function createJobPost(data) {
  const response = await api.post('/JobPosts', data);
  return response.data;
}

// Farmer'ın kendi ilanlarını getir
export async function getMyJobs() {
  const response = await api.get('/JobPosts/my');
  return response.data;
}

// Bir ilana gelen başvuruları getir (Farmer için)
export async function getApplicantsForJob(jobId) {
  const response = await api.get(`/JobApplications/by-job-post/${jobId}`);
  return response.data;
}

// Tüm açık ilanları getir (anonim de çağrılabilir — keşfet akışı)
export async function getOpenJobs(params = {}) {
  const response = await api.get('/JobPosts/open', {
    params,
    headers: { Authorization: false },
  });
  return response.data;
}

// Başvuru kabul et (Farmer)
export async function acceptApplication(applicationId) {
  const response = await api.post(`/JobApplications/${applicationId}/accept`);
  return response.data;
}

// Başvuru reddet (Farmer)
export async function rejectApplication(applicationId) {
  const response = await api.post(`/JobApplications/${applicationId}/reject`);
  return response.data;
}

// İlana başvur (Student)
export async function applyForJob(jobPostId, message = "") {
  const response = await api.post('/JobApplications', { jobPostId, coverLetter: message });
  return response.data;
}

// Tek ilan getir (anonim de çağrılabilir)
export async function getJobById(id) {
  const response = await api.get(`/JobPosts/${id}`, {
    headers: { Authorization: false },
  });
  return response.data;
}

// Tek başvuru getir
export async function getApplicationById(id) {
  const response = await api.get(`/JobApplications/${id}`);
  return response.data;
}
