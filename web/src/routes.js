import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import PageNotFound from './pages/PageNotFound';

import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CoursesShow from './pages/Courses/CoursesShow';

import CoursesList from './components/CoursesList';
import CoursesSave from './pages/Admin/Courses/CoursesSave';
import CoursesEdit from './pages/Admin/Courses/CoursesEdit';

import CommentsList from './pages/Admin/Comments/CommentsList';

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

        <PrivateRoute path="/cursos" exact component={CoursesList} />
        <PrivateRoute path="/cursos/:id" exact component={CoursesShow} />
        <PrivateRoute path="/cursos/:id/aula/:lessonId" exact component={CoursesShow} />

        <PrivateRoute path="/admin/lojas" exact component={SchoolsList} onlyAdmin={true} />
        <PrivateRoute path="/admin/lojas/novo" exact component={SchoolsSave} onlyAdmin={true} />
        <PrivateRoute path="/admin/lojas/:id" component={SchoolsShow} onlyAdmin={true} />

        <PrivateRoute path="/admin/categorias" exact component={CategoriesList} onlyAdmin={true} />
        <PrivateRoute path="/admin/categorias/novo" exact component={CategoriesSave} onlyAdmin={true} />
        <PrivateRoute path="/admin/categorias/:id" component={CategoriesShow} onlyAdmin={true} />

        <PrivateRoute path="/admin/cursos" exact component={CoursesList} onlyAdmin={true} />
        <PrivateRoute path="/admin/cursos/novo" exact component={CoursesSave} onlyAdmin={true} />
        <PrivateRoute path="/admin/cursos/:id/editar" component={CoursesEdit} onlyAdmin={true} />

        <PrivateRoute path="/admin/perguntas" exact component={CommentsList} onlyAdmin={true} />

        <PrivateRoute path="/admin/alunos" exact component={UsersList} onlyAdmin={true} />
        <PrivateRoute path="/admin/alunos/novo" exact component={UsersSave} onlyAdmin={true} />
        <PrivateRoute path="/admin/alunos/:id/editar" exact component={UsersSave} onlyAdmin={true} />

        <Route path="*" component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
