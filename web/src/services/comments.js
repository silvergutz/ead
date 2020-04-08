import querystring from 'querystring';
import { api } from '.';
import { handleError } from '../helpers';

export async function getComments(lessonId, userId) {
  try {
    const qs = querystring.stringify({ lesson: lessonId || '', user: userId || '' });
    const response = await api.get('/comments' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findComment(id) {
  try {
    const response = await api.get(`/comments/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeComment(data) {
  try {
    const response = await api.post('/comments', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateComment(id, data) {
  try {
    const response = await api.put(`/comments/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteComment(id) {
  try {
    const response = await api.delete(`/comments/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getComments,
  findComment,
  storeComment,
  updateComment,
  deleteComment,
}
