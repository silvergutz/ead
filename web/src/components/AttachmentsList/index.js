import React, { useEffect, useState } from 'react';

import { getAttachments } from '../../services/attachments';
import { globalNotifications } from '../../services';
import { download } from '../../services/uploads';

import './styles.css';

function AttachmentsList({ attachmentable, type, handleRemoveFile }) {
  const [ attachments, setAttachments ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ downloading, setDownloading ] = useState([]);

  useEffect(() => {
    if (attachmentable.attachments) {
      setAttachments(attachmentable.attachments)
    } else {
      loadAttachments();
    }
  }, [attachmentable])

  async function loadAttachments() {
    setLoading(true);

    const response = await getAttachments(type, attachmentable.id);

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível carregar os anexos');
      console.error(response.error);
    } else {
      setAttachments(response);
    }

    setLoading(false);
  }

  async function handleDownload(attachment) {
    setDownloading([...downloading, attachment.id]);

    // generate url from blob downloaded from backend
    const url = await download(attachment.url, true);

    // create 'a' element
    const a = document.createElement('a');
    // set as invisible
    a.style.display = 'none';
    // Set url
    a.href = url;
    // and attr to force download
    a.setAttribute('download', attachment.url.substr(attachment.url.lastIndexOf('/') + 1));
    // append it to body
    document.body.appendChild(a);

    // and finnaly click then
    a.click();

    // cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setDownloading(downloading.filter(v => v !== attachment.id));
  }

  if (loading) {
    return 'Carregando anexos...';
  }

  if (!attachments || attachments.length <= 0) {
    return 'Esta aula não possui anexos';
  }

  return (
    <div className="AttachmentsList">
      {attachments.map(attachment => (
        <div key={attachment.id} className="attachment">
          <i className="attachment-icon mi">attachment</i>
          <div className="attachment-name" onClick={() => handleDownload(attachment)}>
            {attachment.url.substr(attachment.url.lastIndexOf('/') + 1)}
          </div>
          {handleRemoveFile &&
            <i className="attachment-remove-icon mi" onClick={() => handleRemoveFile(attachment.id)}>delete</i>
          }
          {downloading.some(v => v === attachment.id) &&
            <img src="/images/loader.gif" className="loading" alt="carregando" width="28" height="28" />
          }
        </div>
      ))}
    </div>
  )
}

export default AttachmentsList;
