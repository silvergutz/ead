import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import CoursesList from './pages/Courses/CoursesList';
import CoursesShow from './pages/Courses/CoursesShow';
import UsersList from './pages/Users/UsersList';
import Profile from './pages/Profile';
import SchoolsList from './pages/Schools/SchoolsList';
import SchoolsShow from './pages/Schools/SchoolsShow';
import SchoolsSave from './pages/Schools/SchoolsSave';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/recuperar-senha" component={() => <h1>Recuperar Senha</h1>} />
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/schools" exact component={SchoolsList} />
        <PrivateRoute path="/schools/new" exact component={SchoolsSave} />
        <PrivateRoute path="/schools/:id" component={SchoolsShow} />
        <PrivateRoute path="/cursos" exact component={CoursesList} />
        <PrivateRoute path="/cursos/:id" component={CoursesShow} />
        <PrivateRoute path="/alunos" exact component={UsersList} />
        <PrivateRoute path="/perfil" component={Profile} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
