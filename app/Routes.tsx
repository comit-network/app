import React from 'react';
import { Switch, Route } from 'react-router';
import App from './App';
import SwapsIndexPage from './pages/SwapsIndexPage';
import SwapDetailsPage from './pages/SwapDetailsPage';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/DashboardPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/swaps" component={SwapsIndexPage} />
        <Route exact path="/orders" component={OrdersPage} />
        <Route path="/swaps/:id" component={SwapDetailsPage} />
      </Switch>
    </App>
  );
}
