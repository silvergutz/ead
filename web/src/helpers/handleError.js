function handleError(error) {
  if (error.response) {
    if (error.response.status === 404) {
      return {
        response: error.response,
        error: 'Página não encontrada'
      };
    }

    if (error.response.data) {
      let errorData = { ...error.response.data };
      if (!error.response.data.error) {
        errorData.error = 'Infelizmente não foi possível carregar o conteúdo';
        errorData.respose = error.response;
      }
      return errorData;
    }
  }


  return {
    response: error.response,
    error: error.message
  };
}

export default handleError;
