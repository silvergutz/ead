import { api } from '../services';
import { handleError } from '../helpers';

export async function getSchools() {
  try {
    const response = await api.get('/schools');

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findSchool(id) {
  try {
    const response = await api.get(`/schools/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeSchool(data) {
  try {
    const response = await api.post('/schools', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateSchool(id, data) {
  try {
    const response = await api.put(`/schools/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteSchool(id) {
  try {
    const response = await api.delete(`/schools/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getSchools,
  findSchool,
  storeSchool,
  updateSchool,
  deleteSchool,
}
