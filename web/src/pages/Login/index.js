import React, { useState } from 'react';
import { auth } from '../../services';
import { withRouter, Link } from 'react-router-dom';

import './styles.css';
import globalNotifications from '../../services/globalNotifications';

function Login({ history, location }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // redirect to home if already logged in
  if (auth.currentUserValue) {
    history.push('/')
  }

  async function handleSubmit(e) {
    e.preventDefault();

    globalNotifications.clearMessages();

    try {
      await auth.login({ email, password });

      const { from } = location.state || { from: { pathname: '/' } };
      history.push(from);
    } catch(e) {
      if (e.response && e.response.status === 401) {
        globalNotifications.sendErrorMessage('Credenciais inválidas');
      } else {
        console.error(e.message);
        globalNotifications.sendErrorMessage('Não foi possível autenticar o usuário, por favor, tente novamente mais tarde');
      }
    }
  }

  return (
    <div className="BoxLogin">
      <div className="Login">
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email"></label>
              <input id="email" type="text" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email" />
            </div>
            <div className="field">
              <input id="password" type="password" onChange={e => setPassword(e.target.value)} placeholder="Senha" />
            </div>
            <div className="field">
              <button type="submit">Fazer Login</button>
            </div>
          </form>

          <Link to="/esqueci-minha-senha" className="lost-password">esqueceu a senha?</Link>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
