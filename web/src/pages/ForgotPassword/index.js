import React, { useState } from 'react';

import auth from '../../services/auth';
import globalNotifications from '../../services/globalNotifications';

import './styles.css';

function ForgotPassword() {
  const [ email, setEmail ] = useState('');
  const [ sending, setSending ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  async function handleSubmit(e) {
    if (sending) return;

    e.preventDefault();
    setSending(true);

    const response = await auth.requestForgotPasswordToken(email);

    if (response.error) {
      if (response.response && response.response.status === 404) {
        globalNotifications.sendErrorMessage('Não encontramos nenhum usuário com o email fornecido, por favor verifique e tente novamente');
      } else {
        globalNotifications.sendErrorMessage('Infelizmente não foi possível enviar a sua solicitação');
        console.log(response);
      }
      setSuccess(false);
    } else {
      globalNotifications.sendSuccessMessage('Sua solicitação foi enviada com sucesso');
      setSuccess(true);
    }

    setSending(false);
  }

  return (
    <div className="ForgotPassword">
      <h1 className="page-title">Esqueci a minha senha</h1>

      <form onSubmit={handleSubmit}>
        {success ? (
          <div className="success-message">
            <p>Você receberá um email com instruções para redefinir a sua senha.</p>
            <p><i>Caso não receba na sua caixa de entrada, não esqueça de verificar também a sua caixa de <b>SPAM</b>.</i></p>
          </div>
        ) : (
          <div className="form-field">
            <label htmlFor="email">Insira abaixo o email utilizado na sua conta:</label>
            <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        )}

        {!success &&
          <button type="submit" disabled={sending} className="button">
            {sending ? 'enviando...' : 'enviar'}
          </button>
        }
      </form>
    </div>
  )
}

export default ForgotPassword;
