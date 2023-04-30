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
          return { ...oldValues, token: data.token, user: data.user };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null, user: null };
        });
      }

      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (userContext.token === null) {
          return <Redirect to="/login" />;
        } else if (userContext.token && userContext.user.firstLogin) {
          return <Component {...props} />
        } else if (userContext.token && !userContext.user.firstLogin) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default ProtectedRoute;
