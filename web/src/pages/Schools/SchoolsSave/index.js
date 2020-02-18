import React, { useState } from 'react';
import { storeSchool } from '../../../services/schools';
import { withRouter } from 'react-router-dom';

function SchoolsSave({ history }) {
  const [ name, setName ] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await storeSchool({ name });

    if (response.error) {
      console.error(response.error);
    } else {
      history.push('/schools');
    }
  }

  return (
    <div className="SchoolsSave">
      <h1 className="page-title">Nova Loja</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nome:</label>
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <button type="submit">Gravar</button>
      </form>
    </div>
  )
}

export default withRouter(SchoolsSave);
