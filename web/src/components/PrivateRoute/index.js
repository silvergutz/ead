import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { auth } from '../../services';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
        const currentUser = auth.currentUserValue;
        if (!currentUser) {
          // not logged in, redirect user to login page
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorized, so return Component
        return <Component {...props} />
      }}
    />
  );
}

export default PrivateRoute;
