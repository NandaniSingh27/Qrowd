import api from './axios';

export const submitQuestion = (code, data) => api.post(`/questions/room/${code}`, data);
export const voteQuestion = (id, voterId) => api.post(`/questions/${id}/vote`, { voterId });
export const updateQuestion = (id, data) => api.patch(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);