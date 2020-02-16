import axios from 'axios';
import { api } from '../services';
import { handleError } from '../helpers';

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

export default {
  getCourses,
  findCourse,
  embedVideo,
}
