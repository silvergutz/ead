import React, { useState } from 'react';
import { storeCategory } from '../../../../services/categories';
import { withRouter } from 'react-router-dom';
import { globalNotifications } from '../../../../services';

function CategoriesSave({ history }) {
  const [ name, setName ] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    globalNotifications.clearMessages();

    const response = await storeCategory({ name });

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao gravar os dados';
      globalNotifications.sendErrorMessage(err);
    } else {
      history.push('/admin/categorias');
    }
  }

  return (
    <div className="CategoriesSave">
      <h1 className="page-title">Nova Categoria</h1>

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

export default withRouter(CategoriesSave);
