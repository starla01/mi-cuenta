import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { Context } from '../../providers/account';

export default function AccountRoute({ component: Component, path }) {
  const { state, actions } = useContext(Context);
  return (
    <Route
      exact
      path={path}
      render={(props) => {
        if (!state.loggedIn && state.__states.fetchCompleted)
          return (window.location.href = '/login');

        return <Component {...{ state, actions, props }} />;
      }}
    />
  );
}
