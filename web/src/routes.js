import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/login';
import Home from './pages/home';
import CoursesList from './pages/courses';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/courses" component={CoursesList} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
