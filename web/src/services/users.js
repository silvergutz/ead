import querystring from 'querystring';
import { api } from '../services';
import { handleError } from '../helpers';

export async function getUsers(searchTerm, progress) {
  try {
    let qsData = { s: searchTerm || '' }
    if (progress) {
      qsData.progress = true;
    }

    const qs = querystring.stringify(qsData);
    const response = await api.get('/users' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findUser(id, progress) {
  try {
    let qs;
    if (progress) {
      qs = querystring.stringify({ progress: 1 });
    }
    const response = await api.get(`/users/${id}` + (qs ? `?${qs}` : ''))

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeUser(data) {
  try {
    const response = await api.post('/users', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateUser(id, data) {
  try {
    const response = await api.put(`/users/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/users/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getUsers,
  findUser,
  storeUser,
  updateUser,
  deleteUser,
}
