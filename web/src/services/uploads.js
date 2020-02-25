import api from './api';

export const download = async (file) => {
  try {
    // Is a full URL
    if (file.indexOf('http') === 0) {
      return file;
    }

    // Is a partial URL that needs to pass for /downloads
    const response = await api.get('download?file=' + file, {
      responseType: 'blob'
    });

    return URL.createObjectURL(response.data);
  } catch(e) {
    return false;
  }
}

export default {
  download
}
