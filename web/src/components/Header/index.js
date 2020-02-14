import React from 'react';

import './styles.css';
import { Link, withRouter } from 'react-router-dom';

function Header({ logout, currentUser }) {
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

      <div className="user">
        {currentUser &&
          <button onClick={logout}>Sair</button>
        }
      </div>
    </header>
  );
}

export default withRouter(Header);
