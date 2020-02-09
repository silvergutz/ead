import React, { useState } from 'react';
import { auth } from '../../services';
import { withRouter } from 'react-router-dom';

function Login({ history, location }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // redirect to home if already logged in
  if (auth.currentUserValue) {
    history.push('/')
  }

  function handleSubmit(e) {
    e.preventDefault();

    auth.login({
        email,
        password,
      })
      .then(response => {
        if (response !== true) {
          setErrorMessage(String(response));
        } else {
          console.log(response.data);
          const { from } = location.state || { from: { pathname: '/' } };
          history.push(from);
        }
      })
      .catch(e => console.error)
    ;
  }

  return (
    <div className="Login">
      <h2>Login</h2>

      <p className="error">{errorMessage}</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="text" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="field">
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}

export default withRouter(Login);
