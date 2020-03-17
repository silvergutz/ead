import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getSchools, deleteSchool } from '../../../../services/schools';
import { globalNotifications } from '../../../../services';

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
      const err = response.error.message || 'Ocorreu um erro ao excluir o registro';
      globalNotifications.sendErrorMessage(err);
    } else {
      globalNotifications.sendSuccessMessage('Registro excluido');
      setSchools(schools.filter(school => school.id !== id));
    }
  }

  return (
    <div className="SchoolsList">
      <h1 className="page-title">Lojas</h1>

      <Link to="/admin/lojas/novo" className="new-school button-add button">Nova Loja</Link>

      <table className="datatable">
        <thead>
          <tr>
            <th className="id">ID</th>
            <th className="name">NOME</th>
            <th className="actions">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {schools.map(school => (
            <tr key={school.id}>
              <td className="id">{school.id}</td>
              <td className="name">{school.name}</td>
              <td className="actions">
                <Link className="mi" to={`/admin/lojas/${school.id}`}>edit</Link>
                <button className="button-del link mi" onClick={e => handleDelete(school.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchoolsList;
