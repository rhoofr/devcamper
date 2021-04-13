import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated } = useAuthContext();

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
