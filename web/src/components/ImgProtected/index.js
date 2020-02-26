import React, { useState, useEffect } from 'react';
import { download } from '../../services/uploads';

function ImgProtected(props) {
  const [ url, setUrl ] = useState(false);

  useEffect(() => {
    async function loadImage() {
      const fileUrl = await download(props.file);
      if (fileUrl) {
        setUrl(fileUrl);
      }
    }

    loadImage();
  }, [props.file]);

  function handleOnLoad() {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <img {...props} src={url} onLoad={handleOnLoad} />
  )
}

export default ImgProtected;
