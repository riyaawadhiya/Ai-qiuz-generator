import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const generateQuiz = async ({ topic, difficulty, count }) => {
  const res = await api.post('/quiz/generate', { topic, difficulty, count });
  return res.data;
};

export const getQuizById = async (id) => {
  const res = await api.get(`/quiz/${id}`);
  return res.data;
};

export const saveResult = async ({ quizId, score, totalQuestions, percentage }) => {
  const res = await api.post('/result', { quizId, score, totalQuestions, percentage });
  return res.data;
};

export const getResults = async () => {
  const res = await api.get('/result');
  return res.data;
};

export default api;