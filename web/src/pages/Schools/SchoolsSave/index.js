import React, { useState } from 'react';
import { storeSchool } from '../../../services/schools';
import { withRouter } from 'react-router-dom';
import { globalNotifications } from '../../../services';

function SchoolsSave({ history }) {
  const [ name, setName ] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    globalNotifications.clearMessages();

    const response = await storeSchool({ name });

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao gravar os dados';
      globalNotifications.sendErrorMessage(err);
    } else {
      history.push('/lojas');
    }
  }

  return (
    <div className="SchoolsSave">
      <h1 className="page-title">Nova Loja</h1>

      <form onSubmit={handleSubmit} className="model-form content-box">
        <div className="form-field">
          <label htmlFor="name">Nome:</label>
          <div className="field">
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <button type="submit">Gravar</button>
        </div>
      </form>
    </div>
  )
}

export default withRouter(SchoolsSave);
