import { api } from '../services';
import { handleError } from '../helpers';

export async function showProfile() {
  try {
    const response = await api.get('profile')

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateProfile(data) {
  try {
    const response = await api.put('/profile', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  showProfile,
  updateProfile,
}
