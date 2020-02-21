import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchools, deleteSchool } from '../../../services/schools';
import { globalNotifications } from '../../../services';

function SchoolsList() {
  const [ schools, setSchools ] = useState([]);

  useEffect(() => {
    async function loadSchools() {
      globalNotifications.clearMessages();

      const response = await getSchools();

      if (response.error) {
        globalNotifications.sendErrorMessage(`Ocorreu um erro ao processar a requisição. Detalhes: ${response.error}`);
      } else {
        setSchools(response);
      }
    }

    loadSchools();
  }, []);

  async function handleDelete(id) {
    const response = await deleteSchool(id);

    if (response.error) {
      globalNotifications.sendErrorMessage(response.error.message);
    } else {
      setSchools(schools.filter(school => school.id !== id));
    }
  }

  return (
    <div className="SchoolsList">
      <h1 className="page-title">Lojas</h1>

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
