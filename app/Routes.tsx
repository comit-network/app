import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import SwapConfirmationPage from './containers/SwapConfirmationPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/counter" component={CounterPage} />
        <Route path="/swap" component={SwapConfirmationPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </App>
  );
}
