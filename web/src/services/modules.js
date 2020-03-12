import querystring from 'querystring';
import { api } from '.';
import { handleError } from '../helpers';

export async function getModules(courseId) {
  try {
    console.log('modules service : getModules', courseId);
    let qs = querystring.stringify({ course: courseId || '' });
    const response = await api.get('/modules' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findModule(id) {
  try {
    const response = await api.get(`/modules/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeModule(data) {
  try {
    const response = await api.post('/modules', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateModule(id, data) {
  try {
    const response = await api.put(`/modules/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteModule(id) {
  try {
    const response = await api.delete(`/modules/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getModules,
  findModule,
  storeModule,
  updateModule,
  deleteModule,
}
