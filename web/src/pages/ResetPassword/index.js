import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import auth from '../../services/auth';
import globalNotifications from '../../services/globalNotifications';
import { clearErrors, setupErrorMessages } from '../../helpers/handleFormFieldsError';

function ResetPassword() {
  const { token } = useParams();

  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const [ expired, setExpired ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [ sending, setSending ] = useState(false);

  async function handleSubmit(e) {
    if (sending) return;

    clearErrors();

    e.preventDefault();
    setSending(true);

    const data = {
      token,
      password,
      password_confirmation: passwordConfirmation,
    }
    const response = await auth.resetPassword(data);

    if (response.error) {
      // Fields validation error
      if (response.errors) {
        setupErrorMessages(response.errors);
      } else {
        // Token expired
        if (response.error === 'Token Expired') {
          setExpired(true);
          globalNotifications.sendErrorMessage('A sua requisição expirou')
        } else {
          globalNotifications.sendErrorMessage('Infelizmente não foi possível enviar a sua solicitação');
          console.log(response.error);
        }
      }
    } else {
      globalNotifications.sendSuccessMessage('Senha alterada com sucesso');
      setSuccess(true);
    }

    setSending(false);
  }

  return (
    <div className="ResetPassword">
      <h1>Redefinir a Senha</h1>

      {expired &&
        <div className="expired">
          <p>Sua solicitação de recuperação de senha expirou.</p>
          <p><Link to="/esqueci-minha-senha">Clique aqui</Link> para solicitar uma nova</p>
        </div>
      }
      {success &&
        <div className="success-message">
          <p>Senha alterada com sucesso.</p>
          <p><Link to="/login">Clique aqui para fazer login</Link></p>
        </div>
      }

      {(!expired && !success) &&
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="password">Nova Senha:</label>
            <input id="password" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="passwordConfirmation">Digite novamente:</label>
            <input id="password_confirmation" type="password" name="passwordConfirmation" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
          </div>

          <button type="submit" className="button" disabled={sending}>
            {sending ? 'enviando...' : 'enviar'}
          </button>
        </form>
      }
    </div>
  )
}

export default ResetPassword;
