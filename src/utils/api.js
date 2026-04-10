import axios from 'axios';

import { API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const login = (data) => api.post('/login', data);
export const getLanguages = () => api.get('/languages');
export const addLanguage = (data) => api.post('/languages', data);
export const deleteLanguage = (id) => api.delete(`/languages/${id}`);

export const getTopics = () => api.get('/topics');
export const getTopicsByLanguage = (languageId) => api.get(`/topics/${languageId}`);
export const getTopicById = (id) => api.get(`/topic/${id}`);
export const addTopic = (data) => api.post('/topics', data);
export const updateTopic = (id, data) => api.put(`/topics/${id}`, data);
export const deleteTopic = (id) => api.delete(`/topics/${id}`);
export const reorderTopics = (topicIds) => api.put('/reorder-topics', { topicIds });

export default api;
