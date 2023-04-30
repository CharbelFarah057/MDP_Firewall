import React, { useCallback, useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';

function ProtectedRoute({ component: Component, ...rest }) {
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch('http://localhost:3001/api/users/refreshToken', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }

      // Call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <Route
      {...rest}
      render={(props) =>
        userContext.token === null ? (
          <Redirect to="/login" />
        ) : userContext.token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default ProtectedRoute;
