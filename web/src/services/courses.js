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

export async function storeCourse(data) {
  try {
    const response = await api.post('/courses', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function updateCourse(id, data) {
  try {
    const response = await api.put(`/courses/${id}`, data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteCourse(id) {
  try {
    const response = await api.delete(`/courses/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function embedVideo(video) {
  try {
    if (video.indexOf('vimeo.com') >= 0) {
      const response = await axios.get(`https://vimeo.com/api/oembed.json?url=${video}`);

      if (response.data && response.data.html) {
        return response.data.html;
      }
    } else {
      if (video.indexOf('youtube.com/watch') >= 0) {
        video = video.replace('watch?v=', 'embed/');
      }
      return `<iframe width="640" height="580" src="${video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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
