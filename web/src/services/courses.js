import axios from 'axios';
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

export async function embedVideo(video) {
  try {
    const response = await axios.get(`https://vimeo.com/api/oembed.json?url=${video}`);

    if (response.data && response.data.html) {
      return response.data.html;
    }
  } catch(e) {
    console.error(e);
    return 'Vídeo indisponível';
  }
}

function handleError(error) {
  if (error.response) {
    if (error.response.status === 404) {
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
  embedVideo,
}
