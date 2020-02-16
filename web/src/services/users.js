import querystring from 'querystring';
import { api } from '../services';
import { handleError } from '../helpers';

export async function getUsers(searchTerm) {
  try {
    const response = await api.get('/users', querystring.stringify({ s: searchTerm || '' }));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findCourse(id) {
  try {
    const response = await api.get(`/users/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getUsers,
  findCourse,
}
