import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SwapDetailsPage from './containers/SwapDetailsPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/swaps/:id" component={SwapDetailsPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </App>
  );
}
