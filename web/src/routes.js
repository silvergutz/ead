import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import CoursesList from './pages/Courses/CoursesList';
import CoursesShow from './pages/Courses/CoursesShow';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/cursos" exact component={CoursesList} />
        <PrivateRoute path="/cursos/:id" component={CoursesShow} />
        <PrivateRoute path="/alunos" component={() => <h1>Alunos</h1>} />
        <PrivateRoute path="/perfil" component={() => <h1>Perfil</h1>} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
