import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './index.css';

import Login from './LoginPage/Login';
import FirstTimeUserPage from './LoginPage/FirstTimeUserPage';
import NetworkingPage from './Forefront_Interface/Pages/NetworkingPage';
import FirewallPolicyPage from "./Forefront_Interface/Pages/FirewallPolicyPage";
import WebAccessPolicyPage from "./Forefront_Interface/Pages/WebAccessPolicyPage";
import LoggingPage from "./Forefront_Interface/Pages/LoggingPage";
import { UserProvider } from "./UserContext";
import ProtectedRoute from './ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render (
  <UserProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" exact render={() => <Redirect to="/login" />} />
        <ProtectedRoute path="/first-time-user" exact component={FirstTimeUserPage} />
        <ProtectedRoute path="/tmg/firewall-policy/" exact render={() => <Redirect to="/tmg/firewall-policy/all-firewall-policy" />} />
        <ProtectedRoute path="/tmg/firewall-policy/all-firewall-policy" component={FirewallPolicyPage} />
        <ProtectedRoute path="/tmg/web-access-policy" component={WebAccessPolicyPage} />
        <ProtectedRoute path="/tmg/logging" component={LoggingPage} />
        <ProtectedRoute path="/tmg/networking/networks" component={NetworkingPage} />
        <ProtectedRoute path="/tmg/networking/network-sets" component={NetworkingPage} />
        <ProtectedRoute path="/tmg/networking/network-rules" component={NetworkingPage} />
        <ProtectedRoute path="/tmg/networking/network-adapters" component={NetworkingPage} />
        <ProtectedRoute path="/tmg/networking/routing" component={NetworkingPage} />
        <ProtectedRoute path="/tmg" exact render={() => <Redirect to="/tmg/firewall-policy" />} />
      </Switch>
    </BrowserRouter>
  </UserProvider>
);
