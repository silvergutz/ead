import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchools, deleteSchool } from '../../../services/schools';

function SchoolsList() {
  const [ schools, setSchools ] = useState([]);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    async function loadSchools() {
      const response = await getSchools();

      if (response.error) {
        console.error(response.error);
        setErrorMessage(response.error.message);
      } else {
        setSchools(response);
      }
    }

    loadSchools();
  }, []);

  async function handleDelete(id) {
    const response = await deleteSchool(id);

    if (response.error) {
      setErrorMessage(response.error.message);
    } else {
      setSchools(schools.filter(school => school.id !== id));
    }
  }

  return (
    <div className="SchoolsList">
      <h1 className="page-title">Lojas</h1>

      {errorMessage &&
        <div className="error-message">
          Ocorreu um erro ao processar a requisição.<br />
          Detalhes: <div class="error">{errorMessage.toString()}</div>
        </div>
      }

      <Link to="/schools/new" className="new-school button-add">Nova Loja</Link>

      <table className="datatable">
        <thead>
          <tr>
            <th>#ID</th>
            <th>NOME</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {schools.map(school => (
            <tr key={school.id}>
              <td>#{school.id}</td>
              <td>{school.name}</td>
              <td>
                <Link to={`/schools/${school.id}`}>editar</Link>
                <button className="button-del link" onClick={e => handleDelete(school.id)}>excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchoolsList;
