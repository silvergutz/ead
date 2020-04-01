import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { auth } from '../../services';
import ImgProtected from '../ImgProtected';

import './styles.css';



function Header({ logout, currentUser }) {
  if (!currentUser) return null;

  return (
    <header className="Header">
      <Link className="logo" to="/">
        <img src='/images/logo-academy-preto.png' />
      </Link>

      <nav className="menu">
        <ul>
          {auth.isAdmin() &&
            <li>
              <span>Admin</span>
              <ul>
                <li className="nav-item">
                  <Link to={'/admin/lojas'}>Lojas</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/admin/alunos'}>Alunos</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/admin/cursos'}>Cursos</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/admin/categorias'}>Categorias</Link>
                </li>
              </ul>
            </li>
          }
          <li>
            <Link to="/cursos">Cursos</Link>
          </li>
          <li>
            <Link to="/perfil">Meus Dados</Link>
          </li>
        </ul>
      </nav>

      {currentUser &&
        <div className="user">
          <div className="user-photo">
            {currentUser.photo &&
              <ImgProtected file={currentUser.photo} alt={currentUser.name} />
            }
            {!currentUser.photo &&
              <img src="/images/default-user-photo.png" alt="" />
            }
          </div>
          <div className="user-name">
            Olá, <span className="name">{currentUser.name}</span>
          </div>
          <button className="logout-button" onClick={e => auth.logout()}>Sair</button>
        </div>
      }
    </header>
  );
}

export default withRouter(Header);
