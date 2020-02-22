import { api } from '../services';
import { handleError } from '../helpers';

export async function getCategories() {
  try {
    const response = await api.get('/categories');

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findCategory(id) {
  try {
    const response = await api.get(`/categories/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeCategory(data) {
  try {
    const response = await api.post('/categories', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateCategory(id, data) {
  try {
    const response = await api.put(`/categories/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteCategory(id) {
  try {
    const response = await api.delete(`/categories/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getCategories,
  findCategory,
  storeCategory,
  updateCategory,
  deleteCategory,
}
