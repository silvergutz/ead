import React from 'react';

import './styles.css';
import { Link, withRouter } from 'react-router-dom';

function Header({ logout, currentUser }) {
  if (!currentUser) return null;

  return (
    <header className="Header">
      <Link className="logo" to="/">EaD</Link>

      <nav className="menu">
        <ul>
          <li>
            <Link to="/cursos">Cursos</Link>
          </li>
          <li>
            <Link to="/alunos">Alunos</Link>
          </li>
          <li>
            <Link to="/perfil">Meus Dados</Link>
          </li>
        </ul>
      </nav>

      {currentUser &&
        <div className="user">
          <div className="user-photo">
            <img src={currentUser.photo} alt="" />
          </div>
          <div className="user-name">
            Olá, <span className="name">{currentUser.name}</span>
          </div>
          <button className="logout-button" onClick={logout}>Sair</button>
        </div>
      }
    </header>
  );
}

export default withRouter(Header);
