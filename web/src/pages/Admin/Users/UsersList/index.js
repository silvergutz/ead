import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProgressBar from '../../../../components/ProgressBar';
import { getUsers, deleteUser } from '../../../../services/users';
import { globalNotifications } from '../../../../services';
import ImgProtected from '../../../../components/ImgProtected';

import './styles.css';

function UsersList() {
  const [ users, setUsers ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  async function loadUsers() {
    globalNotifications.clearMessages();

    const response = await getUsers(searchTerm, true);

    if (response.error) {
      globalNotifications.sendErrorMessage(response.error);
      setUsers([]);
    } else {
      setUsers(response);
    }
  }

  async function handleDestroyUser(user) {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const response = await deleteUser(user.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível excluir o usuário');
      } else {
        globalNotifications.sendSuccessMessage('Aluno excluido com sucesso');
        loadUsers();
      }
    }
  }

  return (
    <div className="UsersList">
      <h1 className="page-title">Lista de Alunos</h1>

      <div className="search-form">
        <input className="search-input" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} type="search" placeholder="Buscar nome do aluno" />
      </div>

      <Link to="/admin/alunos/novo" className="add-user button center-content">
        Adicionar Aluno
        <i className="mi">add_circle_outline</i>
      </Link>

      <div className="users">
        {(!users || users.length <= 0) ? 'Nenhum usuário encontrado' : users.map(user => (
          <div key={user.id} className="User">
            <div className="user-photo">
              {user.photo &&
                <ImgProtected file={user.photo} alt={user.name} />
              }
              {!user.photo &&
                <img src="/images/default-user-photo.png" alt="" />
              }
            </div>
            <div className="user-details">
              <Link to={`/admin/alunos/${user.id}`}>
                <div className="user-name">{user.name}</div>
                <div className="user-courses">
                  <div className="key">Cursos feitos:</div>
                  <div className="value">nome dos cursos</div>
                </div>
                <div className="user-questions">
                  <div className="key">Perguntas:</div>
                  <div className="value">aula 1, aula 3</div>
                </div>
                <div className="user-answers">
                  <div className="key">Respostas:</div>
                  <div className="value">aula 4, aula 5</div>
                </div>
              </Link>
            </div>
            <div className="user-progress">
              <div className="button-group">
                <Link to={`/admin/alunos/${user.id}/editar`} className="edit-user edit button small mi">
                  edit
                </Link>
                <button className="remove-user remove button small mi" onClick={e => handleDestroyUser(user)}>
                  delete
                </button>
              </div>
              <ProgressBar className="user-progress-bar" progress={user.progress || 0} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
