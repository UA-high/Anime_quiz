import api from '../..//auth/services/auth.api';

/**
 * Fetch quiz questions (MCQs or Picture-based)
 * @param {Object} params
 * @param {'mcq'|'picq'} params.type
 * @param {number} params.count
 */
export async function fetchQuizQuestions({ type = 'mcq', count = 10 } = {}) {
  const response = await api.get('/api/user/quiz', {
    params: { type, count },
  });
  return response.data;
}

/**
 * Submit answers for score calculation
 * @param {Object} payload
 * @param {Array<{questionId: string, selectedAnswer: string}>} payload.submissionArray
 * @param {'mcq'|'picq'} payload.type
 */
export async function submitQuizAnswers({ submissionArray, type = 'mcq' }) {
  const response = await api.post('/api/user/quiz/submit', {
    submissionArray,
    type,
  });
  return response.data;
}

/**
 * Admin: Upload an MCQ question
 * @param {FormData} formData
 */
export async function uploadMcq(formData) {
  const response = await api.post('/api/admin/upload/mcq', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Admin: Upload a Picture question
 * @param {FormData} formData
 */
export async function uploadPicq(formData) {
  const response = await api.post('/api/admin/upload/picqs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
