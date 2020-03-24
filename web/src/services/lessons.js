import querystring from 'querystring';
import { api } from '.';
import { handleError } from '../helpers';

export async function getLessons(moduleId) {
  try {
    const qs = querystring.stringify({ module: moduleId || '' });
    const response = await api.get('/lessons' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findLesson(id) {
  try {
    const response = await api.get(`/lessons/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeLesson(data) {
  try {
    const response = await api.post('/lessons', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateLesson(id, data) {
  try {
    const response = await api.put(`/lessons/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteLesson(id) {
  try {
    const response = await api.delete(`/lessons/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getLessons,
  findLesson,
  storeLesson,
  updateLesson,
  deleteLesson,
}
