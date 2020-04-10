import querystring from 'querystring';

import { api } from '../services';
import { handleError } from '../helpers';

export async function getAttachments(attachmentableType, attachmentableId) {
  try {
    let qsData = {};
    if (attachmentableType) qsData.ptype = attachmentableType;
    if (attachmentableId) qsData.pid = attachmentableId;
    let qs = querystring.stringify(qsData);
    const response = await api.get('/attachments/' + (qs ? `?${qs}` : ''));

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function findAttachment(id) {
  try {
    const response = await api.get(`/attachments/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function storeAttachment(data) {
  try {
    const response = await api.post('/attachments', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export async function deleteAttachment(id) {
  try {
    const response = await api.delete(`/attachments/${id}`);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default {
  getAttachments,
  findAttachment,
  deleteAttachment,
}
