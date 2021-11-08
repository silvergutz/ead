import React from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';

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
                  <NavLink to={'/admin/lojas'}>Lojas</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/admin/users'}>Alunos</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/admin/cursos'}>Cursos</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/admin/perguntas'}>Perguntas</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={'/admin/categorias'}>Categorias</NavLink>
                </li>
              </ul>
            </li>
          }
          <li>
            <NavLink to="/cursos">Cursos</NavLink>
          </li>
          <li>
            <NavLink to="/perfil">Meus Dados</NavLink>
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
