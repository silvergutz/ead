import { api } from '../services';

export async function getCourses() {
  try {
    const response = await api.get('/courses')

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findCourse(id) {
  try {
    const response = await api.get(`/courses/${id}`)

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

function handleError(error) {
  if (error.response) {
    if (error.response.status == 404) {
      return { error: 'Página não encontrada' };
    }

    if (error.response.data) {
      let errorData = { ...error.response.data };
      if (!error.response.data.error) {
        errorData.error = 'Infelizmente não foi possível carregar o conteúdo';
      }
      return errorData;
    }
  }


  return { error: error.message };
}

export default {
  getCourses,
  findCourse,
}
