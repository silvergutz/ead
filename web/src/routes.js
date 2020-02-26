import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';

import CoursesList from './pages/Courses/CoursesList';
import CoursesShow from './pages/Courses/CoursesShow';
import CoursesSave from './pages/Courses/CoursesSave';

import UsersList from './pages/Users/UsersList';
import Profile from './pages/Profile';

import SchoolsList from './pages/Schools/SchoolsList';
import SchoolsShow from './pages/Schools/SchoolsShow';
import SchoolsSave from './pages/Schools/SchoolsSave';

import CategoriesList from './pages/Categories/CategoriesList';
import CategoriesSave from './pages/Categories/CategoriesSave';
import CategoriesShow from './pages/Categories/CategoriesShow';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/recuperar-senha" component={() => <h1>Recuperar Senha</h1>} />
        <PrivateRoute path="/" exact component={Home} />

        <PrivateRoute path="/lojas" exact component={SchoolsList} />
        <PrivateRoute path="/lojas/novo" exact component={SchoolsSave} />
        <PrivateRoute path="/lojas/:id" component={SchoolsShow} />

        <PrivateRoute path="/categorias" exact component={CategoriesList} />
        <PrivateRoute path="/categorias/novo" exact component={CategoriesSave} />
        <PrivateRoute path="/categorias/:id" component={CategoriesShow} />

        <PrivateRoute path="/cursos" exact component={CoursesList} />
        <PrivateRoute path="/cursos/novo" exact component={CoursesSave} />
        <PrivateRoute path="/cursos/:id" component={CoursesShow} />

        <PrivateRoute path="/alunos" exact component={UsersList} />
        <PrivateRoute path="/perfil" component={Profile} />

        <Route path="*" component={() => <h1 className="page-title">Página não encontrada</h1>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
