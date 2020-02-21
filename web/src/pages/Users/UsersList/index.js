import React, { useState, useEffect } from 'react';

import './styles.css';
import ProgressBar from '../../../components/ProgressBar';
import { getUsers } from '../../../services/users';
import { globalNotifications } from '../../../services';

function UsersList() {
  const [ users, setUsers ] = useState([]);
  const [ filteredUsers, setFilteredUsers ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm]);

  function filterUsers() {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filteredUsers = users.filter(user => {
        const regex = new RegExp(searchTerm, 'gi');
        return user.name.search(regex) >= 0;
      });

      setFilteredUsers(filteredUsers);
    }
  }

  async function loadUsers() {
    globalNotifications.clearMessages();

    const response = await getUsers(searchTerm);

    if (response.errors) {
      globalNotifications.sendErrorMessage(response.error);
    } else {
      setUsers(response);
      setFilteredUsers(response);
    }
  }

  return (
    <div className="UsersList">
      <h1 className="page-title">Lista de Alunos</h1>

      <div className="search-form">
        <input className="search-input" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} type="search" placeholder="Buscar nome do aluno" />
      </div>

      <div className="users">
        {filteredUsers.map(user => (
          <div key={user.id} className="User">
            <div className="user-cover">
              <img src={user.cover} alt={user.name} />
            </div>
            <div className="user-details">
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
            </div>
            <ProgressBar className="user-progress" progress="70" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
