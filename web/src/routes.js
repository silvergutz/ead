import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CoursesPage from './pages/Courses/CoursesPage';
import CoursesShow from './pages/Courses/CoursesShow';

import CoursesList from './pages/Admin/Courses/CoursesList';
import CoursesSave from './pages/Admin/Courses/CoursesSave';
import CoursesEdit from './pages/Admin/Courses/CoursesEdit';

import UsersList from './pages/Admin/Users/UsersList';
import UsersSave from './pages/Admin/Users/UsersSave';

import SchoolsList from './pages/Admin/Schools/SchoolsList';
import SchoolsShow from './pages/Admin/Schools/SchoolsShow';
import SchoolsSave from './pages/Admin/Schools/SchoolsSave';

import CategoriesList from './pages/Admin/Categories/CategoriesList';
import CategoriesSave from './pages/Admin/Categories/CategoriesSave';
import CategoriesShow from './pages/Admin/Categories/CategoriesShow';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/recuperar-senha" component={() => <h1>Recuperar Senha</h1>} />
        <PrivateRoute path="/" exact component={Home} />

        <PrivateRoute path="/perfil" component={Profile} />

        <PrivateRoute path="/cursos" exact component={CoursesPage} />
        <PrivateRoute path="/cursos/:id" exact component={CoursesShow} />

        <PrivateRoute path="/admin/lojas" exact component={SchoolsList} />
        <PrivateRoute path="/admin/lojas/novo" exact component={SchoolsSave} />
        <PrivateRoute path="/admin/lojas/:id" component={SchoolsShow} />

        <PrivateRoute path="/admin/categorias" exact component={CategoriesList} />
        <PrivateRoute path="/admin/categorias/novo" exact component={CategoriesSave} />
        <PrivateRoute path="/admin/categorias/:id" component={CategoriesShow} />

        <PrivateRoute path="/admin/cursos" exact component={CoursesList} />
        <PrivateRoute path="/admin/cursos/novo" exact component={CoursesSave} />
        <PrivateRoute path="/admin/cursos/:id/editar" component={CoursesEdit} />

        <PrivateRoute path="/admin/alunos" exact component={UsersList} />
        <PrivateRoute path="/admin/alunos/novo" exact component={UsersSave} />
        <PrivateRoute path="/admin/alunos/:id/editar" exact component={UsersSave} />

        <Route path="*" component={() => <h1 className="page-title">Página não encontrada</h1>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
