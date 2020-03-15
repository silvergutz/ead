import globalNotifications from '../services/globalNotifications';

export function clearErrors() {
  globalNotifications.clearMessages();

  // Clean error messages
  const errorsElms = document.querySelectorAll('form .error')
  if (errorsElms)
    errorsElms.forEach(elm => elm.classList.remove('error'));
}

export function setupErrorMessages(errors) {
  let errorMessage = '';
  if (errors) {
    errorMessage = 'Alguns campos não foram preenchidos corretamente:<br>';
    errorMessage += '<ul>';
    errors.map(e => {
      errorMessage += `<li>${e.detail}</li>`;
      if (e.source.pointer) {
        document.getElementById(e.source.pointer).classList.add('error');
      }
    });
    errorMessage += '</ul>';
  } else {
    errorMessage = 'Não foi possível gravar os dados';
  }
  globalNotifications.sendErrorMessage(errorMessage);
}

export default {
  clearErrors,
  setupErrorMessages,
}
