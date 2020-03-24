import querystring from 'querystring';
import { api } from '../services';
import { handleError } from '../helpers';

export async function getUsers(searchTerm) {
  try {
    let qs = querystring.stringify({ s: searchTerm || '' });
    const response = await api.get('/users' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findUser(id) {
  try {
    const response = await api.get(`/users/${id}`)

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
