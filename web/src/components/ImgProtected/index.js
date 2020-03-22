import React, { useState, useEffect } from 'react';
import { download } from '../../services/uploads';

function ImgProtected(props) {
  const [ url, setUrl ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    async function loadImage() {
      setLoading(true);

      const fileUrl = await download(props.file);
      if (fileUrl) {
        setUrl(fileUrl);
      } else {
        setError(true);
      }

      setLoading(false);
    }

    loadImage();
  }, [props.file]);

  function handleOnLoad() {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  if (!url && !loading && !error)
    return '';

  if (loading)
    return (<img src="/images/loader.gif" className="loading" alt="carregando" width="28" height="28" />);

  if (error)
    return (<span className="image-load-error">Imagem indisponível</span>);

  return (
    <img alt="" {...props} src={url} onLoad={handleOnLoad} />
  );
}

export default ImgProtected;
