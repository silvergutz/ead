import api from './api';
import querystring from 'querystring';

export const download = async (file, force) => {
  try {
    // Is a full URL
    if (file.indexOf('http') === 0) {
      return file;
    }

    const qsData = {};
    if (file) qsData.file = file;
    if (force) qsData.force = 1;

    // Is a partial URL that needs to pass for /downloads
    const response = await api.get(`download?${querystring.stringify(qsData)}`, {
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
